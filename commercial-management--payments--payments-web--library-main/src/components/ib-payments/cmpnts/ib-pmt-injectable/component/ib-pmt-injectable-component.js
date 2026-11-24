import { ibPmtWithStylesHost } from '../../../../../styles/ib-pmt-styles-host';
(function () {
    'use strict';

    // Usage: <ib-pmt-injectable as-component="boolean"></ib-pmt-injectable>
    // 
    // Creates: A HTML struture with the total price info. 
    // The binding 'totalPrice' is a value binding with the formatted total price 
    // to show directly in the view

    /* istanbul ignore next */
    angular.module('ib-pmt-injectable-module')
        .component('ibPmtInjectable', {
            controller: ibPmtWithStylesHost('PmtInjectableController'),
            controllerAs: 'pmtCtrl',
            bindings: {
                asComponent: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-injectable-view.html';
            }]
        });
})();