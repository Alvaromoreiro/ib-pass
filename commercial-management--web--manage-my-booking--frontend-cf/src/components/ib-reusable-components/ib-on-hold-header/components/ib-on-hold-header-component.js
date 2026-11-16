(function () {
    'use strict';

    // Usage: <ib-on-hold-header></ib-on-hold-header>
    // 
    // Creates: The header for on hold flow, with information about the trip
    /* istanbul ignore next */
    angular.module('ib-on-hold-header-module')
        .component('ibOnHoldHeader', {
            controller: 'IbOnHoldHeaderController',
            controllerAs: 'onHoldHeaderCtrl',
            bindings: {
                bookingInfo: '<',
                loginButton: '<',
                loggedInfo: '<',
                position: '<',
                closeSession: '<',
                hideExtendedInfo: '<',
                customerData: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-on-hold-header.html';
            }]
        });

})();