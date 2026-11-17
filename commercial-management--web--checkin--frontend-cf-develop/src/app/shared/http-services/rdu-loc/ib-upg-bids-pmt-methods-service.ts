import * as angular from 'angular';

export class PmtMethodsUpgradingBidsService {
    deferred: any;
    counterAttemps: any;
    reCallService: any;

    constructor (
        private $q: ng.IQService,
        private CommonsGenericProxy: CommonsGenericProxy,
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService
    ) {
        this.counterAttemps = 0;
        this.reCallService = false;
    }

    /**
    * Gets the PaymentMethods for a purchase. If there was and error in the http call,
    * this method treats these http error code and returns the object to show an error in the view.
    * @param {String} orderId - the bookig order id to make the purchase
    * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
    *  When the promise rejects, it returns an object with the error data to show in the view
    */
    getPaymentMethodsUpgradingBids = (issueCountry: string, totalBidsPrice: string, currency: string): angular.IPromise<any> => {
        const endpoint = this.CheckinAncillariesConstants.DEFAULT_ENDPOINTS.paymentMethodsServiceURI + '?country=' + issueCountry + '&total=' + totalBidsPrice + '&currency=' + currency;
        return new Promise((resolve, reject) => {
            this.CommonsGenericProxy.getGeneric(endpoint).then(
                (response) => {
                    resolve(response);
                },
                (error) => {
                    this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
                });
        });
    };
}
PmtMethodsUpgradingBidsService.$inject = ['CommonsGenericProxy', 'CheckinAncillariesConstants', 'CommonsNewHttpUtilsErrorService'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service(
        'PmtMethodsUpgradingBidsService',
        PmtMethodsUpgradingBidsService
    );
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service(
        'PmtMethodsUpgradingBidsService',
        PmtMethodsUpgradingBidsService
    );
}
