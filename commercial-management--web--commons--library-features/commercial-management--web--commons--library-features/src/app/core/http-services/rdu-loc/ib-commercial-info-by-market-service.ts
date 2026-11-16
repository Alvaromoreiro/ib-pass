import { CommonsNewHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-new-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsCommercialSellingDataUtils } from "../../utils/ib-commons-commercial-selling-data-utils";

@Service("ib-commons-http-service-module", [
  "CommonsGenericProxy",
  "CommonsCommercialSellingDataUtils",
  "CommonsHttpServicesConstants",
  "CommonsNewHttpUtilsErrorService",
  "localStorageService",
])
export class CommonsCommercialInfobyMarketService {
  constructor(
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsCommercialSellingDataUtils: CommonsCommercialSellingDataUtils,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {}

  getCommercialInfo = async (): Promise<CommonsCommercialData> => {
    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.COMMERCIAL_SELLING;

    return new Promise((resolve, reject) => {
      this.CommonsGenericProxy.getGeneric(endpoint)
        .then(
          (
            commercialData: CommonsServiceTypes.CommonsProxyResponse<CommonsCommercialData>,
          ): void => {
            this.localStorageService.set(
              "commercialData",
              this.CommonsCommercialSellingDataUtils.getCommercialsellingDataByMarket(
                commercialData.data,
              ),
            );
            resolve(commercialData.data);
          },
        )
        .catch((error): void => {
          this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
        });
    });
  };
}
