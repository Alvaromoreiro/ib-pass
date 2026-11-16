(function () {
    'use strict';

    angular
        .module('ib-MmB-booking-management-module')
        .factory('BookingManagementTransformer', BookingManagementTransformer);

    BookingManagementTransformer.$inject = ['$rootScope', 'localStorageService', 'MmBAppConstants', 'BookingManagementConstants', 'MmBUtilService'];
    function BookingManagementTransformer($rootScope, localStorageService, MmBAppConstants, BookingManagementConstants, MmBUtilService) {
        return {
            transformBookingManagementView: transformBookingManagementView,
            generateFareFamilyConditionsRequest: generateFareFamilyConditionsRequest,
            generateMinAndMaxSearchDate: generateMinAndMaxSearchDate
        };

        ////////////////
        /**
         * Creates the booking management page model depending on retrieve order rest service response
         * @param {Object} getBookingInfo the retrieve order rest service response
         * @param {Object} fareFamilyConditions the family conditions rest services response
         * @returns {Object} the booking management page model
         */
        function transformBookingManagementView(getBookingInfo) {
            var transformedInfo = {
                bookingCode: '',
                segments: [],
                passengers: [],
                optionalInformation: false,
                hasSavedChangesSuccess: false,
                showSpecialNeeds: true,
                haveSpecialPassenger: false,
                showCopyOfTickets: false
            };
            var hasSavedChangesSuccess = localStorageService.get('savedChangeSuccess');
            MmBUtilService.setFareFamilyConditions(getBookingInfo.fareFamilyConditions);
            transformedInfo.bookingCode = localStorageService.get('PNR');
            localStorageService.set('flowId', getBookingInfo.flowId);
            transformedInfo.segments = generateSegmentsInfo(getBookingInfo.order.slices, getBookingInfo.order.orderItems);
            transformedInfo.optionalInformation = generateDataContactInformation(getBookingInfo.order.optionalInformation);
            transformedInfo.passengers = generatePassengersInfo(getBookingInfo.passengers);

            if (hasSavedChangesSuccess) {
                transformedInfo.hasSavedChangesSuccess = hasSavedChangesSuccess;
                localStorageService.remove('savedChangeSuccess');
            }
            return transformedInfo;

            function generateSegmentsInfo(trips, orderItems) {
                var tIndex, sIndex, auxSegment, segments = [], notSelectableSegment = [];
                var segmentSaved = localStorageService.get('segmentSavedSuccess') || [];
                trips = trips || [];
                for (tIndex = 0; tIndex < trips.length; tIndex++) {
                    if (trips[tIndex].type === MmBAppConstants.SLICE_TYPES.SHUTTLE) {
                        for (sIndex = 0; sIndex < trips[tIndex].segments.length; sIndex++) {
                            auxSegment = MmBUtilService.getBasicSegmentInformation(trips[tIndex].segments[sIndex], trips[tIndex].sliceId);
                            angular.extend(auxSegment, {
                                'segmentIndex': sIndex,
                                'segmentStatus': getSegmentStatus(trips[tIndex].segments[sIndex]),
                                'seatList': getSeatList(trips[tIndex].segments[sIndex].id, orderItems),
                                'segmentOptions': generateSegmentOptions(trips[tIndex].segments[sIndex]),
                                'savedSuccess': segmentSaved.indexOf(trips[tIndex].segments[sIndex].id) !== -1
                            });
                            if (auxSegment.segmentStatus.code !== MmBAppConstants.STATUS.NOT_SELECTABLE) {
                                segments.push(auxSegment);
                            } else {
                                notSelectableSegment.push(auxSegment);
                            }
                        }
                    }
                }
                segments = segments.concat(notSelectableSegment);
                localStorageService.remove('segmentSavedSuccess');
                localStorageService.set('segments', segments);
                return segments;

                function getSegmentStatus(segmentInfo) {
                    var segmentStatus = { 'code': segmentInfo.ckiStatus.code, 'message': segmentInfo.ckiStatus.message };
                    if ((segmentInfo.type === MmBAppConstants.SEGMENT_TYPES.OPEN ||
                        (segmentInfo.type === MmBAppConstants.SEGMENT_TYPES.CONFIRMED && segmentInfo.ckiStatus.code === MmBAppConstants.STATUS.UNCHECKABLE))
                        && !(segmentInfo.flyNow || segmentInfo.mmbAllowed)) {
                        segmentStatus.code = MmBAppConstants.STATUS.NOT_SELECTABLE;
                    }
                    if (transformedInfo.showSpecialNeeds && BookingManagementConstants.SPECIAL_NEEDS_STATUS.indexOf(segmentInfo.ckiStatus.code) !== -1) {
                        transformedInfo.showSpecialNeeds = false;
                    }

                    if (segmentInfo.type !== MmBAppConstants.SEGMENT_TYPES.OPEN) {
                        transformedInfo.showCopyOfTickets = true;
                    }

                    return segmentStatus;
                }

                function getSeatList(segmentId, items) {
                    var seatList = '', seIndex;
                    for (seIndex = 0; seIndex < items.length; seIndex++) {
                        if (items[seIndex].type === BookingManagementConstants.ORDER_ITEMS.SEAT && items[seIndex].segmentId === segmentId) {
                            seatList += (seatList.length > 0 ? ', ' : '') + items[seIndex].row + items[seIndex].column;
                        }
                    }
                    return seatList.length === 0 ? null : seatList;
                }

                function generateSegmentOptions(segmentInfo) {
                    var segmentOptions = [];
                    if (segmentInfo.flyNow || segmentInfo.mmbAllowed) {
                        segmentOptions.push(segmentInfo.mmbAllowed ? {
                            'id': BookingManagementConstants.SEGMENT_OPTION.MODIFY,
                            'description': 'IBCOAC_MMB_WHAT_TO_DO_MODIFY',
                            'nextStep': BookingManagementConstants.SEGMENT_OPTION_STEP.FLY_NOW_MMB
                        } :
                            {
                                'id': BookingManagementConstants.SEGMENT_OPTION.CHECKIN,
                                'description': segmentInfo.type !== MmBAppConstants.SEGMENT_TYPES.OPEN ? 'IBCOAC_MMB_WHAT_TO_DO_MODIFY' : 'IBCOAC_MMB_WHAT_TO_DO_GO_CHECKIN',
                                'nextStep': segmentInfo.type !== MmBAppConstants.SEGMENT_TYPES.OPEN ? BookingManagementConstants.SEGMENT_OPTION_STEP.FLY_NOW_CKI : BookingManagementConstants.SEGMENT_OPTION_STEP.FLIGHT_PASSENGER_CKI
                            });
                    }
                    if (segmentInfo.type === MmBAppConstants.SEGMENT_TYPES.CONFIRMED) {
                        if (segmentInfo.ckiStatus.code === MmBAppConstants.STATUS.CHECKABLE) {
                            segmentOptions.push({
                                'id': BookingManagementConstants.SEGMENT_OPTION.CHECKIN,
                                'description': 'IBCOAC_MMB_WHAT_TO_DO_CHECKIN',
                                'nextStep': BookingManagementConstants.SEGMENT_OPTION_STEP.FLIGHT_PASSENGER_CKI
                            });
                        } else if ((segmentInfo.ckiStatus.code === MmBAppConstants.STATUS.CHECKED || segmentInfo.ckiStatus.code === MmBAppConstants.STATUS.STANDBY
                            || segmentInfo.ckiStatus.code === MmBAppConstants.STATUS.REISSUE) && !segmentInfo.flown) {
                            segmentOptions.push({
                                'id': BookingManagementConstants.SEGMENT_OPTION.BOARDING,
                                'description': 'IBCOAC_MMB_WHAT_TO_DO_BOARDING',
                                'nextStep': BookingManagementConstants.SEGMENT_OPTION_STEP.BOARDING
                            });
                            segmentOptions.push({
                                'id': BookingManagementConstants.SEGMENT_OPTION.SEAT,
                                'description': 'IBCOAC_MMB_WHAT_TO_DO_SEAT',
                                'nextStep': BookingManagementConstants.SEGMENT_OPTION_STEP.SEAT
                            });
                        }
                    }

                    return segmentOptions;
                }
            }

            function generatePassengersInfo(passengersInfo) {
                var i, transformedOptional, passengers = angular.copy(passengersInfo);

                for (i = 0; i < passengers.length; i++) {
                    transformedOptional = { 'contactData': false, 'emergency': false, 'ffInfo': false, 'specialNeed': false };
                    passengers[i].optionalInformation = passengers[i].optionalInformation || [];
                    if (passengers[i].optionalInformation.indexOf(BookingManagementConstants.OPTIONAL_INFORMATION.CONTACT_DATA) !== -1) {
                        transformedOptional.contactData = true;
                    }
                    if (passengers[i].optionalInformation.indexOf(BookingManagementConstants.OPTIONAL_INFORMATION.EMERGENCY) !== -1) {
                        transformedOptional.emergency = true;
                    }
                    if (passengers[i].optionalInformation.indexOf(BookingManagementConstants.OPTIONAL_INFORMATION.FF) !== -1) {
                        transformedOptional.ffInfo = true;
                    }
                    if (passengers[i].optionalInformation.indexOf(BookingManagementConstants.OPTIONAL_INFORMATION.PMRS) !== -1) {
                        transformedOptional.specialNeed = true;
                        transformedInfo.haveSpecialPassenger = true;
                    }
                    passengers[i].optionalInformation = transformedOptional;
                }
                buildPassengerSpecialNeeds(passengers);
                localStorageService.set('passengers', passengers);
                return passengers;
            }

            function buildPassengerSpecialNeeds(passengers) {
                var specialNeedsPassengers = [], orderItems = localStorageService.get('bookingInfo').order.orderItems;
                angular.forEach(passengers, function(passenger) {
                    specialNeedsPassengers.push({
                        'passengerId': passenger.passengerId,
                        'specialNeedsCodes': addSpecialNeedsCodes(passenger.passengerId)
                    });
                });

                localStorageService.set('specialNeedsPassengers', specialNeedsPassengers);

                function addSpecialNeedsCodes(passengerId) {
                    var arrCodes = [], arrDuplicate = [], firstCode = false, isDuplicate = false;
                    if(orderItems) {
                        for (let i = 0; i < orderItems.length; i++) {
                            const item = orderItems[i];
                            if(item.type == 'specialNeed' && item.passengerId === passengerId) {
                                if(!firstCode) {
                                    arrCodes.push(item.serviceCode);
                                    arrDuplicate.push(item.serviceCode);
                                    firstCode = true;
                                } else {
                                    isDuplicate = false;

                                    for (let j = 0; j < arrDuplicate.length; j++) {
                                        const duplicate = arrDuplicate[j];
                                        if(duplicate == item.serviceCode) {
                                            isDuplicate = true;
                                        }
                                    }

                                    if(!isDuplicate) {
                                        arrCodes.push(item.serviceCode);
                                        arrDuplicate.push(item.serviceCode);
                                    }
                                }

                            }
                        }
                    }
                    return arrCodes;
                }
            }

            function generateDataContactInformation(optionalInformation) {
                var i, optional = false;
                optionalInformation = optionalInformation || [];
                for (i = 0; i < optionalInformation.length; i++) {
                    if (optionalInformation[i] === BookingManagementConstants.OPTIONAL_INFORMATION.CONTACT_DATA) {
                        optional = true;
                    }
                }
                return optional;
            }
        }

        /**
         * Create the request object for fareFamilies depending on retrive segments objects
         * @param {*} getBookingInfo  - the retrieve order rest service response
         * @return {Object}- The fare famliy rest service request
         */
        function generateFareFamilyConditionsRequest(getBookingInfo) {
            var i, j, auxSegment;
            var fareFamilyRequest = [];
            for (i = 0; i < getBookingInfo.order.slices.length; i++) {
                for (j = 0; j < getBookingInfo.order.slices[i].segments.length; j++) {
                    auxSegment = getBookingInfo.order.slices[i].segments[j];
                    if (auxSegment.cabin.fareFamily && fareFamilyRequest.indexOf(auxSegment.cabin.fareFamily) <= -1) {
                        fareFamilyRequest.push(auxSegment.cabin.fareFamily);
                    }
                }
            }
            return fareFamilyRequest;
        }

        /**
         * Transform the date of segment to miliseconds and save in localstorage
         * @param dataSegments All segments for check dates and return the date
         * @param selectedSegmentId Selected segment to change
         */
        function generateMinAndMaxSearchDate(dataSegments, selectedSegment) {
            var i = 0, sFound = false, j, dateFound, segmentsSearchDates = { 'minSearchDate': null, 'maxSearchDate': null };
            while (!sFound && i < dataSegments.length) {
                if (dataSegments[i].id === selectedSegment.id) {
                    sFound = true;
                    dateFound = false; j = i - 1;
                    while (!dateFound && j >= 0) {
                        if (dataSegments[j].transformedArrivalDate) {
                            dateFound = true;
                            segmentsSearchDates.minSearchDate = new Date(dataSegments[j].transformedArrivalDate.originalDate).getTime();
                        }
                        j--;
                    }
                    dateFound = false; j = i + 1;
                    while (!dateFound && j < dataSegments.length) {
                        if (dataSegments[j].transformedDepartureDate) {
                            dateFound = true;

                            segmentsSearchDates.maxSearchDate = new Date(dataSegments[j].transformedDepartureDate.originalDate).getTime();
                        }
                        j++;
                    }
                }
                i++;
            }
            localStorageService.set('searchDate', segmentsSearchDates);
        }
    }
})();
