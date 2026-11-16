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
export class IBCGdprService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsGenericProxy: CommonsGenericProxy,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private localStorageService: ng.local.storage.ILocalStorageService,
  ) {}

  getGdprInfo = (quadrigam) => {
    let defer = this.$q.defer();

    const getGdprInfoSuccess = (gdprInfo): void => {
      this.localStorageService.set("gdprInfo" + quadrigam, gdprInfo.data);
      defer.resolve(gdprInfo.data);
      defer = null;
      this.counterAttemps = 0;
    };
    const getGdprInfoCallback = (): void => {
      this.counterAttemps++;
      this.getGdprInfo(quadrigam);
    };

    const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.gdprServiceURI +
      quadrigam +
      "/gdpr";
    this.CommonsGenericProxy.getGeneric(endpoint).then(
      getGdprInfoSuccess,
      (err) =>
        this.CommonsHttpUtilsErrorService.controlError(
          err,
          this.counterAttemps,
          getGdprInfoCallback,
          defer,
        ),
    );
    return defer.promise;
  };
  getGdprBobInfo = this.getGdprInfo(
    this.CommonsHttpServicesConstants.GPDR_URIS.BOB,
  );
  getGdprWineClubInfo = this.getGdprInfo(
    this.CommonsHttpServicesConstants.GPDR_URIS.WINECLUB,
  );
}
