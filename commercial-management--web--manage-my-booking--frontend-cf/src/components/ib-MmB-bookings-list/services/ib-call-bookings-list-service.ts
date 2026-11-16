@Service(
    'ib-MmB-bookings-list-module',
    ['MmBAppConstants', 'CommonsNewHttpUtilsErrorService', 'CommonsGenericProxy'],
    []
)
export class CallBookingsListService {

    constructor (
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy : CommonsGenericProxy
    ) {}

    getBookingsList = () => {
        return new Promise((resolve, reject) => {
            const getBookingsListSuccess = (data: any) => {
                resolve(data);
            };
            const getBookingsListError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.getGeneric(this.MmBAppConstants.bookingsListURI).then(getBookingsListSuccess, getBookingsListError);    
        });
    };
}