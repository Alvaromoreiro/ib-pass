import { IbSessionConfigService } from '@src/app/core/services/ib-session-config.service';

@Service('ib-http-services-module',
    [
        '$q',
        'HttpServicesConstants',
        'localStorageService',
        'BookingInformationProxy',
        'CommonsHttpUtilsErrorService',
        'IbSessionConfigService'
    ])

class GetBookingInformationService {
    public counterAttemps: number;
    constructor (
        private $q: ng.IQService,
        private HttpServicesConstants: HttpServicesConstantsNamespace.HttpServicesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private BookingInformationProxy: BookingInformationProxy,
        private CommonsHttpUtilsErrorService: CommonsHttpUtilsErrorService,
        private IbSessionConfigService: IbSessionConfigService
    ) {
        this.counterAttemps = 0;
    }

    /**
     *
     * @param {String} surname Surname of reservation
     * @param {String} locator PNR
     * @param {String} code Code encrypted of external pages (BA,VU)
     */
    getBookingInformationByLocatorAndSurname = (surname: string, locator: string, flownSegments: string, deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const urlParams: any = this.localStorageService.get('urlParams');
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getBookingInformationURI + locator + (this.localStorageService.get('buildNumber') || '') + (urlParams && urlParams.travelAgencies ? '&type=Group' : '') + '&flownSegments=' + flownSegments;

        const getBookingInformationByLocatorAndSurnameError = (error): void => {
            if(error.data?.checkinId) {
                this.localStorageService.set('flowId', error.data.checkinId);
            }
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getBookingInformationByLocatorAndSurnameCallback, defer);
        };
        const getBookingInformationByLocatorAndSurnameCallback = () => {
            this.counterAttemps++;
            this.getBookingInformationByLocatorAndSurname(surname, locator, flownSegments, defer);
        };

        this.BookingInformationProxy.getBookingInformationByLocatorAndSurname(endpoint, surname)
            .then((data) => this.getBookingInformationSuccess(data, defer, locator), getBookingInformationByLocatorAndSurnameError).catch(getBookingInformationByLocatorAndSurnameError);

        return defer.promise;
    };

    getBookingInformationByDeepLink = (code, deferredRecall?: any): angular.IPromise<unknown> => {
        let defer = deferredRecall || this.$q.defer();
        const urlParams: any = this.localStorageService.get('urlParams');
        const endpoint = this.HttpServicesConstants.URI.DEFAULT_ENDPOINTS.getBookingInformationDeepLinkURI + (this.localStorageService.get('buildNumber') || '') + (urlParams && urlParams.travelAgencies ? '&type=Group' : '');

        const getBookingInformationByDeepLinkCallback = () => {
            this.counterAttemps++;
            this.getBookingInformationByDeepLink(code, defer);
        };

        const getBookingInformationByDeepLinkError = (error): void => {
            this.CommonsHttpUtilsErrorService.controlError(error, this.counterAttemps, getBookingInformationByDeepLinkCallback, defer);
        };

        this.BookingInformationProxy.getBookingInformationByDeepLink(endpoint, code)
            .then((data) => this.getBookingInformationSuccess(data, defer), getBookingInformationByDeepLinkError).catch(getBookingInformationByDeepLinkError);

        return defer.promise;
    };

    private getBookingInformationSuccess = (data, defer, locator = '') => {
        const bookingInfo = data.data;
        this.localStorageService.set('bookingInfo', bookingInfo);
        this.localStorageService.set('flowId', bookingInfo?.checkinId);
        this.IbSessionConfigService.setPNR(locator || bookingInfo?.gdsLocator || bookingInfo?.resiberLocator || '');
        defer.resolve(bookingInfo);
        defer = null;
    };

}
