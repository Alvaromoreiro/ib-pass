import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "CommonsGenericProxy",
])
export class DeleteIbPlusMembersService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsGenericProxy: CommonsGenericProxy,
  ) {}

  deleteIbPlusMember = (promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();
    const url =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.deleteIbPlusMembers;

    const deleteIbPlusMemberSuccess = (data): void => {
      defer.resolve(data);
      defer = null;
      this.counterAttemps = 0;
    };
    const deleteIbPlusMemberError = (error): void => {
      switch (error.errorCode) {
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              deleteIbPlusMemberCallback,
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
              deleteIbPlusMemberCallback,
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

    const deleteIbPlusMemberCallback = (defer): void => {
      this.counterAttemps++;
      this.deleteIbPlusMember(defer);
    };

    this.CommonsGenericProxy.deleteGeneric(url).then(
      deleteIbPlusMemberSuccess,
      deleteIbPlusMemberError,
    );

    return defer.promise;
  };
}
