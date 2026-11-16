import { CommonsHttpUtilsErrorService } from '../../utils/http-utils-services/ib-commons-http-utils-error-service';
import { CommonsHttpServicesConstantsType } from '../../constants/ib-commons-http-service-constants';
import { CommonsGenericProxy } from '../../proxies/ib-commons-generic-proxy';

@Service("ib-commons-http-service-module", [
    "$q",
    "CommonsHttpServicesConstants",
    "CommonsGenericProxy",
    "$rootScope",
    "localStorageService",
    "CommonsHttpUtilsErrorService",
    ])
export class IbCOnBusinessEmployeesService {
    private counterAttemps = 0;
    constructor (
        private $q: ng.IQService,
        private CommonsHttpServicesConstants: CommonsHttpServicesConstantsType,
        private CommonsGenericProxy: CommonsGenericProxy,
        private $rootScope: CommonsRootScope,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService
    ) {}

    getOnBusinessEmployees = (promise?: ng.IDeferred<any>): ng.IPromise<any> => {
        let defer = promise || this.$q.defer();
        const endpoint =
      this.CommonsHttpServicesConstants.DEFAULT_ENDPOINTS
          .onBusinessEmployeesURI;

        const getOnBusinessEmployeesSuccess = (employees): void => {
            const response = removeNullList(employees.data);
            this.$rootScope.membershipData.employees = response;
            this.localStorageService.set(
                'membershipData',
                this.$rootScope.membershipData
            );
            defer.resolve(response);
            defer = null;
        };
        const getOnBusinessEmployeesError = (error): void => {
            switch (error.errorCode) {
                    case 408:
                        break;
                    case 504:
                        this.CommonsHttpUtilsErrorService.returnProcessedError(
                            this.CommonsHttpUtilsErrorService.timeOutError(
                                this.counterAttemps,
                                getOnBusinessEmployeesCallback,
                                error,
                                defer
                            ),
                            { defer: defer }
                        );
                        break;
                    case 401:
                        this.CommonsHttpUtilsErrorService.returnProcessedError(
                            this.CommonsHttpUtilsErrorService.unauthorizedError(
                                this.counterAttemps,
                                getOnBusinessEmployeesCallback,
                                error,
                                defer
                            ),
                            { defer: defer }
                        );
                        break;
                    default:
                        this.CommonsHttpUtilsErrorService.returnProcessedError(
                            this.CommonsHttpUtilsErrorService.processGeneralError(error),
                            { defer: defer }
                        );
            }
        };
        const removeNullList = (employees) => {
            const res = [];
            let i: number;
            if (employees) {
                for (i = 0; i < employees.length; i++) {
                    if (employees[i] !== null) {
                        res.push(employees[i]);
                    }
                }
            }
            return res;
        };
        const getOnBusinessEmployeesCallback = (defer): void => {
            this.counterAttemps++;
            this.getOnBusinessEmployees(defer);
        };

        this.CommonsGenericProxy.getGeneric(endpoint).then(
            getOnBusinessEmployeesSuccess,
            getOnBusinessEmployeesError
        );

        return defer.promise;
    };
}
