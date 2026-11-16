import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { DatalayerUtilsService } from "../../ib-datalayer/services/ib-datalayer-utils-service";
import { CurrencyService } from "../../utils/ib-commons-currency-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { IbOnBusinessMembershipResponse } from "../../models/http-services/cmlm-mbm/ib-commons-on-business-membership.model";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsHttpServicesConstants",
  "CommonsGenericProxy",
  "$rootScope",
  "localStorageService",
  "CurrencyService",
  "DatalayerUtilsService",
  "CommonsHttpUtilsErrorService",
])
export class IbCOnBusinessMembershipService {
  private counterAttemps = 0;
  constructor(
    private $q: ng.IQService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsGenericProxy: CommonsGenericProxy,
    private $rootScope: CommonsRootScope,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private CurrencyService: CurrencyService,
    private DatalayerUtilsService: DatalayerUtilsService,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
  ) {}

  getOnBusinessMembership = (
    promise?: ng.IDeferred<any>,
  ): ng.IPromise<IbOnBusinessMembershipResponse> => {
    let defer = promise || this.$q.defer();
    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS
        .onBusinessMembershipURI;

    const getOnBusinessMembershipSuccess = (data): void => {
      const commercialData: any =
        this.localStorageService.get("commercialData");
      const infoData = data.data;
      this.$rootScope.membershipData = infoData;
      infoData.pointsTransformed =
        commercialData &&
        commercialData.currency &&
        commercialData.currency.groupingSeparator
          ? this.CurrencyService.formatAvios(
              commercialData.currency.groupingSeparator,
              infoData.memberBalance,
            )
          : infoData.memberBalance;
      this.localStorageService.set("membershipData", infoData);
      /* INIT DELETE GA4 MIGRATION*/
      this.DatalayerUtilsService.updateLoggedDatalayer(infoData.userInfo);
      /* FINISH DELETE GA4 MIGRATION*/
      this.DatalayerUtilsService.updateLoggedDigitalData(infoData.userInfo);
      defer.resolve(infoData);
      defer = null;
    };
    const getOnBusinessMembershipError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getOnBusinessMembershipCallback,
              error,
              defer,
            ),
            { defer: defer },
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttemps,
              getOnBusinessMembershipCallback,
              error,
              defer,
            ),
            { defer: defer },
          );
          break;
        default:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.processGeneralError(error),
            { defer: defer },
          );
      }
    };

    const getOnBusinessMembershipCallback = (defer): void => {
      this.counterAttemps++;
      this.getOnBusinessMembership(defer);
    };

    this.CommonsGenericProxy.getGeneric(endpoint).then(
      getOnBusinessMembershipSuccess,
      getOnBusinessMembershipError,
    );

    return defer.promise;
  };
}
