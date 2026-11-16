(function () {


    // Usage: <ib-booking-segment-info></ib-booking-segment-info>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-booking-segment-info-module')
        .component('ibBookingSegmentInfo', {
            controller: 'BookingSegmentInfoController',
            controllerAs: 'segmentInfoCtrl',
            bindings: {
                segmentInfoModel: '<',
                sliceInfoModel: '<',
                segmentIndex: '<',
                sliceIndex: '<',
                selectedSliceIndex: '<',
                showFaresSelected: '<',
                origin: '@',
                destination: '@',
                originDestinationId: '@',
                currencies: '<',
                currentOriginDestinationIndex: '<',
                selectedSlicesLength: '<',
                animationRun: '<',
                selectedSliceMode: '<',
                metaSearchInfo : '<',
                recommendedOfferId:'<',
                redemption: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-segment-info-view.html';
            }]
        });

})();