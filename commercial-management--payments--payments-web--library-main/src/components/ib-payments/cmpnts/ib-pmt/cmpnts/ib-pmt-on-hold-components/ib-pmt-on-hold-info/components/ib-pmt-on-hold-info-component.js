(function () {
    'use strict';

    // Usage: <ib-pmt-on-hold-info></ib-pmt-on-hold-info>
    // 
    // Creates: 
    // 

    /* istanbul ignore next */
    angular.module('ib-pmt-on-hold-info-module')
        .component('ibPmtOnHoldInfo', {
            controller: 'IbPmtOnHoldInfoController',
            controllerAs: 'onHoldInfoCtrl',
            bindings: {
                optionInfo: '<',
                optionIndex: '<',
                selectedOnHoldIndex: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-on-hold-info-view.html';
            }]
        });

})();