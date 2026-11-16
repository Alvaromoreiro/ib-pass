@Service(
    'ib-MmB-services-module',
    ['MmBAppConstants',
        'CommonsNewHttpUtilsErrorService',
        'CommonsGenericProxy'],
    []
)
export class RebookService {

    constructor (
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    rebook = (requestData: any) => {
        return new Promise((resolve, reject) => {
            const rebookSuccess = (data: any) => {
                resolve(data.data);
            };
    
            const rebookError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
    
            };
            this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.rebookURI, requestData).then(rebookSuccess, rebookError);
        });
    };
}