/* eslint-disable space-before-function-paren */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-nested-ternary */
(function () {
    'use strict';

    angular
        .module('ib-checkin-services-module')
        .factory('FlightsPassengersUtils', FlightsPassengersUtils);

    FlightsPassengersUtils.$inject = ['$filter', 'CheckinAppConstants', 'localStorageService', '$sce', 'ModalService', '$timeout', 'IbUtilsService', 'CheckinFlowService'];
    function FlightsPassengersUtils($filter, CheckinAppConstants, localStorageService, $sce, ModalService, $timeout, IbUtilsService, CheckinFlowService) {
        const service = {
            getGeneralSegmentInfo: getGeneralSegmentInfo,
            getDetailedSegmentInfo: getDetailedSegmentInfo,
            getPassengerInfo: getPassengerInfo,
            getPassengersUpdateInformation: getPassengersUpdateInformation,
            getSegmentsUpdateInformation: getSegmentsUpdateInformation,
            getAcceptUpdateInformation: getAcceptUpdateInformation,
            updateSelectedSegments: updateSelectedSegments,
            updateSelectedPassengers: updateSelectedPassengers,
            getPassengerAdditionalInfo: getPassengerAdditionalInfo,
            getPassengerEmergencyInfo: getPassengerEmergencyInfo,
            initModelApisUsTracing: initModelApisUsTracing,
            checkExistAPIsUsTracing: checkExistAPIsUsTracing,
            openUsPrivacyActStatementModal: openUsPrivacyActStatementModal,
            getReasonNoItemInhibition: getReasonNoItemInhibition,
            generateWhatToDoShuttleBlocks: generateWhatToDoShuttleBlocks
        };

        return service;

        ////////////////

        function getGeneralSegmentInfo(generalPassengersInfo, segmentInfo, type) {
            let passengersIndex;
            const passengersInfo = segmentInfo.passengers || [], segmentsError = [], auxWhatToDoShuttle = { flyNow: false, mmbAvailable: false, hasSeat: false, noShow: false };
            let checked = 0, available = 0, notAvailable = 0, notAllowed = 0, passengerStatus, availablePassengers = 0, passengerStatusObject = {}, passengerInfo = {};
            const returnedInfoSegment = {
                segmentStatus: '',
                segmentStatusReason: '',
                segmentStatusReasonCode: '',
                passengersStatus: [],
                airCheck: {
                    status: false,
                    url: ''
                }
            };

            for (passengersIndex = 0; passengersIndex < passengersInfo.length; passengersIndex++) {
                passengerInfo = passengersInfo[passengersIndex];
                passengerStatusObject = {
                    id: '',
                    status: '',
                    reasonCode: '',
                    isSelected: true,
                    name: '',
                    surname: '',
                    airCheckDocumentationRequired: false,
                    items: [],
                    inhibitBoardingCard: {
                        reason: []
                    }
                };

                passengerStatusObject.items = (Array.isArray(passengerInfo.items)) ? passengerInfo.items : [];

                passengerStatusObject.airCheckDocumentationRequired = passengerInfo?.airCheckDocumentationRequired || false;

                if (Array.isArray(passengerInfo.inhibitBoardingCard)) {
                    passengerStatusObject.inhibitBoardingCard.reason = passengerInfo.inhibitBoardingCard;

                    const newReason = getReasonNoItemInhibition(passengerStatusObject.inhibitBoardingCard.reason);
                    if (newReason) {
                        passengerStatusObject.items.push(newReason);
                    }
                    passengerStatusObject.airCheckDocumentationRequired = passengerInfo?.airCheckDocumentationRequired || false;
                }

                if (CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.CHECKED.indexOf(passengerInfo.status.code) !== -1) {
                    checked++;
                    availablePassengers++;
                } else if (CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.AVAILABLE.indexOf(passengerInfo.status.code) !== -1) {
                    available++;
                    availablePassengers++;
                } else if (CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.NOT_AVAILABLE.indexOf(passengerInfo.status.code) !== -1) {
                    passengerStatus = getGeneralPassengerStatus(generalPassengersInfo, passengerInfo.id);
                    segmentsError.push(passengerInfo.status);
                    if (passengerStatus.code === CheckinAppConstants.GENERAL_PASSENGERS_STATUS.ALLOWED) {
                        notAvailable++;
                    } else {
                        notAllowed++;
                    }
                }
                passengerStatusObject.id = passengerInfo.id;
                passengerStatusObject.status = passengerInfo.status.code;
                passengerStatusObject.name = generalPassengersInfo[passengersIndex].name;
                passengerStatusObject.surname = generalPassengersInfo[passengersIndex].surname;
                passengerStatusObject.flyNow = passengerInfo.flyNow;
                passengerStatusObject.reasonCode = passengerStatus?.reason?.code || '';
                returnedInfoSegment.passengersStatus.push(passengerStatusObject);

                auxWhatToDoShuttle.flyNow = auxWhatToDoShuttle.flyNow || passengerInfo.flyNow;
                auxWhatToDoShuttle.mmbAvailable = auxWhatToDoShuttle.mmbAvailable || passengerInfo.mmbAvailable;
                auxWhatToDoShuttle.hasSeat = auxWhatToDoShuttle.hasSeat || passengerInfo.seat !== null;
                auxWhatToDoShuttle.noShow = auxWhatToDoShuttle.noShow || passengerInfo.noShow;
            }

            returnedInfoSegment.checkInStatusTime = segmentInfo?.checkInStatusTime;
            returnedInfoSegment.airCheck = checkAircheckData(segmentInfo?.airCheck);
            returnedInfoSegment.segmentStatus = getSegmentStatus({
                segmentInfo,
                passengersInfo,
                notAvailable,
                notAllowed,
                checked,
                availablePassengers,
                available,
                auxWhatToDoShuttle
            });
            returnedInfoSegment.segmentStatusReason = Array.isArray(segmentsError) ? segmentsError[0]?.message ?? '' : '';
            returnedInfoSegment.segmentStatusReasonCode = getSegmentStatusReasonCode(returnedInfoSegment.passengersStatus);
            if (type === CheckinAppConstants.FLIGHT_TYPES.SHUTTLE) {
                returnedInfoSegment.whatToDo = generateWhatToDoShuttleBlocks(auxWhatToDoShuttle, segmentInfo, returnedInfoSegment.segmentStatus);
            }

            return returnedInfoSegment;
        }

        function getGeneralPassengerStatus(passengersInformation = [], passengerId) {
            const passenger = passengersInformation.find(item => item?.id === passengerId);

            return passenger?.status || CheckinAppConstants.GENERAL_PASSENGERS_STATUS.NOT_ALLOWED;
        }

        function getDetailedSegmentInfo(segmentInfo, segmentStatus) {
            const segmentDetailedInfo = buildSegmentDetailedInfo(
                segmentInfo,
                segmentStatus
            );

            return segmentDetailedInfo;
        }

        function createFieldStatus(passenger, isOpenPA) {
            const { requiredInformation = [] } = passenger;
            const existApis = requiredInformation.includes(CheckinAppConstants.PASSENGER_DATA_OPTIONS.API) || requiredInformation.includes(CheckinAppConstants.PASSENGER_DATA_OPTIONS.TIMATIC);
            return {
                contactData: createContactDataStatus(passenger, CheckinAppConstants.PASSENGER_DATA_OPTIONS.CONTACT_DATA, existApis),
                emergencyData: createContactDataStatus(passenger, CheckinAppConstants.PASSENGER_DATA_OPTIONS.EMERGENCY_DATA, existApis),
                gender: createGenderStatus(passenger, CheckinAppConstants.PASSENGER_DATA_OPTIONS.GENDER, existApis),
                frequentFlyer: createFrequentFlyerStatus(passenger, isOpenPA)
            };
        }

        function createContactDataStatus({ optionalInformation = [], requiredInformation = [] } = passenger, fieldSearch, existApis = false) {
            const allInfo = [...optionalInformation, ...requiredInformation];
            return {
                available: allInfo.includes(fieldSearch),
                show: existApis ? false : allInfo.includes(fieldSearch),
                mandatory: requiredInformation.includes(fieldSearch)
            };
        }

        function createGenderStatus({ optionalInformation = [], requiredInformation = [], type } = passenger, fieldSearch, existApis = false) {
            const allInfo = [...optionalInformation, ...requiredInformation];
            const isChild = type === 'CHILD';

            return {
                show: !existApis && (allInfo.includes(fieldSearch) || isChild),
                mandatory: requiredInformation.includes(fieldSearch)
            };
        }

        function createFrequentFlyerStatus({ optionalInformation = [], requiredInformation = [], frequentFlyer } = passenger, isOpenPA = false) {
            const allInfo = [...optionalInformation, ...requiredInformation];
            const { FREQUENT_FLYER, FF } = CheckinAppConstants.PASSENGER_DATA_OPTIONS;
            const search = (arr) => arr.includes(FREQUENT_FLYER) || arr.includes(FF);
            return {
                show: isOpenPA || frequentFlyer || search(allInfo),
                mandatory: search(requiredInformation),
                isOpenPA: isOpenPA
            };
        }

        function isRequiredApis({ optionalInformation = [], requiredInformation = [] } = passenger, isCheckable) {
            const { API, TIMATIC } = CheckinAppConstants.PASSENGER_DATA_OPTIONS;
            const isApisMandatory = requiredInformation.includes(API) || requiredInformation.includes(TIMATIC);
            const isApisOptional = (optionalInformation.includes(API) || optionalInformation.includes(TIMATIC)) && isCheckable;
            return isApisMandatory || isApisOptional;
        }

        function existSegmentsOpenPA(segments = []) {
            return Array.isArray(segments) && segments.length > 0 &&
                segments.every(segment =>
                    segment.type === CheckinAppConstants.SHUTTLE_SEGMENTS_TYPES.OPEN
                );
        }

        function getDisruptionContact(additionalInfo = [], id) {
            return additionalInfo.find(info => info.id === id)?.disruptionContact;
        }

        function getInitialData({ gender, frequentFlyer, contactData } = returnedPasInfo) {
            return {
                contact: structuredClone({ gender, phone: contactData.phone, email: contactData.email, frequentFlyer }),
                emergency: structuredClone({ ...contactData.emergency })
            };
        }

        function getContactDataPhone(passengerAdditionalInfo, defaultPrefix) {
            return {
                countryCode: passengerAdditionalInfo?.phone?.countryCode?.code ?? defaultPrefix,
                number: passengerAdditionalInfo?.phone?.number ?? ''
            };
        }

        function getContactDataEmergencyInfo(emergencyInfo, defaultPrefix) {
            return {
                phone: {
                    countryCode: emergencyInfo?.phone?.countryCode?.code ?? defaultPrefix,
                    number: emergencyInfo?.phone?.number ?? ''
                },
                name: emergencyInfo?.name
            };
        }

        function getContactData(defaultPrefix, passengerAdditionalInfo, emergencyInfo, passengerAvailable = false) {
            return {
                denyNewsLetter: false,
                email: passengerAdditionalInfo?.email,
                phone: getContactDataPhone(passengerAdditionalInfo, defaultPrefix),
                emergency: getContactDataEmergencyInfo(emergencyInfo, defaultPrefix),
                available: passengerAvailable
            };
        }

        function getPassengerInfo(passenger, areAllSegmentChecked, additionalInfo, emergencyServiceData, defaultPrefix, open) {
            const bookingInfo = localStorageService.get('bookingInfo');
            const isOpenPA = existSegmentsOpenPA(bookingInfo?.airShuttleSegments);
            const passengerStatus = getPassengerStatus(passenger, areAllSegmentChecked, isOpenPA);

            const passengerInfo = buildPassengerInfo({
                passenger: passenger,
                passengerStatus: passengerStatus,
                bookingInfo: bookingInfo,
                additionalInfo: additionalInfo,
                emergencyServiceData: emergencyServiceData,
                defaultPrefix: defaultPrefix,
                isOpenPA: isOpenPA,
                open: open
            });

            passengerInfo.contactData.available = passengerInfo.pasStatus.available;
            passengerInfo.initialData = getInitialData(passengerInfo);

            return passengerInfo;
        }

        function buildPassengerInfo({ passenger, passengerStatus, bookingInfo, additionalInfo, emergencyServiceData, defaultPrefix, isOpenPA, open }) {
            const passengerAdditionalInfo = getDisruptionContact(additionalInfo, passenger.id);
            const emergencyInfo = extractEmergencyInfo(emergencyServiceData, passenger.id);
            const passengerStatusFlight = extractPassengerStatusFlight(bookingInfo);
            const isFFActive = isFrequentFlyerActive(passenger);

            return {
                ...buildBasicPassengerData(passenger, open),
                pasStatus: passengerStatus,
                requiresApis: isRequiredApis(passenger, passengerStatusFlight === 'CHECKABLE'),
                fieldStatus: createFieldStatus(passenger, isOpenPA),
                contactData: getContactData(defaultPrefix, passengerAdditionalInfo, emergencyInfo, passengerStatus.available),
                language: passengerAdditionalInfo?.language || CheckinAppConstants.lang,
                frequentFlyer: buildFrequentFlyerInfo(passenger.frequentFlyer, isFFActive),
                inhibitBoardingCard: createInhibitBoardingCardDefault(),
                initialData: null
            };
        }

        function buildBasicPassengerData(passenger, open) {
            return {
                id: passenger.id,
                type: passenger.type,
                requiredInformation: passenger.requiredInformation,
                isSelected: false,
                isOpen: open,
                name: passenger.name,
                surname: passenger.surname,
                gender: passenger.gender || 'MALE',
                infant: passenger.infant
            };
        }

        function extractPassengerStatusFlight(bookingInfo) {
            return bookingInfo?.outwardSegments?.[0]?.passengers?.[0]?.status?.code || null;
        }

        function isFrequentFlyerActive(passenger) {
            return passenger.optionalInformation?.includes(CheckinAppConstants.PASSENGER_DATA_OPTIONS.FREQUENT_FLYER) || false;
        }


        function extractEmergencyInfo(emergencyServiceData, passengerId) {
            const emergencyData = emergencyServiceData.find(
                item => item?.emergencyContact && item.passengerId === passengerId
            );
            return emergencyData?.emergencyContact || null;
        }

        function buildFrequentFlyerInfo(frequentFlyer, enabled) {
            return {
                info: frequentFlyer || { number: '', iataCompanyCode: '' },
                enabled
            };
        }

        function createInhibitBoardingCardDefault() {
            return {
                status: false,
                reason: [],
                url: ''
            };
        }

        function getPassengerStatus(passenger, allSegmentChecked, isOpenPA) {
            const available = determineAvailability(passenger, isOpenPA);
            const isChecked = available && allSegmentChecked;
            const reason = available ? null : getPassengerStatusReason(passenger.status);
            const isApiEsta = checkAndUpdateApiEsta(passenger);

            return {
                available,
                isChecked,
                reason,
                isApiEsta,
                hasSBY: false
            };
        }

        function determineAvailability(passenger, isOpenPA) {
            const isAllowed = passenger.status.code === CheckinAppConstants.GENERAL_PASSENGERS_STATUS.ALLOWED;
            const isNotAllowed = passenger.status.code === CheckinAppConstants.GENERAL_PASSENGERS_STATUS.NOT_ALLOWED;

            if (isOpenPA && isNotAllowed) {
                return false;
            }

            return isOpenPA || isAllowed;
        }

        function checkAndUpdateApiEsta(passenger) {
            const isNotAllowed = passenger.status.code === CheckinAppConstants.GENERAL_PASSENGERS_STATUS.NOT_ALLOWED;
            const isReasonEsta = hasEstaOrEesConstraints(passenger.status.reason);
            const isApiEsta = (isNotAllowed && isReasonEsta) || existPassengersApisDocs(passenger.id);

            if (isApiEsta) {
                CheckinFlowService.updateApiEsta({ showTextEsta: true });
            }

            return isApiEsta;
        }

        function hasEstaOrEesConstraints(reason) {
            if (!reason?.code) {
                return false;
            }
            return reason.code.includes('ESTA_CONSTRAINTS') || reason.code.includes('EES_CONSTRAINTS');
        }

        function existPassengersApisDocs(id) {
            const passengersApisDocs = localStorageService.get('passengersApisDocs') || [];
            return passengersApisDocs.includes(id);
        }


        /**
         * Return array of passenger with additional information option
         * @param {Object} bookingData Information of booking
         * @return {Array} Array with ids of passengers
         */
        function getPassengerAdditionalInfo(bookingData) {
            const passengers = bookingData.passengers || [];

            return passengers
                .filter(pas => checkInfo(pas, CheckinAppConstants.PASSENGER_DATA_OPTIONS.CONTACT_DATA))
                .map(pas => pas.id) || [];
        }

        /**
         * Return array of passenger with emergency information
         * @param {Object} bookingData Information of booking
         * @return {Array} Array with ids of passengers with emergency info op
         */
        function getPassengerEmergencyInfo(bookingData) {
            const passengers = bookingData.passengers || [];

            return passengers
                .filter(passenger => checkInfo(passenger, CheckinAppConstants.PASSENGER_DATA_OPTIONS.EMERGENCY_DATA))
                .map(passenger => passenger.id) || [];
        }

        /**
         * Check if passenger have the required information or required information and return
         * @param {Obj} passenger
         * @param {String} key
         * @returns {boolean} TRUE if passenger have key
         */
        function checkInfo(passenger, key) {
            return passenger.optionalInformation.indexOf(key) !== -1 || passenger.requiredInformation.indexOf(key) !== -1;
        }

        function generateWhatToDoShuttleBlocks(whatToDoStatus, segmentInfo, status) {
            const returnedShuttleBlocks = { active: false, options: [], selectedBlock: {} };
            const flightConfirmationNeedsCheckin = localStorageService.get('flightConfirmationNeedsCheckin') || [];
            if (segmentInfo.type === CheckinAppConstants.SHUTTLE_SEGMENTS_TYPES.CONFIRMED && !segmentInfo.flown) {
                if (status === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.AVAILABLE || flightConfirmationNeedsCheckin.indexOf(segmentInfo.id) !== -1) {
                    returnedShuttleBlocks.options.push({ id: CheckinAppConstants.SHUTTLE_WHAT_TO_DO_BLOCKS.CHECK_IN, description: 'IBCOAC_PA_WHAT_TO_DO_CHECKIN', nextStep: CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP, icon: 'icon-checking_online' });
                } else if (status === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.CHECKED) {
                    if (!localStorageService.get('bookingInfo')?.ancillariesDisabled) returnedShuttleBlocks.options.push({ id: CheckinAppConstants.SHUTTLE_WHAT_TO_DO_BLOCKS.SEAT, description: 'IBCOAC_PA_WHAT_TO_DO_SEAT', nextStep: CheckinAppConstants.SHUTTLE_NEXT_STEPS.SEATS_MAP, icon: 'icon-asiento' });
                    returnedShuttleBlocks.options.push({ id: CheckinAppConstants.SHUTTLE_WHAT_TO_DO_BLOCKS.BOARDING_CARD, description: 'IBCOAC_PA_WHAT_TO_DO_BOARDING', nextStep: CheckinAppConstants.SHUTTLE_NEXT_STEPS.BOARDING_CARDS, icon: 'icon-imprimir' });
                }
            }
            if (whatToDoStatus.flyNow) {
                returnedShuttleBlocks.options.push({ id: CheckinAppConstants.SHUTTLE_WHAT_TO_DO_BLOCKS.MODIFY_SEGMENT, description: 'IBCOAC_PA_WHAT_TO_DO_MODIFY', nextStep: CheckinAppConstants.SHUTTLE_NEXT_STEPS.FLY_NOW, icon: 'icon-cambios_y_reembolsos' });
            } else if (whatToDoStatus.mmbAvailable) {
                returnedShuttleBlocks.options.push({ id: CheckinAppConstants.SHUTTLE_WHAT_TO_DO_BLOCKS.MODIFY_SEGMENT, description: 'IBCOAC_PA_WHAT_TO_DO_MODIFY', nextStep: CheckinAppConstants.SHUTTLE_NEXT_STEPS.GDR, icon: 'icon-cambios_y_reembolsos' });
            }
            if (returnedShuttleBlocks.options.length === 1) {
                returnedShuttleBlocks.selectedBlock = returnedShuttleBlocks.options[0];
            }
            returnedShuttleBlocks.active = returnedShuttleBlocks.options.length > 0;

            return returnedShuttleBlocks;
        }

        function getPassengersUpdateInformation(passengersInfo, useForAllInfo, selectedShuttleSegmentInfo) {
            const passengersData = [];
            const returnPasUpdateInfo = {
                regularPassengersIds: [], passengersApisIds: [], passengersSelected: [],
                newsLetterInfo: { info: [] }, additionalInfo: { needsUpdate: false, info: [], isMandatory: false }, emergencyInfo: { needsUpdate: false, info: [], isMandatory: false }
            };
            const shuttleSegmentType = (angular.isObject(selectedShuttleSegmentInfo) && angular.isString(selectedShuttleSegmentInfo.detailedType)) ? selectedShuttleSegmentInfo.detailedType : (angular.isObject(selectedShuttleSegmentInfo) && angular.isString(selectedShuttleSegmentInfo.type)) ? selectedShuttleSegmentInfo.type : '';
            let pasIndex, additionalInfo, emergencyInfo, additionalInfoForAll, emergencyInfoForAll, newsLetterInfo, updateAllContactData = false, updateAllEmergencyData = false;

            updateAllContactData = checkAdditionalInfo(passengersInfo);
            updateAllEmergencyData = checkEmergencyInfo(passengersInfo);

            for (pasIndex = 0; pasIndex < passengersInfo.length; pasIndex++) {
                passengersData.push({ id: passengersInfo[pasIndex].id + '', email: passengersInfo[pasIndex].contactData && passengersInfo[pasIndex].contactData.email ? passengersInfo[pasIndex].contactData.email : '', phone: passengersInfo[pasIndex].contactData && passengersInfo[pasIndex].contactData.phone ? passengersInfo[pasIndex].contactData.phone.number : '' });
                if (passengersInfo[pasIndex].isSelected) {
                    additionalInfo = getAdditionalInfo(passengersInfo[pasIndex], useForAllInfo.additionalInfoUseForAllCheck.status, updateAllContactData);
                    emergencyInfo = getEmergencyInfo(passengersInfo[pasIndex], useForAllInfo.emergencyDataUseForAllCheck.status, updateAllEmergencyData);
                    if (useForAllInfo.additionalInfoUseForAllCheck.showId === passengersInfo[pasIndex].id && useForAllInfo.additionalInfoUseForAllCheck.status) {
                        additionalInfoForAll = angular.copy(additionalInfo);
                    }
                    if (useForAllInfo.emergencyDataUseForAllCheck.showId === passengersInfo[pasIndex].id && useForAllInfo.emergencyDataUseForAllCheck.status) {
                        emergencyInfoForAll = angular.copy(emergencyInfo);
                    }
                    if (additionalInfoForAll || additionalInfo) {
                        if (additionalInfoForAll) {
                            additionalInfoForAll.gender = passengersInfo[pasIndex].gender;
                            additionalInfoForAll.id = passengersInfo[pasIndex].id;
                            if (additionalInfoForAll.frequentFlyer && passengersInfo[pasIndex].frequentFlyer.info && passengersInfo[pasIndex].frequentFlyer.info.number !== '' && passengersInfo[pasIndex].frequentFlyer.info.iataCompanyCode !== '') {
                                additionalInfoForAll.frequentFlyer = passengersInfo[pasIndex].frequentFlyer.info;
                            } else {
                                delete additionalInfoForAll.frequentFlyer;
                            }
                        }
                        if (((additionalInfoForAll && additionalInfoForAll.disruptionContact && additionalInfoForAll.disruptionContact.email) || (additionalInfo && additionalInfo.disruptionContact && additionalInfo.disruptionContact.email)) || (additionalInfoForAll && additionalInfoForAll.disruptionContact && additionalInfoForAll.disruptionContact.phone || additionalInfo && additionalInfo.disruptionContact && additionalInfo.disruptionContact.phone)) {
                            passengersData.push({ id: passengersInfo[pasIndex].id + '', email: additionalInfoForAll && additionalInfoForAll.disruptionContact && additionalInfoForAll.disruptionContact.email ? additionalInfoForAll.disruptionContact.email : additionalInfo && additionalInfo.disruptionContact && additionalInfo.disruptionContact.email ? additionalInfo.disruptionContact.email : '', phone: additionalInfoForAll && additionalInfoForAll.disruptionContact && additionalInfoForAll.disruptionContact.phone ? additionalInfoForAll.disruptionContact.phone.number : additionalInfo && additionalInfo.disruptionContact && additionalInfo.disruptionContact.phone ? additionalInfo.disruptionContact.phone.number : '' });
                        }

                        returnPasUpdateInfo.additionalInfo.isMandatory = passengersInfo[pasIndex].requiredInformation.indexOf(CheckinAppConstants.PASSENGER_DATA_OPTIONS.CONTACT_DATA) !== -1;
                        returnPasUpdateInfo.additionalInfo.info.push(angular.copy(additionalInfoForAll) || additionalInfo);
                    }
                    if (emergencyInfoForAll || emergencyInfo) {
                        if (emergencyInfoForAll) {
                            emergencyInfoForAll.id = passengersInfo[pasIndex].id;
                        }

                        returnPasUpdateInfo.emergencyInfo.isMandatory = passengersInfo[pasIndex].requiredInformation.indexOf(CheckinAppConstants.PASSENGER_DATA_OPTIONS.EMERGENCY_DATA) !== -1;
                        returnPasUpdateInfo.emergencyInfo.info.push(angular.copy(emergencyInfoForAll) || emergencyInfo);
                    }
                    newsLetterInfo = getNewsLettersInfo(passengersInfo[pasIndex]);
                    if (newsLetterInfo) {
                        returnPasUpdateInfo.newsLetterInfo.info.push(newsLetterInfo);
                    }

                    if (passengersInfo[pasIndex].requiresApis) {
                        returnPasUpdateInfo.passengersApisIds.push(parseInt(passengersInfo[pasIndex].id));
                    } else {
                        returnPasUpdateInfo.regularPassengersIds.push(parseInt(passengersInfo[pasIndex].id));
                    }
                } else if (selectedShuttleSegmentInfo && CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.SHUTTLE.indexOf(shuttleSegmentType) !== -1) {
                    returnPasUpdateInfo.regularPassengersIds.push(parseInt(passengersInfo[pasIndex].id));
                }
                localStorageService.set('passengersContactData', passengersData);
            }
            returnPasUpdateInfo.additionalInfo.needsUpdate = returnPasUpdateInfo.additionalInfo.info.length > 0;
            returnPasUpdateInfo.emergencyInfo.needsUpdate = (updateAllEmergencyData && returnPasUpdateInfo.emergencyInfo.info.length > 0);
            returnPasUpdateInfo.passengersSelected = returnPasUpdateInfo.regularPassengersIds.concat(returnPasUpdateInfo.passengersApisIds);

            return returnPasUpdateInfo;

            function getAdditionalInfo(pasInfo, useForAll, isNeedUpdateAll) {
                const returnPasInfo = pasInfo.fieldStatus.frequentFlyer.isOpenPA ? { id: pasInfo.id } : { id: pasInfo.id, disruptionContact: { language: pasInfo.language || CheckinAppConstants.lang } };
                const needsToBeUpdated = (pasInfo.gender && pasInfo.gender !== 'CHILD' && pasInfo.gender !== pasInfo.initialData.contact.gender || pasInfo.fieldStatus.gender.mandatory || useForAll)
                    || (pasInfo.contactData.phone && pasInfo.contactData.phone.number && pasInfo.contactData.phone.number !== '' && (pasInfo.fieldStatus.contactData.mandatory || !angular.equals(pasInfo.contactData.phone, pasInfo.initialData.contact.phone) || useForAll))
                    || (pasInfo.contactData.email && pasInfo.contactData.email !== '' && (pasInfo.fieldStatus.contactData.mandatory || pasInfo.contactData.email !== pasInfo.initialData.contact.email || useForAll))
                    || (pasInfo.frequentFlyer.info && !angular.equals(pasInfo.frequentFlyer.info, pasInfo.initialData.contact.frequentFlyer.info));
                if ((needsToBeUpdated || isNeedUpdateAll) && pasInfo.gender && pasInfo.gender !== 'CHILD' && !pasInfo.fieldStatus.frequentFlyer.isOpenPA) {
                    returnPasInfo.gender = pasInfo.gender;
                }
                if ((needsToBeUpdated || isNeedUpdateAll) && pasInfo.contactData.phone && pasInfo.contactData.phone.number && pasInfo.contactData.phone.number !== '') {
                    returnPasInfo.disruptionContact.phone = pasInfo.contactData.phone;
                }
                if ((needsToBeUpdated || isNeedUpdateAll) && pasInfo.contactData.email && pasInfo.contactData.email !== '') {
                    returnPasInfo.disruptionContact.email = pasInfo.contactData.email;
                }
                if ((needsToBeUpdated || isNeedUpdateAll) && pasInfo.frequentFlyer.info && pasInfo.frequentFlyer.info.number !== '' && pasInfo.frequentFlyer.info.iataCompanyCode !== '') {
                    if (angular.equals(pasInfo.frequentFlyer.info, pasInfo.initialData.contact.frequentFlyer.info)) {
                        returnPasInfo.frequentFlyer = null;
                    } else {
                        returnPasInfo.frequentFlyer = pasInfo.frequentFlyer.info;
                    }
                }

                return needsToBeUpdated || isNeedUpdateAll ? returnPasInfo : null;
            }

            function getEmergencyInfo(pasInfo, useForAll, isNeedUpdateAll) {
                const dataRefused = {
                    refused: true,
                    name: 'REFUSED',
                    phone: {
                        countryCode: 'REFUSED',
                        number: 'REFUSED'
                    }
                };
                const returnEmerInfo = {
                    id: pasInfo.id,
                    emergencyContact: angular.copy(dataRefused)
                };
                const isOkPhone = angular.isObject(pasInfo.contactData.emergency.phone) && angular.isDefined(pasInfo.contactData.emergency.phone.number) && pasInfo.contactData.emergency.phone.number !== null && pasInfo.contactData.emergency.phone.number !== '';
                const isOkName = angular.isDefined(pasInfo.contactData.emergency.name) && pasInfo.contactData.emergency.name !== null && pasInfo.contactData.emergency.name !== '';
                const needsToBeUpdated = (isOkPhone && (pasInfo.fieldStatus.contactData.mandatory || useForAll || !angular.equals(pasInfo.contactData.emergency.phone, pasInfo.initialData.emergency.phone)))
                    || (isOkName && (pasInfo.fieldStatus.contactData.mandatory || useForAll || pasInfo.contactData.emergency.name !== pasInfo.initialData.emergency.name));
                let isNeedUpdate = needsToBeUpdated || isNeedUpdateAll;

                if (isNeedUpdate) {
                    if (isOkPhone && isOkName) {
                        isNeedUpdate = true;
                        returnEmerInfo.emergencyContact.refused = false;
                        returnEmerInfo.emergencyContact.phone = pasInfo.contactData.emergency.phone;
                        returnEmerInfo.emergencyContact.name = pasInfo.contactData.emergency.name;
                    }
                } else if (!isNeedUpdate && (!isOkPhone || !isOkName)) {
                    isNeedUpdate = true;
                    returnEmerInfo.emergencyContact = dataRefused;
                }

                return isNeedUpdate ? returnEmerInfo : null;
            }
        }

        function getNewsLettersInfo(pasInfo) {
            const checkContactData = pasInfo.contactData.email && pasInfo.fieldStatus.contactData.show && !pasInfo.contactData.denyNewsLetter;
            if (!checkContactData) {
                return null;
            }

            return {
                name: pasInfo.name,
                firstSurname: pasInfo.surname,
                email: pasInfo.contactData.email
            };
        }

        function checkAdditionalInfo(passengers = []) {
            return passengers
                .filter(isSelectedPassenger)
                .some(hasAdditionalInfoChanges);
        }

        function isSelectedPassenger(passenger) {
            return passenger?.isSelected;
        }

        function hasAdditionalInfoChanges(passenger) {
            const initialContact = passenger.initialData?.contact;
            const currentContact = passenger.contactData;
            const initialFrequentFlyer = initialContact?.frequentFlyer?.info;
            const currentFrequentFlyer = passenger.frequentFlyer?.info;

            return hasEmailChanged(initialContact, currentContact) ||
                hasPhoneNumberChanged(initialContact, currentContact) ||
                hasFrequentFlyerCompanyChanged(initialFrequentFlyer, currentFrequentFlyer) ||
                hasFrequentFlyerNumberChanged(initialFrequentFlyer, currentFrequentFlyer);
        }

        function hasEmailChanged(initialContact, currentContact) {
            return initialContact?.email !== currentContact?.email;
        }

        function hasPhoneNumberChanged(initialContact, currentContact) {
            return initialContact?.phone?.number !== currentContact?.phone?.number;
        }

        function hasFrequentFlyerCompanyChanged(initialFrequentFlyer, currentFrequentFlyer) {
            return initialFrequentFlyer?.iataCompanyCode !== currentFrequentFlyer?.iataCompanyCode;
        }

        function hasFrequentFlyerNumberChanged(initialFrequentFlyer, currentFrequentFlyer) {
            return initialFrequentFlyer?.number !== currentFrequentFlyer?.number;
        }

        function checkEmergencyInfo(passengers) {
            let isChanged = false;

            for (let i = 0; i < passengers?.length; i++) {
                const passenger = passengers[i];
                if (passenger.isSelected) {
                    const changeName = passenger.initialData.emergency.name !== passenger.contactData.emergency.name;
                    const changePhoneNumber = passenger.initialData.emergency.phone.number !== passenger.contactData.emergency.phone.number;
                    if (changeName || changePhoneNumber) {
                        isChanged = true;
                    }
                }
            }
            return isChanged;
        }

        function getSegmentsUpdateInformation(segmentsInfo, selectedSegment) {
            if (selectedSegment) {
                return buildUpdateInformationFromSingleSegment(selectedSegment);
            }

            return buildUpdateInformationFromSelectedSegments(segmentsInfo);
        }

        function buildUpdateInformationFromSingleSegment(segment) {
            return {
                selectedSegmentsIds: [parseSegmentId(segment.id)],
                summaryTrip: buildSegmentSummary(segment)
            };
        }

        function buildUpdateInformationFromSelectedSegments(segmentsInfo) {
            const selectedSegments = segmentsInfo.filter(isSelectedSegment);

            return {
                selectedSegmentsIds: selectedSegments.map((segment) => {
                    return parseSegmentId(segment.id);
                }),
                summaryTrip: selectedSegments.map(buildSegmentSummary).join('-')
            };
        }

        function isSelectedSegment(segment) {
            return segment.isSelected;
        }

        function parseSegmentId(segmentId) {
            return parseInt(segmentId);
        }

        function buildSegmentSummary(segment) {
            return segment.departure.airportCode + '-' + segment.arrival.airportCode;
        }


        function getBookingInfoSegmentsSelected(bookingInfo, selectedSegmentsId) {
            const idsInObjects = getSelectedSegmentIds();
            const idsNotInObjects = getIdsNotInObjects(selectedSegmentsId, idsInObjects);
            let segmentsSelected = getStoredSegments();

            if (hasSegmentsToSelect(idsNotInObjects, bookingInfo)) {
                segmentsSelected = findSegments(bookingInfo, idsNotInObjects);
            }

            return segmentsSelected;
        }

        function getSelectedSegmentIds() {
            const segmentsSelected = localStorageService.get('segmentsSelected') || [];
            return segmentsSelected.map(obj => obj.id);
        }

        function getIdsNotInObjects(selectedSegmentsId, idsInObjects) {
            return selectedSegmentsId.filter(id => !idsInObjects.includes(id));
        }

        function getStoredSegments() {
            return localStorageService.get('segmentsSelected') || [];
        }

        function hasSegmentsToSelect(idsNotInObjects, bookingInfo) {
            return idsNotInObjects.length > 0 && bookingInfo?.outwardSegments?.length > 0;
        }

        function getMatchingSegments(segments, idsSet) {
            return segments.filter(segment => idsSet.has(segment.id));
        }

        function findSegments(bookingInfo, idsNotInObjects) {
            const idsSet = new Set(idsNotInObjects);

            const flightSegments = [
                ...(bookingInfo?.outwardSegments || []),
                ...(bookingInfo?.returnSegments || [])
            ];

            const selectedFlightSegments = getMatchingSegments(flightSegments, idsSet);
            if (selectedFlightSegments.length) {
                return selectedFlightSegments;
            }

            return getMatchingSegments(bookingInfo?.airShuttleSegments || [], idsSet);
        }

        function getAcceptUpdateInformation(selectedSegmentsId, passengers) {
            const bookingInfo = localStorageService.get('bookingInfo') || {};
            const checkinSegmentsInGroup = bookingInfo.checkinSegmentsInGroup || [];

            if (checkinSegmentsInGroup.length > 0) {
                const hasIntersection = checkinSegmentsInGroup.some((segmentId) => selectedSegmentsId.includes(segmentId));

                if (hasIntersection) {
                    selectedSegmentsId = Array.from(new Set([...selectedSegmentsId, ...checkinSegmentsInGroup]));
                }
            }

            const segments = selectedSegmentsId.map((id) => ({ id, passengers }));
            localStorageService.set('availableSegments', selectedSegmentsId);
            const newSegmentsSelected = getBookingInfoSegmentsSelected(bookingInfo, selectedSegmentsId);
            localStorageService.set('segmentsSelected', newSegmentsSelected);

            return {
                dangerousItemsInfoAccepted: true,
                segments
            };
        }

        function updateSelectedSegments(segments, uncheckAbleSegments) {
            let segmentIndex;
            const acceptedSegments = [];
            for (segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
                if (uncheckAbleSegments.indexOf(segments[segmentIndex]) === -1) {
                    acceptedSegments.push(segments[segmentIndex]);
                }
            }
            return acceptedSegments;
        }

        function updateSelectedPassengers(selectedPassengers, responsePassengers) {
            let passengerIndex;
            const updatedPassengers = [];
            for (passengerIndex = 0; passengerIndex < responsePassengers.length; passengerIndex++) {
                if (selectedPassengers.indexOf(responsePassengers[passengerIndex]) !== -1) {
                    updatedPassengers.push(selectedPassengers[i]);
                }
            }
            return updatedPassengers;
        }

        function initModelApisUsTracing() {
            const ckeckApisUsTracing = {
                show: false,
                CHECK_US_PRIVACY_ACT_STATEMENT: 'CHECK_US_PRIVACY_ACT_STATEMENT',
                checkPrivacyText: ''
            };

            return ckeckApisUsTracing;
        }

        function checkExistAPIsUsTracing(modelApisUsTracing, isRequiredEmergencyData) {
            const tagsInfo = {
                link1: {
                    tag: 'a',
                    title: 'link',
                    class: 'ib-link ib-link--important ib-link--underline',
                    id: 'us_tracing'
                }
            };
            let btn;

            // control apis + mandatory emergency data
            modelApisUsTracing.show = isRequiredEmergencyData;

            if (modelApisUsTracing.show) {
                modelApisUsTracing.checkPrivacyText = $sce.trustAsHtml($filter('literalFormatter')($filter('translate')(modelApisUsTracing.CHECK_US_PRIVACY_ACT_STATEMENT), tagsInfo));
                localStorageService.set('usTracing', true);
                $timeout(() => {
                    btn = angular.element('#us_tracing');
                    btn.on('click', () => {
                        openUsPrivacyActStatementModal();
                    });
                });
            }

            return modelApisUsTracing;
        }

        function openUsPrivacyActStatementModal() {
            const tagsInfo = {
                bold: {
                    tag: 'span',
                    class: 'ib-message-box__text--bold'
                },
                p: {
                    tag: 'p',
                    class: 'ib-text u-mt'
                }
            };
            const modelModal = {
                title: {
                    message: 'MODAL_US_PRIVACY_ACT_STATEMENT_TITLE',
                    needsTranslate: true
                },
                message: '',
                needsTranslate: false
            };

            modelModal.message = $filter('literalFormatter')($filter('translate')('MODAL_US_PRIVACY_ACT_STATEMENT_BODY_P1'), tagsInfo);
            modelModal.message += $filter('literalFormatter')($filter('translate')('MODAL_US_PRIVACY_ACT_STATEMENT_BODY_P2'), tagsInfo);
            modelModal.message += $filter('literalFormatter')($filter('translate')('MODAL_US_PRIVACY_ACT_STATEMENT_BODY_P3'), tagsInfo);
            modelModal.message = $sce.trustAsHtml(angular.copy(modelModal.message));
            ModalService.showGenericModal(modelModal, false, 'ib-info-modal-us-privacy');
        }

        function getReasonNoItemInhibition(reason) {
            let item = null;
            reason = Array.isArray(reason) ? reason : [];
            if (reason.includes(CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.RESI_REASON)) {
                item = CheckinAppConstants.ITEMS_TYPES.RESI;
            } else if (reason.includes(CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.SEE_AGENT_REASON)) {
                item = CheckinAppConstants.ITEMS_TYPES.SEE_AGENT;
            }

            return item;
        }

        function getPassengerStatusReason(passengerStatus) {
            if (!passengerStatus.reason) {
                return '';
            }

            const reasonData = passengerStatus.reason;

            const inhibitItems = {
                RESI: 'EARLY_CKI_INHIBIT_MODAL_MESSAGE_RESI',
                AVIH: 'EARLY_CKI_INHIBIT_MODAL_MESSAGE_AVIH_PETC',
                PETC: 'EARLY_CKI_INHIBIT_MODAL_MESSAGE_AVIH_PETC',
                UMNR: 'EARLY_CKI_INHIBIT_MODAL_MESSAGE_UMNR',
                COUR: 'EARLY_CKI_INHIBIT_MODAL_MESSAGE_COUR'
            };

            const reasonDataItem = reasonData?.code?.includes('ECKI_PASSENGER_ITEM_NOT_ALLOWED') && reasonData.code.split('_').at(-1);

            if (!inhibitItems[reasonDataItem]) {
                return passengerStatus.reason.message ?? '';
            }

            return $filter('translate')(inhibitItems[reasonDataItem]);
        }

        function checkAircheckData(airCheck) {
            const quadrigamMMB = `#!/${CheckinAppConstants.QUADRIGAM.MMB}`;
            const pnr = `pnr=${localStorageService.get('PNR')}`;
            const surname = `surname=${localStorageService.get('checkinSurname')}`;
            const quadrigam = `quadrigam=${CheckinAppConstants.QUADRIGAM.MMB_YOUR_DOCUMENTS}`;
            const _url = `${quadrigamMMB}?${pnr}&${surname}&${quadrigam}`;
            const url = $filter('LinksFilter')('MANAGE_MY_BOOKING_LINK', CheckinAppConstants.lang) + _url;

            return {
                status: airCheck ?? false,
                url: url ?? ''
            };
        }

        function isNotAvailableStatus(flyNow) {
            const STATUS = CheckinAppConstants.FLIGHT_PASSENGERS_STATUS;
            return flyNow ? STATUS.SELECTABLE : STATUS.NOT_AVAILABLE;
        }

        function buildSegmentConditions({ segmentInfo, passengersInfo, checked, availablePassengers, available, auxWhatToDoShuttle, notAvailable, notAllowed }) {
            const STATUS = CheckinAppConstants.FLIGHT_PASSENGERS_STATUS;
            const isOpen = segmentInfo.type === CheckinAppConstants.SHUTTLE_SEGMENTS_TYPES.OPEN;
            const isBlockedGroup = notAvailable > 0 || notAllowed === passengersInfo.length;
            const isFullyChecked = checked === availablePassengers;
            const hasAvailable = available !== 0;

            return [
                { test: isOpen, status: STATUS.AVAILABLE },
                { test: isBlockedGroup, status: isNotAvailableStatus(auxWhatToDoShuttle?.flyNow) },
                { test: isFullyChecked, status: STATUS.CHECKED },
                { test: hasAvailable, status: STATUS.AVAILABLE }
            ];
        }

        function getSegmentStatus(params) {
            const STATUS = CheckinAppConstants.FLIGHT_PASSENGERS_STATUS;
            const conditions = buildSegmentConditions(params);
            return conditions.find(({ test }) => test)?.status ?? STATUS.NOT_AVAILABLE;
        }

        function getSegmentStatusReasonCode(passengersStatus) {
            let reasonCode = '';

            for (const status of passengersStatus) {
                if (status?.reasonCode) {
                    reasonCode = status.reasonCode;
                }
            }

            return reasonCode;
        }

        function buildSegmentDetailedInfo(segmentInfo, segmentStatus) {
            const preferredAirline = getPreferredAirline(segmentInfo);
            const flightInfo = getFlightInfo(segmentInfo);

            return {
                id: segmentInfo.id,
                departure: getInfoAirport(segmentInfo.departure),
                arrival: getInfoAirport(segmentInfo.arrival),
                cabinClass: segmentInfo.cabinClass,
                type: segmentInfo.typeOfTransport,
                detailedType: segmentInfo.type,
                flown: segmentInfo.flown,
                airlineName: preferredAirline.description,
                airlineLogo: getAirlineLogo(preferredAirline.code, segmentStatus),
                flightCode: preferredAirline.code,
                flightNumber: flightInfo.number,
                operatedBy: getOperatedBy(segmentInfo)
            };
        }

        function getPreferredAirline(segmentInfo) {
            const operatingAirline = getAirline(segmentInfo.operatingFlightNumber);

            if (operatingAirline.code) {
                return operatingAirline;
            }

            return getAirline(segmentInfo.marketingFlightNumber);
        }

        function getFlightInfo(segmentInfo) {
            const marketingFlight = segmentInfo.marketingFlightNumber;
            const operatingFlight = segmentInfo.operatingFlightNumber;

            const flight = hasCompleteFlightInfo(marketingFlight)
                ? marketingFlight
                : operatingFlight;

            return buildFlightInfo(flight);
        }

        function buildFlightInfo(flight) {
            const flightData = flight || {};
            const company = flightData.company || {};
            const code = company.code || '';

            return {
                code: code,
                number: code + (flightData.number || '')
            };
        }

        function getAirline(flightNumber) {
            if (!flightNumber || !flightNumber.company) {
                return {
                    code: '',
                    description: ''
                };
            }

            return {
                code: flightNumber.company.code || '',
                description: flightNumber.company.description || ''
            };
        }

        function hasCompleteFlightInfo(flightNumber) {
            return Boolean(
                flightNumber &&
                flightNumber.number &&
                flightNumber.company &&
                flightNumber.company.code
            );
        }

        function getAirlineLogo(airlineCode, segmentStatus) {
            if (!airlineCode) {
                return '';
            }

            const airlineLogos = IbUtilsService.getAirlineLogos(airlineCode);
            const isNotAvailable =
                segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.NOT_AVAILABLE;

            return isNotAvailable
                ? airlineLogos.companyDisabledURL
                : airlineLogos.companyURL;
        }

        function getAirportPartial(airport) {
            const country = airport?.country ?? '';

            return {
                cityDescription: country,
                cityCode: country,
                airportDescription: airport?.description ?? '',
                airportCode: airport?.code ?? ''
            };
        }

        function getInfoAirport(airportInfo) {
            const airport = airportInfo?.airport;
            const terminal = airportInfo?.terminal;
            const date = airportInfo?.date;
            const [formattedDate = '', hour = ''] = date ? date.split(' ') : [];

            return {
                ...getAirportPartial(airport),
                terminal: terminal ?? '',
                originalDate: date,
                date: formattedDate ? $filter('DateFormatFilter')(formattedDate) : '',
                hour
            };
        }


        function getOperatedBy(segmentInfo) {
            const operatingCompany = getCompany(segmentInfo.operatingFlightNumber);
            const marketingCompany = getCompany(segmentInfo.marketingFlightNumber);

            if (!operatingCompany || !operatingCompany.description) {
                return null;
            }

            const hasNoMarketingFlight = segmentInfo.marketingFlightNumber === null;
            const isOperatedByDifferentAirline = marketingCompany &&
                operatingCompany.code !== marketingCompany.code;

            return hasNoMarketingFlight || isOperatedByDifferentAirline
                ? operatingCompany.description
                : null;
        }

        function getCompany(flightNumber) {
            return flightNumber && flightNumber.company
                ? flightNumber.company
                : null;
        }

    }
})();
