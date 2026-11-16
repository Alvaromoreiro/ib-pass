import dayjs from 'dayjs';

(function () {
    'use strict';

    angular
        .module('ib-disruption-flight-change-date-module')
        .factory('DisruptionFlightChangeDateTransformer', DisruptionFlightChangeDateTransformer);

    DisruptionFlightChangeDateTransformer.$inject = ['MmBAppConstants', 'MmBUtilService', 'localStorageService', 'DisruptionUtilService'];
    function DisruptionFlightChangeDateTransformer(MmBAppConstants, MmBUtilService, localStorageService, DisruptionUtilService) {
        var service = {
            initializeModel: initializeModel,
            calculateDateOption: calculateDateOption,
            transformerDateSelected: transformerDateSelected,
            generateRequestFlexibilization: generateRequestFlexibilization,
            initializeBaseModel: initializeBaseModel,
            getCalendarPosition: getCalendarPosition,
            adjustReturnFlightDates: adjustReturnFlightDates
        };
        return service;


        ////////////////
        /***
         *
         * This function allocation the minDate and MaxDate for each flight.
         * @param {number} model.numberFlights indicate number the flights that exists. (OneWey --> 1 // Return --> 2)
         * @param {Array} model.slicesId Save the slicedId for each flight.
         * @param {Object} model.dateOptions Indicate the options for flight date. This have the minDate and maxDate available.
         * @returns {object} return the modal with all data neccesary.
         *  */
        function initializeModel(data, model, maxDate, isOptionalEnabled, strategy, maxRange) {
            let opositeDate = null;
            const isOptional = model.optional && !isOptionalEnabled;

            initializeBaseModel(model, maxDate);

            for (const sliceId in model.flights) {
                model.flights[sliceId].position = model.numberFlights;
                model.slicesId.push(sliceId);
                model.numberFlights++;
            };
            for (let i = 0; i < model.numberFlights; i++) {
                if(i === 0 && model.numberFlights > 1) {
                    opositeDate = model.flights[model.slicesId[i+1]].departureDateParsed.originalDate;
                }
                if(i === 1) {
                    opositeDate = model.flights[model.slicesId[i-1]].departureDateParsed.originalDate;
                }

                model.flights[model.slicesId[i]].dateOptions = strategy.initializeDateOptions(i, model.flights[model.slicesId[i]].departureDateParsed.originalDate, opositeDate,disabledBlackOutDates({mode:'',day:new Date()}), isOptional, maxRange);
                const dateToCheck = model.flights[model.slicesId[i]].originalOD ? model.flights[model.slicesId[i]].originalOD.departureDateTime : model.flights[model.slicesId[i]].dateOptions.initDate;
                model.flights[model.slicesId[i]].dateOptions.maxDate = DisruptionUtilService.checkDates(dateToCheck) ? dayjs().add(2, 'day').toDate() : model.flights[model.slicesId[i]].dateOptions.maxDate;
                model.flights[model.slicesId[i]].newDateSelected = null;
                model.flights[model.slicesId[i]].calendarPosition = getCalendarPosition(i);

                if (i === 1) {
                    adjustReturnFlightDates(model, i, isOptional);
                }
            };
            return model;
        };

        /* ---------------------- HELPERS ---------------------- */
        function initializeBaseModel(model, maxDate) {
            model.searchAvailable = false;
            model.routeDatepicker = `${MmBAppConstants.templatesRoute}ib-mmb-datepicker.html`;
            model.numberFlights = 0;
            model.slicesId = [];
            model.dateOptions = {
                showWeeks: false,
                maxMode: 'day',
                minDate: dayjs(),
                maxDate,
                dateDisabled: disabledBlackOutDates
            };
        }

        function getCalendarPosition(index) {
            return index === 1
                ? MmBAppConstants.CALENDAR_POSITION.RIGHT
                : MmBAppConstants.CALENDAR_POSITION.LEFT;
        }
        
        function adjustReturnFlightDates(model, index, isOptional) {
            const currentDate = new Date(model.flights[model.slicesId[index]].departureDateParsed.originalDate);
            const previousDate = new Date(model.flights[model.slicesId[index - 1]].departureDateParsed.originalDate);

            model.flights[model.slicesId[index]].dateOptions.initDate = currentDate;

            // Ensure that the earliest return date is no earlier than the departure date
            if (new Date(model.flights[model.slicesId[index]].dateOptions.minDate) < previousDate) {
                model.flights[model.slicesId[index]].dateOptions.minDate = previousDate;
            }

            // Adjust the maxDate of the outbound flight if the return flight is earlier
            if (isOptional && currentDate < new Date(model.flights[model.slicesId[index - 1]].dateOptions.maxDate)) {
                model.flights[model.slicesId[index - 1]].dateOptions.maxDate = currentDate;
            }
        }

        /**
        * This functions return request to get all data about availability flexibles flights
        * @param {Object} flights All information about flights
        * @param {String} flowId flowId
        * @returns {Object} 'availabilityFlexRequest' with all information neccesary to call service.
        *  */
        function generateRequestFlexibilization(flights, flowId, sisterCityModel) {
            var availabilityFlexRequest = {}, slicesInfo = [], sliceId, counter = 0;
            availabilityFlexRequest.flowId = flowId ? flowId : localStorageService.get('flowId') ? localStorageService.get('flowId') : null;
            for (sliceId in flights) {
                if (flights.hasOwnProperty(sliceId)) {
                    if (flights[sliceId].disrupted || flights[sliceId].optionalEnabled) {
                        slicesInfo.push(buildSliceRequest(flights[sliceId], sliceId, sisterCityModel, counter));
                    };
                };
                counter++;
            };
            availabilityFlexRequest.slices = slicesInfo;
            return availabilityFlexRequest;

            function buildSliceRequest(sliceItem, sliceId, sisterCityModel, counter) {
                var result = {};
                result.sliceId = sliceId;
                result.date = MmBUtilService.getDateFormatted(sliceItem.parseNewDateSelected.day, sliceItem.parseNewDateSelected.month, sliceItem.parseNewDateSelected.year);
                if (sisterCityModel) {
                    result.origins = [];
                    result.destinations = [];

                    angular.forEach(sisterCityModel.origin.originSisterCities, function (city) {
                        if (city.isSelected) {
                            if (counter >= 1) {
                                result.destinations.push(city.code);
                            } else {
                                result.origins.push(city.code);
                            }
                        }
                    });
                    angular.forEach(sisterCityModel.destination.destinationSisterCities, function (city) {
                        if (city.isSelected) {
                            if (counter >= 1) {
                                result.origins.push(city.code);
                            } else {
                                result.destinations.push(city.code);
                            }
                        }
                    });
                }
                return result;
            }
        };

        function calculateDateOption (strategy,isDeparture, currentDate, opositeCurrent, optExist, optEnabled, range) {
            var dateOption = null;
            dateOption = strategy.getDateOption(isDeparture, currentDate, opositeCurrent, range, optExist, optEnabled);
            return dateOption;
        }

        /**
         * This functions return a object with information about new date selected.
         * @param {date} date Is the new date selected.
         * @returns {Object} return formate date selected.
         **/
        function transformerDateSelected(date) {
            var parseDate = {
                'day': date.getDate(),
                'month': date.getMonth() + 1,
                'year': date.getFullYear(),
                'weekDay': date.getDay()
            };
            return parseDate;
        };

        function disabledBlackOutDates(dateAndMode) {
            var blackOutPeriodsData = localStorageService.get('blackOutPeriodsData');
            return (dateAndMode.mode === 'day' && blackOutPeriodsData && blackOutPeriodsData.blackOutPeriods.some(isBetweenDay));

            function isBetweenDay(actualDate) {
                return dayjs(dateAndMode.date).isBetween(actualDate.dateFrom, actualDate.dateTo, undefined, '[]');
            }
        }
    }
})();
