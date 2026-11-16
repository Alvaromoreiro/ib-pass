import type { IbCAuthService } from "ib-web-commons/http-services";
import * as angular from "angular";
import { IbCommonsNewHttpUtilService } from "../utils/http-utils-services/ib-commons-new-http-utils-service";
import { CommonsCookiesService } from "../utils/storage-utils/ib-commons-cookies.service";
import { CommonsLoginConstantsType } from "../constants/ib-commons-login-constants";
import { CommonsConstantsType } from "../constants/ib-commons-constants";
import { CommonsUserUtilsService } from "../utils/ib-commons-user-utils.service";
import { CommonsHttpServicesConstantsType } from "../constants/ib-commons-http-service-constants";
import type { IbCUserStoreRepositoryService } from "../services/stores/user-store/ib-commons-user-store-repository.service";
import {
  filter,
  firstValueFrom,
  lastValueFrom,
  take,
  tap,
  timeout,
} from "rxjs";
import { RedirectionService } from "../utils/ib-commons-redirection.service";

export class IbHttpInterceptor {
  public COOKIES = this.CommonsHttpServicesConstants.COOKIES;

  constructor(
    protected $rootScope: CommonsRootScope,
    protected $window: ng.IWindowService,
    protected localStorageService: ng.local.storage.ILocalStorageService,
    protected deviceDetector,
    protected IbCommonsNewHttpUtilService: IbCommonsNewHttpUtilService,
    protected $injector,
    protected $filter: angular.IFilterService,
    protected $location: angular.ILocationService,
    protected CommonsConstants: CommonsConstantsType,
    protected CommonsCookiesService: CommonsCookiesService,
    protected CommonsLoginConstants: CommonsLoginConstantsType,
    protected CommonsUserUtilsService: CommonsUserUtilsService,
    protected $cookies: angular.cookies.ICookiesService,
    protected CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    protected IbCUserStoreRepositoryService: IbCUserStoreRepositoryService,
    protected RedirectionService: RedirectionService,
  ) {}

  /**
   * Returns the value for the html metatag given.
   * @param {string} metaTagName - The metatag name for get the value
   * @returns {string} - The metatag value for the given metaTagName
   */
  private getMetaTagValueByName = (metaTagName: string) => {
    let value = "";
    if (
      metaTagName &&
      typeof metaTagName === "string" &&
      this.$window.document.getElementsByName(metaTagName).length > 0
    ) {
      value = (<HTMLMetaElement>(
        this.$window.document.getElementsByName(metaTagName)[0]
      )).content;
    }
    return value;
  };

  /**
   * Returns the current Authorization token
   * @returns {string} - The curren user Authorization token from browser Session Storage. If the current user is logged, it returns the logged token,
   * else it returns the anonymous token
   */
  private getAuthToken = () => {
    const userLogged: boolean | string =
      this.localStorageService.get("userLogged");
    if (userLogged === this.CommonsConstants.LOGIN_ONB) {
      return this.CommonsCookiesService.get(
        this.CommonsLoginConstants.SSO_COOKIES.ONB_LOGGED_TOKEN,
      );
    } else if (userLogged) {
      return this.CommonsCookiesService.get(
        this.CommonsLoginConstants.SSO_COOKIES.LOGGED_TOKEN,
      );
    }
    return this.localStorageService.get("anonymousToken");
  };

  private getSalesforceToken() {
    return this.CommonsCookiesService.get(
      this.CommonsLoginConstants.SSO_COOKIES.SF_LOGGED_TOKEN,
    );
  }

  private processGeneralMessageError = (reason: string): string => {
    let message = "";
    switch (reason) {
      case this.CommonsConstants.BOOKINGERRORSSERVICE.JSON_MAPPING_EXCEPTION:
        message =
          this.CommonsConstants.BOOKINGERRORSSERVICE.JSON_MAPPING_EXCEPTION;
        break;
      case this.CommonsConstants.BOOKINGERRORSSERVICE
        .UNEXPECTED_TECHNICAL_EXCEPTION:
        message =
          this.CommonsConstants.BOOKINGERRORSSERVICE
            .UNEXPECTED_TECHNICAL_EXCEPTION;
        break;
      case this.CommonsConstants.BOOKINGERRORSSERVICE.FARE_NOT_FOUND:
        message = this.CommonsConstants.BOOKINGERRORSSERVICE.FARE_NOT_FOUND;
        break;
      case this.CommonsConstants.BOOKINGERRORSSERVICE.PAC_UTILS_E0001:
        message =
          this.CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR;
        break;
      default:
        message = reason;
    }
    return message;
  };

