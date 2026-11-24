@Service('ib-pmt-services-http-module', ['$q', 'localStorageService', 'CommonsGenericProxy', 'PmtConstants'], [])
class PmtTaxInfoService {
    constructor (
        private $q: ng.IQService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private PmtConstants: PmtConstants
    ) { }
    private defer: angular.IDeferred<unknown>;

    getTaxInfo = (serviceURI: string) => {
        const endpoint = serviceURI + this.PmtConstants.ENDPOINTS.DEFAULT.taxInfoServiceURI;
        this.defer = this.defer || this.$q.defer();
        const getTaxInfoSuccess = (taxInfo) => {
            this.localStorageService.set('taxInfo', taxInfo.data);
            this.defer.resolve(taxInfo.data);
            this.defer = null;
        };
        const getTaxInfoError = () => {
            this.defer.resolve();
            this.defer = null;
        };
        if (this.localStorageService.get('taxInfo')) {
            this.defer.resolve(this.localStorageService.get('taxInfo'));
        } else {
            this.CommonsGenericProxy.getGeneric(endpoint).then(getTaxInfoSuccess, getTaxInfoError);
        }
        return this.defer.promise;
    };

}