(function () {
    ;

    // Usage: <ib-booking-slider-calendar></ib-booking-slider-calendar>

    /* istanbul ignore next */
    angular.module('ib-booking-calendar-module')
        .component('ibBookingSliderCalendar', {
            controller: 'SliderCalendarController',
            controllerAs: 'sldrCalendarCtrl',
            bindings: {
                sliderModel:'<',
                monthIndex:'='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-booking-slider-calendar.html';
            }]
        });
})();