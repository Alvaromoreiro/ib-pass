import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericSFProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
])
export class IBCAlternativeContactDataService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
  ) {}

  getAlternativeContactData = (promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const getAlternativeContactDataSuccess = (alternativeContactData): void => {
      defer.resolve(alternativeContactData);
      defer = null;
      this.counterAttemps = 0;
    };
    const getAlternativeContactDataError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getAlternativeContactDataCallback,
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
              getAlternativeContactDataCallback,
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

    const getAlternativeContactDataCallback = (defer): void => {
      this.counterAttemps++;
      this.getAlternativeContactData(defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
        .IB_ALTERNATIVE_CONTACT;
    this.CommonsGenericSFProxy.getGeneric(endpoint).then(
      getAlternativeContactDataSuccess,
      getAlternativeContactDataError,
    );
    return defer.promise;
  };

  updateAlternativeContactData = (
    updatealternativeContactData,
    promise?: any,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const updateAlternativeContactDataSuccess = (
      alternativeContactData,
    ): void => {
      defer.resolve(alternativeContactData);
      defer = null;
      this.counterAttemps = 0;
    };
    const updateAlternativeContactDataError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              updateAlternativeContactDataCallback,
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
              updateAlternativeContactDataCallback,
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

    const updateAlternativeContactDataCallback = (defer): void => {
      this.counterAttemps++;
      this.updateAlternativeContactData(updatealternativeContactData, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
        .IB_ALTERNATIVE_CONTACT;
    this.CommonsGenericSFProxy.putGeneric(
      endpoint,
      updatealternativeContactData,
    ).then(
      updateAlternativeContactDataSuccess,
      updateAlternativeContactDataError,
    );

    return defer.promise;
  };
}
