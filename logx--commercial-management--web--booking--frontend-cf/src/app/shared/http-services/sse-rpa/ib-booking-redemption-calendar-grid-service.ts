import * as angular from 'angular';
import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';

export class BookingCalendarGridService {
    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private HttpServicesConstants: HttpServicesConstantsType,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    getRedemptionCalendarData = (requestData) => {
        const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.BookingCalendarGridServiceURI;
        return new Promise( (resolve, reject) => {
            this.BookingPromiseProxy.post(endpoint, requestData).then(
                (response)=> {
                    resolve(response.data);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
BookingCalendarGridService.$inject = [
    'BookingPromiseProxy', 'HttpServicesConstants',
    'CommonsNewHttpUtilsErrorService'
];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'BookingCalendarGridService',
        BookingCalendarGridService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'BookingCalendarGridService',
        BookingCalendarGridService
    );
}
