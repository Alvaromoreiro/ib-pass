(function () {


    // Usage: <ib-booking-on-hold-now on-hold-info="" activate-button=""></ib-booking-on-hold-now>
    //
    // Creates: A HTML struture with on hold component.

    /* istanbul ignore next */
    angular.module('ib-booking-change-on-hold-now-module')
        .component('ibBookingChangeOnHoldNow', {
            controller: 'IbBookingChangeOnHoldNowController',
            controllerAs: 'changeOnHoldNowCtrl',
            bindings: {
                onHoldInfo: '<',
                showButton: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-change-on-hold-now-view.html';
            }]
        });
})();
