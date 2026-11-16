(function () {


    // Usage: <ib-booking-segment-details-info ></ib-booking-segment-details-info>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-booking-segment-details-info-module')
        .component('ibBookingSegmentDetailsInfo', {
            controller: 'BookingSegmentDetailsInfoController',
            controllerAs: 'segmentDetailsInfoCtrl',
            bindings: {
                segmentDetailsInfoModel: '<',
                originDestinationId: '@'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-segment-details-info-view.html';
            }]
        });

})();