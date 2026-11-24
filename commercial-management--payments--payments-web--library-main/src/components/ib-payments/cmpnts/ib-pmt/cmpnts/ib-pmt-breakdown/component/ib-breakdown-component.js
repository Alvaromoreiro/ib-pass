(function () {
    'use strict';

    // Usage:  <ib-breakdown breakdown-model="" price=""><ib-breakdown>
    //
    // Creates: A struture with payments summary to show in payments view

    /* istanbul ignore next */
    angular.module('ib-breakdown-module').component('ibBreakdown', {
        controller: 'BreakdownController',
        controllerAs: 'breakdownCtrl',
        bindings: {
            breakdownModel: '<',
            price: '<',
            flowApp: '<',
            breakdownDiscount: '<',
            summaryInfo: '<',
            totalPrice: '=',
            donationEnabled: '<',
            dccSelected: '<',
            currentDccData: '<'
        },
        templateUrl: [
            '$rootScope',
            function ($rootScope) {
                return $rootScope.routes.templates + 'ib-breakdown-view.html';
            }
        ]
    });
})();
