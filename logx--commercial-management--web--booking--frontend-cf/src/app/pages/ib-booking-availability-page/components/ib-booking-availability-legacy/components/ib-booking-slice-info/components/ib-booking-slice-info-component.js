(function () {


    // Usage: <ib-booking-slice-info ></ib-booking-slice-info>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-booking-slice-info-module')
        .component('ibBookingSliceInfo', {
            controller: 'BookingSliceInfoController',
            controllerAs: 'sliceInfoCtrl',
            bindings: {
                sliceInfoModel: '<',
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
                metaSearchInfo: '<',
                recommendedOfferId: '<',
                multiCity: '<',
                redemption: '<',
                flightRatio: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-slice-info-view.html';
            }]
        });

})();