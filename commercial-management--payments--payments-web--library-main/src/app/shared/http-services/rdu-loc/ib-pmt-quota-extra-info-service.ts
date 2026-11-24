@Service('ib-pmt-services-http-module', ['$q', 'localStorageService', 'CommonsGenericProxy', 'PmtConstants'], [])
class PmtQuotaExtraInfoService {
    constructor (
        private $q: ng.IQService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private PmtConstants: PmtConstants
    ) { }
    private defer: angular.IDeferred<unknown>;

    getQuotaExtraInfo = (serviceURI: string) => {
        const endpoint = serviceURI + this.PmtConstants.ENDPOINTS.DEFAULT.quotaExtraInfoServiceURI;
        this.defer = this.defer || this.$q.defer();
        const getQuotaExtraInfoSuccess = (quotaExtraInfo) => {
            this.localStorageService.set('quotaExtraInfo', quotaExtraInfo.data);
            this.defer.resolve(quotaExtraInfo.data);
            this.defer = null;
        };
        const getQuotaExtraInfoError = () => {
            this.defer.resolve();
            this.defer = null;
        };
        if (this.localStorageService.get('quotaExtraInfo')) {
            this.defer.resolve(this.localStorageService.get('quotaExtraInfo'));
        } else {
            this.CommonsGenericProxy.getGeneric(endpoint).then(getQuotaExtraInfoSuccess, getQuotaExtraInfoError);
        }
        return this.defer.promise;
    };

}