import { ibPmtWithStylesHost } from '../../../../../styles/ib-pmt-styles-host';
(function () {
    'use strict';
    angular.module('ib-pmt-gift-cards-confirmation-module')
        .component('ibGigtCardsConfirmation', {
            controller: ibPmtWithStylesHost('GiftCardsConfirmationController'),
            controllerAs: 'confirmationCtrl',
            bindings: {
                
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-gift-cards-confirmation-view.html';
            }]
        });

})();