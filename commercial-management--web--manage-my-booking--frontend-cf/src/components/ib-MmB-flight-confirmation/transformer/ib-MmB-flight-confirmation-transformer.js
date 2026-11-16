(function () {
    'use strict';

    angular
        .module('ib-MmB-flight-confirmation-module')
        .factory('FlightConfirmationTransformer', FlightConfirmationTransformer);

    FlightConfirmationTransformer.$inject = ['localStorageService', '$filter', 'MmBUtilService', 'MmBAppConstants'];
    function FlightConfirmationTransformer(localStorageService, $filter, MmBUtilService, MmBAppConstants) {

        return {
            transformConfirmationView: transformConfirmationView,
            transformFareFamiliesConditions: transformFareFamiliesConditions,
            generateChangeOrderRequest: generateChangeOrderRequest,
            posibleDeleteSegments: posibleDeleteSegments,
            areDeletedSegments: areDeletedSegments
        };

        ////////////////
        /**
         * Generates the flight confirmation view model info based on initial 'selectedSegment' info and 'newselectedSegment'
         * goten from session storage
         */
        function transformConfirmationView() {
            var selectedSegment = localStorageService.get('selectedSegment'), newSelectedSegment = localStorageService.get('newSelectedSegment'), fareFamilyConditions;
            var transformerInfo = {
                'selectedSegmentDetails': selectedSegment,
                'oldSegmentInfo': generateOldSegmentInfo(selectedSegment),
                'newSegmentInfo': generateNewSegmentInfo(newSelectedSegment)
            };
            fareFamilyConditions = localStorageService.get('bookingInfo').fareFamilyConditions || localStorageService.get('fareFamilyConditionsData');
            transformerInfo.newSegmentInfo.cabinClass = angular.copy(transformerInfo.oldSegmentInfo.cabinClass);
            transformFareFamiliesConditions(fareFamilyConditions);
            return transformerInfo;

            function generateOldSegmentInfo(segmentInfo) {
                return {
                    'departureDate': segmentInfo.transformedDepartureDate,
                    'arrivalDate': segmentInfo.transformedArrivalDate,
                    'cabinClass': segmentInfo.cabinClass,
                    'company': {
                        'logo': segmentInfo.segment.companyURL,
                        'description': segmentInfo.segment.companyName
                    },
                    'type': selectedSegment.type
                };
            }

            function generateNewSegmentInfo(segmentInfo) {
                return {
                    'departureDate': $filter('DateFormatFilter')(segmentInfo.outboundDate),
                    'arrivalDate': $filter('DateFormatFilter')(segmentInfo.inboundDate),
                    'company': segmentInfo.company,
                    'cabinClass': segmentInfo.cabinClass
                };
            }
        }

        /**
         * Save the fareFamilyConditions in local storage
         * @param {Object} fareFamilyConditions  Object with fare family conditions
         */
        function transformFareFamiliesConditions(fareFamilyConditions) {
            MmBUtilService.setFareFamilyConditions(fareFamilyConditions);
        }

        /**
         * Returns the change order rest service request to change the current selected flight
         */
        function generateChangeOrderRequest() {
            var newSegment = localStorageService.get('newSelectedSegment');
            return {
                'shoppingResponseId': localStorageService.get('responseId'),
                'offerItemIds': newSegment.offerItemIds,
                'originDestinations': [
                    {
                        'originDestinationId': newSegment.originDestinationId,
                        'selectedSliceId': newSegment.sliceId
                    }
                ],
                'passengerIds': localStorageService.get('selectedPassengerId'),
                'checkinId': localStorageService.get('flowId')
            };
        }

        /**
        * Check if at least one of the next segments of the current segment are checked in order to show a modal
        */
        function posibleDeleteSegments() {
            var segmentsInfo = localStorageService.get('bookingInfo').order.slices;
            var orderSegments = [], i, j;
            var selectedSegment = localStorageService.get('selectedSegment');
            var segmentIndex = 0, haveChecked = false, segmentFound = false;
            for (i = 0; i < segmentsInfo.length; i++) {
                for (j = 0; j < segmentsInfo[i].segments.length; j++) {
                    if (segmentsInfo[i].sliceId === selectedSegment.sliceId && segmentsInfo[i].segments[j].id === selectedSegment.id) {
                        orderSegments.push(segmentsInfo[i].segments[j]);
                        segmentFound = true;
                    } else if (segmentFound) {
                        orderSegments.push(segmentsInfo[i].segments[j]);
                    }
                }
            }
            while (!haveChecked && segmentIndex < orderSegments.length) {
                if (orderSegments[segmentIndex].ckiStatus.code === MmBAppConstants.STATUS.CHECKED) {
                    haveChecked = true;
                }
                segmentIndex++;
            }
            return haveChecked;
        }

        /**
        * Check if changeOrder service response with deleted segments in order to show a modal.
        */
        function areDeletedSegments(data) {
            return data && data.length > 0;
        }
    }
})();