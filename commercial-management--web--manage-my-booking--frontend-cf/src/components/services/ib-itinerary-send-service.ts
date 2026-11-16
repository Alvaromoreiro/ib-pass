@Service(
    'ib-MmB-services-module',
    ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService'],
    []
)
export class IbItinerarySendService {

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: MmBAppConstants,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    itinerarySendServiceInfo = (requestData: any, orderId: any) => {
        return new Promise((resolve, reject) => {
            const itinerarySendServiceInfoSuccess = (data: any) => {
                resolve(data.data);
            };
            const itinerarySendServiceInfoError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.postGeneric(
                this.MmBAppConstants.itinerarySend + '/' + orderId,
                requestData
            ).then(itinerarySendServiceInfoSuccess, itinerarySendServiceInfoError);
        });
    };
}