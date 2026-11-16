@Service('ib-http-services-module',
    [
        '$q',
        'MmBAppConstants',
        'BookingNameProxy',
        'CommonsHttpUtilsErrorService',
        'base64'
    ])
class GetBookingNameService {
    public counterAttemps: number;
    constructor (
        private $q: ng.IQService,
        private MmBAppConstants: MmBAppConstants,
        private BookingNameProxy: BookingNameProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private base64
    ) {
        this.counterAttemps = 0;
    }
    /**
     *
     * @param {String} surname Surname of reservation
     * @param {String} locator PNR
     * @param {String} code Code encrypted of external pages (BA,VU)
     */
    getBooking = (name: string, surname: string, checkinId: string, deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const endpoint = this. MmBAppConstants.getBookingInformationNameURI + checkinId;

        const getBookingError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getBookingCallback, defer);
        };
        const getBookingCallback = () => {
            this.counterAttemps++;
            this.getBooking(name, surname, checkinId, defer);
        };
        const getBookingSuccess = (data) => {
            defer.resolve(data.data);
            defer = null;
        };

        this.BookingNameProxy.getBooking(endpoint,name, surname)
            .then(getBookingSuccess, getBookingError).catch(getBookingError);

        return defer.promise;
    };
}