import * as angular from "angular";
import { CommonsNewHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-new-http-utils-error-service";
import { NewsletterPut } from "../../models/http-services/cust-cust/ib-newsletter-model";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";

export class IbCNewsletterService {
  constructor(
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
  ) {}

  putNewsletter = async (
    info: NewsletterPut,
    silentError: boolean = false,
  ): Promise<unknown> => {
    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.newsletterServiceURI;
    return new Promise((resolve, reject) => {
      this.CommonsGenericProxy.putGeneric(endpoint, info).then(
        (response: CommonsServiceTypes.CommonsProxyResponse<void>) => {
          resolve(response.data);
        },
        (
          error: CommonsServiceTypes.CommonsErrorProxyResponse<CommonsErrorsModel.ErrorResponseSF>,
        ) => {
          error.errorCode === 412 && silentError
            ? reject(error.data)
            : this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        },
      );
    });
  };
}
IbCNewsletterService.$inject = [
  "CommonsGenericProxy",
  "CommonsHttpServicesConstants",
  "CommonsNewHttpUtilsErrorService",
];
try {
  const mod = angular.module("ib-commons-http-service-module");
  mod.service("IbCNewsletterService", IbCNewsletterService);
} catch (error) {
  const mod = angular.module("ib-commons-http-service-module", []);
  mod.service("IbCNewsletterService", IbCNewsletterService);
}
