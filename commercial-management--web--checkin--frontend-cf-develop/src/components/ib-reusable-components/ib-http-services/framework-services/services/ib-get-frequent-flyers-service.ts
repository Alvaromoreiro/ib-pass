@Service('ib-http-services-module',
    [
        '$q',
        'HttpServicesConstants',
        'localStorageService',
        'CommonsGenericProxy',
        'CommonsHttpUtilsErrorService',
        '$timeout',
        '$filter'
    ])
class GetFrequentFlyersService {
    public counterAttemps: number;
    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private $timeout: ng.ITimeoutService,
        private $filter: angular.IFilterService
    ) {
        this.counterAttemps = 0;
    }
    getFrequentFlyers = (deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const frequentflyers = this.localStorageService.get('frequentFlyers');
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getFrequentFlyerCompaniesURI;

        const getFrequentFlyersError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getFrequentFlyersCallback, defer);
        };
        const getFrequentFlyersCallback = () => {
            this.counterAttemps++;
            this.getFrequentFlyers(defer);
        };
        const getFrequentFlyersSuccess = (data) => {
            this.localStorageService.set('frequentFlyers', data.data);
            defer.resolve(data.data);
            defer = null;
        };
        if (frequentflyers === null) {
            this.CommonsGenericProxy.getGeneric(endpoint)
                .then(getFrequentFlyersSuccess, getFrequentFlyersError).catch(getFrequentFlyersError);
        } else {
            defer.resolve(frequentflyers);
        }
        return defer.promise;
    };
}