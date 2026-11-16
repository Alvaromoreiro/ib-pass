import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

(function () {
    'use strict';

    angular
        .module('ib-flexibilization-availability-module')
        .factory('IbFlexAvailabilityTransformer', IbFlexAvailabilityTransformer);

    IbFlexAvailabilityTransformer.$inject = ['MmBUtilService', 'MmBAppConstants'];
    function IbFlexAvailabilityTransformer(MmBUtilService, MmBAppConstants) {
        var service = {
            getAvailabilityRequest: getAvailabilityRequest,
            getTransformedAvailabilityData: getTransformedAvailabilityData
        };
        return service;

        ////////////////

        /**
         *
         * @param {*}
         */
        function getAvailabilityRequest(flowId, selectedDate, sisterCityModel) {
            var returnInfo = {}, i;
            returnInfo.flowId = flowId;
            returnInfo.slices = [];
            for (i = 0; i < selectedDate.length; i++) {
                returnInfo.slices[i] = buildSliceRequest(selectedDate[i], sisterCityModel, i);
            }
            return returnInfo;

            function buildSliceRequest(selectedDateItem, sisterCityModel, counter) {
                var result;
                result = {};
                result.sliceId = selectedDateItem.tripSliceId;
                result.date = selectedDateItem.date.format('YYYY-MM-DD');
                if (sisterCityModel) {
                    result.origins = [];
                    result.destinations = [];

                    angular.forEach(sisterCityModel[sisterCityModel.referenceSliceId].origin.originSisterCities, function (city) {
                        if (city.isSelected) {
                            if (counter >= 1) {
                                result.destinations.push(city.code);
                            } else {
                                result.origins.push(city.code);
                            }
                        }
                    });
                    angular.forEach(sisterCityModel[sisterCityModel.referenceSliceId].destination.destinationSisterCities, function (city) {
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
        }
        function getTransformedAvailabilityData(availabilityData, sisterCitiesModel) {
            var transformedInit, availabilitiesSlices = {}, i, j, k, initialOrigin, initialDestination, selectedDates = [], updatedDateList = [], originSisterNum = null, destinationSisterNum = null;
            for (i = 0; i < availabilityData.availabilityDataResponse.availabilities.length; i++) {
                availabilitiesSlices[i] = [];
                for (j = 0; j < availabilityData.availabilityDataResponse.availabilities[i].originDestinations.length; j++) {
                    initialOrigin = {
                        'code': availabilityData.availabilityDataResponse.availabilities[i].originDestinations[j].origin,
                        'description': availabilityData.availabilityDataResponse.availabilities[i].originDestinations[j].originCity.description
                    };
                    initialDestination = {
                        'code': availabilityData.availabilityDataResponse.availabilities[i].originDestinations[j].destination,
                        'description': availabilityData.availabilityDataResponse.availabilities[i].originDestinations[j].destinationCity.description
                    };
                    updatedDateList[i] = {};
                    selectedDates[i] = {
                        'date': dayjs(availabilityData.availabilityDataResponse.availabilities[i].originDestinations[j].slices[0].departureDateTime.split(' ')[0]),
                        'isSelected': true,
                        'isAvailable': false,
                        'tripSliceId': availabilityData.availabilityDataResponse.availabilities[i].sliceId
                    };
                    
                    const { origin, destination } = checkSisterCities(sisterCitiesModel);

                    originSisterNum = origin;
                    destinationSisterNum = destination;
                    
                    for (k = 0; k < availabilityData.availabilityDataResponse.availabilities[i].originDestinations[j].slices.length; k++) {
                        if(sisterCitiesModel?.length > 0 && initialOrigin.description === sisterCitiesModel[sisterCitiesModel.referenceSliceId].origin.originOrderCities.description){
                            availabilitiesSlices[i][k] = getOffersInfo(availabilityData.availabilityDataResponse.availabilities[i].offers, availabilityData.availabilityDataResponse.availabilities[i].originDestinations[0].slices[k], initialOrigin, initialDestination, availabilityData.availabilityDataResponse.availabilities[i].sliceId, availabilityData.availabilityDataResponse.availabilities[i].responseId, originSisterNum, destinationSisterNum);
                        } else {
                            //change the order of the number of sister cities
                            availabilitiesSlices[i][k] = getOffersInfo(availabilityData.availabilityDataResponse.availabilities[i].offers, availabilityData.availabilityDataResponse.availabilities[i].originDestinations[0].slices[k], initialOrigin, initialDestination, availabilityData.availabilityDataResponse.availabilities[i].sliceId, availabilityData.availabilityDataResponse.availabilities[i].responseId, destinationSisterNum, originSisterNum);
                        }
                    }
                }
            }
            transformedInit = {
                'flowId': availabilityData.availabilityDataResponse.flowId,
                'slices': availabilitiesSlices,
                'selectedSlices': {},
                'listSlicesShow': 0,
                'totalShow': false,
                'orderBy': null,
                'tripsLength': i,
                'relatedContent': MmBUtilService.getRelatedContent(availabilityData.availabilityDataResponse.relatedContent),
                'parsedRelatedContent': parsePlainRelatedContent(availabilityData.availabilityDataResponse.relatedContent),
                'selectedDate': selectedDates,
                'updatedDateList': updatedDateList,
                'showAvailability': true,
                'showErrorPage': { isError: false },
                'ribbonFlexData': availabilityData.ribbonFlexData
            };
            return transformedInit;
        }
        function checkSisterCities(sisterCitiesModel) {
            let origin = null;
            let destination = null;

            if (sisterCitiesModel) {
                if(sisterCitiesModel.sisterCitiesOptionChecked){
                    origin = sisterCitiesModel[sisterCitiesModel.referenceSliceId].originSisterCitiesNum === '+0' ? null : sisterCitiesModel[sisterCitiesModel.referenceSliceId].originSisterCitiesNum;
                    destination = sisterCitiesModel[sisterCitiesModel.referenceSliceId].destinationSisterCitiesNum === '+0' ? null : sisterCitiesModel[sisterCitiesModel.referenceSliceId].destinationSisterCitiesNum;
                } else {
                    origin = null;
                    destination = null;
                }
            }
            return { origin, destination };
        }

        function getOffersInfo(offers, slice, initialOrigin, initialDestination, tripSliceId, responseId, originSisterNum, destinationSisterNum) {
            var offerTranformed, index = 0, i, j, k, duration = dayjs.duration(slice.duration, 'minutes'), diffDay;
            diffDay = slice.arrivalDateTime.split(' ')[0].split('-').join('') - slice.departureDateTime.split(' ')[0].split('-').join('');
            offerTranformed = {
                'offers': [],
                'sliceId': slice.sliceId,
                'arrivalDate': slice.arrivalDateTime.split(' ')[0],
                'arrivalTime': slice.arrivalDateTime.split(' ')[1],
                'arrivalDiffDay': diffDay,
                'departureDate': slice.departureDateTime.split(' ')[0],
                'departureTime': slice.departureDateTime.split(' ')[1],
                'durationMinutes': slice.duration,
                'durationParsed': duration.hours() + 'h ' + duration.minutes() + 'min.',
                'overnight': slice.overnight,
                'stopsNumber': slice.stopsNumber,
                'scale': slice.stopsNumber === 0 ? 'MMB_VC_YOUR_FLIGHTS_DIRECT_TEXT' : slice.stopsNumber === 1 ? 'MMB_VC_YOUR_FLIGHTS_SCALE_SIMPLE_TEXT' : 'MMB_VC_YOUR_FLIGHTS_SCALE_PLURAL_TEXT',
                'segments': getSegments(slice.segments),
                'iconCompany': MmBUtilService.getCompanyLogo(slice.segments[0].flight.operationalDisclosure),
                'companyName': slice.segments[0].flight.operationalCarrier.name,
                'initialOrigin': initialOrigin,
                'initialDestination': initialDestination,
                'originNum': originSisterNum,
                'origin': {
                    'code': slice.segments[0].departure.city.code,
                    'description': slice.segments[0].departure.city.description
                },
                'destinationNum': destinationSisterNum,
                'destination': {
                    'code': slice.segments[slice.segments.length - 1].arrival.city.code,
                    'description': slice.segments[slice.segments.length - 1].arrival.city.description
                },
                'cashAvios': slice.cashAvios,
                'numberOpereds': getOperedBySegments(slice.segments),
                'tripSliceId': tripSliceId,
                'responseId': responseId,
                'technicalStops': getTechnicalStopsInfo(slice.segments)
            };
            for (i = 0; i < offers.length; i++) {
                //for this flow this array has leangth max = 1
                for (j = 0; j < offers[i].originDestinations.length; j++) {
                    //for this flow this array has leangth max = 1
                    for (k = 0; k < offers[i].originDestinations[j].applicableSlices.length; k++) {
                        if (offers[i].originDestinations[j].applicableSlices[k].sliceId === offerTranformed.sliceId) {
                            offerTranformed.offers[index] = {
                                'offerId': offers[i].offerId,
                                'offerItems': {
                                    'offerItemId': offers[i].offerItems[0].offerItemId,
                                    'passengerIds': offers[i].offerItems[0].passengerIds,
                                    'privateFareInformation': offers[i].offerItems[0].privateFareInformation
                                },
                                'providerOfferId': offers[i].providerOfferId,
                                'privateFare': offers[i].privateFare,
                                'offerType': offers[i].offerType
                            };
                            index++;
                        }
                    }
                }
            }
            return offerTranformed;
        }
        function getSegments(segments) {
            var segmentTransformed = [], i, duration, stopDuration, waitingTime;
            for (i = 0; i < segments.length; i++) {
                duration = dayjs.duration(segments[i].duration, 'minutes');
                stopDuration = segments[i].stop ? dayjs.duration(segments[i].stop.duration, 'minutes') : '';
                waitingTime = segments[i].waitingTime ? dayjs.duration(segments[i].waitingTime, 'minutes') : '';
                // let prevWaitingTime = i === 0 ? '' : segmentTransformed[i - 1].waitingTime;
                segmentTransformed[i] = {
                    'segmentId': segments[i].segmentId,
                    'arrivalDate': segments[i].arrivalDateTime.split(' ')[0],
                    'arrivalTime': segments[i].arrivalDateTime.split(' ')[1],
                    'departureDate': segments[i].departureDateTime.split(' ')[0],
                    'departureTime': segments[i].departureDateTime.split(' ')[1],
                    'durationMinutes': segments[i].duration,
                    'durationParsed': duration.hours() + 'h ' + duration.minutes() + 'min.',
                    'departurePlace': segments[i].departure.name + ' (' + segments[i].departure.code + ')',
                    'arrivalPlace': segments[i].arrival.name + ' (' + segments[i].arrival.code + ')',
                    'line': segments[i].flight.marketingCarrier.name + segments[i].flight.marketingFlightNumber,
                    'airplane': segments[i].flight.aircraft.description,
                    'opered': segments[i].flight.operationalCarrier.name,
                    'iconCompany': MmBUtilService.getCompanyLogo(segments[i].flight.operationalDisclosure),
                    'stop': {
                        'isStop': segments[i].stop,
                        'place': segments[i].stop ? segments[i].stop.city.description + ' (' + segments[i].stop.city.code + ')' : '',
                        'time': segments[i].stop ? stopDuration.hours() + 'h ' + stopDuration.minutes() + 'min.' : ''
                    },
                    'waitingTime': waitingTime ? waitingTime.hours() + 'h ' + waitingTime.minutes() + 'min.' : '',
                    'warnings': generateSegmentWarningMessage(segments[i], i > 0 ? segments[i - 1] : null)
                };
            }
            return segmentTransformed;
        }
        function generateSegmentWarningMessage(segmentInfo, previousSegment) {
            var returnedWarnings = {}, i, waitingTime = 0, shortScale = false, hasOnlyShortScale = false;
            segmentInfo.warnings = segmentInfo.warnings || [];
            for (i = 0; i < segmentInfo.warnings.length; i++) {
                switch (segmentInfo.warnings[i].code) {
                    case MmBAppConstants.WARNING_MESSAGES.OVERNIGHT_WARNING:
                        returnedWarnings['nightFlight'] = {
                            'isOverNight': true,
                            'message': segmentInfo.warnings[i].description
                        };
                        break;
                    case MmBAppConstants.WARNING_MESSAGES.TERMINAL_CHANGE_WARNING:
                        if (previousSegment != null) returnedWarnings['terminalChange'] = {
                            'show': true,
                            'hasTerminal': previousSegment.arrival.terminal && segmentInfo.departure.terminal,
                            'message': segmentInfo.warnings[i].description, //PEDIR COMPUESTO DESDE BACK COMO IMPORTORDER
                            'arrival': previousSegment.arrival.terminal,
                            'departure': segmentInfo.departure.terminal,
                            'arrivalCity': previousSegment.arrival.name + ' (' + previousSegment.arrival.code + ')',
                            'departureCity': segmentInfo.departure.name + ' (' + segmentInfo.departure.code + ')'
                        };
                        break;
                    case MmBAppConstants.WARNING_MESSAGES.AIRPORT_CHANGE_WARNING:
                        returnedWarnings['airportChange'] = {
                            'show': true,
                            'message': segmentInfo.warnings[i].description, //PEDIR COMPUESTO DESDE BACK COMO IMPORTORDER
                            'arrival': previousSegment.arrival.name + ' (' + previousSegment.arrival.code + ')',
                            'departure': segmentInfo.departure.name + ' (' + segmentInfo.departure.code + ')'
                        };
                        break;
                    case MmBAppConstants.WARNING_MESSAGES.LONG_WAITING_WARNING:
                        waitingTime = dayjs.duration(segmentInfo.waitingTime, 'minutes');
                        returnedWarnings['scaleWaitingTime'] = {
                            'show': true,
                            'isLong': true,
                            'waitingTime': waitingTime.hours() + 'h ' + waitingTime.minutes() + 'min.'
                        };
                        break;
                    case MmBAppConstants.WARNING_MESSAGES.MISSCONNECTION_FLEX_WARNING:
                        returnedWarnings['missconnection'] = {
                            'show': true,
                            'message': segmentInfo.warnings[i].description
                        };
                        break;
                }
            }
            if (segmentInfo.waitingTime > 0 && !returnedWarnings.scaleWaitingTime) {
                shortScale = true;
                hasOnlyShortScale = true;
                waitingTime = dayjs.duration(segmentInfo.waitingTime, 'minutes');
                returnedWarnings['shortScale'] = {
                    'show': true,
                    'waitingTime': waitingTime.hours() + 'h ' + waitingTime.minutes() + 'min.',
                    'city': segmentInfo.departure.name + ' ' + '(' + segmentInfo.departure.code + ')'
                };
            }
            returnedWarnings['hasShortScale'] = shortScale;
            if (shortScale) {
                if (returnedWarnings.airportChange || returnedWarnings.terminalChange) {
                    hasOnlyShortScale = false;
                }
                returnedWarnings['hasOnlyShortScale'] = hasOnlyShortScale;
            }
            /*if (!returnedWarnings.nightFlight) {
                returnedWarnings.nightFlight = { 'isOverNight': segmentInfo.overnight, 'message': 'MMB_NIGHT_FLIGHT', 'needstranslate': true }
            }
            if (!returnedWarnings.scaleWaitingTime && previousSegment != null) {
                returnedWarnings.scaleWaitingTime = { 'show': true, 'waitingTime': prevWaitingTime };
            }*/
            return returnedWarnings;
        }
        function getOperedBySegments(segments) {
            var diferentOpereds = [], i;
            for (i = 0; i < segments.length; i++) {
                if (diferentOpereds.indexOf(segments[i].flight.operationalCarrier.code) === -1) {
                    diferentOpereds.push(segments[i].flight.operationalCarrier.code);
                }
            }
            return diferentOpereds.length;
        }

        function getTechnicalStopsInfo(segments) {
            var technicalStopInfo = {
                'techStopsNumber': 0,
                'techStopsText': ''
            }, i;

            for (i = 0; i < segments.length; i++) {
                if (segments[i].stop) {
                    technicalStopInfo.techStopsNumber++;
                }
            }

            technicalStopInfo.techStopsText = technicalStopInfo.techStopsNumber === 1 ? 'MMB_YOUR_FLIGHTS_STOP_SIMPLE_TEXT' : 'MMB_YOUR_FLIGHTS_STOP_PLURAL_TEXT';

            return technicalStopInfo;
        }

        function parsePlainRelatedContent(relatedContent){
            var returnRelatedContent = {}, i;
            if (relatedContent) {
                for (i = 0; i < relatedContent.length; i++) {
                    returnRelatedContent[relatedContent[i].key] = relatedContent[i].value;
                }
            }
            return returnRelatedContent;
        }
    }
})();
