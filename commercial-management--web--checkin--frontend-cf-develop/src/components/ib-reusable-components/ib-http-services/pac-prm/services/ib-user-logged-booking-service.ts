@Service('ib-http-services-module', [
    '$q',
    'CommonsGenericProxy',
    'CommonsHttpUtilsErrorService',
    'HttpServicesConstants',
    'localStorageService',
    '$filter'
])
class UserLoggedBookingService {
    private counterAttemps = 0;

    constructor (
        private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $filter: angular.IFilterService
    ) {}

    getUserLoggedBookingInformation = () => {
        let defer = this.$q.defer();
        const getUserLoggedBookingInformationSucess = (data): void => {
            this.localStorageService.set('userLoggedBookingInfo', data.data);
            defer.resolve(data.data);
            defer = null;
            this.counterAttemps = 0;
        };
        const getUserLoggedBookingInformationCallback = (): void => {
            this.counterAttemps++;
            this.getUserLoggedBookingInformation();
        };
        const getUserLoggedBookingInformationError = (err): void => {
            this.CommonsHttpUtilsErrorService.controlError(err, this.counterAttemps, getUserLoggedBookingInformationCallback, defer);
        };
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getLoggedBookingURI;
        this.CommonsGenericProxy.getGeneric(endpoint).then(getUserLoggedBookingInformationSucess, getUserLoggedBookingInformationError);
        return defer.promise;
    };
}
