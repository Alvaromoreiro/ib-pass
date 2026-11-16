import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "localStorageService",
])
export class CabinTypesService {
  private counterAttempts: number = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {}

  getCabinTypes = (): ng.IPromise<any> => {
    let defer = this.$q.defer();
    const cabinTypes = this.localStorageService.get("cabinTypes");

    const getCabinTypesSuccess = (data): void => {
      defer.resolve(data.data);
      defer = null;
      this.counterAttempts = 0;
    };

    const getCabinTypesError = (error): void => {
      switch (error.errorCode) {
        case 408:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttempts,
              getBaggageCallback,
              error,
            ),
            { defer: defer },
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttempts,
              getBaggageCallback,
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

    const getBaggageCallback = (): void => {
      this.counterAttempts++;
      this.getCabinTypes();
    };

    if (cabinTypes === null) {
      const endpoint =
        this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS
          .cabinTypesListServiceURI;
      this.CommonsGenericProxy.getGeneric(endpoint).then(
        getCabinTypesSuccess,
        getCabinTypesError,
      );
    } else {
      defer.resolve(cabinTypes);
    }

    return defer.promise;
  };
}
