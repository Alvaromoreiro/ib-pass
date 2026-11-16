import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { DatalayerUtilsService } from "../../ib-datalayer/services/ib-datalayer-utils-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "localStorageService",
  "CommonsConstants",
  "DatalayerUtilsService",
])
export class GetCountriesListService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private CommonsConstants: CommonsConstantsType,
    private DatalayerUtilsService: DatalayerUtilsService,
  ) {}

  getCountriesList = (
    promise?: any,
    isLoggedflow?: boolean,
    existAPIS?: boolean,
  ): angular.IPromise<any> | Promise<any> => {
    let defer = this.$q.defer();
    const countriesList = this.localStorageService.get("countriesList");
    const flowApp = this.localStorageService.get("flowApp");
    const isLogFlow = isLoggedflow;
    const existAPIs = existAPIS;

    const getCountryListSuccess = (countriesData): void => {
      this.localStorageService.set("countriesList", countriesData.data);
      defer.resolve(countriesData.data);
      defer = null;
      this.counterAttemps = 0;
    };
    const getCountryListError = (error): void => {
      if (flowApp === this.CommonsConstants.APP_TYPES.CHECKIN) {
        this.DatalayerUtilsService.sendDatalayerErrorEvent(error);
      }

      switch (error.errorCode) {
        case 408:
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getCustomerDataCallback,
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
              getCustomerDataCallback,
              error,
              defer,
              isLogFlow,
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

    const getCustomerDataCallback = (defer): void => {
      this.counterAttemps++;
      this.getCountriesList(defer, isLogFlow, existAPIs);
    };

    if (countriesList === null) {
      const endpoint =
        existAPIs !== undefined && existAPIs !== null && existAPIs
          ? this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS
              .countryListAPIsURI
          : this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.countryListURI;
      const config: any = {
        headers: {
          "Cache-Control": "private, max-age=600",
        },
      };
      this.CommonsGenericProxy.getGeneric(endpoint, null, null, config).then(
        getCountryListSuccess,
        getCountryListError,
      );
    } else {
      defer.resolve(countriesList);
    }
    return defer.promise;
  };
}
