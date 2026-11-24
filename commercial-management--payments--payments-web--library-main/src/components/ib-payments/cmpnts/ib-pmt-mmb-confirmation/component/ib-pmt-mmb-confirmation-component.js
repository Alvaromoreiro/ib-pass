import { ibPmtWithStylesHost } from '../../../../../styles/ib-pmt-styles-host';
(function () {
    'use strict';

    angular.module('ib-pmt-mmb-confirmation-module')
        .component('ibPmtMmbConfirmation', {
            controller: ibPmtWithStylesHost('ConfirmationMMbController'),
            controllerAs: 'paymentConfirmationCtrl',
            bindings: {
                model: '=',
                asComponent: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-mmb-confirmation-view.html';
            }]
        });

})();