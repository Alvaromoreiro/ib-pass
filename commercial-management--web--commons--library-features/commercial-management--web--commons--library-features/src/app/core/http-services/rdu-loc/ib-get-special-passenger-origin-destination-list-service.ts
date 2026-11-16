import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
])
export class getSpecialPassengerOriginDestinationListService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
  ) {}

  getSpecialPassengerOriginDestinationList = (
    passengerType,
  ): ng.IPromise<any> => {
    let defer = this.$q.defer();
    const getSpecialPassengerOriginDestinationListSuccess = (data): void => {
      defer.resolve(data.data);
      defer = null;
      this.counterAttemps = 0;
    };
    const getSpecialPassengerOriginDestinationListError = (error): void => {
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
      this.getSpecialPassengerOriginDestinationList(passengerType);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS
        .specialPassengerOriginDestinationURI +
      "?type=" +
      passengerType;
    this.CommonsGenericProxy.getGeneric(endpoint).then(
      getSpecialPassengerOriginDestinationListSuccess,
      getSpecialPassengerOriginDestinationListError,
    );

    return defer.promise;
  };
}
