(function () {
    'use strict';

    angular
        .module('ib-flexibilization-search-module')
        .factory('IbFlexFlexibilizationTransformer', IbFlexFlexibilizationTransformer);

    IbFlexFlexibilizationTransformer.$inject = ['localStorageService', 'MmBUtilService'];
    function IbFlexFlexibilizationTransformer(localStorageService, MmBUtilService) {
        var service = {
            generateRequestFlexibilization: generateRequestFlexibilization,
            getModelFlighVC: getModelFlighVC,
            getBuildModelVC: getBuildModelVC
        };
        return service;

        ////////////////

        /**
         * This functions return request to get all data about availability flexibles flights
         * @param {Object} flights All information about flights
         * @returns {Object} 'availabilityFlexRequest' with all information neccesary to call service.
         *  */
        function generateRequestFlexibilization(flights) {
            var availabilityFlexRequest = {}, slicesInfo = [], sliceId;
            availabilityFlexRequest.flowId = localStorageService.get('flowId') ? localStorageService.get('flowId') : null;
            for (sliceId in flights) {
                if (flights.hasOwnProperty(sliceId)) {
                    if (flights[sliceId].checked) {
                        slicesInfo.push({
                            'sliceId': sliceId,
                            'date': MmBUtilService.getDateFormatted(flights[sliceId].parseNewDateSelected.day, flights[sliceId].parseNewDateSelected.month, flights[sliceId].parseNewDateSelected.year)
                        });
                    };
                };
            };
            availabilityFlexRequest.slices = slicesInfo;
            return availabilityFlexRequest;
        };


        /**
         * Generate all information and model to launch search of availability flights for voluntary change
         * @param data is all information about slice and segments of booking.
         * @param slicesId is a array with slicesId of all slices of flights.
         * @param numberFlights indicate the number slices have the flight.
         * @returns Type of Model flight to search availability.
         *  */
        function getModelFlighVC(data, slicesId, numberFlights) {
            var i, modeFlight = null, keys = [], slices = [];
            for (i in data.flights) {
                slices.push(data.flights[i]);
                keys.push(i);
            };
            if (!data.flights[keys[0]].changeNewDate) {
                data.flights[keys[0]].changeNewDate = new Date(data.flights[keys[0]].departureDateParsed.originalDate);
                data.flights[slicesId[0]].parseNewDate = transformerDate(data.flights[slicesId[0]].changeNewDate);
            };
            if (slices[0].checked) {
                modeFlight = 'outbound';
            };
            if (numberFlights > 1) {
                if (!data.flights[keys[1]].changeNewDate) {
                    data.flights[keys[1]].changeNewDate = new Date(data.flights[keys[1]].departureDateParsed.originalDate);
                    data.flights[slicesId[1]].parseNewDate = transformerDate(data.flights[slicesId[1]].changeNewDate);
                }
                if (slices[0].checked && slices[1].checked) {
                    modeFlight = 'twice';
                } else if (!slices[0].checked && slices[1].checked) {
                    modeFlight = 'return';
                }
            };
            return modeFlight;

            function transformerDate(date) {
                var parseDate = {
                    'day': date.getDate(),
                    'month': date.getMonth() + 1,
                    'year': date.getFullYear(),
                    'weekDay': date.getDay()
                };
                return parseDate;
            }
        };

        /**
         * Generate and return all inforamtion the model to generate ribbon model of flights.
         * @param {Object} flights is a object with all information about flights in the booking.
         * @returns {Array} buildModel contains all model neccesary.
         *  */
        function getBuildModelVC(flights) {
            var buildModel = [], i = 1, key;
            for (key in flights) {
                buildModel.push({
                    originDestinationId: 'OD' + i,
                    origin: flights[key].departureCity.city.code,
                    destination: flights[key].arrivalCity.city.code,
                    originCity: {
                        description: flights[key].departureCity.city.description,
                    },
                    destinationCity: {
                        description: flights[key].arrivalCity.city.description,
                    }
                });
                i++;
            };
            return buildModel;
        };

    }
})();