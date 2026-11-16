(function () {
    'use strict';

    // Usage: <ib-MmB-flights-card></ib-MmB-flights-card>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-MmB-flights-card-module')
        .component('ibMmbFlightsCard', {
            controller: 'MmBFlightsController',
            controllerAs: 'flightCardCtrl',
            bindings: {
                model: '=',
                index: '=',
                documents: '=?'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-flights-card-view.html';
            }]
        });
})();