  private processGeneralError = (
    error: CommonsErrorsModel.ErrorDataGeneral,
  ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
    const processedResponse: CommonsErrorsModel.CommonsErrorsResponseGeneral = {
      errorCode: error.errorCode,
      message: "",
      needsTranslate: false,
      internalErrorCode: "",
      config: error.config,
    };
    const hasReason =
      error.data && error.data.errors && error.data.errors.length > 0;
    processedResponse.message = hasReason
      ? this.processGeneralMessageError(error.data.errors[0].reason)
      : this.CommonsConstants.BOOKINGERRORSSERVICE.SERVICEGENERALERROR;
    processedResponse.needsTranslate =
      !hasReason ||
      (hasReason && processedResponse.message !== error.data.errors[0].reason);
    processedResponse.internalErrorCode = hasReason
      ? error.data.errors[0].code
      : "";
    return processedResponse;
  };

  private updateStateToAnonymousRedirection = () => {
    this.IbCUserStoreRepositoryService.logoutUser();
    return lastValueFrom(
      this.IbCUserStoreRepositoryService.getUserState().pipe(
        filter((res) => !res.isLoading),
        take(1),
      ),
    );
  };
  /**
   * Adds to the http request object the next custom headers with default values if they does not yet exist:
   * <ul>
   *      <li>'Accept' - 'application/json'</li>
   *      <li>'Content-Type' - 'application/json'</li>
   *      <li>'Accept-Language' - '<language>-<market>'</li>
   *      <li>'Authorization' - 'Bearer <User Authorization Token>'</li>
   *      <li>'X-Request-AppVersion' - '<Current Booking App Version>'</li>
   *      <li>'X-Request-OsVersion' - '<device OS>|<device OS version>'</li>
   *      <li>''X-Request-Device' - '<device Type>|<browser>|<browser version>'</li>
   * </ul>
   * @param {object} config - the htto request objecto to modify its configuration
   * @returns {object} - The config http request object modified with the custom headers
   */
  request = (config) => {
    if (!config.headers.newConfig) {
      if (
        config.url.indexOf("recoglobick.com/token") == -1 &&
        config.url.indexOf("ancillaries.cloud.iberia.com/api") == -1
      ) {
        config.headers.Accept = config.headers.Accept || "application/json";
        if (config.headers["Content-Type"] === "POST_IMG") {
          config.headers["Content-Type"] = undefined;
        } else {
          config.headers["Content-Type"] =
            config.headers["Content-Type"] || "application/json";
        }
        config.headers["Accept-Language"] =
          config.headers["Accept-Language"] ||
          this.$rootScope.appLang + "-" + this.$rootScope.appMarket;
        config.url.indexOf("iberia-web-content") === 1
          ? delete config.headers.Authorization
          : (config.headers.Authorization =
              config.headers.Authorization || "Bearer " + this.getAuthToken());
        config.headers["X-Request-AppVersion"] =
          config.headers["X-Request-AppVersion"] ||
          this.getMetaTagValueByName("version");
        config.headers["X-Request-OsVersion"] =
          config.headers["X-Request-OsVersion"] ||
          this.deviceDetector.os + "|" + this.deviceDetector.os_version;
        config.headers["X-Request-Device"] =
          config.headers["X-Request-Device"] ||
          this.deviceDetector.device +
            "|" +
            this.deviceDetector.browser +
            "|" +
            this.deviceDetector.browser_version;
        config.headers["X-Observations-Origin-Page"] =
          this.localStorageService.get("previousStepFlow");
        config.headers["X-Observations-Current-Page"] =
          this.localStorageService.get("actualStepFlow");
        config.headers["X-Salesforce-Token"] =
          config.headers["X-Salesforce-Token"] || undefined;
        config.headers["Cache-Control"] = config.url.includes(
          "/iberia-web-content/",
        )
          ? "private, max-age: 600"
          : config.headers["Cache-Control"] || "no-cache";
        if (config.method !== "GET")
          config.headers.Pragma = config.headers.Pragma || "no-cache";
      } else if (config.url.indexOf("ancillaries.cloud.iberia.com/api") != -1) {
        config.headers["Accept-Language"] =
          config.headers["Accept-Language"] ||
          this.$rootScope.appLang + "-" + this.$rootScope.appMarket;
        config.url.indexOf("iberia-web-content") === 1
          ? delete config.headers.Authorization
          : (config.headers.Authorization =
              config.headers.Authorization || "Bearer " + this.getAuthToken());
      }
    } else {
      delete config.headers.newConfig;
    }

    return config;
  };

