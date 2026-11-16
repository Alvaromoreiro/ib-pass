import { CommonsGenericSFProxy } from "../../proxies/ib-commons-SF-generic-proxy";
import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericSFProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
])
// @deprecated Use IBCContactDetailsZeroService instead
export class IBCContactDetailsService {
  // @TODO See if this service is used and change for IBCContactDetailsZeroService
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericSFProxy: CommonsGenericSFProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
  ) {}

  // @deprecated Use IBCContactDetailsZeroService instead
  getContactDetailsData = (promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const getContactDetailsDataSuccess = (personalData): void => {
      defer.resolve(personalData);
      defer = null;
      this.counterAttemps = 0;
    };
    const getContactDetailsDataError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getContactDetailsDataCallback,
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
              getContactDetailsDataCallback,
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

    const getContactDetailsDataCallback = (defer): void => {
      this.counterAttemps++;
      this.getContactDetailsData(defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
        .IB_ZERO_CONTACT_DETAILS;
    this.CommonsGenericSFProxy.getGeneric(endpoint).then(
      getContactDetailsDataSuccess,
      getContactDetailsDataError,
    );
    return defer.promise;
  };

  // @deprecated Use IBCContactDetailsZeroService instead
  updateContactDetailsData = (
    updatePersonalData,
    promise?: any,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();

    const updateContactDetailsDataSuccess = (personalData): void => {
      defer.resolve(personalData);
      defer = null;
      this.counterAttemps = 0;
    };
    const updateContactDetailsDataError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              updateContactDetailsDataCallback,
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
              updateContactDetailsDataCallback,
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

    const updateContactDetailsDataCallback = (defer): void => {
      this.counterAttemps++;
      this.updateContactDetailsData(updatePersonalData, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS
        .PERSONAL_DATA_SERVER;
    this.CommonsGenericSFProxy.putGeneric(endpoint, updatePersonalData).then(
      updateContactDetailsDataSuccess,
      updateContactDetailsDataError,
    );

    return defer.promise;
  };
}
