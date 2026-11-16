@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'MmBAppConstants',
    'CommonsNewHttpUtilsErrorService'
], [])
export class UpdateSeatChangeNotificationService {
    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) { }

    callUpdateSeatChangeNotification = (flowId: any) => {
        return new Promise((resolve, reject) => {
            const generateRequestURI = (seatChangeURI: any, flowID: any) => {
                const replacedURI = seatChangeURI.replace('{flowId}', flowID);
                return replacedURI;
            };
            const endpoint = generateRequestURI(this.MmBAppConstants.updateSeatChangeNotificationURI, flowId);
            const callUpdateSeatChangeNotificationSuccess = (response: any) => {
                resolve(response.data);
            };
            const callUpdateSeatChangeNotificationError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.putGeneric(endpoint, flowId).then(
                callUpdateSeatChangeNotificationSuccess,
                callUpdateSeatChangeNotificationError
            );
        });
    };
}