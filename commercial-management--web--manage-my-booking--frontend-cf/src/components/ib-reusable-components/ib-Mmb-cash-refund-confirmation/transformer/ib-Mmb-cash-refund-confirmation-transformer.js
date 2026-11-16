(function () {
    'use strict';

    angular
        .module('ib-Mmb-cash-refund-confirmation-module')
        .factory('CashRefundConfirmationTransformer', CashRefundConfirmationTransformer);

    CashRefundConfirmationTransformer.$inject = ['CurrencyService', 'localStorageService'];
    function CashRefundConfirmationTransformer(CurrencyService, localStorageService) {
        var service = {
            generateCashConfirmationData: generateCashConfirmationData,
            generateCashConfirmationRequest: generateCashConfirmationRequest
        };
        return service;

        ////////////////

        function generateCashConfirmationData(price) {
            var cashTotalPriceData = { 'price': 0, 'formattedPrice': '' }, cashCurrenciesList = localStorageService.get('cashCurrenciesList'), currencyObject = {}, currencyFound = false, currencyIndex = 0;

            while (!currencyFound && currencyIndex < cashCurrenciesList.length) {
                if (price.currency == cashCurrenciesList[currencyIndex].code) {
                    currencyFound = true;
                    currencyObject = cashCurrenciesList[currencyIndex];
                } else
                    currencyIndex++;
            }
            cashTotalPriceData.price = price.total;
            cashTotalPriceData.formattedPrice = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), price.total, true);
            return cashTotalPriceData;
        }

        function generateCashConfirmationRequest(flowId){
            var request = {};
            request.flowId = flowId;
            request.emailNotification = {};
            if(localStorageService.get('cashEmailNotification')){
                request.emailNotification = null;
            }else{
                request.emailNotification.email = localStorageService.get('cashEmailNotificationValue');
            }
            return request;
        }

    }

})();
