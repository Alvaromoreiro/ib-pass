import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "$window",
  "CommonsGenericProxy",
  "CommonsHttpServicesConstants",
  "CommonsHttpUtilsErrorService",
])
export class IbCWcsJsessionCleanService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private $window: ng.IWindowService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
  ) {}

  getJsessionClean = (): ng.IPromise<any> => {
    let defer = this.$q.defer();
    const endpoint =
      this.$window.location.origin +
      this.CommonsHttpServicesConstants.WCS_URIS.JSESSIONCLEAN;

    const getJsessionCleanSuccess = (response): void => {
      defer.resolve(response);
      defer = null;
      this.counterAttemps = 0;
    };
    const getJsessionCleanError = (error): void => {
      switch (error.errorCode) {
        case 408:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getJsessionCleanCallback,
              error,
            ),
            { defer: defer },
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttemps,
              getJsessionCleanCallback,
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
    const getJsessionCleanCallback = (): void => {
      this.counterAttemps++;
      this.getJsessionClean();
    };

    this.CommonsGenericProxy.getGeneric(endpoint).then(
      getJsessionCleanSuccess,
      getJsessionCleanError,
    );

    return defer.promise;
  };
}
