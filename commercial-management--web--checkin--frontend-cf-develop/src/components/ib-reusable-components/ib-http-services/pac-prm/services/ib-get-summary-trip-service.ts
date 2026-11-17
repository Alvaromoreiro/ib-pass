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
class GetSummaryTripService {
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
    getSummaryTripInformation = (deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const checkinId = this.localStorageService.get('flowId');
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getSummaryTripURI + checkinId + '/summary';

        const getSummaryTripInformationError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getSummaryTripInformationCallback, defer);
        };
        const getSummaryTripInformationCallback = () => {
            this.counterAttemps++;
            this.getSummaryTripInformation(defer);
        };
        const getSummaryTripInformationSuccess = (data) => {
            defer.resolve(data);
            defer = null;
        };
        if (checkinId !== null) {
            this.CommonsGenericProxy.getGeneric(endpoint)
                .then(getSummaryTripInformationSuccess, getSummaryTripInformationError).catch(getSummaryTripInformationError);
        } else {
            defer = defer || this.$q.defer();
            this.$timeout(() => {
                defer.reject({ errorCode: 'IB_00002', message: this.$filter('translate')('SESSION_EXPIRED'), internalErrorCode: 'IB_00002' });
                defer = null;
            });
        }
        return defer.promise;
    };
}