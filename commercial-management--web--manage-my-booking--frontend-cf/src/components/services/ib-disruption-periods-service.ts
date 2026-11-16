@Service('ib-MmB-services-module', [
    'CommonsGenericProxy',
    'CommonsNewHttpUtilsErrorService',
    'MmBAppConstants',
    'localStorageService'
], [])
export class DisruptionPeriodsService {
    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private MmBAppConstants: any,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    getDisruptionPeriods = () => {
        return new Promise((resolve, reject) => {
            let uri = null, disruptionID = null;
            const bookingInfo: any = this.localStorageService.get('bookingInfo');
            const getDisruptionPeriodsSucess = (response: any) => {
                resolve(response.data);
            };

            const getDisruptionPeriodsError = (error: any) => {
                const getCustomerDataCallback : any = () :void => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                };
            };
            if (bookingInfo.genericDisruptionCapabilitiesInformation && bookingInfo.genericDisruptionCapabilitiesInformation.id) {
                disruptionID = bookingInfo.genericDisruptionCapabilitiesInformation.id;
            } else {
                if (bookingInfo.flexibilizationCapabilitiesInformation && bookingInfo.flexibilizationCapabilitiesInformation.id) {
                    disruptionID = bookingInfo.flexibilizationCapabilitiesInformation.id;
                } else {
                    disruptionID = '';
                }
            }
            uri = this.MmBAppConstants.disruptionPeriodsServiceURI + disruptionID + '?flowId=' + bookingInfo.flowId;
            if (bookingInfo.flexibilizationCapabilitiesInformation && bookingInfo.flexibilizationCapabilitiesInformation.id) {
                this.CommonsGenericProxy.getGeneric(uri).then(getDisruptionPeriodsSucess, getDisruptionPeriodsError);
            } else {
                reject();
            }

        });
    };
}