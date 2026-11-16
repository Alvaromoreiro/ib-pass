(function () {


    // Usage: <ib-booking-calendar></ib-booking-calendar>
    //

    /* istanbul ignore next */
    angular.module('ib-booking-calendar-module')
        .component('ibBookingCalendar', {
            controller: 'BookingCalendarController',
            controllerAs: 'calendarCtrl',
            bindings: {
                originDestinations:'<',
                currentOriginDestinationIndex:'<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-booking-calendar.html';
            }]
        });
})();