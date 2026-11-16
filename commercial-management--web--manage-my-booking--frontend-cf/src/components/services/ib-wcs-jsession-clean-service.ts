@Service('ib-MmB-services-module', [
    '$window',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService',
    'CommonsGenericProxy'
], [])
export class WcsJsessionCleanService {

    constructor (
        private $window: ng.IWindowService,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getJsessionClean = (code: any) => {
        return new Promise((resolve, reject) => {
            let endpoint = null;
            endpoint = this.$window.location.origin + this.MmBAppConstants.HttpServices.WCS_URIS.JSESSIONCLEAN;
    
            const getJsessionCleanSuccess = (response: any) => {
                resolve(response);
            };
    
            const getJsessionCleanError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.getGeneric(endpoint).then(getJsessionCleanSuccess, getJsessionCleanError);
        });
    };
}