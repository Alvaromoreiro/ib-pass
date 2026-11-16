(function () {


    angular
        .module('ib-booking-calendar-module')
        .controller('SliderCalendarController', SliderCalendarController);

    SliderCalendarController.$inject = ['$scope'];
    function SliderCalendarController ($scope) {

        const vm = this;
        vm.changeMonth = changeMonth;
        activate();

        function activate () {

        }

        function changeMonth (index) {
            vm.monthIndex=index;
            $scope.$emit('calendarChangeMonth',index);
        }
    }

})();