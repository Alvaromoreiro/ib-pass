import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";

(function () {
    'use strict';
    angular.module('ib-disruption-flight-change-date-module')
        .controller('DisruptionFlightChangeDateController', DisruptionFlightChangeDateController);

    DisruptionFlightChangeDateController.$inject = ['$scope', '$rootScope', 'DisruptionFlightChangeDateTransformer', 'MmBModalService', '$window', 'MmBAppConstants', 'MmBDatalayerUtilsService', 'MmBUtilsSharedService', '$filter', 'localStorageService', 'AvailabilityOrchestrator', 'AvailabilityClass', 'DisruptionUtilService', '$translate','CommonsUtilService'];

    function DisruptionFlightChangeDateController ($scope, $rootScope, DisruptionFlightChangeDateTransformer, MmBModalService, $window, MmBAppConstants, MmBDatalayerUtilsService, MmBUtilsSharedService, $filter, localStorageService, AvailabilityOrchestrator, AvailabilityClass, DisruptionUtilService, $translate, CommonsUtilService) {
        const vm = this;
        vm.changeDate = changeDate;
        vm.searchChangesFlights = searchChangesFlights;
        vm.optionalFlightCheck = optionalFlightCheck;
        vm.checkMaxDate = checkMaxDate;
        vm.optionalData = null;
        vm.$onInit = activate;
        vm.bookingInfo = null;
        vm.unifiedNotIberiaOP = localStorageService.get('unifiedNotIberiaOP');
        vm.initDates = [];
        vm.conditionDateText = false;

        const MAX_MODIFICATION_DAYS = 360;

        ////////////////////////
        function activate () {
            vm.bookingInfo = localStorageService.get('bookingInfo');
            vm.dateRangeCapabilities = DisruptionUtilService.getDateRange(vm.bookingInfo.genericDisruptionCapabilitiesInformation);
            vm.channelDirect = isDirectChannel(vm.bookingInfo.channel);
            vm.isUnified = localStorageService.get('isUnifiedFlow');
            
            checkSlicesDates(vm.bookingInfo.order.slices);

            if(vm.model.optional) {
                vm.optionalData = {
                    sliceId : vm.model.optional,
                    enabled : false
                };
            } else {
                vm.optionalData = null;
            }
            if (vm.isUnified) {
                vm.strategy = new AvailabilityClass.UnifiedStrategy();
                vm.model = DisruptionFlightChangeDateTransformer.initializeModel(vm, vm.model, vm.blackOutPeriodsData.maxDate, false, vm.strategy, vm.dateRangeCapabilities);
                vm.originalFirstFlightMinDate = null, vm.originalSecondFlightMinDate = null, vm.originalFirstFlightMaxDate = null, vm.originalSecondFlightMaxDate = null;
            } else {
                vm.strategy = new AvailabilityClass.DefaultStrategy();
                vm.model = DisruptionFlightChangeDateTransformer.initializeModel(vm, vm.model, vm.blackOutPeriodsData.maxDate, false, vm.strategy);
                vm.allowedMaxDate = dayjs().add(MAX_MODIFICATION_DAYS, "day").format("DD/MM/YYYY");
            }
            if (vm.sisterCitiesData.hasSisterCitiesPossibility) {
                vm.sisterCitiesData.newSisterCitiesModel.sisterCitiesOptionChecked = false;
            }
            $translate.onReady().then(() => {
                vm.flightChangeMsgOperational = $filter('translate')('MMB_DISRUPTION_GENERAL_DATES_MARGIN_OPERATIONAL_TIME', { changeDate: vm.genericDisruption.dateLimitBookingSearch, changeTime: vm.genericDisruption.hourLimitBookingSearch });
            });
            saveInitValues();
        };

        // Function to check all slices and then condition the range message
        function checkSlicesDates(slices) {
            vm.conditionDateText = slices.some(slice =>
                slice.segments.some(segment => segment.status.code !== "HK") &&
                DisruptionUtilService.checkDates(slice.originalDisruptionSliceInformation?.departureDateTime)
            );
        }

        function saveInitValues () {
            vm.model.slicesId.map(sliceId => {
                var auxVal;
                auxVal = vm.model.flights[sliceId].dateOptions.initDate.toDateString();
                vm.initDates.push({id:sliceId, value: new Date(auxVal), stringValue: vm.model.flights[sliceId].dateOptions.initDate.toJSON()});
                return sliceId;
            });
        }

        function isDirectChannel (channel) {
            return MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_DIRECT.indexOf(channel) > -1;
        }


        function extractFlightInfo (index, oppositeIndex) {
            var returnObj = null;
            returnObj = {};
            returnObj.currentDate = new Date(vm.initDates.filter(initObj => { return initObj.id === vm.model.slicesId[index];})[0].stringValue);
            returnObj.optExist = vm.model.optional !== null;
            returnObj.optEnabled = false;
            if(oppositeIndex ===  -1) {
                returnObj.oppositeDate = null;
            } else {
                returnObj.oppositeDate = vm.model.flights[vm.model.slicesId[oppositeIndex]].dateOptions.initDate;
                if(vm.model.flights[vm.model.slicesId[oppositeIndex]].newDateSelected !== null) {
                    returnObj.oppositeDate = vm.model.flights[vm.model.slicesId[oppositeIndex]].newDateSelected;
                }
                if(returnObj.optExist) {
                    if(returnObj.optExist) {
                        returnObj.optEnabled = vm.model.flights[vm.model.optional].optionalEnabled;
                    }
                }
            }
            returnObj.range = vm.dateRangeCapabilities;
            return returnObj;
        }

        function checkMaxDate(dateOpt, isDeparture, ogDepartureDate) {
            const minD = dayjs(dateOpt.minDate).add(2, 'day');
            const isDateOK = !(isDeparture && minD.isAfter(dateOpt.maxDate));
            const isInitDateValid = DisruptionUtilService.checkDates(ogDepartureDate.originalOD ? ogDepartureDate.originalOD.departureDateTime : dateOpt.initDate);

            return isInitDateValid && isDateOK
                ? dayjs().add(2, 'day').toDate()
                : dateOpt.maxDate;
        }

        /**
         * This functions is launched when user select a new date.
         * This function allocation new limit dates in according to new date selected.
         * @param {number} index Indicate the flight position (0 === slice1 , 1 === slice2)
         *  */
        function changeDate (index) {
            let oppositeIndex=null, isDeparture = false, flightInfo = null, dateOpt = null;
            vm.model.flights[vm.model.slicesId[index]].dateOptions.initDate = new Date(vm.initDates.filter(initObj => {
                 return initObj.id === vm.model.slicesId[index];})[0].stringValue);
           
            if (vm.model.numberFlights > 1) {
                isDeparture = index === 0;
                oppositeIndex = index === 0? index + 1:index-1;
                vm.model.flights[vm.model.slicesId[oppositeIndex]].dateOptions.initDate = new Date(vm.initDates.filter(initObj => { return initObj.id === vm.model.slicesId[oppositeIndex];})[0].stringValue);

                flightInfo = extractFlightInfo(index, oppositeIndex);
                dateOpt = DisruptionFlightChangeDateTransformer.calculateDateOption(vm.strategy, isDeparture, flightInfo.currentDate, flightInfo.oppositeDate, flightInfo.optExist, flightInfo.optEnabled, flightInfo.range);
                vm.model.flights[vm.model.slicesId[index]].dateOptions.maxDate = vm.checkMaxDate(dateOpt, isDeparture, vm.model.flights[vm.model.slicesId[index]]);
                vm.model.flights[vm.model.slicesId[index]].dateOptions.minDate = dateOpt.minDate;
                flightInfo = extractFlightInfo(oppositeIndex, index);
                dateOpt = DisruptionFlightChangeDateTransformer.calculateDateOption(vm.strategy, !isDeparture, flightInfo.currentDate, flightInfo.oppositeDate, flightInfo.optExist, flightInfo.optEnabled, flightInfo.range);
                vm.model.flights[vm.model.slicesId[oppositeIndex]].dateOptions.maxDate = vm.checkMaxDate(dateOpt, !isDeparture, vm.model.flights[vm.model.slicesId[oppositeIndex]]);
                vm.model.flights[vm.model.slicesId[oppositeIndex]].dateOptions.minDate = dateOpt.minDate;
            }else {
                isDeparture = index === 0;
                flightInfo = extractFlightInfo(index, -1);
                dateOpt = DisruptionFlightChangeDateTransformer.calculateDateOption(vm.strategy, !isDeparture, flightInfo.currentDate, flightInfo.oppositeDate, flightInfo.optExist, flightInfo.optEnabled, flightInfo.range);
                vm.model.flights[vm.model.slicesId[index]].dateOptions.maxDate = vm.checkMaxDate(dateOpt, !isDeparture, vm.model.flights[vm.model.slicesId[index]]);
                vm.model.flights[vm.model.slicesId[index]].dateOptions.minDate = dateOpt.minDate;
            }
            if (vm.model.numberFlights > 1) {
                if (vm.genericDisruption) {
                    if (vm.originalFirstFlightMinDate === null) {
                        vm.originalFirstFlightMinDate = vm.model.flights[vm.model.slicesId[0]].dateOptions.minDate;
                        vm.originalFirstFlightMaxDate = vm.model.flights[vm.model.slicesId[0]].dateOptions.maxDate;
                        vm.originalSecondFlightMinDate = vm.model.flights[vm.model.slicesId[1]].dateOptions.minDate;
                        vm.originalSecondFlightMaxDate = vm.model.flights[vm.model.slicesId[1]].dateOptions.maxDate;
                    }
                }
            }
            vm.model.flights[vm.model.slicesId[index]].parseNewDateSelected = DisruptionFlightChangeDateTransformer.transformerDateSelected(vm.model.flights[vm.model.slicesId[index]].newDateSelected);
            vm.model.searchAvailable = getSearchAvailable(index);
        }
        /**
       * This function indicate if the button to search new flights is available.
       * If the news dates are selected, the button is available.
       * @param {Number} index indicate the slice that been changed or available.
       * @returns {Boolean} true/false.
       *  */
        function getSearchAvailable (index) {
            let isAvailableButton = false, flightDisrupted = null;
            if(vm.sisterCitiesData.hasSisterCitiesPossibility) {
                updateSisterCitiesModel(vm.sisterCitiesData.newSisterCitiesModel.sisterCitiesOptionChecked);
                localStorageService.set('newSisterCitiesModelData', vm.sisterCitiesData.newSisterCitiesModel.sisterCitiesOptionChecked ? vm.sisterCitiesData.newSisterCitiesModel : null );
            }

            if (vm.model.numberFlights > 1) {
                if (vm.model.optional) {
                    flightDisrupted = vm.model.flights[vm.model.optional].position === 0 ? 1 : 0;
                    if (vm.model.flights[vm.model.optional].optionalEnabled) {
                        CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_INVOLUNTARY_SEARCH_WITH_RETURN');
                        isAvailableButton = vm.model.flights[vm.model.optional].newDateSelected && vm.model.flights[vm.model.slicesId[flightDisrupted]].newDateSelected ? true : false;
                    } else {
                        CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_INVOLUNTARY_SEARCH_ONE_WAY');
                        isAvailableButton = vm.model.flights[vm.model.slicesId[flightDisrupted]].newDateSelected ? true : false;

                    }
                } else {
                    isAvailableButton = vm.model.flights[vm.model.slicesId[0]].newDateSelected && vm.model.flights[vm.model.slicesId[1]].newDateSelected ? true : false;
                }
            } else if (index !== null) {
                if (vm.model.flights[vm.model.slicesId[index]].newDateSelected) {
                    isAvailableButton = true;
                };
            };

            DisruptionUtilService.initializeQuadrigam(vm.model, vm.bookingInfo.order.status, DisruptionUtilService.initializeSlicesList(vm.bookingInfo.order));

            return isAvailableButton;
        };

        /**
         * This function is launched when user checked the option to change other flight that not is disrupted.
         * The function update the maxDate when the optional flight is the return.
         *  */
        function optionalFlightCheck () {
            const optionalId = vm.model.optional;
            const makeEnable = vm.optionalData ? !vm.optionalData.enabled : false;
            vm.optionalData = {
                sliceId : vm.model.optional,
                enabled : makeEnable
            };
            if (vm.sisterCitiesData.hasSisterCitiesPossibility  && vm.sisterCitiesData.newSisterCitiesModel.switchSisterCities) {

                //If optional flight is outbound flight (difficult case)
                if (vm.model.optional === vm.sisterCitiesData.newSisterCitiesModel.disruptedSlices[0]) {
                    //And the referenceSliceId is the outbound flight
                    if (vm.sisterCitiesData.newSisterCitiesModel.referenceSliceId === vm.sisterCitiesData.newSisterCitiesModel.disruptedSlices[0]) {
                        //Then change the refereneSliceId to return flight
                        vm.sisterCitiesData.newSisterCitiesModel.referenceSliceId = vm.sisterCitiesData.newSisterCitiesModel.disruptedSlices[1];
                    } else {
                        vm.sisterCitiesData.newSisterCitiesModel.referenceSliceId = vm.sisterCitiesData.newSisterCitiesModel.disruptedSlices[0];

                    }
                    //If optional flight is return flight,the referenceSliceId is always the outbound flight
                } else if (vm.model.optional === vm.sisterCitiesData.newSisterCitiesModel.disruptedSlices[1]) {
                    vm.sisterCitiesData.newSisterCitiesModel.referenceSliceId = vm.sisterCitiesData.newSisterCitiesModel.disruptedSlices[0];
                }
            }

            vm.originalFirstFlightMinDate = null, vm.originalSecondFlightMinDate = null, vm.originalFirstFlightMaxDate = null, vm.originalSecondFlightMaxDate = null;
            if (!vm.genericDisruption) {
                if (vm.model.flights[optionalId].optionalEnabled) {
                    if (vm.model.flights[optionalId].position === 1) {
                        vm.model.flights[vm.model.slicesId[0]].dateOptions.maxDate = vm.model.dateOptions.maxDate;
                    } else if (vm.model.flights[optionalId].position === 0) {
                        vm.model.flights[vm.model.slicesId[0]].dateOptions.maxDate = vm.model.dateOptions.maxDate;
                    }
                    vm.model.searchAvailable = getSearchAvailable(null);
                } else {
                    if (vm.model.flights[optionalId].position === 0) {
                        vm.model.flights[vm.model.slicesId[0]].newDateSelected = null;
                        vm.model.flights[vm.model.slicesId[1]].dateOptions.minDate = new Date(vm.model.flights[vm.model.slicesId[0]].arrivalDateParsed.originalDate);
                    } else if (vm.model.flights[optionalId].position === 1) {
                        vm.model.flights[vm.model.slicesId[1]].newDateSelected = null;
                        vm.model.flights[vm.model.slicesId[0]].dateOptions.maxDate = new Date(vm.model.flights[optionalId].departureDateParsed.originalDate);
                        if (vm.model.flights[vm.model.slicesId[0]].newDateSelected > new Date(vm.model.flights[optionalId].departureDateParsed.originalDate)) {
                            vm.model.flights[vm.model.slicesId[0]].newDateSelected = null;
                        }
                    }
                    vm.model.searchAvailable = getSearchAvailable(null);
                };
            } else {
                vm.model = DisruptionFlightChangeDateTransformer.initializeModel(vm, vm.model, vm.blackOutPeriodsData.maxDate, vm.model.flights[vm.model.optional].optionalEnabled, vm.strategy, vm.dateRangeCapabilities);
            }
        };

        /**
        * This function is launched when user click in the button "search-Flights".
        * The function call service availability-flex to get all data and open a modal with all slices available.
        * */
         function searchChangesFlights () {
            let request, strategy;
            const warningDowngrade = localStorageService.get('warningDowngradeSameFlightAndTime') || localStorageService.get('warningDowngradeDiffFlightOrTime');
            localStorageService.set('isSearchFromButton', true);

            if (vm.model.searchAvailable) {
                if (vm.sisterCitiesData.hasSisterCitiesPossibility && vm.sisterCitiesData.newSisterCitiesModel.sisterCitiesOptionChecked) {
                    MmBUtilsSharedService.updateSisterCitiesModel(vm.sisterCitiesData.newSisterCitiesModel);
                    localStorageService.set('newSisterCitiesModelData', vm.sisterCitiesData.newSisterCitiesModel && vm.sisterCitiesData.newSisterCitiesModel.sisterCitiesOptionChecked ? vm.sisterCitiesData.newSisterCitiesModel : null );
                }
                strategy = vm.strategy.getAvailability();
                request = AvailabilityOrchestrator.getAvailabilityRequest(strategy, vm.model.flights, vm.model.flowId,  vm.sisterCitiesData.newSisterCitiesModel && vm.sisterCitiesData.newSisterCitiesModel.sisterCitiesOptionChecked, vm.sisterCitiesData.newSisterCitiesModel);
                if(warningDowngrade) {
                    const downgradeModalModel = {
                        title: $filter('translate')('FLIGHT_CONFIRMATION_BACK_MODAL_TITLE'),
                        body: $filter('translate')('MMB_DISRUPTION_DOWNGRADE_MODAL_TEXT'),
                        accept: $filter('translate')('FLIGHT_CONFIRMATION_CONTINUE'),
                        cancel: $filter('translate')('MODAL_CANCEL')
                    };
                    MmBModalService.showGenericModal(false, null, downgradeModalModel).result.then( () => {
                        MmBModalService.showWaitingModal();
                        AvailabilityOrchestrator.availability(strategy, request).then(availabilitySuccess, callGetAvailabilityError);
                    }, angular.noop);
                } else {
                    MmBModalService.showWaitingModal();
                    AvailabilityOrchestrator.availability(strategy, request).then(availabilitySuccess, callGetAvailabilityError);
                }
            }
            localStorageService.set('isSearchFromButton', false);
            $window.scrollTo(0, 0);
        }


        function availabilitySuccess (data) {
            localStorageService.set('unifiedOfferType', data.flowType);
            localStorageService.set('unifiedOptionalData', vm.optionalData);
            const strategy = vm.strategy.getAvailability();
            const modalObject = AvailabilityOrchestrator.getModalObject(strategy, data);
            MmBModalService.finishWaiting();
            AvailabilityOrchestrator.callModalService(strategy, modalObject).then(resetSisterCitiesCheckboxes, resetSisterCitiesCheckboxes);
        }

        /**
         * This function is executed when availability-flex service return any error.
         * When the error code is 400 and internal errorCode 'SSE_AVM_18002' added a specify quadrigam.
         * This function open a modal with error message and date selected is cleaned.
         * @param {Object} error All data with the information about error.
         *
         *  */
        function callGetAvailabilityError (error) {
            let phoneCallCenter, quadrigam, process;
            MmBModalService.finishWaiting();
            if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18002') {
                quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_BLACKOUT_DATE_SERVICE_ERROR;
                MmBUtilsSharedService.updateQuadrigam(quadrigam, MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam]);
            } else if (error.errorCode === 404 && error.internalErrorCode === 'SSE_AVM_12001') {
                quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_NOT_AVAILABILITY;
                CommonsUtilService.setTitlePage('MMB_TITLE_FLEXIBILIZATION_INVOLUNTARY_NOT_AVAILABILITY');
                MmBUtilsSharedService.updateQuadrigam(quadrigam, MMBDatalayerConstants.DIGITAL_DATA_PROCESS[quadrigam], MMBDatalayerConstants.DIGITAL_DATA_STEP[quadrigam]);
            } else {
                quadrigam = MmBAppConstants.QUADRIGAM.FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_SERVICE_ERROR;
                process = MmBUtilsSharedService.getProcessByStatus(quadrigam, vm.bookingInfo?.order?.status);
                MmBUtilsSharedService.updateQuadrigam(quadrigam, process);
            };
            //Management error for the user

            error.title = $filter('translate')('MMB_FLEXIBILIZATION_ERROR_MODAL_TITLE');

            if (error.errorCode === 404 && error.internalErrorCode === 'SSE_AVM_12001') {
                error.message = $filter('translate')('MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NO_AVAILABILITY');
            } else if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18002') {
                error.message = $filter('translate')('MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_ERROR_DATE');
            } else if (error.errorCode === 400 && error.internalErrorCode === 'SSE_AVM_18007') {
                error.message = $filter('translate')('MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_ERROR_ONE_SLICE');
            } else if (error.internalErrorCode === 'SSE_AVM_900514') {
                error.message = $filter('translate')('MMB_DISRUPTION_INFO_CHANGE_FLIGHT_INVALID_DATES', {maxModificationDays: vm.dateRangeCapabilities});
            } else if(error.internalErrorCode === 'SSE_AVM_18012') {
                error.title = $filter('translate')('SORRY_ERROR');
                if(vm.channelDirect) {
                    phoneCallCenter = getPhoneCallCenter();
                    error.message = $filter('translate')('MMB_FLEX_REBOOK_ERROR_MESSAGE');
                    error.message +=  ' ' + phoneCallCenter;
                }else {
                    error.message = $filter('translate')('TRAVEL_AGENCY_MESSAGE');
                }
            }else if(error.internalErrorCode === 'SSE_AVM_18011') {
                error.title = $filter('translate')('MODAL_ERROR_TITLE');
                phoneCallCenter = getPhoneCallCenter();
                error.message = $filter('translate')('ERROR_MMB_001', { phoneCallCenter: phoneCallCenter });
            } else {
                error.message = 'MMB_FLEXIBILIZATION_ERROR_MODAL_BODY_NEW_SEARCH';
                error.needsTranslate = true;
            }

            MmBModalService.showGenericError(error).result.then( () => {
                angular.forEach(vm.model.flights, (flight, key) => {
                    flight.newDateSelected = null;
                    if (vm.genericDisruption && vm.model.optional) {
                        vm.model = DisruptionFlightChangeDateTransformer.initializeModel(vm, vm.model, vm.blackOutPeriodsData.maxDate, vm.model.flights[vm.model.optional].optionalEnabled, vm.strategy, vm.dateRangeCapabilities);
                    }
                });
                vm.model.searchAvailable = false;
                MmBDatalayerUtilsService.updateDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_PROCESS[vm.quadrigam],MMBDatalayerConstants.DIGITAL_DATA_STEP[vm.quadrigam], vm.quadrigam);
            }, angular.noop);
        };

        /**
         * Transforms the CallCenter number
         * @return {String} CallCenter number
         */
        function getPhoneCallCenter (orderData) {
            const phonesList =  localStorageService.get('phonesList');
            let phoneNumber;

            if (phonesList && phonesList.RESERVAS) {
                phoneNumber = phonesList.RESERVAS.prefix + ' ' + phonesList.RESERVAS.telephone;
            }
            return phoneNumber;
        }

        /**
         *
         */
        function updateSisterCitiesModel (update) {
            if (update) {
                vm.sisterCitiesData.newSisterCitiesModel[vm.sisterCitiesData.newSisterCitiesModel.referenceSliceId].originSisterCitiesNum = calculateCitiesSelected(vm.sisterCitiesData.newSisterCitiesModel[vm.sisterCitiesData.newSisterCitiesModel.referenceSliceId].origin.originSisterCities);
                vm.sisterCitiesData.newSisterCitiesModel[vm.sisterCitiesData.newSisterCitiesModel.referenceSliceId].destinationSisterCitiesNum = calculateCitiesSelected(vm.sisterCitiesData.newSisterCitiesModel[vm.sisterCitiesData.newSisterCitiesModel.referenceSliceId].destination.destinationSisterCities);
            }

            function calculateCitiesSelected (cityList) {
                let cont = 0;
                angular.forEach(cityList, (city) => {
                    if (city.isSelected) {
                        cont++;
                    }
                });
                if (cont === 0) {
                    return null;
                }
                return '+' + cont;
            }
        }

        function resetSisterCitiesCheckboxes () {
            angular.forEach(vm.sisterCitiesData.newSisterCitiesModel.disruptedSlices, (sliceId) => {
                if (vm.sisterCitiesData.newSisterCitiesModel[sliceId].origin.originSisterCities.length > 0) {
                    angular.forEach(vm.sisterCitiesData.newSisterCitiesModel[sliceId].origin.originSisterCities, (city) => {
                        city.isSelected = false;
                    });
                }
                if (vm.sisterCitiesData.newSisterCitiesModel[sliceId].destination.destinationSisterCities.length > 0) {
                    angular.forEach(vm.sisterCitiesData.newSisterCitiesModel[sliceId].destination.destinationSisterCities, (city) => {
                        city.isSelected = false;
                    });
                }
            });
        }
    }
})();
