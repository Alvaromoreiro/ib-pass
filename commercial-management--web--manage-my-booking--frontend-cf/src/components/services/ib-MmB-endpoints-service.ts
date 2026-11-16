@Service('ib-MmB-services-module', [
    'localStorageService',
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService'
], [])
export class MmBEndpointsService {
    uri: any;

    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getEndpoints = () => {
        return new Promise((resolve, reject) => {
            this.localStorageService.set('buildNumber', 1);

            const getEndpointsSuccess = (data: any) => {
                resolve(data);
            };

            const getEndpointsError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.uri = this.MmBAppConstants.endpointsServiceURI + this.localStorageService.get('buildNumber');
            this.CommonsGenericProxy.getGeneric(this.uri).then(getEndpointsSuccess, getEndpointsError);
        });
    };
}
