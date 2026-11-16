import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

(function () {
    'use strict';

    angular
        .module('ib-flexibilization-search-module')
        .controller('IbFlexibilizationSearchController', IbFlexibilizationSearchController);

    IbFlexibilizationSearchController.$inject = ['$scope', '$rootScope', 'MmBAppConstants', 'MmBModalService', '$window', 'IbFlexibilizationService', 'IbFlexFlexibilizationTransformer', 'MmBDatalayerUtilsService', 'MmBUtilsSharedService', 'VoluntaryChangesTransformer', 'VoluntaryChangesService', 'localStorageService', 'CommonsUtilService', '$filter'];
    function IbFlexibilizationSearchController($scope, $rootScope, MmBAppConstants, MmBModalService, $window, IbFlexibilizationService, IbFlexFlexibilizationTransformer, MmBDatalayerUtilsService, MmBUtilsSharedService, VoluntaryChangesTransformer, VoluntaryChangesService, localStorageService, CommonsUtilService, $filter) {
        var vm = this;
        vm.model = {};
        vm.searchChangesFlights = searchChangesFlights;
        vm.changeDate = changeDate;
        $scope.$on('checkFlightChanged', checkFlightChanged);
        vm.$onInit = activate;

        ////////////////

        function activate () {
            vm.numberFlights = 0;
            vm.slicesId = [];
            vm.searchAvailable = false;
            vm.routeDatepicker = MmBAppConstants.templatesRoute + 'ib-mmb-datepicker.html';;
            vm.showSisterCitiesCheck = localStorageService.get('showSisterCitiesPossibility');
            vm.isVoluntaryFlexible = localStorageService.get('reshopConditions');
            vm.dateOptions = {
                showWeeks: false,
                maxMode: 'day',
                minDate: dayjs() > dayjs(vm.blackOutDates.minDate) ? dayjs() : dayjs(vm.blackOutDates.minDate),
                maxDate: vm.isVoluntaryFlexible ? dayjs(vm.blackOutDates.maxDate) : vm.blackOutDates.maxDate,
                dateDisabled: disabledBlackOutDates
            };
            initializeDates();
            //CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_VC_FLEXIBILIZATION_SELECT_NEW_FLIGHTS');
        };


        /**
         * This function allocation the minDate and MaxDate for each flight.
         * It is launched when there is no slice checked, and the user checks one (outbound or return)
         * @param {number} vm.numberFlights indicate number the flights that exists. (OneWay --> 1 // Return --> 2)
         * @param {Array} vm.slicesId Save the slicedId for each flight.
         * @param {Object} vm.dateOptions Indicates the options for flight date. This has the minDate and maxDate available.
         *  */
        function initializeDates () {
            var sliceId, i;
            for (sliceId in vm.flights) {
                if (vm.flights.hasOwnProperty(sliceId)) {
                    if (vm.numberFlights > 0) {
                        if (new Date(vm.flights[sliceId].departureDateParsed.originalDate) < new Date(vm.flights[vm.slicesId[0]].departureDateParsed.originalDate)) {
                            vm.slicesId[1] = vm.slicesId[0];
                            vm.slicesId[0] = sliceId;
                        } else {
                            vm.slicesId[1] = sliceId;
                        }
                    } else {
                        vm.slicesId[0] = sliceId;
                    }
                    vm.numberFlights++;
                }
            };
            for (i = 0; i < vm.numberFlights; i++) {
                vm.flights[vm.slicesId[i]].newDateSelected = null;
                vm.flights[vm.slicesId[i]].dateOptions = angular.copy(vm.dateOptions);

                //If there is return flight
                if (i === 1) {
                    vm.flights[vm.slicesId[i]].dateOptions.initDate = new Date(vm.flights[vm.slicesId[i]].departureDateParsed.originalDate);
                    //If return flight minDate is previous to the outbound departure date, we set the minDate to this (so we take the latest date)
                    if (new Date(vm.flights[vm.slicesId[i]].dateOptions.minDate) < new Date(vm.flights[vm.slicesId[i - 1]].departureDateParsed.originalDate)) {
                        vm.flights[vm.slicesId[i]].dateOptions.minDate = new Date(vm.flights[vm.slicesId[i - 1]].departureDateParsed.originalDate);
                    }
                    vm.flights[vm.slicesId[i - 1]].dateOptions.maxDate = new Date(vm.flights[vm.slicesId[i]].departureDateParsed.originalDate);
                }
            }
        };

        /**
         * This functions is launched when user select a new date.
         * This function allocation new limit dates in according to new date selected.
         * @param {number} index Indicate the flight position (0 === slice1 , 1 === slice2)
         **/
        function changeDate (index) {
            var initDate, todayDate = new Date();
            if (vm.numberFlights > 1) {
                if (index === 0) {
                    initDate = new Date(vm.flights[vm.slicesId[index]].newDateSelected);
                    vm.flights[vm.slicesId[index + 1]].dateOptions.minDate = new Date(vm.flights[vm.slicesId[index]].newDateSelected);
                    vm.flights[vm.slicesId[index + 1]].dateOptions.initDate = initDate > todayDate ? initDate : todayDate;
                    if (vm.flights[vm.slicesId[index + 1]].newDateSelected) {
                        if (vm.flights[vm.slicesId[index]].newDateSelected.getMonth() !== vm.flights[vm.slicesId[index + 1]].newDateSelected.getMonth() || vm.flights[vm.slicesId[index]].newDateSelected.getDate() > vm.flights[vm.slicesId[index + 1]].newDateSelected.getDate()) {
                            vm.flights[vm.slicesId[index + 1]].newDateSelected = null;
                        };
                    };
                } else if (index === 1) {
                    vm.flights[vm.slicesId[0]].dateOptions.maxDate = dayjs(new Date(vm.dateOptions.maxDate));
                }
            };
            vm.flights[vm.slicesId[index]].parseNewDateSelected = transformerDateSelected(vm.flights[vm.slicesId[index]].newDateSelected);
            vm.searchAvailable = getSearchAvailable(index);
        };


        /**
         * This functions return a object with information about new date selected.
         * @param {date} date Is the new date selected.
         * @returns {Object} return formate date selected.
         **/
        function transformerDateSelected (date) {
            var parseDate = {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                weekDay: date.getDay()
            };
            return parseDate;
        };


        /**
         * This function is launched when user check or uncheck a flight if have more that one slices.
         * It is launched when both slices are checked, or when the user unchecks one and leaves the other one checked.
         * @param {Event} checkFlightChanged this event that execute the function.
         * @param {Number} indexFlight Indicates the position the slice that has been checked/unchecked.
         *
         */
        function checkFlightChanged (event, indexFlight) {
            var index = null;
            if (indexFlight === 0) {
                vm.flights[vm.slicesId[indexFlight + 1]].dateOptions.minDate = new Date(vm.flights[vm.slicesId[indexFlight]].departureDateParsed.originalDate);
                vm.flights[vm.slicesId[indexFlight + 1]].dateOptions.initDate = new Date(vm.flights[vm.slicesId[indexFlight + 1]].departureDateParsed.originalDate);
                if (vm.flights[vm.slicesId[indexFlight + 1]].newDateSelected && vm.flights[vm.slicesId[indexFlight + 1]].newDateSelected < vm.flights[vm.slicesId[indexFlight + 1]].dateOptions.minDate) {
                    vm.flights[vm.slicesId[indexFlight + 1]].newDateSelected = null;
                };
                index = indexFlight + 1;
            } else if (indexFlight === 1) {
                if (vm.flights[vm.slicesId[indexFlight - 1]].newDateSelected && vm.flights[vm.slicesId[indexFlight - 1]].newDateSelected > new Date(vm.flights[vm.slicesId[indexFlight]].departureDateParsed.originalDate)) {
                    vm.flights[vm.slicesId[indexFlight - 1]].newDateSelected = null;
                    vm.flights[vm.slicesId[indexFlight - 1]].dateOptions.maxDate = new Date(vm.flights[vm.slicesId[indexFlight]].departureDateParsed.originalDate);
                } else {

                    //If both outbound and return flights are checked
                    if (vm.flights[vm.slicesId[indexFlight - 1]].checked && vm.flights[vm.slicesId[indexFlight]].checked) {
                        vm.flights[vm.slicesId[indexFlight - 1]].dateOptions.maxDate = vm.dateOptions.maxDate;

                        //If only the outbound flight is checked
                    } else if (!vm.flights[vm.slicesId[indexFlight]].checked) {
                        vm.flights[vm.slicesId[indexFlight - 1]].dateOptions.maxDate = new Date(vm.flights[vm.slicesId[indexFlight]].departureDateParsed.originalDate);
                    }
                };
                index = indexFlight - 1;
            }
            vm.flights[vm.slicesId[indexFlight]].newDateSelected = null;
            vm.searchAvailable = getSearchAvailable(index);
        };


        /**
        * This function indicate if the button to search new flights is available.
        * If the news dates are selected, the button is available.
        * @param {Number} index indicate the slice that been changed or available.
        * @returns {Boolean} true/false.
        *  */
        function getSearchAvailable (index) {
            var isAvailableButton = false, flightsChecked, datesSelected;
            if (vm.numberFlights > 1) {
                flightsChecked = vm.flights[vm.slicesId[0]].checked && vm.flights[vm.slicesId[1]].checked ? true : false;
                if (flightsChecked) {
                    isAvailableButton = vm.flights[vm.slicesId[0]].newDateSelected && vm.flights[vm.slicesId[1]].newDateSelected ? true : false;
                } else if (vm.flights[vm.slicesId[index]].checked && vm.flights[vm.slicesId[index]].newDateSelected) {
                    isAvailableButton = true;
                }
            } else {
                if (vm.flights[vm.slicesId[index]].checked && vm.flights[vm.slicesId[index]].newDateSelected) {
                    isAvailableButton = true;
                };
            };
            return isAvailableButton;
        };

        /**
         * This function is launched when user click in the button "search-Flights".
         * The function call service availability-flex to get all data and open a modal with all slices available.
         * */
        function searchChangesFlights () {
            var availabilityRequest = null, availabilityFlexData = { availabilityData: null },
                dataByVC = { allSegments: vm.allSegments, flights: vm.flights }, modeFlight = null, dataModelRibbon = null, dataselectedSlide = [], index;
            var selectedDate, sliceId, originalDate, diffDate, modalBody, phoneList, phoneNumber;
            phoneList = localStorageService.get('phonesList');
            phoneNumber = phoneList ? phoneList[MmBAppConstants.WCS.PHONE_TYPES.SALES]?.prefix + phoneList[MmBAppConstants.WCS.PHONE_TYPES.SALES]?.telephone : null;
            if (vm.searchAvailable) {
                if (vm.flags.dateLimit.verifyDate) {
                    for (sliceId in vm.flights) {
                        if (vm.flights.hasOwnProperty(sliceId)) {
                            if (vm.flights[sliceId].disrupted || vm.flights[sliceId].optionalEnabled || vm.flights[sliceId].checked) {
                                selectedDate = new Date(vm.flights[sliceId].parseNewDateSelected.year, vm.flights[sliceId].parseNewDateSelected.month, vm.flights[sliceId].parseNewDateSelected.day);
                                originalDate = new Date(vm.flights[sliceId].departureDateParsed.year, vm.flights[sliceId].departureDateParsed.monthNumber, vm.flights[sliceId].departureDateParsed.day);
                                diffDate = (selectedDate.getTime() - originalDate.getTime()) / (1000 * 3600 * 24);
                                if (diffDate > 365) {
                                    modalBody = {
                                        message: MmBAppConstants.COMMON_LABELS.CHANNEL[vm.flags.dateLimit.channel].VALUE,
                                        phone: MmBAppConstants.COMMON_LABELS.CHANNEL[vm.flags.dateLimit.channel].PHONE ? phoneNumber + '.' : ''
                                    };
                                    MmBModalService.showGenericInfoModal(modalBody, false, 'ib-modal-contact-callcenter').result.then(() => {
                                    }, angular.noop);
                                    return;
                                }
                            }
                        }
                    }
                }
                // FLEXIBILIZATION FLOW
                if (vm.flags.showFlexibilizationChangeSection) {
                    if (vm.sisterCitiesAvailability.newSisterCities && vm.sisterCitiesAvailability.newSisterCities.sisterCitiesOptionChecked) {
                        MmBUtilsSharedService.updateSisterCitiesModel(vm.sisterCitiesAvailability.newSisterCities);
                        localStorageService.set('newSisterCitiesModelData', vm.sisterCitiesAvailability.newSisterCities.sisterCitiesOptionChecked ? vm.sisterCitiesAvailability.newSisterCities : null);
                    }
                    availabilityRequest = MmBUtilsSharedService.generateRequestFlexibilization(vm.flights, null, vm.sisterCitiesAvailability.newSisterCities && vm.sisterCitiesAvailability.newSisterCities.sisterCitiesOptionChecked ? vm.sisterCitiesAvailability.newSisterCities : null);
                    MmBModalService.showWaitingModal();
                    IbFlexibilizationService.callGetAvailability(availabilityRequest).then((data) => {
                        availabilityFlexData.availabilityData = data;
                        availabilityFlexData.sisterCitiesModel = vm.sisterCitiesAvailability.newSisterCities;
                        MmBModalService.finishWaiting();
                        MmBModalService.showFullModal(false, 'ib-modal-flexibilization.html', availabilityFlexData).result.then(resetSisterCitiesCheckboxes, resetSisterCitiesCheckboxes);
                    }, callGetAvailabilityFlexError);
                    //VOLUNTARY CHANGE FLOW
                } else if (vm.flags.showVoluntaryChangeFlightSection) {
                    modeFlight = IbFlexFlexibilizationTransformer.getModelFlighVC(dataByVC, vm.slicesId, vm.numberFlights);
                    availabilityRequest = VoluntaryChangesTransformer.searchFlights(dataByVC, modeFlight);
                    MmBModalService.showWaitingModal();
                    VoluntaryChangesService.getAvailability(availabilityRequest).then((availabilityResponseCV) => {
                        dataModelRibbon = VoluntaryChangesTransformer.generateFlightsModelRibbon(availabilityResponseCV.originDestinations, dataByVC.flights);
                        for (index = 0; index < dataModelRibbon.length; index++) {
                            dataselectedSlide[index] = {
                                date: dataModelRibbon[index].calendarData.slides[dataModelRibbon[index].calendarData.selectedSlide],
                                index: dataModelRibbon[index].index
                            };
                        }
                        availabilityResponseCV.modeFlight = modeFlight;
                        dataModelRibbon.flights = dataByVC.flights;
                        openModalVoluntaryChanges(availabilityResponseCV, dataModelRibbon, dataselectedSlide);

                    }, (error) => {
                        var buildModel = [], dataAvailability = {};
                        if (error.internalErrorCode !== 'noFares' && error.internalErrorCode !== 'SSE_AVM_13017' && error.internalErrorCode !== 'SSE_AVM_13018') {
                            buildModel = IbFlexFlexibilizationTransformer.getBuildModelVC(dataByVC.flights);
                            dataModelRibbon = VoluntaryChangesTransformer.generateFlightsModelRibbon(buildModel, dataByVC.flights);
                            for (index = 0; index < dataModelRibbon.length; index++) {
                                dataselectedSlide[index] = {
                                    date: dataModelRibbon[index].calendarData.slides[dataModelRibbon[index].calendarData.selectedSlide],
                                    index: dataModelRibbon[index].index
                                };
                            }
                            dataAvailability.modeFlight = modeFlight;
                            dataAvailability.empty = true;
                            dataAvailability.originDestinations = buildModel;
                            dataModelRibbon.flights = dataByVC.flights;
                            openModalVoluntaryChanges(dataAvailability, dataModelRibbon, dataselectedSlide);
                        } else {
                            MmBModalService.finishWaiting();
                            CommonsUtilService.setTitlePage('MMB_TITLE_FLIGHT_CHANGE_SEARCH_ERROR');
                            MmBUtilsSharedService.updateQuadrigam(MmBAppConstants.QUADRIGAM.CHANGE_FLIGHTS_SEARCH_DATE_ERROR_MODAL, MMBDatalayerConstants.DIGITAL_DATA_PROCESS.ATCERD, MMBDatalayerConstants.DIGITAL_DATA_STEP.ATCERD);
                            MmBModalService.showGenericError(error).result.then(() => {
                                $scope.$emit('restarQuadrigam');
                            }, angular.noop);
                        };
                    });
                };
            };
            $window.scrollTo(0, 0);
            function openModalVoluntaryChanges (availabilityData, modelRibbonData, datesSelectedSlideData) {
                localStorageService.remove('manualCloseVCModal');
                availabilityData.flightsLength = Object.keys(dataByVC.flights).length;
                MmBModalService.showVoluntaryChangeModal(false, 'ib-MmB-voluntary-changes-view.html', { availability: availabilityData, modelRibbon: modelRibbonData, selectedSlide: datesSelectedSlideData });
                MmBModalService.finishWaiting();
            };
        };

        function resetSisterCitiesCheckboxes () {
            angular.forEach(vm.sisterCitiesAvailability.newSisterCities.disruptedSlices, (sliceId) => {
                if (vm.sisterCitiesAvailability.newSisterCities[sliceId].origin.originSisterCities.length > 0) {
                    angular.forEach(vm.sisterCitiesAvailability.newSisterCities[sliceId].origin.originSisterCities, (city) => {
                        city.isSelected = false;
                    });
                }
                if (vm.sisterCitiesAvailability.newSisterCities[sliceId].destination.destinationSisterCities.length > 0) {
                    angular.forEach(vm.sisterCitiesAvailability.newSisterCities[sliceId].destination.destinationSisterCities, (city) => {
                        city.isSelected = false;
                    });
                }
            });
        }

        /**
         * This function is executed when availability-flex service return any error.
         * When the error code is 400 and internal errorCode 'SSE_AVM_18002' added a specify quadrigam.
         * This function open a modal with error message and date selected is cleaned.
         * @param {Object} error All data with the information about error.
         *
         *  */
        function callGetAvailabilityFlexError (error) {
            var quadrigam;
            MmBModalService.finishWaiting();
            if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18002') {
                quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR;
                CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR');
            } else if (error.errorCode === 404 && error.internalErrorCode === 'SSE_AVM_12001') {
                quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_NOT_AVAILABILITY;
            } else {
                quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_AVAILABILITY_SERVICE_ERROR;
            };
            MmBUtilsSharedService.updateQuadrigam(quadrigam, MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam]);
            
            //Management error for the user
            error.title = $filter('translate')('MMB_FLEXIBILIZATION_ERROR_MODAL_TITLE');

            error.needsTranslate = true;
            if (error.errorCode === 404 && error.internalErrorCode === 'SSE_AVM_12001') {
                error.message = 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NO_AVAILABILITY';
            } else if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18002') {
                error.message = 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_ERROR_DATE';
            } else if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18007') {
                error.message = 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_ERROR_ONE_SLICE';
            } else {
                error.message = 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NEW_SEARCH';
            }

            MmBModalService.showGenericError(error).result.then(() => {
                angular.forEach(vm.flights, (flight, key) => {
                    flight.newDateSelected = null;
                });
                vm.searchAvailable = false;
                $scope.$emit('restarQuadrigam');
            }, angular.noop);
        };

        /**
         * disabled all dates that not are available in the calendar for flow flexbiilization.
         * @param {Object} dateAndMode Object with all information of the days
         *  */
        function disabledBlackOutDates (dateAndMode) {
            if (vm.blackOutDates.blackOutPeriods.length === 0) {
                return false;
            }
            return (dateAndMode.mode === 'day' && vm.blackOutDates.blackOutPeriods.some(isBetweenDay));



            function isBetweenDay (actualDate) {
                return dayjs(dateAndMode.date).isBetween(actualDate.dateFrom, actualDate.dateTo, undefined, '[]');
            }
        };
    }
})();
