(function () {
    'use strict';

    // Usage: <ib-pmt-on-hold-free on-hold-info=""></ib-pmt-on-hold-free>
    // 
    // Creates: 
    // 

    /* istanbul ignore next */
    angular.module('ib-pmt-on-hold-free-module')
        .component('ibPmtOnHoldFree', {
            controller: 'IbPmtOnHoldFreeController',
            controllerAs: 'onHoldFreeCtrl',
            bindings: {
                onHoldInfo: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-on-hold-free-view.html';
            }]
        });

})();