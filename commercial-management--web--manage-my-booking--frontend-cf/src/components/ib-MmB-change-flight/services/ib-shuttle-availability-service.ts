@Service('ib-Mmb-change-flight-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService'
], [])
export class ShuttleAvailabilityService {
    reCallService: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getShuttleAvailability = (requestData: any) => {
        return new Promise((resolve, reject) => {
            const getShuttleAvailabilitySuccess = (data: any) => {
                resolve(data.data);
            };
    
            const getShuttleAvailabilityError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject());
            };
            this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.shuttleAvailabilityURI, requestData).then(getShuttleAvailabilitySuccess, getShuttleAvailabilityError);    
        });
    };
}