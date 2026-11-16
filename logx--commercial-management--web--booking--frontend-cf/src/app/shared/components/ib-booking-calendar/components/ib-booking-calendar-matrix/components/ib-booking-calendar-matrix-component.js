(function () {


    // Usage: <ib-booking-calendar-matrix></ib-booking-calendar-matrix>
    // ib-booking-calendar-matrix

    /* istanbul ignore next */
    angular.module('ib-booking-calendar-module')
        .component('ibBookingCalendarMatrix', {
            controller: 'CalendarMatrixController',
            controllerAs: 'calendarMatrixCtrl',
            bindings: {
                matrixModel:'='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-booking-calendar-matrix.html';
            }]
        });
})();