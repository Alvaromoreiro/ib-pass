import { ibPmtWithStylesHost } from '../../../../../styles/ib-pmt-styles-host';
(function () {
    'use strict';

    // Usage: <ib-pmt as-component="boolean"></ib-pmt>
    // 
    // Creates: A HTML struture with the total price info. 
    // The binding 'totalPrice' is a value binding with the formatted total price 
    // to show directly in the view

    /* istanbul ignore next */
    angular.module('ib-pmt-module')
        .component('ibPmt', {
            controller: ibPmtWithStylesHost('PmtPageController'),
            controllerAs: 'paymentCtrl',
            bindings: {
                asComponent: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-view.html';
            }]
        });
})();