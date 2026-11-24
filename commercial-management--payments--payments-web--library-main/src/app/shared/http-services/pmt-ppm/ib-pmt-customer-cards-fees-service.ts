import * as angular from 'angular';
import {CommonsGenericProxy} from 'ib-web-commons/app/core/proxies/ib-commons-generic-proxy';
export class PmtCustomerCardsFeesService {
    constructor (
        private PmtConstants: PmtConstants,
        private CommonsGenericProxy: CommonsGenericProxy
    ) { }

    getFeesforCustomerCards = (request) => {
        const endpoint = `${this.PmtConstants.ENDPOINTS.DEFAULT.customerCardsFeesServiceURI}`;

        return new Promise((resolve: (data: PmtCustomerCardsFees.creditcarsdFeesResponse) => void) => {
            this.CommonsGenericProxy.postGeneric(endpoint, request).then(
                (data ) => {
                    resolve(<PmtCustomerCardsFees.creditcarsdFeesResponse> data.data);
                },
                () => {
                    resolve(<PmtCustomerCardsFees.creditcarsdFeesResponse> {});
                }
            );
        });
    };
}
PmtCustomerCardsFeesService.$inject = ['PmtConstants', 'CommonsGenericProxy'];
try {
    const mod = angular.module('pmt-customer-cards-fees-service');
    mod.service(
        'PmtCustomerCardsFeesService',
        PmtCustomerCardsFeesService
    );
} catch (error) {
    const mod = angular.module('pmt-customer-cards-fees-service', []);
    mod.service(
        'PmtCustomerCardsFeesService',
        PmtCustomerCardsFeesService
    );
}