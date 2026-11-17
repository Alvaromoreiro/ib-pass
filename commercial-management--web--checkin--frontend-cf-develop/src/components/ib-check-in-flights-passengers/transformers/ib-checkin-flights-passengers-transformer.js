(function () {
    'use strict';

    angular
        .module('ib-checkin-flights-passengers-module')
        .factory('FlightsPassengersTransformer', FlightsPassengersTransformer);

    FlightsPassengersTransformer.$inject = ['FlightsPassengersUtils', 'CheckinAppConstants', 'FlightsPassengersConstants', 'localStorageService', 'ContentPreprocessorService', 'IbSessionConfigService', 'IbUtilsService', 'IbPassengerBookingUtilsService'];
    function FlightsPassengersTransformer (FlightsPassengersUtils, CheckinAppConstants, FlightsPassengersConstants, localStorageService, ContentPreprocessorService, IbSessionConfigService, IbUtilsService, IbPassengerBookingUtilsService) {
        const service = {
            transformSegmentsPassengersInfo: transformSegmentsPassengersInfo,
            generateUpdataContactDetails: generateUpdataContactDetails,
            updateEmergencyAlternativeDetails: updateEmergencyAlternativeDetails,
            updateAdditionalInfo: updateAdditionalInfo,
            TransCalcPointsData: TransCalcPointsData,
            getFlattenObj: getFlattenObj
        };
        return service;

        ////////////////

        function initFlightsPassengersInfo () {
            return {
                activeFields: {
                    additionalInfoUseForAllCheck: { showId: '', status: false, show: false },
                    emergencyDataUseForAllCheck: { showId: '', status: false, show: false }
                },
                selectedShuttleSegmentIndex: null,
                segments: [],
                whatToDo: {
                    active: false,
                    options: []
                },
                checkinSegmentsInGroup: {
                    segments: [],
                    info: ''
                },
                passengers: [],
                emergency: [],
                companies: [],
                prefixes: [],
                requiredFiles: [],
                dataLayer: {
                    datalayerBookingType: ''
                },
                checkinAvailable: true,
                allSegmentChecked: false,
                onlyShuttleSegments: false,
                flightHaul: 'SH'
            };
        }

        function transformSegmentsPassengersInfo (flightsPassengersData, prefixesList, companiesList, additionalInfo, emergencyInfo, gdprData, summaryInfo) {
            const returnedFlightsPassengersInfo = initFlightsPassengersInfo();

            const prefixesInfo = getPrefixes(prefixesList);
            let isSegmentInGroupNotAvailable = false, segmentInGroupNotAvailableReason = '', someSegmentActive = false, allowCheckin = false, j = 0, isAirCheckSegment = false, airCheckURL = '';
            localStorageService.set('isFlowDuplicated', false);

            returnedFlightsPassengersInfo.checkinSegmentsInGroup.segments = flightsPassengersData.checkinSegmentsInGroup;
            returnedFlightsPassengersInfo.companies = getCompanies(companiesList);
            returnedFlightsPassengersInfo.emergency = transformPhoneCountryCode(emergencyInfo);
            returnedFlightsPassengersInfo.prefixes = prefixesInfo.prefixes;
            returnedFlightsPassengersInfo.segments = getSegmentsInfo(flightsPassengersData.outwardSegments, flightsPassengersData.returnSegments, flightsPassengersData.airShuttleSegments, flightsPassengersData.passengers);
            returnedFlightsPassengersInfo.passengers = getPassengersInfo(flightsPassengersData.passengers, returnedFlightsPassengersInfo.allSegmentChecked, additionalInfo, emergencyInfo, prefixesInfo, returnedFlightsPassengersInfo.selectedShuttleOption, returnedFlightsPassengersInfo.segments);
            returnedFlightsPassengersInfo.flightHaul = flightsPassengersData?.flightHaul ?? 'SH';

            // aircheck & inhibit boarding card
            for (let i = 0; i < returnedFlightsPassengersInfo.segments.length; i++) {
                const segment = returnedFlightsPassengersInfo.segments[i];
                isAirCheckSegment = (segment?.airCheck?.status) ? segment.airCheck.status : false;
                for (let j = 0; j < segment.passengersStatus.length; j++) {
                    const passengerStatus = segment.passengersStatus[j];
                    airCheckURL = '';
                    for (let k = 0; k < returnedFlightsPassengersInfo.passengers.length; k++) {
                        const passengerInfo = returnedFlightsPassengersInfo.passengers[k];
                        if (passengerInfo.id === passengerStatus.id) {
                            if (passengerStatus?.airCheckDocumentationRequired && isAirCheckSegment) {
                                airCheckURL = angular.isString(segment.airCheck.url) ? segment.airCheck.url : '';
                                passengerInfo.airCheck = {
                                    documentationRequired: passengerStatus.airCheckDocumentationRequired,
                                    url: airCheckURL
                                };
                            }
                            if (Array.isArray(passengerStatus.inhibitBoardingCard.reason) && passengerStatus.inhibitBoardingCard.reason.some(reason => reason === CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES[reason])) {
                                Object.assign(passengerInfo.inhibitBoardingCard, passengerStatus.inhibitBoardingCard);
                                passengerInfo.inhibitBoardingCard.status = true;
                                passengerInfo.inhibitBoardingCard.url = airCheckURL;
                            }

                            passengerInfo.items = (Array.isArray(passengerStatus.items)) ? passengerStatus.items : [];
                        }
                    }
                }
            }

            angular.extend(returnedFlightsPassengersInfo.dataLayer, {
                quadrigam: '',
                isAirShuttle: flightsPassengersData.airShuttleSegments.length > 0
            });

            while (!someSegmentActive && j < returnedFlightsPassengersInfo.segments.length) {
                if (returnedFlightsPassengersInfo.segments[j].segmentStatus === CheckinAppConstants.GENERAL_STATUS.AVAILABLE) {
                    someSegmentActive = true;
                }
                if (returnedFlightsPassengersInfo.segments[j].segmentStatus === CheckinAppConstants.GENERAL_STATUS.CHECKED) {
                    allowCheckin = true;
                }
                j++;
            }

            const existDeepLinkInformation = flightsPassengersData.deepLinkInformation !== null && !someSegmentActive && !allowCheckin;
            updateCheckinDeepLinkInformation(existDeepLinkInformation, returnedFlightsPassengersInfo, flightsPassengersData.deepLinkInformation);

            if (gdprData) {
                returnedFlightsPassengersInfo.gdprInfo = angular.copy(gdprData);
                returnedFlightsPassengersInfo.gdprInfo.text = ContentPreprocessorService.processContent(returnedFlightsPassengersInfo.gdprInfo.text, 'gdprInfo');
            }

            return { flightsPassengersInfo: returnedFlightsPassengersInfo, summaryInfo: summaryInfo ? summaryInfo : null };

            function getSegmentsInfo (outwardSegments, returnSegments, airShuttleSegments, generalPassengersInfo) {
                let i, returnedSegments, hasRegularSegments = false, hasAirShuttleSegments = false, index, isSegmentAvailable = false;
                const availableSegments = [], notAvailableSegments = [], regularSegments = outwardSegments.concat(returnSegments);

                if (regularSegments.length > 0) {
                    hasRegularSegments = true;
                    getInfo(regularSegments, CheckinAppConstants.FLIGHT_TYPES.REGULAR, generalPassengersInfo);
                }
                if (airShuttleSegments.length > 0) {
                    hasAirShuttleSegments = true;
                    getInfo(airShuttleSegments, CheckinAppConstants.FLIGHT_TYPES.SHUTTLE, generalPassengersInfo);
                    for (index = 0; index < generalPassengersInfo.length; index++) {
                        if (generalPassengersInfo[index].status.code !== CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.NOT_ALLOWED) {
                            isSegmentAvailable = true;
                        }
                    }
                    for (index = 0; index < airShuttleSegments.length; index++) {
                        for (i = 0; i < airShuttleSegments[index].passengers.length; i++) {
                            if (airShuttleSegments[index].passengers[i].flyNow) {
                                airShuttleSegments[index].passengers[i].available = true;
                                isSegmentAvailable = true;
                            }
                        }
                    }
                    if (!isSegmentAvailable) {
                        returnedFlightsPassengersInfo.checkinAvailable = false;
                    }
                }
                if (isSegmentInGroupNotAvailable) {
                    updateSegmentInGroupNotAvailable();
                }
                if (availableSegments.length === 0) {
                    returnedFlightsPassengersInfo.allSegmentChecked = false;
                    returnedFlightsPassengersInfo.checkinAvailable = false;
                }
                localStorageService.remove('flightConfirmationNeedsCheckin');
                returnedSegments = availableSegments.concat(notAvailableSegments);
                returnedSegments = returnedSegments.sort((a, b) => {
                    return a.id - b.id;
                });
                if (!hasRegularSegments && hasAirShuttleSegments) {
                    returnedFlightsPassengersInfo.onlyShuttleSegments = true;
                }
                return returnedSegments;


                function updateSegmentInGroupNotAvailable () {
                    for (let i = availableSegments.length - 1; i >= 0; i--) {
                        const availableSegment = availableSegments[i];
                        if (returnedFlightsPassengersInfo.checkinSegmentsInGroup.segments.indexOf(availableSegment.id) !== -1) {
                            availableSegment.segmentStatus = CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.NOT_AVAILABLE;
                            availableSegment.segmentStatusReason = segmentInGroupNotAvailableReason;
                            availableSegment.airlineLogo = IbUtilsService.getAirlineLogos(availableSegment.flightCode).companyDisabledURL;
                            notAvailableSegments.unshift(availableSegment);
                            availableSegments.splice(i, 1);
                        }
                    }
                }

                function getInfo (segments, type, passengersInfo) {
                    let segmentIndex, auxSegment, checked = 0, selectedShuttleSegments = 0, generalSegmentInfo, detailedSegmentInfo, departureCity, destinationCity, actualSegmentBookingType, firstAvailableShuttleSegment;
                    const dataLayerBookingPriorities = { F: 1, B: 2, E: 3, R: 4 };//more priority less number
                    for (segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
                        auxSegment = { generalType: type, isSelected: false };
                        generalSegmentInfo = FlightsPassengersUtils.getGeneralSegmentInfo(passengersInfo, segments[segmentIndex], type);
                        detailedSegmentInfo = FlightsPassengersUtils.getDetailedSegmentInfo(segments[segmentIndex], generalSegmentInfo.segmentStatus);
                        angular.extend(auxSegment, generalSegmentInfo, detailedSegmentInfo);
                        if (segmentIndex === 0) {
                            departureCity = detailedSegmentInfo.departure.airportCode;
                        }
                        if (segmentIndex === segments.length - 1 && (returnSegments.length === 0 || airShuttleSegments > 0)) {
                            destinationCity = detailedSegmentInfo.arrival.airportCode;
                        } else if (outwardSegments.length > 0 && returnSegments.length > 0) {
                            destinationCity = outwardSegments[outwardSegments.length - 1].arrival && outwardSegments[outwardSegments.length - 1].arrival.airport ? outwardSegments[outwardSegments.length - 1].arrival.airport.code : '';
                        }
                        if (detailedSegmentInfo.cabinClass && detailedSegmentInfo.cabinClass.type !== null) {
                            actualSegmentBookingType = detailedSegmentInfo.cabinClass.type.charAt(0);
                            returnedFlightsPassengersInfo.dataLayer.datalayerBookingType = returnedFlightsPassengersInfo.dataLayer.datalayerBookingType === '' || dataLayerBookingPriorities[returnedFlightsPassengersInfo.dataLayer.datalayerBookingType] > dataLayerBookingPriorities[actualSegmentBookingType]
                                ? actualSegmentBookingType : returnedFlightsPassengersInfo.dataLayer.datalayerBookingType;
                        }
                        if (generalSegmentInfo.segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.CHECKED || generalSegmentInfo.segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.AVAILABLE) {
                            if (CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.SHUTTLE.indexOf(detailedSegmentInfo.detailedType) !== -1) {
                                if (selectedShuttleSegments < 1) {
                                    auxSegment.isSelected = true;
                                    returnedFlightsPassengersInfo.selectedShuttleSegmentIndex = segmentIndex;
                                    firstAvailableShuttleSegment = angular.copy(generalSegmentInfo);
                                }
                                selectedShuttleSegments++;
                            } else {
                                auxSegment.isSelected = true;
                            }
                            if (returnedFlightsPassengersInfo.checkinSegmentsInGroup.segments.indexOf(auxSegment.id) !== -1) {
                                returnedFlightsPassengersInfo.checkinSegmentsInGroup.info = returnedFlightsPassengersInfo.checkinSegmentsInGroup.info + (auxSegment.departure.airportCode + '-' + auxSegment.arrival.airportCode) + (returnedFlightsPassengersInfo.checkinSegmentsInGroup.segments.indexOf(auxSegment.id) < returnedFlightsPassengersInfo.checkinSegmentsInGroup.segments.length - 1 ? ',' : '');
                            }
                            if (generalSegmentInfo.segmentStatus === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.CHECKED) {
                                checked++;
                            }
                            availableSegments.push(auxSegment);
                        } else {
                            if (returnedFlightsPassengersInfo.checkinSegmentsInGroup.segments.indexOf(auxSegment.id) !== -1) {
                                isSegmentInGroupNotAvailable = true;
                                segmentInGroupNotAvailableReason = auxSegment.segmentStatusReason;
                            }
                            notAvailableSegments.push(auxSegment);
                        }
                    }
                    if (checked > 0 && checked === availableSegments.length && type === CheckinAppConstants.FLIGHT_TYPES.REGULAR) {
                        returnedFlightsPassengersInfo.allSegmentChecked = true;
                        returnedFlightsPassengersInfo.whatToDo.active = true;
                        returnedFlightsPassengersInfo.whatToDo.options = getOptions();
                        localStorageService.set('isFlowDuplicated', true);
                    }
                }
            }

            function getPassengersInfo (passengers, areAllSegmentsChecked, additionalInfo, emergencyInfo, prefixes, isPa, segmentsInfo) {
                let isFlowApis = false, passengersIndex, auxPas, returnedPassengers = [], selectedPassengers = 0, availableContactDataPassengers = 0, availableEmergencyDataPassengers = 0;
                const customerData = localStorageService.get('customerData'), availableAdt = [], availableChd = [], notAvailableAdt = [], notAvailableChd = [];
                const hasCustomerData = !!((customerData && customerData !== null && customerData.personalInfo && customerData.personalInfo !== null));
                const { ADULT, CHILD } = CheckinAppConstants.PASSENGERS_TYPES;

                const passengersWithSBY = getPassengersWithSBY(segmentsInfo);

                for (passengersIndex = 0; passengersIndex < passengers.length; passengersIndex++) {
                    auxPas = FlightsPassengersUtils.getPassengerInfo(passengers[passengersIndex], areAllSegmentsChecked, additionalInfo, emergencyInfo, prefixes.defaultPrefix, isPa);
                    if(!isFlowApis) isFlowApis = auxPas.requiresApis;

                    const isAvailable = auxPas.pasStatus.available;
                    const targetArray = {
                        [ADULT]: isAvailable ? availableAdt : notAvailableAdt,
                        [CHILD]: isAvailable ? availableChd : notAvailableChd
                    };

                    if (isAvailable) {
                        updateActiveFields();
                    }

                    targetArray[auxPas.type].push(auxPas);

                    if (passengersWithSBY?.includes(auxPas.id)) auxPas.pasStatus.hasSBY = true;
                }

                const checkAvailable = isSegmentInGroupNotAvailable && !returnedFlightsPassengersInfo.checkinAvailable && (availableAdt.length > 0 || availableChd.length > 0);
                if (checkAvailable) {
                    updatePassengersSegmentInGroupNotAvailable();
                }

                const showContactData = isFlowApis ? false : (availableContactDataPassengers !== 0 || availableEmergencyDataPassengers !== 0);
                returnedFlightsPassengersInfo.activeFields.showContactData = showContactData;

                //Recorrer y ordenar por ID de este array mi model de información guardado
                //agregar el nombre del pasajero
                returnedPassengers = availableAdt.concat(availableChd, notAvailableAdt, notAvailableChd);

                if (selectedPassengers > 1) {
                    returnedFlightsPassengersInfo.activeFields.additionalInfoUseForAllCheck.showId = returnedPassengers[0].id;
                    returnedFlightsPassengersInfo.activeFields.additionalInfoUseForAllCheck.show = availableContactDataPassengers > 1;
                    returnedFlightsPassengersInfo.activeFields.emergencyDataUseForAllCheck.showId = returnedPassengers[0].id;
                    returnedFlightsPassengersInfo.activeFields.emergencyDataUseForAllCheck.show = availableEmergencyDataPassengers > 1;
                }

                return prefillDataPassengersLoggedUser(returnedPassengers, prefixes);


                function prefillDataPassengersLoggedUser (listPassengers, prefixes) {
                    const originListPassengers = angular.copy(listPassengers), passengersIdEdit = [];
                    const updateData = IbSessionConfigService.isUserLogged() && hasCustomerData && listPassengers?.length > 0;
                    let countEditData = 0, listResult = [], auxListPassenger = [];

                    if (updateData) {
                        listPassengers.forEach((passenger) => {
                            const hasEmail = !!((passenger.contactData.email && passenger.contactData.email !== null && passenger.contactData.email.length > 0));
                            const hasPhone = !!((passenger.contactData.phone && passenger.contactData.phone !== null
                                && passenger.contactData.phone.countryCode && passenger.contactData.phone.countryCode !== null && passenger.contactData.phone.countryCode.length > 0
                                && passenger.contactData.phone.number && passenger.contactData.phone.number !== null && passenger.contactData.phone.number.length > 0));

                            if (!hasEmail && !hasPhone) {
                                passengersIdEdit.push({
                                    id: passenger.id,
                                    contactData: true
                                });
                                countEditData++;
                            } else {
                                passengersIdEdit.push({
                                    id: passenger.id,
                                    contactData: !((hasEmail || hasPhone))
                                });
                            }
                        });

                        if (originListPassengers.length > 0 && originListPassengers.length === countEditData) {
                            auxListPassenger = prefillContacData(listPassengers, true, passengersIdEdit, prefixes);
                        } else if (originListPassengers.length > 0 && originListPassengers.length > countEditData) {
                            auxListPassenger = originListPassengers;
                        } else {
                            auxListPassenger = prefillContacData(listPassengers, false, passengersIdEdit, prefixes);
                        }

                        listResult = auxListPassenger;
                    } else {
                        listResult = originListPassengers;
                    }

                    return listResult;
                }

                function prefillContacData (listPassengers, editAll, passengersIdEdit, prefixesInfo) {
                    for (let i = 0; i < listPassengers.length; i++) {
                        const passenger = listPassengers[i], phoneData = validatePhoneNumber(customerData, prefixesInfo);
                        if (editAll) {
                            if (i === 0) {
                                passenger.contactData.phone = !phoneData.number && customerData.personalInfo.telecomAddresses?.number ? {...phoneData, number: IbSessionConfigService.cleanDataSoftUser(customerData.personalInfo.telecomAddresses?.number)} : phoneData;
                                passenger.contactData.email = IbSessionConfigService.cleanDataSoftUser(customerData?.personalInfo?.contactEmail);

                                if (passenger.fieldStatus && passenger.fieldStatus.contactData && passenger.fieldStatus.contactData.show !== null) {
                                    passenger.fieldStatus.contactData.show = true;
                                }
                            } else {
                                if (passenger.fieldStatus && passenger.fieldStatus.contactData && passenger.fieldStatus.contactData.show !== null) {
                                    passenger.fieldStatus.contactData.show = false;
                                }
                            }

                            localStorageService.set('prefillContacData', true);
                        } else {
                            for (let j = 0; j < passengersIdEdit.length; j++) {
                                const edit = passengersIdEdit[j];
                                if (passenger.id === edit.id) {
                                    if (edit.contactData) {
                                        passenger.contactData.phone = phoneData;
                                        passenger.contactData.email = IbSessionConfigService.cleanDataSoftUser(customerData?.personalInfo?.contactEmail);
                                    }
                                }
                            }
                        }
                    }
                    return listPassengers;
                }

                function updatePassengersSegmentInGroupNotAvailable () {
                    let availableIndex;
                    for (availableIndex = availableAdt.length - 1; availableIndex >= 0; availableIndex--) {
                        availableAdt[availableIndex].pasStatus.available = false;
                        availableAdt[availableIndex].pasStatus.reason = segmentInGroupNotAvailableReason;
                        notAvailableAdt.unshift(availableAdt[availableIndex]);
                        availableAdt.splice(availableIndex, 1);
                    }
                    for (availableIndex = availableChd.length - 1; availableIndex >= 0; availableIndex--) {
                        availableChd[availableIndex].pasStatus.available = false;
                        availableChd[availableIndex].pasStatus.reason = segmentInGroupNotAvailableReason;
                        notAvailableChd.unshift(availableChd[availableIndex]);
                        availableChd.splice(availableIndex, 1);
                    }
                    selectedPassengers = 0;
                    availableContactDataPassengers = 0;
                    availableEmergencyDataPassengers = 0;
                }

                function updateActiveFields () {
                    auxPas.isSelected = selectedPassengers < 9;
                    selectedPassengers++;
                    if (auxPas.fieldStatus.contactData.show) {
                        availableContactDataPassengers++;
                    }

                    if (auxPas.fieldStatus.emergencyData.show) {
                        availableEmergencyDataPassengers++;
                    }
                }
            }
        }

        function validatePhoneNumber (customerData, prefixesInfo) {
            const result = {
                countryCode: (customerData.personalInfo.countryCode && customerData.personalInfo.countryCode !== null && customerData.personalInfo.countryCode.length > 0) ? customerData.personalInfo.countryCode : prefixesInfo.defaultPrefix,
                number: IbSessionConfigService.cleanDataSoftUser(customerData?.personalInfo?.contactPhone),
                description: ''
            };

            return result;
        }

        function updateEmergencyAlternativeDetails (formvalue) {
            const contact = {
                email: formvalue.email,
                phone: {
                    number: formvalue.phone.number,
                    prefix: formvalue.phone.prefix
                }
            };
            return contact;
        }

        function generateUpdataContactDetails (formvalue, userData) {
            const contact = {
                email: formvalue.email,
                phone: {
                    prefix: formvalue.phone.prefix,
                    number: formvalue.phone.number
                },
                countryCode: userData.countryCode,
                address: {
                    street: userData.address.street,
                    streetNumber: userData.address.number,
                    apartment: userData.address.apartment
                },
                city: userData.city,
                postalCode: userData.postalCode,
                province: userData.province,
                additionalInfo: ''
            };
            delete contact.address;

            return contact;
        }

        function updateAdditionalInfo (additionalInfo, isFreeType, isFlowApis) {
            IbPassengerBookingUtilsService.updateLanguageAdditionalInfo(additionalInfo);

            return additionalInfo.reduce((acc, elem) => {
                if (isFreeType && elem.frequentFlyer) {
                    delete elem.frequentFlyer;
                }

                if (isFlowApis) {
                    elem.disruptionContact = null;
                }

                if (!(elem.frequentFlyer == null && elem.disruptionContact == null)) {
                    acc.push(elem);
                }

                return acc;
            }, []);
        }

        function transformPhoneCountryCode (emergencyInfo) {
            const phoneCodeList = localStorageService.get('phoneCodeList');
            const countryCodeMarket = IbUtilsService.getAppMarket();
            let countryCodeInNumber = null;
            if(Array.isArray(emergencyInfo)) {
                emergencyInfo.forEach(element => {
                    if(element?.emergencyContact?.phone?.number) {
                        element.emergencyContact.phone.number = searchCountryCodeFromNumber(element.emergencyContact.phone.number.replace(' ',''));
                    }

                    if(element?.emergencyContact?.phone?.countryCode === null) {
                        countryCodeInNumber = countryCodeInNumber ? countryCodeInNumber : countryCodeMarket;
                        element.emergencyContact.phone.countryCode = getCountryCode(countryCodeInNumber);
                    }
                });
            }

            return emergencyInfo;

            function searchCountryCodeFromNumber (number) {
                if(Array.isArray(phoneCodeList)) {
                    phoneCodeList.forEach(prefix => {
                        const searchAll = `${prefix.countryCode}${prefix.code.replace(' ','')}`;
                        const searchText = `${prefix.countryCode}`;
                        let splitNumber = null;
                        if(number.includes(searchAll)) {
                            splitNumber = number.split(searchAll);
                        } else if(number.includes(searchText)) {
                            splitNumber = number.split(searchText);
                        }

                        if(Array.isArray(splitNumber) && splitNumber.length > 1 && splitNumber[0] === '' && Number(splitNumber[1])) {
                            number = splitNumber[1];
                            countryCodeInNumber = prefix.countryCode;
                        }
                    });
                }
                return number;
            }

            function getCountryCode (countryCode) {
                const prefixData = {market: null, search: null};
                let searchMarket = false, search = false;
                let result = {};
                if(Array.isArray(phoneCodeList)) {
                    result = phoneCodeList[0];
                    phoneCodeList.forEach(prefix => {
                        if(!search && prefix.countryCode === countryCode) {
                            prefixData.search = prefix;
                            search = true;
                        }
                        if(!searchMarket && prefix.countryCode === countryCodeMarket) {
                            prefixData.market = prefix;
                            searchMarket = true;
                        }
                    });

                    if(search && prefixData.search) {
                        result = prefixData.search;
                    } else if(searchMarket && prefixData.market) {
                        result = prefixData.market;
                    }
                }

                return result;
            }
        }

        function updateCheckinDeepLinkInformation (existDeepLinkInformation, returnedFlightsPassengersInfo, deepLinkInformation) {
            if (existDeepLinkInformation) {
                returnedFlightsPassengersInfo.checkinAvailable = false;
                returnedFlightsPassengersInfo.segments.forEach((segment) => {
                    if (segment.flightCode === deepLinkInformation?.externalCompany?.code) {
                        const airlineLogo = IbUtilsService.getAirlineLogos(segment.flightCode);
                        segment.airlineLogo = airlineLogo.companyURL;
                        segment.deepLinkInformation = deepLinkInformation;

                    }
                });
            }
        }

        function getOptions () {
            const options = [];
            options.push(FlightsPassengersConstants.WHAT_TO_DO_OPTIONS.PRINT);
            if(!localStorageService.get('bookingInfo')?.ancillariesDisabled) options.push(FlightsPassengersConstants.WHAT_TO_DO_OPTIONS.MANAGE_CKI);
            return options;
        }

        function getPassengersWithSBY (segmentsInfo) {
            return segmentsInfo?.flatMap((segment) =>
                segment.passengersStatus
                    .filter(
                        (pass) =>
                            pass.status === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.STANDBY
                    )
                    .map((pass) => pass.id)
            );
        }

        function getCompanies (companies) {
            const returnedCompanies = angular.copy(companies);
            returnedCompanies.unshift({ airlineName: { needsTranslate: true, description: FlightsPassengersConstants.DEFAULT_COMPANY_CODE }, iataCompanyCode: FlightsPassengersConstants.DEFAULT_COMPANY_CODE });
            return returnedCompanies;
        }

        function getPrefixes (prefixes) {
            const defaultPrefix = IbUtilsService.getPrefixFromMarket();
            return { prefixes: prefixes, defaultPrefix: defaultPrefix.code };
        }

        function getFlattenObj (order) {
            const newArray = [];
            Object.keys(order).forEach(key => {
                order[key].forEach(index => {
                    newArray.push(index);
                });
            });
            return newArray;
        }


        function TransCalcPointsData (data) {
            const trans_points = { Avios: 0, Elite: 0 };
            angular.forEach(data.totalMonetaryAmount, (item) => {
                if (item.currency.currencyCode === 'AVIOS') {
                    trans_points.Avios = item.amount;
                }
                if (item.currency.currencyCode === 'TIER_POINTS') {
                    trans_points.Elite = item.amount;
                }
            });
            return trans_points;
        }
    }
}
)();
