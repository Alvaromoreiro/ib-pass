(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtCreditCardsTransformer', PmtCreditCardsTransformer);

    PmtCreditCardsTransformer.$inject = ['PmtConstants', 'localStorageService'];
    function PmtCreditCardsTransformer(PmtConstants, localStorageService) {

        var service = {
            AddedInfoProvider: AddedInfoProvider,
        };

        return service;

        ////////////////

        /**
         * Returns an object with all the information about the customer's credit card and adds an attribute 
         * to determine with which provider a payment is possible
         * @param {Array<Object>} creditCardInfo All information about the customer's credit card returned by services
         */
        function AddedInfoProvider(creditCardInfo) {
            var customerCreditCards = angular.copy(creditCardInfo), i, j;
            if (customerCreditCards && customerCreditCards.length > 0) {
                for (i = 0; i < customerCreditCards.length; i++) {
                    if (customerCreditCards[i].creditCardInfo && customerCreditCards[i].creditCardInfo.length > 0) {
                        for (j = 0; j < customerCreditCards[i].creditCardInfo.length; j++) {
                            if (!customerCreditCards[i].provider && (customerCreditCards[i].creditCardInfo[j].type === PmtConstants.CREDIT_CARDS_PROVIDER.CREDIT_CARD || customerCreditCards[i].creditCardInfo[j].type === PmtConstants.CREDIT_CARDS_PROVIDER.IBERIA_PAY)) {
                                if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.ONHOLD) {
                                    customerCreditCards[i]['provider'] = {
                                        'ONHOLD_CREDITCARD': true,
                                        'ONHOLD_IBERIA_PAY': true
                                    };
                                } else {
                                    customerCreditCards[i]['provider'] = {
                                        'CREDITCARD': true,
                                        'IBERIA_PAY': true
                                    };
                                }
                                customerCreditCards[i]['cardNumber'] = customerCreditCards[i].creditCardInfo[j].type === PmtConstants.CREDIT_CARDS_PROVIDER.IBERIA_PAY ? customerCreditCards[i].creditCardInfo[j].mask : customerCreditCards[i].creditCardInfo[j].cardNumber;
                            }
                        }
                    }
                }
            }
            return customerCreditCards
        };
    }
})();