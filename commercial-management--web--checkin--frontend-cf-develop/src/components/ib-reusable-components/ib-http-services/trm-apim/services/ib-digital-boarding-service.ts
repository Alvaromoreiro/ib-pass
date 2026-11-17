@Service('ib-checkin-services-module', [
    '$q',
    'CommonsGenericProxy',
    'CommonsHttpUtilsErrorService',
    'HttpServicesConstants',
    'localStorageService'
])
class DigitalBoardingService {
    private counterAttemps = 0;

    constructor (
        private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    getDigitalBoardingAvailability = () => {
        const defer = this.$q.defer();
        const checkinId = this.localStorageService.get('flowId') || '';

        const getDigitalBoardingSuccess = (data): void => {
            defer.resolve(data.data);
            this.counterAttemps = 0;
        };
        const getDigitalBoardingCallback = (): void => {
            this.counterAttemps++;
            this.getDigitalBoardingAvailability();
        };
        const getDigitalBoardingError = (err) => {
            this.CommonsHttpUtilsErrorService.controlError(err, this.counterAttemps, getDigitalBoardingCallback, defer);
        };

        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.digitalBoardingAvailability;
        this.CommonsGenericProxy.postGeneric(endpoint, {flowId: checkinId}).then(getDigitalBoardingSuccess, getDigitalBoardingError);

        return defer.promise;
    };

}
