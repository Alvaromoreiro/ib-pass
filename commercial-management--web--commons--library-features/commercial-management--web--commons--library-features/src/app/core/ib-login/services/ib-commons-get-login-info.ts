import * as angular from "angular";
import { CommonsLoginUtilsService } from "./ib-commons-login-access-utils-service";
import { CommonsUtilService } from "../../utils/ib-commons-utils-service";
import { CommonsCookiesService } from "../../utils/storage-utils/ib-commons-cookies.service";
import { CommonsCheckLoginWCSService } from "./ib-commons-check-login-wcs";
import { IbCCustomerDataService } from "../../http-services/cust-cust/ib-customer-data-service";
import { IbCOnBusinessEmployeesService } from "../../http-services/cmlm-mbm-rs/ib-onbusiness-employees-service";
import { IbCOnBusinessMembershipService } from "../../http-services/cmlm-mbm-rs/ib-onbusiness-membership-service";
import { IbCAuthTokenService } from "../../http-services/auth/services/ib-auth-token-service";
import { RedirectionService } from "../../utils/ib-commons-redirection.service";
import { CommonsLoginConstantsType } from "../../constants/ib-commons-login-constants";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";
import { CommonsUserUtilsService } from "../../utils/ib-commons-user-utils.service";
import { CommonsModalService } from "../../ib-modal/services/ib-modal-service";
import type { IbCUserStoreRepositoryService } from "../../services/stores/user-store/ib-commons-user-store-repository.service";

@Service("ib-commons-login-module", [
  "localStorageService",
  "CommonsCheckLoginWCSService",
  "IbCAuthTokenService",
  "CommonsLoginUtilsService",
  "IbCCustomerDataService",
  "$rootScope",
  "$q",
  "CommonsLoginConstants",
  "CommonsConstants",
  "IbCOnBusinessMembershipService",
  "IbCOnBusinessEmployeesService",
  "RedirectionService",
  "$filter",
  "CommonsUtilService",
  "CommonsCookiesService",
  "CommonsModalService",
  "$window",
  "$location",
  "CommonsUserUtilsService",
  "IbCUserStoreRepositoryService",
])
export class CommonsGetLoginInfoService {
  constructor(
    protected localStorageService: ng.local.storage.ILocalStorageService,
    protected CommonsCheckLoginWCSService: CommonsCheckLoginWCSService,
    protected IbCAuthTokenService: IbCAuthTokenService,
    protected CommonsLoginUtilsService: CommonsLoginUtilsService,
    protected IbCCustomerDataService: any,
    protected $rootScope: CommonsRootScope,
    protected $q: ng.IQService,
    protected CommonsLoginConstants: CommonsLoginConstantsType,
    protected CommonsConstants: CommonsConstantsType,
    protected IbCOnBusinessMembershipService: IbCOnBusinessMembershipService,
    protected IbCOnBusinessEmployeesService: IbCOnBusinessEmployeesService,
    protected RedirectionService: RedirectionService,
    protected $filter: ng.IFilterFunction,
    protected CommonsUtilService: CommonsUtilService,
    protected CommonsCookiesService: CommonsCookiesService,
    protected CommonsModalService: CommonsModalService,
    protected $window: ng.IWindowService,
    protected $location: angular.ILocationService,
    protected CommonsUserUtilsService: CommonsUserUtilsService,
    protected userStoreService: IbCUserStoreRepositoryService,
  ) {}

