(function () {
    'use strict';

    angular
        .module('ib-flight-now-module')
        .factory('FlightNowTransformer', FlightNowTransformer);

    FlightNowTransformer.$inject = ['$filter', 'CheckinAppConstants', 'IbUtilsService', 'localStorageService'];
    function FlightNowTransformer($filter, CheckinAppConstants, IbUtilsService, localStorageService) {
        var service = {
            transformFlightNowInfo: transformFlightNowInfo,
            createFlyNowRequest: createFlyNowRequest
        };
        return service;

        ////////////////
        function transformFlightNowInfo(flightNowData) {
            var i, j, k, l, m, odOwnId = 0, sliceIndex, offerInfo;
            var flightNowTransformed = {
                'departureCity': flightNowData.originDestinations[0].originCity.description,
                'departureCodeAirport': flightNowData.originDestinations[0].origin,
                'departureAirport': flightNowData.originDestinations[0].slices[0].segments[0].departure.name,
                'arrivalCity': flightNowData.originDestinations[0].destinationCity.description,
                'arrivalCodeAirport': flightNowData.originDestinations[0].destination,
                'arrivalAirport': flightNowData.originDestinations[0].slices[0].segments[0].arrival.name,
                'showFuturesFlight': localStorageService.get('selectedBlockPa').whatToDo.mmbAvailable,
                'originDestinations': []
            }

            for (i = 0; i < flightNowData.originDestinations.length; i++) {
                flightNowTransformed.originDestinations[i] = {};
                flightNowTransformed.originDestinations[i]['tabId'] = odOwnId;
                flightNowTransformed.originDestinations[i]['originDestinationId'] = flightNowData.originDestinations[i].originDestinationId;
                flightNowTransformed.originDestinations[i]['departureDateParsed'] = $filter('DateFormatFilter')(flightNowData.originDestinations[i].slices[0].departureDateTime);
                flightNowTransformed.originDestinations[i]['slices'] = [];
                for (j = 0; j < flightNowData.originDestinations[i].slices.length; j++) {

                    if (j !== 0 && flightNowData.originDestinations[i].slices[j].departureDateTime.split(' ')[0] !== flightNowData.originDestinations[i].slices[j - 1].departureDateTime.split(' ')[0]) {
                        odOwnId++
                        flightNowTransformed.originDestinations[odOwnId] = {};
                        flightNowTransformed.originDestinations[odOwnId]['tabId'] = odOwnId;
                        flightNowTransformed.originDestinations[odOwnId]['originDestinationId'] = flightNowData.originDestinations[i].originDestinationId;
                        flightNowTransformed.originDestinations[odOwnId]['departureDateParsed'] = $filter('DateFormatFilter')(flightNowData.originDestinations[i].slices[j].departureDateTime);
                        flightNowTransformed.originDestinations[odOwnId]['slices'] = [];
                    }
                    flightNowTransformed.originDestinations[odOwnId].slices.push({
                        'originDestinationId': flightNowData.originDestinations[i].originDestinationId,
                        'sliceId': flightNowData.originDestinations[i].slices[j].sliceId,
                        'date': $filter('DateFormatFilter')(flightNowData.originDestinations[i].slices[j].departureDateTime),
                        'departureDateTime': flightNowData.originDestinations[i].slices[j].departureDateTime,
                        'departureTimeParsed': flightNowData.originDestinations[i].slices[j].departureDateTime.split(' ')[1],
                        'arrivalDateTime': flightNowData.originDestinations[i].slices[j].arrivalDateTime,
                        'arrivalTimeParsed': flightNowData.originDestinations[i].slices[j].arrivalDateTime.split(' ')[1],
                        'operatedBy': flightNowData.originDestinations[i].slices[j].segments[0].flight.operationalCarrier.name,
                        'operatedByUrl': IbUtilsService.getAirlineLogos(flightNowData.originDestinations[i].slices[j].segments[0].flight.operationalCarrier.code),
                    })
                    offerInfo = getOfferInfo(flightNowData.originDestinations[i].originDestinationId, flightNowData.originDestinations[i].slices[j].sliceId);
                    sliceIndex = flightNowTransformed.originDestinations[odOwnId].slices.length - 1;
                    flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex]['remainingSeats'] = offerInfo.remainingSeats;
                    flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex]['cabinClass'] = offerInfo.cabinClass;
                    flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex]['disabled'] = flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex].remainingSeats === 0;
                    flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex]['myflight'] = localStorageService.get('selectedBlockPa').detailedType === 'CONFIRMED' && localStorageService.get('selectedBlockPa').departure.originalDate === flightNowData.originDestinations[i].slices[j].departureDateTime && localStorageService.get('selectedBlockPa').arrival.originalDate === flightNowData.originDestinations[i].slices[j].arrivalDateTime;
                    flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex].operatedByUrl = flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex].disabled ? flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex].operatedByUrl.companyDisabledURL : flightNowTransformed.originDestinations[odOwnId].slices[sliceIndex].operatedByUrl.companyURL;
                }
            }

            return flightNowTransformed;

            function getOfferInfo(originDestinationId, sliceId) {
                var remainingSeats, cabinClass;
                for (k = 0; k < flightNowData.offers.length; k++) {
                    for (l = 0; l < flightNowData.offers[k].originDestinations.length; l++) {
                        if (flightNowData.offers[k].originDestinations[l].originDestinationId === originDestinationId) {
                            for (m = 0; m < flightNowData.offers[k].originDestinations[l].applicableSlices.length; m++) {
                                if (flightNowData.offers[k].originDestinations[l].applicableSlices[m].sliceId === sliceId) {
                                    remainingSeats = flightNowData.offers[k].originDestinations[l].applicableSlices[m].remainingSeats;
                                    cabinClass = flightNowData.offers[k].originDestinations[l].applicableSlices[m].segments[0].bookingClass;
                                }
                            }
                        }
                    }
                }
                return { 'remainingSeats': remainingSeats, 'cabinClass': cabinClass };
            };
        }


        function createFlyNowRequest(selectedBlock, checkinId) {
            return {
                'flowId': checkinId,
                'slices': [
                    {
                        'origin': selectedBlock.departure.airportCode || (selectedBlock.departure.airport && selectedBlock.departure.airport.code),
                        'destination': selectedBlock.arrival.airportCode || (selectedBlock.arrival.airport && selectedBlock.arrival.airport.code),
                    }
                ],
                'marketCode': CheckinAppConstants.market,
                'preferredCabin': selectedBlock.cabinClass.type || 'ECONOMY',
                'allowUnavailableFlights': true
            };
        }

    }
})();


