@Service(
    'ib-MmB-services-module',
    ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService'],
    []
)
export class VoucherInformationService {
    voucherURI: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getVoucherAmount = (flowId: any, requestBody: any) => {
        return new Promise((resolve, reject) => {
            this.voucherURI = this.MmBAppConstants.voucherInfoURI;

            const getVoucherAmountSuccess = (data: any) => {
                resolve(data.data);
            };
    
            const getVoucherAmountError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.postGeneric(this.voucherURI, requestBody).then(getVoucherAmountSuccess, getVoucherAmountError);
        });
    };

    getVoucherConfirmationInfo = (flowId: any, requestBody: any) => {
        return new Promise((resolve, reject) => {
            this.voucherURI = this.MmBAppConstants.voucherInfoURI;

            const getVoucherConfirmationInfoSuccess = (data: any) => {
                resolve(data.data);
            };
    
            const getVoucherConfirmationInfoError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.putGeneric(this.voucherURI, requestBody).then(getVoucherConfirmationInfoSuccess, getVoucherConfirmationInfoError);    
        });
    };
}