import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
(function () {


    angular
        .module('ib-booking-passenger-info-module')
        .factory('BookingPassengerInfoTransformer', BookingPassengerInfoTransformer);

    BookingPassengerInfoTransformer.$inject = ['$rootScope', '$filter', 'BookingAppConstants', 'BookingPassengerInfoConstants', 'localStorageService', 'CurrencyService', '$sce', 'BookingUtilService', 'DatalayerUtilsService', 'ContentPreprocessorService', '$window', 'CommonsUtilService', 'CommonsUserUtilsService', 'DatalayerBKIService','IbCTokenUtilsService','CommonsSessionStorageService', 'IbBookingPassengerInfoUtilsService'];
    function BookingPassengerInfoTransformer ($rootScope, $filter, BookingAppConstants, BookingPassengerInfoConstants, localStorageService, CurrencyService, $sce, BookingUtilService, DatalayerUtilsService, ContentPreprocessorService, $window, CommonsUtilService, CommonsUserUtilsService, DatalayerBKIService, IbCTokenUtilsService, CommonsSessionStorageService, IbBookingPassengerInfoUtilsService) {
        return {
            transformSecurityInfoPassengerData: transformSecurityInfoPassengerData,
            transformUpdatePassengerInfoData: transformUpdatePassengerInfoData,
            arePassengersBirthDatesValid: arePassengersBirthDatesValid,
            cleanErrorResidents: cleanErrorResidents,
            createFlightReviewMonetate: createFlightReviewMonetate,
            generateBookingInfoModel: generateBookingInfoModel,
            getAssociatesTransformed: getAssociatesTransformed,
            genCalcAviosFlightReq: genCalcAviosFlightReq,
            TransCalcPointsData: TransCalcPointsData,
            transformProfileRemindError: transformProfileRemindError,
            transformPassengerInfoToSaveInLocalStorage: transformPassengerInfoToSaveInLocalStorage,
            generateMetaUrl: generateMetaUrl,
            transformContactData: transformContactData,
            generateTravPrefReq: generateTravPrefReq,
            getOnHoldOptionsInfo: getOnHoldOptionsInfo,
            generatePersonalDataReq: generatePersonalDataReq,
            generateOfferItemsRequest: generateOfferItemsRequest,
            getOfferItemsServices: getOfferItemsServices,
            generateContactInfoRequest: generateContactInfoRequest,
            generateDiscountsRequest: generateDiscountsRequest,
            generateFrequentFlyerRequest: generateFrequentFlyerRequest,
            generateBirthDateRequest: generateBirthDateRequest,
            generateGenderRequest: generateGenderRequest,
            generateOBAndRelatedPassRequest: generateOBAndRelatedPassRequest,
            shouldSetTitle: shouldSetTitle,
            shouldSetGender: shouldSetGender,
            setSpecialNeedsRequest: setSpecialNeedsRequest
        };

        ////////////////
        /**
         * Transforms the security info passenger data to show fpassengerInfoields in the view.
         * @param {Object} securityInfoData -The security info passenger data received from the service.
         * @returns {Object} - returns the fields to show in the view.
         */
        function transformSecurityInfoPassengerData (securityInfoData, prefixes, gdprInfo, fareData, travelPreferences, contactData, discountsInfo, travelDocuments) {
            const currencies = CurrencyService.getCurrencyObject(fareData.contextMetadata.currencies[0]);
            const sessionPassengerData  = localStorageService.get('passengersFormData');

            const sessionItravel = sessionPassengerData?.iTravel;
            const flowApp = localStorageService.get('flowApp');
            const transformedSecurityInfoPassengerData = {
                passengerInfo: [],
                isLogged: false,
                isResident: BookingUtilService.getStatusResident(),
                iTravel: false,
                passengerInfoLogged: {},
                contactData: {
                    isValidForm: false,
                    contactPhone: contactData ? contactData.contactPhone : '',
                    contactEmail: contactData ? contactData.contactEmail : '',
                    contactPrefix: contactData ? prefixes.find(el => el.code === contactData.contactPrefix) || '' : '',
                    isNewsLetters: false
                },
                frequentlyPassengers: {},
                largeFamilyDiscountInfo: {
                    largeFamilyCertificateNumber: '',
                    communityCode: ''
                },
                totalPrice: 0,
                totalPriceWithOutDiscount: 0,
                totalPriceWithDiscount: 0,
                aviosInfo: $rootScope.isRedemptionFlow ? null : getAviosInfo(fareData, currencies),
                onHold: false,
                onHoldIfIsLogged: null,
                discounts: [],
                summaryInfo: {
                    trips: [],
                    passengers: {},
                    otherFees: []
                },
                relatedContent: {}
            };
            let transformedPrefixes = [];
            let i, j, k, l, m, n;
            let numPassengers = 1;
            let pasData;
            const adultPas = [];
            const childPas = [];
            const infantPas = [];
            let frequentlyPassengers, largeFamilyDiscountInfo, residentDiscountInfo, availableMunicipalitiesForDiscount;
            fareData = localStorageService.get('fareData');
            const dataUserLogged = localStorageService.get('memeberDetails')?.[0]?.data ?? null;
            localStorageService.set('specialNeedsInfo', fareData.services);

            transformedSecurityInfoPassengerData.isLogged = localStorageService.get('userLogged');
            transformedPrefixes = prefixes.slice();
            // transformedSecurityInfoPassengerData.legalDocumentsRequired = securityInfoData.legalDocumentsRequired || [];
            //Initialize first element and remove it from countries array
            const shouldInitContactPrefix =
            Array.isArray(transformedPrefixes) &&
            transformedPrefixes.length > 0 &&
            transformedSecurityInfoPassengerData.contactData.contactPrefix === '';

            if (shouldInitContactPrefix) {
                transformedSecurityInfoPassengerData.contactData.contactPrefix = transformedPrefixes.shift();
            }



            const isLoggedAndNotSoft =
            !!transformedSecurityInfoPassengerData.isLogged && !CommonsUserUtilsService.isSoftUser();

            if (isLoggedAndNotSoft) {
                transformedSecurityInfoPassengerData.iTravel = sessionItravel ?? true;
                transformedSecurityInfoPassengerData.passengerInfoLogged = localStorageService.get('userLogged') === BookingAppConstants.LOGIN_ONB ? localStorageService.get('membershipData') || {} : localStorageService.get('customerData').personalInfo || {};
                if (localStorageService.get('userLogged') === BookingAppConstants.LOGIN_ONB) {
                    frequentlyPassengers = localStorageService.get('membershipData').employees || [];
                    frequentlyPassengers.unshift({ firstName: 'IBAIRP_PASSENGER_FORM_ON_BUSINESS_EMPLOYESS_BLANK' });
                    for (i = 0; i < frequentlyPassengers.length; i++) {
                        frequentlyPassengers[i].isSelected = false;
                        frequentlyPassengers[i].index = i;
                        frequentlyPassengers[i].type = BookingAppConstants.passengerTypes.adult;
                        frequentlyPassengers[i].needsTranslate = false;
                        frequentlyPassengers[i].userInfo = {
                            firstName: frequentlyPassengers[i].firstName,
                            lastName: frequentlyPassengers[i].lastName,
                            secondLastName: frequentlyPassengers[i].secondLastName,
                            email: frequentlyPassengers[i].email
                        };
                        if (frequentlyPassengers[i].firstName === 'IBAIRP_PASSENGER_FORM_ON_BUSINESS_EMPLOYESS_BLANK') {
                            frequentlyPassengers[i].type = BookingAppConstants.passengerTypes.Default;
                            frequentlyPassengers[i].needsTranslate = true;
                        }
                    }
                    transformedSecurityInfoPassengerData.frequentlyPassengers = frequentlyPassengers;
                }
                if (transformedSecurityInfoPassengerData.isLogged === true && (travelPreferences?.deaf || travelPreferences?.blind || travelPreferences?.Svan || (travelPreferences?.wheelChair && travelPreferences?.wheelChair !== '00'))) {
                    transformedSecurityInfoPassengerData.passengerInfoLogged.specialNeeds = true;
                } else {
                    transformedSecurityInfoPassengerData.passengerInfoLogged.specialNeeds = false;
                }
            }

            if (gdprInfo) {
                transformedSecurityInfoPassengerData.gdprInfo = gdprInfo;
                localStorageService.set('gdprInfo', transformedSecurityInfoPassengerData.gdprInfo);
                transformedSecurityInfoPassengerData.gdprInfo.text = ContentPreprocessorService.parseTextWithLinks(transformedSecurityInfoPassengerData.gdprInfo.text);
            }

            for (i = 0; i < securityInfoData.passengersSecurityInformation.length; i++) {
                const availableSpecialNeedsCodes = fareData?.services?.reduce((acc, current) => { (current.type === 'specialNeed') && acc.push(current.code); return acc; }, []) ?? [];
                pasData = {};
                pasData.options = { haveBirthdate: false, haveName: false, haveSurname: false, haveLastName: false, haveIbPlus: false, haveGender: false, resident: { haveError: false, errorMessage: '' } };
                pasData.isValidForm = false;
                pasData.id = securityInfoData.passengersSecurityInformation[i].id;
                pasData.type = securityInfoData.passengersSecurityInformation[i].id.substring(0, securityInfoData.passengersSecurityInformation[i].id.lastIndexOf('_'));
                pasData.name = { name: BookingPassengerInfoConstants.PASSENGER_LABEL, pasNumber: numPassengers, needsTranslate: true };
                pasData.requiredFields = {};
                pasData.serviceErrors = [];
                pasData.optionalDocs = {};
                pasData.specialNeeds = {
                    availableTypes: availableSpecialNeedsCodes,
                    specialVision: (i === 0 && travelPreferences && availableSpecialNeedsCodes.length > 0) ? travelPreferences.blind : false,
                    specialHearing: (i === 0 && travelPreferences && availableSpecialNeedsCodes.length > 0) ? travelPreferences.deaf : false,
                    specialGuideDog: (i === 0 && travelPreferences && availableSpecialNeedsCodes.length > 0) ? travelPreferences.svan : false,
                    specialIntellDisability: (i === 0 && travelPreferences && availableSpecialNeedsCodes.length > 0) ? travelPreferences.dpna : false,
                    specialWheelchair: !!((i === 0 && travelPreferences && availableSpecialNeedsCodes.length > 0) && travelPreferences.wheelChair && (travelPreferences.wheelChair !== '00')),
                    specialWheelchairValue: (i === 0 && travelPreferences && availableSpecialNeedsCodes.length > 0) && travelPreferences.wheelChair && (travelPreferences.wheelChair !== '00') ? BookingPassengerInfoConstants.WHEEL_CHAIR_CODES[travelPreferences.wheelChair] : '',
                    specialWheelchairInfo: getWheelchairServiceInfo(fareData)
                };
                if (i === 0) {
                    localStorageService.set('specialNeeds', pasData.specialNeeds);
                }
                pasData.isSelected = false;
                pasData.canBeInCharge = !!(pasData.type === 'ADULT' || pasData.type === 'YOUTH' || pasData.type === 'SENIOR');
                pasData.mandatoryDocs = [];
                pasData.data = {};
                for (j = 0; j < securityInfoData.passengersSecurityInformation[i].requiredFields.length; j++) {
                    pasData.requiredFields[securityInfoData.passengersSecurityInformation[i].requiredFields[j]] = getRequiredFieldsOptions(securityInfoData.passengersSecurityInformation[i].requiredFields[j], securityInfoData.requiredFieldsOptions);
                }
                if (pasData.requiredFields.TITLE || pasData.requiredFields.GENDER) {
                    pasData.data.gender = 'MALE';
                }
                const birthDateString = dataUserLogged?.birthdate ?? dataUserLogged?.memberPersonalDetails?.person?.dateOfBirth ?? '';
                const birthDateRequired = securityInfoData?.passengersSecurityInformation?.[0]?.requiredFields?.indexOf('BIRTH_DATE') >= 0;
                const addBirthDateCondition = (i === 0 && birthDateRequired && birthDateString.length > 0);
                if (addBirthDateCondition) {
                    const birthDate = birthDateString.split('-');
                    if (birthDateRequired) {
                        pasData.data.birthDate = [
                            birthDate[2], birthDate[1], birthDate[0]
                        ];
                    }
                }
                if (i === 0 && (CommonsSessionStorageService.get('bookingUrlParams')?.largeFamilyType !== null || CommonsSessionStorageService.get('bookingUrlParams')?.resident)) {
                    const largeFamilySearch = localStorageService.get('bookingUrlParams').largeFamilyType ?? null;
                    const requiredMunicipality = securityInfoData?.requiredFieldsOptions?.find((option) => option.field === 'MUNICIPALITY_CODE');
                    const requiredCommunity = securityInfoData?.requiredFieldsOptions?.find((option) => option.field === 'COMMUNITY_CODE');
                    if (largeFamilySearch && largeFamilySearch !== '') {
                        pasData.data.largeFamilyType = largeFamilySearch === 'F2' ? 'LARGE_FAMILY_SPECIAL_TYPE' : 'LARGE_FAMILY_GENERAL_TYPE';
                    }
                    if( discountsInfo?.familyDiscount?.familyType !== null && (discountsInfo?.familyDiscount?.familyType === largeFamilySearch ) && transformedSecurityInfoPassengerData.isLogged ) {
                        if ( requiredCommunity?.values?.find(value => value.code === discountsInfo?.familyDiscount?.communityCode?.value)) {
                            pasData.largeFamilyDiscountInfo = {};
                            pasData.largeFamilyDiscountInfo.largeFamilyCertificateNumber = discountsInfo?.familyDiscount?.documentNumber;
                            pasData.largeFamilyDiscountInfo.communityCode = discountsInfo?.familyDiscount?.communityCode?.value;
                            pasData.largeFamilyDiscountInfo.communityCodePattern = setCommunityCodePattern(pasData.largeFamilyDiscountInfo.communityCode);
                        }
                    }
                    if( discountsInfo?.residentDiscount?.communityCode !== null && transformedSecurityInfoPassengerData.isLogged ) {
                        if (requiredMunicipality?.values?.find(value => value.code === discountsInfo?.residentDiscount?.municipality?.code)) {
                            pasData.residentDiscountInfo = {};
                            pasData.residentDiscountInfo.municipalityCode = discountsInfo?.residentDiscount?.municipality?.code;
                        }
                    }
                }
                if (securityInfoData.passengersSecurityInformation[i].mandatoryDocuments) {
                    for (k = 0; k < securityInfoData.passengersSecurityInformation[i].mandatoryDocuments.length; k++) {
                        for (m = 0; m < securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents.length; m++) {
                            if (securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents[m].type.code === 'REDRESSNUMBER') {
                                pasData.requiredFields[securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents[m].type.code] = {
                                    description: securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents[m].type.description,
                                    showFields: securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents[m].requiredFields
                                };
                            } else {
                                pasData.mandatoryDocs.push({
                                    code: securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents[m].type.code,
                                    description: securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents[m].type.description,
                                    showFields: {},
                                    number: ''
                                });
                                for (l = 0; l < securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents[m].requiredFields.length; l++) {
                                    pasData.mandatoryDocs[pasData.mandatoryDocs.length - 1].showFields[securityInfoData.passengersSecurityInformation[i].mandatoryDocuments[k].documents[m].requiredFields[l]] = {};
                                }
                            }
                        }
                    }
                    if(travelDocuments && i === 0) {
                        IbBookingPassengerInfoUtilsService.addTravelDocs(pasData.mandatoryDocs, travelDocuments);
                    }
                }
                if (securityInfoData.passengersSecurityInformation[i].optionalDocuments) {
                    for (m = 0; m < securityInfoData.passengersSecurityInformation[i].optionalDocuments.length; m++) {
                        pasData.optionalDocs[securityInfoData.passengersSecurityInformation[i].optionalDocuments[m].type.code] = {
                            code: securityInfoData.passengersSecurityInformation[i].optionalDocuments[m].type.code,
                            description: securityInfoData.passengersSecurityInformation[i].optionalDocuments[m].type.description,
                            showFields: {}
                        };
                        for (l = 0; l < securityInfoData.passengersSecurityInformation[i].optionalDocuments[m].requiredFields.length; l++) {
                            pasData.optionalDocs[securityInfoData.passengersSecurityInformation[i].optionalDocuments[m].type.code].showFields[securityInfoData.passengersSecurityInformation[i].optionalDocuments[m].requiredFields[l]] = {};
                        }
                    }
                }
                switch (pasData.type) {
                        case BookingAppConstants.passengerTypes.senior:
                        case BookingAppConstants.passengerTypes.young:
                        case BookingAppConstants.passengerTypes.adult:
                            adultPas.push(pasData);
                            break;
                        case BookingAppConstants.passengerTypes.child:
                            childPas.push(pasData);
                            break;
                        case BookingAppConstants.passengerTypes.infant:
                            infantPas.push(pasData);
                            break;
                        default:
                            adultPas.push(pasData);
                }
                numPassengers++;
                transformedSecurityInfoPassengerData.passengerInfo.push(pasData);
            }
            if ($rootScope.isRedemptionFlow) {
                transformedSecurityInfoPassengerData.totalPrice = localStorageService.get('selectedFareRedemptionData');
            } else {
                transformedSecurityInfoPassengerData.onHold = getOnHoldOptionsInfo(fareData.offers[0].onHoldOptions, currencies, false);
                transformedSecurityInfoPassengerData.onHoldIfIsLogged = getOnHoldOptionsInfo(fareData.offers[0].onHoldOptionsIfUserIsLogged, currencies, true);
                if (flowApp === 'PAREONB') {
                    transformedSecurityInfoPassengerData.totalPrice = fareData.offers[0].formatPrice;
                    //transformedSecurityInfoPassengerData.totalPrice.price.totalCash = fareData.offers[0].formatPrice;
                    //transformSecurityInfoPassengerData.totalPrice.price.totalPoints = fareData.offers[0].formatAvios;
                } else {
                    transformedSecurityInfoPassengerData.totalPrice = CurrencyService.formatPrice(currencies, angular.isUndefined(fareData.offers[0].price) ? angular.isUndefined(fareData.offers[0].totalCash) ? fareData.offers[0].cash.fare : fareData.offers[0].totalCash.fare : fareData.offers[0].price.total, true);
                }
                if (fareData.offers[0].discountsApplied) {
                    transformedSecurityInfoPassengerData.totalPriceWithOutDiscount = CurrencyService.formatPrice(currencies, fareData.offers[0].discountsApplied.originalPrice.total, true);
                    transformedSecurityInfoPassengerData.totalPriceWithDiscount = transformedSecurityInfoPassengerData.totalPrice;
                    transformedSecurityInfoPassengerData.discounts = selectDiscount(fareData.offers[0].discountsApplied.discounts);
                    angular.forEach(transformedSecurityInfoPassengerData.discounts, (discount) => {
                        discount.discount = CurrencyService.formatPrice(currencies, discount.totalDiscount, true);
                    });
                    transformedSecurityInfoPassengerData.originalDiscounts = transformedSecurityInfoPassengerData.discounts;
                } else {
                    transformedSecurityInfoPassengerData.totalPriceWithOutDiscount = transformedSecurityInfoPassengerData.totalPrice;
                    transformedSecurityInfoPassengerData.totalPriceWithDiscount = transformedSecurityInfoPassengerData.totalPrice;
                }
            }
            transformedSecurityInfoPassengerData.warningMessages = createWarningMessages(fareData.advices, fareData.warnings);

            transformedSecurityInfoPassengerData.summaryInfo.trips = BookingUtilService.getTripsBreakdownInfo(fareData.offers[0].slices);
            transformedSecurityInfoPassengerData.summaryInfo.passengers = BookingUtilService.getPassengersBreakdownInfo(fareData, currencies);
            if (fareData?.offers?.[0]?.price?.ticketingFee) {
                transformedSecurityInfoPassengerData.summaryInfo.otherFees.push({
                    code: 'ticketingFee',
                    description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
                    fee: CurrencyService.formatPrice(currencies, fareData.offers[0].price.ticketingFee, true)
                });
            }
            if (localStorageService.get('availabilityRelatedContent') !== null) {
                for (i = 0; i < localStorageService.get('availabilityRelatedContent').length; i++) {
                    fareData.relatedContent.push(localStorageService.get('availabilityRelatedContent')[i]);
                }
            }
            if ( dataUserLogged) {
                const docType = dataUserLogged?.memberPersonalDetails?.person?.registeredIdentifiers.find((doc) => doc.type === BookingPassengerInfoConstants.NATIONALITY_ID_DOC);
                const docNumber = docType?.token ?? '';
                const selectedDocAux = getSelectedDoc(transformedSecurityInfoPassengerData.passengerInfo[0].mandatoryDocs ?? [], docNumber);

                if (selectedDocAux) {
                    selectedDocAux.number = selectedDocAux.number;
                    transformedSecurityInfoPassengerData.passengerInfoLogged.selectedDoc = {
                        number: selectedDocAux.number,
                        code: selectedDocAux.code,
                        description: selectedDocAux.description,
                        showFields: selectedDocAux.showFields
                    };
                }
            }
            transformedSecurityInfoPassengerData.relatedContent = BookingUtilService.getRelatedContent(fareData.relatedContent);

            return {
                transformedSecurityInfoPassengerData: transformedSecurityInfoPassengerData,
                transformedPrefixes: transformedPrefixes,
                datalayerObject: DatalayerUtilsService.generateDatalayerPassengers(fareData.offers[0].slices, $rootScope.isRedemptionFlow ? localStorageService.get('selectedFareRedemptionData') : fareData.offers[0].price, fareData.contextMetadata && fareData.contextMetadata.currencies && fareData.contextMetadata.currencies[0] ? fareData.contextMetadata.currencies[0].code : null, fareData.offers[0].flightRatio),
                digitalDataObject: DatalayerBKIService.generateDigitalDataPassengers(fareData.offers[0].slices, $rootScope.isRedemptionFlow ? localStorageService.get('selectedFareRedemptionData') : fareData.offers[0].price, fareData.contextMetadata && fareData.contextMetadata.currencies && fareData.contextMetadata.currencies[0] ? fareData.contextMetadata.currencies[0].code : null, fareData.offers[0].flightRatio)
            };

            function getSelectedDoc (mandatoryDocs, docNumber) {
                const isNIE = BookingPassengerInfoConstants.NIE_FORMAT.test(docNumber);
                const isDNI = BookingAppConstants.bookingPatterns.DNI_DOCUMENT.test(docNumber);
                const documentCodes = getDocumentCodes();
                let selectDoc = null;
                mandatoryDocs.forEach((doc)=>{
                    if(doc.code ===BookingPassengerInfoConstants.DOCUMENT_MAP.NIE && !doc.number) {
                        doc.number = isNIE ? docNumber : doc.number;
                    } else if(doc.code === BookingPassengerInfoConstants.DOCUMENT_MAP.NATIONALITY_ID && !doc.number) {
                        doc.number = isDNI ? docNumber : doc.number;
                    }

                    if (documentCodes.includes(doc.code) && doc.number) {
                        selectDoc = selectDoc || doc ;
                    }
                });
                return selectDoc;
            }

            function getDocumentCodes () {
                return [
                    BookingPassengerInfoConstants.DOCUMENT_MAP.NATIONALITY_ID,
                    BookingPassengerInfoConstants.DOCUMENT_MAP.NI_DOCUMENT,
                    BookingPassengerInfoConstants.DOCUMENT_MAP.PASSPORT,
                    BookingPassengerInfoConstants.DOCUMENT_MAP.NIE
                ];
            }

            function getRequiredFieldsOptions (requiredField, requiredFieldsOptions) {
                let fieldValues = {}, fieldIndex = 0, fieldFounded = false;
                if (requiredFieldsOptions) {
                    while (!fieldFounded && fieldIndex < requiredFieldsOptions.length) {
                        if (requiredField === requiredFieldsOptions[fieldIndex].field) {
                            fieldValues.values = requiredFieldsOptions[fieldIndex].values;
                            fieldFounded = true;
                        }
                        fieldIndex++;
                    }
                }
                return fieldValues;
            }


            function getAviosInfo (fareData, currency) {
                const calcPoints = localStorageService.get(BkiStorageConstants.CALCULATED_POINTS);
                const aviosInfo = { redemptionAvios: calcPoints ? calcPoints.Avios : null, cashDiscountWithAvios: fareData && fareData.offers[0] && fareData.offers[0].cashAviosPossibilities ? getBestAviosOffer(fareData.offers[0].cashAviosPossibilities, currency) : null };
                return aviosInfo;

                function getBestAviosOffer (cashAviosPossibilities, currency) {
                    let cashAviosPossibilitiesIndex, bestAviosDiscount = null;
                    for (cashAviosPossibilitiesIndex = 0; cashAviosPossibilitiesIndex < cashAviosPossibilities.length; cashAviosPossibilitiesIndex++) {
                        bestAviosDiscount = bestAviosDiscount > 0 ? Math.max(bestAviosDiscount, cashAviosPossibilities[cashAviosPossibilitiesIndex].totalDiscount) : cashAviosPossibilities[cashAviosPossibilitiesIndex].totalDiscount;
                    }
                    bestAviosDiscount = CurrencyService.formatPrice(currency, bestAviosDiscount, true);
                    return bestAviosDiscount;
                }
            }

            /**
             * Create the wheelchair special needs information to show in the view.
             * @param {Object} fareData -The fare data received from the previous step.
             * @returns {Object} - list of wheelchair special needs information.
             */
            function getWheelchairServiceInfo (fareData) {
                let specialNeedsServiceInfo, specialNeedsInformation = [], i = 0, isFound = false;
                if (fareData?.services?.length > 0) {
                    while (i < fareData.services.length && !isFound) {
                        if (fareData.services[i].code === 'WCHC' || fareData.services[i].code === 'WCHR' || fareData.services[i].code === 'WCHS') {
                            specialNeedsServiceInfo = {
                                code: fareData.services[i].code,
                                name: fareData.services[i].name,
                                description: fareData.services[i].descriptions[0]
                            };
                            specialNeedsInformation.push(specialNeedsServiceInfo);
                        }
                        if (specialNeedsInformation.length > 2) {
                            isFound = true;
                        }
                        i++;
                    }
                    if (specialNeedsInformation.length > 2) {
                        isFound = true;
                    }
                    i++;
                }
                return specialNeedsInformation;
            }

            /**
             *  This function select discounts to show at user in the summary info. Not all discount are available to show at user (RESIDEN AND FAMILY).
             * @param discountsAvailable are all discount available return by service
             * @returns selectDiscountToShow
             *  */
            function selectDiscount (discountsAvailable) {
                let selectDiscountToShow = [], i;
                for (i = 0; i < discountsAvailable.length; i++) {
                    if (discountsAvailable[i].type !== 'RES' && discountsAvailable[i].type !== 'LGF') {
                        selectDiscountToShow.push(discountsAvailable[i]);
                    }
                }
                return selectDiscountToShow;
            }
        }

        /**
         * Transforms the associates data from service to frequently passengers model.
         * @param {Object} associatesCollection - array of associates from a member.
         * @returns {Object} - returns the fields to show in the view.
         */
        function getAssociatesTransformed (associatesCollection) {
            associatesCollection = associatesCollection.data.associates;
            let transformedAssociatesCollection = { beneficiaries: [] }, i;
            if (associatesCollection) {
                for (i = 0; i < associatesCollection.length; i++) {
                    const newBeneficiaryTransformed = {};
                    newBeneficiaryTransformed.beneficiaryNumber = i + 1;
                    newBeneficiaryTransformed.birthDate = associatesCollection[i].person.dateOfBirth;
                    newBeneficiaryTransformed.frequentFlyer = associatesCollection[i].memberIdentifier ? associatesCollection[i].memberIdentifier : '';
                    newBeneficiaryTransformed.name = associatesCollection[i].person.personName.firstName;
                    newBeneficiaryTransformed.surname1 = associatesCollection[i].person.personName.familyName;
                    newBeneficiaryTransformed.surname2 = associatesCollection[i].person.personName.secondFamilyName ? associatesCollection[i].person.personName.secondFamilyName : '';
                    newBeneficiaryTransformed.title = associatesCollection[i].person.personName.title;
                    newBeneficiaryTransformed.relationship = associatesCollection[i].relation;
                    newBeneficiaryTransformed.relationshipDescription = 1; // relacionar con relationship
                    newBeneficiaryTransformed.relationshipWebCode = 2; // relacionar con relationship
                    newBeneficiaryTransformed.isSelected = false;
                    newBeneficiaryTransformed.index = i;
                    newBeneficiaryTransformed.type = BookingUtilService.getTypeOfPassenger(newBeneficiaryTransformed.birthDate);
                    newBeneficiaryTransformed.program = associatesCollection[i].programmeIdentifier || null;
                    transformedAssociatesCollection.beneficiaries.push(newBeneficiaryTransformed);
                }
                transformedAssociatesCollection.beneficiaries.unshift({ name: 'CKI_COMBO_FREQUENTLY_PASSENGERS_BLANK', needsTranslate: true, type: BookingAppConstants.passengerTypes.Default, isSelected: false });
            }
            return transformedAssociatesCollection;
        }

        /**
         * Create the warning messages to show in the view.
         * @param {Object} fareData -The fare data received from the previous step.
         * @returns {Object} - hashmap of messages.
         */

        function createWarningMessages (advices, warnings) {
            const warningMessages = { status: false, simpleAdvises: [], checkAdvises: [] };
            const hasAdvices = advices?.length > 0;
            const hasWarnings = warnings?.length > 0;
            if (hasAdvices || hasWarnings) {
                const advicesFormatted = hasAdvices && advices.map((advice) => formatWarning(advice));
                const warningsFormatted = hasWarnings && warnings.map((warning) => formatWarning(warning));
                warningMessages.status = true;
                formatAdvisesMessages(advicesFormatted, warningMessages);
                formatWarningMessages(warningsFormatted, warningMessages);
            }
            return warningMessages;
        }

        function formatAdvisesMessages (advicesFormatted, warningMessages) {
            if(advicesFormatted) {
                warningMessages.simpleAdvises = advicesFormatted.some(advice => advice.checkBox === null) ? advicesFormatted.filter(warning => warning.checkBox === null) : [];
                warningMessages.checkAdvises = advicesFormatted.some(advice => advice.checkBox !== null) ? advicesFormatted.filter(warning => warning.checkBox !== null) : [];
            }
        }
        function formatWarningMessages (warningsFormatted, warningMessagges) {
            if(warningsFormatted) {
                const showWarningCodes = ['SSE_AVM_20012','SSE_AVM_20013'];
                const filteredWarnings = warningsFormatted.filter(warning => warning.checkBox === null && showWarningCodes.includes(warning.id));
                filteredWarnings.length > 0 && warningMessagges.simpleAdvises.push(...filteredWarnings);
            }
        }

        function formatWarning (advice)  {
            const isWarning = advice?.code != null && advice?.description != null;
            return isWarning ?
                {
                    id:advice.code,
                    title: BookingPassengerInfoConstants.WARNING_MESSAGE_TITLE,
                    text: $sce.trustAsHtml(advice.description),
                    checkBox: null,
                    checkBoxText: null,
                    checkBoxConditions: false,
                    showCheckBoxError: false
                }:
                adviceObject(advice);
        }

        function adviceObject (advice) {
            const hasAcknowledgement = advice?.acknowledgement;
            return {
                id: advice.id,
                title: BookingPassengerInfoConstants.WARNING_MESSAGE_TITLE,
                text: $sce.trustAsHtml(advice.message),
                checkBox: hasAcknowledgement?.required,
                checkBoxText: hasAcknowledgement?.message && $sce.trustAsHtml(advice.acknowledgement.message),
                checkBoxConditions: false,
                showCheckBoxError: false
            };
        }

        /**
         * Create the on hold options info to show in the view.
         * @param {Object} onHoldInfo -The fare data received from the previous step.
         * @returns {Object} - hashmap of onHold Options.
         */

        function getOnHoldOptionsInfo (onHoldInfo, currencies, showIfLoggedModule) {
            let onHoldOptions = {}, i;
            let onHoldShowInfo = false;
            const textsToReplace = [];
            const variablesToAdd = [];
            if (onHoldInfo && onHoldInfo.length > 0) {
                onHoldShowInfo = {
                    holdTimes: '',
                    maxFreeTime: 0,
                    moreTimePrice: 0,
                    minPrice: 0,
                    freePrice:0,
                    freeOption: false,
                    payOption: false,
                    holdTimesFree: '',
                    holdTimesPay: '',
                    onHoldOptionText: ''
                };
                if(showIfLoggedModule) {
                    onHoldShowInfo.onHoldOptionTitle = '';
                    onHoldShowInfo.onHoldOptionDescription = '';
                }
                for (i = 0; i < onHoldInfo.length; i++) {
                    onHoldOptions[onHoldInfo[i].onHoldOptionId] = onHoldInfo[i];
                    onHoldOptions[onHoldInfo[i].onHoldOptionId].transformedTimeDateLimit = $filter('DateFormatFilter')(onHoldInfo[i].referenceTimeLimit);
                    onHoldShowInfo.holdTimes += i < onHoldInfo.length - 1 ? onHoldInfo[i].hours + ',' : onHoldInfo[i].hours;
                    if (onHoldInfo[i].price.total === 0) {
                        onHoldShowInfo.maxFreeTime = Math.max(onHoldShowInfo.maxFreeTime, onHoldInfo[i].hours);
                        onHoldShowInfo.freeOption = true;
                        onHoldShowInfo.holdTimesFree = onHoldInfo[i].hours;
                        onHoldShowInfo.freePrice = CurrencyService.formatPrice(currencies, onHoldInfo[i].price.total, true);
                    } else {
                        onHoldShowInfo.minPrice = onHoldShowInfo.minPrice || onHoldInfo[i].price.total;
                        onHoldShowInfo.minPrice = Math.min(onHoldShowInfo.minPrice, onHoldInfo[i].price.total);
                        onHoldShowInfo.payOption = true;
                        onHoldShowInfo.holdTimesPay = onHoldInfo[i].hours;
                    }
                    onHoldOptions[onHoldInfo[i].onHoldOptionId].onHoldPricePerPassenger = onHoldInfo[i].price.total;

                }

                onHoldShowInfo.moreTimePrice = angular.copy(onHoldShowInfo.minPrice);
                onHoldShowInfo.minPrice = CurrencyService.formatPrice(currencies, onHoldShowInfo.minPrice, true);
                if(showIfLoggedModule) {
                    onHoldShowInfo.onHoldOptionTitle = CommonsUtilService.translateTextAndAddVariable('ON_HOLD_IF_LOGGED_TITLE', onHoldShowInfo.minPrice.trim(), '$$AMOUNT$$');
                    variablesToAdd.push(onHoldShowInfo.freeOption ? onHoldShowInfo.freePrice : onHoldShowInfo.minPrice.trim(), onHoldShowInfo.freeOption ? onHoldShowInfo.holdTimesFree: onHoldShowInfo.holdTimesPay);
                    textsToReplace.push('$$AMOUNT$$', '$$PAYHOURS$$');
                    onHoldShowInfo.onHoldOptionDescription = CommonsUtilService.translateTextAndAddVariablesArray('ON_HOLD_IF_LOGGED_DESCRIPTION', variablesToAdd, textsToReplace);
                } else {
                    if (onHoldShowInfo.freeOption && onHoldShowInfo.payOption) {
                        variablesToAdd.push(onHoldShowInfo.holdTimesFree, onHoldShowInfo.holdTimesPay, onHoldShowInfo.minPrice.trim());
                        textsToReplace.push('$$FREEHOURS$$', '$$PAYHOURS$$', '$$AMOUNT$$');
                        onHoldShowInfo.onHoldOptionText = CommonsUtilService.translateTextAndAddVariablesArray('ONHOLD_NOW_NEW_TEXT_FREE_AND_PAY', variablesToAdd, textsToReplace);
                    } else if (onHoldShowInfo.payOption) {
                        variablesToAdd.push(onHoldShowInfo.holdTimesPay, onHoldShowInfo.minPrice.trim());
                        textsToReplace.push('$$PAYHOURS$$', '$$AMOUNT$$');
                        onHoldShowInfo.onHoldOptionText = CommonsUtilService.translateTextAndAddVariablesArray('ONHOLD_NOW_NEW_TEXT_PAY', variablesToAdd, textsToReplace);
                    } else if (onHoldShowInfo.freeOption) {
                        onHoldShowInfo.onHoldOptionText = CommonsUtilService.translateTextAndAddVariable('ONHOLD_NOW_NEW_TEXT_FREE', onHoldShowInfo.holdTimesFree, '$$FREEHOURS$$');
                    }
                    localStorageService.set('onHoldOptions', onHoldOptions);
                }
                localStorageService.set('onHoldShowInfo', onHoldShowInfo);
            }
            return onHoldShowInfo;
        }

        /**
         * Transforms the passenger form data received from the view into a correct request data for create order service.
         * @param {Object} passengerformData -The passenger form data received from the view.
         * @returns {Object} - returns  request data for create order service.
         */
        function transformUpdatePassengerInfoData (passengerformData, onHold) {
            const fareData = localStorageService.get('fareData');
            const transformedUpdatePassengerInfoData = {
                shoppingResponseId: '',
                offerItems: [],
                passengers: [],
                primaryContact: {
                    email: '',
                    phone: '',
                    phoneType: '',
                    phonePrefix: '',
                    prefixCountryCode: ''
                },
                onHold: undefined,
                redemptionOptionId: null
            };
            let auxPassInfo = {};
            const datalayerObject = localStorageService.get('confirmationDatalayerInfo');

            transformedUpdatePassengerInfoData.shoppingResponseId = fareData.responseId;
            transformedUpdatePassengerInfoData.onHold = onHold;
            transformedUpdatePassengerInfoData.redemptionOptionId = $rootScope.isRedemptionFlow ? localStorageService.get('selectedFareRedemptionData').redemptionOptionId || localStorageService.get('selectedFareRedemptionData').price.redemptionOptionId : null;
            generateContactInfoRequest(passengerformData, transformedUpdatePassengerInfoData);

            for (let i = 0; i < passengerformData.passengerInfo.length; i++) {
                auxPassInfo = {};
                auxPassInfo.passengerId = passengerformData.passengerInfo[i].id;
                auxPassInfo.passengerType = passengerformData.passengerInfo[i].type;
                auxPassInfo.personalInfo = {
                    firstName: passengerformData.passengerInfo[i].data.name,
                    firstSurname: passengerformData.passengerInfo[i].data.surname
                };
                if (passengerformData.isResident) angular.extend(auxPassInfo.personalInfo, { lastSurname: passengerformData.passengerInfo[i].data.lastSurname });
                if (passengerformData.passengerInfo[i].data.mandatoryDoc) {
                    auxPassInfo.idInfo = {
                        type: passengerformData.passengerInfo[i].data.mandatoryDoc.code,
                        value: passengerformData.passengerInfo[i].data.mandatoryDoc.number.length > 0 ? passengerformData.passengerInfo[i].data.mandatoryDoc.number.replace(/\s/g, '') : null
                    };
                }
                generateOptionalRequest(passengerformData, auxPassInfo, i);
                generateDiscountsRequest(passengerformData, auxPassInfo, i);
                generateBirthDateRequest(passengerformData, auxPassInfo, i);
                generateGenderRequest(passengerformData, auxPassInfo, i);
                generateFrequentFlyerRequest(passengerformData, auxPassInfo, datalayerObject, i);
                generateOBAndRelatedPassRequest(passengerformData, auxPassInfo, i);
                transformedUpdatePassengerInfoData.passengers.push(auxPassInfo);
            }
            generateOfferItemsRequest(fareData, transformedUpdatePassengerInfoData, passengerformData);

            return transformedUpdatePassengerInfoData;

        }

        function generateOfferItemsRequest (fareData, transformedUpdatePassengerInfoData, passengerformData) {
            let offerItemServices = [];
            for (let i = 0; i < fareData.offers[0].offerItems.length; i++) {
                transformedUpdatePassengerInfoData.offerItems[i] = {
                    offerItemId: fareData.offers[0].offerItems[i].offerItemId,
                    passengerIds: fareData.offers[0].offerItems[i].passengerIds
                };
                offerItemServices = getOfferItemsServices(fareData.offers[0].offerItems[i], passengerformData.passengerInfo);
                if (offerItemServices.length > 0) {
                    transformedUpdatePassengerInfoData.offerItems[i].services = offerItemServices;
                }
            }
        }

        function getOfferItemsServices (offerItems, passengers) {
            let pasIndex, services = [], specialNeeds = [];
            const passengersSpecialNeeds = localStorageService.get('passengersSpecialNeeds') ?? [];
            const specialNeedsInfo = localStorageService.get('specialNeedsInfo') || [];
            for (pasIndex = 0; pasIndex < passengers.length; pasIndex++) {
                specialNeeds = [];
                if (offerItems.passengerIds.indexOf(passengers[pasIndex].id) !== -1 && passengers[pasIndex].specialNeeds.isEnable) {
                    specialNeeds = setSpecialNeedsRequest(passengers[pasIndex]);

                    if (specialNeeds.length > 0) {
                        passengersSpecialNeeds.push({
                            id: passengers[pasIndex].id,
                            specialNeeds: specialNeeds
                        });
                    }
                    setServicesSpeNeedRequest(services, specialNeeds, specialNeedsInfo, passengers[pasIndex]);

                }
            }
            localStorageService.set('passengersSpecialNeeds', passengersSpecialNeeds);
            return services;
        }

        function setServicesSpeNeedRequest (services, specialNeeds, specialNeedsInfo, passenger) {
            for (let specialNeedsIndex = 0; specialNeedsIndex < specialNeeds.length; specialNeedsIndex++) {
                for (let specialNeedsInfoIndex = 0; specialNeedsInfoIndex < specialNeedsInfo.length; specialNeedsInfoIndex++) {
                    if (specialNeeds[specialNeedsIndex].id === specialNeedsInfo[specialNeedsInfoIndex].code && specialNeedsInfo[specialNeedsInfoIndex].passengerIds.indexOf(passenger.id) !== -1) {
                        services.push({
                            type: specialNeedsInfo[specialNeedsInfoIndex].type,
                            serviceId: specialNeedsInfo[specialNeedsInfoIndex].serviceId,
                            passengerIds: [passenger.id],
                            ssrCode: specialNeedsInfo[specialNeedsInfoIndex].serviceCode
                        });
                    }
                }
            }
        }

        function setSpecialNeedsRequest (passenger) {
            const specialNeeds = [];
            if (passenger.specialNeeds.specialVision) {
                specialNeeds.push({
                    id: 'BLND',
                    description: 'IB_PASSENGER_SPE_NEEDS_CHECK_SPECIAL_VISION_TEXT'
                });
            }
            if (passenger.specialNeeds.specialHearing) {
                specialNeeds.push({
                    id: 'DEAF',
                    description: 'IB_PASSENGER_SPE_NEEDS_CHECK_SPECIAL_HEARING_PROBLEM_TEXT'
                });
            }
            if (passenger.specialNeeds.specialGuideDog) {
                specialNeeds.push({
                    id: 'SVAN',
                    description: 'IB_PASSENGER_SPE_NEEDS_CHECK_SPECIAL_VISION_DOG_TEXT'
                });
            }
            if (passenger.specialNeeds.specialIntellDisability) {
                specialNeeds.push({
                    id: 'DPNA',
                    description: 'IB_PASSENGER_SPE_NEEDS_CHECK_SPECIAL_INTELLECTUAL_DISABILITY_TEXT'
                });
            }

            if (passenger.specialNeeds.specialWheelchair && passenger.specialNeeds.specialWheelchairValue) {
                specialNeeds.push({
                    id: passenger.specialNeeds.specialWheelchairValue,
                    description: 'IB_PASSENGER_SPE_NEEDS_CHECK_SPECIAL_CHAIR_TEXT'
                });
            }
            return specialNeeds;
        }

        function generateContactInfoRequest (passengerformData, transformedUpdatePassengerInfoData) {
            transformedUpdatePassengerInfoData.primaryContact.email = passengerformData.contactData.contactEmail.toLowerCase();
            transformedUpdatePassengerInfoData.primaryContact.phone = passengerformData.contactData.contactPhone;
            transformedUpdatePassengerInfoData.primaryContact.phoneType = BookingPassengerInfoConstants.PHONE_TYPES.MOBILE;
            transformedUpdatePassengerInfoData.primaryContact.phonePrefix = passengerformData.contactData.contactPrefix.code;
            transformedUpdatePassengerInfoData.primaryContact.prefixCountryCode = passengerformData.contactData.contactPrefix.countryCode;
            localStorageService.set('contactName', passengerformData.passengerInfo[0].data.name + ' ' + passengerformData.passengerInfo[0].data.surname + (passengerformData.passengerInfo[0].data.lastSurname ? ' ' + passengerformData.passengerInfo[0].data.lastSurname : ''));
            localStorageService.set('contactEmail', passengerformData.contactData.contactEmail);
            localStorageService.set('contactPhone', passengerformData.contactData.contactPrefix.code + passengerformData.contactData.contactPhone);
            localStorageService.set('suscribeNewsletter', !passengerformData.contactData.denyNewsLetters);
            localStorageService.remove('passengersSpecialNeeds');
            localStorageService.set('globickPassengersInfo', {
                email: passengerformData.contactData?.contactEmail ?? '',
                phone: passengerformData.contactData?.contactPhone ?? '',
                phonePrefix: passengerformData.contactData?.contactPrefix?.code ?? ''
            });
        }

        function generateOptionalRequest (passengerformData, auxPassInfo, i) {
            const optionalDoc = passengerformData.passengerInfo[i].data?.optionalDoc;

            if (optionalDoc && optionalDoc.code) {
                const numberAsString = optionalDoc.number?.toString() || '';
                const cleanedNumber = numberAsString.replace(/\s/g, '');

                auxPassInfo.fiscalDocumentInfo = {
                    passengerDocumentType: optionalDoc.code,
                    passengerDocumentId: cleanedNumber.length > 0 ? cleanedNumber : null
                };
            }
        }

        function generateDiscountsRequest (passengerformData, auxPassInfo, i) {
            if (passengerformData.passengerInfo[i].data.residentDiscountInfo) {
                auxPassInfo.residentDiscountInfo = passengerformData.passengerInfo[i].data.residentDiscountInfo;
            }
            if (passengerformData.passengerInfo[i].data.largeFamilyDiscountInfo) {
                auxPassInfo.largeFamilyDiscountInfo = Object.assign({}, {
                    ...passengerformData.passengerInfo[i].data.largeFamilyDiscountInfo,
                    communityCode: passengerformData.passengerInfo[i].data.largeFamilyDiscountInfo.communityCode.code});
            }
        }

        function generateFrequentFlyerRequest (passengerformData, auxPassInfo, datalayerObject, i) {
            if (passengerformData.passengerInfo[i].data.freqFlyerSelected) {
                auxPassInfo.ffInfo = {
                    company: passengerformData.passengerInfo[i].data.freqFlyerInfo.company.iataCompanyCode,
                    number: passengerformData.passengerInfo[i].data.freqFlyerInfo.number
                };
            }
        }

        function generateBirthDateRequest (passengerformData, auxPassInfo, i) {
            const isValidDayAndMonth = '' !== passengerformData.passengerInfo[i].data?.birthDate[0] && '' !==  passengerformData.passengerInfo[i].data?.birthDate[1];
            if (isValidDayAndMonth && '' !== passengerformData.passengerInfo[i].data?.birthDate[2]) {
                auxPassInfo.personalInfo.birthDate = passengerformData.passengerInfo[i].data.birthDate[2] + '-' + passengerformData.passengerInfo[i].data.birthDate[1] +
                    '-' + passengerformData.passengerInfo[i].data.birthDate[0];
            }
        }

        function generateGenderRequest (passengerformData, auxPassInfo, i) {
            const hasRequiredFields = passengerformData.passengerInfo[i]?.requiredFields;
            const hasGender = passengerformData.passengerInfo[i]?.data?.gender;
            if (shouldSetTitle(auxPassInfo, hasGender, hasRequiredFields)) {
                auxPassInfo.personalInfo.title = passengerformData.passengerInfo[i].data.gender === BookingPassengerInfoConstants.PASSENGER_GENDERS.FEMALE
                    ? BookingPassengerInfoConstants.PASSENGER_TITLES.MRS : BookingPassengerInfoConstants.PASSENGER_TITLES.MR;
            } else if (shouldSetGender(hasGender, hasRequiredFields)) {
                auxPassInfo.personalInfo.gender = passengerformData.passengerInfo[i].data.gender;
            }
        }

        function shouldSetTitle (auxPassInfo, hasGender, hasRequiredFields) {
            const isTitlePassengerType = (
                auxPassInfo.passengerType === 'ADULT' ||
                auxPassInfo.passengerType === 'CHILD' ||
                auxPassInfo.passengerType === 'YOUNG_ADULT' ||
                auxPassInfo.passengerType === 'YOUTH' ||
                auxPassInfo.passengerType === 'SENIOR'
            );
            const hasTitleAndGender = hasRequiredFields?.TITLE && hasGender;
            return hasTitleAndGender && isTitlePassengerType;
        }

        function shouldSetGender (hasGender, hasRequiredFields) {
            return hasRequiredFields?.GENDER && hasGender;
        }

        function generateOBAndRelatedPassRequest (passengerformData, auxPassInfo, i) {
            if (passengerformData.passengerInfo[i].data.OBNumberSelected) {
                auxPassInfo.onBusinessInfo = {
                    type: passengerformData.passengerInfo[i].data.OBNumberInfo.businessCodeType.code,
                    number: passengerformData.passengerInfo[i].data.OBNumberInfo.number.replace(new RegExp(BookingAppConstants.bookingPatterns.CARD_NUMBER_CLEANER, 'gi'), '')
                };
            }
            if (passengerformData.passengerInfo[i].type === BookingAppConstants.passengerTypes.infant) {
                auxPassInfo.relatedPassengerId = passengerformData.passengerInfo[i].data.personInCharge ? passengerformData.passengerInfo[i].data.personInCharge.id : '';
            }
        }

        /**
         * Checks if the infant and child passengers birth dates are correct.  It means that its birth dates are correct depending on the last returned segment date.
         * They are still less than two years old for infant and between 2 and 12 years old for child.
         * @param {Object} passengersInfo -The passengers form information filled by the user.
         * @returns {boolean} - returns  true if the infant and child birth dates are valid, false e.o.c
         */
        function arePassengersBirthDatesValid (passengersInfo) {
            let i, passengersInvalid = [];
            let passengerDate, compareDate;
            for (i = 0; i < passengersInfo.passengerInfo.length; i++) {
                if (passengersInfo.passengerInfo[i].type === BookingAppConstants.passengerTypes.child ||
                    passengersInfo.passengerInfo[i].type === BookingAppConstants.passengerTypes.infant) {
                    passengersInfo.passengerInfo[i].passengerIndex = i;
                    passengerDate = new Date(passengersInfo.passengerInfo[i].data.birthDate[2] + '/' + passengersInfo.passengerInfo[i].data.birthDate[1] + '/' + passengersInfo.passengerInfo[i].data.birthDate[0]);
                    compareDate = angular.copy(getLastSegmentDate(passengersInfo.passengerInfo[i].type));
                    compareDate.setUTCFullYear(compareDate.getUTCFullYear() - (passengersInfo.passengerInfo[i].type === BookingAppConstants.passengerTypes.infant && 2 || 12));
                    if (passengerDate.getTime() <= compareDate.getTime()) {
                        passengersInvalid.push(passengersInfo.passengerInfo[i]);
                    }
                }
            }

            return passengersInvalid;

            function getLastSegmentDate (type) {
                let fareInfo, offer, slice, lastSegmentDate;
                fareInfo = localStorageService.get('fareData');
                offer = fareInfo.offers[fareInfo.offers.length - 1];
                slice = offer.slices[type === BookingAppConstants.passengerTypes.child ? 0 : offer.slices.length - 1];
                if (slice.segments && slice.segments[slice.segments.length - 1] && slice.segments[slice.segments.length - 1].departureDateTime) {
                    lastSegmentDate = slice.segments[slice.segments.length - 1].departureDateTime.split(' ')[0];
                    return new Date(lastSegmentDate);
                }
                return new Date();
            }
        }


        /**
         * Clean list resident errors on passengers
         * @param {Array} passengers
         */
        function cleanErrorResidents (passengers) {
            angular.forEach(passengers, (passenger) => {
                passenger.options.resident = { haveError: false, errorMessage: '' };
            });
        }

        /**
         * Create array/object to call addFlightReview Monetate API method
         *
         * @param {*} data booking Url parameters data
         * @param {*} passengers data about passengers and total passengers
         * @param {*} availability data of availability results
         * @returns List of needed data to call Monetate method
         */
        function createFlightReviewMonetate (data, passengers, selectedSlices, currency, fareFamily) {
            const flightReview = ['addFlightReview'];
            const cabinTypes = [];
            let i, x, flightsCount = 0;
            const infoObject = {
                depDate: data.originDestinations[0].date ? [dateFormatted(data.originDestinations[0].date)] : 'IBOPEN',
                destination: [data.originDestinations[0].destination],
                origin: [data.originDestinations[0].origin],
                travelers: [passengers.passengers]
            };
            const flightId = localStorageService.get('confirmationDatalayerInfo') ? localStorageService.get('confirmationDatalayerInfo').Identifier : null;
            localStorageService.set('flightIdentifier', flightId);

            for (i = 0; i < selectedSlices.length; i++) {
                for (x = 0; x < selectedSlices[i].info.segments.length; x++) {
                    flightsCount++;
                }
            }

            fareFamily.forEach((fare) => {
                if (cabinTypes.indexOf(fare.cabinDescription) === -1) {
                    cabinTypes.push(fare.cabinDescription);
                }
            });
            // Optional
            data.adult || data.young ? infoObject.adults = [((data.adult ? data.adult : 0) + (data.young ? data.young : 0))] : null;
            data.infant ? infoObject.infants = [data.infant] : null;
            data.child ? infoObject.minors = [data.child] : null;
            data.senior ? infoObject.seniors = [data.senior] : null;
            data.originDestinations[1] ? infoObject.retDate = [dateFormatted(data.originDestinations[1].date)] : null;
            cabinTypes.length > 0 ? infoObject.serviceClass = cabinTypes : null;

            flightReview.push(infoObject);
            flightReview.push(flightId);
            flightReview.push(flightsCount);
            flightReview.push(currency.price.total);
            // Optional
            currency.price.currency ? flightReview.push(currency.price.currency) : null;

            function dateFormatted (date) {
                return date.replace(/-/g, '');
            }

            return flightReview;
        }

        function createBookingSliceSegments (segments = []) {
            return segments.map((segment) => ({
                id: segment.id,
                departure: segment.departure,
                arrival: segment.arrival,
                departureDateTime: segment.departureDateTime,
                arrivalDateTime: segment.arrivalDateTime,
                cabin: {
                    code: segment.cabin.bookingCode,
                    type: segment.cabin.bookingClass,
                    description: segment.cabin.cabinDescription,
                    fareFamily: segment.cabin.fareFamily,
                    mainClass: segment.cabin.rbd
                },
                flight: segment.flight,
                duration: segment.duration,
                waitingTime: segment.waitingTime
            })); // Implementation depends on the required structure
        }



        function generateBookingInfoModel (orderData) {
            let bookingInfo = { passengers: [], order: {}, fareFamilyConditions: localStorageService.get('fareFamilyConditionsInfo'), outwardSegments: [], returnSegments: [], airShuttleSegments: [] }, i = 0, j = 0, orderModel = {}, sliceModel = {}, segmentsInfo = {};

            for (i = 0; i < orderData.passengers.length; i++) {
                bookingInfo.passengers.push({
                    passengerType: orderData.passengers[i].passengerType,
                    personalInfo: {
                        name: orderData.passengers[i].personalInfo.firstName,
                        surname: orderData.passengers[i].personalInfo.firstSurname,
                        lastSurname: orderData.passengers[i].personalInfo.lastSurname,
                        birthDate: orderData.passengers[i].personalInfo.birthDate,
                        surnameSuffix: orderData.passengers[i].personalInfo.surnameSuffix
                    },
                    passengerId: orderData.passengers[i].passengerId,
                    seat: null
                });
            }

            orderModel = {
                orderId: orderData.order.orderId,
                bookingReferences: orderData.order.bookingReferences,
                orderItems: orderData.order.orderItems,
                price: orderData.order.price,
                bookingOffice: orderData.order.bookingOffice,
                slices: [],
                voucherDiscount: orderData.order && orderData.order.voucherDiscount ? orderData.order.voucherDiscount : null
            };

            if (orderData.order.discountsApplied && Object.keys(orderData.order.discountsApplied).length > 0
                && orderData.order.discountsApplied.discounts && orderData.order.discountsApplied.discounts.length > 0) {
                orderModel.discountsApplied = orderData.order.discountsApplied;
            }

            for (i = 0; i < orderData.order.slices.length; i++) {
                sliceModel = {
                    id: orderData.order.slices[i].sliceId,
                    departureDateTime: orderData.order.slices[i].departureDateTime,
                    arrivalDateTime: orderData.order.slices[i].arrivalDateTime,
                    duration: orderData.order.slices[i].duration,
                    stopsNumber: orderData.order.slices[i].stopsNumber,
                    price: orderData.order.slices[i].price,
                    detailedPrices: orderData.order.slices[i].detailedPrices,
                    overnight: orderData.order.slices[i].overnight,
                    segments: createBookingSliceSegments(orderData.order.slices[i].segments)
                };
                for (j = 0; j < orderData.order.slices[i].segments.length; j++) {
                    segmentsInfo = {
                        id: orderData.order.slices[i].segments[j].id,
                        departure: {
                            date: orderData.order.slices[i].segments[j].departureDateTime,
                            airport: {
                                code: orderData.order.slices[i].segments[j].departure.city.code,
                                description: orderData.order.slices[i].segments[j].departure.city.description,
                                country: orderData.order.slices[i].segments[j].departure.city.country
                            },
                            terminal: orderData.order.slices[i].segments[j].departure.terminal
                        },
                        arrival: {
                            date: orderData.order.slices[i].segments[j].arrivalDateTime,
                            airport: {
                                code: orderData.order.slices[i].segments[j].arrival.city.code,
                                description: orderData.order.slices[i].segments[j].arrival.city.description,
                                country: orderData.order.slices[i].segments[j].arrival.city.country
                            },
                            terminal: orderData.order.slices[i].segments[j].arrival.terminal
                        },
                        cabinClass: sliceModel.segments[j].cabin,
                        passengers: bookingInfo.passengers,
                        waitingTime: orderData.order.slices[i].segments[j].waitingTime
                    };
                    (i === 0 && orderData.order.slices[i]) ? bookingInfo.outwardSegments.push(segmentsInfo) : bookingInfo.returnSegments.push(segmentsInfo);
                }
                orderModel.slices.push(sliceModel);
            }
            bookingInfo.order = orderModel;
            return bookingInfo;
        }

        function genCalcAviosFlightReq (fareData) {
            try {
                const defaultDate = new Date().toISOString().split('T')[0];
                const discounts = fareData.offers[0].specialDiscountsApplied.filter(el => BookingAppConstants.AVAILABLE_AVIOS_DISCOUNTS.includes(el.type));
                return {
                    currency: { code: fareData.offers[0].price.currency },
                    passengers: fareData.passengers.map(passenger => ({
                        id: passenger.passengerId,
                        memberIdentifier: null,
                        flight: {
                            slices: fareData.offers[0].slices.map(slice => ({
                                id: slice.sliceId,
                                fare: slice.detailedPrices.find(el => el.passengerIds.includes(passenger.passengerId))?.fare || null,
                                totalFare: slice.priceSpecialDiscount?.total || slice.price?.fare || null
                            }))
                        }
                    })),
                    flight: {
                        discounts: discounts.map(discount => ({
                            type: discount.type,
                            percentDiscount: discount.percentDiscount,
                            totalDiscount: discount.totalDiscount
                        })) || [],
                        yq: fareData.offers[0].offerItems.flatMap(offer => offer.detailedTaxes.filter(tax => tax.code === 'YQ')).reduce((a, b) => a + b.amount, 0),
                        slices: fareData.offers[0].slices.map(slice => ({
                            id: slice.sliceId,
                            segments: slice.segments.map(seg => ({
                                id: seg.id,
                                commercialCode: BookingAppConstants.AVAILABLE_COMMERCIAL_CODES.includes(seg.cabin?.fareFamily) ? seg.cabin?.fareFamily : null,
                                operatingCarrier: {
                                    code: seg.flight.operationalCarrier.code
                                },
                                marketingCarrier: {
                                    code: seg.flight.marketingCarrier.code
                                },
                                schedule: {
                                    departureAirportCode: seg.departure.code,
                                    arrivalAirportCode: seg.arrival.code,
                                    departureDate: seg?.departureDateTime?.split(' ')[0] || defaultDate
                                },
                                bookingClass: {
                                    code: seg.cabin.rbd
                                },
                                bookingCabin: {
                                    code: seg.cabin.bookingCode
                                }
                            }))
                        }))
                    }
                };
            } catch (error) {
                return {};
            }
        }
        function TransCalcPointsData (data) {
            const trans_points = { Avios: 0, Elite: 0 };
            data?.totalMonetaryAmount?.forEach(item => {
                if (item.currency.code === 'AVIOS') {
                    trans_points.Avios = item.amount;
                } if (item.currency.code === 'TIER_POINTS') {
                    trans_points.Elite = item.amount;
                }
            });
            return trans_points;
        }
        function transformProfileRemindError (error) {
            const transError = { code: error.errorCode || 0, reason: 'DEFAULT_ERROR' };
            try {
                transError.reason = error.data.childError[0].code;
                return transError;
            } catch (error) {
                return transError;
            }
        }
        function transformPassengerInfoToSaveInLocalStorage (passengerInfoModel) {
            const objectToSave = new Map();
            if (passengerInfoModel) {
                objectToSave.set('iTravel', passengerInfoModel.iTravel ?? false);
                objectToSave.set('contactData', passengerInfoModel.contactData);
                objectToSave.set('isResident', passengerInfoModel.isResident);
                objectToSave.set('passengers', passengerInfoModel.passengerInfo);
            }

            return Object.fromEntries(objectToSave);
        }

        /**
         * This functions return a object with metasearch url generate from current url to add into datalayer_general.
         * Into this functions you can found two big methods. Each one modify or generate url, depend of flow (Metasearch or normal availability).
         * @returns {Object} object data with url info.
         */
        function generateMetaUrl () {
            let urlMetasearch;
            const flashOffer = BookingUtilService.getURLFirstParameterByName('flashOffer');
            const flashOfferId = BookingUtilService.getURLFirstParameterByName('flashOfferId');
            const isFlash = flashOffer && flashOfferId;
            const params_arr = getParamsInArray($window.location.search);

            if (localStorageService.get('searchFlightType') === BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH) {
                urlMetasearch = updateCurrentUrl(params_arr);
            } else {
                urlMetasearch = generateNewUrl(params_arr);
            }
            if(isFlash) {
                return { recoveryLink: $window.location.origin + urlMetasearch + '&REFERRAL_ID=' + BookingAppConstants.DATA_TO_GENERATE_URL_METAS.REFERRAL_ID + BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLASHD_QUADRIGAM};
            } else {
                return { recoveryLink: $window.location.origin + $window.location.pathname + urlMetasearch + '&ReferralId=' + BookingAppConstants.DATA_TO_GENERATE_URL_METAS.REFERRAL_ID };
            }

            function getParamsInArray (sourceURL) {
                let params_arr = [];
                const queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
                if (queryString !== '') {
                    params_arr = queryString.split('&');
                }
                return params_arr;
            }
            function updateCurrentUrl (params_arr) {
                let i, urlMeta = $window.location.search.split('?')[0], param;
                if (params_arr.length > 0) {
                    for (i = params_arr.length - 1; i >= 0; i -= 1) {
                        param = params_arr[i].split('=')[0];
                        if (BookingAppConstants.DATA_TO_GENERATE_URL_METAS.CLEAN_URL_PARAM_METASEARCH.indexOf(param) !== -1) {
                            params_arr.splice(i, 1);
                        }
                    }
                    urlMeta = urlMeta + '?' + params_arr.join('&') + getDiscounts();
                }
                return urlMeta;
            }
            function getPassengerInfo () {
                let i;
                const passengerParams = [], passengerInfo = { ADULT: 0, INFANT: 0, CHILD: 0, YOUTH: 0, SENIOR: 0, YOUNG_ADULT: 0 }, passengerFare = localStorageService.get('fareData').passengers;
                for (i = 0; i < passengerFare.length; i++) {
                    if (passengerFare[i].passengerType === BookingAppConstants.passengerTypes.adult) {
                        passengerInfo[BookingAppConstants.passengerTypes.adult] += 1;
                    } else if (passengerFare[i].passengerType === BookingAppConstants.passengerTypes.child) {
                        passengerInfo[BookingAppConstants.passengerTypes.child] += 1;
                    } else if (passengerFare[i].passengerType === BookingAppConstants.passengerTypes.infant) {
                        passengerInfo[BookingAppConstants.passengerTypes.infant] += 1;
                    } else if (passengerFare[i].passengerType === BookingAppConstants.passengerTypes.young) {
                        passengerInfo[BookingAppConstants.passengerTypes.young] += 1;
                    } else if (passengerFare[i].passengerType === BookingAppConstants.passengerTypes.senior) {
                        passengerInfo[BookingAppConstants.passengerTypes.senior] += 1;
                    } else if (passengerFare[i].passengerType === BookingAppConstants.passengerTypes.young_adult) {
                        passengerInfo[BookingAppConstants.passengerTypes.young_adult] += 1;
                    }
                }
                passengerParams.push('ADT=' + passengerInfo[BookingAppConstants.passengerTypes.adult]);
                passengerParams.push('CHD=' + passengerInfo[BookingAppConstants.passengerTypes.child]);
                passengerParams.push('INF=' + passengerInfo[BookingAppConstants.passengerTypes.infant]);
                if(!isFlash) {
                    passengerParams.push('YTH=' + passengerInfo[BookingAppConstants.passengerTypes.young]);
                    passengerParams.push('YCD=' + passengerInfo[BookingAppConstants.passengerTypes.senior]);
                    passengerParams.push('BNN=' + passengerInfo[BookingAppConstants.passengerTypes.young_adult]);
                }
                return '&' + passengerParams.join('&');
            }
            function generateNewUrl (params_arr) {
                const offerData = localStorageService.get('fareData').offers[0];
                if(isFlash) {
                    return getGeneralInfo() + getFlashOffersFlightInfo(offerData) + getPassengerInfo() + getDiscounts();
                } else {
                    return getGeneralInfo() + getPriceInfo(offerData) + getFlightInfo(offerData);
                }

                function getGeneralInfo () {
                    let i, param, param_path;
                    const pathname = [];
                    const generalParams = [];
                    for (i = 0; i < params_arr.length; i++) {
                        param = params_arr[i].split('=')[0];
                        if(isFlash) {
                            if (BookingAppConstants.DATA_TO_GENERATE_URL_METAS.KEEP_URL_PARAMS[0] === param) {
                                generalParams.push(params_arr[i].toUpperCase());
                                param_path = params_arr[i].substring(params_arr[i].indexOf('=') + 1);
                                pathname.push(param_path.toLowerCase());
                            } else if(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.KEEP_URL_PARAMS[1] === param) {
                                param_path = params_arr[i].substring(params_arr[i].indexOf('=') + 1);
                                pathname.push(param_path);
                            }
                        } else if (BookingAppConstants.DATA_TO_GENERATE_URL_METAS.KEEP_URL_PARAMS.indexOf(param) !== -1) {
                            generalParams.push(params_arr[i]);
                        }
                    }
                    if(isFlash) {
                        return '/'+ pathname[0] +'/'+ pathname[1] + BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLASH_PATHNAME +'?' + generalParams.join('&');
                    } else{
                        return '?' + generalParams.join('&') + getPassengerInfo() + getDiscounts();
                    }
                }
                function getPriceInfo (offerData) {
                    const priceParams = [];
                    if (offerData && offerData.price) {
                        priceParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.PRICE_URL_PARAMS.PRICE + '=' + offerData.price.total.toString());
                        priceParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.PRICE_URL_PARAMS.CURRENCY + '=' + offerData.price.currency.toString());
                    }
                    return '&' + priceParams.join('&');
                }
                function getFlightInfo (offerData) {
                    let i, z, indSegment = 1, indSlice = 1;
                    const flightParams = [];
                    flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.TYPE + '=' + (offerData.slices.length > 1 ? 'RoundTrip' : 'OneWay'));
                    for (i = 0; i < offerData.slices.length; i++) {
                        flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.SLICE + indSlice + '=' + generateSliceInfo(offerData.slices[i].segments, indSegment));
                        indSlice++;
                        for (z = 0; z < offerData.slices[i].segments.length; z++) {
                            flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.CABIN + indSegment + '=' + offerData.slices[i].segments[z].cabin.bookingClass);
                            flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FARE_CODE + indSegment + '=' + offerData.slices[i].segments[z].cabin.fareBasis);
                            flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.BOOKING_CODE + indSegment + '=' + offerData.slices[i].segments[z].cabin.rbd);
                            flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.CARRIER + indSegment + '=' + offerData.slices[i].segments[z].flight.marketingCarrier.code);
                            flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.DEPARTURE_DATE + indSegment + '=' + offerData.slices[i].segments[z].departureDateTime.split(' ')[0]);
                            flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.ORIGIN + indSegment + '=' + offerData.slices[i].segments[z].departure.code);
                            flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.DESTINATION + indSegment + '=' + offerData.slices[i].segments[z].arrival.code);
                            flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLIGHT_NUMBER + indSegment + '=' + offerData.slices[i].segments[z].flight.marketingFlightNumber);
                            indSegment++;
                        }
                    }
                    return '&' + flightParams.join('&');
                    function generateSliceInfo (segments, index) {
                        let i;
                        const sliceInfo = [];
                        for (i = 0; i < segments.length; i++) {
                            sliceInfo.push(index);
                            index++;
                        }
                        return sliceInfo.join(',');
                    }
                }
                function getFlashOffersFlightInfo (offerData) {
                    let z, indSegment = 1;
                    const flightParams = [];
                    flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLASH_OFFER_TYPE + '=' + BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLASH_TYPE_ACTIVE);
                    flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLASH_TYPE + '=' + (offerData.slices.length > 1 ?
                        BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLASH_TYPE_RT : BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLASH_TYPE_OW));
                    for (z = 0; z < offerData.slices[0].segments.length; z++) {
                        flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLASH_ORIGIN + '=' + offerData.slices[0].segments[z].departure.code);
                        flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLASH_DESTINATION + '=' + offerData.slices[0].segments[z].arrival.code);
                        indSegment++;
                    }
                    flightParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.FLIGHT_URL_PARAMS.FLASH_OFFER_ID + '=' + flashOfferId);
                    return '&' + flightParams.join('&');
                }
            }
            function getDiscounts () {
                let i, discountsURL = '';
                const discountParams = [], discountsFare = localStorageService.get('fareData').offers[0].specialDiscountsApplied;
                const urlParams = { resident: BookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.RESIDENT), largeFamilyType: BookingUtilService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.LARGE_FAMILY_TYPE) };
                if (discountsFare.length > 0) {
                    for (i = 0; i < discountsFare.length; i++) {
                        if (discountsFare[i].type === 'LGF') {
                            switch (discountsFare[i].discountType) {
                                    case 'GENERAL':
                                        !isFlash ? discountParams.push('familianumerosa=F1'):
                                            discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.LARGE_FAMILY+'=F1');
                                        break;
                                    case 'SPECIAL':
                                        !isFlash ? discountParams.push('familianumerosa=F2'):
                                            discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.LARGE_FAMILY+'=F2');
                                        break;
                                    default:
                                        !isFlash ? discountParams.push('familianumerosa='):
                                            discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.LARGE_FAMILY+'=');
                                        break;
                            }
                        } else if (discountsFare[i].type === 'RES') {
                            switch (discountsFare[i].discountType) {
                                    case 'BALEARES':
                                        !isFlash ? discountParams.push('residentCode=' + discountsFare[i].discountCode):
                                            discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.RESIDENT+'='+ discountsFare[i].discountCode);
                                        break;
                                    case 'CANARIAS':
                                        !isFlash ? discountParams.push('residentCode=' + discountsFare[i].discountCode):
                                            discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.RESIDENT+'='+ discountsFare[i].discountCode);
                                        break;
                                    case 'CEUTA':
                                        !isFlash ? discountParams.push('residentCode=' + discountsFare[i].discountCode):
                                            discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.RESIDENT+'='+ discountsFare[i].discountCode);
                                        break;
                                    case 'MELILLA':
                                        !isFlash ? discountParams.push('residentCode=' + discountsFare[i].discountCode):
                                            discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.RESIDENT+'='+ discountsFare[i].discountCode);
                                        break;
                                    default:
                                        !isFlash ? discountParams.push('residentCode='):
                                            discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.RESIDENT+'=');
                                        break;
                            }
                        }
                    }
                }
                if(!isFlash) {
                    urlParams.largeFamilyType === null ? discountParams.push('familianumerosa=') : angular.noop;
                } else urlParams.largeFamilyType === null ? discountParams.push(BookingAppConstants.DATA_TO_GENERATE_URL_METAS.DISCOUNTS_URL_PARAMS.LARGE_FAMILY + '=') : angular.noop;

                discountsURL = '&' + discountParams.join('&');
                return discountsURL;
            }
        }
        function transformContactData (data) {
            try {
                return {
                    contactEmail: data.email,
                    contactPhone: data.phone.number,
                    contactPrefix: data.phone.prefix
                };
            } catch (error) {
                return null;
            }
        }
        function generatePersonalDataReq (data) {
            try{
                const inputGender = data.charAt(0) + data.slice(1).toLowerCase();
                const personalDetails = {
                    gender : inputGender
                };
                return personalDetails;
            } catch (error) {
                return null;
            }
        }
        function generateTravPrefReq (data) {
            try {
                const travelPreferences = localStorageService.get('travelPreferences');
                travelPreferences.blind = data.specialVision;
                travelPreferences.deaf = data.specialHearing;
                travelPreferences.svan = data.specialGuideDog;
                travelPreferences.dpna = data.specialIntellDisability;
                travelPreferences.wheelChair = data.specialWheelchair ? BookingPassengerInfoConstants.WHEEL_CHAIR_CODES[data.specialWheelchairValue] : BookingPassengerInfoConstants.WHEEL_CHAIR_CODES.DEFAULT;
                return travelPreferences;
            } catch (error) {
                return null;
            }
        }

        function setCommunityCodePattern (code) {
            const communityResidence = BookingAppConstants.PASSENGER_FORM_RESIDENCE[code];

            if (code !== '070407') {
                return communityResidence.pattern;
            }

            const { firstPattern, secondPattern, thirdPattern, fourthPattern} = communityResidence;

            return { firstPattern, secondPattern, thirdPattern, fourthPattern };
        }


    }
})();
