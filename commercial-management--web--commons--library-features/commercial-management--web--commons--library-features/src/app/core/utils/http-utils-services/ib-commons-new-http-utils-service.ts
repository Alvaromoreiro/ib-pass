import * as angular from "angular";
import { IbCAuthNewTokenService } from "../../http-services/auth/services/ib-auth-new-token-service";
import { RedirectionService } from "../ib-commons-redirection.service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

export class IbCommonsNewHttpUtilService {
  constructor(
    private IbCAuthNewTokenService: IbCAuthNewTokenService,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private RedirectionService: RedirectionService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private $rootScope: CommonsRootScope,
    private $filter: angular.IFilterService,
    private $location: ng.ILocationService,
  ) {}

  refreshToken = (injector) => {
    const userLogged = this.localStorageService.get("userLogged");
    return new Promise((resolve, reject) => {
      if (
        userLogged ||
        userLogged === this.CommonsHttpServicesConstants.LOGIN_ONB
      ) {
        this.IbCAuthNewTokenService.refreshUserLoggedToken(injector).then(
          () => {
            resolve(null);
          },
          (error) => {
            reject(error);
          },
        );
      } else {
        if (this.$rootScope.isRedemptionFlow) {
          this.RedirectionService.externalRedirect(
            `${this.$filter<any>("LinksFilter")("IBERIA_NEW_LOGIN")}?${
              this.CommonsHttpServicesConstants.REFERRAL_URL_PARAM
            }=${encodeURIComponent(this.$location.absUrl())}`,
          );
        } else {
          this.IbCAuthNewTokenService.getAnonymousToken(injector).then(
            () => {
              resolve(null);
            },
            (error) => {
              reject(error);
            },
          );
        }
      }
    });
  };

  /**
   * Builds the final endpoint services usign the response of Endpoints service or the default endpoint
   * @param {String} endpointAttribute the endpoint constatn attribute. (Ej: 'DESTINATION')
   * @returns {String} a final url for the http service.
   */
  buildServiceEndpoint = (endpointAttribute) => {
    return this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS[
      endpointAttribute
    ];
  };
}
IbCommonsNewHttpUtilService.$inject = [
  "IbCAuthNewTokenService",
  "localStorageService",
  "RedirectionService",
  "CommonsHttpServicesConstants",
  "$rootScope",
  "$filter",
  "$location",
];
try {
  const mod = angular.module("ib-commons-utils-module");
  mod.service("IbCommonsNewHttpUtilService", IbCommonsNewHttpUtilService);
} catch (error) {
  const mod = angular.module("ib-commons-utils-module", []);
  mod.service("IbCommonsNewHttpUtilService", IbCommonsNewHttpUtilService);
}
