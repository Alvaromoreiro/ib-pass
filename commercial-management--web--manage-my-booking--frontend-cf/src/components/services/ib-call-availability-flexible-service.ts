@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'MmBUtilService',
    'CommonsNewHttpUtilsErrorService',
    '$filter',
    'CallRibbonflexibleService'
], [])
export class CallAvailabilityflexibleService {

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private MmBUtilService: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private $filter: angular.IFilterService,
        private CallRibbonflexibleService: any
    ) {}

    getAvailabilityFlexible = (request: any) => {
        return new Promise((resolve, reject) => {
            let endpointAvailability = null;
            endpointAvailability = this.MmBUtilService.getEndpoint('sse-avm-rs') || this.MmBAppConstants.AvailabilityflexibleServiceURI;
    
    
            const getAvailabilityFlexibleSuccess = (AvailabilityResponse: any) => {
                this.CallRibbonflexibleService.getRibbonFlexible(request).then( (ribbonResponse: any) => {
                    returnAvailabilityData(ribbonResponse);
                }, (error: any) => {
                    returnAvailabilityData(null);
                });
    
                const returnAvailabilityData = (ribbonResponse: any) => {
                    const dataResponse = {
                        availabilityDataResponse: AvailabilityResponse.data,
                        ribbonFlexData: ribbonResponse || null
                    };
    
                    if (AvailabilityResponse) {
                        resolve(dataResponse);
                    }
                };
            };
    
            const getAvailabilityFlexibleError = (error: any) => {
                error.title = this.$filter('translate')('MMB_FLEXIBILIZATION_SEARCH_TITLE_ERROR');
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.postGeneric(endpointAvailability, request).then(getAvailabilityFlexibleSuccess, getAvailabilityFlexibleError);
        });
    };
}