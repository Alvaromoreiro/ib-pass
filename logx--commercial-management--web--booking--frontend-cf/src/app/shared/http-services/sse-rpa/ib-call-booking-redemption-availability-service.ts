import * as angular from 'angular';
 
import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';

export class CallBookingRedemptionAvailabilityService {
    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private HttpServicesConstants: HttpServicesConstantsType,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsModalService: CommonsModalService,
        private $location: angular.ILocationService,
        private $rootScope: CommonsRootScope

    ) { }
 
    getBookingRedemptionAvailability = (requestData) => {
        const endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.availabilityRedemptionServiceURI;
        return new Promise((resolve, reject) => {
            this.BookingPromiseProxy.post(endpoint, requestData)
                .then(
                    (data) => {
                        if (data.code === 204) {
                            this.CommonsModalService.finishWaiting();
                            const path = this.$rootScope.isPointsOBFlow ? '/OBERRA' : '/ibAviosAlert';
                            this.$location.path(path);
                        } else {
                            resolve(data);
                        }
                    }, (error) => {
                        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });
        });
    };
}
CallBookingRedemptionAvailabilityService.$inject = [
    'BookingPromiseProxy',
    'HttpServicesConstants',
    'CommonsNewHttpUtilsErrorService',
    'CommonsModalService',
    '$location',
    '$rootScope'
];
 
const mod = angular.module('ib-booking-availability-module');
mod.service(
    'CallBookingRedemptionAvailabilityService',
    CallBookingRedemptionAvailabilityService
);
 