(function () {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('ib-your-flight-info-pa-module')
        .component('ibYourFlightInfoPa', {
            controller: 'YourFlightInfoPAController',
            controllerAs: 'yourFlightInfoCtrl',
            bindings: {
                yourFlightInfoModel: '<',
                title:'@'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-your-flight-info-pa-view.html';
            }]
        });
})();