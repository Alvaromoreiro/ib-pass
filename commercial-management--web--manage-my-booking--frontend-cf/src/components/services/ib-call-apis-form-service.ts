@Service(
    'ib-MmB-services-module',
    ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService'],
    []
)
export class CallApisFormService {
    uri: any;

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getApisInfo = (flowId: any, passengerId: any) => {
        return new Promise((resolve, reject) => {
            let queryString = '';
            queryString = '?passengerId=' + passengerId;
    
            const getApisInfoSuccess = (data: any) => {
                if (data) {
                    resolve(data.data);
                }
            };
    
            const getApisInfoError = (error: any) =>  {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.uri = this.MmBAppConstants.apisPassengerInfoURI + flowId + '/security' + queryString;
            this.CommonsGenericProxy.getGeneric(this.uri).then(getApisInfoSuccess, getApisInfoError);
        });
    };

    updateApisInfo = (flowId: any, passengersApisData: any) => {
        return new Promise((resolve, reject) => {
            const updateApisInfoSuccess = (data: any) => {
                resolve(data.data);
            };
    
            const updateApisInfoError = (error: any) => {
                const getCustomerDataCallback : any = () :void => {
                    this.updateApisInfo(flowId, passengersApisData);
                };
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.uri = this.MmBAppConstants.apisPassengerInfoURI + flowId + '/security';
            this.CommonsGenericProxy.putGeneric(this.uri, passengersApisData).then(updateApisInfoSuccess, updateApisInfoError);
        });
    };
}