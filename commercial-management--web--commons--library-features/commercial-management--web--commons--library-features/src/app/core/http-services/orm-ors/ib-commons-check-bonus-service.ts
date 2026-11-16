import * as angular from "angular";
import { CommonsHttpUtilService } from "../../utils/http-utils-services/ib-commons-http-utils-service";
import { CommonsNewHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-new-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { IbCCheckBonusTransformer } from "../../http-services/orm-ors/ib-commons-check-bonus-transformer";
export class IbCCheckBonusService {
  constructor(
    private CommonsHttpUtilService: CommonsHttpUtilService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private IbCCheckBonusTransformer: IbCCheckBonusTransformer,
    private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
  ) {}

  checkBonus = (
    data: IbCheckBonusModel.CheckBonusData,
  ): angular.IPromise<
    | IbCheckBonusModel.BonusTransformerResponse
    | CommonsServiceTypes.CommonsErrorProxyResponse
  > => {
    const url = this.CommonsHttpUtilService.buildServiceEndpoint(
      "orm-ors",
      "CHECK_BONUS",
    );
    return new Promise((resolve, reject) => {
      const processBonusError = (
        error: CommonsErrorsModel.ErrorDataGeneral,
      ): CommonsErrorsModel.CommonsErrorsResponseGeneral => {
        let text = "MY_BONUS_CHECK_BONUS_ERROR_404";
        if (error.errorCode === 409) {
          text = "MY_BONUS_CHECK_BONUS_ERROR_409";
        }
        return {
          errorCode: error.errorCode,
          message: text,
          needsTranslate: true,
          internalErrorCode: "",
        };
      };
      this.CommonsGenericProxy.postGeneric(url, data).then(
        (response) => {
          const result: IbCheckBonusModel.BonusTransformerResponse =
            this.IbCCheckBonusTransformer.transformResponse(
              <IbCheckBonusModel.BonusResponse>response.data,
            );
          resolve(result);
        },
        (error) => {
          switch (error.errorCode) {
            case 404:
            case 409:
              reject(processBonusError(error));
              break;
            default:
              this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
          }
        },
      );
    });
  };
}
IbCCheckBonusService.$inject = [
  "CommonsHttpUtilService",
  "CommonsGenericProxy",
  "IbCCheckBonusTransformer",
  "CommonsNewHttpUtilsErrorService",
];
try {
  const mod = angular.module("ib-commons-http-service-module");
  mod.service("IbCCheckBonusService", IbCCheckBonusService);
} catch (error) {
  const mod = angular.module("ib-commons-http-service-module", []);
  mod.service("IbCCheckBonusService", IbCCheckBonusService);
}
