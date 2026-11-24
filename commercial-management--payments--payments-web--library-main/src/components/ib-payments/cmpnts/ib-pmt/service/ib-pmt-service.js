(function () {
    'use strict';

    angular
        .module('ib-pmt-module')
        .service('PmtService', PmtService);

    PmtService.$inject = ['$q', '$rootScope', 'localStorageService', 'PmtTransformer', 'PmtMethodsService', 'PmtCreditCardsService', 'PmtIssueOrderService', 'PmtSummaryInfoQuotaService', 'PmtCountriesListService', 'PmtStatesListService', 'PmtCo2InfoService', 'PmtOnHoldOrderService', 'PmtConstants', 'PmtDonationsService', 'PmtUtilsTransformers', 'PmtCustomerDataService', 'PmtOnBusinessMembershipService', 'PmtOnBusinessEmployeesService', 'PmtChangeflightService', 'PmtConditionsService', 'PmtOnBCreditCardsService', 'PmtUpgradingBidService', 'PmtFullAviosService', 'PmtQuotaExtraInfoService', 'PmtTaxInfoService', 'PmtPaymentScriptsService', 'CommonsCustomerCreditCardService', 'PmtCustomerCardsFeesService', 'CommonsUserUtilsService'];
    function PmtService ($q, $rootScope, localStorageService, PmtTransformer, PmtMethodsService, PmtCreditCardsService, PmtIssueOrderService, PmtSummaryInfoQuotaService, PmtCountriesListService, PmtStatesListService, PmtCo2InfoService, PmtOnHoldOrderService, PmtConstants, PmtDonationsService, PmtUtilsTransformers, PmtCustomerDataService, PmtOnBusinessMembershipService, PmtOnBusinessEmployeesService, PmtChangeflightService, PmtConditionsService, PmtOnBCreditCardsService, PmtUpgradingBidService, PmtFullAviosService, PmtQuotaExtraInfoService, PmtTaxInfoService, PmtPaymentScriptsService, CommonsCustomerCreditCardService, PmtCustomerCardsFeesService, CommonsUserUtilsService) {
        const self = this;
        self.getPaymenMethodsInfo = getPaymenMethodsInfo;
        self.buildPaymentInfo = buildPaymentInfo;
        self.submitPayment = submitPayment;
        self.noPaymentConfirm = noPaymentConfirm;
        self.getSummaryInfoQuota = getSummaryInfoQuota;
        self.getConditionService = getConditionService;
        self.errorService = errorService;
        self.getIberiaPayQuotaOptions = getIberiaPayQuotaOptions;
        self.checkFullAvios = checkFullAvios;
        self.submitFullAvios = submitFullAvios;
        self.getScripts = getScripts;
        self.updateFollowCode = updateFollowCode;
        self.defer;
        self.numberAttemps = 0;

        ////////////////


        /**
         * Call all the necessary services and get the information before calling the paymentMethod.
         *Returns all the information model for the payments page.
         * @param {String} flowId identified flow
         * @param {String} issueCountry code issue country
         * @param {String} serviceURI end-point to call service
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getPaymenMethodsInfo (flowId, issueCountry, serviceURI, changeCountry) {
            const isUserLogged = localStorageService.get('userLogged') || null, co2Info = localStorageService.get('co2Info') || null;
            let codeCountrySelected = issueCountry || null;
            self.defer = self.defer || $q.defer();
			localStorageService.set('lastRequestedOrderId', flowId);
            PmtCountriesListService.getCountriesList(serviceURI).then(getCountriesListSucces, errorService);
            function getCountriesListSucces (countriesList) {
                codeCountrySelected = codeCountrySelected ? codeCountrySelected : countriesList && countriesList[0] ? countriesList[0].code : null;
                PmtStatesListService.getStatesList(codeCountrySelected, serviceURI).then(getStatesListSucces, errorService);
            }
            function getStatesListSucces () {
                PmtCreditCardsService.getCreditCardsImgs().then(getCreditCardsSuccess, getCreditCardsSuccess);
            }

            function getCreditCardsSuccess () {
                // if (co2Info === null && localStorageService.get('flowApp') !== PmtConstants.APP_TYPES.CHECKIN && localStorageService.get('flowApp') !== PmtConstants.APP_TYPES.GIFTCARDS) {
                //     PmtCo2InfoService.getCo2Info(PmtTransformer.createCo2Request(localStorageService.get('flowApp')), serviceURI).then(getCo2Success, getCo2Success);
                // } else {
                //     getCo2Success(co2Info);
                // };

                // function getCo2Success(co2InfoData) {
                //     if (co2InfoData && co2InfoData.errorCode) {
                //         co2Info = null;
                //     } else {
                //         co2Info = co2InfoData;
                //         localStorageService.set('co2Info', co2Info);
                // };
                buildPaymentInfo(flowId, codeCountrySelected, serviceURI, isUserLogged, changeCountry).then((paymentInfo) => {
                    self.defer.resolve(paymentInfo);
                    self.defer = null;
                }, errorService);

            }
            return self.defer.promise;

        }

        function updateFollowCode (quadrigam) {
            let codigoSeguimientoNew = '';
            const codigoSeguimientoOld = localStorageService.get('TrackingCode');
            if(codigoSeguimientoOld) {
                const codigoSeguimientoSplit = codigoSeguimientoOld.split('/')[2] = quadrigam;
                codigoSeguimientoNew = codigoSeguimientoOld.split('/')[0] + '/' + codigoSeguimientoOld.split('/')[1] + '/' + codigoSeguimientoSplit;
            }
            return codigoSeguimientoNew;
        }

        /**
         * You get all the necessary information before calling the paymentMethod and being able to show the payment view
         * @param {String} flowId Identified flow
         * @param {String} issueCountry code issue country
         * @param {String} serviceURI url to call service
         * @param {boolean} isUserLogged
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function buildPaymentInfo (flowId, issueCountry, serviceURI, isUserLogged, changeCountry) {
            const flowApp = localStorageService.get('flowApp');
            issueCountry = localStorageService.get('marketSaved') !== null && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED ? localStorageService.get('marketSaved') : issueCountry;
            self.defer = self.defer || $q.defer();

            if (isUserLogged && isUserLogged !== PmtConstants.LOGIN_ONB && !CommonsUserUtilsService.isSoftUser()) {
                CommonsCustomerCreditCardService.getCustomerCreditCards(true).then(getCustomerCreditCardsSuccess, getCustomerCreditCardsSuccess);
            } else if (isUserLogged && isUserLogged === PmtConstants.LOGIN_ONB) {
                PmtOnBCreditCardsService.getCustomerCreditCardsInfo(serviceURI).then(getCustomerCreditCardsSuccess, getCustomerCreditCardsSuccess);
            } else {
                getCustomerCreditCardsSuccess();
            }

            function getCustomerCreditCardsSuccess (customerCreditCards) {
                PmtMethodsService.getPaymentMethods(flowId, issueCountry, serviceURI, changeCountry, customerCreditCards).then(getPaymentMethodsSuccess, errorService);
            }

            function getPaymentMethodsSuccess (paymentData) {
                const promise = [], mapPromise = [];
                promise.push(PmtTaxInfoService.getTaxInfo(serviceURI));
                mapPromise.push('tax');
                if (paymentData.paymentInfo?.requiredAdditionalFields?.info?.IBERIA_PAY?.QUOTA) {
                    promise.push(PmtQuotaExtraInfoService.getQuotaExtraInfo(serviceURI));
                    mapPromise.push('quota');
                }
                if ((flowApp === PmtConstants.APP_TYPES.BOOKING || flowApp === PmtConstants.APP_TYPES.ONHOLD || flowApp === PmtConstants.APP_TYPES.SHUTTLE_OPEN || flowApp === PmtConstants.APP_TYPES.SHUTTLE_OPEN_ONB || flowApp === PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION || flowApp === PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION_ONB) && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
                    promise.push(PmtDonationsService.getAvailableDonations(serviceURI, flowId, paymentData.paymentInfo.paymentId));
                    mapPromise.push('donation');
                }
                if (paymentData.paymentInfo.customerCreditCards && ((paymentData.paymentInfo.customerCreditCards.IBERIA_PAY && paymentData.paymentInfo.customerCreditCards.IBERIA_PAY.length > 1)
                        || (paymentData.paymentInfo.customerCreditCards.ONHOLD_IBERIA_PAY && paymentData.paymentInfo.customerCreditCards.ONHOLD_IBERIA_PAY.length > 1))
                        && ['BBKI','MMBOH','MMBVC','MMBUNIF','PAOB','PAOBONB','PARE','PAREONB'].includes(flowApp)) {
                    const customerCardfeesRequest = PmtUtilsTransformers.customerCardfeesRequest(paymentData.paymentInfo.price.totalPrice, paymentData.paymentInfo.currency, paymentData.generalData.issuerCountry.code, paymentData.summaryInfo.trips, paymentData.paymentInfo.customerCreditCards.IBERIA_PAY ? paymentData.paymentInfo.customerCreditCards.IBERIA_PAY: paymentData.paymentInfo.customerCreditCards.ONHOLD_IBERIA_PAY);
                    promise.push(PmtCustomerCardsFeesService.getFeesforCustomerCards(customerCardfeesRequest));
                    mapPromise.push('customerCardfees');
                }
                if (promise.length > 0) {
                    $q.all(promise).then(getDonationAndQuotaSuccess, getDonationAndQuotaSuccess);
                } else {
                    self.defer.resolve(paymentData);
                }
                function getDonationAndQuotaSuccess (promiseResponse) {
                    let i;
                    for (i = 0; i < mapPromise.length; i++) {
                        switch (mapPromise[i]) {
                                case 'quota':
                                    if (promiseResponse[i]) {
                                        paymentData.paymentInfo.requiredAdditionalFields.info.IBERIA_PAY.QUOTA.quotaExtraInfo = promiseResponse[i];
                                    }
                                    break;
                                case 'donation':
                                    if (promiseResponse[i] && promiseResponse[i].availableDonations) {
                                        paymentData.donationsInfo = PmtUtilsTransformers.generateDonationsInfo(promiseResponse[i].availableDonations, paymentData.paymentInfo.currency, paymentData.paymentInfo.paymentMethods[0]);
                                    }
                                    break;
                                case 'tax':
                                    if (promiseResponse[i]) {
                                        paymentData.paymentInfo.relatedContent.taxInfoModal = promiseResponse[i];
                                    }
                                    break;
                                case 'customerCardfees':
                                    if (promiseResponse[i] && promiseResponse[i].ccFeeBinPrices && paymentData.paymentInfo.customerCreditCards.IBERIA_PAY) {
                                        paymentData.paymentInfo.customerCreditCards.IBERIA_PAY = PmtUtilsTransformers.customerCardsFeesResponse(paymentData, promiseResponse[i].ccFeeBinPrices);
                                    } else if (promiseResponse[i] && promiseResponse[i].ccFeeBinPrices && paymentData.paymentInfo.customerCreditCards.ONHOLD_IBERIA_PAY) {
                                        paymentData.paymentInfo.customerCreditCards.ONHOLD_IBERIA_PAY = PmtUtilsTransformers.customerCardsFeesResponse(paymentData, promiseResponse[i].ccFeeBinPrices);
                                    }
                        }
                    }
                    self.defer.resolve(paymentData);
                }
            }
            return self.defer.promise;
        }
        /**
         * Process to do pay
         * @param {Object} paymentInfo Object with all model information payment view
         * @param {String} serviceURI URL service
         * @param {Boolean} isRecall param to determinate the kind of the call
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function submitPayment (paymentInfo, serviceURI, isRecalled, onHoldPaymentPcc, idDcc) {
            let  typePaymentMethod, requestAdditionalFields, passengersContactData;
            const isRecall = isRecalled ? isRecalled : false, selectedMethod = paymentInfo.selectedData.selectedTab, paymentCallBack = localStorageService.get('redirectionPaymentCallback') ? localStorageService.get('redirectionPaymentCallback').redirectStatus : false;
            const orderItemsId = localStorageService.get('orderItemsId');
            const ident = localStorageService.get('pmtModelInfo').ident;
            const requestInfo = PmtTransformer.createRequestInfo(ident, paymentInfo, orderItemsId, onHoldPaymentPcc, isRecall, idDcc);
            const isCheckinFlow = localStorageService.get('flowApp') === PmtConstants.APP_TYPES.CHECKIN;
            self.defer = self.defer || $q.defer();
            if (paymentInfo.paymentInfo.requiredAdditionalFields && paymentInfo.paymentInfo.requiredAdditionalFields.paymentMethods.length > 0 && !paymentCallBack) {
                if (requestInfo.issuePaymentRequest.paymentMethod) {
                    typePaymentMethod = requestInfo.issuePaymentRequest.paymentMethod.type;
                } else if (requestInfo.issuePaymentRequest.paymentMethodWeb) {
                    typePaymentMethod = requestInfo.issuePaymentRequest.paymentMethodWeb.type;
                }

                requestAdditionalFields = PmtTransformer.createRequiredAdditionalFieldsRequest(paymentInfo.paymentInfo.requiredAdditionalFields, typePaymentMethod || paymentInfo.paymentInfo.requiredAdditionalFields.paymentMethods[selectedMethod].provider, paymentInfo.paymentInfo.selectedPaymentInfo.selectedCard || paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard);
                if (isCheckinFlow && requestAdditionalFields.payer) {
                    passengersContactData = localStorageService.get('passengersContactData');
                    requestAdditionalFields.payer.email = passengersContactData[0].email;
                    requestAdditionalFields.payer.phone = passengersContactData[0].phone;

                }
                PmtMethodsService.updatePaymentAdditionalFields(ident, paymentInfo.paymentInfo.paymentId, typePaymentMethod, paymentInfo.paymentInfo.requiredAdditionalFields.paymentMethods[selectedMethod] ? paymentInfo.paymentInfo.requiredAdditionalFields.paymentMethods[selectedMethod].provider : null, requestAdditionalFields, serviceURI).then(payOrder, errorService);
            } else {
                payOrder();
            }

            function payOrder () {
                const flowApp = localStorageService.get('flowApp');
                switch (flowApp) {
                        case PmtConstants.APP_TYPES.CHECKIN:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
                        case PmtConstants.APP_TYPES.BOOKING:
                        case PmtConstants.APP_TYPES.SHUTTLE_OPEN:
                        case PmtConstants.APP_TYPES.SHUTTLE_OPEN_ONB:
                        case PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION:
                        case PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION_ONB:
                        case PmtConstants.APP_TYPES.GIFTCARDS:
                            if (paymentInfo.paymentInfo.isOnHoldOrder || onHoldPaymentPcc) {
                                onHold();
                            } else {
                                issueOrder();
                            }
                            break;
                        case PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS:
                            if (paymentInfo.paymentInfo.isOnHoldOrder || onHoldPaymentPcc) {
                                onHold();
                            } else {
                                issueOrder();
                            }
                            break;
                        case PmtConstants.APP_TYPES.ONHOLD:
                            onHold();
                            break;
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED:
                            changeFlight();
                            break;
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS:
                            upgradingBids();
                            break;

                }
            }

            function issueOrder () {
                let isLogged;
                PmtIssueOrderService.issueOrder(serviceURI, requestInfo.issuePaymentRequest, ident, isRecall, paymentInfo.paymentInfo.requiredAdditionalFields ? paymentInfo.paymentInfo.requiredAdditionalFields : null).then((confirmOrderInfo) => {
                    const userLogged = localStorageService.get('userLogged');
                    localStorageService.set('issueOrderInfo', confirmOrderInfo);
                    if (userLogged) {
                        isLogged = localStorageService.get('userLogged');
                        let iberiaPayIndex, isCofAvaiable;

                        if(confirmOrderInfo.data) {
                            if(confirmOrderInfo.data.paymentItems) {
                                iberiaPayIndex = confirmOrderInfo.data.paymentItems.findIndex((element)=>{return element.type===PmtConstants.PAYMENT_TYPES.IBERIA_PAY;});
                                isCofAvaiable = confirmOrderInfo.data.paymentItems?.[iberiaPayIndex]?.cofInclusion || false;
                            }else{
                                iberiaPayIndex = confirmOrderInfo.data.paidItems.findIndex((element)=>{return element.paymentType===PmtConstants.PAYMENT_TYPES.IBERIA_PAY;});
                                isCofAvaiable = confirmOrderInfo.data.paidItems[iberiaPayIndex]?.cofInclusion || false;
                            }

                        }else{
                            isCofAvaiable = confirmOrderInfo.paymentInfo?.cofInclusion || false;
                        }

                        if (paymentInfo.paymentInfo.selectedPaymentInfo.saveCustomerCard) {

                            CommonsCustomerCreditCardService.addCustomerCreditCardAfterPayment(PmtTransformer.createCustomerCreditCardSaveRequest(paymentInfo,isCofAvaiable)).then((response) => {

                                localStorageService.set('customerCardSaved', true);
                                issueOrderSucces(confirmOrderInfo);
                            }, () => {
                                issueOrderSucces(confirmOrderInfo);
                            });
                        } else if (localStorageService.get('userLogged') === PmtConstants.LOGIN_ONB && $rootScope.isPointsOBFlow) {
                            PmtOnBusinessMembershipService.getOnBusinessMembership().then(() => {
                                PmtOnBusinessEmployeesService.getOnBusinessEmployees().then(() => {
                                    $rootScope.isLogged = userLogged;
                                    localStorageService.set('userLogged', isLogged);
                                    issueOrderSucces(confirmOrderInfo);
                                }, (error) => {
                                    if (error.errorCode === 403) {
                                        $rootScope.isLogged = isLogged;
                                        localStorageService.set('userLogged', isLogged);
                                        issueOrderSucces(confirmOrderInfo);
                                    } else {
                                        checkCustomerStatusError(error);
                                        issueOrderSucces(confirmOrderInfo);
                                    }
                                });
                            }, checkCustomerStatusError);
                        } else if (localStorageService.get('selectedFareRedemptionData')?.fareAviosPerPassenger >0 ||localStorageService.get('paymentsInfo').appliedDiscounts.types?.AVIOS?.id > 0) {
                            localStorageService.set('reloadCustomerComplete', true);
                            PmtCustomerDataService.getCustomerData().then(() => {
                                sessionStorage.removeItem('customerData');
                                issueOrderSucces(confirmOrderInfo);
                            }, () => {
                                issueOrderSucces(confirmOrderInfo);
                            });
                        } else {
                            if(!paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard?.cof && isCofAvaiable) {
                                const transformedResponse = PmtTransformer.createCustomerCCUpdateRequest(paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard, paymentInfo.paymentInfo.currency.code);
                                CommonsCustomerCreditCardService.updateCreditCardComplete(transformedResponse, transformedResponse.profileCardId).then(()=>{
                                    issueOrderSucces(confirmOrderInfo);

                                },()=>{
                                    issueOrderSucces(confirmOrderInfo);
                                });
                            }else{

                                issueOrderSucces(confirmOrderInfo);
                            }
                        }

                    } else {
                        issueOrderSucces(confirmOrderInfo);
                    }
                }, errorService);
                function issueOrderSucces (confirmOrderInfo) {
                    self.defer.resolve(confirmOrderInfo);
                    self.defer = null;
                }
            }

            function checkCustomerStatusError (error) {
                $rootScope.isLogged = false;
                $rootScope.customerData = null;
                updateStateToAnonymous();
                localStorageService.set('userLogged', false);
                error.title = BookingAppConstants.bookingErrorsService.LOGGED_ERROR_TITLE;
                if (!$rootScope.isRedemptionFlow) error.message = BookingAppConstants.bookingErrorsService.LOGGED_ERROR_BODY;
                error.needsTranslate = true;
                defer.reject(error);
            }

            function onHold () {
                PmtOnHoldOrderService.onHoldOrder(serviceURI, requestInfo.issuePaymentRequest, ident, isRecall).then((confirmOrderInfo) => {
                    localStorageService.set('issueOrderInfo', confirmOrderInfo);
                    if (localStorageService.get('userLogged')) {
                        const iberiaPayIndex = confirmOrderInfo.data.paymentItems.findIndex((element)=>{return element.type==='IBERIA_PAY';});
                        const isCofAvaiable = confirmOrderInfo.data.paymentItems?.[iberiaPayIndex]?.cofInclusion || false;
                        if (paymentInfo.paymentInfo.selectedPaymentInfo.saveCustomerCard) {
                            CommonsCustomerCreditCardService.addCustomerCreditCardAfterPayment(PmtTransformer.createCustomerCreditCardSaveRequest(paymentInfo,isCofAvaiable)).then(() => {
                                localStorageService.set('customerCardSaved', true);
                                onHoldOrderSucces(confirmOrderInfo);
                            }, () => {
                                onHoldOrderSucces(confirmOrderInfo);
                            });
                        } else {
                            if(!paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard?.cof && isCofAvaiable) {
                                const transformedResponse = PmtTransformer.createCustomerCCUpdateRequest(paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard, paymentInfo.paymentInfo.currency.code);
                                CommonsCustomerCreditCardService
                                    .updateCreditCardComplete(transformedResponse, transformedResponse.profileCardId)
                                    .then(()=>{
                                        onHoldOrderSucces(confirmOrderInfo);
                                    },
                                    ()=>{
                                        onHoldOrderSucces(confirmOrderInfo);
                                    });
                            }else{
                                onHoldOrderSucces(confirmOrderInfo);
                            }
                        }
                    } else {
                        onHoldOrderSucces(confirmOrderInfo);
                    }
                }, errorService);
                function onHoldOrderSucces (confirmOrderInfo) {
                    self.defer.resolve(confirmOrderInfo);
                    self.defer = null;
                }
            }

            function changeFlight () {
                PmtChangeflightService.changeFlightOrder(serviceURI, requestInfo.issuePaymentRequest, ident, isRecall, paymentInfo.paymentInfo.requiredAdditionalFields ? paymentInfo.paymentInfo.requiredAdditionalFields : null).then((confirmOrderInfo) => {
                    localStorageService.set('issueOrderInfo', confirmOrderInfo);
                    if (localStorageService.get('userLogged')) {

                        const iberiaPayIndex = confirmOrderInfo.data.paymentsInfo.findIndex((element)=>{return element.method.type.toUpperCase()==='IBERIA_PAY';});
                        const isCofAvaiable = confirmOrderInfo.data.paymentsInfo?.[iberiaPayIndex]?.additionalInfo.cofInclusion || false;

                        if (paymentInfo.paymentInfo.selectedPaymentInfo.saveCustomerCard) {
                            CommonsCustomerCreditCardService.addCustomerCreditCardAfterPayment(PmtTransformer.createCustomerCreditCardSaveRequest(paymentInfo, isCofAvaiable)).then(() => {
                                localStorageService.set('customerCardSaved', true);
                                changeflightOrderSucces(confirmOrderInfo);
                            }, () => {
                                changeflightOrderSucces(confirmOrderInfo);
                            });
                        } else {
                            if(!paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard?.cof && isCofAvaiable) {
                                const transformedResponse = PmtTransformer.createCustomerCCUpdateRequest(paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard, paymentInfo.paymentInfo.currency.code);
                                CommonsCustomerCreditCardService
                                    .updateCreditCardComplete(transformedResponse, transformedResponse.profileCardId)
                                    .then(()=>{
                                        changeflightOrderSucces(confirmOrderInfo);
                                    },
                                    ()=>{
                                        changeflightOrderSucces(confirmOrderInfo);
                                    });
                            } else{
                                changeflightOrderSucces(confirmOrderInfo);

                            }
                        }
                    } else {
                        changeflightOrderSucces(confirmOrderInfo);
                    }
                }, errorService);
                function changeflightOrderSucces (confirmOrderInfo) {
                    self.defer.resolve(confirmOrderInfo);
                    self.defer = null;
                }
            }

            function upgradingBids () {
                localStorageService.set('upgradingBidRequest', requestInfo);
                if(isRecall && (isRecall === 'FULL_PAY_AVIOS' || isRecall === 'COUPONS')) {
                    localStorageService.set('UPG_BIDS_AVIOS', true);
                }
                PmtUpgradingBidService.upgradingBidOrder(serviceURI, requestInfo.issuePaymentRequest, ident, isRecall, paymentInfo.paymentInfo.requiredAdditionalFields ? paymentInfo.paymentInfo.requiredAdditionalFields : null).then((confirmOrderInfo) => {
                    localStorageService.set('issueOrderInfo', PmtTransformer.createConfirmOrderInfo());
                    if (localStorageService.get('userLogged')) {
                        const  isCofAvaiable = confirmOrderInfo.paymentInfo?.cofInclusion || false;
                        if (paymentInfo.paymentInfo.selectedPaymentInfo.saveCustomerCard) {
                            CommonsCustomerCreditCardService.addCustomerCreditCardAfterPayment(PmtTransformer.createCustomerCreditCardSaveRequest(paymentInfo,isCofAvaiable)).then(() => {
                                localStorageService.set('customerCardSaved', true);
                                upgradingBidsSucces(confirmOrderInfo);
                            }, () => {
                                upgradingBidsSucces(confirmOrderInfo);
                            });
                        } else {
                            if(!paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard?.cof && isCofAvaiable) {
                                const transformedResponse = PmtTransformer.createCustomerCCUpdateRequest(paymentInfo.paymentInfo.selectedPaymentInfo.selectedLoggedCard, paymentInfo.paymentInfo.currency.code);
                                CommonsCustomerCreditCardService
                                    .updateCreditCardComplete(transformedResponse, transformedResponse.profileCardId)
                                    .then(()=>{
                                        upgradingBidsSucces(confirmOrderInfo);
                                    },
                                    ()=>{
                                        upgradingBidsSucces(confirmOrderInfo);
                                    });
                            } else{
                                upgradingBidsSucces(confirmOrderInfo);
                            }
                        }
                    } else {
                        upgradingBidsSucces(confirmOrderInfo);
                    }
                }, errorService);
                function upgradingBidsSucces (confirmOrderInfo) {
                    self.defer?.resolve(confirmOrderInfo);
                    self.defer = null;
                }
            }
            return self.defer.promise;
        }

        /**
         * Get quota summary info .
         * @param {*} quotaSelected
         * @param {*} paymentId
         * @param {*} cardTypeId
         * @param {*} aviosSelected
         * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
         *  When the promise rejects, it returns an object with the error data to show in the view
         */
        function getSummaryInfoQuota (serviceURI, quotaSelected, paymentId, cardTypeId, aviosSelected) {
            const requestData = PmtTransformer.createSummaryInfoQuotaRequest(quotaSelected, paymentId, cardTypeId, aviosSelected);
            self.defer = self.defer || $q.defer();
            PmtSummaryInfoQuotaService.getSummaryInfoQuota(serviceURI, requestData).then(getSummaryInfoQuotaSucces, errorService);

            return self.defer.promise;

            function getSummaryInfoQuotaSucces (summaryQuota) {
                self.defer.resolve(summaryQuota);
                self.defer = null;
            }
        }
        function getIberiaPayQuotaOptions (serviceURI, paymentId, vault, expiryDate, cardTypeId, quotaSelected) {
            const requestData = PmtTransformer.createIberiaPayQuotaInfoRequest(paymentId, vault, expiryDate, cardTypeId, quotaSelected);
            self.defer = self.defer || $q.defer();
            PmtSummaryInfoQuotaService.getIberiaPayQuotaOptions(serviceURI, requestData).then(getIberiaPayQuotaOptionsSucces, errorService);

            return self.defer.promise;

            function getIberiaPayQuotaOptionsSucces (summaryQuota) {
                self.defer.resolve(summaryQuota);
                self.defer = null;
            }
        }

        /**
         * If there was and error in the http call,
         * this method treats these http error code and returns the object to show an error in the view.
         * @param {*} responseError
         */
        function errorService (responseError) {
            if (responseError && self.defer) {
                self.defer.reject(responseError);
                self.defer = null;
                self.numberAttemps = 0;
            }
        }
        function noPaymentConfirm (serviceURI, isRecall) {
            const ident = localStorageService.get('bookingInfo').flowId ? localStorageService.get('bookingInfo').flowId : localStorageService.get('flowId'),
                orderItemsId = localStorageService.get('orderItemsId'),
                requestInfo = PmtTransformer.createRequestInfo(ident, null, orderItemsId);
            self.defer = self.defer || $q.defer();
            PmtChangeflightService.changeFlightOrder(serviceURI, requestInfo.issuePaymentRequest, ident, isRecall, null).then((confirmOrderInfo) => {
                localStorageService.set('issueOrderInfo', confirmOrderInfo);
                changeflightOrderSucces(confirmOrderInfo);
            }, errorService);
            function changeflightOrderSucces (confirmOrderInfo) {
                self.defer.resolve(confirmOrderInfo);
                self.defer = null;
            }
            return self.defer.promise;
        }
        function getConditionService (flowId, serviceURI) {
            let defer = $q.defer();
            PmtConditionsService.getPaymentConditions(flowId, serviceURI).then(getPaymentConditionsSuccess, getPaymentConditionsSuccess);
            function getPaymentConditionsSuccess (data) {
                defer.resolve(data);
                defer = null;
            }
            return defer.promise;
        }

        function submitFullAvios (flowId, issueCountry, serviceURI) {
            self.defer = self.defer || $q.defer();

            PmtMethodsService.getPaymentMethods(flowId, issueCountry, serviceURI).then(callIssueFullAvios, errorService);
            function callIssueFullAvios (response) {
                submitPayment(response, serviceURI);
            }
            return self.defer.promise;
        }

        /**
         *
         * @param {*} fullAvios
         */
        function checkFullAvios (fullAvios) {
            let orderId;
            const orderflow = localStorageService.get('createOrderData');
            const paymentId = localStorageService.get('paymentsInfo').paymentId;
            const requestData = PmtTransformer.createFullAviosRequest(fullAvios);
            self.defer = self.defer || $q.defer();
            if (orderflow) {
                orderId = orderflow.order.orderId;
            } else {
                orderId = localStorageService.get('flowId');
            }
            PmtFullAviosService.getFullAvios(orderId, paymentId, $rootScope.serviceURI, requestData).then(getCheckFullAviosSuccess, errorService);
            function getCheckFullAviosSuccess (fullAviosResponse) {
                self.defer.resolve(fullAviosResponse);
                self.defer = null;
            }
            return self.defer.promise;
        }
        function getScripts (paymentInfo, selectedTab) {
            const defer = $q.defer();
            PmtPaymentScriptsService.getAll(paymentInfo).then( (scriptList) => {
                let i, j;
                for (i = 0; i < scriptList.length; i++) {
                    for (j = 0; j < paymentInfo.paymentMethods.length; j++) {
                        if (scriptList[i]?.calculateConditions && paymentInfo.paymentMethods[j].provider === 'NEMURU') {
                            paymentInfo.paymentMethods[j].downpaymentTotalAmount = PmtMethodsService.getDownpaymentTotalAmountInstalments(scriptList[i].calculateConditions, paymentInfo.currency);
                        }
                        if (scriptList[i].hasOwnProperty(paymentInfo.paymentMethods[j].type)) {
                            paymentInfo.paymentMethods[j].scriptdownloaded = scriptList[i][paymentInfo.paymentMethods[j].type];
                            if(paymentInfo.paymentMethods[j].scriptdownloaded !== 'success') {
                                paymentInfo.paymentMethods.splice(j, 1);
                                selectedTab = selectedTab > j ? selectedTab - 1: selectedTab;
                            }
                        } else if (scriptList[i].hasOwnProperty(paymentInfo.paymentMethods[j].type + paymentInfo.paymentMethods[j].provider)) {
                            paymentInfo.paymentMethods[j].scriptdownloaded = scriptList[i][paymentInfo.paymentMethods[j].type + paymentInfo.paymentMethods[j].provider];
                            if(paymentInfo.paymentMethods[j].scriptdownloaded !== 'success') {
                                paymentInfo.paymentMethods.splice(j, 1);
                            }
                        }
                    }
                }
                defer.resolve({paymentInfo: paymentInfo, selectedTab: selectedTab });
            });
            return defer.promise;
        }
    }
})();