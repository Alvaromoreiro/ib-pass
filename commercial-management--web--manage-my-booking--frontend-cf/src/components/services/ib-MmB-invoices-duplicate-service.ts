@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService',
    'localStorageService'
], [])
export class InvoiceDuplicateService {
    invoicesDuplicateURI: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    sendInvoiceDuplicate = (requestBody: any) => {
        const flowId = this.localStorageService.get('flowId');
        const replacedURI = this.MmBAppConstants.invoicesDuplicateURI.replace('{flowId}', flowId);
        return new Promise((resolve, reject) => {
            const getInvoiceDuplicateSuccess = (data: any) => {
                resolve(data.data);
            };

            const getInvoiceDuplicateError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };

            this.CommonsGenericProxy.postGeneric(replacedURI, requestBody).then(getInvoiceDuplicateSuccess, getInvoiceDuplicateError);
        });
    }
}
