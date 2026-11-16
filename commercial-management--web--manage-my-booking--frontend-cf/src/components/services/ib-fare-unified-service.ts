@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService'
], [])
export class FareUnifiedService {
    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: MmBAppConstants,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getFareUnified = (request) => {
        return new Promise((resolve, reject) => {
            const getFareUnifiedSuccess = (data) => {
                resolve(data.data);
            };
            const getFareUnifiedError = (error) => {
                const getCustomerDataCallback  = () :void => {
                    this.getFareUnified(request);
                };
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.fareUnifiedURI, request).then(getFareUnifiedSuccess, getFareUnifiedError);
        });
    };
}
