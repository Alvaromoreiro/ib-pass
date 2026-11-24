(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .service('PmtMethodsService', PmtMethodsService);

    PmtMethodsService.$inject = ['$q', 'localStorageService', 'PmtMethodsProxy', 'PmtConstants', 'PmtUtilsService', 'PmtMethodsTransformer', 'PmtHttpErrorFilter', 'CommonsAncillariesService', 'PmtBreakDownUtilsService', 'PmtAssFassTransformer', 'pmtSummaryGiftCardsService', 'PmtPaymentScriptsService', 'DatalayerUtilsService', 'pmtSummarySubscriptionModelsService', 'CurrencyService'];
    function PmtMethodsService ($q, localStorageService, PmtMethodsProxy, PmtConstants, PmtUtilsService, PmtMethodsTransformer, PmtHttpErrorFilter, CommonsAncillariesService, PmtBreakDownUtilsService, PmtAssFassTransformer, pmtSummaryGiftCardsService, PmtPaymentScriptsService, DatalayerUtilsService, pmtSummarySubscriptionModelsService, CurrencyService) {
        const self = this;
        self.getPaymentMethods = getPaymentMethods;
        self.getPaymentAdditionalFields = getPaymentAdditionalFields;
        self.updatePaymentAdditionalFields = updatePaymentAdditionalFields;
        self.updatePayments = updatePayments;
        self.getDownpaymentTotalAmountInstalments = getDownpaymentTotalAmountInstalments;
        self.defer;
        self.numberAttemps = 0;

        ////////////////
        /**
         * Gets the PaymentMethods for a purchase. If there was and error in the http call,
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {String} orderId - the bookig order id to make the purchase
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */

        function getPaymentMethods (orderId, issuerCountry, serviceURI, changeCountry, customerCreditCards) {

            const endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.paymentMethodsServiceURI, flowApp = localStorageService.get('flowApp');
            self.defer = self.defer || $q.defer();

            PmtMethodsProxy.getPaymentMethods(endpoint + orderId + '/payment-methods' + (issuerCountry && changeCountry ? '?issuerCountry=' + issuerCountry : ''))
                .then(getPaymentMethodsSuccess, getPaymentMethodsError);
            return self.defer.promise;

            function getPaymentMethodsSuccess (dataPayment) {
                if (flowApp === PmtConstants.APP_TYPES.GIFTCARDS) {
                    pmtSummaryGiftCardsService.getSummary(localStorageService.get('flowId')).then((data) => {
                        if (data) {
                            localStorageService.set('summaryInfoGiftCard', data.data);
                        }
                        getPaymentScripts(dataPayment);
                    });
                }else if (flowApp === PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS) {
                    pmtSummarySubscriptionModelsService.getSummary(localStorageService.get('flowId')).then((data) => {
                        if (data) {
                            localStorageService.set('summaryInfoSubscriptionModels', data.data);

                        }
                        getPaymentScripts(dataPayment);
                    });
                } else {
                    getPaymentScripts(dataPayment);
                }

            }
            function getPaymentScripts (dataPayment) {
                const newDataPayment = dataPayment;
                PmtPaymentScriptsService.getAll(dataPayment.data).then( (scriptList) => {
                    let i, j;
                    for (i = 0; i < scriptList.length; i++) {
                        for(j=0; j< newDataPayment.data.paymentMethods.length; j++) {
                            if (scriptList[i].hasOwnProperty(newDataPayment.data.paymentMethods[j].type)) {
                                newDataPayment.data.paymentMethods[j].scriptdownloaded = scriptList[i][newDataPayment.data.paymentMethods[j].type];
                            } else if(scriptList[i].hasOwnProperty(newDataPayment.data.paymentMethods[j].type + newDataPayment.data.paymentMethods[j].provider)) {
                                newDataPayment.data.paymentMethods[j].availableConditions = scriptList[i]?.availableConditions;
                                newDataPayment.data.paymentMethods[j].calculateConditions = scriptList[i]?.calculateConditions;
                                if (scriptList[i]?.calculateConditions) {
                                    newDataPayment.data.paymentMethods[j].downpaymentTotalAmount = getDownpaymentTotalAmountInstalments(scriptList[i].calculateConditions, CurrencyService.getCurrencyObject(newDataPayment.data.currency));
                                }
                                newDataPayment.data.paymentMethods[j].scriptdownloaded = scriptList[i][newDataPayment.data.paymentMethods[j].type + newDataPayment.data.paymentMethods[j].provider];
                            }
                        }
                    }
                    getPaymentMethodsSuccessNextStep(newDataPayment);
                }, () => {
                    getPaymentMethodsSuccessNextStep(newDataPayment);
                });
            }

            function getPaymentMethodsSuccessNextStep (data) {
                let paymentInfo, transformedInfoPayments, requiredFieldIndex, promisesRequiredFields = [], ident = localStorageService.get('pmtModelInfo').ident,
                    bookingInfo = localStorageService.get('bookingInfo') && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED ? localStorageService.get('bookingInfo') : generateInfo();

                paymentInfo = flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS ? PmtMethodsTransformer.generateModelPayMethodsBids(data.data, issuerCountry) : PmtMethodsTransformer.generateModelPayMethods(data.data, issuerCountry, customerCreditCards);
                localStorageService.set('paymentsInfo', paymentInfo);
                if(localStorageService.get('isShuttleFlow') === undefined || localStorageService.get('isShuttleFlow') === null || !localStorageService.get('isShuttleFlow')) {
                    /* INIT DELETE GA4 MIGRATION*/
                    DatalayerUtilsService.generateDatalayerPayments(data.data, localStorageService.get('createOrderData'));
                    /* FINISH DELETE GA4 MIGRATION*/
                    DatalayerUtilsService.generateDigitalDataPayments(data.data, localStorageService.get('createOrderData'));
                }

                transformedInfoPayments = PmtUtilsService.getModelWithPaymentInfo(localStorageService.get('countriesList'), localStorageService.get('prefixList'), localStorageService.get('statesList'), paymentInfo, bookingInfo, localStorageService.get('selectedPaymentData'));
                function syncModelPaymentData () {
                    localStorageService.set('modelPaymentData', transformedInfoPayments);
                }
                if (flowApp === PmtConstants.APP_TYPES.BOOKING ||  flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) {
                    if (!localStorageService.get('isShuttleFlow')) {
                        CommonsAncillariesService.getAncillarieSummary().then((breakdownInfo) => {
                            bookingInfo.ancillairesInfo = PmtBreakDownUtilsService.transformBreakdownInfo(breakdownInfo);
                            transformedInfoPayments.summaryInfo.ancillaries = bookingInfo.ancillairesInfo;
                            localStorageService.remove('ancillariesPendingBKIFlow');
                            syncModelPaymentData();
                        }, angular.noop);
                    }
                }
                if (Object.keys(transformedInfoPayments.summaryInfo).length === 0 && (flowApp === PmtConstants.APP_TYPES.CHECKIN)) {
                    CommonsAncillariesService.getAncillarieSummary().then((breakdownInfo) => {
                        transformedInfoPayments.summaryInfo.ancillaries = PmtBreakDownUtilsService.transformBreakdownInfo(breakdownInfo);
                        transformedInfoPayments.breakdownInfo = true;
                        transformedInfoPayments.showQuotas = true;
                        transformedInfoPayments.showPmtHeader = false;
                        syncModelPaymentData();
                    }, angular.noop);
                } else if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                    transformedInfoPayments.showPmtHeader = false;
                } else if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS ) {
                    CommonsAncillariesService.getAncillarieSummary().then((breakdownInfo) => {
                        transformedInfoPayments.summaryInfo.ancillaries = flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS ? PmtBreakDownUtilsService.transformBreakdownUpgradingBid(breakdownInfo) : PmtBreakDownUtilsService.transformBreakdownInfo(breakdownInfo);
                        transformedInfoPayments.breakdownInfo = true;
                        transformedInfoPayments.showQuotas = true;
                        transformedInfoPayments.showPmtHeader = false;
                        syncModelPaymentData();
                    }, angular.noop);
                } else if (flowApp === PmtConstants.APP_TYPES.GIFTCARDS || flowApp === PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS) {
                    transformedInfoPayments.showPmtHeader = false;
                } else {
                    transformedInfoPayments.showPmtHeader = true;
                }
                if (transformedInfoPayments.paymentInfo && transformedInfoPayments.paymentInfo.requiredAdditionalFields && transformedInfoPayments.paymentInfo.requiredAdditionalFields.paymentMethods.length > 0) {
                    for (requiredFieldIndex = 0; requiredFieldIndex < transformedInfoPayments.paymentInfo.requiredAdditionalFields.paymentMethods.length; requiredFieldIndex++) {
                        promisesRequiredFields.push(getPaymentAdditionalFields(ident, paymentInfo.paymentId, transformedInfoPayments.paymentInfo.requiredAdditionalFields.paymentMethods[requiredFieldIndex].type, transformedInfoPayments.paymentInfo.requiredAdditionalFields.paymentMethods[requiredFieldIndex].provider, serviceURI));
                    }
                    $q.all(promisesRequiredFields).then((requiredAdditionalFields) => {
                        transformedInfoPayments.paymentInfo.requiredAdditionalFields.info = PmtMethodsTransformer.transformRequiredAdditionalFields(requiredAdditionalFields);
                        getRequiredAdditionalFieldsSuccess(transformedInfoPayments);
                    }, () => {
                        returnProcessedError(true);
                    });
                } else {
                    getRequiredAdditionalFieldsSuccess(transformedInfoPayments);
                }

                function getRequiredAdditionalFieldsSuccess (transformedInfoPayments) {
                    self.defer.resolve(transformedInfoPayments);
                    self.defer = null;
                }
                self.numberAttemps = 0;

                function generateInfo () {
                    let flowApp = localStorageService.get('flowApp'), bookingInfo = {}, fareData = localStorageService.get('fareData'), i, j, k, fareOffer = [];
                    const isShuttleFlow = localStorageService.get('isShuttleFlow');
                    if (flowApp === PmtConstants.APP_TYPES.BOOKING || flowApp === PmtConstants.APP_TYPES.ONHOLD) {
                        bookingInfo = localStorageService.get('createOrderData');
                        bookingInfo.fareFamilyConditions = fareData.fareFamilyConditions;
                        bookingInfo.ancillairesInfo = localStorageService.get('selectedAncillariesInfo');
                    } else if (isShuttleFlow) {
                        bookingInfo = localStorageService.get('createOrderData');
                        bookingInfo.fareFamilyConditions = fareData.fareFamilyConditions;
                    } else if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                        bookingInfo = localStorageService.get('bookingInfo');
                        bookingInfo.order.slices = fareData.offers[0].slices;
                        bookingInfo.order.price = fareData.offers[0].price;
                        k = 0;
                        for (i = 0; i < fareData.offers[0].offerItems.length; i++) {
                            for (j = 0; j < fareData.offers[0].offerItems[i].passengerIds.length; j++) {
                                fareOffer[k] = {};
                                fareOffer[k].detailedTaxes = fareData.offers[0].offerItems[i].detailedTaxes;
                                fareOffer[k].fareCalculation = fareData.offers[0].offerItems[i].fareCalculation;
                                fareOffer[k].fareComponents = fareData.offers[0].offerItems[i].fareComponents;
                                fareOffer[k].offerItemId = fareData.offers[0].offerItems[i].offerItemId;
                                fareOffer[k].price = fareData.offers[0].offerItems[i].price;
                                fareOffer[k].price.fare = fareData.offers[0].reshopOfferInformation.reshopTicketingInformationWebResponse[i].reissuePrice;
                                fareOffer[k].price.tax = fareData.offers[0].price.tax;
                                fareOffer[k].price.penalty = fareData.offers[0].reshopOfferInformation.reshopTicketingInformationWebResponse[i].penalty;
                                fareOffer[k].passengerId = fareData.offers[0].offerItems[i].passengerIds[j];
                                k++;
                            }
                        }
                        for (i = 0; i < bookingInfo.order.orderItems.length; i++) {
                            if (fareData.offers[i]) {
                                bookingInfo.order.orderItems[i].price = fareData.offers[0].price;
                                if (bookingInfo.order.orderItems[i].passengerPrices) {
                                    for (j = 0; j < bookingInfo.order.orderItems[i].passengerPrices.length; j++) {
                                        k = 0;
                                        while (k < fareOffer.length) {
                                            if (bookingInfo.order.orderItems[i].passengerPrices[j].passengerId === fareOffer[k].passengerId) {
                                                bookingInfo.order.orderItems[i].passengerPrices[j].price = fareOffer[k].price;
                                                k = fareOffer.length;
                                            } else {
                                                k++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        bookingInfo.fareFamilyConditions = fareData.fareFamilyConditions;
                    }
                    return bookingInfo;
                }
            }

            function getPaymentMethodsError (error) {
                const errorObject = {
                    actualAttemps: self.numberAttemps,
                    paymentMethodCallback: paymentMethodsCallback,
                    response: error,
                    url: endpoint + orderId + '/payment-methods' + (issuerCountry && changeCountry ? '?issuerCountry=' + issuerCountry : '')
                };
                returnProcessedError(PmtHttpErrorFilter.handlePaymentInitDataError(error.errorCode, errorObject), error);

                function paymentMethodsCallback () {
                    self.numberAttemps++;
                    getPaymentMethods(orderId, issuerCountry, serviceURI, changeCountry);
                }
            }

        }

        ////////////////
        /**
         * Gets the PaymentMethods Additional Fields for a booking purchase. If there was and error in the http call,
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {String} orderId - the bookig order id to make the purchase
         * @param {String} paymentId - the payment id to make the purchase
         * @param {String} paymentType - the payment type to make the purchase
         * @param {String} paymentProvider - the payment provider to make the purchase
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getPaymentAdditionalFields (orderId, paymentId, paymentType, paymentProvider, serviceURI) {
            const endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.paymentMethodsAdditionalFieldsServiceURI;
            let defer = $q.defer();
            let numberAttemps = 0;
            PmtMethodsProxy.getPaymentAdditionalFields(endpoint + orderId + '/payment/' + paymentId + '/additional-fields/' + paymentType + (paymentProvider ? '/' + paymentProvider : ''))
                .then(getPaymentAdditionalFieldsSuccess, getPaymentAdditionalFieldsError);
            return defer.promise;

            function getPaymentAdditionalFieldsSuccess (paymentAdditionalFields) {
                defer.resolve({ paymentProvider: paymentProvider || paymentType, info: paymentAdditionalFields.data });
                defer = null;
                numberAttemps = 0;
            }


            function getPaymentAdditionalFieldsError (error) {
                const errorObject = {
                    actualAttemps: numberAttemps,
                    paymentMethodCallback: paymentMethodsAdditionalFieldsCallback,
                    response: error,
                    url: endpoint + orderId + '/payment/' + paymentId + '/additional-fields/' + paymentType + (paymentProvider ? '/' + paymentProvider : '')
                };
                returnLocalProcessedError(PmtHttpErrorFilter.handlePaymentInitDataError(error.errorCode, errorObject));

                function paymentMethodsAdditionalFieldsCallback () {
                    numberAttemps++;
                    getPaymentAdditionalFields(orderId, paymentId, paymentType, paymentProvider, serviceURI);
                }

                function returnLocalProcessedError (responseError) {
                    if (responseError) {
                        defer.reject(responseError);
                        defer = null;
                        numberAttemps = 0;
                    }
                }
            }

        }

        ////////////////
        /**
         * Updates the PaymentMethods Additional Fields for a booking purchase. If there was and error in the http call,
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {String} orderId - the bookig order id to make the purchase
         * @param {String} paymentId - the payment id to make the purchase
         * @param {String} paymentType - the payment type to make the purchase
         * @param {String} paymentProvider - the payment provider to make the purchase
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function updatePaymentAdditionalFields (orderId, paymentId, paymentType, paymentProvider, requestData, serviceURI) {
            const endpoint = serviceURI + PmtConstants.ENDPOINTS.DEFAULT.paymentMethodsAdditionalFieldsServiceURI;
            let numberAttemps = 0;
            self.defer = self.defer || $q.defer();
            PmtMethodsProxy.updatePaymentAdditionalFields(endpoint + orderId + '/payment/' + paymentId + '/additional-fields/' + paymentType + (paymentProvider ? '/' + paymentProvider : ''), requestData)
                .then(updatePaymentAdditionalFieldsSuccess, updatePaymentAdditionalFieldsError);
            return self.defer.promise;

            function updatePaymentAdditionalFieldsSuccess () {
                self.defer.resolve();
                self.defer = null;
                numberAttemps = 0;
            }

            function updatePaymentAdditionalFieldsCallback () {
                numberAttemps++;
                updatePaymentAdditionalFields(orderId, paymentId, paymentType, paymentProvider, requestData, serviceURI);
            }

            function updatePaymentAdditionalFieldsError (error) {
                const errorObject = {
                    actualAttemps: numberAttemps,
                    paymentMethodCallback: updatePaymentAdditionalFieldsCallback,
                    response: error,
                    url: endpoint + orderId + '/payment/' + paymentId + '/additional-fields/' + paymentType + (paymentProvider ? '/' + paymentProvider : ''),
                    requestMethod: 'POST'
                };
                returnLocalProcessedError(PmtHttpErrorFilter.errorHandlerFactory(error.errorCode, errorObject));

                function returnLocalProcessedError (responseError) {
                    if (responseError) {
                        self.defer.reject(responseError);
                        self.defer = null;
                        numberAttemps = 0;
                    }
                }
            }

        }

        /**
       * If there is a response error object as input, the function rejects the service promise and initialize service attributes
       * @param {Object} responseError - the processed http response error. It could be undefined or null
       */
        function returnProcessedError (responseError, errorData) {
            const errorComplete = {
                responseError: responseError,
                errorData: errorData
            };
            if (responseError) {
                self.defer.reject(errorComplete);
                self.defer = null;
                self.numberAttemps = 0;
            }
        }

        function updatePayments (selectedPaymentsMethods, paymentInfo, isselectedLoggedCard) {
            let paymentResultInfo = {
                isInsuranceWarning: false,
                warningText: ''
            };
            self.defer = self.defer || $q.defer();
            PmtAssFassAncillariesService.updatePayments(selectedPaymentsMethods, paymentInfo, isselectedLoggedCard).then(updatePaymentSucces
                , formCompletedError);

            return self.defer.promise;

            function updatePaymentSucces (response) {
                let i;
                if (response.failedToPay) {
                    if (response.failedToPay.length > 0) {
                        for (i = 0; i < response.failedToPay.length; i++) {
                            if (response.failedToPay[i].type === PmtConstants.ISSUED_TYPES.INSURANCE) {
                                paymentResultInfo = PmtAssFassTransformer.checkIfTextWarningDescription(response.warnings, paymentResultInfo);
                                angular.extend(response, paymentResultInfo);
                            }
                        }
                    }
                    self.defer.resolve(response);
                }
                self.defer.resolve(response);
                self.defer = null;
            }

            function formCompletedError (errorData) {
                self.defer.reject(errorData);
                self.defer = null;
            }
        }

        function getDownpaymentTotalAmountInstalments (calculateConditions, currency) {
            const copyCalculateConditions = [...calculateConditions].sort((a, b) => a.downpaymentTotalAmount.value - b.downpaymentTotalAmount.value);
            const returnValue = CurrencyService.formatPrice(currency, copyCalculateConditions[0].downpaymentTotalAmount.value, true);
            return returnValue;
        }
    }
})();
