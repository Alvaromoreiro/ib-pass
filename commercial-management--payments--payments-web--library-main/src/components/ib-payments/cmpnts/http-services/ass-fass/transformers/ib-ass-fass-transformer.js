(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtAssFassTransformer', PmtAssFassTransformer);

    PmtAssFassTransformer.$inject = ['localStorageService', 'PmtBreakDownUtilsService', 'CurrencyService', 'PmtConstants', 'PmtUtilsService'];
    function PmtAssFassTransformer(localStorageService, PmtBreakDownUtilsService, CurrencyService, PmtConstants, PmtUtilsService) {
        var service = {
            transformInfoPayments: transformInfoPayments,
            createPaymentsRequest: createPaymentsRequest,
            createCreditCardInfo: createCreditCardInfo,
            createCustomerCreditCardSaveRequest: createCustomerCreditCardSaveRequest,
            checkSaveCustomerCardNeeded: checkSaveCustomerCardNeeded,
            updatePaymentMethods: updatePaymentMethods,
            transformBreakdownInfo: transformBreakdownInfo,
            checkIfTextWarningDescription: checkIfTextWarningDescription
        };
        return service;

        ////////////////

        /**
         * 
         * @param {*} paymentMethodsData 
         * @param {*} createOrderInfoResponse 
         * @param {*} creditCards 
         * @param {*} co2MarkData 
         * @param {*} countriesList 
         * @param {*} statesList 
         * @param {*} selectedCountry 
         * @param {*} customerCreditCards 
         */
        function transformInfoPayments(paymentMethodsData, creditCards, countriesList, statesList, selectedCountry, customerCreditCards) {
            var transformedInfoPayments = {
                'paymentMethods': [],
                'somethingToPay': true,
                'currency': CurrencyService.getCurrencyObject(paymentMethodsData.currency),
                'currencyCode': paymentMethodsData.currency.code,
                'creditCards': creditCards,
                'countriesList': countriesList.slice(),
                'statesList': statesList,
                'paymentInfo': {}
            };
            var i, j, defaultCountry, passengersContactData;
            passengersContactData = localStorageService.get('passengersContactData');
            //Initialize first element and remove it from countries array
            if (transformedInfoPayments.countriesList && transformedInfoPayments.countriesList.length > 0) {
                defaultCountry = selectedCountry || transformedInfoPayments.countriesList[0];
                transformedInfoPayments.countriesList.shift();
            }

            if (localStorageService.get('selectedLoggedCard')) {
                transformedInfoPayments['selectedLoggedCard'] = localStorageService.get('selectedLoggedCard');
            }

            transformedInfoPayments.paymentInfo = localStorageService.get('paymentInfo') || {
                'email': passengersContactData && passengersContactData.length > 0 && passengersContactData[0].email !== '' ? passengersContactData[0].email : '',
                'issuerCountry': localStorageService.get('selectedIssuerCountry') || defaultCountry,
                'selectedTab': 0,
                'selectedDisscountTab': 0,
                'showNewCreditCardForm': !localStorageService.get('userLogged') || (transformedInfoPayments.selectedLoggedCard && transformedInfoPayments.selectedLoggedCard.customerInfo.cardTypeId === 'newCard')
            }

            updatePaymentMethods(transformedInfoPayments, paymentMethodsData, creditCards, {}, customerCreditCards);

            return transformedInfoPayments;

        };



        /**
         * 
         * @param {*} customerCreditCardsData 
         * @param {*} paymentsCardsData 
         * @param {*} paymentMethodsData 
         */
        function createCustomerCreditCards(customerCreditCardsData, paymentsCardsData, paymentMethodsData) {
            var customerCreditCards = [], customerInfo = {}, paymentInfo = {};
            var customerCardsIndex, paymentCardIndex, foundedCard;
            for (customerCardsIndex = 0; customerCardsIndex < customerCreditCardsData.length; customerCardsIndex++) {
                foundedCard = false, paymentCardIndex = 0;
                while (!foundedCard && paymentCardIndex < paymentsCardsData.length) {
                    if (customerCreditCardsData[customerCardsIndex].cardTypeId === paymentsCardsData[paymentCardIndex].cardTypeId) {
                        customerInfo = customerCreditCardsData[customerCardsIndex];
                        paymentInfo = paymentsCardsData[paymentCardIndex];

                        if (customerCreditCardsData[customerCardsIndex].expiryDate) {
                            if (PmtUtilsService.checkCreditCardExpiryDate(customerCreditCardsData[customerCardsIndex].expiryDate)) {
                                customerInfo['expiryDateNeedsUpdate'] = true;
                                customerInfo.expiryDate = null;
                                customerInfo['saveCustomerCard'] = true;
                            }
                        }

                        if (!customerCreditCardsData[customerCardsIndex].surnameOnCard || !customerCreditCardsData[customerCardsIndex].description) {
                            customerInfo['saveCustomerCard'] = true;
                        }
                        customerInfo['requiredFiles'] = checkRequiredFields(customerCreditCardsData[customerCardsIndex], paymentMethodsData.paymentMethods);

                        customerCreditCards.push({
                            'customerInfo': customerInfo,
                            'paymentInfo': paymentInfo
                        })
                        foundedCard = true;
                    }
                    paymentCardIndex++;
                }
            }
            customerCreditCards.unshift({
                'customerInfo': { 'description': 'CKIANCPURC_USE_NEW_CARD_TITLE', 'cardTypeId': 'newCard' },
                'paymentInfo': { 'cardTypeId': 'newCard' }
            });
            return customerCreditCards;
        }

        /**
         * Check if paymentMethods required files and add to customer cards
         * @param {Object} card Credit card
         * @param {Object} paymentMethods Payment methods for check required fields
         */
        function checkRequiredFields(card, paymentMethods) {
            var i = 0, haveCard = false, indexCard, options = { 'showZipCode': false, 'showState': false };

            while (!haveCard && i < paymentMethods.length) {
                if (paymentMethods[i].type === PmtConstants.PAYMENT_ORDER_ITEMS_TYPES.CREDIT_CARD) {
                    haveCard = true;
                    indexCard = i;
                }
                i++;
            }

            if (haveCard) {
                if (paymentMethods[indexCard].requiredFields.indexOf('billTo_postalCode') !== -1) {
                    if (card.profileAddressInfo) {
                        if (!card.profileAddressInfo.zipCode || card.profileAddressInfo.zipCode === '') {
                            options.showZipCode = true;
                        }
                    } else {
                        options.showZipCode = true;
                    }
                }
                if (paymentMethods[indexCard].requiredFields.indexOf('billTo_State') !== -1) {
                    if (card.profileAddressInfo) {
                        if (!card.profileAddressInfo.state) {
                            options.showState = true;
                        }
                    } else {
                        options.showState = true;
                    }
                }
            }

            return options;
        }

        /**
         * 
         * @param {*} paymentMethodsData 
         * @param {*} currencyData 
         * @param {*} creditCards 
         */
        function createCreditCardInfo(paymentMethodsData, currencyData, creditCards) {
            var j;
            paymentMethodsData['requiredFields'] = paymentMethodsData.requiredFields ? paymentMethodsData.requiredFields : [];
            if (localStorageService.get('paymentPersonalData')) {
                paymentMethodsData['ownerName'] = localStorageService.get('paymentPersonalData').ownerName;
                paymentMethodsData['surnames'] = localStorageService.get('paymentPersonalData').surnames;
                paymentMethodsData['surnames'] = localStorageService.get('paymentPersonalData').surnames;
            }
            paymentMethodsData['email'] = localStorageService.get('contactEmail');
            paymentMethodsData['somethingToPay'] = true;
            paymentMethodsData['totalPriceInfo'] = CurrencyService.formatPrice(currencyData, paymentMethodsData.total, true);
            for (j = 0; j < paymentMethodsData.types.length; j++) {
                paymentMethodsData.types[j]['parsedFee'] = CurrencyService.formatPrice(currencyData, paymentMethodsData.types[j].totalFee, true);
                paymentMethodsData.types[j]['iconUrl'] = PmtUtilsService.getCreditCardIcon(paymentMethodsData.types[j].cardTypeId, creditCards);
            }
            return paymentMethodsData;
        }

        /**
         * Craete payment request for send to service
         * @param {Object} paymentData Data for payment
         * @param {Object} paymentInfo Info for payment
          * @param {Object} selectedLoggedCard Info of selected card logged
         */

        function createPaymentsRequest(paymentData, paymentInfo, selectedLoggedCard) {
            var paymentRequest = {
                'flowId': localStorageService.get('bookingInfo').checkinId,
                'paymentId': localStorageService.get('paymentMethods').paymentId,
                'paymentMethod': {}
            };
            if (paymentData.type === PmtConstants.PAYMENT_TYPES.CREDIT_CARD) {
                if (paymentInfo.selectedCard) {
                    paymentRequest.paymentMethod = {
                        'type': paymentData.type,
                        'cardTypeId': paymentInfo.selectedCard.cardTypeId,
                        'profileCardId': null,
                        'cardNumber': paymentInfo.creditCardNum,
                        'cvv': paymentInfo.cvv,
                        'expiration': (paymentInfo.month + paymentInfo.year) + '',
                        'payer': {
                            'personalInfo': {
                                'name': paymentInfo.ownerName,
                                'surname': paymentInfo.surnames
                            },
                            'contactInfo': {
                                'email': paymentInfo.email
                            }, 'address': {
                                'country': paymentInfo.issuerCountry.code
                            }
                        }
                    }
                    if (paymentInfo.zipCode) {
                        paymentRequest.paymentMethod.payer.address['zip'] = paymentInfo.zipCode;
                    }
                    if (paymentInfo.state && paymentInfo.state.code) {
                        paymentRequest.paymentMethod.payer.address['state'] = paymentInfo.state.code;
                    }
                    if (paymentInfo.state && paymentInfo.state.description) {
                        paymentRequest.paymentMethod.payer.address['city'] = paymentInfo.state.description;
                    }
                } else {
                    paymentRequest.paymentMethod = {
                        'type': paymentData.type,
                        'cardTypeId': selectedLoggedCard.customerInfo.cardTypeId,
                        'profileCardId': selectedLoggedCard.customerInfo.profileCardId,
                        'cardNumber': selectedLoggedCard.customerInfo.cardNumber,
                        'cvv': selectedLoggedCard.paymentInfo.newCvv,
                        'expiration': selectedLoggedCard.customerInfo.expiryDate || (selectedLoggedCard.customerInfo.month + selectedLoggedCard.customerInfo.year) + '',
                        'payer': {
                            'personalInfo': {
                                'name': selectedLoggedCard.customerInfo.nameOnCard,
                                'surname': selectedLoggedCard.customerInfo.surnameOnCard || selectedLoggedCard.customerInfo.newSurnameOnCard
                            },
                            'contactInfo': {
                                'email': paymentInfo.email
                            }, 'address': {
                            }
                        }
                    }
                    if (selectedLoggedCard.customerInfo.profileAddressInfo && selectedLoggedCard.customerInfo.profileAddressInfo.country && selectedLoggedCard.customerInfo.profileAddressInfo.country.code) {
                        paymentRequest.paymentMethod.payer.address['country'] = selectedLoggedCard.customerInfo.profileAddressInfo.country.code;
                    } else {
                        paymentRequest.paymentMethod.payer.address['country'] = paymentInfo.issuerCountry.code;
                    }
                    if (selectedLoggedCard.customerInfo.profileAddressInfo.zipCode) {
                        paymentRequest.paymentMethod.payer.address['zip'] = selectedLoggedCard.customerInfo.profileAddressInfo.zipCode;
                    }
                    if (selectedLoggedCard.customerInfo.profileAddressInfo.state && selectedLoggedCard.customerInfo.profileAddressInfo.state.code) {
                        paymentRequest.paymentMethod.payer.address['state'] = selectedLoggedCard.customerInfo.profileAddressInfo.state.code;
                    }
                    if (selectedLoggedCard.customerInfo.profileAddressInfo.state && selectedLoggedCard.customerInfo.profileAddressInfo.state.description) {
                        paymentRequest.paymentMethod.payer.address['city'] = selectedLoggedCard.customerInfo.profileAddressInfo.state.description;
                    }
                }
            }
            return paymentRequest
        };



        /**
         * Create structure for save card in localStorage
         * @param {Object} paymentInfo Information of card for make payment
         * @param {Object} selectedLoggedCard SelectedCard card in ui-select
         */
        function createCustomerCreditCardSaveRequest(paymentInfo, selectedLoggedCard) {
            var creditCardRequest, creditCardData;

            if (!selectedLoggedCard || selectedLoggedCard && selectedLoggedCard.customerInfo.cardTypeId === 'newCard') {
                creditCardData = paymentInfo;
            } else {
                creditCardData = selectedLoggedCard.customerInfo;
            }

            creditCardRequest = {
                'cardTypeId': creditCardData.cardTypeId || creditCardData.selectedCard.cardTypeId,
                'description': creditCardData.description || creditCardData.newDescription || creditCardData.cardDescription,
                'cardNumber': creditCardData.cardNumber || creditCardData.creditCardNum,
                'expiryDate': creditCardData.expiryDate || (creditCardData.month + creditCardData.year) + '',
                'nameOnCard': creditCardData.nameOnCard || creditCardData.ownerName,
                'surnameOnCard': creditCardData.surnameOnCard || creditCardData.newSurnameOnCard || creditCardData.surnames,
                'profileAddressInfo': creditCardData.profileAddressInfo || { 'zipCode': creditCardData.zipCode, 'state': creditCardData.issuerCountry.code }
            }
            if (creditCardRequest.profileAddressInfo && creditCardRequest.profileAddressInfo.country) {
                creditCardRequest.profileAddressInfo.country = creditCardRequest.profileAddressInfo.country.code;
            }
            if (creditCardRequest.profileAddressInfo && creditCardRequest.profileAddressInfo.state) {
                creditCardRequest.profileAddressInfo.state = creditCardRequest.profileAddressInfo.state.code;
            }
            return creditCardRequest;
        }

        /**
         * 
         * @param {*} paymentData 
         * @param {*} paymentInfo 
         * @param {*} selectedLoggedCard 
         */
        function checkSaveCustomerCardNeeded(paymentData, paymentInfo, selectedLoggedCard) {
            var needCardUpdate = false;
            if (paymentInfo.saveCustomerCard) {
                needCardUpdate = true;
            }
            return needCardUpdate;
        }

        /**
         * 
         * @param {*} transformedInfoPayments 
         * @param {*} paymentMethodsData 
         * @param {*} customerCreditCards 
         */
        function updateCustomerCreditCards(transformedInfoPayments, paymentMethodsData, customerCreditCards) {
            if (localStorageService.get('userLogged')) {
                transformedInfoPayments['loggedInfo'] = localStorageService.get('customerData');
                if (localStorageService.get('creditCardTypes')) {
                    transformedInfoPayments.loggedInfo['customerCreditCards'] = createCustomerCreditCards(customerCreditCards, localStorageService.get('creditCardTypes'), paymentMethodsData);
                }
            }
        }


        /**
         * Create/Update paymentMethods 
         * @param {Object} transformedInfoPayments 
         * @param {Object} paymentMethodsData Structure with info of payments of service
         * @param {Object} creditCards List of credit cards recieved of serivce
         * @param {Object} appliedDiscounts Disccounts apply for user and 
         * @param {Object} customerCreditCards List of customer credit cards saved in account and returned of service
         */
        function updatePaymentMethods(transformedInfoPayments, paymentMethodsData, creditCards, appliedDiscounts, customerCreditCards) {
            var i, j, appliedDiscounts = appliedDiscounts || {};
            if (!transformedInfoPayments) {
                transformedInfoPayments = {
                    'paymentMethods': [],
                    'availableDiscounts': {},
                    'somethingToPay': true,
                    'paymentInfo': localStorageService.get('paymentInfo') || {},
                    'currency': CurrencyService.getCurrencyObject(paymentMethodsData.currency),
                    'summaryInfo': {}
                };
            }


            for (i = 0; i < paymentMethodsData.paymentMethods.length; i++) {
                if (paymentMethodsData.paymentMethods[i].appliedDiscounts) {
                    for (j = 0; j < paymentMethodsData.paymentMethods[i].appliedDiscounts.length; j++) {
                        appliedDiscounts[paymentMethodsData.paymentMethods[i].appliedDiscounts[j].type] = angular.copy(paymentMethodsData.paymentMethods[i].appliedDiscounts[j]);
                        appliedDiscounts[paymentMethodsData.paymentMethods[i].appliedDiscounts[j].type].discount = CurrencyService.formatPrice(transformedInfoPayments.currency, appliedDiscounts[paymentMethodsData.paymentMethods[i].appliedDiscounts[j].type].discount, true);
                        if (localStorageService.get('paymentsAvailableDiscounts')[paymentMethodsData.paymentMethods[i].appliedDiscounts[j].type]) {
                            appliedDiscounts[paymentMethodsData.paymentMethods[i].appliedDiscounts[j].type]['remainingAmount'] = localStorageService.get('paymentsAvailableDiscounts')[paymentMethodsData.paymentMethods[i].appliedDiscounts[j].type].voucherDiscount.remainingAmount;
                        }
                    }
                }
                switch (paymentMethodsData.paymentMethods[i].type) {
                    case PmtConstants.PAYMENT_TYPES.CREDIT_CARD:
                        transformedInfoPayments.paymentMethods.push(createCreditCardInfo(paymentMethodsData.paymentMethods[i], transformedInfoPayments.currency, creditCards));
                        localStorageService.set('creditCardTypes', paymentMethodsData.paymentMethods[i].types);
                        break;
                };
                paymentMethodsData.paymentMethods[i].paymentId = paymentMethodsData.paymentId;
            }

            updateCustomerCreditCards(transformedInfoPayments, paymentMethodsData, customerCreditCards);

            transformedInfoPayments.paymentInfo.appliedDiscounts = appliedDiscounts;
            return transformedInfoPayments;
        }

        function transformBreakdownInfo(breakDownInfo, bookingInfo) {
            var i, k, passengersIndex, cachedData, trip, baggageTrip, bookingAncillariesSegment, pushTrip, maxSegments;
            var paymentsInfo = {
                'trips': [],
                'extraPaymentsInfo': {},
                'currency': null,
                'total': 0
            };
            cachedData = PmtBreakDownUtilsService.getCachedSelectedInfo(bookingInfo);
            paymentsInfo.currency = CurrencyService.getCurrencyObject(breakDownInfo.currencies[0]);





            for (i = 0; i < breakDownInfo.pendingPaymentItems.length; i++) {
                switch (breakDownInfo.ancillaries[i].type) {
                    case PmtConstants.ANCILLARIES_TYPES.INSURANCE:
                        paymentsInfo.extraPaymentsInfo[breakDownInfo.ancillaries[i].type] = getInsuranceAncillaries(breakDownInfo.ancillaries[i]);
                        break;
                    case PmtConstants.ANCILLARIES_TYPES.BAGGAGE:

                        break;

                    case PmtConstants.ANCILLARIES_TYPES.SEAT:

                        break;

                    case PmtConstants.ANCILLARIES_TYPES.UPGRADING:

                        break;

                }
            }



            for (i = 0; i < breakDownInfo.slices.length; i++) {
                trip = {
                    id: breakDownInfo.slices[i].sliceId,
                    segments: UtilsService.getTripSegments(breakDownInfo.slices[i].segments, cachedData)
                };
                pushTrip = false;
                baggageTrip = generateBaggageInformation(trip, breakDownInfo.ancillaries);
                angular.extend(trip, baggageTrip.baggages);

                pushTrip = pushTrip || baggageTrip.found;
                if (trip.segments.length > 0) {
                    for (k = 0, maxSegments = trip.segments.length; k < maxSegments; k++) {
                        bookingAncillariesSegment = buildInfoSegment(trip.segments[k], breakDownInfo.ancillaries);
                        if (!pushTrip) {
                            pushTrip = bookingAncillariesSegment.found;
                        }
                        if (bookingAncillariesSegment.segment.seats.length === 0) {
                            for (passengersIndex = 0; passengersIndex < trip.segments[k].passengers.length; passengersIndex++) {
                                if (trip.segments[k].passengers[passengersIndex] && trip.segments[k].passengers[passengersIndex].seat) {
                                    bookingAncillariesSegment.segment.seats.push({
                                        seat: trip.segments[k].passengers[passengersIndex].seat.row + trip.segments[k].passengers[passengersIndex].seat.column,
                                        price: 0
                                    });
                                }
                                bookingAncillariesSegment.segment.seatsSegmentAmount += 0;
                            }
                        }
                        angular.extend(trip.segments[k], bookingAncillariesSegment.segment);
                    }
                    if (pushTrip || baggageTrip.found) {
                        paymentsInfo.trips.push(trip);
                    }
                }
            }

            return paymentsInfo;

            function getInsuranceAncillaries(insuranceInfo) {
                var description = '';
                var selectedInsurance = localStorageService.get('selectedInsurance') || {};
                if (insuranceInfo.offer = selectedInsurance.id) {
                    description = selectedInsurance.provider;
                }
                return {
                    'name': description,
                    'price': insuranceInfo.total
                }

            }
        }

        function generateBaggageInformation(tripInfo, ancillaries) {
            var found = false, i, j, k;
            var returnedBagagges = {
                'baggagesAmount': 0,
                'baggagesTotal': 0,
                'handBaggages': 0
            };
            for (i = 0; i < ancillaries.length; i++) {
                if (ancillaries[i].type === 'BAGGAGE') {
                    for (j = 0; j < ancillaries[i].baggages.length; j++) {
                        for (k = 0; k < ancillaries[i].baggages[j].tripBaggage.length; k++) {
                            if (tripInfo.id === ancillaries[i].baggages[j].tripBaggage[k].id) {
                                returnedBagagges.baggagesAmount += ancillaries[i].baggages[j].tripBaggage[k].amount;
                                returnedBagagges.baggagesTotal += ancillaries[i].baggages[j].tripBaggage[k].total;
                                found = true;
                            }
                        }
                    }
                }
            }
            for (i = 0; i < tripInfo.segments.length; i++) {
                returnedBagagges.handBaggages += tripInfo.segments[i].passengers.length;
            }
            return { 'baggages': returnedBagagges, 'found': found };
        }

        function buildInfoSegment(cachedSegment, bookingAncillaries) {
            var returnedInfoSegment = { 'seats': [], 'seatsSegmentAmount': 0, 'cabin': {} };
            var i, j, k, found = false, hasUpgrading = false;


            for (i = 0; i < bookingAncillaries.length; i++) {
                if (bookingAncillaries[i].type === 'UPGRADING') {
                    for (j = 0; j < bookingAncillaries[i].upgrading.offerSegmentClasses.length; j++) {
                        if (bookingAncillaries[i].upgrading.offerSegmentClasses[j].segment === cachedSegment.id.toString()) {
                            returnedInfoSegment.cabin = {
                                'name': bookingAncillaries[i].upgrading.offerSegmentClasses[j].cabinClass.description,
                                'price': bookingAncillaries[i].total / bookingAncillaries[i].upgrading.offerSegmentClasses.length
                            }
                            hasUpgrading = true;
                            found = true;
                        }
                    }
                } else if (bookingAncillaries[i].type === 'SEAT') {
                    for (j = 0; j < bookingAncillaries[i].seats.length; j++) {
                        for (k = 0; k < bookingAncillaries[i].seats[j].segments.length; k++) {
                            if (bookingAncillaries[i].seats[j].segments[k].id === cachedSegment.id.toString()) {
                                returnedInfoSegment.seats.push({
                                    seat: bookingAncillaries[i].seats[j].segments[k].seat.row + bookingAncillaries[i].seats[j].segments[k].seat.column,
                                    price: bookingAncillaries[i].seats[j].segments[k].amount
                                });
                                returnedInfoSegment.seatsSegmentAmount += bookingAncillaries[i].seats[j].segments[k].amount;
                                found = true;
                            }
                        }
                    }
                }
            }
            if (!hasUpgrading) {
                returnedInfoSegment.cabin = {
                    'name': cachedSegment.cabinClass.description,
                    'price': 0
                }
            }
            return { 'segment': returnedInfoSegment, 'found': found };

        }

        function checkIfTextWarningDescription(warnings) {
            var response = { 'isInsuranceWarning': false, 'warningText': '' }, i;
            for (i = 0; i < warnings.length; i++) {
                if (warnings[i].code === PmtConstants.WARNING_CODES.UNPAID_ALLIANZ_INSURANCE && warnings[i].description.length > 0) {
                    response.warningText = warnings[i].description;
                    response.isInsuranceWarning = true;
                }
            }
            return response;
        }

    }
})();