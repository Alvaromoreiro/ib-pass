(function () {
    'use strict';

    angular
        .module('ib-apis-visa-expiry-date-module')
        .controller('ApisVisaExpiryDateController', ApisVisaExpiryDateController);

    ApisVisaExpiryDateController.$inject = ['$rootScope', 'MmBAppConstants', 'IbDatesConstants', '$scope'];
    function ApisVisaExpiryDateController($rootScope, MmBAppConstants, IbDatesConstants, $scope) {
        var vm = this;

        vm.$onInit = activate;

        vm.documentNumber = true;
        vm.issueCountry = true;
        vm.expiryDate = true;

        var actualDate = new Date();
        var actualMonth = actualDate.getMonth() + 1;

        vm.availableMonths = [];
        vm.availableYears = [];
        vm.availableDays = [];

        vm.updateMonthExpiration = updateMonthExpiration;
        vm.updateYearExpiration = updateYearExpiration;
        vm.daysSelected = daysSelected;
        vm.monthsSelected = monthsSelected;
        vm.yearsSelected = yearsSelected;

        vm.controlVisaFields = controlVisaFields;

        $rootScope.$on('nextStep', controlVisaFields);


        function activate() {
            vm.showDay = true;
            vm.availableYears = initializeYears(vm.maximumYears);
            vm.availableDays = MmBAppConstants.DAYS_ARRAY.slice();
            vm.availableMonths = IbDatesConstants.MONTH_ARRAY.slice();
        }

        function controlVisaFields() {
            if ((vm.visa.number || vm.visa.issuerCountry) && (!vm.day || !vm.month || !vm.year)) {
                if (vm.containerForm.expiryVisaDateDay && vm.containerForm.expiryVisaDateMonth && vm.containerForm.expiryVisaDateYear) {
                    vm.containerForm.expiryVisaDateDay.$valid = false;
                    vm.containerForm.expiryVisaDateDay.$invalid = true;
                    vm.containerForm.expiryVisaDateDay.$error = { required: true };
                    vm.containerForm.expiryVisaDateMonth.$valid = false;
                    vm.containerForm.expiryVisaDateMonth.$invalid = true;
                    vm.containerForm.expiryVisaDateMonth.$error = { required: true };
                    vm.containerForm.expiryVisaDateYear.$valid = false;
                    vm.containerForm.expiryVisaDateYear.$invalid = true;
                    vm.containerForm.expiryVisaDateYear.$error = { required: true };
                }
            } else {
                if (vm.containerForm.expiryVisaDateDay && vm.containerForm.expiryVisaDateMonth && vm.containerForm.expiryVisaDateYear) {
                    vm.containerForm.expiryVisaDateDay.$valid = true;
                    vm.containerForm.expiryVisaDateDay.$invalid = false;
                    vm.containerForm.expiryVisaDateDay.$error = {};
                    vm.containerForm.expiryVisaDateMonth.$valid = true;
                    vm.containerForm.expiryVisaDateMonth.$invalid = false;
                    vm.containerForm.expiryVisaDateMonth.$error = {};
                    vm.containerForm.expiryVisaDateYear.$valid = true;
                    vm.containerForm.expiryVisaDateYear.$invalid = false;
                    vm.containerForm.expiryVisaDateYear.$error = {};
                }
            }
        }

        function initializeYears(maximumYears) {
            var index, currentYear, yearsArray = [], maxYears;
            currentYear = new Date().getFullYear();
            maxYears = currentYear + MmBAppConstants.DEFAULT_TO_YEARS;
            for (index = currentYear; index < maxYears; index++) {
                yearsArray.push(currentYear);
                currentYear++;
            }
            return yearsArray;
        }

        function throwSelectedDateEvent() {
            var emitDate = vm.showDay ? { 'day': vm.day, 'month': vm.month, 'year': vm.year } : { 'month': vm.month, 'year': vm.year };
            $scope.$emit('dateSelected', emitDate);
            controlVisaFields();
        }

        function updateMonthExpiration() {
            monthsSelected();
            var currentYear = (actualDate.getFullYear()) % 100;
            if (vm.month < actualMonth && vm.year + '' === currentYear + '') {
                vm.year = (currentYear + 1) + '';
            }
            throwSelectedDateEvent();
        }

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

        function getMonthsofYear() {
            var date = new Date();
            return IbDatesConstants.MONTH_ARRAY.slice().splice(date.getMonth(), IbDatesConstants.MONTH_ARRAY.length - 1);
        }

        function monthsSelected() {
            var currentDate = new Date(), currentDay = currentDate.getDate(),
                monthDays = vm.month && vm.year ? getDaysOfMonth(parseInt(vm.month), parseInt(vm.year)) : MmBAppConstants.DAYS_ARRAY.slice();
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
            } else if (vm.month === vm.availableMonths[0] && vm.year === vm.availableYears[0]) {
                vm.availableDays = monthDays.splice(currentDay - 1);
                if (parseInt(vm.day) < currentDay) {
                    vm.day = null;
                }
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
                vm.availableMonths = MmBAppConstants.MONTH_ARRAY.slice().splice(currentMonth - 1);
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
