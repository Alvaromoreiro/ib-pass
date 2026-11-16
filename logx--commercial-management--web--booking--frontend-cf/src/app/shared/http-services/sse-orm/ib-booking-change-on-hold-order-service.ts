import * as angular from 'angular';

import { BookingPromiseProxy } from '../proxy/ib-booking-promise-proxy.service';
export class BookingChangeOnHoldOrderService {
    constructor (
        private BookingPromiseProxy: BookingPromiseProxy,
        private HttpServicesConstants: HttpServicesConstantsType,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {}

    changeOnHoldOrder = (orderId) => {
        let endpoint = this.HttpServicesConstants.DEFAULT_ENDPOINTS.changeOnHoldOrder;
        endpoint = endpoint.replace('{{flowId}}', orderId);
        return new Promise((resolve, reject) => {
            this.BookingPromiseProxy.put(endpoint, null)
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
BookingChangeOnHoldOrderService.$inject = [
    'BookingPromiseProxy', 'HttpServicesConstants',
    'CommonsNewHttpUtilsErrorService'
];
try {
    const mod = angular.module('ib-booking-services-module');
    mod.service(
        'BookingChangeOnHoldOrderService',
        BookingChangeOnHoldOrderService
    );
} catch (error) {
    const mod = angular.module('ib-booking-services-module', []);
    mod.service(
        'BookingChangeOnHoldOrderService',
        BookingChangeOnHoldOrderService
    );
}
