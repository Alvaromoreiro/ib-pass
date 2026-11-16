(function () {


    angular
        .module('ib-booking-calendar-module')
        .controller('CalendarMatrixController', CalendarMatrixController);

    CalendarMatrixController.$inject = [ '$rootScope'];

    function CalendarMatrixController ( $rootScope) {

        const vm = this;

        vm.searchCalendarDayAvailability = searchCalendarDayAvailability;

        activate();

        function activate () {
        }



        /**
         * Emits an event to parents to notice that a calendar´s day have been selected, also sending day´s data.
         */
        function searchCalendarDayAvailability (selectedDay) {
            $rootScope.$emit('calendarDaySelected', selectedDay);
        }

    }

})();
