import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "localStorageService",
  "$rootScope",
])
export class GetDestinationsService {
  private counterAttemps = 0;
  private localeString: string;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
  ) {
    this.localeString = `${this.$rootScope.appLang.toLowerCase()}-${this.$rootScope.appMarket.toUpperCase()}`;
  }

  getDestinationAreasCitiesList = (
    areas: boolean = false,
  ): ng.IPromise<any> => {
    let defer = this.$q.defer();
    const destinationCities = this.localStorageService.get<AreasStorage>(
      "destinationAreasCitiesListCommons",
    );
    const getDestinationAreasCitiesListSuccess = (resp): void => {
      this.localStorageService.set<AreasStorage>(
        "destinationAreasCitiesListCommons",
        { data: resp.data, locale: this.localeString },
      );
      // Keep legacy variable for compatibility
      this.localStorageService.set("destinationAreasCitiesList", resp.data);
      defer.resolve(resp.data);
      defer = null;
      this.counterAttemps = 0;
    };
    const getDestinationAreasCitiesListError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getCustomerDataCallback,
              error,
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
    const getCustomerDataCallback = (): void => {
      this.counterAttemps++;
      this.getDestinationAreasCitiesList();
    };

    if (destinationCities?.locale !== this.localeString) {
      const endpoint = areas
        ? this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.AREAS
        : this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS
            .destinationAreasCitiesListServiceURI;
      const config: any = {
        headers: {
          "Cache-Control": "private, max-age=600",
        },
      };
      this.CommonsGenericProxy.getGeneric(endpoint, null, null, config).then(
        getDestinationAreasCitiesListSuccess,
        getDestinationAreasCitiesListError,
      );
    } else {
      defer.resolve(destinationCities.data);
    }

    return defer.promise;
  };
}
