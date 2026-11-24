(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .factory('PmtUtilsTransformers', PmtUtilsTransformers);

    PmtUtilsTransformers.$inject = ['$rootScope', 'PmtConstants', 'CurrencyService', '$sce', 'localStorageService', 'pmtSummaryGiftCardsService', 'PmtBreakDownUtilsService', '$filter', 'ContentPreprocessorService', '$templateCache'];
    function PmtUtilsTransformers ($rootScope, PmtConstants, CurrencyService, $sce, localStorageService, pmtSummaryGiftCardsService, PmtBreakDownUtilsService, $filter, ContentPreprocessorService, $templateCache) {
        const service = {
            getModelWithPaymentInfo: getModelWithPaymentInfo,
            getAviosPaypalInfo: getAviosPaypalInfo,
            generateModelRelatedContent: generateModelRelatedContent,
            generateDonationsInfo: generateDonationsInfo,
            generateBoardingCardInhibit: generateBoardingCardInhibit,
            customerCardfeesRequest: customerCardfeesRequest,
            customerCardsFeesResponse: customerCardsFeesResponse
        };
        return service;

        ////////////////

        /**
         * Creates the payments page model depending on payment methods rest service response
         * @returns {Object} the payments page model
         * @param countriesList
         * @param prefixList
         * @param statesList
         * @param paymentInfo
         * @param orderInfo
         * @param selectedPaymentData
         */
        function getModelWithPaymentInfo (countriesList, prefixList, statesList, paymentInfo, orderInfo, selectedPaymentData) {
            let countriesInfo = getCountriesInfo(countriesList), prefixesInfo = getPrefixesInfo(prefixList), transformedInfo,
                showRegularButton = paymentInfo && paymentInfo.paymentMethods && paymentInfo.paymentMethods[0].type !== 'PAYPAL';
            !paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS] ? selectedPaymentData ? selectedPaymentData.selectedDisscountTab = 1 : selectedPaymentData = {
                selectedTab: 0,
                selectedDisscountTab: 1,
                selectedAviosIndex: 0,
                selectedOnHoldIndex: 0
            } : selectedPaymentData = {
                selectedTab: 0,
                selectedDisscountTab: 0,
                selectedAviosIndex: 0,
                selectedOnHoldIndex: 0
            };
            transformedInfo = {
                generalData: {
                    countriesInfo: countriesInfo,
                    prefixesInfo: prefixesInfo,
                    statesList: statesList,
                    issuerCountry: localStorageService.get('selectedIssuerCountry') || countriesInfo.default,
                    loggedInfo: localStorageService.get('userLogged') === 'ONB' ? localStorageService.get('membershipData') : localStorageService.get('customerData')
                },
                paymentInfo: paymentInfo,
                contactData: {
                    email: localStorageService.get('contactEmail') ? localStorageService.get('contactEmail') : localStorageService.get('passengersContactData') ? localStorageService.get('passengersContactData')[0].email : null,
                    phone: localStorageService.get('contactPhone') ? localStorageService.get('contactPhone') : localStorageService.get('passengersContactData') ? localStorageService.get('passengersContactData')[0].phone : null,
                    ownerName: null,
                    surnames: null
                },
                showOptions: {
                    showNewCreditCardForm: false,
                    loadingPaymentData: false,
                    showRegularButton: showRegularButton,
                    showLoadingData: false
                },
                selectedData: selectedPaymentData,
                summaryInfo: getSummaryInfo(orderInfo, paymentInfo.currency, localStorageService.get('commercialInfo')),
                cO2MarkInfo: localStorageService.get('co2Info') || null
            };
            $rootScope.generalInfo = localStorageService.get('generalInfo');
            transformedInfo.paymentInfo.relatedContent = getPaymentRelatedContent(transformedInfo.paymentInfo.relatedContent.original);
            return transformedInfo;
            /**
             *
             * tranform Summary info
             * @param {*} orderInfo
             * @param {*} currency
             * @param {*} commercialInfo
             * @returns
             */
            function getSummaryInfo (orderInfo, currency, commercialInfo) {
                let passengersSpecialNeeds = localStorageService.get('passengersSpecialNeeds') || [], paymentsInfo = localStorageService.get('paymentsInfo'), summaryInfo = {};
                if (orderInfo.order) {
                    summaryInfo = {
                        trips: PmtBreakDownUtilsService.getTripsBreakdownInfo(orderInfo.order.slices, orderInfo.fareFamilyConditions),
                        passengers: PmtBreakDownUtilsService.getPaymentsPassengersBreakdownInfo(orderInfo, currency, passengersSpecialNeeds, commercialInfo),
                        orderFees: PmtBreakDownUtilsService.getOrderFees(orderInfo, currency)
                    };
                    if (localStorageService.get('bookingInfo') && localStorageService.get('bookingInfo').onHoldInformation) {
                        summaryInfo.paidDeposit = {
                            price: localStorageService.get('bookingInfo').onHoldInformation.paidDeposit.fare,
                            priceFormat: CurrencyService.formatPrice(currency, localStorageService.get('bookingInfo').onHoldInformation.paidDeposit.fare, true)
                        };
                        summaryInfo.paidDeposit.priceFormat = summaryInfo.paidDeposit.price === 0 ? summaryInfo.paidDeposit.priceFormat : '-' + summaryInfo.paidDeposit.priceFormat;
                    }
                }
                if (localStorageService.get('selectedPaymentData') && localStorageService.get('selectedAviosDisccount') && localStorageService.get('selectedAviosDisccount').active) {
                    summaryInfo.appliedDiscounts ? null : summaryInfo.appliedDiscounts = [];
                    summaryInfo.appliedDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS] = localStorageService.get('selectedAviosDisccount');
                }
                if (orderInfo.ancillairesInfo) {
                    summaryInfo.ancillaries = PmtBreakDownUtilsService.getAncillariesBreakdownInfo(orderInfo, currency);
                }
                if (paymentsInfo && paymentsInfo.paymentMethods && paymentsInfo.paymentMethods[0].onholdOptionId && paymentsInfo.onHoldInfo) {
                    summaryInfo.onHoldPayment = paymentsInfo.onHoldInfo.onHoldPayment;
                }
                if (localStorageService.get('bookingInfo') && localStorageService.get('bookingInfo').order && localStorageService.get('bookingInfo').order.voucherDisscount && !localStorageService.get('errorIssueService')  && localStorageService.get('bookingInfo').order.voucherDisscount.type!==PmtConstants.DISCOUNT_TYPES.PARTNER) {
                    summaryInfo.voucherDisscount = localStorageService.get('bookingInfo').order.voucherDisscount;
                    summaryInfo.voucherDisscount.priceFormat = CurrencyService.formatPrice(currency, localStorageService.get('bookingInfo').order.voucherDisscount.amount, true);
                }
                if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.GIFTCARDS) {
                    summaryInfo = generateSummaryGiftCard(localStorageService.get('summaryInfoGiftCard'), summaryInfo, currency);
                }
                if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS) {
                    summaryInfo = generateSummarySubscriptionModels(localStorageService.get('summaryInfoSubscriptionModels'), summaryInfo, currency);
                }
                return summaryInfo;
            }

            function generateSummarySubscriptionModels (subscriptionModelsConfigurationInfo, summaryInfo, currency) {
                if (subscriptionModelsConfigurationInfo.voucher.price.amountMarketing && subscriptionModelsConfigurationInfo.voucher.price.amountMarketing !== null) {
                    summaryInfo.voucherDisscount = {
                        amount: subscriptionModelsConfigurationInfo.voucher.price.amount,
                        percentage: subscriptionModelsConfigurationInfo.voucher.price.percentage,
                        price: CurrencyService.formatPrice(currency, subscriptionModelsConfigurationInfo.voucher.price.amount, true)
                    };


                    summaryInfo.voucherDisscount.type = $filter('translate')('PMT_SUSBSCRIPTION_MODELS_SUMMARY_PERCENTAGE_DISCOUNT', { percentage: subscriptionModelsConfigurationInfo.voucher.price.percentage });
                    summaryInfo.voucherDisscount.priceFormat = CurrencyService.formatPrice(currency, (subscriptionModelsConfigurationInfo.voucher.price.amount - subscriptionModelsConfigurationInfo.voucher.price.amountAccountable), true);
                }
                summaryInfo.subscriptionModels = {
                    title: 'SUBSCRIPTION_MODELS_CONFIGURATION_SUBSCRIPTION_MODELS_TEXT',
                    totalFormatted: CurrencyService.formatPrice(currency, subscriptionModelsConfigurationInfo.voucher.price.amount, true),
                    amount: {
                        title: $filter('translate')('PMT_SUBSCRIPTION_MODELS_SUMMARY_IMPORT')
                    }
                };
                summaryInfo.subscriptionModels.items = [
                    {
                        concepts: [
                            {
                                quantity: 'subscription',
                                description: $filter('translate')('PMT_SUBSCRIPTION_MODELS_SUMMARY_TEXT'),
                                price: subscriptionModelsConfigurationInfo.voucher.price.amount,
                                priceFormatted: CurrencyService.formatPrice(currency, subscriptionModelsConfigurationInfo.voucher.price.amount, true)
                            }
                        ]
                    }
                ];

                return summaryInfo;
            }

            function generateSummaryGiftCard (giftCardsConfigurationInfo, summaryInfo, currency) {
                const localStorageGiftCardInfo = localStorageService.get('giftCardsConfigurationInfo');
                const giftCardDescriptionText =  (localStorageGiftCardInfo.participationCheckboxGroup === 'true' || localStorageGiftCardInfo.flow === 'contribution') ? 'PMT_GIFT_CARD_GROUP_SUMMARY_TEXT' : 'PMT_GIFT_CARD_SUMMARY_TEXT';
                const title = (localStorageGiftCardInfo.participationCheckboxGroup === 'true' || localStorageGiftCardInfo.flow === 'contribution') ? 'GIFT_CARD_GROUP_GIFT_CARD' : 'GIFT_CARD_CONFIGURATION_GIFT_CARD_TEXT';
                const amountTitle = localStorageGiftCardInfo.flow === 'contribution' ? 'PMT_GIFT_CARD_SUMMARY_TITLE' : 'PMT_GIFT_CARD_SUMMARY_GIFT_CARD_IMPORT';
                if (giftCardsConfigurationInfo.voucher.price.amountMarketing && giftCardsConfigurationInfo.voucher.price.amountMarketing !== null) {
                    summaryInfo.voucherDisscount = {
                        amount: giftCardsConfigurationInfo.voucher.price.amount,
                        percentage: giftCardsConfigurationInfo.voucher.price.percentage,
                        price: CurrencyService.formatPrice(currency, giftCardsConfigurationInfo.voucher.price.amount, true)
                    };


                    summaryInfo.voucherDisscount.type = $filter('translate')('PMT_GIFT_CARD_SUMMARY_PERCENTAGE_DISCOUNT', { percentage: giftCardsConfigurationInfo.voucher.price.percentage });
                    summaryInfo.voucherDisscount.priceFormat = CurrencyService.formatPrice(currency, (giftCardsConfigurationInfo.voucher.price.amount - giftCardsConfigurationInfo.voucher.price.amountAccountable), true);
                }
                summaryInfo.giftCards = {
                    title: title,
                    totalFormatted: CurrencyService.formatPrice(currency, giftCardsConfigurationInfo.voucher.price.amount, true),
                    amount: {
                        title: $filter('translate')(amountTitle)
                    }
                };
                summaryInfo.giftCards.items = [
                    {
                        concepts: [
                            {
                                quantity: 'gift',
                                description: giftCardDescriptionText,
                                price: giftCardsConfigurationInfo.voucher.price.amount,
                                priceFormatted: CurrencyService.formatPrice(currency, giftCardsConfigurationInfo.voucher.price.amount, true),
                                giftCardName: localStorageGiftCardInfo.giftCardName
                            }
                        ]
                    }
                ];

                return summaryInfo;
            }


            /**
            *
            * Transform relatedcontent
            * @param {object} relatedContent
            * @returns {object} returnedRelatedContent
            */
            function getPaymentRelatedContent (relatedContent) {
                let returnedRelatedContent, termnsAndConditionGiftCards = localStorageService.get('termnsAndConditionGiftCards');
                if (relatedContent) {
                    returnedRelatedContent = { original: { termsAndConditions: relatedContent.termsAndConditions, totalPriceText: relatedContent.totalPriceText }, transformed: {} };
                    if (relatedContent.termsAndConditions) {
                        if (termnsAndConditionGiftCards && (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.GIFTCARDS || localStorageService.get('flowApp') === PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS)) {
                            relatedContent.termsAndConditions = ContentPreprocessorService.processContent(termnsAndConditionGiftCards, 'gdprGiftCardsInfo');
                            returnedRelatedContent.transformed.CONDITIONS = relatedContent.termsAndConditions;
                        } else {
                            returnedRelatedContent.transformed.CONDITIONS = $sce.trustAsHtml(relatedContent.termsAndConditions);
                        }
                    }
                    if (relatedContent.totalPriceText) {
                        $templateCache.put('totalPriceTextHtml', relatedContent.totalPriceText);
                        returnedRelatedContent.transformed.TOTAL_PRICE = localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS ? $filter('translate')('UPGRADING_BIDS_PAYMENT_INFO_TEXT') : $sce.trustAsHtml(relatedContent.totalPriceText);
                    }
                }
                return returnedRelatedContent;
            }
            /**
        *
        * From countriesList create countriesInfo first countri go to default rest for list property
        * @param {object} countriesList
        * @returns {object} countriesInfo
        */
            function getCountriesInfo (countriesList) {
                let countriesInfo = { list: angular.copy(countriesList), default: null }, foundCountry = false, i = 0,
                    issueCountryModel = localStorageService.get('selectedIssuerCountry') ? localStorageService.get('selectedIssuerCountry').code : localStorageService.get('pmtModelInfo') ? localStorageService.get('pmtModelInfo').issueCountry : null;
                if (countriesInfo.list && countriesInfo.list.length > 0) {
                    if (issueCountryModel) {
                        while (i < countriesInfo.list.length && !foundCountry) {
                            if (countriesInfo.list[i].code === issueCountryModel) {
                                foundCountry = true;
                                countriesInfo.default = countriesInfo.list[i];
                                countriesInfo.list.splice(i, 1);
                            }
                            i++;
                        }
                    } else {
                        countriesInfo.default = countriesInfo.list[0];
                        countriesInfo.list.shift();
                    }
                }
                return countriesInfo;
            }
            /**
             *
             * From prefixList create prefixesInfo first countri go to default rest for list property
             * @param {object} prefixList
             * @returns {object} prefixesInfo
             */
            function getPrefixesInfo (prefixList) {
                const prefixesInfo = { list: angular.copy(prefixList), default: null };
                if (prefixesInfo.list && prefixesInfo.list.length > 0) {
                    prefixesInfo.default = prefixesInfo.list[0];
                    prefixesInfo.list.shift();
                }
                return prefixesInfo;
            }
        }
        /**
       * create Info to pay with paypal and avios
       * @param {Object} selectedAvios info avios selcted
       */
        function getAviosPaypalInfo (selectedAvios) {
            const requestAvios = {
                type: 'AVIOS',
                aviosRequired: selectedAvios.aviosRequired
            };
            return requestAvios;
        }

        function customerCardfeesRequest (totalPrice, currency, market, tripInfo, customercards) {
            const priceObject = {price: totalPrice.toString().split('.').join(''), decimals: totalPrice.toString().split('.').length > 1 && totalPrice.toString().split('.')[1].length ?  totalPrice.toString().split('.')[1].length : 0}, request = {
                paymentPrice: {
                    price: priceObject.price,
                    currency: currency.code + priceObject.decimals
                },
                channel: 'NEW_WEB',
                client: 'IB',
                market: market
            };
            if(tripInfo && tripInfo[0] && tripInfo[0].segments[0]) {
                const getDepartureCityCode = () => tripInfo[0].segments[0].departure.city.code;
                const getArrivalCityCode  = () => tripInfo[indexArrivalTrip]?.segments[indexArrivalSegment]?.arrival?.city?.code;
                const getLastSegmentIndex = (tripIndex) => tripInfo[tripIndex].segments.length - 1;
                let indexArrivalTrip = tripInfo.length - 1;
                let indexArrivalSegment = getLastSegmentIndex(indexArrivalTrip);
                if(getDepartureCityCode() === getArrivalCityCode()) {
                    if(tripInfo.length === 2) { // return trip
                        indexArrivalTrip = 0;
                        indexArrivalSegment = Object(getLastSegmentIndex(indexArrivalTrip));
                    }
                    if(tripInfo.length > 2) { // multiple trips
                        const arrivals = [];
                        const originDeparture = getDepartureCityCode();
                        tripInfo.forEach((trip, indexTrip) => {
                            trip.segments.forEach((segment, indexSegment) => {
                                const arrival = segment.arrival.city.code;
                                if(!arrivals.includes(arrival) && arrival !== originDeparture) {
                                    arrivals.push(segment.arrival.city.code);
                                    indexArrivalTrip = indexTrip;
                                    indexArrivalSegment = indexSegment;
                                }
						  });
                        });
                    }
                }
                angular.extend(request, {
                    departureLocation: {
                        countryCode: tripInfo[0]?.segments[0]?.departure?.city?.country?.code,
                        cityCode: getDepartureCityCode(),
                        airportCode: tripInfo[0]?.segments[0]?.departure?.code
                    },
                    arrivalLocation: {
                        countryCode: tripInfo[indexArrivalTrip]?.segments[indexArrivalSegment]?.arrival?.city?.country?.code,
                        cityCode: getArrivalCityCode(),
                        airportCode: tripInfo[indexArrivalTrip]?.segments[indexArrivalSegment]?.arrival?.code
                    }
                });
            }
            if (customercards.length > 1) {
                request.paymentPrice.fare = totalPrice;
                request.paymentPrice.currency = currency.code;
                delete request.paymentPrice.price;
                request.bins = [];
                for (let i = 0; i < customercards.length - 1; i++) {
                    customercards[i].creditCardInfo.forEach(creditCardInfo => {
                        if(creditCardInfo.type === 'IBERIAPAY') {
                            request.bins.push(creditCardInfo.mask);
                        }
                    });
                }
            } else {
                localStorageService.set('ibpayCcFeeRequest', request);
            }
            return request;
        }

        function customerCardsFeesResponse (paymentData, ccFeeBinPrices) {
            let response;
            if(paymentData.paymentInfo.customerCreditCards.IBERIA_PAY) {
                response = paymentData.paymentInfo.customerCreditCards.IBERIA_PAY.map(customerCreditCards => {
                    for (let i = 0; i < ccFeeBinPrices.length; i++) {
                        if(customerCreditCards.creditCardInfo) {
                            for (let j = 0; j < customerCreditCards.creditCardInfo.length; j++) {
                                if (customerCreditCards.creditCardInfo[j].type === 'IBERIAPAY' && ccFeeBinPrices[i].bin === customerCreditCards.creditCardInfo[j].mask) {
                                    customerCreditCards.totalFee = ccFeeBinPrices[i].value;
                                    customerCreditCards.fee = CurrencyService.formatPrice(paymentData.paymentInfo.currency, ccFeeBinPrices[i].value, true);
                                    customerCreditCards.parsedFee = customerCreditCards.fee;
                                    customerCreditCards.totalToPay = paymentData.paymentInfo.price.totalPrice + ccFeeBinPrices[i].value;
                                }
                            }
                        }
                    }
                    return customerCreditCards;
                });
            } else if(paymentData.paymentInfo.customerCreditCards.ONHOLD_IBERIA_PAY) {
                response = paymentData.paymentInfo.customerCreditCards.ONHOLD_IBERIA_PAY.map(customerCreditCards => {
                    for (let i = 0; i < ccFeeBinPrices.length; i++) {
                        if(customerCreditCards.creditCardInfo) {
                            for (let j = 0; j < customerCreditCards.creditCardInfo.length; j++) {
                                if (customerCreditCards.creditCardInfo[j].type === 'IBERIAPAY' && ccFeeBinPrices[i].bin === customerCreditCards.creditCardInfo[j].mask) {
                                    customerCreditCards.totalFee = ccFeeBinPrices[i].value;
                                    customerCreditCards.fee = CurrencyService.formatPrice(paymentData.paymentInfo.currency, ccFeeBinPrices[i].value, true);
                                    customerCreditCards.parsedFee = customerCreditCards.fee;
                                    customerCreditCards.totalToPay = paymentData.paymentInfo.price.totalPrice + ccFeeBinPrices[i].value;
                                }
                            }
                        }
                    }
                    return customerCreditCards;
                });
            }
            return response;
        }
        /**
         * Generate Object whit all information about text term and conditions and total price to show in page view
         * @param {*} termsAndConditions
         * @param {*} totalPriceText
         */
        function generateModelRelatedContent (termsAndConditions, totalPriceText) {
            const returnedRelatedContent = { original: { termsAndConditions: termsAndConditions, totalPriceText: totalPriceText }, transformed: {} };
            if (termsAndConditions) {
                returnedRelatedContent.transformed.CONDITIONS = $sce.trustAsHtml(termsAndConditions);
            }
            if (totalPriceText) {
                returnedRelatedContent.transformed.TOTAL_PRICE = $sce.trustAsHtml(totalPriceText);
            }
            return returnedRelatedContent;
        }
        function generateDonationsInfo (donationsInfo, currencyData, paymentMethod) {
            let transformedAvailableDonations, donationIndex, optionIndex, auxDonationsQuantities = [];
            if (donationsInfo) {
                transformedAvailableDonations = [];
                for (donationIndex = 0; donationIndex < donationsInfo.length; donationIndex++) {
                    auxDonationsQuantities = [];
                    for (optionIndex = 0; optionIndex < donationsInfo[donationIndex].quantity.length; optionIndex++) {
                        auxDonationsQuantities.push({
                            selected: paymentMethod.selectedDonation ? paymentMethod.selectedDonation.option.option === donationsInfo[donationIndex].quantity[optionIndex] : optionIndex === 0,
                            option: donationsInfo[donationIndex].quantity[optionIndex],
                            formatedPrice: CurrencyService.formatPrice(currencyData, donationsInfo[donationIndex].quantity[optionIndex], false)
                        });
                    }
                    transformedAvailableDonations.push(angular.extend(donationsInfo[donationIndex], { options: auxDonationsQuantities, available: checkAvailableDonation(donationsInfo[donationIndex].possibilities, paymentMethod) }));
                }
            }
            function checkAvailableDonation (donationAvailablePaymentMethods, paymentMethod) {
                let donationAvailablePaymentMethodsIndex = 0, foundedDonationPaymentMethod = false;
                while (!foundedDonationPaymentMethod && donationAvailablePaymentMethodsIndex < donationAvailablePaymentMethods.length) {
                    if (donationAvailablePaymentMethods[donationAvailablePaymentMethodsIndex].type === paymentMethod.type) {
                        foundedDonationPaymentMethod = true;
                    }
                    donationAvailablePaymentMethodsIndex++;
                }
                return foundedDonationPaymentMethod;
            }
            return transformedAvailableDonations;

        }

        function generateBoardingCardInhibit (segmentInhibit) {
            const dataBC = {
                id: '',
                companyType: '',
                typeOfTransport: '',
                estimatedFlightTime: '',
                maxWeightBaggage: {
                    amount: 0,
                    measurementType: ''
                },
                departure: {
                    date: '',
                    terminal: '',
                    airport: {
                        code: '',
                        description: '',
                        country: ''
                    }
                },
                arrival: {
                    date: '',
                    terminal: '',
                    airport: {
                        code: '',
                        description: '',
                        country: ''
                    }
                },
                flightNumber: {
                    company: {
                        code: '',
                        description: ''
                    },
                    number: '',
                    operatedBy: null
                },
                passengers: [],
                seatList: '',
                cabinClass: '',
                cabinClassCode: '',
                iconURL: '',
                companyURL: '',
                transformedDepartureDate: {
                    weekDay: '',
                    monthDay: 0,
                    monthNumber: 0,
                    month: '',
                    year: 0
                },
                transformedArrivalDate: {
                    weekDay: '',
                    monthDay: 0,
                    monthNumber: 0,
                    month: '',
                    year: 0
                }
            };

            const passengersList = [];
            let modelPass = {};
            const arrId = [];
            let existId = false;

            dataBC.id = segmentInhibit.id;
            dataBC.typeOfTransport = segmentInhibit.type;

            dataBC.departure.date = segmentInhibit.departure.originalDate;
            dataBC.transformedDepartureDate = segmentInhibit.departure.date;
            dataBC.departure.terminal = segmentInhibit.departure.terminal;
            dataBC.departure.airport.code = segmentInhibit.departure.airportCode;
            dataBC.departure.airport.description = segmentInhibit.departure.airportDescription;


            dataBC.arrival.date = segmentInhibit.arrival.originalDate;
            dataBC.transformedArrivalDate = segmentInhibit.arrival.date;
            dataBC.arrival.terminal = segmentInhibit.arrival.terminal;
            dataBC.arrival.airport.code = segmentInhibit.arrival.airportCode;
            dataBC.arrival.airport.description = segmentInhibit.arrival.airportDescription;


            //dataBC.flightNumber.company.code = segmentInhibit.flightCode;
            dataBC.flightNumber.number = segmentInhibit.flightNumber;
            dataBC.flightNumber.operatedBy = segmentInhibit.operatedBy;

            dataBC.seatList = segmentInhibit.cabinClass.allSeats;
            dataBC.cabinClassCode = segmentInhibit.cabinClass.code;
            dataBC.cabinClass = segmentInhibit.cabinClass.type;
            dataBC.iconURL = segmentInhibit.cabinClass.type;
            dataBC.companyURL = segmentInhibit.airlineLogo;

            for (let i = 0; i < segmentInhibit?.passengers?.length; i++) {
                const passenger = segmentInhibit.passengers[i];
                modelPass = modelPassenger();
                existId = false;
                for (let j = 0; j < arrId.length; j++) {
                    const id = arrId[j];
                    if (id == passenger.id) {
                        existId = true;
                    }
                }

                if(!existId) {
                    arrId.push(passenger.id);

                    modelPass.id = passenger.id;
                    modelPass.name = passenger.status.name;
                    modelPass.surname = passenger.status.surname;

                    modelPass.cabinClass.code = segmentInhibit.cabinClass.code;
                    modelPass.cabinClass.type = segmentInhibit.cabinClass.type;
                    modelPass.cabinClass.description = segmentInhibit.cabinClass.description;

                    modelPass.seat = passenger.accepted.seat;

                    passengersList.push(modelPass);
                }
            }
            dataBC.passengers = passengersList;

            return dataBC;

            function modelPassenger () {
                const modelPassenger = {
                    id: '',
                    name: '',
                    surname: '',
                    cabinClass: {
                        code: '',
                        type: '',
                        description: ''
                    },
                    seat: {
                        row: '',
                        column: ''
                    },
                    fastTrack: false,
                    vip: false,
                    standby: false,
                    type: '',
                    contentType: ''
                };

                return angular.copy(modelPassenger);
            }

        }

    }
})();
