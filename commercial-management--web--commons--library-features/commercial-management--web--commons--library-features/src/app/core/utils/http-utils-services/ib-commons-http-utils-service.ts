import { CommonsUtilService } from "../ib-commons-utils-service";
import { IbCAuthTokenService } from "../../http-services/auth/services/ib-auth-token-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { RedirectionService } from "../ib-commons-redirection.service";
import { CommonsModalService } from "../../ib-modal/services/ib-modal-service";

@Service(
  "ib-commons-utils-module",
  [
    "IbCAuthTokenService",
    "$q",
    "CommonsUtilService",
    "localStorageService",
    "RedirectionService",
    "CommonsHttpServicesConstants",
    "$rootScope",
    "$filter",
    "$location",
    "CommonsModalService",
    "$window",
  ],
  [],
)
export class CommonsHttpUtilService {
  constructor(
    private IbCAuthTokenService: IbCAuthTokenService,
    private $q: ng.IQService,
    private CommonsUtilService: CommonsUtilService,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private RedirectionService: RedirectionService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private $rootScope: CommonsRootScope,
    private $filter: angular.IFilterService,
    private $location: ng.ILocationService,
    private CommonsModalService: CommonsModalService,
    private $window: ng.IWindowService,
  ) {}

  private showChangeStatusModal = () => {
    this.CommonsModalService.showComponentModal(
      "ibChangeStatusUserModalComponent",
      true,
    ).result.then(this.changePageToPermanent, this.changePageToPermanent);
  };

  private changePageToPermanent = (): void => {
    if (this.$rootScope.isRedemptionFlow) {
      this.$window.location.href = this.$location.absUrl().split("#")[0];
    } else {
      this.$window.location.reload();
    }
  };

  refreshToken = () => {
    const defer = this.$q.defer();
    const success = () => {
      if (this.localStorageService.get("reloadCustomerComplete")) {
        this.showChangeStatusModal();
      } else {
        defer.resolve();
      }
    };
    const userLogged = this.localStorageService.get("userLogged");
    if (
      userLogged ||
      userLogged === this.CommonsHttpServicesConstants.LOGIN_ONB
    ) {
      this.IbCAuthTokenService.refreshUserLoggedToken().then(success, success);
    } else {
      if (!this.$rootScope.isRedemptionFlow) {
        this.IbCAuthTokenService.getAnonymousToken().then(success, success);
      } else {
        this.RedirectionService.externalRedirect(
          `${this.$filter<any>("LinksFilter")("IBERIA_NEW_LOGIN")}?${
            this.CommonsHttpServicesConstants.REFERRAL_URL_PARAM
          }=${encodeURIComponent(this.$location.absUrl())}`,
        );
      }
    }
    return defer.promise;
  };

  /**
   * Builds the final endpoint services usign the response of Endpoints service or the default endpoint
   * @param {String} domain the http service domain to build ( Ej: 'rdu-loc')
   * @param {String} endpointAttribute the endpoint constatn attribute. (Ej: 'DESTINATION')
   * @returns {String} a final url for the http service.
   */
  buildServiceEndpoint = (domain, endpointAttribute) => {
    const serviceBaseEnpoint = this.CommonsUtilService.getEndpoint(
      domain + "-rs",
    );
    return serviceBaseEnpoint
      ? serviceBaseEnpoint +
          this.CommonsHttpServicesConstants[endpointAttribute]
      : this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS[endpointAttribute];
  };
  setPromiseTimeOut = (
    promise,
    timeMAX: number,
    error = "TIMEOUT_ERROR",
  ): Promise<any> => {
    let timePromise = new Promise((resolve, reject) => {
      setTimeout(reject, timeMAX, error);
    });
    return Promise.race([promise, timePromise]);
  };
}
