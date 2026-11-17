(function () {
    'use strict';

    angular
        .module('ib-fly-now-confirmation-module')
        .factory('FlyNowConfirmationPATransformer', FlyNowConfirmationPATransformer);

    FlyNowConfirmationPATransformer.$inject = ['$filter', 'IbAncillariesPaymentUtilsService', 'localStorageService'];
    function FlyNowConfirmationPATransformer($filter, IbAncillariesPaymentUtilsService, localStorageService) {
        var service = {
            transformFlyNowConfirmationInfo: transformFlyNowConfirmationInfo,
            createRequestChangeOrder: createRequestChangeOrder,
            transformFareFamiliesConditions: transformFareFamiliesConditions
        };
        return service;

        ////////////////
        function transformFlyNowConfirmationInfo(oldSegmentInfo, newSegmentInfo) {
            var oldDate = oldSegmentInfo.departure.date != null && oldSegmentInfo.departure.date !== '' ? oldSegmentInfo.departure.date : null;
            var newDate = newSegmentInfo.departureDateTime ? newSegmentInfo.departureDateTime.split(' ') : null;
            var transformedFlyNowConfirmationInfo = {
                segmentInfo: {
                    'departure': oldSegmentInfo.departure,
                    'arrival': oldSegmentInfo.arrival,
                    'typeOfTransport': oldSegmentInfo.type,
                    'type': oldSegmentInfo.detailedType
                },
                newSegmentInfo: {
                    'weekDay': newSegmentInfo.date.weekDay,
                    'date': newDate ? newDate[0].split('-')[2] + '/' + newDate[0].split('-')[1] + '/' + newDate[0].split('-')[0] : '',
                    'departureHour': newSegmentInfo.departureTimeParsed,
                    'arrivalHour': newSegmentInfo.arrivalTimeParsed,
                    'cabinClass': angular.isDefined(oldSegmentInfo.cabinClass) ? oldSegmentInfo.cabinClass : newSegmentInfo.cabinClass,
                    'companyImg': newSegmentInfo.operatedByUrl,
                    'company': newSegmentInfo.operatedBy
                }
            }
            if (oldSegmentInfo.detailedType  !== 'OPEN') {
                transformedFlyNowConfirmationInfo['oldSegmentInfo'] = {
                    'weekDay': oldSegmentInfo.departure.date.weekDay,
                    'date': oldDate != null ? (oldDate.monthDay + '/' + oldDate.monthNumber + '/' + oldDate.year) : '',
                    'departureHour': oldSegmentInfo.departure.date ? oldSegmentInfo.departure.hour  : '',
                    'arrivalHour': oldSegmentInfo.arrival.date ? oldSegmentInfo.arrival.hour : '',
                    'cabinClass': oldSegmentInfo.cabinClass,
                    'companyImg': oldSegmentInfo.airlineLogo,
                    'company': oldSegmentInfo.airlineName
                }
            }
            transformFareFamiliesConditions(localStorageService.get('flightNowData').fareFamilyConditions);

            return transformedFlyNowConfirmationInfo
        }

        function createRequestChangeOrder() {
            return {
                'passengerIds': localStorageService.get('passengersSelected'),
                'originDestinations': [{
                    'selectedSliceId': localStorageService.get('newSelectedSegment').sliceId,
                    'originDestinationId': localStorageService.get('newSelectedSegment').originDestinationId
                }],
                'shoppingResponseId': localStorageService.get('flightNowData').responseId,
                'offerItemIds': getSelectedOfferItems(localStorageService.get('newSelectedSegment').sliceId, localStorageService.get('newSelectedSegment').originDestinationId)
            }

            function getSelectedOfferItems(sliceId, originDestinationId) {
                var flightNowData = localStorageService.get('flightNowData');
                var offerItemIds = [], oIndex = 0, sFound = false, oFound, odIndex, sIndex, oitIndex;
                while (!sFound && oIndex < flightNowData.offers.length) {
                    odIndex = 0, oFound = false;
                    while (!sFound && !oFound && odIndex < flightNowData.offers[oIndex].originDestinations.length) {
                        sIndex = 0;
                        if (flightNowData.offers[oIndex].originDestinations[odIndex].originDestinationId === originDestinationId) {
                            oFound = true;
                            while (!sFound && sIndex < flightNowData.offers[oIndex].originDestinations[odIndex].applicableSlices.length) {
                                if (flightNowData.offers[oIndex].originDestinations[odIndex].applicableSlices[sIndex].sliceId === sliceId) {
                                    sFound = true;
                                    for (oitIndex = 0; oitIndex < flightNowData.offers[oIndex].offerItems.length; oitIndex++) {
                                        offerItemIds.push(flightNowData.offers[oIndex].offerItems[oitIndex].offerItemId);
                                    }
                                }
                                sIndex++;
                            }
                        }
                        odIndex++;
                    }
                    oIndex++;
                }
                return offerItemIds;
            }
        }

        /**
         * Save the fareFamilyConditions in local storage
         * @param {Object} fareFamilyConditions  Object with fare family conditions
         */
        function transformFareFamiliesConditions(fareFamilyConditions) {
            IbAncillariesPaymentUtilsService.setFareFamilyConditions(fareFamilyConditions);
        }
    }
})();


