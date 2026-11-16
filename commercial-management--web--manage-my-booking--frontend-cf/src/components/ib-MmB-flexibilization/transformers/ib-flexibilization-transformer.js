(function () {
    'use strict';

    angular
        .module('ib-flexibilization-module')
        .factory('IbFlexibilizationTransformer', IbFlexibilizationTransformer);

    IbFlexibilizationTransformer.$inject = ['localStorageService', '$filter', 'MmBUtilService', 'MmBAppConstants'];
    function IbFlexibilizationTransformer(localStorageService, $filter, MmBUtilService, MmBAppConstants) {
        var service = {
            transformRebookResponse: transformRebookResponse,
            prepareRequestRebook: prepareRequestRebook
        };
        return service;

        ////////////////

        /**
         * 
         * @param {*}  
         */
        function transformRebookResponse(bookingInfo, slicesWithChanges, allSlices) {
            var pnr = localStorageService.get('PNR');
            var email = bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : '';
            var returnInfo = {
                'confirmationCode': pnr,
                'email': email,
                'residentInfo': {
                    'isActive': false,
                    'errors': {
                        'haveSomeError': false,
                        'allHaveError': false
                    },
                    'city': '',
                    'passengers': []
                },
                'relatedContent': bookingInfo.relatedContent
            };
            var flights = generateFlightsInfo(bookingInfo, slicesWithChanges, allSlices);
            if (bookingInfo && bookingInfo.order && bookingInfo.order.specialDiscounts) {
                angular.forEach(bookingInfo.order.specialDiscounts, function (specialDiscount) {
                    if (specialDiscount.type === 'RES') {
                        returnInfo.residentInfo.isActive = true;
                        returnInfo.residentInfo.passengers = getStatusResidentOfPassengers(bookingInfo, specialDiscount, returnInfo);
                    }
                });
            }
            returnInfo.slices = flights.slices;
            returnInfo.hasPartialError = flights.hasPartialError;

            return returnInfo;
        }

        function prepareRequestRebook(flowId, slices) {
            var tempSlice;
            var returnInfo = {
                'flowId': flowId,
                'slices': []
            };

            angular.forEach(slices, function (slice) {
                tempSlice = {
                    'sliceId': slice.tripSliceId,
                    'responseId': slice.responseId,
                    'offerId': slice.offers[0].offerId
                };
                returnInfo.slices.push(tempSlice);
            });
            return returnInfo;
        }

        function generateFlightsInfo(bookingInfo, slicesWithChanges, allSlices) {
            var slices = bookingInfo.order.slices;
            var sliceFound;
            var sliceIndex = 0,
                segmentIndex = 0,
                segments = [],
                title,
                segmentInfo = {},
                flights = {
                    'slices': [],
                    'hasPartialError': false
                };
            for (sliceIndex = 0; sliceIndex < slices.length; sliceIndex++) {
                segments = [];
                for (segmentIndex = 0; segmentIndex < slices[sliceIndex].segments.length; segmentIndex++) {
                    segmentInfo = {
                        'departureCity': slices[sliceIndex].segments[segmentIndex].departure.city.description,
                        'arrivalCity': slices[sliceIndex].segments[segmentIndex].arrival.city.description,
                        'departureAirport': slices[sliceIndex].segments[segmentIndex].departure.name,
                        'arrivalAirport': slices[sliceIndex].segments[segmentIndex].arrival.name,
                        'departureCode': slices[sliceIndex].segments[segmentIndex].departure.code,
                        'arrivalCode': slices[sliceIndex].segments[segmentIndex].arrival.code,
                        'departureTerminal': slices[sliceIndex].segments[segmentIndex].departure.terminal,
                        'arrivalTerminal': slices[sliceIndex].segments[segmentIndex].arrival.terminal,
                        'departureDateParsed': ($filter('DateFormatFilter')(slices[sliceIndex].segments[segmentIndex].departureDateTime)).formatedDate,
                        'arrivalDateParsed': ($filter('DateFormatFilter')(slices[sliceIndex].segments[segmentIndex].arrivalDateTime)).formatedDate,
                        'companyURL': MmBUtilService.getCompanyURL(slices[sliceIndex].segments[segmentIndex].flight.operationalCarrier.code),
                        'departureDateTimeParsed': slices[sliceIndex].segments[segmentIndex].departureDateTime.split(' ')[1],
                        'arrivalDateTimeParsed': slices[sliceIndex].segments[segmentIndex].arrivalDateTime.split(' ')[1],
                        'flightCode': slices[sliceIndex].segments[segmentIndex].flight.marketingCarrier.code + slices[sliceIndex].segments[segmentIndex].flight.marketingFlightNumber,
                        'operatedBy': slices[sliceIndex].segments[segmentIndex].flight.operationalCarrier.name,
                        'durationParsed': $filter('DurationFormatFilter')(slices[sliceIndex].segments[segmentIndex].duration),
                        'segmentId': slices[sliceIndex].segments[segmentIndex].id,
                        'sliceId': slices[sliceIndex].sliceId,
                        'status': slices[sliceIndex].segments[segmentIndex].status,
                        'cabin': slices[sliceIndex].segments[segmentIndex].cabin,
                        'waitingTimeParsed': $filter('DurationFormatFilter')(slices[sliceIndex].segments[segmentIndex].waitingTime),
                        'hasMissconnection': checkMissconnection(slices[sliceIndex].segments[segmentIndex].warnings)
                    };
                    segments.push(segmentInfo);
                }

                if (slices.length <= 2) {
                    if (sliceIndex === 0) {
                        title = $filter('translate')('CONFIRMATION_INFO_TITLE_1');
                    } else if (sliceIndex === 1) {
                        title = $filter('translate')('CONFIRMATION_INFO_TITLE_2');
                    }
                } else {
                    title = $filter('translate')('CONFIRMATION_INFO_TITLE_3') + ' ' + (sliceIndex + 1);
                }

                sliceFound = false;
                angular.forEach(allSlices, function (sliceTemp) {
                    if (sliceTemp.sliceId === slices[sliceIndex].sliceId) {
                        sliceFound = true;
                    }
                });

                if (!sliceFound) {
                    if (flightInWarning(slices[sliceIndex].sliceId, bookingInfo.warnings)) {
                        flights.slices.push({
                            'title': title,
                            'sliceId': slices[sliceIndex].sliceId,
                            'status': 'ERROR',
                            'segments': segments
                        });
                        flights.hasPartialError = true;
                    } else {
                        flights.slices.push({
                            'title': title,
                            'sliceId': slices[sliceIndex].sliceId,
                            'status': 'OK',
                            'segments': segments
                        });
                    }
                }
            }
            return flights;
        };

        function getStatusResidentOfPassengers(confirmationData, residentDiscount, returnInfo) {
            var passenger, counterErrors = 0, arrayPassengers = [];

            angular.forEach(confirmationData.passengers, function (pas) {
                passenger = {
                    'name': pas.externalPersonalInfo ? pas.externalPersonalInfo.name : pas.personalInfo.firstName,
                    'surname': pas.externalPersonalInfo ? pas.externalPersonalInfo.firstSurname + ' ' + pas.externalPersonalInfo.lastSurname : pas.personalInfo.firstSurname + ' ' + (pas.personalInfo.lastSurname ? pas.personalInfo.lastSurname : ''),
                    'isVerified': true
                };
                if (!pas.residenceAccreditationStatus || (pas.residenceAccreditationStatus === MmBAppConstants.RESIDENT.STATUS.NOT_VERIFIED)) {
                    passenger.isVerified = false;
                    returnInfo.residentInfo.errors.haveSomeError = true;
                    counterErrors++;
                }
                arrayPassengers.push(passenger);
            });
            if (counterErrors === arrayPassengers.length) {
                returnInfo.residentInfo.errors.allHaveError = true;
            }
            returnInfo.residentInfo.city = residentDiscount ? MmBAppConstants.RESIDENT.CITY[(residentDiscount.discountCode)] : MmBAppConstants.RESIDENT.CITY[(localStorageService.get('bookingUrlParams').resident)] || '';
            returnInfo.residentInfo.city = $filter('translate')(returnInfo.residentInfo.city);

            return arrayPassengers;
        }

        function flightInWarning(sliceId, warnings) {
            var hasWarning = false;
            angular.forEach(warnings, function (warn) {
                if (warn.code === 'SSE_MMB_1001' && warn.description === sliceId) {
                    hasWarning = true;
                }
            });
            return hasWarning;
        }

        function checkMissconnection(warningList) {
            var hasMissconnection = false;
            angular.forEach(warningList, function (warning) {
                if (warning.code === 'SSE_ORM_20014') {
                    hasMissconnection = true;
                }
            });
            return hasMissconnection;
        }
    }
})();
