(function () {
    'use strict';

    // Usage: <ib-flight-confirmation-details confirm-details-model="" title=""></ib-flight-confirmation-details>
    // 
    // Creates: Creates the segment confirmation details info
    /* istanbul ignore next */
    angular
        .module('ib-flight-confirmation-details-module')
        .component('ibFlightConfirmationDetails', {
            controller: 'FlightConfirmationDetailsController',
            controllerAs: 'confirmDetailsCtrl',
            bindings: {
                confirmDetailsModel: '<',
                titleFlight: '@'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flight-confirmation-details-view.html';
            }]
        });
})();