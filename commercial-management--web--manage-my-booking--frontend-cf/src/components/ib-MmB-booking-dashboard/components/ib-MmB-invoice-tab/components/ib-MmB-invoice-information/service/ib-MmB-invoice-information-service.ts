@Service(
    'ib-MmB-invoice-information-module',
    ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService', 'localStorageService', 'MmBModalService'],
    []
)
export class InvoiceInformationService {
    invoicesDetailsURI: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBModalService: any,
    ) {}

    
    getProvinceByCountry = (lang, market, flowId) =>{
        
          const headerConfig = {
            'headers': {
                'Accept-Language': `${lang}-${market}`,
                'Content-Type': 'application/json'
            }
        };
        return new Promise((resolve, reject) => {
            const replacedURI = this.MmBAppConstants.invoicesProvinceURI.replace('{flowId}', flowId);
       
            const getInvoiceInformationSuccess = (data: any) => {
                resolve(data.data);
            };

            const getInvoiceInformationError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };

            this.CommonsGenericProxy.getGeneric(replacedURI,headerConfig).then(getInvoiceInformationSuccess, getInvoiceInformationError);
            
        });
      };
      getListOfCountries = (lang, market) => {
        
        const headerConfig = {
            'headers': {
                'Accept-Language': `${lang}-${market}`
            }
        };
        
        return new Promise((resolve, reject) => {
            const getInvoiceInformationSuccess = (data: any) => {
                resolve(data.data);
            };

            const getInvoiceInformationError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };

            this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.invoicesCountry,headerConfig).then(getInvoiceInformationSuccess, getInvoiceInformationError);
        });
      }
    /*getInvoiceList = () => {
        const flowId = this.localStorageService.get('flowId');
        const replacedURI = this.MmBAppConstants.invoicesDetailsURI.replace('{flowId}', flowId);
        this.MmBModalService.showWaitingModal();
        return new Promise((resolve, reject) => {
            const getInvoiceListSuccess = (data: any) => {
                resolve(data.data);
            };

            const getInvoiceListError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                this.MmBModalService.finishWaiting();
            };

            this.CommonsGenericProxy.getGeneric(replacedURI).then(getInvoiceListSuccess, getInvoiceListError);
        });
    };*/

}
