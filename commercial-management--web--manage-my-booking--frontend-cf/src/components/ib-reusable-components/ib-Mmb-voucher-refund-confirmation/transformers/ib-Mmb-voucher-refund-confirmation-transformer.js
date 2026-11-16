(function () {
    'use strict';

    angular
        .module('ib-Mmb-voucher-refund-confirmation-module')
        .factory('VoucherRefundConfirmationTransformer', VoucherRefundConfirmationTransformer);

    VoucherRefundConfirmationTransformer.$inject = ['MmBAppConstants', '$rootScope', 'CurrencyService', 'localStorageService'];
    function VoucherRefundConfirmationTransformer(MmBAppConstants, $rootScope, CurrencyService, localStorageService) {
        var service = {
            generateVoucherData: generateVoucherData,
            generateConfirmationRefundRequest: generateConfirmationRefundRequest
        };
        return service;

        ////////////////

        function generateVoucherData(voucherInfo, voucherPriceInfo, price, currency) {
            var voucherData = {}, voucherIndex, vouchersInfo = [], currentVoucherInfo, currencyInfo, voucherCurrenciesList = localStorageService.get('voucherCurrenciesList'), currencyObject = {}, currencyFound = false, currencyIndex = 0, voucherTotalPriceData = {
                'price': 0,
                'formattedPrice': '',
                'priceWOPercentage': 0,
                'priceWOPercentageFormatted': '',
                'percentagePrice': 0,
                'percentagePriceFormatted': 0,
                'percentage': '',
                'currency': ''
            };

            while (!currencyFound && currencyIndex < voucherCurrenciesList.length) {
                if (voucherPriceInfo.currency == voucherCurrenciesList[currencyIndex].code) {
                    currencyFound = true;
                    currencyObject = voucherCurrenciesList[currencyIndex];
                } else
                    currencyIndex++;
            }

            /*currencyInfo = localStorageService.get('orderCurrency');
            currencyInfo ? angular.noop : currencyInfo = CurrencyService.getCurrencyObject(localStorageService.get('currency'));*/

            voucherTotalPriceData.price = price;
            voucherTotalPriceData.formattedPrice = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), voucherPriceInfo.totalRefund, true);
            voucherTotalPriceData.currency = voucherPriceInfo.currency;
            voucherTotalPriceData.priceWOPercentage = voucherPriceInfo.fare;
            voucherTotalPriceData.priceWOPercentageFormatted = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), voucherPriceInfo.fare, true);
            voucherTotalPriceData.percentagePrice = voucherPriceInfo.extraVoucherAmount;
            voucherTotalPriceData.percentagePriceFormatted = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), voucherPriceInfo.extraVoucherAmount, true);
            voucherTotalPriceData.percentage = voucherPriceInfo.extraVoucherPercent !== 0 ? voucherPriceInfo.extraVoucherPercent + '%' : angular.noop;


            voucherData['totalPriceInfoObject'] = voucherTotalPriceData;
            voucherData['hasMoreThanOneVouchers'] = false;

            if (voucherInfo.vouchers.length > 1) {
                for (voucherIndex = 0; voucherIndex < voucherInfo.vouchers.length; voucherIndex++) {
                    currentVoucherInfo = {
                        'code': '',
                        'price': 0,
                        'formattedPrice': '',
                        'passengerName': ''
                    };

                    currentVoucherInfo.code = voucherInfo.vouchers[voucherIndex].voucherCode;
                    currentVoucherInfo.price = voucherInfo.vouchers[voucherIndex].price.fare;
                    currentVoucherInfo.formattedPrice = CurrencyService.formatPrice(CurrencyService.getCurrencyObject(currencyObject), voucherInfo.vouchers[voucherIndex].price.totalRefund, true);
                    currentVoucherInfo.passengerName = getPassengerName(voucherInfo.vouchers[voucherIndex].passenger);

                    vouchersInfo.push(currentVoucherInfo);
                }

                voucherData['hasMoreThanOneVouchers'] = true;
                voucherData['voucherList'] = vouchersInfo;
            }

            return voucherData;


            function getPassengerName(passenger) {
                var fullName = '';
                if (passenger.externalPersonalInfo) {
                    fullName = passenger.externalPersonalInfo.name + ' ' + passenger.externalPersonalInfo.firstSurname + ' ' + passenger.externalPersonalInfo.lastSurname;
                } else {
                    fullName = passenger.firstName + ' ' + passenger.firstSurname;
                }
                return fullName;
            }
        }

        /**
         * Generates request object for confirmation service
         * @param {Object} data
         */
        function generateConfirmationRefundRequest(data) {
            var voucherRequest;
            voucherRequest = { 'flowId': '', 'unifyVouchers': false, 'emailNotification': { 'email': '' } };
            voucherRequest.flowId = localStorageService.get('flowId');
            if (data && data === 'ONE') {
                voucherRequest.unifyVouchers = true;
            }
            if (localStorageService.get('voucherEmailNotification')) {
                voucherRequest.emailNotification = null;
            } else {
                voucherRequest.emailNotification.email = localStorageService.get('voucherEmailNotificationValue');
            }
            return voucherRequest;
        }


    }

})();
