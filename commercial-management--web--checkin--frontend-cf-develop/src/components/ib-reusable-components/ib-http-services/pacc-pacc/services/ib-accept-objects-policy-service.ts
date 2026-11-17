@Service('ib-http-services-module', ['$q', 'CommonsGenericProxy', 'CommonsHttpUtilsErrorService', 'HttpServicesConstants', 'localStorageService', '$filter'])
class AcceptObjectsPolicyService {
    private counterAttemps = 0;

    constructor (
        private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $filter: angular.IFilterService
    ) {}

    acceptForbiddenObjectsPolicy = (passengersInfo) => {
        let defer = this.$q.defer();
        const acceptsPolicySuccess = (data): void => {
            defer.resolve(data);
            defer = null;
            this.counterAttemps = 0;
        };
        const checkinId = this.localStorageService.get('flowId');
        if (!checkinId) {
            defer.reject({ errorCode: 'IB_00002', message: this.$filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
            this.counterAttemps = 0;
            return defer.promise;
        }
        const acceptsPolicyCallback = (): void => {
            this.counterAttemps++;
            this.acceptForbiddenObjectsPolicy(passengersInfo);
        };
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.objectPolicyAcceptURI + checkinId + '/accept';
        this.CommonsGenericProxy.postGeneric(endpoint, passengersInfo).then(acceptsPolicySuccess, (err) =>
            this.CommonsHttpUtilsErrorService.controlError(err, this.counterAttemps, acceptsPolicyCallback, defer)
        );
        return defer.promise;
    };
}
