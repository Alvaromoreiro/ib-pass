(function () {
    'use strict';

    // Usage: <ib-passenger-info passenger-info=""></ib-passenger-info>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-passenger-info-module')
        .component('ibPassengerInfo', {
            controller: 'PassengerInfoController',
            controllerAs: 'pasInfoCtrl',
            bindings: {
                passengerInfo: '<',
                passengerStatus: '<',
                index: '<',
                companies: '<',
                pasForm: '=',
                isOpen: '<',
                length: '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-passenger-info-view.html';
            }]
        });

})();