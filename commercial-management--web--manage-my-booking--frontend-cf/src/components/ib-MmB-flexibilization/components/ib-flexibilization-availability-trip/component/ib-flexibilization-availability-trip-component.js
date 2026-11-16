(function () {
    'use strict';

    // Usage: <ib-flexibilization-availability-trip model="myCtrl.myModel"></ib-flexibilization-availability-trip>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-availability-trip-module')
        .component('ibFlexibilizationAvailabilityTrip', {
            controller: 'IbFlexAvailabilityTripController',
            controllerAs: 'ibFlexTripCtrl',
            bindings: {
                slices: '<',
                slicesIndex: '<',
                listSlicesShow: '=',
                selectedSlices: '=',
                totalShow: '=',
                selectedDate: '=',
                updatedDateList: '<',
                showAvailability: '=',
                showErrorPage: '=',
                ribbonFlexData: '<',
                newSisterCities: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-availability-trip-view.html';
            }]
        });
})();