import * as angular from "angular";
import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsNewHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-new-http-utils-error-service";

export class CommonsIbShortRegisterService {
  constructor(
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
    private $rootScope: CommonsRootScope,
  ) {}

  shortRegisterComplete = (
    memberData: CommonsShortRegisterNamespace.CommonsShortSimpleRegisterModel,
  ): angular.IPromise<any> => {
    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.SHORT_REGISTER;
    this.$rootScope.block = false;
    return new Promise((resolve, reject) => {
      this.CommonsGenericSFProxy.postGeneric(endpoint, memberData).then(
        (data) => {
          resolve(data);
        },
        (error) => {
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  };
}
CommonsIbShortRegisterService.$inject = [
  "CommonsGenericSFProxy",
  "CommonsHttpServicesConstants",
  "CommonsNewHttpUtilsErrorService",
  "$rootScope",
];
try {
  const mod = angular.module("ib-commons-http-service-module");
  mod.service("CommonsIbShortRegisterService", CommonsIbShortRegisterService);
} catch (error) {
  const mod = angular.module("ib-commons-http-service-module", []);
  mod.service("CommonsIbShortRegisterService", CommonsIbShortRegisterService);
}
