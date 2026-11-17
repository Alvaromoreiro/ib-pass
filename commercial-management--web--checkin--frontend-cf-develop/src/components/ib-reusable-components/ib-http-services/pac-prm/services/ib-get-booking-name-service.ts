@Service('ib-http-services-module',
    [
        '$q',
        'HttpServicesConstants',
        'BookingNameProxy',
        'CommonsHttpUtilsErrorService',
        'base64'
    ])
class GetBookingNameService {
    public counterAttemps: number;
    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
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
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getBookingInformationNameURI + checkinId;

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

        this.BookingNameProxy.getBooking(endpoint, this.base64.encode(name), this.base64.encode(surname))
            .then(getBookingSuccess, getBookingError).catch(getBookingError);

        return defer.promise;
    };
}