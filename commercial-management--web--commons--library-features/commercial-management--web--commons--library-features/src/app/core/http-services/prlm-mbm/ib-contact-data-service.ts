import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericSFProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
])
export class IBCContactDataService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
  ) {}

  getContactData = (promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const getContactDataSuccess = (contactData): void => {
      defer.resolve(contactData);
      defer = null;
      this.counterAttemps = 0;
    };
    const getContactDataError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getContactDataCallback,
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
              getContactDataCallback,
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

    const getContactDataCallback = (defer): void => {
      this.counterAttemps++;
      this.getContactData(defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.IB_CONTACT_DETAILS;
    this.CommonsGenericSFProxy.getGeneric(endpoint).then(
      getContactDataSuccess,
      getContactDataError,
    );
    return defer.promise;
  };

  updateContactData = (
    updateContactData,
    promise?: any,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const updateContactDataSuccess = (contactData): void => {
      defer.resolve(contactData);
      defer = null;
      this.counterAttemps = 0;
    };
    const updateContactDataError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              updateContactDataCallback,
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
              updateContactDataCallback,
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

    const updateContactDataCallback = (defer): void => {
      this.counterAttemps++;
      this.updateContactData(updateContactData, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.IB_CONTACT_DETAILS;
    this.CommonsGenericSFProxy.putGeneric(endpoint, updateContactData).then(
      updateContactDataSuccess,
      updateContactDataError,
    );

    return defer.promise;
  };
}
