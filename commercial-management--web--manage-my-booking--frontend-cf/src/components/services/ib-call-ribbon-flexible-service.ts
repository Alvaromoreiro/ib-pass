@Service(
    'ib-MmB-services-module',
    ['MmBAppConstants', 'MmBUtilService', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy'],
    []
)
export class CallRibbonflexibleService {

    constructor (
        private MmBAppConstants: any,
        private MmBUtilService: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getRibbonFlexible = (request: any) => {
        return new Promise((resolve, reject) => {
            let endpointRibbon = null;
            endpointRibbon = this.MmBUtilService.getEndpoint('sse-avm-rs') || this.MmBAppConstants.ribbonFlexibleServiceURI;
    
            const returnProcessedError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            const getRibbonFlexibleSuccess = (data: any) => {
                resolve(data.data);
            };
            this.CommonsGenericProxy.postGeneric(endpointRibbon, request).then(getRibbonFlexibleSuccess, returnProcessedError);
        });
    };
}