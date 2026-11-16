import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericSFProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
])
export class IBCTravelPreferencesService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
  ) {}

  getTravelPreferences = (promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const getTravelPreferencesSuccess = (TravelPreferencesData): void => {
      defer.resolve(TravelPreferencesData);
      defer = null;
      this.counterAttemps = 0;
    };
    const getTravelPreferencesError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getTravelPreferencesCallback,
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
              getTravelPreferencesCallback,
              error,
              defer,
              true,
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

    const getTravelPreferencesCallback = (defer): void => {
      this.counterAttemps++;
      this.getTravelPreferences(defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.TRAVEL_PREFERENCES;
    this.CommonsGenericSFProxy.getGeneric(endpoint).then(
      getTravelPreferencesSuccess,
      getTravelPreferencesError,
    );
    return defer.promise;
  };

  updateTravelPreferences = (
    TravelPreferences,
    promise?: any,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const updateTravelPreferencesSuccess = (TravelPreferencessData): void => {
      defer.resolve(TravelPreferences);
      defer = null;
      this.counterAttemps = 0;
    };
    const updateTravelPreferencesError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              updateTravelPreferencesCallback,
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
              updateTravelPreferencesCallback,
              error,
              defer,
              true,
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

    const updateTravelPreferencesCallback = (defer): void => {
      this.counterAttemps++;
      this.updateTravelPreferences(TravelPreferences, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.TRAVEL_PREFERENCES;
    this.CommonsGenericSFProxy.putGeneric(endpoint, TravelPreferences).then(
      updateTravelPreferencesSuccess,
      updateTravelPreferencesError,
    );

    return defer.promise;
  };
}
