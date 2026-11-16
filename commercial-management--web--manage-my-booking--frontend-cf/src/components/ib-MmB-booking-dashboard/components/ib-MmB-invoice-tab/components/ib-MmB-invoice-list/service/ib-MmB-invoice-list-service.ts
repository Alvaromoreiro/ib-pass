@Service(
    'ib-MmB-invoice-list-module',
    ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService', 'localStorageService'],
    []
)
export class InvoiceListService {
    invoicesDetailsURI: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    getInvoiceList = () => {
        const flowId = this.localStorageService.get('flowId');
        const replacedURI = this.MmBAppConstants.invoicesDetailsURI.replace('{flowId}', flowId);
        const lang = this.MmBAppConstants.lang === 'es' || this.MmBAppConstants.lang === 'ca' || this.MmBAppConstants.lang === 'en' ? this.MmBAppConstants.lang : 'es';
        const headerConfig = {
            'headers': {
                'Accept-Language': `${lang}-ES`
            }
        };
        return new Promise((resolve, reject) => {
            const getInvoiceListSuccess = (data: any) => {
                resolve(data.data);
            };

            const getInvoiceListError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };

            this.CommonsGenericProxy.getGeneric(replacedURI,headerConfig).then(getInvoiceListSuccess, getInvoiceListError);
        });
    };

}