  responseError = (response) => {
    return new Promise((resolve, reject) => {
      const code = response.status;

      if (code === -1) {
        const modalObject = {
          errorCode: -1,
          data: null,
          config: response.config,
        };
        reject(this.processGeneralError(modalObject));
      } else if (code === 401 || code === 403) {
        response.config.headers.try = response.config.headers?.try
          ? response.config.headers.try + 1
          : 1;
        if (
          response.config.url?.includes("openid-connect/token") ||
          response.config.url?.includes("oauth2/token")
        ) {
          reject(
            this.processGeneralError({
              errorCode: -1,
              data: null,
              config: response.config,
            }),
          );
        } else if (response.config.headers.try <= 3) {
          this.IbCommonsNewHttpUtilService.refreshToken(this.$injector)
            .then(() => {
              response.config.headers.Authorization =
                "Bearer " + this.getAuthToken();
              response.config.headers["X-Salesforce-Token"] =
                this.getSalesforceToken();
              this.$injector
                .get("$http")(response.config)
                .then((resp) => {
                  resolve(resp);
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              const id = this.getMetaTagValueByName("fAppD");
              const block = this.getMetaTagValueByName("fAppDFlw");
              switch (id) {
                case "IB_PLUS":
                  if (
                    block ||
                    this.localStorageService.get("reloadCustomerComplete")
                  ) {
                    this.updateStateToAnonymousRedirection().then(() => {
                      this.RedirectionService.redirectToLoginPage(
                        this.$location.absUrl(),
                      );
                    });
                  } else {
                    reject(this.processGeneralError(error));
                  }
                  break;
                default:
                  if (this.localStorageService.get("reloadCustomerComplete")) {
                    this.IbCUserStoreRepositoryService.updateToPermanentUser(
                      true,
                    );
                    this.showPermanentModal();
                  } else {
                    reject(this.processGeneralError(error));
                  }
                  break;
              }
            });
        } else if (response.config.headers.try <= 4) {
          const modalObject = {
            errorCode: -1,
            data: null,
            config: response.config,
          };
          this.updateStateToAnonymousRedirection()
            .then(() => {
              const id = this.getMetaTagValueByName("fAppD");
              if (id === "IB_PLUS") {
                this.RedirectionService.redirectToLoginPage(
                  this.$location.absUrl(),
                );
              }
              return this.IbCommonsNewHttpUtilService.refreshToken(
                this.$injector,
              );
            })
            .then(() => {
              response.config.headers.Authorization =
                "Bearer " + this.getAuthToken();
              response.config.headers["X-Salesforce-Token"] =
                this.getSalesforceToken();
              this.$injector
                .get("$http")(response.config)
                .then((resp) => {
                  resolve(resp);
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch(() => {
              reject(this.processGeneralError(modalObject));
            });
        } else {
          reject(
            this.processGeneralError({
              errorCode: -1,
              data: null,
              config: response.config,
            }),
          );
        }
      } else if (
        code === 408 ||
        code === 504 ||
        (code === 503 &&
          response.data?.errors?.[0]?.code ===
            this.CommonsConstants.INTERNAL_ERROR_CODE.MEMBERS_SERVICE_ERROR)
      ) {
        response.config.headers.try = response.config.headers?.try
          ? response.config.headers.try + 1
          : 1;
        if (response.config.headers?.try <= 3) {
          this.$injector
            .get("$http")(response.config)
            .then(
              (resp) => {
                resolve(resp);
              },
              (resp) => {
                reject(resp);
              },
            );
        } else {
          const modalObject = {
            errorCode: -1,
            data: null,
            config: response.config,
          };
          reject(this.processGeneralError(modalObject));
        }
      } else {
        reject(response);
      }
    });
  };

  showPermanentModal = (): void => {
    this.$injector
      .get("CommonsModalService")
      .showComponentModal("ibChangeStatusUserModalComponent", true)
      .result.then(this.changePageToPermanent, this.changePageToPermanent);
  };

  public changePageToPermanent = (): void => {
    if (this.$rootScope.isRedemptionFlow) {
      this.$window.location.href = this.$location.absUrl().split("#")[0];
    } else {
      this.$window.location.reload();
    }
  };

  public checkCustomerStatus = (): void => {
    this.$injector
      .get("IbCCustomerDataService")
      .getCustomerData()
      .then(() => {
        this.localStorageService.set("reloadCustomerComplete", false);
      });
  };
}
IbHttpInterceptor.$inject = [
  "$rootScope",
  "$window",
  "localStorageService",
  "deviceDetector",
  "IbCommonsNewHttpUtilService",
  "$injector",
  "$filter",
  "$location",
  "CommonsConstants",
  "CommonsCookiesService",
  "CommonsLoginConstants",
  "CommonsUserUtilsService",
  "$cookies",
  "CommonsHttpServicesConstants",
  "IbCUserStoreRepositoryService",
  "RedirectionService",
];
angular
  .module("ib-interceptors-module", [])
  .service("IbHttpInterceptor", IbHttpInterceptor);
