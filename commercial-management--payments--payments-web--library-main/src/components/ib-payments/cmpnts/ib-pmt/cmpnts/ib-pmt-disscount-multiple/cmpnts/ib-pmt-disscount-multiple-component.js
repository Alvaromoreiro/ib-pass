(function () {
    'use strict';

    // Usage: <ib-pmt-disscount-multiple ></ib-pmt-disscount>
    // 
    // Creates: A HTML struture with the info of the trip and teh info of the passengers who bought the ticket. 
    // The binding 'totalPrice' is a value binding with the formatted total price to show directly in the view
    // The binding 'trips'contains the trip information.
    // The binding 'passengers' Contains the information of all the passengers of the trip.

    /* istanbul ignore next */
    angular.module('ib-pmt-disscount-multiple-module')
        .component('ibPmtDisscountMultiple', {
            controller: 'IbPmtDisscountMultipleController',
            controllerAs: 'pmtDisMultiCtrl',
            bindings: {
                disscounts: '=',
                appliedDiscounts: '=',
                loggedInfo: '<',
                currency: '=',
                selectedData: '=',
                showOptions: '=',
                paymentInfo: '=',
                loadingVoucher: '<',
                creditCards: '<',
                summaryInfo: '=',
                paymentMethods: '<',
                paymentId: '<',
                formSubmitted: '=',
                loadingIframe: '=',
                template: '@'
            },
            templateUrl: ['$rootScope', '$attrs', function ($rootScope, $attrs) {
                var templates = {
                    'avios': $rootScope.routes.templates + 'ib-pmt-avios-view.html',
                    'voucher': $rootScope.routes.templates + 'ib-pmt-voucher-view.html',
                    'slider': $rootScope.routes.templates + 'ib-pmt-slider-tab-view.html'
                }
                return templates[$attrs.template];
            }]
        });
})();