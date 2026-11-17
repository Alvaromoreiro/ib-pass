@Service('ib-checkin-services-module', [
    '$q',
    'CommonsGenericProxy',
    'CommonsHttpUtilsErrorService',
    'HttpServicesConstants',
    'localStorageService',
    '$filter'
])
class DeletePassengerService {
    private counterAttemps = 0;

    constructor (
        private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $filter: angular.IFilterService
    ) {}

    deletePassenger = (passengersInfo) => {
        let defer = this.$q.defer();
        const getDeleteSucess = (data): void => {
            defer.resolve(data);
            defer = null;
            this.counterAttemps = 0;
        };
        const checkinIdError = (): void => {
            defer.reject({ errorCode: 'IB_00002', message: this.$filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
            this.counterAttemps = 0;
        };
        const getDeleteCallback = (): void => {
            this.counterAttemps++;
            this.deletePassenger(passengersInfo);
        };
        const checkinId = this.localStorageService.get('flowId') || checkinIdError();
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.deletePassengerURI + checkinId + '/accept/delete';
        this.CommonsGenericProxy.postGeneric(endpoint, passengersInfo).then(getDeleteSucess, (err) =>
            this.CommonsHttpUtilsErrorService.controlError(err, this.counterAttemps, getDeleteCallback, defer)
        );
        return defer.promise;
    };
}
