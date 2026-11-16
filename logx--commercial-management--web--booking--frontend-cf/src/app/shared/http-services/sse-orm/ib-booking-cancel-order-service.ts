import * as angular from 'angular';

import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';

export class BookingCancelOrderService {
    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private HttpServicesConstants: HttpServicesConstantsType,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    cancelOrder = (orderId) => {
        const endpoint = `${this.HttpServicesConstants.DEFAULT_ENDPOINTS.cancelOrderServiceURI}/${orderId}`;
        return new Promise((resolve, reject) => {
            this.BookingPromiseProxy.delete(endpoint)
                .then(
                    (response)=> {
                        resolve(response.data);
                    },
                    (error) => {
                        this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                    });
        });
    };

}
BookingCancelOrderService.$inject = [
    'BookingPromiseProxy', 'HttpServicesConstants',
    'CommonsNewHttpUtilsErrorService'
];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'BookingCancelOrderService',
        BookingCancelOrderService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'BookingCancelOrderService',
        BookingCancelOrderService
    );
}