  checkCustomerStatus = (isAnonymous?: boolean): angular.IPromise<any> => {
    const defer = this.$q.defer();
    const ssoInformation =
      this.CommonsCheckLoginWCSService.generateSSOInfo(isAnonymous);
    const ssoONBInfo = this.CommonsCheckLoginWCSService.generateOBLoginInfo();
    this.$rootScope.isLogged = false;
    this.localStorageService.set("userLogged", false);
    const refreshCurrentAuthToken = (isLogged: any): void => {
      const isLoggedCopy = isLogged;
      this.IbCAuthTokenService.refreshUserLoggedToken().then(
        (tokenInformation) => {
          if (this.localStorageService.get("reloadCustomerComplete")) {
            this.userStoreService.updateToPermanentUser(true);
            this.showChangeStatusModal();
          } else {
            checkCustomerStatusSuccess(isLoggedCopy);
          }
        },
        showLoginError,
      );
    };
    const showLoginError = (error: any): void => {
      this.userStoreService.logoutUser();
      error.title =
        this.CommonsConstants.BOOKINGERRORSSERVICE.LOGGED_ERROR_TITLE;
      (error.message = this.CommonsUserUtilsService.isIbPlus()
        ? this.CommonsConstants.BOOKINGERRORSSERVICE.LOGGED_ERROR_BODY
        : this.CommonsConstants.BOOKINGERRORSSERVICE.LOGGED_ERROR_BODY_ZERO),
        (error.needsTranslate = true);
      this.IbCAuthTokenService.getAnonymousToken().finally(() => {
        defer.reject(error);
      });
    };
    const checkCustomerStatusSuccess = (isLogged: any): void => {
      let customerDataCached: any =
        this.localStorageService.get("customerData");
      if (this.$rootScope.loginCustomerData) {
        this.CommonsUtilService.getUserTypeByToken();
        customerDataCached = this.$rootScope.loginCustomerData;
        this.localStorageService.set("customerData", customerDataCached);
        this.$rootScope.customerData = customerDataCached;
        this.$rootScope.loginCustomerData = null;
      }
      if (isLogged === this.CommonsConstants.LOGIN_ONB) {
        this.IbCOnBusinessMembershipService.getOnBusinessMembership().then(
          (data) => {
            if (
              this.CommonsLoginConstants.OB_ROLES_WITH_PERMISSION.indexOf(
                data.userInfo.role.code,
              ) !== -1
            ) {
              this.IbCOnBusinessEmployeesService.getOnBusinessEmployees().then(
                () => {
                  resolveCustomerStatus(null, isLogged);
                },
                (error: any) => {
                  if (error.errorCode === 403) {
                    resolveCustomerStatus(null, isLogged);
                  } else {
                    showLoginError(error);
                  }
                },
              );
            } else {
              resolveCustomerStatus(null, isLogged);
            }
          },
          showLoginError,
        );
      } else if (isLogged) {
        this.CommonsUtilService.getUserTypeByToken();
        if (customerDataCached) {
          resolveCustomerStatus(customerDataCached, isLogged);
        } else {
          this.IbCCustomerDataService.getCustomerData().then((response) => {
            resolveCustomerStatus(response, isLogged);
          }, showLoginError);
        }
      } else {
        this.userStoreService.logoutUser();
        this.IbCAuthTokenService.getAnonymousToken().then(
          resolveCustomerStatus,
          resolveCustomerStatus,
        );
      }
    };
    const resolveCustomerStatus = (response?: any, isLogged?: any): void => {
      const isLoggedLocal = angular.isDefined(isLogged) ? isLogged : false;
      if (
        response &&
        response.generalInfo &&
        response.generalInfo.pinStatus === "2"
      ) {
        this.$rootScope.isLogged = false;
        this.RedirectionService.externalRedirect(
          this.$filter("LinksFilter")("IB_RESET_PASSWORD_LINK"),
        );
      } else if (
        response &&
        response.generalInfo &&
        response.completeProfile === false
      ) {
        this.$rootScope.isLogged = false;
        this.RedirectionService.externalRedirect(
          this.$filter("LinksFilter")("IB_INCOMPLETE_PROFILE"),
        );
      } else if (
        response &&
        response.otherStatuses &&
        !response.otherStatuses.isRedemptionEnabled
      ) {
        const error = {
          message:
            this.CommonsConstants.BOOKINGERRORSSERVICE
              .ERROR_USER_REDEMPTION_ENABLE,
          needsTranslate: true,
        };
        showLoginError(error);
      } else {
        this.$rootScope.isLogged = isLoggedLocal;
        this.localStorageService.set("userLogged", isLoggedLocal);
        defer.resolve(isLoggedLocal);
      }
    };
    if (ssoInformation && ssoInformation.isLogged && !ssoONBInfo.isLogged) {
      const hasSFAccessToken = this.CommonsCookiesService.getCookie(
        this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
      );
      if (ssoInformation.needsRefreshToken || !hasSFAccessToken) {
        this.$rootScope.isLogged = true;
        this.localStorageService.set("userLogged", true);
        refreshCurrentAuthToken(ssoInformation.isLogged);
      } else if (ssoInformation.error) {
        showLoginError(ssoInformation.error);
      } else {
        this.$rootScope.isLogged = true;
        this.localStorageService.set("userLogged", true);
        checkCustomerStatusSuccess(true);
      }
    } else if (ssoONBInfo.isLogged) {
      this.$rootScope.isLogged = this.CommonsConstants.LOGIN_ONB;
      this.localStorageService.set(
        "userLogged",
        this.CommonsConstants.LOGIN_ONB,
      );
      if (ssoONBInfo.needsRefreshToken) {
        this.$rootScope.isLogged = this.CommonsConstants.LOGIN_ONB;
        this.localStorageService.set(
          "userLogged",
          this.CommonsConstants.LOGIN_ONB,
        );
        refreshCurrentAuthToken(this.CommonsConstants.LOGIN_ONB);
      } else if (ssoONBInfo.error) {
        showLoginError(ssoONBInfo.error);
      } else {
        this.$rootScope.isLogged = this.CommonsConstants.LOGIN_ONB;
        this.localStorageService.set(
          "userLogged",
          this.CommonsConstants.LOGIN_ONB,
        );
        checkCustomerStatusSuccess(this.CommonsConstants.LOGIN_ONB);
      }
    } else {
      checkCustomerStatusSuccess(false);
    }
    return defer.promise;
  };

  showChangeStatusModal = () => {
    this.CommonsModalService.showComponentModal(
      "ibChangeStatusUserModalComponent",
      true,
    ).result.then(this.changePageToPermanent, this.changePageToPermanent);
  };

  public changePageToPermanent = (): void => {
    if (this.$rootScope.isRedemptionFlow) {
      this.$window.location.href = this.$location.absUrl().split("#")[0];
    } else {
      this.$window.location.reload();
    }
  };
}
