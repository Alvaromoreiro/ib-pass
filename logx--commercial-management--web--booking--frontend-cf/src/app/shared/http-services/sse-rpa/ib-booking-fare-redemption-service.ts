import * as angular from 'angular';
import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';


export class BookingFareRedemptionService {
    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private HttpServicesConstants: HttpServicesConstantsType,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private BookingUtilService
    ) {}


    getBookingRedemptionFare = (requestData) => {
        const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.fareRedemptionServiceURI;
        return new Promise((resolve, reject) => {
            this.BookingPromiseProxy.post(endpoint, requestData)
                .then(
                    (response: any)=> {
                        const flightHaul = { FlightHaul: response.data.offers[0].flightRatio };
                        this.BookingUtilService.addflightHaulInDigitalInfo(flightHaul);
                        resolve(response.data);
                    },
                    (error) => {
                        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });
        });
    };
}

BookingFareRedemptionService.$inject = [
    'BookingPromiseProxy', 'HttpServicesConstants',
    'CommonsNewHttpUtilsErrorService', 'BookingUtilService'
];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'BookingFareRedemptionService',
        BookingFareRedemptionService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'BookingFareRedemptionService',
        BookingFareRedemptionService
    );
}
