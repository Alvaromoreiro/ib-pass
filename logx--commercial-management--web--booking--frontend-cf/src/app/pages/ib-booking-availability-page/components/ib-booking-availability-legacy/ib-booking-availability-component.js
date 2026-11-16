(function () {
    angular.module('ib-booking-availability-module')
        .component('ibBookingAvailabilityComponent', {
            controller: 'AvailabilityController',
            controllerAs: 'availabilityCtrl',
            bindings: {},
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-booking-availability-view.html';
            }]
        });

})();