(function () {
    'use strict';

    angular
        .module('ib-reusable-module')
        .directive('ibPaypalPmtButton', ibPaypalPmtButton);

    /* istanbul ignore next */
    ibPaypalPmtButton.$inject = ['$rootScope', 'localStorageService', 'PmtConstants', 'CheckoutPayPalInfoService', 'PmtService', 'PmtUtilsService'];
    function ibPaypalPmtButton($rootScope, localStorageService, PmtConstants, CheckoutPayPalInfoService, PmtService, PmtUtilsService) {
        // Usage: <div id="paypal-button" ib-paypal-pmt-button></div>
        //
        // Creates: Render paypal button to checkout an order
        //
        var directive = {
            link: link,
            restrict: 'A',
        };
        return directive;

        function link($scope) {
            var paypalEnv;
            $rootScope.production ? paypalEnv = 'production' : paypalEnv = 'sandbox';
            if (angular.isUndefined(paypal)) {
                $scope.$emit('paypalUndefinedEvent', true);
            } else {
                paypal.Button.render({
                    env: paypalEnv, //'sandbox' Or 'production'
                    client: {
                        sandbox: PmtConstants.CLIENT_ID.SANDBOX,
                        production: PmtConstants.CLIENT_ID.PRODUCTION
                    },
                    locale: PmtUtilsService.getLanguagePaypal(),
                    style: {
                        label: 'checkout',
                        size: 'responsive',    // small | medium | large | responsive
                        shape: 'rect',     // pill | rect
                        color: 'blue'      // gold | blue | silver | black
                    },
                    // Set up the payment:
                    // 1. Add a payment callback
                    payment: function (data, actions) {
                        // 2. Make a request to your server
                        return CheckoutPayPalInfoService.getCheckoutInfo(localStorageService.get('paymentsInfo').paymentId, localStorageService.get('orderId'), $rootScope.serviceURI).then(function (response) {
                            $scope.$emit('payWithPaypal', response.token);
                            return response.token;
                        }, function (error) {
                            return error;
                        });
                    },
                    // Execute the payment:
                    // 1. Add an onAuthorize callback
                    onAuthorize: function (data, actions) {
                        var model = localStorageService.get('redirectionPaymentCallback').data;
                        angular.extend(model.paymentInfo.paymentMethods[model.selectedData.selectedTab], { 'paypalToken': localStorageService.get('redirectionPaymentCallback').paypalToken, 'paypalPayerId': data.payerID });
                        localStorageService.set('redirectionPaymentCallback', angular.extend(localStorageService.get('redirectionPaymentCallback'), { 'paypalPayerId': data.payerID }));
                        localStorageService.set('paymentType', PmtConstants.PAYMENT_TYPES.PAYPAL);
                        localStorageService.set('paypalDataForBin', localStorageService.get('redirectionPaymentCallback'));
                        localStorageService.set('summaryAncillaries', model.summaryInfo.ancillaries);
                        // 2. Make a request to your server
                        return PmtService.submitPayment(model, $rootScope.serviceURI, false).then(function () {
                            $scope.$emit('paypalPaymentSuccessEvent')
                        }, angular.noop);
                    },

                    //Enabled or disabled Button Paypal
                    validate: function (actions) {
                        toggleButton(actions);
                        onChangeCheckbox(function () {
                            toggleButton(actions);
                        });
                    },
                    onClick: function () {
                        submitForm();
                    }
                }, '#paypal-button');
            }
            function isValid() {
                return angular.element('#check_terms_conditions')[0].checked;
            }
            function onChangeCheckbox(handler) {
                angular.element('#check_terms_conditions').on('click', handler);
            }
            function submitForm() {
                $scope.$emit('submitFormEvent');
            }
            function toggleButton(actions) {
                if (angular.element('#paypal-button')[0])
                    return isValid() ? actions.enable() : actions.disable();
            }
        }

    }

})();