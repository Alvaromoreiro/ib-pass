import * as angular from "angular";
import { CommonsUtilService } from "../../utils/ib-commons-utils-service";
import { CommonsHttpUtilsErrorService } from "../../utils/http-utils-services/ib-commons-http-utils-error-service";
import { CommonsHttpServicesConstantsType } from "../../constants/ib-commons-http-service-constants";
import { CommonsGenericProxy } from "../../proxies/ib-commons-generic-proxy";

@Service("ib-commons-http-service-module", [
  "$q",
  "CommonsHttpUtilsErrorService",
  "CommonsHttpServicesConstants",
  "CommonsUtilService",
  "CommonsGenericProxy",
])
export class UpdateMemberService {
  private counterAttemps = 0;

  constructor(
    private $q: ng.IQService,
    private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
    private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
    private CommonsUtilService: CommonsUtilService,
    private CommonsGenericProxy: CommonsGenericProxy,
  ) {}

  updateMember = (memberData: object): angular.IPromise<any> => {
    let defer = this.$q.defer();
    const memberId = this.CommonsUtilService.getMemberId();
    const url =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS.updateMembers.replace(
        "{{id}}",
        memberId,
      );

    const updateMemberSuccess = (data): void => {
      defer.resolve(data);
      defer = null;
      this.counterAttemps = 0;
    };
    const updateMemberError = (error): void => {
      switch (error.errorCode) {
        case 504:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.timeOutError(
              this.counterAttemps,
              updateMemberCallback,
              error,
            ),
            { defer: defer },
          );
          break;
        case 401:
          this.CommonsHttpUtilsErrorService.returnProcessedError(
            this.CommonsHttpUtilsErrorService.unauthorizedError(
              this.counterAttemps,
              updateMemberCallback,
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

    const updateMemberCallback = (): void => {
      this.counterAttemps++;
      this.updateMember(memberData);
    };

    this.CommonsGenericProxy.putGeneric(url, memberData).then(
      updateMemberSuccess,
      updateMemberError,
    );

    return defer.promise;
  };
}
