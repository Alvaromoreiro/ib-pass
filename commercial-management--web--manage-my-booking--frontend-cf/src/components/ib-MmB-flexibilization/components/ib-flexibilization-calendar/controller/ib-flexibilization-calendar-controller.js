import dayjs from 'dayjs';

(function () {
    'use strict';

    angular
        .module('ib-flexibilization-calendar-module')
        .controller('IbFlexibilizationCalendarController', IbFlexibilizationCalendarController);

    IbFlexibilizationCalendarController.$inject = ['MmBModalService', '$scope', '$timeout', 'localStorageService'];
    function IbFlexibilizationCalendarController(MmBModalService, $scope, $timeout, localStorageService) {
        var vm = this;
        vm.$onInit = activate;
        vm.changeDay = changeDay;
        vm.selectNewDate = selectNewDate;
        vm.generateDateListWithServiceData = generateDateListWithServiceData;
        vm.addNewDays = addNewDays;
        vm.modifyDateList = modifyDateList;
        vm.returnToOriginalSelect = returnToOriginalSelect;
        $scope.$on('availabilityChanged', returnToOriginalSelect);
        $scope.$on('ribbonFlexDataUpdate', addNewDays);

        //////////////////////

        function activate() {
            vm.model = {};
            vm.model.newDateList = [];
            vm.blockChangeDateRight = false;
            vm.blockChangeDateLeft = false;
            vm.model.dateListLength = 7;
            vm.model.selectedIndex = +vm.slicesIndex;
            vm.model.originalSelect = angular.copy(vm.selectedDate[vm.model.selectedIndex]);
            vm.model.dateList = generateDateListWithServiceData(vm.selectedDate[vm.model.selectedIndex], vm.ribbonFlexData, true);
        };



        /**
        * This function init the calendar with all data return by ribbon services.
        * @param {Object} selectedDate All information about select date.
        * @param {Object} ribbonFlexData All data return by service
        * @param {Boolean} initList indicate that is the firs call to this functions and assign value to selectedPreviousDate
        * @returns {Array} newDateList with all object about 7 days.
        *  */
        function generateDateListWithServiceData(selectedDate, ribbonFlexData, initList) {
            var newDateList = [], i, j;

            for (i = 0; i < ribbonFlexData.calendarsRibbon.length; i++) {
                if (ribbonFlexData.calendarsRibbon[i].sliceId === selectedDate.tripSliceId) {
                    for (j = 0; j < ribbonFlexData.calendarsRibbon[i].cells.length; j++) {
                        newDateList[j] = {
                            'date': dayjs(ribbonFlexData.calendarsRibbon[i].cells[j].boundDate),
                            'isSelected': ribbonFlexData.calendarsRibbon[i].cells[j].selectedDate,
                            'isAvailable': ribbonFlexData.calendarsRibbon[i].cells[j].available,
                            'tripSliceId': selectedDate.tripSliceId,
                            'isLoading': false
                        };
                        if (newDateList[j].isSelected && initList) {
                            vm.selectedPreviousDate = newDateList[j];
                        };
                    }
                }
            };

            return newDateList;
        };


        /**
         * This function is launched when user do click in arrow right or left.
         * @param {Boolean} isNext indicate if selected arrow right (true) or arror left (false).
         *  */
        function changeDay(isNext) {
            var dateTosearch = null;
            dateTosearch = isNext ? angular.copy(vm.model.dateList[vm.model.dateList.length - 1]) : angular.copy(vm.model.dateList[0]);

            if (isNext && !vm.blockChangeDateRight) {
                dateTosearch.date.add(1, 'day');
                if (vm.model.newDateList.length > 0 && dateTosearch.date > dayjs().startOf('day') && dateTosearch.date < vm.model.newDateList[vm.model.newDateList.length - 1].date) {
                    modifyDateList(vm.model.newDateList, vm.model.dateList, isNext);
                } else {
                    if (dateTosearch.date < dayjs().startOf('day') || (vm.selectedDate.length > 1 && vm.model.selectedIndex === 0 && dateTosearch.date > vm.selectedDate[1].date) || (vm.selectedDate.length > 1 && vm.model.selectedIndex === 1 && dateTosearch.date < vm.selectedDate[0].date)) {
                        generateFakeDay();
                    } else {
                        vm.blockChangeDateRight = true;
                        vm.model.dateList[vm.model.dateList.length - 1].isLoading = true;
                        $scope.$emit('nextDatesSearch', isNext, dateTosearch, vm.model.selectedIndex);
                    }
                };
            } else if (!isNext && !vm.blockChangeDateLeft) {
                if (vm.model.newDateList.length > 0 && dateTosearch.date > vm.model.newDateList[0].date) {
                    modifyDateList(vm.model.newDateList, vm.model.dateList, isNext);
                } else {
                    if ((vm.model.selectedIndex === 0 && (dateTosearch.date < dayjs().startOf('day') || (vm.selectedDate.length > 1 && dateTosearch.date > vm.selectedDate[1].date))) || (vm.selectedDate.length > 1 && vm.model.selectedIndex === 1 && dateTosearch.date < vm.selectedDate[0].date)) {
                        generateFakeDay();
                    } else {
                        vm.blockChangeDateLeft = true;
                        vm.model.dateList[0].isLoading = true;
                        $scope.$emit('nextDatesSearch', isNext, dateTosearch, vm.model.selectedIndex);
                    }
                };
            };


            function generateFakeDay() {
                var newDate;
                if (isNext) {
                    newDate = new Date(angular.copy(vm.model.dateList[vm.model.dateList.length - 1].date));
                    newDate.setDate(newDate.getDate() + 1);
                    vm.model.dateList.shift();
                    vm.model.dateList.push({
                        'date': dayjs(newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()),
                        'isSelected': false,
                        'isAvailable': false,
                        'tripSliceId': vm.model.dateList[0].tripSliceId,
                        'isLoading': false
                    });

                    desactiveArrow(isNext);
                } else {
                    newDate = new Date(angular.copy(vm.model.dateList[0].date));
                    newDate.setDate(newDate.getDate() - 1);
                    vm.model.dateList.pop();
                    vm.model.dateList.unshift({
                        'date': dayjs(newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getDate()),
                        'isSelected': false,
                        'isAvailable': false,
                        'tripSliceId': vm.model.dateList[0].tripSliceId,
                        'isLoading': false
                    });

                    desactiveArrow(isNext);
                }
                vm.model.newDateList = angular.copy(vm.model.dateList);
            }
        };

        /**
         *
         * This function is called when user select a new day to search more availability.
         * This functions call at avaialbiliy service with new date selected. If date is not available, assign the before date to model.
         * @param {index} index indicate the position the object in the array of dateList
         *  */
        function selectNewDate(index) {
            if (vm.model.dateList[index].isAvailable) {
                vm.selectedPreviousDate = vm.model.dateList[index];
                MmBModalService.showWaitingModal();
                $scope.$emit('newDateSalected');
            } else {
                vm.selectedDate[vm.model.selectedIndex] = vm.selectedPreviousDate;
            }
        }

        /**
         * This function is launched when user select a new Date in the ribbon and availability service response with all new information.
         * This function update ribbon with info received of services.
         *  */
        function returnToOriginalSelect(event, ribbonFlexData) {
            vm.model.dateList = generateDateListWithServiceData(vm.selectedDate[vm.model.selectedIndex], ribbonFlexData, false);
        };

        /**
         * This function add the new days to list of days to show in the ribbon component.
         * This function is launched when service ribbon response with data.
         * @param {event} ribbonFlexDataUpdate this event active the function.
         * @param {Object} ribbonFlexData all data.
         * @param {Boolean} isNext indicate if user select arrow right or left.
         *  */
        function addNewDays(event, ribbonFlexData, isNext) {
            if (ribbonFlexData) {
                vm.model.newDateList = generateDateListWithServiceData(vm.selectedDate[vm.model.selectedIndex], ribbonFlexData, false);
                modifyDateList(vm.model.newDateList, vm.model.dateList, isNext);
            };
            if (isNext) {
                vm.blockChangeDateRight = false;
            } else {
                vm.blockChangeDateLeft = false;
            };
            desactiveLoading();
        };

        /**
         * This functions desactive the loading in all dates.
         * When ribbon service response , this functions is launched.
         *
         *  */
        function desactiveLoading() {
            var i;
            for (i = 0; i < vm.model.dateList.length; i++) {
                vm.model.dateList[i].isLoading = false;
            }
        }

        /**
         * This function modify date list with days to show in the ribbon when user click in any arrow.
         * @param {Array} newDateList is array with all new data of dates response by service.
         * @param {Array} dateList is array with actual data of dates. This variable is used by show days in ribbon.
         * @param {Boolean} isNext indicate if user selected arrow right or left
         *  */
        function modifyDateList(newDateList, dateList, isNext) {
            var i, addDate = false;
            if (isNext && newDateList.length === dateList.length) {
                for (i = 0; i < dateList.length; i++) {
                    if (newDateList[i].date > dateList[dateList.length - 1].date && !addDate) {
                        dateList.shift();
                        dateList.push(newDateList[i]);
                        addDate = true;
                    }
                };
                //desactiveArrow(isNext);
            } else if (newDateList.length === dateList.length) {
                newDateList.forEach((item) => {
                    if (item.date < dateList[0].date && isPreviousDay(item.date, dateList[0].date) && !addDate) {
                        dateList.pop();
                        dateList.unshift(item);
                        addDate = true;
                    };
                });
                //desactiveArrow(isNext);
            }
            function isPreviousDay(newDateList, actualDateList) {
                var previuosDate = angular.copy(actualDateList);
                previuosDate.subtract(1, 'd');
                return previuosDate.date() === newDateList.date() && previuosDate.month() === newDateList.month() && previuosDate.year() === actualDateList.year() ? true : false;
            }
        };


        /**
         * This function desactive the arrow in the ribbon (Left or Right).
         * This arrow is deactivated when not exist availability to select a date (3 days after or before).
         * @param {Boolean} isNext is a boolean that indicate if the user click in left arrow or right arrow.
         *  */
        function desactiveArrow(isNext) {
            var i, list = [], countDisabled = 0;
            if (isNext) {
                list = vm.model.dateList.slice(- 3);
            } else {
                list = vm.model.dateList.slice(0, 3);
            };
            for (i = 0; i < list.length; i++) {
                if (!list[i].isAvailable) {
                    countDisabled++;
                };
            };
            vm.blockChangeDateRight = isNext && countDisabled === 3 ? true : false;
            vm.blockChangeDateLeft = !isNext && countDisabled === 3 ? true : false;
        };
    }
})();
