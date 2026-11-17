(function () {
    'use strict';

    // Usage: <ib-passenger-deinvoicing-info-module></ib-passenger-deinvoicing-info-module>

    angular
        .module('ib-passenger-deinvoicing-info-module')
        .component('ibPassengerDeinvoicingInfo', {
            controller: 'PassengerDeinvoicingInfoController',
            controllerAs: 'PasDeinvoicingInfoCtrl',
            bindings: {
                'passengerInfo': '<',
                'index': '<',
                'companies': '<',
                'pasForm': '=',
                'isOpen': '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-passenger-deinvoicing-info.html';
            }]
        });
})();