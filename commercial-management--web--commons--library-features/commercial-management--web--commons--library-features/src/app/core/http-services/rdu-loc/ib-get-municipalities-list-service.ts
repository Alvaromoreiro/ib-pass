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
export class GetMunicipalitiesListService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {}

  getMunicipalitiesList = (
    residenceType,
    country,
    promise?: any,
  ): ng.IPromise<any> => {
    let defer = this.$q.defer();

    const getMunicipalitiesListSuccess = (municipalitiesData): void => {
      defer.resolve(municipalitiesData.data);
      defer = null;
      this.counterAttemps = 0;
    };
    const getMunicipalitiesListError = (error): void => {
      switch (error.errorCode) {
        case 408:
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getMunicipalitiesListCallback,
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
              getMunicipalitiesListCallback,
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

    const getMunicipalitiesListCallback = (defer): void => {
      this.counterAttemps++;
      this.getMunicipalitiesList(residenceType, country, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS
        .municipalitiesListURI +
      (country ? "/" + country : "") +
      "/municipalities" +
      (residenceType ? "/" + residenceType : "");
    this.CommonsGenericProxy.getGeneric(endpoint).then(
      getMunicipalitiesListSuccess,
      getMunicipalitiesListError,
    );

    return defer.promise;
  };
}
