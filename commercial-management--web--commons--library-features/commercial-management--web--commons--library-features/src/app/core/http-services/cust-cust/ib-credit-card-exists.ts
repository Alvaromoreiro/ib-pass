import * as angular from "angular";
import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsNewHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-new-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

export class IbCreditCardExistsService {
  constructor(
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
  ) {}

  getCreditCardsNumber = () => {
    const endpoint = `${this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.CREDITCARD_EXISTS}`;

    return new Promise(
      (
        resolve: (
          data: IbCreditCardExistsServiceModel.IbCreditCardExistsData,
        ) => void,
        reject,
      ) => {
        this.CommonsGenericSFProxy.getGeneric(endpoint).then(
          (data) => {
            resolve(
              <IbCreditCardExistsServiceModel.IbCreditCardExistsData>data.data,
            );
          },
          (error) => {
            this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
          },
        );
      },
    );
  };
}
IbCreditCardExistsService.$inject = [
  "CommonsGenericSFProxy",
  "CommonsHttpServicesConstants",
  "CommonsNewHttpUtilsErrorService",
];
try {
  const mod = angular.module("ib-commons-http-service-module");
  mod.service("IbCreditCardExistsService", IbCreditCardExistsService);
} catch (error) {
  const mod = angular.module("ib-commons-http-service-module", []);
  mod.service("IbCreditCardExistsService", IbCreditCardExistsService);
}
