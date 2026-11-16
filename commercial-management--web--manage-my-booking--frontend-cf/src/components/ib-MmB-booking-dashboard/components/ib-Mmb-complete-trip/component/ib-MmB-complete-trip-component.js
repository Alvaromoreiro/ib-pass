(function () {
    'use strict';

    // Usage: <ib-MmB-complete-trip></ib-MmB-complete-trip>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-complete-trip-module')
        .component('ibMmbCompleteTrip', {
            controller: 'CompleteTripController',
            controllerAs: 'CompleteTripCtr',
            bindings: {
                isStopOver: '<',
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-complete-flight.html';
            }]
        });

})();