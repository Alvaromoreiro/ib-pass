(function () {
    'use strict';

    angular
        .module('ib-passenger-cki-birth-date-module')
        .controller('PassengerCkiBirthDateController', PassengerCkiBirthDateController);

    PassengerCkiBirthDateController.$inject = ['$scope', 'CheckinDatesConstants', 'localStorageService'];
    function PassengerCkiBirthDateController($scope, CheckinDatesConstants, localStorageService) {

        var vm = this;

        vm.availableDays;
        vm.availableMonths;
        vm.availableYears;

        vm.$onInit = activate;
        vm.daysSelected = daysSelected;
        vm.monthsSelected = monthsSelected;
        vm.yearsSelected = yearsSelected;
        vm.onOpenClose = onOpenClose;
        $scope.$on('controlBirthDate', controlBirthDate);

        ////////////////

        function activate() {
            var birthDate = localStorageService.get('birthDate'), birthDateSplit;
            vm.availableYears = initializeYears(vm.yearsFrom, vm.yearsTo);
            vm.availableDays = CheckinDatesConstants.DAYS_ARRAY.slice();
            vm.availableMonths = CheckinDatesConstants.MONTH_ARRAY.slice();
            vm.haveBirthDate = false;
            if (birthDate && birthDate.length > 0) {
                birthDateSplit = birthDate.split("-");
                vm.day = birthDateSplit[2];
                vm.month = birthDateSplit[1];
                vm.year = birthDateSplit[0];
            }
        };

        /**
         * Initialize component availableYears depending on input component binding yearsFrom and yearsTo
         * @param {int} numberYearsfrom - the number of years since today's year to start the availableYears array
         * @param {int} numberYearsTo -the maximum number years to show in the availableYears array since today´s year
         * @returns {Array<String>} - the availableYears to select in the view
         */
        function initializeYears(numberYearsfrom, numberYearsTo) {
            var index, currentYear, yearsArray = [], maxYears;
            numberYearsfrom = numberYearsfrom || CheckinDatesConstants.DEFAULT_FROM_YEARS;
            numberYearsTo = numberYearsTo || CheckinDatesConstants.DEFAULT_TO_YEARS;
            maxYears = numberYearsTo - numberYearsfrom;
            currentYear = new Date().getFullYear() - numberYearsfrom;
            for (index = 0; index <= maxYears; index++) {
                yearsArray.push(currentYear);
                currentYear--;
            }
            return yearsArray;
        };

        /**
         * Throws an event to parent controller. The event will be an object with the day, month and year properties
         */
        function throwSelectedDateEvent() {
            $scope.$emit('birthDateSelected', { 'day': vm.day, 'month': vm.month, 'year': vm.year });
        };

        /**
         * returns the array of days from input year and input month
         * @param {int} month - the month which we want to get the days
         * @param {int} year - the month which we want to get the days
         * @returns {Array<String>} - returns the array of days from input year and input month
         */
        function getDaysOfMonth(month, year) {
            var date = new Date();
            date.setFullYear(year, month, 0);
            //Copy array of days and return only the days of month
            return CheckinDatesConstants.DAYS_ARRAY.slice().splice(0, date.getDate());
        }

        function daysSelected() {
            throwSelectedDateEvent();
        };

        function monthsSelected() {
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth() + 1,
                currentDay = currentDate.getDate(),
                monthDays = vm.month && vm.year ? getDaysOfMonth(parseInt(vm.month), parseInt(vm.year)) : CheckinDatesConstants.DAYS_ARRAY.slice();
            throwSelectedDateEvent();
            if (vm.month === vm.availableMonths[vm.availableMonths.length - 1] && vm.year === vm.availableYears[0]) {
                vm.availableDays = monthDays.splice(0, currentDay - 1);
                if (parseInt(vm.day) > currentDay) {
                    vm.day = vm.availableDays[vm.availableDays.length - 1];
                }
            } else if (vm.month === vm.availableMonths[0] && vm.year === vm.availableYears[vm.availableYears.length - 1]) {
                vm.availableDays = monthDays.splice(currentDay - 1, monthDays.length - 1);
                vm.day = parseInt(vm.day) < currentDay ? vm.availableDays[0]
                    : parseInt(vm.day) > parseInt(vm.availableDays[vm.availableDays.length - 1]) ? vm.availableDays[vm.availableDays.length - 1]
                        : vm.day;
            } else {
                vm.availableDays = monthDays;
                if (parseInt(vm.day) > parseInt(vm.availableDays[vm.availableDays.length - 1])) {
                    vm.day = vm.availableDays[vm.availableDays.length - 1];
                }
            }
        };

        function yearsSelected() {
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth() + 1,
                currentDay = currentDate.getDate(),
                currentMonthDays = getDaysOfMonth(currentMonth, parseInt(vm.year ? vm.year : vm.availableYears[0]));
            if (vm.year === vm.availableYears[0]) {
                vm.availableMonths = CheckinDatesConstants.MONTH_ARRAY.slice().splice(0, currentMonth);
                if (parseInt(vm.month) > currentMonth) {
                    vm.month = vm.availableMonths[vm.availableMonths.length - 1];
                }
            } else if (vm.year === vm.availableYears[vm.availableYears.length - 1]) {
                vm.availableMonths = CheckinDatesConstants.MONTH_ARRAY.slice().splice(currentMonth - 1, CheckinDatesConstants.MONTH_ARRAY.length - 1);
                if (parseInt(vm.month) < currentMonth) {
                    vm.month = vm.availableMonths[0];
                }
            } else {
                vm.availableMonths = CheckinDatesConstants.MONTH_ARRAY.slice();
            }
            monthsSelected();
        };

        function controlBirthDate (evt) {
            vm.day = '';
            vm.month = '';
            vm.year = '';
        }

        function onOpenClose (isOpen, selectClass) {
            const input = document.querySelector(`#${vm.nameId}-${vm.index} .${selectClass} input`);
            if(isOpen && input.getAttribute('type') === 'search') {
                input.setAttribute('type', 'number');
                input.setAttribute('inputmode', 'numeric');
            }
        }
    }
})();
