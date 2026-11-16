import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericSFProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
])
export class IBCPersonalDataService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
  ) {}

  getPersonalData = (promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const getPersonalDataSuccess = (personalData): void => {
      defer.resolve(personalData);
      defer = null;
      this.counterAttemps = 0;
    };
    const getPersonalDataError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getPersonalDataCallback,
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
              getPersonalDataCallback,
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

    const getPersonalDataCallback = (defer): void => {
      this.counterAttemps++;
      this.getPersonalData(defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
        .PERSONAL_DATA_IB_PLUS;
    this.CommonsGenericSFProxy.getGeneric(endpoint).then(
      getPersonalDataSuccess,
      getPersonalDataError,
    );
    return defer.promise;
  };

  updatePersonalData = (
    updatePersonalData,
    promise?: any,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const updatePersonalDataSuccess = (personalData): void => {
      defer.resolve(personalData);
      defer = null;
      this.counterAttemps = 0;
    };
    const updatePersonalDataError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              updatePersonalDataCallback,
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
              updatePersonalDataCallback,
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

    const updatePersonalDataCallback = (defer): void => {
      this.counterAttemps++;
      this.updatePersonalData(updatePersonalData, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
        .PERSONAL_DATA_IB_PLUS;
    this.CommonsGenericSFProxy.putGeneric(endpoint, updatePersonalData).then(
      updatePersonalDataSuccess,
      updatePersonalDataError,
    );

    return defer.promise;
  };
}
