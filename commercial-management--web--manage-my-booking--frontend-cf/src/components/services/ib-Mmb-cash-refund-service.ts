@Service(
    'ib-MmB-services-module',
    ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService'],
    []
)
export class CashRefundService {
    cashRefundURI: any;
    cashRefundInformationURI: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getCashRefundInformation = (flowId: any, requestBody: any) => {
        return new Promise((resolve, reject) => {
            this.cashRefundInformationURI = this.MmBAppConstants.cashRefundInformationURI;

            const getCashRefundInformationSuccess = (data: any) => {
                resolve(data.data);
            };
    
            const getCashRefundInformationError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);

            };
            this.CommonsGenericProxy.postGeneric(this.cashRefundInformationURI, requestBody).then(getCashRefundInformationSuccess, getCashRefundInformationError);    
        });
    };

    getCashRefundConfirmation = (flowId: any, requestBody: any) => {
        return new Promise((resolve, reject) => {
            this.cashRefundURI = this.MmBAppConstants.cashRefundURI;

            const getCashRefundConfirmationSuccess = (data: any) => {
                resolve(data.data);
            };
    
            const getCashRefundConfirmationError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.postGeneric(this.cashRefundURI, requestBody).then(getCashRefundConfirmationSuccess, getCashRefundConfirmationError);    
        });
    };
}