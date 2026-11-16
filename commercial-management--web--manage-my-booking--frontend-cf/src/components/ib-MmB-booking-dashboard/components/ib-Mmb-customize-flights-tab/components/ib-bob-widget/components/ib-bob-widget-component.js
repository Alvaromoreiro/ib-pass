(function () {
    'use strict';

    // Usage: <ib-booking-hotels check-in-date="" check-out-date="" destination-code=""></ib-booking-hotels>
    // 
    // Creates: A HTML struture with the info of the trip and teh info of the passengers who bought the ticket. 
    // The binding 'totalPrice' is a value binding with the formatted total price to show directly in the view
    // The binding 'trips'contains the trip information.
    // The binding 'passengers' Contains the information of all the passengers of the trip.

    /* istanbul ignore next */
    angular.module('ib-bob-widget-module')
        .component('ibBobWidget', {
            controller: 'BobWidgetController',
            controllerAs: 'bobWidgetCtrl',
            bindings: {
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-bob-widget-view.html';
            }]
        });
})();