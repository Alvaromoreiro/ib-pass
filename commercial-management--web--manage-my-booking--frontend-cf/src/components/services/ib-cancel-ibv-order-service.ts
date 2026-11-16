@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService',
    'localStorageService'
], [])
export class CancelIBVOrderService {

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    cancelIBVOrder = () => {
        const locator = this.localStorageService.get('PNR');
        const data = {
            "locator": locator
        }
        return new Promise((resolve, reject) => {
            const cancelIBVOrderSuccess = (data: any) => {
                resolve(data);
            };
            const cancelIBVOrderError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.postGeneric(
                this.MmBAppConstants.cancelIBVURI + '/cancel/' + this.localStorageService.get('flowId'), data).then(
                    cancelIBVOrderSuccess, cancelIBVOrderError
                );
        });
    };
}
