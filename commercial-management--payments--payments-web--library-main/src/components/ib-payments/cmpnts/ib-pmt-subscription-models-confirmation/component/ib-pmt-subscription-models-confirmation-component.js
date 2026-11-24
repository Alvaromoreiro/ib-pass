import { ibPmtWithStylesHost } from '../../../../../styles/ib-pmt-styles-host';
(function () {
    'use strict';
    angular.module('ib-pmt-subscription-models-confirmation-module')
        .component('ibSubscriptionModelsConfirmation', {
            controller: ibPmtWithStylesHost('SubscriptionModelsConfirmationController'),
            controllerAs: 'confirmationCtrl',
            bindings: {
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-gift-cards-confirmation-view.html';
            }]
        });

})();