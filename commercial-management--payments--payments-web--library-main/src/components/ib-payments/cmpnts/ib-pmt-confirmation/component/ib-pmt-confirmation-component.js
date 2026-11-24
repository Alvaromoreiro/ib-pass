import { ibPmtWithStylesHost } from '../../../../../styles/ib-pmt-styles-host';
(function () {
    'use strict';

    // Usage: <ib-pmt-confirmation as-component= "boolean"></ib-pmt-confirmation>
    // 
    // Creates:  show confirmation page
    // 

    /* istanbul ignore next */
    angular.module('ib-pmt-order-confirmation-module')
        .component('ibPmtConfirmation', {
            controller: ibPmtWithStylesHost('PmtConfirmationController'),
            controllerAs: 'pmtConfOrderCtrl',
            bindings: {
                asComponent: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-order-confirmation-view.html';
            }]
        });

})();