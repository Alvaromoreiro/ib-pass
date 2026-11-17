(function () {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 

    angular
        .module('ib-checkin-biometric-boarding-success-module')
        .component('ibCheckinBiometricBoardingSuccess', {
            controller: 'bioBoardingSuccessController',
            controllerAs: 'bioBoardingSuccessCtrl',
            bindings: {
                model: '=',
                bookingInfo: '='
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-checkin-biometric-boarding-success.html';
            }]
        });
})();