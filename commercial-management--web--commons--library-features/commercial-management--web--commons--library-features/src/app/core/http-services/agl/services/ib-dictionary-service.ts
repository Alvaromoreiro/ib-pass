import { CommonsHttpUtilsErrorService } from "../../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericProxy } from "../../../proxies/ib-commons-generic-proxy";
import { CommonsConstantsType } from "../../../constants/ib-commons-constants";
import { CommonsHttpServicesConstantsType } from "../../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsGenericProxy",
  "CommonsHttpUtilsErrorService",
  "IbPlusConstants",
  "CommonsHttpServicesConstants",
  "localStorageService",
  "UtilsService",
])
export class DictionaryService {
  private counterAttemps = 0;
  private programmeID: string;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private IbPlusConstants: CommonsConstantsType,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: angular.local.storage.ILocalStorageService,
  ) {
    this.programmeID = this.IbPlusConstants.AVAILABLE_PROGRAMME_ID[0];
  }

  /**
   * @function getDictionaryTypes
   *
   * To retrieve list of transactions in which the member was involved in.
   *
   * @return {Object} Return the promise with the response data
   */
  getDictionaryTypes = (
    dictionaryType?: string,
    promise?: any,
    isLoggedflow?: boolean,
  ): angular.IPromise<any> => {
    let defer = this.$q.defer();
    this.localStorageService.set("dictionaryIDTypes", true);
    const isLogFlow = isLoggedflow;

    const getDictionaryTypesSuccess = (dictionaryType): void => {
      this.localStorageService.remove("dictionaryIDTypes");
      defer.resolve(dictionaryType.data);
      defer = null;
      this.counterAttemps = 0;
    };
    const getDictionaryTypesError = (error): void => {
      this.localStorageService.remove("dictionaryIDTypes");
      switch (error.errorCode) {
        case 408:
          break;
        case 404:
          defer.reject(error);
          defer = null;
          break;
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getRetrieveMemberAccountsCallback,
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
              getRetrieveMemberAccountsCallback,
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
    const getRetrieveMemberAccountsCallback = (defer): void => {
      this.counterAttemps++;
      this.getDictionaryTypes(dictionaryType, defer);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.DICTIONARY_TYPES.replace(
        "{{programme-identifier}}",
        this.programmeID,
      ).replace("{{dictionaryType}}", dictionaryType);

    this.CommonsGenericProxy.getGeneric(endpoint, "dict").then(
      getDictionaryTypesSuccess,
      getDictionaryTypesError,
    );
    return defer.promise;
  };
}
