import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericProxy",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "localStorageService",
])
export class GetStatesListService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {}

  getStatesList = (
    country: string,
    promise?: any,
    isLoggedflow?: boolean,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();
    const stateList = this.localStorageService.get("stateList_" + country);
    const isLogFlow = isLoggedflow;

    const getStatesListSuccess = (stateList): void => {
      this.localStorageService.set("stateList_" + country, stateList.data);
      defer.resolve(stateList.data);
      defer = null;
      this.counterAttemps = 0;
    };
    const getStatesListError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getStatesListCallback,
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
              getStatesListCallback,
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

    const getStatesListCallback = (defer): void => {
      this.counterAttemps++;
      this.getStatesList(country, defer);
    };

    if (stateList === null) {
      const endpoint =
        this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.statesListURI.replace(
          "{{country}}",
          country,
        );
      this.CommonsGenericProxy.getGeneric(endpoint).then(
        getStatesListSuccess,
        getStatesListError,
      );
    } else {
      defer.resolve(stateList);
    }
    return defer.promise;
  };
}
