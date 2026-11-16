@Service(
    'ib-MmB-flight-confirmation-module',
    ['CommonsGenericProxy', 'MmBAppConstants', 'CommonsNewHttpUtilsErrorService'],
    []
)
export class ChangeOrderSliceService {
    

    constructor (
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    changeOrderSlice = (orderId: any, sliceId: any, requestData: any) => {
        return new Promise((resolve, reject) => {
            const changeOrderSliceSuccess = (data: any) => {
                resolve(data.data);
            };
    
            const changeOrderSliceError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.putGeneric(this.MmBAppConstants.changeOrderSliceURI + '/' + orderId + '/slice/' + sliceId, requestData
            ).then(changeOrderSliceSuccess, changeOrderSliceError);
        });
    };
}