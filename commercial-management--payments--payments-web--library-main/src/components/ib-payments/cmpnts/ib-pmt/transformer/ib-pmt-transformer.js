import angular, { isUndefined } from 'angular';

(function () {
    'use strict';

    angular
        .module('ib-pmt-module')
        .factory('PmtTransformer', PmtTransformer);

    PmtTransformer.$inject = ['$rootScope', 'localStorageService', 'PmtConstants', 'PmtUtilsService', 'CurrencyService', '$filter'];
    function PmtTransformer ($rootScope, localStorageService, PmtConstants, PmtUtilsService, CurrencyService, $filter) {
        const service = {
            getPaymentsModel: getPaymentsModel,
            createRequestInfo: createRequestInfo,
            createRequiredAdditionalFieldsRequest: createRequiredAdditionalFieldsRequest,
            createSummaryInfoQuotaRequest: createSummaryInfoQuotaRequest,
            createIberiaPayQuotaInfoRequest: createIberiaPayQuotaInfoRequest,
            createCustomerCreditCardSaveRequest: createCustomerCreditCardSaveRequest,
            createCustomerCCUpdateRequest : createCustomerCCUpdateRequest,
            createCo2Request: createCo2Request,
            createFullAviosRequest: createFullAviosRequest,
            noPaymentModel: noPaymentModel,
            createConfirmOrderInfo: createConfirmOrderInfo
        };
        return service;

        ////////////////


        /**
         *Returns the model of each of the applications
         */
        function getPaymentsModel () {
            const flowApp = localStorageService.get('flowApp') || null;
            let  model;
            model = getGeneralModel(flowApp);
            switch (flowApp) {
                    case 'BBKI':
                    case 'BBKIOH':
                        model = getBBKIModel(flowApp);
                        break;
                    case 'MMBOH':
                        model = getMMBOHModel();
                        break;
                    case 'MMBANC':
                        model = getMMBANCModel();
                        break;
                    case 'MMBBID':
                        model = getMMBANCModel();
                        break;
                    case 'MMBVC':
                        model = getMMBVCModel();
                        break;
                    case 'MMBUNIF':
                        model = getMMBVCModel();
                        break;
                    case 'CKI':
                        model = getCKIModel();
                        break;
                    case 'MMB':
                        getMMBModel();
                        break;
                    case 'PAOB':
                        model = getPAOBModel();
                        break;
                    case 'PAOBONB':
                        model = getPAOBONBModel();
                        break;
                    case 'PARE':
                        model = getPAREModel();
                        break;
                    case 'PAREONB':
                        model = getPAREONBModel();
                        break;
                    case 'GIFTCARDS':
                        model = getGIFTCARDSModel();
                        break;
                    case 'SUBSCRIPTIONMODELS':
                        model = getSUBSCRIPTIONModel();
                        break;
                    default:
            }

            function getGeneralModel (flowApp) {
                return {
                    originFlow: flowApp
                };
            }

            /**
             * Create Model to search all information about payments in flow 'Booking'
             */
            function getBBKIModel (flowApp) {
                let BBKIModel = {};
                const orderInfo = localStorageService.get('createOrderData');
                BBKIModel = {
                    ident: orderInfo.order.orderId,
                    issueCountry: $rootScope.appMarket || null
                };

                if ($rootScope.isRedemptionFlow) {
                    if ($rootScope.isPointsOBFlow) {
                        BBKIModel.quadrigams = {
                            payments: PmtConstants.QUADRIGAMS.BKI_ONB_REDENTION_PAYMENT,
                            confirmation: PmtConstants.QUADRIGAMS.BKI_ONB_REDENTION_CONFIRMATION
                        };
                    } else {
                        BBKIModel.quadrigams = {
                            payments: PmtConstants.QUADRIGAMS.BKI_REDENTION_PAYMENT,
                            confirmation: PmtConstants.QUADRIGAMS.BKI_REDENTION_CONFIRMATION,
                            communication_lost: PmtConstants.QUADRIGAMS.BKI_COMMUNICATION_LOST
                        };
                    }
                } else if (localStorageService.get('isHMAD')) {
                    BBKIModel.quadrigams = {
                        payments: PmtConstants.QUADRIGAMS.HMAD_PAYMENTS,
                        confirmation: PmtConstants.QUADRIGAMS.HMAD_CONFIRMATION,
                        communication_lost: PmtConstants.QUADRIGAMS.HMAD_CONFIRMATION_COMMUNICATION_LOST
                    };
                } else if (localStorageService.get('multiCitySearch')) {
                    BBKIModel.quadrigams = {
                        payments: flowApp === PmtConstants.APP_TYPES.ONHOLD ? PmtConstants.QUADRIGAMS.BKIOH_PAYMENT : PmtConstants.QUADRIGAMS.MULTI_PAYMENTS,
                        confirmation: flowApp === PmtConstants.APP_TYPES.ONHOLD ? PmtConstants.QUADRIGAMS.BKIOH_CONFIRMATION : PmtConstants.QUADRIGAMS.MULTI_CONFIRMATION,
                        communication_lost: PmtConstants.QUADRIGAMS.MULTI_CONFIRMATION_COMMUNICATION_LOST
                    };
                } else {
                    BBKIModel.quadrigams = {
                        payments: flowApp === PmtConstants.APP_TYPES.ONHOLD ? PmtConstants.QUADRIGAMS.BKIOH_PAYMENT : PmtConstants.QUADRIGAMS.BKI_PAYMENT,
                        confirmation: flowApp === PmtConstants.APP_TYPES.ONHOLD ? PmtConstants.QUADRIGAMS.BKIOH_CONFIRMATION : PmtConstants.QUADRIGAMS.BKI_CONFIRMATION,
                        communication_lost: PmtConstants.QUADRIGAMS.BKI_COMMUNICATION_LOST
                    };
                }

                return BBKIModel;
            }


            /**
             *  Create Model to search all information about payments in flow 'Manage my booking onhold'
             * @param {Object}
             * @returns {Object} the payments page model
             */
            function getMMBOHModel () {
                let MmbOHModel = {};
                const bookingInfo = localStorageService.get('bookingInfo');
                MmbOHModel = {
                    ident: bookingInfo.flowId,
                    issueCountry: bookingInfo.contextMetadata.country,
                    quadrigams: {
                        payments: PmtConstants.QUADRIGAMS.ON_HOLD_CONF_PAYMENT,
                        confirmation: PmtConstants.QUADRIGAMS.ON_HOLD_CONF_CONFIRMATION,
                        communication_lost: PmtConstants.QUADRIGAMS.MMBOH_COMMUNICATION_LOST
                    }
                };
                return MmbOHModel;
            }


            /**
             *  Create Model to search all information about payments in flow 'PAOBONB'
             * @returns {Object} the payments page model
             */
            function getPAOBONBModel () {
                let PAOBONBModel = {};
                const orderInfo = localStorageService.get('createOrderData');
                PAOBONBModel = {
                    ident: orderInfo.order.orderId,
                    issueCountry: $rootScope.appMarket || null,
                    quadrigams: {
                        payments: PmtConstants.QUADRIGAMS.PA_PAOBONB_PAYMENTS,
                        confirmation: PmtConstants.QUADRIGAMS.PA_PAOBONB_PAYMENTS_CONFIRMATION,
                        error: PmtConstants.QUADRIGAMS.PA_PAOBONB_PAYMENTS_ERROR
                    }
                };
                return PAOBONBModel;
            }

            /**
             *  Create Model to search all information about payments in flow 'PAREONB'
             * @returns {Object} the payments page model
             */
            function getPAREONBModel () {
                let PAREONBModel = {};
                const orderInfo = localStorageService.get('createOrderData');
                PAREONBModel = {
                    ident: orderInfo.order.orderId,
                    issueCountry: $rootScope.appMarket || null,
                    quadrigams: {
                        payments: PmtConstants.QUADRIGAMS.PA_PAREONB_PAYMENTS,
                        confirmation: PmtConstants.QUADRIGAMS.PA_PAREONB_PAYMENTS_CONFIRMATION,
                        error: PmtConstants.QUADRIGAMS.PA_PAREONB_PAYMENTS_ERROR
                    }
                };
                return PAREONBModel;
            }

            /**
             *  Create Model to search all information about payments in flow 'PAOB'
             * @returns {Object} the payments page model
             */
            function getPAOBModel () {
                let PAOBModel = {};
                const orderInfo = localStorageService.get('createOrderData');
                PAOBModel = {
                    ident: orderInfo.order.orderId,
                    issueCountry: $rootScope.appMarket || null,
                    quadrigams: {
                        payments: PmtConstants.QUADRIGAMS.PA_PAOB_PAYMENTS,
                        confirmation: PmtConstants.QUADRIGAMS.PA_PAOB_PAYMENTS_CONFIRMATION,
                        error: PmtConstants.QUADRIGAMS.PA_PAOB_PAYMENTS_ERROR
                    }
                };
                return PAOBModel;
            }

            /**
             *  Create Model to search all information about payments in flow 'PARE'
             * @returns {Object} the payments page model
             */
            function getPAREModel () {
                let PAREModel = {};
                const orderInfo = localStorageService.get('createOrderData');
                PAREModel = {
                    ident: orderInfo.order.orderId,
                    issueCountry: $rootScope.appMarket || null,
                    quadrigams: {
                        payments: PmtConstants.QUADRIGAMS.PA_PARE_PAYMENTS,
                        confirmation: PmtConstants.QUADRIGAMS.PA_PARE_PAYMENTS_CONFIRMATION,
                        error: PmtConstants.QUADRIGAMS.PA_PARE_PAYMENTS_ERROR
                    }
                };
                return PAREModel;
            }

            /**
             *  Create Model to search all information about payments in flow 'Manage my booking Ancillaries'
             * @returns {Object} the payments page model
             */
            function getMMBANCModel () {
                let i, paymentQuadrigam, confirmationQuadrigam, model = {};
                const bookingInfo = localStorageService.get('bookingInfo'), breakdownInfo = localStorageService.get('breakdownInfo'), flowId = bookingInfo.flowId ? bookingInfo.flowId : localStorageService.get('flowId'), deepLinkFlow = localStorageService.get('deepLinkData') || null;

                if (breakdownInfo && breakdownInfo.ancillaries) {
                    if (breakdownInfo.ancillaries.length > 1) {
                        paymentQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_PAYMENT;
                        confirmationQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CONFIRMATION;
                    } else {
                        for (i = 0; i < breakdownInfo.ancillaries.length; i++) {
                            switch (breakdownInfo.ancillaries[i].type) {
                                    case PmtConstants.ANCILLARIES_TYPES.BAGGAGE:
                                        paymentQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_BAGGAGES_PAYMENT;
                                        confirmationQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_BAGGAGES_CONFIRMATION;
                                        break;

                                    case PmtConstants.ANCILLARIES_TYPES.SEAT:
                                        paymentQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_SEATS_PAYMENT;
                                        confirmationQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_SEATS_CONFIRMATION;
                                        break;

                                    case PmtConstants.ANCILLARIES_TYPES.INSURANCE:
                                        paymentQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_PAYMENT;
                                        confirmationQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CONFIRMATION;
                                        break;

                                    case PmtConstants.ANCILLARIES_TYPES.UPGRADING:
                                        paymentQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_UPG_PAYMENT;
                                        confirmationQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_UPG_CONFIRMATION;
                                        break;

                                    default:
                                        paymentQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_PAYMENT;
                                        confirmationQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CONFIRMATION;
                                        break;
                            }
                        }
                    }
                } else {
                    if (deepLinkFlow) {
                        paymentQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_DEEPLINK_PAYMENT;
                        confirmationQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_DEEPLINK_CONFIRMATION;
                    } else {
                        paymentQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_PAYMENT;
                        confirmationQuadrigam = PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CONFIRMATION;
                    }
                }

                model = {
                    ident: flowId,
                    issueCountry: localStorageService.get('marketSaved') === null ? $rootScope.appMarket : localStorageService.get('marketSaved'),
                    quadrigams: {
                        payments: paymentQuadrigam,
                        confirmation: confirmationQuadrigam
                    }
                };
                return model;
            }
            /**
             *  Create Model to search all information about payments in flow 'Manage my booking Voluntary Change'
             * @param {Object}
             * @returns {Object} the payments page model
             */
            function getMMBVCModel () {
                let model = {};
                const bookingInfo = localStorageService.get('bookingInfo');
                const flowId = bookingInfo.flowId ? bookingInfo.flowId : localStorageService.get('flowId');
                model = {
                    ident: flowId,
                    issueCountry: localStorageService.get('marketSaved') === null ? $rootScope.appMarket : localStorageService.get('marketSaved'),
                    quadrigams: {
                        payments: PmtConstants.QUADRIGAMS.MMB_VOLUNTARY_CHANGE_PAYMENT,
                        confirmation: PmtConstants.QUADRIGAMS.MMB_VOLUNTARY_CHANGE_CONFIRMATION
                    }
                };
                return model;
            }

            function getCKIModel () {
                let ckiModel = {};
                const bookingInfo = localStorageService.get('bookingInfo'), issueCountrySummary = localStorageService.get('summaryInfo').context.issueCountry;
                ckiModel = {
                    ident: bookingInfo.checkinId,
                    issueCountry: issueCountrySummary || null,
                    quadrigams: {
                        payments: PmtConstants.QUADRIGAMS.CKI_PAYMENT,
                        confirmation: PmtConstants.QUADRIGAMS.CKI_CONFIRMATION
                    }
                };
                return ckiModel;
            }

            function getMMBModel () {

            }
            localStorageService.set('pmtModelInfo', model);
            return model;
        }


        ////////////////

        /**
         * Return object with all information necesary  to call issue service and do pay
         * @param {String} requestId Is code of order to identified flow
         * @param {Object} paymentData Object with all model info payment view
         * @param {Array<Strings>} orderItemsId Array with Strings code  identified
         */
        function createRequestInfo (requestId, paymentData, orderItemsId, onHoldPaymentPcc, isRecall, idDcc) {
            let passengers, passengersContactData;
            const paymentRequest = { issuePaymentRequest: createIssuePaymentRequest(requestId, paymentData, orderItemsId, isRecall) };
            return paymentRequest;

            function createIssuePaymentRequest (requestId, paymentData, orderItemsId, isRecall) {
                const flowApp = localStorageService.get('flowApp');
                let issuePaymentRequest = (flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) ? {
                    orderItemsId: orderItemsId,
                    paymentId: localStorageService.get('errorIssueService') ? localStorageService.get('errorIssueService').data.paymentOptions.paymentId : paymentData.paymentInfo.paymentId,
                    paymentMethod: onHoldPaymentPcc ? { type: PmtConstants.PAYMENT_TYPES.ONHOLD } : getPaymentMethodRequestInfo(paymentData, isRecall)
                } : null;
                switch (flowApp) {
                        case PmtConstants.APP_TYPES.CHECKIN:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                            issuePaymentRequest.flowId = requestId;
                            break;
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED:
                            issuePaymentRequest = paymentData ?
                                {
                                    orderId: localStorageService.get('bookingInfo').order && localStorageService.get('bookingInfo').order.orderId ? localStorageService.get('bookingInfo').order.orderId : null,
                                    flowId: requestId,
                                    oldOrderItem: { id: localStorageService.get('bookingInfo').order.orderItems[0].orderItemId, actionType: 'Delete' },
                                    newOrderItem: { id: orderItemsId[0], actionType: 'Create' },
                                    paymentId: localStorageService.get('errorIssueService') ? localStorageService.get('errorIssueService').data.paymentOptions.paymentId : paymentData.paymentInfo.paymentId,
                                    paymentMethodWeb: onHoldPaymentPcc ? { type: PmtConstants.PAYMENT_TYPES.ONHOLD } : getPaymentMethodRequestInfo(paymentData)
                                } :
                                {
                                    orderId: localStorageService.get('bookingInfo').order && localStorageService.get('bookingInfo').order.orderId ? localStorageService.get('bookingInfo').order.orderId : null,
                                    flowId: requestId,
                                    oldOrderItem: { id: localStorageService.get('bookingInfo').order.orderItems[0].orderItemId, actionType: 'Delete' },
                                    newOrderItem: { id: orderItemsId[0], actionType: 'Create' }
                                };
                            break;
                        case PmtConstants.APP_TYPES.BOOKING:
                        case PmtConstants.APP_TYPES.SHUTTLE_OPEN:
                        case PmtConstants.APP_TYPES.SHUTTLE_OPEN_ONB:
                        case PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION:
                        case PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION_ONB:
                            issuePaymentRequest.orderId = requestId;
                            break;
                        case PmtConstants.APP_TYPES.ONHOLD:
                            issuePaymentRequest.orderId = requestId;
                            if (paymentData.paymentInfo.isOnHoldOrder) {
                                angular.extend(issuePaymentRequest, generateOnHoldInfo(paymentData.paymentInfo.paymentMethods[paymentData.selectedData.selectedTab], paymentData.paymentInfo.onHoldInfo.expiryContactData));
                            } else if (onHoldPaymentPcc) {
                                issuePaymentRequest.onHoldOptionId = getOnholdOption(localStorageService.get('errorIssueService').data);
                            }
                            break;
                        case PmtConstants.APP_TYPES.GIFTCARDS:
                            issuePaymentRequest.flowId = requestId;
                            delete issuePaymentRequest.orderItemsId;
                            delete issuePaymentRequest.paymentMethod.associatedDiscounts;
                            break;
                        case PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS:
                            issuePaymentRequest.flowId = requestId;
                            delete issuePaymentRequest.orderItemsId;
                            delete issuePaymentRequest.paymentMethod.associatedDiscounts;
                            break;
                }
                return issuePaymentRequest;

                function getPaymentMethodRequestInfo (paymentData) {
                    let generalPaymentInfo;
                    const selectedPaymentType = paymentData.paymentInfo.paymentMethods[paymentData.selectedData.selectedTab],
                        paymentMethodRequestInfo = createGeneralInfo(paymentData, selectedPaymentType, isRecall);

                    return paymentMethodRequestInfo;

                    function createGeneralInfo (paymentData, selectedPaymentType, isRecall) {
                        let bookingInfo;
                        const creditCardSelectedData = paymentData.paymentInfo && paymentData.paymentInfo.selectedPaymentInfo && paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard && paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard.cardTypeId !== PmtConstants.PAYMENT_TYPES.NEW_CARD ? paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard : paymentData.paymentInfo.selectedPaymentInfo;
                        const redirectionPaymentCallback = localStorageService.get('redirectionPaymentCallback'),paypalDataForBin = localStorageService.get('paypalDataForBin');
                        switch (selectedPaymentType.type) {
                                case PmtConstants.PAYMENT_TYPES.PAYPAL:
                                    generalPaymentInfo = {
                                        type: selectedPaymentType.type,
                                        token: redirectionPaymentCallback && redirectionPaymentCallback.paypalToken ? redirectionPaymentCallback.paypalToken : paypalDataForBin.paypalToken,
                                        payerId: redirectionPaymentCallback && redirectionPaymentCallback.paypalPayerId ? redirectionPaymentCallback.paypalPayerId : paypalDataForBin.paypalPayerId
                                    };
                                    break;
                                case PmtConstants.PAYMENT_TYPES.BUTTON:
                                    generalPaymentInfo = {
                                        type: selectedPaymentType.type,
                                        provider: selectedPaymentType.provider
                                    };
                                    break;
                                case PmtConstants.PAYMENT_TYPES.VOUCHER:
                                    if (flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                                        passengersContactData = localStorageService.get('passengersContactData');
                                        passengers = localStorageService.get('bookingInfo').passengers;
                                        generalPaymentInfo = {
                                            type: PmtConstants.DISCOUNT_TYPES.VOUCHER,
                                            voucherId: paymentData.paymentInfo.appliedDiscounts.types.VOUCHER.id,
                                            payer: {
                                                personalInfo: {
                                                    name: passengers[0].name,
                                                    surname: passengers[0].surname
                                                },
                                                contactInfo: {
                                                    email: passengersContactData[0].email || null
                                                }
                                            }
                                        };
                                    } else if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES) {
                                        passengers = localStorageService.get('passengers');
                                        bookingInfo = localStorageService.get('bookingInfo');
                                        generalPaymentInfo = {
                                            type: PmtConstants.DISCOUNT_TYPES.VOUCHER,
                                            voucherId: paymentData.paymentInfo.appliedDiscounts.types.VOUCHER.id,
                                            payer: {
                                                personalInfo: {
                                                    name: passengers[0].personalInfo.name,
                                                    surname: passengers[0].personalInfo.surname
                                                },
                                                contactInfo: {
                                                    email: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : null
                                                }
                                            }
                                        };
                                    } else {
                                        generalPaymentInfo = {
                                            type: selectedPaymentType.type
                                        };
                                    }
                                    break;
                                case PmtConstants.PAYMENT_TYPES.CREDIT_CARD:
                                case PmtConstants.PAYMENT_TYPES.IBERIA_PAY:
                                case PmtConstants.PAYMENT_TYPES.ONHOLD_CREDITCARD:
                                case PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY:
                                    if(!selectedPaymentType.externalProvider) {
                                        if (paymentData.contactData.email === null || paymentData.contactData.phone === null) {
                                            if (flowApp !== PmtConstants.APP_TYPES.GIFTCARDS && flowApp !== PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS) {
                                                bookingInfo = localStorageService.get('bookingInfo');
                                                paymentData.contactData.email = creditCardSelectedData && creditCardSelectedData.email ? creditCardSelectedData.email : bookingInfo.order.primaryContactInfo ? bookingInfo.order.primaryContactInfo.email : '';
                                                paymentData.contactData.phone = creditCardSelectedData && creditCardSelectedData.phone ? creditCardSelectedData.phone : bookingInfo.order.primaryContactInfo ? bookingInfo.order.primaryContactInfo.phone : '';
                                                if (!bookingInfo.order.primaryContactInfo) {
                                                    bookingInfo.order.primaryContactInfo = {
                                                        email: paymentData.contactData.email,
                                                        phone: paymentData.contactData.phone
                                                    };
                                                    localStorageService.set('bookingInfo', bookingInfo);
                                                }
                                            } else {
                                                delete paymentData.contactData.email;
                                                delete paymentData.contactData.phone;
                                            }
                                        }
                                        generalPaymentInfo = {
                                            toBeSavedAsProfileCard: paymentData.paymentInfo.selectedPaymentInfo.saveCustomerCard,
                                            type: selectedPaymentType.type,
                                            cardTypeId: (creditCardSelectedData.cardTypeId && creditCardSelectedData.cardTypeId !== PmtConstants.PAYMENT_TYPES.NEW_CARD)
                                                ? creditCardSelectedData.cardTypeId
                                                : (creditCardSelectedData.selectedCard ? creditCardSelectedData.selectedCard.cardTypeId : null),
                                            profileCardId: creditCardSelectedData.profileCardId ? creditCardSelectedData.profileCardId : null,
                                            expiration: creditCardSelectedData.month && creditCardSelectedData.year ? (creditCardSelectedData.month + creditCardSelectedData.year).toString() : creditCardSelectedData.expiryDate,
                                            payer: {
                                                personalInfo: {
                                                    name: paymentData.contactData.ownerName || paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard.nameOnCard,
                                                    surname: paymentData.contactData.surnames || paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard.surnameOnCard
                                                },
                                                contactInfo: {
                                                    email: paymentData.contactData.email,
                                                    phone: paymentData.contactData.phone
                                                },
                                                address: {
                                                    country: localStorageService.get('binCardCountry') ? localStorageService.get('binCardCountry') : creditCardSelectedData.profileAddressInfo && creditCardSelectedData.profileAddressInfo.country && creditCardSelectedData.profileAddressInfo.country.code ? creditCardSelectedData.profileAddressInfo.country.code : paymentData.generalData.issuerCountry.code
                                                }
                                            }
                                        };
                                        if (selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.IBERIA_PAY || selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY) {
                                            generalPaymentInfo.vaultId = selectedPaymentType.vault.id;
                                        } else {
                                            generalPaymentInfo.cardNumber = creditCardSelectedData.cardNumber || paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard.cardNumber;
                                            if (paymentData.paymentInfo.selectedPaymentInfo.newCvv || (paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard && paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard.newCvv)) {
                                                generalPaymentInfo.cvv = paymentData.paymentInfo.selectedPaymentInfo.newCvv || paymentData.paymentInfo.selectedPaymentInfo.selectedLoggedCard.newCvv;
                                            }
                                        }
                                        if (paymentData.paymentInfo.selectedPaymentInfo.zipCode) {
                                            generalPaymentInfo.payer.address.zip = paymentData.paymentInfo.selectedPaymentInfo.zipCode ? (paymentData.paymentInfo.selectedPaymentInfo.zipCode.length < 2 ? (0 + paymentData.paymentInfo.selectedPaymentInfo.zipCode) : paymentData.paymentInfo.selectedPaymentInfo.zipCode) : null;
                                        }
                                        if (paymentData.paymentInfo.selectedPaymentInfo.state && paymentData.paymentInfo.selectedPaymentInfo.state.code) {
                                            generalPaymentInfo.payer.address.state = paymentData.paymentInfo.selectedPaymentInfo.state.code;
                                        }
                                        if (paymentData.paymentInfo.selectedPaymentInfo.city) {
                                            generalPaymentInfo.payer.address.city = paymentData.paymentInfo.selectedPaymentInfo.city;
                                        }
                                        if (paymentData.paymentInfo.selectedPaymentInfo.street) {
                                            generalPaymentInfo.payer.address.street = paymentData.paymentInfo.selectedPaymentInfo.street;
                                        }
                                        if (creditCardSelectedData && creditCardSelectedData.requiredFiles) {
                                            if (creditCardSelectedData.requiredFiles.showZipCode) {
                                                generalPaymentInfo.payer.address.zip = creditCardSelectedData.profileAddressInfo.zipCode;
                                            }
                                            if (creditCardSelectedData.requiredFiles.showState) {
                                                generalPaymentInfo.payer.address.state = creditCardSelectedData.profileAddressInfo.state.code;
                                            }
                                        }
                                    }
                                    break;
                                case PmtConstants.PAYMENT_TYPES.ONHOLD:
                                    generalPaymentInfo = { type: selectedPaymentType.type };
                                    break;
                                case PmtConstants.PAYMENT_TYPES.COUPONS:
                                    bookingInfo = localStorageService.get('bookingInfo');
                                    passengers = localStorageService.get('passengers');
                                    generalPaymentInfo = {
                                        type: selectedPaymentType.type,
                                        payer : {
                                            personalInfo: {
                                                name: passengers[0].personalInfo.name,
                                                surname: passengers[0].personalInfo.surname
                                            },
                                            contactInfo: {
                                                phone: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.phone ? bookingInfo.order.primaryContactInfo.phone : null,
                                                email: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : null
                                            }
                                        }
                                    };
                                    break;
                                case PmtConstants.PAYMENT_TYPES.FULL_AVIOS:
                                    bookingInfo = localStorageService.get('bookingInfo');
                                    passengers = localStorageService.get('passengers');
                                    if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
                                        generalPaymentInfo = {
                                            type: 'AVIOS',
                                            aviosRequired: selectedPaymentType.aviosRequired,
                                            payer : {
                                                personalInfo: {
                                                    name: passengers[0].personalInfo.name,
                                                    surname: passengers[0].personalInfo.surname
                                                },
                                                contactInfo: {
                                                    phone: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.phone ? bookingInfo.order.primaryContactInfo.phone : null,
                                                    email: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : null
                                                }
                                            }
                                        };
                                    } else if (flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                                        const personalInfo = {}, contactInfo = {}, payer = {}, bookingInfo = localStorageService.get('bookingInfo'), passengersContactData = localStorageService.get('passengersContactData');
                                        personalInfo.name = paymentData.generalData.loggedInfo.personalInfo.name || bookingInfo.passengers[0].name;
                                        personalInfo.surname = paymentData.generalData.loggedInfo.personalInfo.surname1 || bookingInfo.passengers[0].surname;
                                        contactInfo.email = passengersContactData[0].email || paymentData.generalData.loggedInfo.personalInfo.contactEmail;
                                        payer.personalInfo = personalInfo;
                                        payer.contactInfo = contactInfo;
                                        generalPaymentInfo = {
                                            type: 'AVIOS',
                                            aviosRequired: selectedPaymentType.aviosRequired,
                                            payer : payer
                                        };
                                    } else if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES) {
                                        generalPaymentInfo = {
                                            type: selectedPaymentType.type,
                                            aviosRequired: selectedPaymentType.aviosRequired,
                                            payer : {
                                                personalInfo: {
                                                    name: passengers[0].personalInfo.name,
                                                    surname: passengers[0].personalInfo.surname
                                                },
                                                contactInfo: {
                                                    phone: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.phone ? bookingInfo.order.primaryContactInfo.phone : null,
                                                    email: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : null
                                                }
                                            }
                                        };
                                    } else {
                                        generalPaymentInfo = {
                                            type: selectedPaymentType.type,
                                            aviosRequired: selectedPaymentType.aviosRequired
                                        };
                                    }
                                    break;
                                case PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY_AFOP:
                                case PmtConstants.PAYMENT_TYPES.IBERIA_PAY_AFOP:
                                    generalPaymentInfo = {
                                        type: selectedPaymentType.type,
                                        afopType: selectedPaymentType.provider
                                    };
                                    switch (selectedPaymentType.provider) {
                                            case 'NEMURU':
                                                generalPaymentInfo.payer={
                                                    personalInfo:{
                                                        name: paymentData.contactData.ownerName,
                                                        surname: paymentData.contactData.surnames
                                                    },
                                                    contactInfo:{
                                                        phone:paymentData.contactData.composePhoneNumber.prefix.id+paymentData.contactData.composePhoneNumber.number,
                                                        email: paymentData.contactData.emailOwner
                                                    }
                                                };
                                                break;
                                            case 'BIZUM':
                                                const numberBizumLocalStorage = localStorageService.get('bizumNumber');
                                                const numberBizum = paymentData.contactData?.composePhoneNumber?.number ? paymentData.contactData.composePhoneNumber.number : numberBizumLocalStorage.number,
                                                    prefixBizum = isRecall ?numberBizumLocalStorage.prefix: paymentData.contactData.composePhoneNumber.prefix.id ;
                                                localStorageService.set('bizumNumber', {number: numberBizum, prefix: prefixBizum});
                                                generalPaymentInfo.payer = {
                                                    personalInfo: {
                                                        name: paymentData.contactData.ownerName,
                                                        surname: paymentData.contactData.surnames
                                                    },
                                                    contactInfo: {
                                                        phone: prefixBizum + '' + numberBizum.replace(/\D/g, '')
                                                    }
                                                };
                                                if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                                                    bookingInfo = localStorageService.get('bookingInfo');
                                                    generalPaymentInfo.payer.contactInfo.email = bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : null;
                                                } else if (flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                                                    passengersContactData = localStorageService.get('passengersContactData');
                                                    generalPaymentInfo.payer.contactInfo.email = passengersContactData[0].email || null;
                                                } else if (flowApp !== PmtConstants.APP_TYPES.GIFTCARDS || flowApp !== PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS) {
                                                    if (paymentData.contactData.email === null) {
                                                        generalPaymentInfo.payer.contactInfo.email = creditCardSelectedData && creditCardSelectedData.email ? creditCardSelectedData.email : null;
                                                    } else {
                                                        generalPaymentInfo.payer.contactInfo.email = paymentData.contactData.email;
                                                    }
                                                }
                                                break;
                                            case 'PAYPAL':
                                            case 'SOFORT':
                                            case 'IDEAL':
                                                if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES) {
                                                    bookingInfo = localStorageService.get('bookingInfo');
                                                    passengers = localStorageService.get('passengers');
                                                    generalPaymentInfo.payer = {
                                                        personalInfo: {
                                                            name: passengers[0].personalInfo.name,
                                                            surname: passengers[0].personalInfo.surname
                                                        },
                                                        contactInfo: {
                                                            phone: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.phone ? bookingInfo.order.primaryContactInfo.phone : null,
                                                            email: bookingInfo && bookingInfo.order && bookingInfo.order.primaryContactInfo && bookingInfo.order.primaryContactInfo.email ? bookingInfo.order.primaryContactInfo.email : null
                                                        }
                                                    };
                                                } else if (flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                                                    passengersContactData = localStorageService.get('passengersContactData');
                                                    passengers = localStorageService.get('bookingInfo').passengers;
                                                    generalPaymentInfo.payer = {
                                                        personalInfo: {
                                                            name: passengers[0].name,
                                                            surname: passengers[0].surname
                                                        },
                                                        contactInfo: {
                                                            phone: passengersContactData[0].phone || null,
                                                            email: passengersContactData[0].email || null
                                                        }
                                                    };
                                                }

                                                if (selectedPaymentType.provider === 'IDEAL') {
                                                    generalPaymentInfo.issuerBank = creditCardSelectedData.issuerBank;
                                                }
                                                break;
                                            case 'MERCADO_PAGO':
                                                generalPaymentInfo.provider = 'MERCADOPAGO';
                                                break;
                                    }
                                default:
                                    break;
                        }
                        if (selectedPaymentType.externalProvider === PmtConstants.PAYMENT_TYPES.EXTERNAL_CREDITCARD || selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.EXTERNAL_CREDITCARD) {
                            generalPaymentInfo = {
                                type: selectedPaymentType.externalProvider || selectedPaymentType.type,
                                cardTypeId: paymentData.paymentInfo.selectedPaymentInfo.selectedCard ? paymentData.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId : selectedPaymentType && selectedPaymentType.cardTypeId ? selectedPaymentType.cardTypeId : creditCardSelectedData.cardTypeId
                            };
                            localStorageService.set('selectedPaymentInfo', paymentData.paymentInfo.selectedPaymentInfo);

                        }
                        if (selectedPaymentType.selectedDonation && selectedPaymentType.selectedDonation.option) {
                            generalPaymentInfo.donationRequest = {
                                rejected: false,
                                newsletter: !!selectedPaymentType.selectedDonation.newsletter,
                                selected: {
                                    partner: selectedPaymentType.selectedDonation.partner,
                                    quantity: selectedPaymentType.selectedDonation.option.option
                                }
                            };
                        }
                        if (paymentData.paymentInfo.appliedDiscounts) {
                            if (flowApp === PmtConstants.APP_TYPES.BOOKING || selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.IBERIA_PAY_AFOP) {
                                generalPaymentInfo.associatedDiscounts = [];
                                if (paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS]) {
                                    generalPaymentInfo.associatedDiscounts.push({
                                        type: PmtConstants.DISCOUNT_TYPES.AVIOS,
                                        avios: paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS].id
                                    });

                                }
                                if (paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER] && !localStorageService.get('putWithoutOfferBin') && !(flowApp === PmtConstants.APP_TYPES.CHECKIN || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES)) {
                                    generalPaymentInfo.associatedDiscounts.push({
                                        type: PmtConstants.DISCOUNT_TYPES.VOUCHER
                                    });
                                } else if (paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER] && flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES) {
                                    generalPaymentInfo.associatedDiscounts.push({
                                        type: PmtConstants.DISCOUNT_TYPES.VOUCHER,
                                        voucherId: paymentData.paymentInfo.appliedDiscounts.types.VOUCHER.id
                                    });
                                } else if (paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER] && flowApp === PmtConstants.APP_TYPES.CHECKIN) {
                                    generalPaymentInfo.associatedDiscounts.push({
                                        type: PmtConstants.DISCOUNT_TYPES.VOUCHER,
                                        voucherId: paymentData.paymentInfo.appliedDiscounts.types.VOUCHER.id
                                    });
                                }
                            } else {
                                if(paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] && flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
                                    generalPaymentInfo.associatedDiscounts = [];
                                    generalPaymentInfo.associatedDiscounts.push({
                                        type: PmtConstants.DISCOUNT_TYPES.AVIOS,
                                        avios: paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS].avios
                                    });
                                }
                                if (paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] && flowApp !== PmtConstants.APP_TYPES.CHECKIN && flowApp !== PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
                                    generalPaymentInfo.associatedDiscount = {
                                        type: PmtConstants.DISCOUNT_TYPES.AVIOS,
                                        avios: paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS].id
                                    };
                                }
                                if (paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] && (flowApp === PmtConstants.APP_TYPES.CHECKIN || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES)) {
                                    generalPaymentInfo.associatedDiscounts = [];
                                    generalPaymentInfo.associatedDiscounts.push({
                                        type: PmtConstants.DISCOUNT_TYPES.AVIOS,
                                        avios: paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS].id
                                    });
                                }
                                if (paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER] && !localStorageService.get('putWithoutOfferBin') && !(flowApp === PmtConstants.APP_TYPES.CHECKIN || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES)) {
                                    generalPaymentInfo.associatedDiscount = {
                                        type: PmtConstants.DISCOUNT_TYPES.VOUCHER
                                    };
                                }
                                if (paymentData.paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.VOUCHER] && (flowApp === PmtConstants.APP_TYPES.CHECKIN || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES)) {
                                    if ( isUndefined(generalPaymentInfo.associatedDiscounts)) {
                                        generalPaymentInfo.associatedDiscounts = [];
                                    }
                                    generalPaymentInfo.associatedDiscounts.push({
                                        type: PmtConstants.DISCOUNT_TYPES.VOUCHER,
                                        voucherId: paymentData.paymentInfo.appliedDiscounts.types.VOUCHER.id
                                    });
                                }
                            }
                        }
                        if (paymentData.paymentInfo.sessionId && (selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.VOUCHER ||
                            selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.CREDIT_CARD ||
                            selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.IBERIA_PAY ||
                            selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY ||
                            selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.IBERIA_PAY_AFOP ||
                            selectedPaymentType.type === PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY_AFOP)) {
                            generalPaymentInfo.deviceFingerPrintId = localStorageService.get('pmtModelInfo').ident.replace(/[_\W]/g, '').toUpperCase().substr(0, 80);
                        }
                        if ((paymentData.summaryInfoQuota && paymentData.summaryInfoQuota.deferredMonths >= 0) || paymentData.deferredMonthsError) {
                            generalPaymentInfo.deferredMonths = !paymentData.deferredMonthsError ? paymentData.summaryInfoQuota.deferredMonths : 0;
                        }
                        if (isRecall === '3ds2Adyen' && paymentData.paymentInfo.componentInfoAdyen) {
                            switch (paymentData.paymentInfo.componentInfoAdyen.type) {
                                    case 'REDIRECT':
                                        generalPaymentInfo.componentResult = {
                                            provider: 'ADYEN',
                                            result: {
                                                md: paymentData.paymentInfo.componentInfoAdyen.data.md,
                                                paRes: paymentData.paymentInfo.componentInfoAdyen.data.paRes,
                                                type: 'REDIRECT'
                                            }
                                        };
                                        break;
                                    case 'FINGERPRINT':
                                        generalPaymentInfo.componentResult = {
                                            provider: 'ADYEN',
                                            result: {
                                                fingerprint: paymentData.paymentInfo.componentInfoAdyen.data,
                                                type: 'FINGERPRINT'
                                            }
                                        };
                                        break;
                                    case 'CHALLENGE':
                                        generalPaymentInfo.componentResult = {
                                            provider: 'ADYEN',
                                            result: {
                                                challengeResult: paymentData.paymentInfo.componentInfoAdyen.data,
                                                type: 'CHALLENGE'
                                            }
                                        };
                                        break;
                                    default:
                                        break;
                            }

                        }
                        if(isRecall === 'iberiaPayAfop') {
                            switch (selectedPaymentType.provider) {
                                    case 'NEMURU':
                                        generalPaymentInfo.componentResult = {
                                            provider: selectedPaymentType.provider,
                                            result: {
                                                type: 'NEMURU'
                                            }
                                        };
                                        break;
                                    case 'MERCADO_PAGO':
                                        generalPaymentInfo.componentResult = {
                                            provider: 'MERCADOPAGO',
                                            result: {
                                                type: 'MERCADO_PAGO'
                                            }
                                        };
                                        break;
                                    case 'BIZUM':
                                        generalPaymentInfo.componentResult = {
                                            provider: 'REDSYS',
                                            result: {
                                                type: 'BIZUM'
                                            }
                                        };
                                        break;
                                    case 'PAYPAL':
                                        generalPaymentInfo.componentResult = {
                                            provider: selectedPaymentType.provider,
                                            result: {
                                                type: 'PAYPAL'
                                            }
                                        };
                                        break;
                                    case 'IDEAL':
                                    case 'SOFORT':
                                        generalPaymentInfo.componentResult = {
                                            provider: 'ADYEN',
                                            result: {
                                                type: selectedPaymentType.provider,
                                                redirectResult: paymentData.paymentInfo.componentInfoAdyen.redirectResult ||'COMPLETE'
                                            }
                                        };
                                        break;
                            }
                        }
                        if(isRecall === '3dsOneSiteSync') {
                            generalPaymentInfo.componentResult = {
                                provider: 'ONESAIT'
                            };
                        }
                        generalPaymentInfo.offerSelection = Boolean(idDcc);
                        if(Boolean(idDcc)){
                            generalPaymentInfo.dccOfferId = idDcc;
                        }
                        return generalPaymentInfo;
                    }
                }
            }

            function getOnholdOption (errorData) {
                let i, onHoldOptionId;
                if (!errorData || !errorData.paymentOptions || !errorData.paymentOptions.paymentMethods || errorData.paymentOptions.paymentMethods.length === 0) {
                    return null;
                }
                if (errorData.paymentOptions && errorData.paymentOptions.paymentMethods.length > 0) {
                    for (i = 0; i < errorData.paymentOptions.paymentMethods.length; i++) {
                        if (errorData.paymentOptions.paymentMethods[i].type === PmtConstants.PAYMENT_TYPES.ONHOLD) {
                            onHoldOptionId = errorData.paymentOptions.paymentMethods[i].onholdOptionId;
                        }
                    }
                }
                return onHoldOptionId;
            }

            function generateOnHoldInfo (paymentData, expiryContactData) {
                const onHoldInfo = {
                    onHoldOptionId: paymentData.onHoldOptionId || paymentData.onholdOptionId
                };
                if (expiryContactData && expiryContactData.expiryAdviceCheck) {
                    onHoldInfo.phone = '+' + expiryContactData.prefix.code + expiryContactData.phone;
                }
                return onHoldInfo;
            }
        }



        /**
         * Generate request object to additional field services
         * @param {Object} requiredAdditionalFieldsInfo
         * @param {Object} selectedProvider
         * @param {Object} selectedCard
         */
        function createRequiredAdditionalFieldsRequest (requiredAdditionalFieldsInfo, selectedProvider, selectedCard) {
            const requestInfo = {};
            angular.forEach(requiredAdditionalFieldsInfo.info, (info, provider) => {
                if (selectedProvider === provider) {
                    angular.forEach(info, (requiredFieldsInfo, requiredFieldType) => {
                        switch (requiredFieldType) {
                                case 'IDCARD':
                                    angular.forEach(requiredFieldsInfo.requiredFields, (fieldInfo, fieldType) => {
                                        if (fieldType === 'NUM_DOC') {
                                            requestInfo.identityDocument = {
                                                type: requiredFieldType,
                                                number: fieldInfo.number
                                            };
                                        }
                                    });
                                    break;
                                case 'BILL_ADDRESS':
                                    requestInfo.billAddress = {
                                        street: requiredFieldsInfo.requiredFields.BILL_STREET ? requiredFieldsInfo.requiredFields.BILL_STREET.street : null,
                                        city: requiredFieldsInfo.requiredFields.BILL_CITY ? requiredFieldsInfo.requiredFields.BILL_CITY.city : null,
                                        zipCode: requiredFieldsInfo.requiredFields.BILL_ZIPCODE ? requiredFieldsInfo.requiredFields.BILL_ZIPCODE.zipCode : null,
                                        additionalInfo: requiredFieldsInfo.requiredFields.BILL_ADDITIONALINFO ? requiredFieldsInfo.requiredFields.BILL_ADDITIONALINFO.additionalInfo : null
                                    };
                                    break;
                                case 'PAYER':
                                    requestInfo.payer = {
                                        name: requiredFieldsInfo.requiredFields.NAME ? requiredFieldsInfo.requiredFields.NAME.name : null,
                                        surname: requiredFieldsInfo.requiredFields.SURNAME ? requiredFieldsInfo.requiredFields.SURNAME.surname : null,
                                        email: requiredFieldsInfo.requiredFields.EMAIL ? requiredFieldsInfo.requiredFields.EMAIL.email : null,
                                        phone: requiredFieldsInfo.requiredFields.PHONE ? requiredFieldsInfo.requiredFields.PHONE.phone : null
                                    };
                                    break;
                                case 'QUOTA':
                                    requestInfo.quota = requestInfo.quota || {};
                                    angular.extend(requestInfo.quota, {
                                        value: !requiredFieldsInfo.value || !checkQuotasValid() ? '1' : requiredFieldsInfo.value,
                                        issuesBanks: requestInfo.quota.issuesBanks ? requestInfo.quota.issuesBanks : requiredFieldsInfo.issueBank ? requiredFieldsInfo.issueBank : '0',
                                        cardTypeIds: selectedCard && selectedCard.cardTypeId ? selectedCard.cardTypeId : null
                                    });
                                    break;
                                case 'ISSUE_BANK':
                                    if (requiredAdditionalFieldsInfo.info[selectedProvider].QUOTA) {
                                        requestInfo.quota = requestInfo.quota || {};
                                        requestInfo.quota.issuesBanks = requestInfo.quota.issuesBanks ? requestInfo.quota.issuesBanks : requiredFieldsInfo.issueBankId ? requiredFieldsInfo.issueBankId.id : null;
                                    }
                                    requestInfo.issueBank = {
                                        issueBankId: requiredFieldsInfo.issueBankId ? requiredFieldsInfo.issueBankId.id : '0',
                                        cardTypeId: selectedCard && selectedCard.cardTypeId ? selectedCard.cardTypeId : null
                                    };
                                    break;
                                case 'DOCUMENT_COMPLEX':
                                    requestInfo.documentComplex = {
                                        value: requiredFieldsInfo.selected.value ? requiredFieldsInfo.selected.value : '0',
                                        documentType: requiredFieldsInfo.selected.documentType
                                    };
                                    break;
                                default:
                                    break;
                        }
                    });
                    if (requestInfo.issueBank) {
                        if (selectedCard.cardTypeId === '2' && $rootScope.appMarket === 'MX') {
                            requestInfo.issueBank.issueBankId = '123';
                            requestInfo.quota.issuesBanks = '123';
                        } else if (requiredAdditionalFieldsInfo.info[selectedProvider].ISSUE_BANK.requiredCardTypeIds.indexOf(selectedCard.cardTypeId) === -1) {
                            if (requiredAdditionalFieldsInfo.info[selectedProvider].ISSUE_BANK.requiredCardTypeIds.indexOf(selectedCard.cardTypeId) === -1) {
                                requestInfo.issueBank.issueBankId = null;
                                requestInfo.quota.issuesBanks = null;
                            }
                        }
                    }
                }
            });
            return requestInfo;
            function checkQuotasValid () {
                let isValid = false;
                if (angular.isDefined(angular.element('#check_select_quotas')[0])) {
                    isValid = angular.element('#check_select_quotas')[0].checked;
                }
                return isValid;
            }
        }

        /**
         * Generate object request to service summary quota
         * @param {*} quotaSelected value quota selected
         * @param {*} paymentId Id flow payment
         * @param {*} cardTypeId Id credit card selectedd
         * @param {*} aviosSelected avios selected
         * @returns Return object  request service summary quota
         */
        function createSummaryInfoQuotaRequest (quotaSelected, paymentId, cardTypeId, aviosSelected) {
            const summaryInfoQuotaRequest = {
                paymentId: paymentId,
                cardTypeId: cardTypeId,
                quotasQuantity: quotaSelected,
                numberOfAvios: !aviosSelected ? aviosSelected : 0
            };
            return summaryInfoQuotaRequest;
        }
        function createIberiaPayQuotaInfoRequest (paymentId, vault, expiryDate, cardTypeId, quotaSelected) {
            const iberiaPayQuotaInfoRequest = {
                paymentId: paymentId,
                vaultId: vault,
                expirationDate: expiryDate,
                cardTypeId: cardTypeId,
                quotas: quotaSelected
            };
            return iberiaPayQuotaInfoRequest;
        }

        /**
        * Create request to save credit card information in service if user is logged
        * @param {Object} paymentInfo Object with all model information payments
        * @param {Object} selectedLoggedCard Object with all information about logged user
        * @param {return} creditCardRequest Object request to save information in servce cust-cust
        */
        function createCustomerCreditCardSaveRequest (paymentInfo, isCofAvaiable) {

            let creditCardRequest;
            const creditCardData = paymentInfo, issueOrderInfo = localStorageService.get('issueOrderInfo');
            if (creditCardData && creditCardData.paymentInfo && creditCardData.paymentInfo.selectedPaymentInfo) {
                creditCardRequest = {
                    cardTypeId: creditCardData.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId,
                    description: creditCardData.paymentInfo.selectedPaymentInfo.cardDescription,
                    creditCardInfo: [{
                        type: creditCardData.paymentInfo.paymentMethods[creditCardData.selectedData.selectedTab].type ===PmtConstants.CREDIT_CARDS_PROVIDER.CREDIT_CARD?  PmtConstants.CREDIT_CARDS_PROVIDER.CREDIT_CARD : PmtConstants.CREDIT_CARDS_PROVIDER.IBERIA_PAY
                    }],
                    expiryDate: (creditCardData.paymentInfo.selectedPaymentInfo.month + (creditCardData.paymentInfo.selectedPaymentInfo.year % 100)) + '',
                    nameOnCard: creditCardData.contactData.ownerName,
                    surnameOnCard: creditCardData.contactData.surnames,
                    profileAddressInfo: creditCardData.profileAddressInfo || {
                        zipCode: creditCardData.paymentInfo.selectedPaymentInfo.zipCode,
                        state: creditCardData.paymentInfo.selectedPaymentInfo.state,
                        country: creditCardData.generalData.issuerCountry
                    }
                };
            }
            if (creditCardRequest.profileAddressInfo) {
                if (creditCardRequest.profileAddressInfo.country) {
                    creditCardRequest.profileAddressInfo.country = creditCardRequest.profileAddressInfo.country.code;
                }
                if (creditCardRequest.profileAddressInfo.state) {
                    creditCardRequest.profileAddressInfo.state = creditCardRequest.profileAddressInfo.state.code;
                }
                if (creditCardData.paymentInfo.selectedPaymentInfo.street && creditCardData.paymentInfo.selectedPaymentInfo.city) {
                    creditCardRequest.profileAddressInfo.street = creditCardData.paymentInfo.selectedPaymentInfo.street;
                    creditCardRequest.profileAddressInfo.city = creditCardData.paymentInfo.selectedPaymentInfo.city;
                }
            }

            switch(creditCardRequest.creditCardInfo[0].type) {
                    case(PmtConstants.CREDIT_CARDS_PROVIDER.CREDIT_CARD):
                        creditCardRequest.creditCardInfo[0].cardNumber = creditCardData.paymentInfo.selectedPaymentInfo.cardNumber;
                        break;
                    case(PmtConstants.CREDIT_CARDS_PROVIDER.IBERIA_PAY):
                        if(issueOrderInfo.data) {
                            if(issueOrderInfo.data?.paidItems) {
                                const iberiaPayIndex = issueOrderInfo.data.paidItems.findIndex((element)=>{return element.paymentType===PmtConstants.PAYMENT_TYPES.IBERIA_PAY;});
                                creditCardRequest.creditCardInfo[0].token = issueOrderInfo.data.paidItems[iberiaPayIndex]?.tokenizedCardNumber ;
                                creditCardRequest.creditCardInfo[0].mask = issueOrderInfo.data.paidItems[iberiaPayIndex]?.maskedCardNumber ;
                            }
                            if(issueOrderInfo.data?.paymentItems) {
                                const iberiaPayIndex = issueOrderInfo.data.paymentItems.findIndex((element)=>{return element.type===PmtConstants.PAYMENT_TYPES.IBERIA_PAY;});
                                creditCardRequest.creditCardInfo[0].token = issueOrderInfo.data.paymentItems[iberiaPayIndex]?.tokenizedCardNumber ;
                                creditCardRequest.creditCardInfo[0].mask = issueOrderInfo.data.paymentItems[iberiaPayIndex]?.maskedCardNumber ;
                            }
                            if(issueOrderInfo.data?.paymentsInfo?.length >0) {
                                creditCardRequest.creditCardInfo[0].token = issueOrderInfo.data.paymentsInfo[0].additionalInfo.tokenizedCardNumber;
                                creditCardRequest.creditCardInfo[0].mask = issueOrderInfo.data.paymentsInfo[0].additionalInfo.maskedCardNumber;
                            }
                        } else {
                            creditCardRequest.creditCardInfo[0].token = issueOrderInfo.paymentInfo?.tokenizedCardNumber;
                            creditCardRequest.creditCardInfo[0].mask = issueOrderInfo.paymentInfo?.maskedCardNumber;
                        }
                        break;
                    default:
                        break;
            }

            if (creditCardData.generalData.loggedInfo && creditCardData.generalData.loggedInfo.company && creditCardData.generalData.loggedInfo.company.companyName) {
                creditCardRequest.company = creditCardData.generalData.loggedInfo.company.companyName;
            }
            creditCardRequest.cardType = { code: creditCardRequest.cardTypeId, description: creditCardData.paymentInfo.selectedPaymentInfo.selectedCard.description };
            creditCardRequest.alias = creditCardRequest.description;
            creditCardRequest.defaultCard = false;
            delete creditCardRequest.profileAddressInfo.state;
            delete creditCardRequest.profileAddressInfo.zipCode;

            if(isCofAvaiable) {
                creditCardRequest.currenciesCof = [creditCardData.paymentInfo.currency.code];
                creditCardRequest.cof=true;
            }

            return creditCardRequest;



        }


        /**
        * Generate request to get co2 foot print information.
         * @param {String} flowApp current flow identifier
         */
        function createCo2Request (flowApp) {
            let i, j;
            const co2InfoNeed = getInfoByFlow(flowApp);
            const requestCo2 = {
                marketCode: $rootScope.appMarket,
                numPassengers: co2InfoNeed.numPassengers,
                segments: [
                ]
            };
            if (flowApp === PmtConstants.APP_TYPES.BOOKING || flowApp === PmtConstants.APP_TYPES.ONHOLD || flowApp === PmtConstants.APP_TYPES.SHUTTLE_OPEN || flowApp === PmtConstants.APP_TYPES.SHUTTLE_OPEN_ONB || flowApp === PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION || flowApp === PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION_ONB) {
                requestCo2.flightId = '1';
            }
            for (i = 0; i < co2InfoNeed.slices.length; i++) {
                for (j = 0; j < co2InfoNeed.slices[i].segments.length; j++) {
                    requestCo2.segments.push({
                        departure: co2InfoNeed.slices[i].segments[j].departure.city.code,
                        arrival: co2InfoNeed.slices[i].segments[j].arrival.city.code,
                        cabinClass: co2InfoNeed.slices[i].segments[j].cabin.bookingClass,
                        carrier: co2InfoNeed.slices[i].segments[j].flight && ((co2InfoNeed.slices[i].segments[j].flight.operationalCarrier && co2InfoNeed.slices[i].segments[j].flight.operationalCarrier.code) || (co2InfoNeed.slices[i].segments[j].flight.marketingCarrier && co2InfoNeed.slices[i].segments[j].flight.marketingCarrier.code)) || '',
                        aircraft: co2InfoNeed.slices[i].segments[j].flight.aircraft ? co2InfoNeed.slices[i].segments[j].flight.aircraft.code : null
                    });
                }
            }
            return requestCo2;

            function getInfoByFlow (flowApp) {
                let co2InfoNeed = null;
                const bookingUrlParams = localStorageService.get('bookingUrlParams') || null;
                switch (flowApp) {
                        case PmtConstants.APP_TYPES.BOOKING:
                        case PmtConstants.APP_TYPES.ONHOLD:
                        case PmtConstants.APP_TYPES.SHUTTLE_OPEN:
                        case PmtConstants.APP_TYPES.SHUTTLE_OPEN_ONB:
                        case PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION:
                        case PmtConstants.APP_TYPES.SHUTTLE_REDEMPTION_ONB:
                            co2InfoNeed = {
                                slices: localStorageService.get('fareData') ? localStorageService.get('fareData').offers[0].slices : null,
                                numPassengers: ((bookingUrlParams.adult !== null ? parseInt(bookingUrlParams.adult) : 0) + (bookingUrlParams.child !== null ? parseInt(bookingUrlParams.child) : 0)) + ''
                            };
                            break;
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES:
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS:
                            co2InfoNeed = {
                                slices: localStorageService.get('bookingInfo') ? localStorageService.get('bookingInfo').order.slices : null,
                                numPassengers: localStorageService.get('bookingInfo') ? localStorageService.get('bookingInfo').passengers.length : null
                            };
                            break;
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE:
                            co2InfoNeed = {
                                slices: localStorageService.get('fareData') ? localStorageService.get('fareData').offers[0].slices : null,
                                numPassengers: localStorageService.get('bookingInfo') ? localStorageService.get('bookingInfo').passengers.length : null
                            };
                            break;
                        case PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED:
                            co2InfoNeed = {
                                slices: localStorageService.get('bookingInfo') ? localStorageService.get('bookingInfo').order.slices : null,
                                numPassengers: localStorageService.get('bookingInfo') ? localStorageService.get('bookingInfo').passengers.length : null
                            };
                            break;
                }
                return co2InfoNeed;
            }
        }
        function noPaymentModel (currency, paymentData, conditionsData) {
            let bookingInfo, i, j, k;
            const flowApp = localStorageService.get('flowApp'), fareData = localStorageService.get('fareData'),  fareOffer = [];
            if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
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
                        fareOffer[k].price.fare = fareData.offers[0].reshopOfferInformation?.reshopTicketingInformationWebResponse[i].reissuePrice || 0;
                        fareOffer[k].price.tax = 0;
                        fareOffer[k].price.penalty = fareData.offers[0].reshopOfferInformation?.reshopTicketingInformationWebResponse[i].penalty || 0;
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
                if(!bookingInfo.fareFamilyConditions) {
                    bookingInfo.fareFamilyConditions = fareData.fareFamilyConditions;
                }
            } else {
                bookingInfo = localStorageService.get('bookingInfo');
            }
            const paymentInfo = {
                availableDiscounts: {},
                currency: currency,
                relatedContent: {
                    original: {
                        termsAndConditions: conditionsData && conditionsData.conditions && conditionsData.conditions[0] && conditionsData.conditions[0].code === 'termsAndConditions' ? conditionsData.conditions[0].message : 'TERMS_AND_CONDITIONS',
                        totalPriceText: conditionsData && conditionsData.conditions && conditionsData.conditions[1] && conditionsData.conditions[1].code === 'totalPriceText' ? conditionsData.conditions[1].message : 'TOTAL_PRICE_TEXT'
                    }
                },
                price: {
                    totalPrice: paymentData && paymentData.price ? paymentData.price : fareData.offers[0].price.total,
                    formattedTotalPrice: CurrencyService.formatPrice(currency, paymentData && paymentData.price ? paymentData.price : fareData.offers[0].price.total, true),
                    textTotalPrice: $filter('translate')('SUMMARY_TOTAL'),
                    showTotalPrice: true
                }
            };
            const transformedModel = PmtUtilsService.getModelWithPaymentInfo(localStorageService.get('countriesList'), localStorageService.get('prefixList'), localStorageService.get('statesList'), paymentInfo, bookingInfo, localStorageService.get('selectedPaymentData'));
            if (flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS || flowApp === PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
                transformedModel.showPmtHeader = false;
            }
            return transformedModel;
        }
        function getSUBSCRIPTIONModel () {
            let paymentModel = {};
            const subscriptionModelsFlowId = localStorageService.get('subscriptionModelsFlowId');
            paymentModel = {
                ident: subscriptionModelsFlowId,
                issueCountry: $rootScope.appMarket || null,
                quadrigams: {
                    payments: PmtConstants.QUADRIGAMS.SUBSCRIPTIONMODELS_PAYMENT,
                    confirmation: PmtConstants.QUADRIGAMS.SUBSCRIPTIONMODELS_CONFIRMATION
                }
            };
            return paymentModel;
        }

        function getGIFTCARDSModel () {
            let paymentModel = {};
            const giftCardsFlowId = localStorageService.get('giftCardsFlowId');
            paymentModel = {
                ident: giftCardsFlowId,
                issueCountry: $rootScope.appMarket || null,
                quadrigams: {
                    payments: PmtConstants.QUADRIGAMS.GIFTCARDS_PAYMENT,
                    confirmation: PmtConstants.QUADRIGAMS.GIFTCARDS_CONFIRMATION
                }
            };
            return paymentModel;
        }

        function createFullAviosRequest (fullAvios) {
            return { type: 'AVIOS', aviosRequired: fullAvios.toString() };
        }
        function createConfirmOrderInfo () {
            let upgBidsItem;
            const bookingInfo = localStorageService.get('bookingInfo');
            const upgradingBidRequest = localStorageService.get('upgradingBidRequest');
            const summaryAncillaries = localStorageService.get('summaryAncillaries');
            const confirmOrderInfo = {
                data: {
                    channel: null,
                    contextMetadata: bookingInfo.contextMetadata,
                    order: bookingInfo.order,
                    passengers: bookingInfo.passengers,
                    paymentItems: bookingInfo.paymentItems,
                    paymentMethod: upgradingBidRequest.issuePaymentRequest.paymentMethod,
                    relatedContent: bookingInfo.relatedContent,
                    tickets: bookingInfo.tickets,
                    warnings: []
                }
            };

            if(summaryAncillaries && (summaryAncillaries.upgradingBids !== null)) {
                upgBidsItem = angular.extend(localStorageService.get('summaryAncillaries').upgradingBids,
                    {
                        type: PmtConstants.ANCILLARIES_TYPES.UPGRADING_BID
                    }
                );
            } else {
                upgBidsItem = { type: PmtConstants.ANCILLARIES_TYPES.UPGRADING_BID };
            }

            if(localStorageService.get('UPG_BIDS_AVIOS')) {
                upgBidsItem = {
                    type: PmtConstants.ANCILLARIES_TYPES.UPGRADING_BID,
                    bidSegments: createBidSegments(),
                    total: localStorageService.get('totalAviosAmount')
                };
                updateSummaryAncillaries();
            }

            confirmOrderInfo.data.order.orderItems.push(upgBidsItem);

            return confirmOrderInfo;

            function createBidSegments () {
                const upgBidAvios = localStorageService.get('upgAviosPutMade');
                const bidsSegmentsCreated = [];

                upgBidAvios.ancillariesTrips.forEach(item => {
                    const cabinSelected = item.cabins.find(selectedCabin => {
                        return selectedCabin.selectedOffers;
                    });
                    if(cabinSelected) {
                        const bidSegment = {
                            hasBid: true,
                            departure: item.departure,
                            arrival: item.arrival,
                            cabins: [],
                            passengers: item.passengers
                        };
                        angular.extend(cabinSelected, {
                            amountBid: getAviosOrFreeByCabin(cabinSelected),
                            amountPassengersBid: getAviosOrFreeTextByCabin(cabinSelected)
                        });
                        bidSegment.cabins.push(cabinSelected);
                        bidsSegmentsCreated.push(bidSegment);
                    }
                });
                return bidsSegmentsCreated;
            }

            function getAviosOrFreeByCabin (cabinSelected) {
                if(cabinSelected.avios === 0 && cabinSelected.free !== 0 ) {
                    return cabinSelected.free;
                }else{
                    return cabinSelected.avios;
                }
            }

            function getAviosOrFreeTextByCabin (cabinSelected) {
                if(cabinSelected.avios === 0 && cabinSelected.free !== 0 ) {
                    if(cabinSelected.free === 1) {
                        return cabinSelected.free + ' ' + $filter('translate')('MMB_UPGRADING_AVIOS_SINGULAR_UPGRADE');
                    } else {
                        return cabinSelected.free + ' ' + $filter('translate')('MMB_UPGRADING_AVIOS_PLURAL_UPGRADES');
                    }
                }
                if(cabinSelected.avios !== 0 && cabinSelected.free === 0 ) {
                    return cabinSelected.formatAvios + ' ' + $filter('translate')('AVIOS_TEXT');
                }
            }

            function updateSummaryAncillaries () {
                const summaryAncillaries = localStorageService.get('summaryAncillaries');
                if(summaryAncillaries) {
                    summaryAncillaries.upgradingBids = upgBidsItem;
                    localStorageService.set('summaryAncillaries', summaryAncillaries);
                } else {
                    localStorageService.set('summaryAncillaries', { upgradingBids : upgBidsItem});
                }
            }
        }



        function createCustomerCCUpdateRequest (selectedLoggedCard, newCurrency) {

            const updateCurrenciesCof= (currenciesCof, newCurrency)=>{
                return currenciesCof.includes(newCurrency) ? [...currenciesCof]:[...currenciesCof,newCurrency];
            };

            return {
                cardTypeId: selectedLoggedCard.cardTypeId,
                description: selectedLoggedCard.description,
                profileCardId:selectedLoggedCard.profileCardId,
                creditCardInfo:selectedLoggedCard.creditCardInfo,
                expiryDate: selectedLoggedCard.expiryDate,
                nameOnCard: selectedLoggedCard.nameOnCard,
                surnameOnCard: selectedLoggedCard.surnameOnCard,
                defaultCard: selectedLoggedCard.defaultCard,
                profileAddressInfo: {
                    country: selectedLoggedCard.profileAddressInfo.country.code
                },
                currenciesCof:updateCurrenciesCof(selectedLoggedCard.currenciesCof || [], newCurrency),
                cof:true,
                //'cardType':selectedLoggedCard.cardType,
                alias:selectedLoggedCard.alias

            };
        }




    }
})();
