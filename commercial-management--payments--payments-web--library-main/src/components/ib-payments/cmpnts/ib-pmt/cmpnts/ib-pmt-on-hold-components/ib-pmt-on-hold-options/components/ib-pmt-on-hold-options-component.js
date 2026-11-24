(function () {
    'use strict';

    // Usage: <ib-pmt-on-hold-options></ib-pmt-on-hold-options>
    // 
    // Creates: 
    // 
    // A section for show to all passengers the different options to reservation of flight
    /* istanbul ignore next */
    angular.module('ib-pmt-on-hold-options-module')
        .component('ibPmtOnHoldOptions', {
            controller: 'IbPmtOnHoldOptionsController',
            controllerAs: 'onHoldOptionsCtrl',
            bindings: {
                onHoldOptions: '<',
                selectedOnHoldIndex: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-on-hold-options-view.html';
            }]
        });

})();