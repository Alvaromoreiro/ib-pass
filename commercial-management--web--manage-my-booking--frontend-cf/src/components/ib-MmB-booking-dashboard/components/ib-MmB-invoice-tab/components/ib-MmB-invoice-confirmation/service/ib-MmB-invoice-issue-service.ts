@Service(
    'ib-MmB-invoice-confirmation-module',
    ['CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService',
    'localStorageService'],
    []
)
export class InvoiceIssueService {
    invoicesIssueURI: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    addInvoiceIssue = (requestBody: any) => {
        const flowId = this.localStorageService.get('flowId');
        const replacedURI = this.MmBAppConstants.invoicesIssueURI.replace('{flowId}', flowId);
        return new Promise((resolve, reject) => {
            const getInvoiceIssueSuccess = (data: any) => {
                resolve(data.data);
            };

            const getInvoiceIssueError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };

            this.CommonsGenericProxy.postGeneric(replacedURI, requestBody).then(getInvoiceIssueSuccess, getInvoiceIssueError);
        });
    };

}
