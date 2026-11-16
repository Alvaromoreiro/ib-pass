(function () {
    'use strict';

    angular
        .module('ib-expiry-date-module')
        .controller('IbExpiryDateController', IbExpiryDateController);

    IbExpiryDateController.$inject = ['$scope', 'IbDatesConstants', 'MmBAppConstants'];
    function IbExpiryDateController($scope, IbDatesConstants, MmBAppConstants) {

        var vm = this;
        var actualDate = new Date();
        var actualMonth = actualDate.getMonth() + 1;

        vm.availableMonths = [];
        vm.availableYears = [];
        vm.availableDays = [];

        vm.$onInit = activate;
        vm.updateMonthExpiration = updateMonthExpiration;
        vm.updateYearExpiration = updateYearExpiration;
        vm.daysSelected = daysSelected;
        vm.monthsSelected = monthsSelected;
        vm.yearsSelected = yearsSelected;

        ////////////////

        function activate() {
            vm.availableYears = initializeYears(vm.maximumYears);
            vm.availableDays = MmBAppConstants.DAYS_ARRAY.slice();
            vm.availableMonths = IbDatesConstants.MONTH_ARRAY.slice();
        }

        /**
         * Initialize component availableYears depending on input component binding maximumYears
         * @param {int} maximumYears - the number of years since today's year to start the availableYears array
         * @returns {Array<String>} - the availableYears to select in the view
         */
        function initializeYears(maximumYears) {
            var index, currentYear, yearsArray = [], maxYears;
            currentYear = new Date().getFullYear();
            maxYears = currentYear + MmBAppConstants.DEFAULT_TO_YEARS;
            for (index = currentYear; index < maxYears; index++) {
                yearsArray.push(currentYear);
                currentYear++;
            }
            return yearsArray;
        };

        /**
         * Throws an event to parent controller. The event will be an object with the day, month and year properties
         */
        function throwSelectedDateEvent() {
            var emitDate = vm.showDay ? { 'day': vm.day, 'month': vm.month, 'year': vm.year } : { 'month': vm.month, 'year': vm.year };
            $scope.$emit('dateSelected', emitDate);
        };

        /**
        * @function
        * @name updateMonthExpiration
        * @desc Updates year if month is not in the array of months when user change the expiry month
        */
        function updateMonthExpiration() {
            monthsSelected();
            var currentYear = (actualDate.getFullYear()) % 100;
            if (vm.month < actualMonth && vm.year + '' === currentYear + '') {
                vm.year = (currentYear + 1) + '';
            }
            throwSelectedDateEvent();
        }

        /**
         * @function
         * @name updateExpiration
         * @desc Updates month and array of months when user change the expiry year
         */
        function updateYearExpiration() {
            yearsSelected();
            var currentYear = (actualDate.getFullYear()) % 100;
            if (vm.year !== vm.availableYears[0]) {
              vm.availableMonths = IbDatesConstants.MONTH_ARRAY.slice();
            }

            if (vm.month < actualMonth && vm.year + '' === currentYear + '') {
                vm.month = vm.availableMonths[actualMonth - 1];
                vm.availableMonths = getMonthsofYear();
            }
            throwSelectedDateEvent();
        }

        function daysSelected() {
            // Control if expiry date from wrong
            monthsSelected();
            yearsSelected();
            throwSelectedDateEvent();
        }

        /**
         * returns the array of months from input year and input month
         * @returns {Array<String>} - returns the array of days from input year and input month
         */
        function getMonthsofYear() {
            var date = new Date();
            return IbDatesConstants.MONTH_ARRAY.slice().splice(date.getMonth(), IbDatesConstants.MONTH_ARRAY.length - 1);
        }

        function monthsSelected() {
            var currentDate = new Date(),currentDay = currentDate.getDate(),
                monthDays = vm.month && vm.year ?  getDaysOfMonth(parseInt(vm.month), parseInt(vm.year)) : MmBAppConstants.DAYS_ARRAY.slice();
            throwSelectedDateEvent();
            if (vm.month === vm.availableMonths[0] && vm.year === vm.availableYears[0]) {
                vm.availableDays = monthDays.splice(currentDay - 1);
                if (parseInt(vm.day) < currentDay) {
                    vm.day = null;
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
        }

        function getDaysOfMonth(month, year) {
            var date = new Date();
            date.setFullYear(year, month, 0);
            //Copy array of days and return only the days of month
            return MmBAppConstants.DAYS_ARRAY.slice().splice(0, date.getDate());
        }

        function yearsSelected() {
            var currentDate = new Date(), currentMonth = currentDate.getMonth() + 1;
            if (vm.year === vm.availableYears[0]) {
                vm.availableMonths = MmBAppConstants.MONTH_ARRAY.slice().splice(currentMonth -1);
                if (parseInt(vm.month) < currentMonth) {
                    vm.month = vm.availableMonths[0];
                }
            } else if (vm.year === vm.availableYears[vm.availableYears.length - 1]) {
                vm.availableMonths = MmBAppConstants.MONTH_ARRAY.slice().splice(currentMonth - 1, MmBAppConstants.MONTH_ARRAY.length - 1);
                if (parseInt(vm.month) < currentMonth) {
                    vm.month = vm.availableMonths[0];
                }
            } else {
                vm.availableMonths = MmBAppConstants.MONTH_ARRAY.slice();
            }
            monthsSelected();
        }
    }
})();
