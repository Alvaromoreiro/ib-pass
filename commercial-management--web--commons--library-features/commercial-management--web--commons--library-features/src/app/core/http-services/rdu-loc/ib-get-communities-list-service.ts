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
export class GetCommunityListByCountryService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {}

  getCommunityListByCountry = (country, promise?: any): ng.IPromise<any> => {
    let defer = this.$q.defer();
    const communityList = this.localStorageService.get("communityList");

    const getCommunityListByCountrySuccess = (communityList): void => {
      this.localStorageService.set("communityList", communityList.data);
      defer.resolve(communityList.data);
      defer = null;
      this.counterAttemps = 0;
    };
    const getCommunityListByCountryError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getCommunityListByCountryCallback,
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
              getCommunityListByCountryCallback,
              error,
              defer,
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

    const getCommunityListByCountryCallback = (defer): void => {
      this.counterAttemps++;
      this.getCommunityListByCountry(country, defer);
    };
    if (communityList === null) {
      const endpoint =
        this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.communitiesListURI.replace(
          "{{country}}",
          country,
        );
      this.CommonsGenericProxy.getGeneric(endpoint).then(
        getCommunityListByCountrySuccess,
        getCommunityListByCountryError,
      );
    } else {
      defer.resolve(communityList);
    }
    return defer.promise;
  };
}
