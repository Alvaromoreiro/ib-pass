import dayjs from 'dayjs';

(function () {
    'use strict';

    angular
        .module('ib-pmt-utils-module')
        .factory('PmtUtilsService', PmtUtilsService);

    PmtUtilsService.$inject = ['$rootScope', 'localStorageService', 'PmtConstants', 'PmtModalService', 'PmtTokenService', '$q', 'PmtUtilsTransformers', '$window', 'CurrencyService', '$sce', 'CommonsUtilService','$filter'];
    function PmtUtilsService ($rootScope, localStorageService, PmtConstants, PmtModalService, PmtTokenService, $q, PmtUtilsTransformers, $window, CurrencyService, $sce, CommonsUtilService, $filter) {
        const service = {
            initStorage: initStorage,
            detectStateByZipCode: detectStateByZipCode,
            fillZipCodeByState: fillZipCodeByState,
            getCreditCardIcon: getCreditCardIcon,
            checkCreditCardExpiryDate: checkCreditCardExpiryDate,
            getSliceDetailsById: getSliceDetailsById,
            getSegmentDetailsById: getSegmentDetailsById,
            saveDataPaypal: saveDataPaypal,
            checkAvailableDonation: checkAvailableDonation,
            disabledOptionDonation: disabledOptionDonation,
            getConfirmationTotalPrice: getConfirmationTotalPrice,
            updateOrderFees: updateOrderFees,
            updateCardInfo: updateCardInfo,
            addKeyToPaymentMethods: addKeyToPaymentMethods,
            refreshTokenPmt: refreshTokenPmt,
            getModelWithPaymentInfo: getModelWithPaymentInfo,
            isUserLogged: isUserLogged,
            getCompanyURL: getCompanyURL,
            getURLFirstParameterByName: getURLFirstParameterByName,
            getParameterByName: getParameterByName,
            getPaymentRelatedContent: getPaymentRelatedContent,
            getCommunicationsLostInfo: getCommunicationsLostInfo,
            getRelatedContent: getRelatedContent,
            checkCompany: checkCompany,
            getCabinClassName: getCabinClassName,
            Base64Decode: Base64Decode,
            cleanSpaces: cleanSpaces,
            getLanguagePaypal: getLanguagePaypal,
            getElementsByProperty: getElementsByProperty,
            voucherSelected: voucherSelected,
            eligibleVoucherSelected: eligibleVoucherSelected,
            formatDate: formatDate,
            voucherIsPartnerEquivalent:voucherIsPartnerEquivalent,
            getSelectedPartnerInfo:getSelectedPartnerInfo,
            getOrderId: getOrderId,
            getNemuruLanguage:getNemuruLanguage,
            isObject: isObject,
            updateOnHoldOptions: updateOnHoldOptions
        };
        return service;

        ////////////////

        /**
         * Remove all localstorage variables of the app paymets
         */
        function initStorage () {
            localStorageService.remove('infoRequiredFieldsPayments');
            localStorageService.remove('selectedPaymentMethod');
            localStorageService.remove('redirectionPaymentCallback');
            localStorageService.remove('customerCreditCardsData');
            localStorageService.remove('creditCardFee');
            localStorageService.remove('customerCardSaved');
            localStorageService.remove('co2Info');
            localStorageService.remove('errorIssueService');
            localStorageService.remove('modelPaymentData');
            localStorageService.remove('appliedDisscounts');
            localStorageService.remove('selectedLoggedCard');
            localStorageService.remove('selectedPaymentData');
            localStorageService.remove('breakDownInfo');
            localStorageService.remove('paymentsInfo');
            localStorageService.remove('donation');
            localStorageService.remove('paySucces');
            localStorageService.remove('paymentMethodsWithoutDiscount');
            localStorageService.remove('changeCountryInCombo');
            localStorageService.remove('typeCardIberiaPay');
            localStorageService.remove('noPaymentSummary');
            localStorageService.remove('nextStepAllowed');
            localStorageService.remove('putWithoutOfferBin');
            localStorageService.remove('CustomerBinInfo');
            localStorageService.remove('paypalDataForBin');
            localStorageService.remove('selectedPaymentInfo');
            localStorageService.remove('issueOrderInfo');
            localStorageService.remove('ibPayTrace');
            localStorageService.remove('fullIssuedPaiment');
            localStorageService.remove('summaryAncillaries');
            localStorageService.remove('quotaExtraInfo');
            localStorageService.remove('payFromTransfer');
            localStorageService.remove('taxInfo');
            localStorageService.remove('bizumNumber');
            localStorageService.remove('binCardCountry');
            localStorageService.remove('selectedAviosDisccount');
            localStorageService.remove('clientBookingId');
        }

        /**
        *  Returns an State provided an zipCode
         * @returns {Object} - state info
        */
        function detectStateByZipCode (zipCode, statesList) {
            let foundedState = false, statesIndex = 0, stateByZipCodeInfo = { state: null, checker: false };
            if (zipCode && statesList) {
                while (!foundedState && statesIndex < statesList.length) {
                    if (zipCode.toString().substring(0, statesList[statesIndex].normalizedCode.length) === statesList[statesIndex].code || zipCode.toString().substring(0, statesList[statesIndex].normalizedCode.length) === statesList[statesIndex].normalizedCode) {
                        foundedState = true;
                        stateByZipCodeInfo.state = statesList[statesIndex];
                    }
                    statesIndex++;
                }
            }
            stateByZipCodeInfo.checker = zipCode && stateByZipCodeInfo.state && (zipCode.toString().substring(0, stateByZipCodeInfo.state.code.length) === stateByZipCodeInfo.state.code || zipCode.toString().substring(0, stateByZipCodeInfo.state.normalizedCode.length) === stateByZipCodeInfo.state.normalizedCode);
            return stateByZipCodeInfo;
        }

        /**
        *  Returns an State provided an zipCode
         * @returns {Object} - state info
        */
        function fillZipCodeByState (state, zipCode) {
            const fillZipCodeByStateInfo = { checker: false, changeZipCode: state && (!zipCode || zipCode && (zipCode === null || zipCode === '')), newZipCode: state.normalizedCode };
            fillZipCodeByStateInfo.checker = zipCode && state && (zipCode.toString().substring(0, state.code.length) === state.code || zipCode.toString().substring(0, state.normalizedCode.length) === state.normalizedCode);
            return fillZipCodeByStateInfo;
        }


        /**
         * Return the credit card logo url in the project.
         * @param {String} creditCardCode -The credit card code
         * @returns {String} - the credit card logo url that matches with its credit card code in the data on localStorage
         */
        function getCreditCardIcon (creditCardCode, creditCards) {
            let i = 0, found = false, creditCardURL = '';
            while (!found && i < creditCards.length) {
                if (creditCards[i].cardTypeId === creditCardCode) {
                    found = true;
                    creditCardURL = PmtConstants.ROUTES.icons + PmtConstants.ROUTES.creditCardLogoBaseRoute
                        + creditCards[i].name;
                }
                i++;
            }
            if (!found) {
                creditCardURL = PmtConstants.ROUTES.icons + PmtConstants.ROUTES.creditCardLogoBaseRoute
                    + PmtConstants.ROUTES.defaultCreditCardLogo;
            }

            return creditCardURL;
        }

        /**s
        * Returns if creditcard date is expired
        * @param {string} expirydate - The expiry date to check it
        * @returns {boolean} - If credit card is expired or not
        */
        function checkCreditCardExpiryDate (expiryDate) {
            let expired = false;
            const today = new Date();
            let actualMonth = today.getMonth() + 1;
            const actualYear = today.getFullYear() % 100;
            const expiryMonth = expiryDate.substring(0, 2);
            const expiryYear = expiryDate.substring(2);
            if (actualMonth < 10) {
                actualMonth = '0' + actualMonth;
            }
            if ((parseInt(expiryYear) < parseInt(actualYear)) || (parseInt(expiryYear) === parseInt(actualYear) && parseInt(expiryMonth) < parseInt(actualMonth))) {
                expired = true;
            }
            return expired;
        }

        function getSliceDetailsById (sliceId, slices) {
            let sliceFounded = false, sliceIndex = 0, sliceInfo = {};
            while (!sliceFounded && sliceIndex < slices.length) {
                if (slices[sliceIndex].sliceId === sliceId) {
                    sliceFounded = true;
                    sliceInfo = {
                        origin: slices[sliceIndex].segments[0].departure,
                        arrival: slices[sliceIndex].segments[slices[sliceIndex].segments.length - 1].arrival
                    };
                }
                sliceIndex++;
            }
            return sliceInfo;
        }

        function getSegmentDetailsById (segmentId, slices) {
            let sliceIndex = 0, segmentFounded = false, segmentIndex, segmentInfo = {};
            while (!segmentFounded && sliceIndex < slices.length) {
                segmentIndex = 0;
                while (!segmentFounded && segmentIndex < slices[sliceIndex].segments.length) {
                    if (slices[sliceIndex].segments[segmentIndex].id === segmentId) {
                        segmentFounded = true;
                        segmentInfo = {
                            origin: slices[sliceIndex].segments[segmentIndex].departure,
                            arrival: slices[sliceIndex].segments[segmentIndex].arrival
                        };
                    }
                    segmentIndex++;
                }
                sliceIndex++;
            }
            return segmentInfo;
        }

        function saveDataPaypal (paymentId, orderId, serviceURI) {
            $rootScope.paymentId = paymentId;
            $rootScope.orderId = orderId;
            $rootScope.serviceURI = serviceURI;
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

        function disabledOptionDonation (donationInfo) {
            let i, newDonationInfo = donationInfo;
            for (i = 1; i < newDonationInfo.options.length; i++) {
                newDonationInfo.options[i].selected = false;
            }
            return newDonationInfo;
        }

        function isVoucherDiscountMMBVC (orderInfo, flowApp) {
            let voucherDiscount = 0;
            if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE && orderInfo?.order?.voucherDiscount) {
                voucherDiscount += orderInfo.order.voucherDiscount.amount;
            }
            return voucherDiscount;
        }

        function isOnHoldPayment (onHoldPayment, paymentItems, paymentItemsIndex) {
            return onHoldPayment || paymentItems[paymentItemsIndex].type === PmtConstants.PAYMENT_TYPES.ON_HOLD;
        }

        function addTotalPriceDiscount (paymentItems, orderInfo) {
            let onHoldPayment = false, onHoldDisscount = 0, totalPriceDisscount = 0;
            const flowApp = localStorageService.get('flowApp');
            for (let paymentItemsIndex = 0; paymentItemsIndex < paymentItems.length; paymentItemsIndex++) {
                if (PmtConstants.DISSCOUNT_PAYMENT_ITEMS.indexOf(paymentItems[paymentItemsIndex].type) !== -1 && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
                    totalPriceDisscount += paymentItems[paymentItemsIndex].total ? paymentItems[paymentItemsIndex].total : paymentItems[paymentItemsIndex].price.total;
                }
                if (paymentItems[paymentItemsIndex].type === PmtConstants.PAYMENT_TYPES.CREDIT_CARD) {
                    onHoldDisscount = paymentItems[paymentItemsIndex].total ? paymentItems[paymentItemsIndex].total : paymentItems[paymentItemsIndex].price.total;
                }
                onHoldPayment = isOnHoldPayment(onHoldPayment, paymentItems, paymentItemsIndex);
            }
            if (onHoldPayment) {
                totalPriceDisscount += onHoldDisscount;
            }

            totalPriceDisscount += isVoucherDiscountMMBVC(orderInfo, flowApp);
            return totalPriceDisscount;
        }

        /**
         * Return total price
         * @param {*} totalPrice
         * @param {*} paymentItems
         */
        function getConfirmationTotalPrice (totalPrice, paymentItems, orderInfo) {
            let  totalPriceOrder = 0, totalPriceDisscount = 0;
            totalPriceDisscount += addTotalPriceDiscount(paymentItems, orderInfo);

            totalPriceOrder = totalPrice - totalPriceDisscount;

            return Math.abs(totalPriceOrder);
        }

        function updateOrderFees (feeInfo) {
            let i;
            if (feeInfo && feeInfo.length > 0) {
                for (i = 0; i < feeInfo.length; i++) {
                    if (feeInfo[i].code === 'creditCardFee') {
                        feeInfo.splice(i, 1);
                    }
                }
            }
            return feeInfo;
        }

        function updateCardInfo (paymentMethods, cardInfo) {
            let i, j;
            for (i = 0; i < paymentMethods.length; i++) {
                if (paymentMethods[i].type === 'CREDITCARD') {
                    for (j = 0; j < paymentMethods[i].types.length; j++) {
                        if (paymentMethods[i].types[j].cardTypeCode === cardInfo.cardTypeCode && paymentMethods[i].types[j].cardTypeId === cardInfo.cardTypeId) {
                            cardInfo = paymentMethods[i].types[j];
                        }
                    }
                }
            }

            return cardInfo;
        }
        function addKeyToPaymentMethods (paymentMethods, paymentMethodsAddKey) {
            let i = 0, j, finded;
            while (i < paymentMethods.length) {
                j = 0;
                while (!finded && j < paymentMethodsAddKey.length) {
                    if (paymentMethods[i].type === paymentMethodsAddKey[j].type) {
                        paymentMethodsAddKey[j].key = paymentMethods[i].key;
                        finded = true;
                    }
                    j++;
                }
                finded = false;
                i++;
            }
            for (i = 0; i < paymentMethodsAddKey.length; i++) {
                if (!paymentMethodsAddKey[i].key) {
                    paymentMethodsAddKey[i].key = -1;
                }
            }
            return paymentMethodsAddKey;
        }

        /**
         * Refresh the current token storing it in Session Storage. If the user is logged the function refresh the user logged token.
         * If not, gets a new anonymous token and stores it
         * @returns {Object.<Promise>} - returns a promise. When the token is refreshed, then resolves the promise. If the refresh fails, then it resolves de promise equally
         */
        function refreshTokenPmt () {
            const defer = $q.defer();
            if (localStorageService.get('userLogged')) {
                PmtTokenService.refreshUserLoggedToken().then(success, success);
            } else {
                PmtTokenService.getAnonymousToken().then(success, success);
            }
            return defer.promise;

            function success () {
                defer.resolve();
            }
        }

        /**
         * Return info model payments tranformated and ready to show payments view
         */
        function getModelWithPaymentInfo (countriesList, prefixList, statesList, paymentInfo, orderInfo, selectedPaymentData) {
            return PmtUtilsTransformers.getModelWithPaymentInfo(countriesList, prefixList, statesList, paymentInfo, orderInfo, selectedPaymentData);
        }


        /**
         * Return conditions of fareFamilyInfo
         * @param {Object} fareFamilyInfo Response of fareFamylyRest query
         * @return {Object} Conditions- Object with all conditions for diferents comercial codes
         */
        function setFareFamilyConditions (fareFamilyInfo) {
            let i, conditions = localStorageService.get('fareFamilyConditionsInfo') || {};
            fareFamilyInfo = fareFamilyInfo || [];
            for (i = 0; i < fareFamilyInfo.length; i++) {
                if (!conditions[fareFamilyInfo[i].commercialCode]) {
                    conditions[fareFamilyInfo[i].commercialCode] = fareFamilyInfo[i];
                }
            }
            localStorageService.set('fareFamilyConditionsInfo', conditions);
            return conditions;
        }


        /**
         * Opens the fare family conditions modal with the received template and options
         * @param {Object} event the event received
         * @param {Object} data Data for load in modal window
         */
        function openFareFamilyConditionsModal (event, data) {
            const modelFareFamily = localStorageService.get('fareFamilyConditionsInfo')[data.fareFamily] || {};
            angular.extend(modelFareFamily, { idModal: PmtDatalayerConstants.DATALAYER_MODAL_ID.FARE_CONDITIONS });
            PmtModalService.showGenericModal(data.isBlocked, data.template, modelFareFamily).result.then(angular.noop, angular.noop);
        }


        /**
         * check if the current user is logged or not
         * @return true if the user is logged in the app
         */
        function isUserLogged () {
            return localStorageService.get('userLogged');
        }



        /**
         * Return the company logo url in the project.
         * @param {String} companyCode -The company code
         * @returns {String} - the company logo url that matches with its company code in the data on localStorage
         */
        function getCompanyURL (companyCode) {
            let airlinesLogo = localStorageService.get('airlinesLogoList') || [], i = 0, found = false, companyURL = '';
            while (!found && i < airlinesLogo.length) {
                if (airlinesLogo[i].iataCompanyCode === companyCode) {
                    found = true;
                    companyURL = PmtConstants.airlinesLogoBaseRoute + airlinesLogo[i].url;
                }
                i++;
            }
            if (!found) {
                companyURL = PmtConstants.airlinesLogoBaseRoute + PmtConstants.defaultAirlineLogo;
            }
            return companyURL;
        }

        /**
         * Returns the value of the first param found
         * @param  {Array<String>} paramsName - An array with the possible names of an URL param
         * @returns {String} - The value of the first param found in the array
         */
        function getURLFirstParameterByName (paramsName) {
            let paramValue = null, i = 0, countPassenger = null;
            if (angular.isArray(paramsName)) {
                while (paramValue === null && i < paramsName.length) {
                    if (angular.isString(paramsName[i])) {
                        if (PmtConstants.URL_PARAMS_NAMES.ADULT.indexOf(paramsName[i]) !== -1 || PmtConstants.URL_PARAMS_NAMES.CHILD.indexOf(paramsName[i]) !== -1 || PmtConstants.URL_PARAMS_NAMES.INFANT.indexOf(paramsName[i]) !== -1 || PmtConstants.URL_PARAMS_NAMES.SENIOR.indexOf(paramsName[i]) !== -1 || PmtConstants.URL_PARAMS_NAMES.YOUNG.indexOf(paramsName[i]) !== -1 || PmtConstants.URL_PARAMS_NAMES.TEENAGER.indexOf(paramsName[i]) !== -1) {
                            countPassenger = countPassenger || 0;
                            if (getParameterByName(paramsName[i])) {
                                countPassenger += parseInt(getParameterByName(paramsName[i]));
                            }
                        } else {
                            paramValue = getParameterByName(paramsName[i]);
                        }
                    }
                    i++;
                }
                paramValue = countPassenger ? countPassenger : paramValue;
            } else if (angular.isString(paramsName)) {
                paramValue = getParameterByName(paramsName);
            }
            return paramValue;
        }

        /**
         * Returns the market from url
         * @returns {string} - returns an string made from params
         */
        function getParameterByName (name, url) {
            let regex;
            let results;
            if (!url) url = $window.location.href;
            name = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'gi');
            results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return null;
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        /**
         * Return the information  about relatedContent necessary to show in page payments
         * @param {String} termAndConditionsTxt is a text with info about term and conditions this info is return service
         * @param {String} totalPriceTxt is a text with info about total price this info is return service
         */
        function getPaymentRelatedContent (termAndConditionsTxt, totalPriceTxt) {
            return PmtUtilsTransformers.generateModelRelatedContent(termAndConditionsTxt, totalPriceTxt);
        }

        /**
         * Return a Object with all information to show comunications lost view
         * @param {Object} confirmationInfo Object with all information return issue service when error code is 417
         * @param {Array<Object>} creditCardTypes All information credit card return in payment method creditCard
         */
        function getCommunicationsLostInfo (confirmationInfo, creditCardTypes) {
            let i;
            const communicationLostModel = {
                currency: CurrencyService.getCurrenciesAsMap(confirmationInfo && confirmationInfo.contextMetadata ? confirmationInfo.contextMetadata.currencies : null)[confirmationInfo && confirmationInfo.order ? confirmationInfo.order.price.currency : null],
                pnr: confirmationInfo && confirmationInfo.order ? confirmationInfo.order.bookingReferences[0].reference : null,
                paymentItems: {},
                ancillaries: confirmationInfo && confirmationInfo.order && confirmationInfo.order.orderItems ? getAncillariesInfo(confirmationInfo.order.orderItems, confirmationInfo.order.slices) : null
            };
            if (confirmationInfo && confirmationInfo.paymentItems) {
                for (i = 0; i < confirmationInfo.paymentItems.length; i++) {
                    switch (confirmationInfo.paymentItems[i].type) {
                            case PmtConstants.PAYMENT_TYPES.CREDIT_CARD:
                                communicationLostModel.paymentItems[PmtConstants.PAYMENT_TYPES.CREDIT_CARD] = {
                                    total: CurrencyService.formatPrice(communicationLostModel.currency, confirmationInfo.paymentItems[i].total, true) + (communicationLostModel.currency.description ? ' (' + communicationLostModel.currency.description + ')' : ''),
                                    authorization: confirmationInfo.paymentItems[i].authorization,
                                    creditCardNumber: confirmationInfo.paymentMethod.cardNumber,
                                    cardDescription: getCreditCardDescription(confirmationInfo.paymentMethod.cardTypeId, creditCardTypes)
                                };
                                break;
                            case PmtConstants.PAYMENT_TYPES.AVIOS:
                                communicationLostModel.paymentItems[PmtConstants.PAYMENT_TYPES.AVIOS] = {
                                    dicount: '-' + CurrencyService.formatPrice(communicationLostModel.currency, confirmationInfo.paymentItems[i].total, true) + ' (' + communicationLostModel.currency.description + ')',
                                    authorization: confirmationInfo.paymentItems[i].authorization,
                                    aviosRedeemed: confirmationInfo.paymentItems[i].aviosRedeemed
                                };
                                communicationLostModel.aviosRedeemed = confirmationInfo.paymentItems[i].aviosRedeemed;
                                break;
                            case PmtConstants.PAYMENT_TYPES.VOUCHER:
                                communicationLostModel.paymentItems[PmtConstants.PAYMENT_TYPES.VOUCHER] = {
                                    dicount: '-' + CurrencyService.formatPrice(communicationLostModel.currency, confirmationInfo.paymentItems[i].total, true) + ' (' + communicationLostModel.currency.description + ')',
                                    authorization: confirmationInfo.paymentItems[i].authorization
                                };
                                break;
                    }
                }
            }



            return communicationLostModel;

            function getCreditCardDescription (cardTypeId, creditCardTypes) {
                let cardIndex = 0, cardFound = false;
                let cardDescription = '';
                if (creditCardTypes) {
                    while (!cardFound && cardIndex < creditCardTypes.length) {
                        if (cardTypeId === creditCardTypes[cardIndex].cardTypeId) {
                            cardFound = true;
                            cardDescription = creditCardTypes[cardIndex].description;
                        }
                        cardIndex++;
                    }
                }
                return cardDescription;
            }

            function getAncillariesInfo (orderItems, slices) {
                let orderItemsIndex, ancillariesInfo = {}, tripInfo, ancillariesInfoIndex = 0;
                for (orderItemsIndex = 0; orderItemsIndex < orderItems.length; orderItemsIndex++) {
                    switch (orderItems[orderItemsIndex].type) {
                            case 'baggage':
                                if (!ancillariesInfo.BAGGAGES) {
                                    ancillariesInfo.BAGGAGES = {
                                        title: 'SUMMARY_ANCILLARIES_BAGGAGE_TITLE',
                                        info: {},
                                        viewInfo: { text: '', quantity: 1 }
                                    };
                                } else {
                                    ancillariesInfo.BAGGAGES.viewInfo.quantity++;
                                }
                                if (ancillariesInfo.BAGGAGES.info[orderItems[orderItemsIndex].sliceId]) {
                                    ancillariesInfo.BAGGAGES.info[orderItems[orderItemsIndex].sliceId].baggages++;
                                } else {
                                    tripInfo = getSliceDetailsById(orderItems[orderItemsIndex].sliceId, slices);
                                    ancillariesInfo.BAGGAGES.info[orderItems[orderItemsIndex].sliceId] = { baggages: 1, trip: '(' + tripInfo.origin.city.description + '-' + tripInfo.arrival.city.description + ')' };
                                }
                                break;
                            case 'seat':
                                if (!ancillariesInfo.SEATS) {
                                    ancillariesInfo.SEATS = {
                                        title: 'SUMMARY_ANCILLARIES_SEATS_TITLE',
                                        info: {},
                                        viewInfo: { text: '' }
                                    };
                                }
                                if (ancillariesInfo.SEATS.info[orderItems[orderItemsIndex].segmentId]) {
                                    ancillariesInfo.SEATS.info[orderItems[orderItemsIndex].segmentId].seats += ',' + orderItems[orderItemsIndex].row + orderItems[orderItemsIndex].column;
                                } else {
                                    tripInfo = getSegmentDetailsById(orderItems[orderItemsIndex].segmentId, slices);
                                    ancillariesInfo.SEATS.info[orderItems[orderItemsIndex].segmentId] = { seats: orderItems[orderItemsIndex].row + orderItems[orderItemsIndex].column, trip: '(' + tripInfo.origin.city.description + '-' + tripInfo.arrival.city.description + ')' };
                                }
                                break;
                    }
                }
                if (ancillariesInfo.SEATS) {
                    angular.forEach(ancillariesInfo.SEATS.info, (value, id) => {
                        ancillariesInfo.SEATS.viewInfo.text += value.seats + ' ' + value.trip + (ancillariesInfoIndex < Object.keys(ancillariesInfo.SEATS.info).length - 1 ? '. ' : '');
                        ancillariesInfoIndex++;
                    });
                }
                ancillariesInfoIndex = 0;
                if (ancillariesInfo.BAGGAGES) {
                    angular.forEach(ancillariesInfo.BAGGAGES.info, (value, id) => {
                        ancillariesInfo.BAGGAGES.viewInfo.text += value.baggages + ' ' + value.trip + (ancillariesInfoIndex < Object.keys(ancillariesInfo.BAGGAGES.info).length - 1 ? ', ' : '');
                        ancillariesInfoIndex++;
                    });
                }
                return ancillariesInfo;

            }
        }

        /**
         * Return Object with all information about related content return in order service
         * @param {*} relatedContent
         */
        function getRelatedContent (relatedContent) {
            let returnRelatedContent = {}, i;
            if (relatedContent) {
                for (i = 0; i < relatedContent.length; i++) {
                    returnRelatedContent[relatedContent[i].key] = $sce.trustAsHtml(relatedContent[i].value);
                }
            }
            return returnRelatedContent;
        }

        /**
        * Check if company is constants COMPANIES
        * @param {String} company Company of flight
        */
        function checkCompany (company) {
            let result = false;
            for (const key in PmtConstants.COMPANIES) {
                if (Object.hasOwnProperty.call(PmtConstants.COMPANIES, key)) {
                    const constCompany = PmtConstants.COMPANIES[key];
                    if(!result && company === constCompany) {
                        result = true;
                    }
                }
            }
            return result;
        }

        function getCabinClassName (cabinClassType) {
            let label = '';
            switch (cabinClassType) {//Switch case for input cabinClassType
                    case PmtConstants.CABIN_CLASS.TYPE.ECONOMY:
                        label = PmtConstants.CABIN_CLASS.LABEL.CABINA_TURISTICA;
                        break;
                    case PmtConstants.CABIN_CLASS.TYPE.BUSINESS:
                        label = PmtConstants.CABIN_CLASS.LABEL.CABINA_BUSINESS;
                        break;
                    case PmtConstants.CABIN_CLASS.TYPE.BUSINESS_PLUS:
                        label = PmtConstants.CABIN_CLASS.LABEL.CABINA_BUSINESS;
                        break;
                    case PmtConstants.CABIN_CLASS.TYPE.BUSINESS_CLUB:
                        label = PmtConstants.CABIN_CLASS.LABEL.CABINA_BUSINESS;
                        break;
                    case PmtConstants.CABIN_CLASS.TYPE.BUSINESS_CLASS:
                        label = PmtConstants.CABIN_CLASS.LABEL.CABINA_BUSINESS;
                        break;
                    case PmtConstants.CABIN_CLASS.TYPE.PREMIUMTOURIST:
                        label = PmtConstants.CABIN_CLASS.LABEL.CABINA_PREMIUM_TURIST;
                        break;
                    default:
                        label = PmtConstants.CABIN_CLASS.LABEL.CABINA_TURISTICA;
                        break;
            }
            return label;
        }

        function Base64Decode (str, utf8decode) {
            const Base64 = {};
            let o1, o2, o3, h1, h2, h3, h4, bits, d = [], plain, coded, b64, c;
            Base64.code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            utf8decode = angular.isUndefined(typeof utf8decode) ? false : utf8decode;
            b64 = Base64.code;

            coded = utf8decode ? Utf8.decode(str) : str;

            for (c = 0; c < coded.length; c += 4) {
                h1 = b64.indexOf(coded.charAt(c));
                h2 = b64.indexOf(coded.charAt(c + 1));
                h3 = b64.indexOf(coded.charAt(c + 2));
                h4 = b64.indexOf(coded.charAt(c + 3));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >>> 16 & 0xff;
                o2 = bits >>> 8 & 0xff;
                o3 = bits & 0xff;

                d[c / 4] = String.fromCharCode(o1, o2, o3);
                if (h4 === 0x40) d[c / 4] = String.fromCharCode(o1, o2);
                if (h3 === 0x40) d[c / 4] = String.fromCharCode(o1);
            }
            plain = d.join('');
            return utf8decode ? Utf8.decode(plain) : plain;
        }

        /**
         * Clean the spaces on string
         * @param {String} str
         */
        function cleanSpaces (str) {
            return str = str.replace(/^\s+|\s+$/gm, '');
        }

        /**
        *  Returns language  to pay with paypal script
        *
        */
        function getLanguagePaypal () {
            let i = 0, paypalLanguage, found = false, language = $rootScope.appLang;
            while (i < PmtConstants.CODE_LANGUAGE_PAYPAL.CODES.length && !found) {
                if (language === PmtConstants.CODE_LANGUAGE_PAYPAL.CODES[i].language) {
                    paypalLanguage = PmtConstants.CODE_LANGUAGE_PAYPAL.CODES[i].paypalLanguage;
                    found = true;
                }
                i++;
            }
            return paypalLanguage;
        }


        /**
        *  Returns language  to pay with Nemuru script
        *
        */
        function getNemuruLanguage () {
            let i = 0, nemuruLanguage, found = false, language = $rootScope.appLang;
            while (i < PmtConstants.CODE_LANGUAGE_NEMURU.CODES.length && !found) {
                if (language === PmtConstants.CODE_LANGUAGE_NEMURU.CODES[i].language) {
                    nemuruLanguage = PmtConstants.CODE_LANGUAGE_NEMURU.CODES[i].nemuruLanguage;
                    found = true;
                }
                i++;
            }
            if(!found) {
                nemuruLanguage='en-US';
            }
            return nemuruLanguage;
        }


        /**
         * Given the array, creates an object that has one property for each kind of parameter found in the array
         * @param {*} array initial array to be transformed
         * @param {*} parameter string that defines which property of each element we will use to create the new object
         * @param {*} canBeRepeated boolean that tells if each parameter can have more than one element of the initial array.
         * @returns {*} transformedObject
         */
        function getElementsByProperty (array, parameter, canBeRepeated) {
            let transformedObject = {}, i;
            if (canBeRepeated) {
                for (i = 0; i < array.length; i++) {
                    transformedObject[array[i][parameter]] = transformedObject[array[i][parameter]] || [];
                    transformedObject[array[i][parameter]].push(array[i]);
                }
            } else {
                for (i = 0; i < array.length; i++) {
                    transformedObject[array[i][parameter]] = array[i];
                }
            }
            return transformedObject;
        }
        /* INIT DELETE GA4 MIGRATION*/
        function voucherSelected (appliedDiscounts) {
            let isSelectedVoucher = { elegibleBono: 'NO' };
            const customerData = localStorageService.get('customerData');
            let i;
            const partnerSelected = getSelectedPartnerInfo();
            if (appliedDiscounts.status === true && customerData && customerData.personalInfo && isSelectedVoucher.elegibleBono === 'NO'
                && partnerSelected?.partnerIdentifier
                && appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.id
                && partnerSelected?.partnerIdentifier === appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.id
            ) {
                isSelectedVoucher = { elegibleBono: 'SI' };
            } else {
                isSelectedVoucher = { elegibleBono: 'NO' };
            }
            return isSelectedVoucher;
        }
        /* FINISH DELETE GA4 MIGRATION*/
        function eligibleVoucherSelected (appliedDiscounts) {
            let isSelectedVoucher = { EligibleVoucher: 'NO' };
            const customerData = localStorageService.get('customerData');
            let i;
            const partnerSelected = getSelectedPartnerInfo();
            if (appliedDiscounts.status === true && customerData && customerData.personalInfo && isSelectedVoucher.EligibleVoucher === 'NO'
                && partnerSelected?.partnerIdentifier
                && appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.id
                && partnerSelected?.partnerIdentifier === appliedDiscounts?.types?.[PmtConstants.DISCOUNT_TYPES.VOUCHER]?.id
            ) {
                isSelectedVoucher = { EligibleVoucher: 'SI' };
            } else {
                isSelectedVoucher = { EligibleVoucher: 'NO' };
            }
            return isSelectedVoucher;
        }

        function formatDate (date) {
            let newDate = '', separatedDate = [];
            if (date) {
                separatedDate = date.split('-');
                newDate = separatedDate [2] + '/' + separatedDate[1] + '/' + separatedDate[0];
            }
            return newDate;
        }

        function voucherIsPartnerEquivalent (voucherType) {
            if (voucherType) {
                return voucherType === PmtConstants.DISCOUNT_TYPES.PARTNER || CommonsUtilService.isDiscountTypePartnerEquivalent(voucherType);
            } else {
                return false;
            }
        }

        function getSelectedPartnerInfo () {
            const customerData = localStorageService.get('customerData');
            let result = null;
            try {
                if (customerData.personalInfo.applyPartersDiscounts) {
                    result = customerData.personalInfo.partnersInfoBKI.find(element => element.isSelected);
                }
                return result;
            } catch (e) {
                return result;
            }
        }

        function getOrderId () {
            const bookingInfo = localStorageService.get('bookingInfo');
            return bookingInfo && bookingInfo.order ? bookingInfo.order.orderId : null;
        }

        function isObject (o) {
            return typeof o === 'object' && !Array.isArray(o) && o !== null;
        }
        function updateOnHoldOptions (paymentOptions, onHoldIndex) {
            const {onholdOptionId} = paymentOptions.paymentMethods[onHoldIndex];
            const previousOnHoldOptions = localStorageService.get('onHoldOptions');
            const currency = localStorageService.get('currency');
            const tommorrow = dayjs().add(1,'day');
            const tommorrowFormatted = tommorrow.format('YYYY-MM-DDTHH:mm:ss.SSS');
            const onHoldShowInfo = {
                freeOption: true,
                freePrice: CurrencyService.formatPrice(currency, PmtConstants.ON_HOLD_FREE.PRICE, true),
                holdTimesFree: PmtConstants.ON_HOLD_FREE.HOURS,
                maxFreeTime: PmtConstants.ON_HOLD_FREE.HOURS,
                moreTimePrice: PmtConstants.ON_HOLD_FREE.PRICE,
                minPrice: CurrencyService.formatPrice(currency, PmtConstants.ON_HOLD_FREE.PRICE, true),
                holdTimes: PmtConstants.ON_HOLD_FREE.HOURS.toString()
            };
            const onHoldOptions = {
                [onholdOptionId]: {
                    ...previousOnHoldOptions[onholdOptionId],
                    onHoldOptionId: onholdOptionId,
                    hours: PmtConstants.ON_HOLD_FREE.HOURS,
                    price:{
                        fare: PmtConstants.ON_HOLD_FREE.PRICE,
                        tax: PmtConstants.ON_HOLD_FREE.PRICE,
                        ticketingFee: PmtConstants.ON_HOLD_FREE.PRICE,
                        total: PmtConstants.ON_HOLD_FREE.PRICE,
                        currency: paymentOptions.currency.code
                    },
                    onHoldPricePerPassenger: PmtConstants.ON_HOLD_FREE.PRICE,
                    transformedTimeDateLimit: $filter('DateFormatFilter')(tommorrowFormatted),
                    referenceTimeLimit: tommorrowFormatted,
                    timeLimits: tommorrow.format()
                }
            };
            localStorageService.set('onHoldOptions', onHoldOptions);
            localStorageService.set('onHoldShowInfo', onHoldShowInfo);
        }
    }
})();
