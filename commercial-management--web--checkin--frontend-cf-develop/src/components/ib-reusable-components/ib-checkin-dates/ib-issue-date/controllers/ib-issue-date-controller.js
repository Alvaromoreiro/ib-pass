(function () {
    'use strict';

    angular
        .module('ib-issue-date-module')
        .controller('IssueDateController', IssueDateController);

    IssueDateController.$inject = ['$scope', 'CheckinDatesConstants'];
    function IssueDateController($scope, CheckinDatesConstants) {

        var vm = this;
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth() + 1;
        var currentDay = currentDate.getDate();

        vm.availableMonths;
        vm.availableDays;
        vm.availableYears = [];

        vm.$onInit = activate;
        vm.updateMonthIssue = updateMonthIssue;
        vm.updateYearIssue = updateYearIssue;
        vm.onOpenClose = onOpenClose;

        $scope.$on('refreshModelEvent', activate);


        ////////////////

        function activate() {
            vm.availableYears = initializeYears(vm.maximumYears);
            vm.availableMonths = CheckinDatesConstants.MONTH_ARRAY.slice();
            vm.availableDays = CheckinDatesConstants.DAYS_ARRAY.slice();
            vm.dateRequired = angular.isDefined(vm.dateRequired) ? vm.dateRequired : true;
        };

        /**
         * Initialize component availableYears depending on input component binding maximumYears
         * @param {int} maximumYears - the number of years since today's year to start the availableYears array
         * @returns {Array<String>} - the availableYears to select in the view
         */
        function initializeYears(maximumYears) {
            var index, yearsArray = [];
            var currentYear = vm.showDay ? currentDate.getFullYear() : (currentDate.getFullYear() % 100);
            for (index = 0; index <= maximumYears; index++) {
                yearsArray[index] = !vm.showDay && currentYear < 10 ? '0' - currentYear : '' + currentYear;
                currentYear = vm.showDay ? (currentYear - 1) : ((currentYear - 1) % 100);
            }
            return yearsArray;
        };

        /**
         * Throws an event to parent controller. The event will be an object with the day, month and year properties
         */
        function throwSelectedDateEvent() {
            var issueDate = vm.showDay ? { 'day': vm.day, 'month': vm.month, 'year': vm.year } : { 'month': vm.month, 'year': vm.year };
            $scope.$emit('issueDateSelected', issueDate);
        };

        /**
        * @function
        * @name updateMonthIssue
        * @desc Updates year if month is not in the array of months when user change the expiry month
        */
        function updateMonthIssue() {
            var currentYear = vm.showDay ? currentDate.getFullYear() : (currentDate.getFullYear() % 100);
            vm.availableDays = vm.month && vm.year ? getDaysOfMonth(vm.month, vm.year) : CheckinDatesConstants.DAYS_ARRAY.slice();
            if (parseInt(vm.month) === currentMonth && vm.year + '' === currentYear + '') {
                vm.availableDays = vm.availableDays.splice(currentDay - 1, vm.availableDays.length);
            }
            vm.day = vm.day > vm.availableDays[vm.availableDays.length - 1] ? vm.availableDays[vm.availableDays.length - 1]
                : (vm.day < vm.availableDays[0] ? vm.availableDays[0] : vm.day);

            if ((parseInt(vm.month) > currentMonth || (vm.day > currentDay && parseInt(vm.month) === currentMonth)) && parseInt(vm.year) + '' === currentYear + '') {
                vm.day = currentDay;
                vm.availableDays = getDaysOfMonth(vm.month, vm.year).splice(0, currentDay);
                vm.availableMonths = getPreviousMonthsofYear();
                vm.month = vm.availableMonths[currentMonth - 1];
            }

            throwSelectedDateEvent();
        }

        /**
         * @function
         * @name updateExpiration
         * @desc Updates month and array of months when user change the expiry year
         */
        function updateYearIssue() {
            var currentYear = vm.showDay ? currentDate.getFullYear() : (currentDate.getFullYear() % 100);
            vm.availableMonths = CheckinDatesConstants.MONTH_ARRAY.slice();
            vm.availableDays = CheckinDatesConstants.DAYS_ARRAY.slice();
            if (parseInt(vm.month) >= currentMonth && vm.year === currentYear + '') {
                vm.month = vm.availableMonths[currentMonth - 1];
                vm.availableDays = getDaysOfMonth(vm.month, vm.year).splice(0, currentDay);
                vm.availableMonths = getPreviousMonthsofYear();
                if (vm.day > vm.availableDays[0]) {
                    vm.day = vm.availableDays[currentDay - 1];
                }
            } else if (parseInt(vm.day) <= currentDay && parseInt(vm.month) === currentMonth && vm.year === currentYear + '') {
                vm.availableDays = getDaysOfMonth(vm.month, vm.year).splice(currentDay - 1, vm.availableDays.length);
                vm.day = vm.availableDays[0];
            } else if (vm.month) {
                vm.availableDays = getDaysOfMonth(vm.month, vm.year);
                if (parseInt(vm.day) > vm.availableDays[vm.availableDays.length - 1]) {
                    vm.day = vm.availableDays[vm.availableDays.length - 1];
                }
            }
            throwSelectedDateEvent();
        }

        /**
         * returns the array of months from input year and input month
         * @returns {Array<String>} - returns the array of days from input year and input month
         */
        function getPreviousMonthsofYear() {
            return CheckinDatesConstants.MONTH_ARRAY.slice().splice(0, currentMonth);
        }

        /**
         * returns the array of days from input year and input month
         * @param {int} month - the month which we want to get the days
         * @param {int} year - the month which we want to get the days
         * @returns {Array<String>} - returns the array of days from input year and input month
         */
        function getDaysOfMonth(month, year) {
            var date = new Date();
            date.setFullYear(year, month, 0);
            return CheckinDatesConstants.DAYS_ARRAY.slice().splice(0, date.getDate());
        }

        function onOpenClose (isOpen, selectClass) {
            const input = document.querySelector(`#cki-apis-passenger-docs-issue-date .${selectClass} input`);
            if(isOpen && input.getAttribute('type') === 'search') {
                input.setAttribute('type', 'number');
                input.setAttribute('inputmode', 'numeric');
            }
        }

    }
})();
