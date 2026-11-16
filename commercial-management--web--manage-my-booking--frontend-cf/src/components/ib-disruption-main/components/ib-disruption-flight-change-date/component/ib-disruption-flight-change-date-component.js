(function () {
    'use strict';

    // Usage: <ib-disruption-flights-change-date></ib-disruption-flights-change-date>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-disruption-flight-change-date-module').component('ibDisruptionFlightChangeDate', {
        controller: 'DisruptionFlightChangeDateController',
        controllerAs: 'flightChangeDateCtrl',
        bindings: {
            model: '<',
            quadrigam: '<',
            dateSelectorNumber: '<',
            blackOutPeriodsData: '<',
            blackOutPeriodsText: '<',
            allowedPeriods: '<',
            sisterCitiesData: '=',
            genericDisruption: '<',
            rawSlicesInfo: '<'
        },
        templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
            return MmBAppConstants.templatesRoute + 'ib-disruption-flight-change-date-view.html';
        }]
    });
})();
