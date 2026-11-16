@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService'
], [])
export class ChangeOrderContactInfoService {
    URL_SERVICE: any = '/contact-info';

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    changeOrderContactInfo = (requestData: any, orderId: any) => {
        return new Promise((resolve, reject) => {
            const changeOrderContactInfoSuccess = (data: any) => {
                resolve(data);
            };
            const changeOrderContactInfoError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.putGeneric(
                this.MmBAppConstants.changeOrderContactInfoURI + '/' + orderId + this.URL_SERVICE,
                requestData
            ).then(changeOrderContactInfoSuccess, changeOrderContactInfoError);
        });
    };
}