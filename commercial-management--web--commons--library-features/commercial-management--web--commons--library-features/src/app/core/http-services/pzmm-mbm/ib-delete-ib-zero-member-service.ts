import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "CommonsGenericProxy",
])
export class DeleteIbZeroMembersService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsGenericProxy: CommonsGenericProxy,
  ) {}

  deleteIbZeroMember = (promise?: any): angular.IPromise<any> => {
    let defer = this.$q.defer();
    const url =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.deleteIbZeroMembers;

    const deleteIbZeroMemberSuccess = (data): void => {
      defer.resolve(data);
      defer = null;
      this.counterAttemps = 0;
    };
    const deleteIbZeroMemberError = (error): void => {
      switch (error.errorCode) {
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              deleteIbZeroMemberCallback,
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
              deleteIbZeroMemberCallback,
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

    const deleteIbZeroMemberCallback = (defer): void => {
      this.counterAttemps++;
      this.deleteIbZeroMember(defer);
    };

    this.CommonsGenericProxy.deleteGeneric(url).then(
      deleteIbZeroMemberSuccess,
      deleteIbZeroMemberError,
    );

    return defer.promise;
  };
}
