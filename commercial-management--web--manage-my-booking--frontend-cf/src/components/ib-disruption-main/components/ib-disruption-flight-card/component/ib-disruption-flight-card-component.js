(function () {
    'use strict';

    // Usage: <ib-disruption-flight-card></ib-disruption-flight-card>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-disruption-flight-card-module')
        .component('ibDisruptionFlightCardComponent', {
            controller: 'DisruptionFlightCardController',
            controllerAs: 'flightCtrl',
            bindings: {
                data: '=',
                channel : '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-disruption-flight-card-view.html';
            }]
        });
})();
