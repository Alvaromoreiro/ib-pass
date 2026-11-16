import { DatalayerUtilsService } from "../../ib-datalayer/services/ib-datalayer-utils-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsConstantsType } from "../../constants/ib-commons-constants";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "$window",
  "CommonsGenericProxy",
  "CommonsHttpServicesConstants",
  "CommonsHttpUtilsErrorService",
  "CommonsConstants",
  "localStorageService",
  "$rootScope",
  "DatalayerUtilsService",
])
export class CommonsGetWcsPhonesService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private $window: ng.IWindowService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsHttpUtilsErrorService: any,
    private CommonsConstants: CommonsConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
    private $rootScope: CommonsRootScope,
    private DatalayerUtilsService: DatalayerUtilsService,
  ) {}

  getPhoneByCode = (code: string): ng.IPromise<any> => {
    let defer = this.$q.defer();
    const endpoint =
      this.$window.location.origin +
      this.CommonsHttpServicesConstants.WCS_URIS.PHONES +
      "&code=" +
      code +
      "&market=" +
      this.$rootScope.appMarket +
      "&locale=" +
      this.$rootScope.appLang;

    const getPhonesSuccess = (phonesData): void => {
      if (code === this.CommonsConstants.PHONES_LIST.HOLIDAYS) {
        const phonesListIBV: object =
          this.localStorageService.get("phonesListIBV") || {};
        phonesListIBV[code] = phonesData.data.content;
        this.$rootScope.phonesListIBV = phonesListIBV;
        this.localStorageService.set("phonesListIBV", phonesListIBV);
      } else {
        const phonesList: object =
          this.localStorageService.get("phonesList") || {};
        phonesList[code] = phonesData.data.content;
        this.$rootScope.phonesList = phonesList;
        this.localStorageService.set("phonesList", phonesList);
      }
      defer.resolve(phonesData.data.content);
      defer = null;
      this.counterAttemps = 0;
    };
    const getPhonesError = (error): void => {
      this.DatalayerUtilsService.sendDatalayerErrorEvent(error);
      switch (error.errorCode) {
        case 408:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              getPhonesCallback,
              error,
            ),
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttemps,
              getPhonesCallback,
              error,
            ),
          );
          break;
        default:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.processGeneralError(error),
          );
      }
    };

    const getPhonesCallback = (): void => {
      this.counterAttemps++;
      this.getPhoneByCode(code);
    };

    this.CommonsGenericProxy.getGeneric(endpoint).then(
      getPhonesSuccess,
      getPhonesError,
    );

    return defer.promise;
  };
}
