(function () {
    'use strict';

    angular
        .module('ib-pmt-services-http-module')
        .factory('PmtMethodsTransformer', PmtMethodsTransformer);

    PmtMethodsTransformer.$inject = ['$rootScope', 'PmtConstants', 'CurrencyService', 'PmtUtilsService', 'localStorageService', '$filter'];
    function PmtMethodsTransformer ($rootScope, PmtConstants, CurrencyService, PmtUtilsService, localStorageService, $filter) {
        const service = {
            generateModelPayMethods: generateModelPayMethods,
            generateModelPayMethodsBids: generateModelPayMethodsBids,
            transformRequiredAdditionalFields: transformRequiredAdditionalFields
        };
        return service;

        ////////////////

        function generateModelPayMethods (paymentMethodsData, appMarket, customerCreditCardsFromService) {
            let transformedInfoPayments, PaymentMethodsWithAvios = angular.copy(paymentMethodsData), paymentInfo, creditCardsList = localStorageService.get('creditCardsList') || [], customerCreditCards = customerCreditCardsFromService ? customerCreditCardsFromService : localStorageService.get('customerCreditCardsData') ? localStorageService.get('customerCreditCardsData') : null;
            let aviosSelected, i;
            const cashAviosPossibilities = localStorageService.get('cashAviosPossibilities') || null;

            let selectedPageInfo = localStorageService.get('selectedPaymentData');
            selectedPageInfo ? aviosSelected = localStorageService.get('selectedPaymentData').selectedAviosIndex : null;
            paymentInfo = localStorageService.get('paymentsInfo');
            if(aviosSelected>0)
                for (i = 0; i < PaymentMethodsWithAvios.availableDiscounts.length; i++) {
                    if (PaymentMethodsWithAvios.availableDiscounts[i].type === PmtConstants.DISCOUNT_TYPES.AVIOS && PaymentMethodsWithAvios.availableDiscounts[i].possibilities.length >= aviosSelected) {
                        PaymentMethodsWithAvios.paymentMethods = PaymentMethodsWithAvios.availableDiscounts[i].possibilities[aviosSelected - 1].paymentMethodsWithDiscount;
                    }
                }

            transformedInfoPayments = transformInfoPayments(appMarket, paymentMethodsData, creditCardsList, customerCreditCards, cashAviosPossibilities, selectedPageInfo, null, localStorageService.get('onHoldOptions'), localStorageService.get('isOnHoldOrder'));

            for (i = 0; i < PaymentMethodsWithAvios.availableDiscounts.length; i++) {
                if (aviosSelected > 0 && PaymentMethodsWithAvios.availableDiscounts[i].type === PmtConstants.DISCOUNT_TYPES.AVIOS && PaymentMethodsWithAvios.availableDiscounts[i].possibilities.length >= aviosSelected) {
                    transformedInfoPayments.appliedDiscounts = transformedInfoPayments.appliedDiscounts || {};
                    transformedInfoPayments.appliedDiscounts.status = true;
                    transformedInfoPayments.appliedDiscounts.types = transformedInfoPayments.appliedDiscounts.types || {};
                    transformedInfoPayments.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] = {
                        formatedAvios: CurrencyService.formatAvios(transformedInfoPayments.currency.groupingSeparator, PaymentMethodsWithAvios.availableDiscounts[i].possibilities[aviosSelected - 1].aviosRequired).trim(),
                        type: PmtConstants.DISCOUNT_TYPES.AVIOS,
                        id: PaymentMethodsWithAvios.availableDiscounts[i].possibilities[aviosSelected - 1].aviosRequired,
                        discount: CurrencyService.formatPrice(transformedInfoPayments.currency, PaymentMethodsWithAvios.availableDiscounts[i].possibilities[aviosSelected - 1].totalDiscount.fare, true)
                    };
                    selectedPageInfo && selectedPageInfo.selectedTab ? null : selectedPageInfo = { selectedTab: 0 };
                    transformedInfoPayments.price = {
                        totalPrice: PaymentMethodsWithAvios.paymentMethods[selectedPageInfo.selectedTab].total,
                        formattedTotalPrice: CurrencyService.formatPrice(transformedInfoPayments.currency, PaymentMethodsWithAvios.paymentMethods[selectedPageInfo.selectedTab].total, true),
                        formattedOldPriceInfo: transformedInfoPayments.paymentMethods[selectedPageInfo.selectedTab].oldPriceInfo ? transformedInfoPayments.paymentMethods[selectedPageInfo.selectedTab].oldPriceInfo : CurrencyService.formatPrice(transformedInfoPayments.currency, transformedInfoPayments.originalPaymentMethods[selectedPageInfo.selectedTab].total, true),
                        textTotalPrice: $filter('translate')('SUMMARY_TOTAL'),
                        showTotalPrice: true
                    };
                }
            }
            if(localStorageService.get('flowApp') === PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS && PaymentMethodsWithAvios.availableDiscounts) {
                for(i = 0; i < PaymentMethodsWithAvios.availableDiscounts.length; i++) {
                    if(PaymentMethodsWithAvios.availableDiscounts[i].avios) {
                        transformedInfoPayments.appliedDiscounts = transformedInfoPayments.appliedDiscounts || {};
                        transformedInfoPayments.appliedDiscounts.types = transformedInfoPayments.appliedDiscounts.types || {};
                        transformedInfoPayments.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] = {
                            type: PmtConstants.DISCOUNT_TYPES.AVIOS,
                            avios: PaymentMethodsWithAvios.availableDiscounts[i].avios
                        };
                    }
                }
            }
            return transformedInfoPayments;

            /**
             *
             * @param {*} paymentMethodsData
             * @param {*} creditCards
             * @param {*} countriesList
             * @param {*} statesList
             * @param {*} selectedCountry
             * @param {*} customerCreditCards
             * @param {*} onHoldData
             */
            function transformInfoPayments (appMarket, paymentMethodsData, creditCards, customerCreditCards, cashAviosPossibilities, selectedPageData, selectedPaymentInfo, onHoldData, isOnHoldOrderData) {
                const currency = angular.extend(CurrencyService.getCurrencyObject(paymentMethodsData.currency), {code: paymentMethodsData.currency.code}), isOnHoldOrder = isOnHoldOrderData, ident = localStorageService.get('pmtModelInfo').ident;
                const transformedInfoPayments = {
                    creditCardsInfo: { creditCardsList: creditCards },
                    sessionId: ident ? PmtConstants.MERCHANT_ID + ident.replace(/[_\W]/g, '').toUpperCase().substr(0, 80) : PmtConstants.MERCHANT_ID + paymentMethodsData.paymentId,
                    currency: currency,
                    relatedContent: PmtUtilsService.getPaymentRelatedContent(paymentMethodsData.termsAndConditions, paymentMethodsData.totalPriceText)
                };
                angular.extend(transformedInfoPayments, getPaymentInfo(selectedPageData, selectedPaymentInfo, paymentMethodsData, creditCards, customerCreditCards, onHoldData, isOnHoldOrder, currency, cashAviosPossibilities, appMarket, appMarket));
                return transformedInfoPayments;
            }
        }

        function generateModelPayMethodsBids (paymentMethodsData, appMarket) {
            const totalBid = localStorageService.get('summaryBidTransformed') && localStorageService.get('summaryBidTransformed').pendingPaymentItems && localStorageService.get('summaryBidTransformed').pendingPaymentItems.lenght > 0 ?  localStorageService.get('summaryBidTransformed').pendingPaymentItems[0].total : null;

            if(totalBid) {
                changeTotalBids();
            }
            localStorageService.set('pmtMthdsBidsTransformed', paymentMethodsData);

            function changeTotalBids () {

                for (const paymentMethods of paymentMethodsData.paymentMethods) {
                    paymentMethods.total = totalBid;
                    removeFeesAndUpdateTotalToPay(paymentMethods.types);
                }
            }

            function removeFeesAndUpdateTotalToPay (paymentMethodsTypes) {
                for (const types of paymentMethodsTypes) {
                    types.unityFee = 0;
                    types.fee = null;
                    types.totalFee = 0;
                    types.totalToPay = totalBid;
                }
            }

            return generateModelPayMethods(paymentMethodsData, appMarket);
        }
        /**
         * Create/Update paymentMethods
         * @param {Object} transformedInfoPayments
         * @param {Object} paymentMethodsData Structure with info of payments of service
         * @param {Object} creditCards List of credit cards recieved of serivce
         * @param {Object} appliedDiscounts Disccounts apply for user
         * @param {Object} customerCreditCards List of customer credit cards saved in account and returned of service
         */
        function getPaymentInfo (selectedPageInfo, selectedPaymentInfo, paymentMethodsData, creditCards, customerCreditCardsData, onHoldData, isOnHoldOrder, currency, cashAviosPossibilities, appMarket, selectedCountry) {
            var paymentMethodsDataIndex = 0, appliedDiscountsIndex = 0, onHoldFreeIndex = 0, onHoldIndex = 0, auxOnHoldOptions = [], creditCardData, i = 0, j = 0, k = 0, l = 0, foundAvios = false, foundOBPoints = false,
                onHoldData = onHoldData, foundedPaymentMethodsDisscount = false, externalCreditCardData = {}, externalCreditCardTypes = [], creditCardIndex, externalCreditCardIndex, creditCardTypes, oldPriceInfo,
                iberiaPay, paymentMethodsTypeIndex = 0, appMarket = appMarket || $rootScope.appMarket, requiredFieldMethodsIndex = 0, discountPaymentsIndex;
            const paymentInfo = {
                originalPaymentMethods: angular.copy(paymentMethodsData.paymentMethods),
                paymentMethods: [],
                requiredAdditionalFields: { paymentMethods: [], info: {} },
                availableDiscounts: {},
                appliedDiscounts: { status: false, types: {} },
                somethingToPay: true,
                onHoldInfo: getOnHoldInfo(isOnHoldOrder, currency),
                isOnHoldOrder: isOnHoldOrder,
                paymentId: paymentMethodsData.paymentId,
                price: {},
                selectedPaymentInfo: selectedPaymentInfo || {},
                iberiaPayLoadingIframe: false,
                psd2Warning: false,
                fullAvios: false,
                nemuru: {
                    available: false,
                    quotas: []
                }
            };
            localStorageService.set('orderDiscounts', 'descendingOrder');
            const orderDiscounts = localStorageService.get('orderDiscounts');
            if (localStorageService.get('selectedAviosDisccount') && localStorageService.get('selectedAviosDisccount').active) {
                paymentInfo.appliedDiscounts.status = true;
                paymentInfo.appliedDiscounts.types[PmtConstants.DISCOUNT_TYPES.AVIOS] = localStorageService.get('selectedAviosDisccount');
            } else if(localStorageService.get('selectedAviosDisccount')?.fullAvios) {
                paymentInfo.appliedDiscounts = localStorageService.get('paymentsInfo')?.appliedDiscounts;
                delete(paymentInfo.appliedDiscounts.types.AVIOS);
            }
            if (paymentMethodsData.paymentInfo && paymentMethodsData.paymentInfo.appliedDiscounts && paymentMethodsData.paymentInfo.appliedDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS]) {
                while (!foundedPaymentMethodsDisscount && i < paymentMethodsData.availableDiscounts.length) {
                    switch (paymentMethodsData.availableDiscounts[i].type) {
                            case PmtConstants.DISCOUNT_TYPES.AVIOS:
                                while (!foundedPaymentMethodsDisscount && j < paymentMethodsData.availableDiscounts[i].possibilities.length) {
                                    if (paymentMethodsData.paymentInfo.appliedDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].id === paymentMethodsData.availableDiscounts[i].possibilities[j].aviosRequired) {
                                        foundedPaymentMethodsDisscount = true;
                                        paymentMethodsData.paymentMethods = angular.copy(paymentMethodsData.availableDiscounts[i].possibilities[j].paymentMethodsWithDiscount);
                                    }
                                    j++;
                                }
                                break;
                    }
                    i++;
                }
            }
            for (paymentMethodsDataIndex = 0; paymentMethodsDataIndex < paymentMethodsData.paymentMethods.length; paymentMethodsDataIndex++) {
                if (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].requiredAdditionalFields) {
                    paymentInfo.requiredAdditionalFields.paymentMethods.push({ type: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type, provider: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].provider });
                    paymentInfo.requiredAdditionalFields.paymentMethods[requiredFieldMethodsIndex].key = getPaymentMethodKey(appMarket, paymentInfo.requiredAdditionalFields.paymentMethods[requiredFieldMethodsIndex].type);
                    requiredFieldMethodsIndex++;
                }
                if (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].psd2Warning) {
                    paymentInfo.psd2Warning = true;
                }
                if (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].appliedDiscounts) {
                    for (appliedDiscountsIndex = 0; appliedDiscountsIndex < paymentMethodsData.paymentMethods[paymentMethodsDataIndex].appliedDiscounts.length; appliedDiscountsIndex++) {

                        paymentInfo.appliedDiscounts.status = true;
                        paymentInfo.appliedDiscounts.types[paymentMethodsData.paymentMethods[paymentMethodsDataIndex].appliedDiscounts[appliedDiscountsIndex].type] = angular.copy(angular.extend(paymentMethodsData.paymentMethods[paymentMethodsDataIndex].appliedDiscounts[appliedDiscountsIndex], { originalDiscount: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].appliedDiscounts[appliedDiscountsIndex].discount, discount: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].appliedDiscounts[appliedDiscountsIndex].discount, true) }));
                        if (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].appliedDiscounts[appliedDiscountsIndex].type === PmtConstants.DISCOUNT_TYPES.VOUCHER) {
                            oldPriceInfo = CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].appliedDiscounts[appliedDiscountsIndex].originalDiscount + paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true);
                        }
                    }
                }
                switch (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type) {
                        case PmtConstants.PAYMENT_TYPES.CREDIT_CARD:
                            creditCardData = angular.extend(createCreditCardInfo(paymentMethodsData.paymentMethods[paymentMethodsDataIndex], currency, creditCards), { key: getPaymentMethodKey(appMarket, PmtConstants.PAYMENT_TYPES.CREDIT_CARD), oldPriceInfo: oldPriceInfo });
                            paymentInfo.paymentMethods.push(creditCardData);
                            creditCardIndex = paymentInfo.paymentMethods.length > 0 ? paymentInfo.paymentMethods.length - 1 : paymentInfo.paymentMethods.length;
                            localStorageService.set('creditCardTypes', paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes);
                            checkCreditCardPaymentData();

                            break;
                        case PmtConstants.PAYMENT_TYPES.EXTERNAL_CREDITCARD:
                            if (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes) {
                                for (paymentMethodsTypeIndex = 0; paymentMethodsTypeIndex < paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes.length; paymentMethodsTypeIndex++) {
                                    if (PmtConstants.ALLOWED_EXTERNAL_CREDITCARDS.indexOf(paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex].cardTypeCode) !== -1) {
                                        externalCreditCardData = angular.extend({}, paymentMethodsData.paymentMethods[paymentMethodsDataIndex], paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex],
                                            {
                                                totalPriceInfo: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex].totalToPay, true),
                                                oldPriceInfo: oldPriceInfo,
                                                provider: (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex].provider || paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex].cardTypeCode),
                                                key: getPaymentMethodKey(appMarket, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex].provider || paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex].cardTypeCode)
                                            });
                                        paymentInfo.paymentMethods.push(externalCreditCardData);
                                    } else {
                                        externalCreditCardTypes.push(angular.extend({}, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex], { parsedFee: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex].totalFee, true), iconUrl: PmtUtilsService.getCreditCardIcon(paymentMethodsData.paymentMethods[paymentMethodsDataIndex].creditCardTypes[paymentMethodsTypeIndex].cardTypeId, creditCards), external: true, requiredAdditionalFields: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].requiredAdditionalFields }));
                                    }
                                }
                            }
                            if (externalCreditCardTypes.length > 0) {
                                externalCreditCardIndex = paymentMethodsDataIndex;
                            } else {
                                externalCreditCardIndex = paymentInfo.paymentMethods.length > 0 ? paymentInfo.paymentMethods.length - 1 : paymentInfo.paymentMethods.length;
                            }
                            break;
                        case PmtConstants.PAYMENT_TYPES.VOUCHER:
                            paymentInfo.paymentMethods.push({
                                total: !paymentMethodsData.paymentMethods[paymentMethodsDataIndex].remainingAmount || (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].remainingAmount && paymentMethodsData.paymentMethods[paymentMethodsDataIndex].remainingAmount >= 0) ? 0 : CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true),
                                type: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type,
                                oldPriceInfo: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true)
                            });
                            oldPriceInfo = CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true);
                            paymentInfo.somethingToPay = !(!paymentMethodsData.paymentMethods[paymentMethodsDataIndex].remainingAmount || (paymentMethodsData.paymentMethods[paymentMethodsDataIndex].remainingAmount && paymentMethodsData.paymentMethods[paymentMethodsDataIndex].remainingAmount === 0));
                            paymentInfo.appliedDiscounts.status = true;
                            paymentInfo.appliedDiscounts.types[paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type] = { type: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type, id: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].id, discount: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true), remainingAmount: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].remainingAmount, formattedRemainingAmount: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].remainingAmount, true), originalDiscount: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total };
                            break;
                        case PmtConstants.PAYMENT_TYPES.ONHOLD:
                            if (isOnHoldOrder) {
                                paymentInfo.onHoldInfo.onHoldPaymentOptions.push(paymentMethodsData.paymentMethods[paymentMethodsDataIndex]);
                                angular.extend(paymentInfo.onHoldInfo.onHoldPaymentOptions[onHoldFreeIndex], completeOnHoldInfo(paymentMethodsData.paymentMethods[paymentMethodsDataIndex].onholdOptionId, onHoldData));
                                paymentInfo.onHoldInfo.onHoldPaymentOptions[onHoldFreeIndex].totalPriceInfo = CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true);
                                onHoldFreeIndex++;
                            }
                            break;
                        case PmtConstants.PAYMENT_TYPES.ONHOLD_CREDITCARD:
                            if (isOnHoldOrder) {
                                auxOnHoldOptions.push(paymentMethodsData.paymentMethods[paymentMethodsDataIndex]);
                                angular.extend(auxOnHoldOptions[onHoldIndex], completeOnHoldInfo(paymentMethodsData.paymentMethods[paymentMethodsDataIndex].onholdOptionId, onHoldData));
                                auxOnHoldOptions[onHoldIndex] = createCreditCardInfo(paymentMethodsData.paymentMethods[paymentMethodsDataIndex], currency, creditCards);
                                auxOnHoldOptions[onHoldIndex].totalPriceInfo = CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true);
                                auxOnHoldOptions[onHoldIndex].totalPricePassengerInfo = CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].price.total, true);
                                creditCardTypes = auxOnHoldOptions[onHoldIndex].creditCardTypes.length > 0? auxOnHoldOptions[onHoldIndex].creditCardTypes: auxOnHoldOptions[onHoldIndex].creditCardTypes;
                                onHoldIndex++;
                            }
                            break;
                        case PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY:
                            if (isOnHoldOrder) {
                                auxOnHoldOptions.push(paymentMethodsData.paymentMethods[paymentMethodsDataIndex]);
                                angular.extend(auxOnHoldOptions[onHoldIndex], completeOnHoldInfo(paymentMethodsData.paymentMethods[paymentMethodsDataIndex].onholdOptionId, onHoldData));
                                auxOnHoldOptions[onHoldIndex] = createCreditCardInfo(paymentMethodsData.paymentMethods[paymentMethodsDataIndex], currency, creditCards);
                                auxOnHoldOptions[onHoldIndex].totalPriceInfo = CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true);
                                auxOnHoldOptions[onHoldIndex].totalPricePassengerInfo = CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].price.total, true);
                                auxOnHoldOptions[onHoldIndex].vault = paymentMethodsData.paymentMethods[paymentMethodsDataIndex].vaultDetails;
                                creditCardTypes = auxOnHoldOptions[onHoldIndex].creditCardTypes.length > 0 ? auxOnHoldOptions[onHoldIndex].creditCardTypes: auxOnHoldOptions[onHoldIndex].creditCardTypes;
                                paymentInfo.isReducedCreditCardForm = auxOnHoldOptions[onHoldIndex].isReducedCreditCardForm;
                                onHoldIndex++;
                            }
                            break;
                        case PmtConstants.PAYMENT_TYPES.BUTTON:
                            paymentInfo.paymentMethods.push(angular.extend(paymentMethodsData.paymentMethods[paymentMethodsDataIndex], { key: getPaymentMethodKey(appMarket, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].provider || paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type), totalPriceInfo: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].totalToPay, true), oldPriceInfo: oldPriceInfo }));
                            break;
                        case PmtConstants.PAYMENT_TYPES.PAYPAL:
                            if (getPermitedPaypalMarket() && paymentMethodsData.paymentMethods[paymentMethodsDataIndex].scriptdownloaded === 'success') {
                                paymentInfo.paymentMethods.push(angular.extend(paymentMethodsData.paymentMethods[paymentMethodsDataIndex], { key: getPaymentMethodKey(appMarket, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].provider || paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type), totalPriceInfo: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].totalToPay, true), provider: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].provider || paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type, oldPriceInfo: oldPriceInfo }));
                            }
                            break;
                        case PmtConstants.PAYMENT_TYPES.IBERIA_PAY:
                            iberiaPay = angular.extend(createCreditCardInfo(paymentMethodsData.paymentMethods[paymentMethodsDataIndex], currency, creditCards));
                            iberiaPay.key = getPaymentMethodKey(appMarket, PmtConstants.PAYMENT_TYPES.IBERIA_PAY);
                            iberiaPay.oldPriceInfo = oldPriceInfo;
                            paymentInfo.paymentMethods.push(iberiaPay);
                            paymentInfo.isReducedCreditCardForm = iberiaPay.isReducedCreditCardForm;
                            creditCardIndex = paymentInfo.paymentMethods.length > 0 ? paymentInfo.paymentMethods.length - 1 : paymentInfo.paymentMethods.length;
                            checkCreditCardPaymentData();
                            break;
                        case PmtConstants.PAYMENT_TYPES.FULL_AVIOS:
                            paymentInfo.fullAvios = true;
                            paymentInfo.paymentMethods.push(angular.extend(paymentMethodsData.paymentMethods[paymentMethodsDataIndex], { totalAviosInfo: CurrencyService.formatAvios(currency.groupingSeparator, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].aviosRequired), totalPriceInfo: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true) }));
                            break;
                        case PmtConstants.PAYMENT_TYPES.COUPONS:
                            paymentInfo.paymentMethods.push(angular.extend(paymentMethodsData.paymentMethods[paymentMethodsDataIndex], {totalPriceInfo: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].total, true)}));
                            break;
                        case PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY_AFOP:
                        case PmtConstants.PAYMENT_TYPES.IBERIA_PAY_AFOP:
                            const provider = paymentMethodsData.paymentMethods[paymentMethodsDataIndex].provider;
                            if(!PmtConstants.DEVELOPED_AFOP.includes(provider)) break;
                            if( !( [PmtConstants.PAYMENT_TYPES.PAYPAL, PmtConstants.PAYMENT_TYPES.NEMURU].includes(provider) )
                            || (provider ===PmtConstants.PAYMENT_TYPES.PAYPAL  && getPermitedPaypalMarket() && paymentMethodsData.paymentMethods[paymentMethodsDataIndex].scriptdownloaded === 'success')
                            || (provider === PmtConstants.PAYMENT_TYPES.NEMURU && paymentMethodsData.paymentMethods[paymentMethodsDataIndex].scriptdownloaded === 'success' )) {

                                paymentInfo.paymentMethods.push(angular.extend(paymentMethodsData.paymentMethods[paymentMethodsDataIndex],
                                    { key: getPaymentMethodKey(appMarket, provider || paymentMethodsData.paymentMethods[paymentMethodsDataIndex].type),
                                        totalPriceInfo: CurrencyService.formatPrice(currency, paymentMethodsData.paymentMethods[paymentMethodsDataIndex].totalToPay, true),
                                        oldPriceInfo: oldPriceInfo }));
                            }
                            if(provider === PmtConstants.PAYMENT_TYPES.NEMURU) {
                                const calculateConditions = [...paymentMethodsData.paymentMethods[paymentMethodsDataIndex].calculateConditions || []];
                                calculateConditions.forEach((quota) => {
                                    quota.instalmentTotalAmount.string = CurrencyService.formatPrice(currency, quota.instalmentTotalAmount.value, true);
                                });
                                paymentInfo.nemuru = {
                                    available: paymentMethodsData.paymentMethods[paymentMethodsDataIndex].scriptdownloaded === 'success',
                                    quotas: calculateConditions
                                };
                            }
                            break;
                }
            }
            if (externalCreditCardTypes.length > 0) {
                paymentInfo.paymentMethods.push(angular.extend(createCreditCardInfo(paymentMethodsData.paymentMethods[externalCreditCardIndex], currency, creditCards), { externalProvider: PmtConstants.PAYMENT_TYPES.EXTERNAL_CREDITCARD, type: PmtConstants.PAYMENT_TYPES.CREDIT_CARD, types: externalCreditCardTypes, paymentId: paymentMethodsData.paymentId }));
            }
            if (angular.isDefined(creditCardIndex)) {
                creditCardTypes = paymentInfo.paymentMethods[creditCardIndex].creditCardTypes.length > 0 ? paymentInfo.paymentMethods[creditCardIndex].creditCardTypes : paymentInfo.paymentMethods[creditCardIndex].creditCardTypes;
            }
            if (localStorageService.get('flowApp') !== 'MMBBID' && paymentMethodsData.availableDiscounts && paymentMethodsData.availableDiscounts.length > 0) {
                for (paymentMethodsDataIndex = 0; paymentMethodsDataIndex < paymentMethodsData.availableDiscounts.length; paymentMethodsDataIndex++) {
                    switch (paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].type) {
                            case PmtConstants.DISCOUNT_TYPES.VOUCHER:
                                paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.VOUCHER] = { available: true };
                                break;
                            case PmtConstants.DISCOUNT_TYPES.AVIOS:
                                paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS] = { available: true, disscounts: paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities };
                                for (j = 0; j < paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts.length; j++) {
                                    paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[j].formatedAvios = CurrencyService.formatAvios(currency.groupingSeparator, paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[j].aviosRequired);
                                    paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[j].formatedTotalDiscount = CurrencyService.formatPrice(currency, paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[j].totalDiscount.fare ? paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[j].totalDiscount.fare : paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[j].totalDiscount, true, false);
                                    paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[j].fullAvios= paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[j].paymentMethodsWithDiscount.every(paymentMethodWithDiscountApplied =>paymentMethodWithDiscountApplied.total===0);
                                }
                                for (j = 0; j < paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities.length; j++) {
                                    paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities[j].paymentMethodsWithDiscount = PmtUtilsService.addKeyToPaymentMethods(paymentMethodsData.paymentMethods, paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities[j].paymentMethodsWithDiscount);
                                    paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities[j].paymentMethodsWithDiscount = $filter('orderBy')(paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities[j].paymentMethodsWithDiscount, 'key', true);
                                    for (discountPaymentsIndex = 0; discountPaymentsIndex < paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities[j].paymentMethodsWithDiscount.length; discountPaymentsIndex++) {
                                        paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities[j].paymentMethodsWithDiscount[discountPaymentsIndex] = angular.extend(createCreditCardInfo(paymentMethodsData.availableDiscounts[paymentMethodsDataIndex].possibilities[j].paymentMethodsWithDiscount[discountPaymentsIndex], currency, creditCards));
                                    }
                                }
                                break;
                    }
                }
            }
            if (isOnHoldOrder && (onHoldFreeIndex !== 0 || onHoldIndex !== 0)) {
                paymentInfo.onHoldInfo = createOnHoldInfo(paymentInfo, auxOnHoldOptions);
            }
            if (localStorageService.get('cashAviosPossibilities') && localStorageService.get('cashAviosPossibilities').length > 0 && !paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS]) {
                paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS] = { available: false, disscounts: localStorageService.get('cashAviosPossibilities') };
                for (i = 0; i < paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts.length; i++) {
                    paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[i].formatedAvios = CurrencyService.formatAvios(currency.groupingSeparator, paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[i].aviosRequired);
                    paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[i].formatedTotalDiscount = CurrencyService.formatPrice(currency, paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[i].totalDiscount.fare ? paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[i].totalDiscount.fare : paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts[i].totalDiscount, true, false);
                }
            }

            if (Boolean(paymentInfo?.availableDiscounts?.[PmtConstants.DISCOUNT_TYPES.AVIOS]?.disscounts?.length)) {
                paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS] = getCashAviosDiscountInfo(paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS], paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS] ? paymentInfo.availableDiscounts[PmtConstants.DISCOUNT_TYPES.AVIOS].possibilities : cashAviosPossibilities);
            }
            paymentInfo.customerCreditCards = getCustomerCreditCards(angular.copy(customerCreditCardsData), (creditCardTypes || externalCreditCardTypes), paymentMethodsData, selectedCountry);
            if (paymentInfo.selectedPaymentInfo && paymentInfo.selectedPaymentInfo.selectedLoggedCard) {
                paymentInfo.selectedPaymentInfo.selectedLoggedCard = getCardByProfileId(paymentInfo.customerCreditCards, paymentInfo.selectedPaymentInfo.selectedLoggedCard.profileCardId);
            }
            paymentInfo.customerCreditCards = divideByProviderCreditCard(paymentInfo.customerCreditCards);
            angular.extend(paymentInfo.price, returnTotalPrice(selectedPageInfo, paymentInfo, oldPriceInfo));
            if ($rootScope.isRedemptionFlow) {
                while (!foundAvios && k < paymentInfo.paymentMethods[0].appliedDiscounts.length) {
                    if (paymentInfo.paymentMethods[0].appliedDiscounts[k].type === PmtConstants.DISCOUNT_TYPES.AVIOS_REDEMPTION) {
                        angular.extend(paymentInfo.price, {
                            totalPriceAvios: getTotalPriceAviosFromStorage(),
                            formattedTotalPriceAvios: CurrencyService.formatAvios(currency.groupingSeparator, getTotalPriceAviosFromStorage())
                        });
                        foundAvios = true;
                    } else {
                        k++;
                    }
                }
            }
            if ($rootScope.isPointsOBFlow) {
                while (!foundOBPoints && l < paymentInfo.paymentMethods[0].appliedDiscounts.length) {
                    if (paymentInfo.paymentMethods[0].appliedDiscounts[l].type === PmtConstants.DISCOUNT_TYPES.POINTS_REDEMPTION) {
                        angular.extend(paymentInfo.price, {
                            totalPriceOBPoints: paymentInfo.paymentMethods[0].appliedDiscounts[l].originalDiscount,
                            formattedTotalPriceOBPoints: CurrencyService.formatAvios(currency.groupingSeparator, paymentInfo.paymentMethods[0].appliedDiscounts[l].originalDiscount)
                        });
                        foundOBPoints = true;
                    } else {
                        l++;
                    }
                }
            }

            paymentInfo.paymentMethods.sort((a, b) => {
                return b.key - a.key;
            });
            if (paymentInfo.requiredAdditionalFields && paymentInfo.requiredAdditionalFields.paymentMethods.length > 0) {
                paymentInfo.requiredAdditionalFields.paymentMethods.sort((a, b) => {
                    return b.key - a.key;
                });
            }


            function getTotalPriceAviosFromStorage () {
                let totalPrice = localStorageService.get('breakdownPassengers').selectedRedeption;

                if (totalPrice.hasOwnProperty(PmtConstants.SELECTED_REDEMPTION.DISCOUNTED_PRICE)) {
                    totalPrice = totalPrice.discountedPrice.totalPoints.fare;
                } else if (totalPrice.hasOwnProperty(PmtConstants.SELECTED_REDEMPTION.BASE_PRICE)) {
                    totalPrice = totalPrice.basePrice.totalPoints.fare;
                } else {
                    totalPrice = totalPrice.totalPoints.fare;
                }
                return totalPrice;
            }
            function getPermitedPaypalMarket () {
                let i, j, bookingInfo = localStorageService.get('bookingInfo'), isPermited = true;
                if (bookingInfo && bookingInfo.order && bookingInfo.order.slices) {
                    for (i = 0; i < bookingInfo.order.slices.length; i++) {
                        for (j = 0; j < bookingInfo.order.slices[i].segments.length; j++) {
                            if (bookingInfo.order.slices[i].segments[j].arrival.city.country.code === 'CU' || bookingInfo.order.slices[i].segments[j].departure.city.country.code === 'CU') {
                                isPermited = false;
                            }
                        }
                    }
                } else if(bookingInfo && (bookingInfo.outwardSegments || bookingInfo.returnSegments)) {
                    if (bookingInfo.outwardSegments && bookingInfo.outwardSegments.length > 0) {
                        for (i = 0; i < bookingInfo.outwardSegments.length; i++) {
                            if (bookingInfo.outwardSegments[i].arrival.airport.country === 'CU' || bookingInfo.outwardSegments[i].departure.airport.country === 'CU') {
                                isPermited = false;
                            }
                        }
                    }
                    if (bookingInfo.returnSegments && bookingInfo.returnSegments.length > 0) {
                        for (i = 0; i < bookingInfo.returnSegments.length; i++) {
                            if (bookingInfo.returnSegments[i].arrival.airport.country === 'CU' || bookingInfo.returnSegments[i].departure.airport.country === 'CU') {
                                isPermited = false;
                            }
                        }
                    }

                }
                return isPermited;
            }

            function returnTotalPrice (selectedPageInfo, paymentInfo, oldPriceInfo) {
                let totalPrice = {}, totalPriceValue = null, selectedMethod = !!(selectedPageInfo && paymentInfo.paymentMethods[selectedPageInfo.selectedTab]);
                if (selectedMethod) {
                    totalPriceValue = paymentInfo.paymentMethods[selectedPageInfo.selectedTab].total;
                } else {
                    totalPriceValue = paymentInfo.paymentMethods[0].total || paymentInfo.paymentMethods[0].total === 0 ? paymentInfo.paymentMethods[0].total : paymentInfo.paymentMethods[0].price.total;
                }
                totalPrice = {
                    totalPrice: totalPriceValue,
                    formattedTotalPrice: CurrencyService.formatPrice(currency, totalPriceValue, true),
                    formattedOldPriceInfo: selectedMethod ? paymentInfo.paymentMethods[selectedPageInfo.selectedTab].oldPriceInfo : (oldPriceInfo ? oldPriceInfo : null),
                    textTotalPrice: $filter('translate')('SUMMARY_TOTAL'),
                    showTotalPrice: true
                };
                return totalPrice;
            }

            return paymentInfo;

            function divideByProviderCreditCard (customerCreditCards) {
                let creditCardProvider = {}, CREDITCARD = [], IBERIA_PAY = [], i;

                for (i = 0; i < customerCreditCards.length; i++) {
                    CREDITCARD.push(customerCreditCards[i]);
                    IBERIA_PAY.push(customerCreditCards[i]);
                }
                if (localStorageService.get('flowApp') === PmtConstants.APP_TYPES.ONHOLD) {
                    creditCardProvider.ONHOLD_CREDITCARD = CREDITCARD;
                    creditCardProvider.ONHOLD_IBERIA_PAY = IBERIA_PAY;
                } else {
                    creditCardProvider.CREDITCARD = CREDITCARD;
                    creditCardProvider.IBERIA_PAY = IBERIA_PAY;
                }

                return creditCardProvider;
            }

            /**
             *
             * Update selected logged card with country if selected
             * @param {*} customerCreditCardsData
             * @param {*} selectedLoggedCardId
             * @returns {object} foundedCard
             */
            function getCardByProfileId (customerCreditCardsData, selectedLoggedCardId) {
                let foundedCard, foundedInfo = false, cardIndex = 0;
                while (!foundedInfo && cardIndex < customerCreditCardsData.length) {
                    if (customerCreditCardsData[cardIndex].profileCardId === selectedLoggedCardId && customerCreditCardsData[cardIndex].active) {
                        foundedCard = customerCreditCardsData[cardIndex];
                        if (foundedCard.profileAddressInfo) {
                            foundedCard.profileAddressInfo.country = selectedCountry;
                        }
                        foundedInfo = true;
                    }
                    cardIndex++;
                }
                return foundedCard;
            }

            /**
             * generates a key to order and display payment methods
             * @param {String} appMarket app market
             * @param {String} type type  external credit card
             */
            function getPaymentMethodKey (appMarket, type) {
                let key = -1;
                key = PmtConstants.PAYMENT_METHODS_KEYS[type] ? PmtConstants.PAYMENT_METHODS_KEYS[type] : -1;
                return key;
            }

            function getOnHoldInfo (isOnHoldOrder, currency) {
                let onHoldInfo, totalPrice;
                if (isOnHoldOrder) {
                    totalPrice = localStorageService.get('createOrderData').order.price.total;
                    onHoldInfo = {
                        isFreeOnHoldOrder: false,
                        onHoldPaymentOptions: [],
                        expiryContactData: { expiryAdviceCheck: false },
                        totalPriceBooking: totalPrice,
                        totalPriceBookingCurrency: CurrencyService.formatPrice(currency, totalPrice, true)
                    };
                }
                return onHoldInfo;
            }


            function getCashAviosDiscountInfo (cashAviosAvailability, cashAviosInfo) {
                const noDiscount = {aviosRequired:0};
                const desorderDiscount = [...cashAviosAvailability.disscounts, noDiscount];
                const newOrderCashAviosAvailability = {
                    available : cashAviosAvailability.available,
                    disscounts : $filter('orderBy')(desorderDiscount, 'aviosRequired', orderDiscounts === 'descendingOrder')
                };
                let cashAviosInfoIndex, transformedCashAviosInfo = newOrderCashAviosAvailability;
                if (cashAviosInfo) {
                    for (cashAviosInfoIndex = 0; cashAviosInfoIndex < cashAviosInfo.length; cashAviosInfoIndex++) {
                        transformedCashAviosInfo.disscounts.push(angular.extend(cashAviosInfo[cashAviosInfoIndex], {
                            formattedAvios: CurrencyService.formatAvios(currency.groupingSeparator, cashAviosInfo[cashAviosInfoIndex].aviosRequired),
                            formattedDiscount: CurrencyService.formatPrice(currency, cashAviosInfo[cashAviosInfoIndex].totalDiscount, true, false)
                        }));
                    }
                }
                return transformedCashAviosInfo;
            }


            function createOnHoldInfo (paymentInfo, auxOnHoldOptions) {
                const returnOnHoldInfo = angular.copy(paymentInfo.onHoldInfo), selectedOnHoldIndex = paymentInfo.selectedOnHoldIndex || null,
                    priceToShow = localStorageService.get('createOrderData') && localStorageService.get('createOrderData').order.voucherDiscount ? localStorageService.get('createOrderData').order.voucherDiscount.totalBookingAmountWithDiscountApplied : paymentInfo.onHoldInfo.totalPriceBooking;
                returnOnHoldInfo.isFreeOnHoldOrder = auxOnHoldOptions.length === 0;
                returnOnHoldInfo.onHoldPaymentOptions = returnOnHoldInfo.onHoldPaymentOptions.concat(auxOnHoldOptions);
                returnOnHoldInfo.otherPaymentMethods = angular.copy(paymentInfo.paymentMethods);
                if (paymentInfo.paymentMethods.length === 0 && selectedOnHoldIndex) {
                    paymentInfo.paymentMethods = returnOnHoldInfo.onHoldPaymentOptions[paymentInfo.selectedOnHoldIndex].type !== PmtConstants.PAYMENT_TYPES.ONHOLD ?
                        [].concat(returnOnHoldInfo.onHoldPaymentOptions[paymentInfo.selectedOnHoldIndex], returnOnHoldInfo.otherPaymentMethods) :
                        [returnOnHoldInfo.onHoldPaymentOptions[paymentInfo.selectedOnHoldIndex]];
                } else {
                    paymentInfo.paymentMethods = returnOnHoldInfo.onHoldPaymentOptions[0].type !== PmtConstants.PAYMENT_TYPES.ONHOLD ? [].concat(returnOnHoldInfo.onHoldPaymentOptions[0], returnOnHoldInfo.otherPaymentMethods): [returnOnHoldInfo.onHoldPaymentOptions[0]];
                }
                returnOnHoldInfo.onHoldPayment = paymentInfo.paymentMethods[0].price && paymentInfo.paymentMethods[0].price.total === 0 ? paymentInfo.paymentMethods[0].totalPriceInfo : '-' + paymentInfo.paymentMethods[0].totalPriceInfo;
                returnOnHoldInfo.priceAfterOnHold = CurrencyService.formatPrice(currency, priceToShow - (paymentInfo.paymentMethods[0].total ? paymentInfo.paymentMethods[0].total : paymentInfo.paymentMethods[0].price.total), true);
                returnOnHoldInfo.onHoldPricePerPassenger = CurrencyService.formatPrice(currency, paymentInfo.paymentMethods[0].onHoldPricePerPassenger, true);
                returnOnHoldInfo.totalOnHoldPrice = CurrencyService.formatPrice(currency, paymentInfo.paymentMethods[0].total ? paymentInfo.paymentMethods[0].total : paymentInfo.paymentMethods[0].price.total, true);
                return returnOnHoldInfo;
            }

            function checkCreditCardPaymentData () {
                if (paymentInfo.paymentInfo && paymentInfo.paymentInfo.selectedCard) {
                    if (paymentInfo.paymentInfo.selectedCard && paymentInfo.paymentInfo.selectedCard.totalFee) {
                        paymentInfo.paymentMethods[paymentInfo.paymentMethods.length - 1].total += paymentInfo.paymentInfo.selectedCard.totalFee;
                        paymentInfo.paymentMethods[paymentInfo.paymentMethods.length - 1].totalPriceInfo = CurrencyService.formatPrice(currency, paymentInfo.paymentMethods[paymentInfo.paymentMethods.length - 1].total, true);
                    }

                }
            }

            function completeOnHoldInfo (id, onHoldInfoData) {
                return onHoldInfoData[id];
            }
        }



        /**
         *
         * @param {*} paymentMethodsData
         * @param {*} currencyData
         * @param {*} creditCards
         */
        function createCreditCardInfo (paymentMethodsData, currencyData, creditCards) {
            let index;
            paymentMethodsData.requiredFields = paymentMethodsData.requiredFields ? paymentMethodsData.requiredFields : [];
            paymentMethodsData.somethingToPay = true;
            paymentMethodsData.totalPriceInfo = CurrencyService.formatPrice(currencyData, paymentMethodsData.total, true);
            if (paymentMethodsData.types && paymentMethodsData.types.length > 0) {
                paymentMethodsData.isReducedCreditCardForm = false;
                for (index = 0; index < paymentMethodsData.types.length; index++) {
                    paymentMethodsData.types[index].parsedFee = CurrencyService.formatPrice(currencyData, paymentMethodsData.types[index].totalFee, true);
                    paymentMethodsData.types[index].iconUrl = PmtUtilsService.getCreditCardIcon(paymentMethodsData.types[index].cardTypeId, creditCards);
                }
            } else if(paymentMethodsData.creditCardTypes && paymentMethodsData.creditCardTypes.length > 0) {
                paymentMethodsData.isReducedCreditCardForm = true;
                for (index = 0; index < paymentMethodsData.creditCardTypes.length; index++) {
                    paymentMethodsData.creditCardTypes[index].iconUrl = PmtUtilsService.getCreditCardIcon(paymentMethodsData.creditCardTypes[index].cardTypeId, creditCards);
                }
            }
            return paymentMethodsData;
        }


        function getCustomerCreditCards (customerCreditCardsData, paymentsCardsData, paymentMethodsData, selectedCountry) {
            let customerCreditCards = [], customerInfo = {}, paymentInfo = {};
            let customerCardsIndex, paymentCardIndex, foundedCard, selectedLoggedCard = localStorageService.get('selectedLoggedCard');
            if (customerCreditCardsData && paymentsCardsData && paymentsCardsData.length > 0) {
                for (customerCardsIndex = 0; customerCardsIndex < customerCreditCardsData.length; customerCardsIndex++) {
                    foundedCard = false, paymentCardIndex = 0;
                    while (!foundedCard && paymentCardIndex < paymentsCardsData.length) {
                        customerInfo = customerCreditCardsData[customerCardsIndex];
                        paymentInfo = getPaymentInfoByCarId(paymentsCardsData, customerCreditCardsData[customerCardsIndex].cardTypeId);
                        if (customerCreditCardsData[customerCardsIndex].expiryDate && PmtUtilsService.checkCreditCardExpiryDate(customerCreditCardsData[customerCardsIndex].expiryDate)) {
                            customerInfo.expiryDateNeedsUpdate = true;
                            customerInfo.expiryDate = null;
                            customerInfo.saveCustomerCard = true;
                        }
                        if (!customerCreditCardsData[customerCardsIndex].surnameOnCard || !customerCreditCardsData[customerCardsIndex].description) {
                            customerInfo.saveCustomerCard = true;
                        }
                        customerInfo.requiredFiles = checkRequiredFields(customerCreditCardsData[customerCardsIndex], paymentMethodsData.paymentMethods);
                        foundedCard = customerCreditCardsData[customerCardsIndex].cardTypeId === paymentsCardsData[paymentCardIndex].cardTypeId;
                        paymentCardIndex++;
                    }
                    customerCreditCards.push(angular.extend(paymentInfo, customerInfo, {
                        active: isActiveCreditCard(selectedLoggedCard, customerCreditCardsData[customerCardsIndex], foundedCard, paymentMethodsData, selectedCountry)
                    }));
                }
                if (customerCreditCards.length > 0 && customerCreditCards[0].hasOwnProperty('isCorporate')) {
                    customerCreditCards = $filter('orderBy')(customerCreditCards, 'isCorporate');
                    foundedCard = false;
                    customerCardsIndex = 0;
                    while (!foundedCard && customerCardsIndex < customerCreditCards.length) {
                        if (customerCreditCards[customerCardsIndex].isCorporate) {
                            customerCreditCards[customerCardsIndex].firstCorporate = true;
                            foundedCard = true;
                        }
                        customerCardsIndex++;
                    }
                    customerCreditCards[0].firstPersonal = true;
                }
            }
            customerCreditCards.push({
                description: 'CREDIT_CARD_FORM_SELECT_NEW_LOGGED_OPTION',
                cardTypeId: 'newCard',
                profileCardId: 'newCard',
                active: true,
                provider: {
                    CREDITCARD: true,
                    ONHOLD_CREDITCARD: true,
                    IBERIA_PAY: true,
                    ONHOLD_IBERIA_PAY: true
                }
            });
            return customerCreditCards;

            function isActiveCreditCard (selectedLoggedCard, customerCreditCardsData, foundedCard, paymentMethodsData, selectedCountry) {
                let isActive = false, i = 0, j;
                if (!selectedLoggedCard || (customerCreditCardsData && customerCreditCardsData.profileAddressInfo
                    && customerCreditCardsData.profileAddressInfo.country && selectedLoggedCard && selectedLoggedCard.profileAddressInfo
                    && selectedLoggedCard.profileAddressInfo.country && customerCreditCardsData.profileAddressInfo.country.code === selectedLoggedCard.profileAddressInfo.country.code)
                    || (selectedLoggedCard && customerCreditCardsData.cardTypeId !== selectedLoggedCard.cardTypeId)
                    || (selectedLoggedCard && foundedCard && customerCreditCardsData.cardTypeId === selectedLoggedCard.cardTypeId)) {

                    while (!isActive && i < paymentMethodsData.paymentMethods.length) {
                        if (paymentMethodsData.paymentMethods[i].creditCardTypes && paymentMethodsData.paymentMethods[i].creditCardTypes.length > 0 && !paymentMethodsData.paymentMethods[i].externalProvider && (paymentMethodsData.paymentMethods[i].type === 'CREDITCARD' || paymentMethodsData.paymentMethods[i].type === 'IBERIA_PAY' || paymentMethodsData.paymentMethods[i].type === 'ONHOLD_CREDITCARD' || paymentMethodsData.paymentMethods[i].type === 'ONHOLD_IBERIA_PAY')) {
                            j = 0;
                            while (!isActive && j < paymentMethodsData.paymentMethods[i].creditCardTypes.length) {
                                if (paymentMethodsData.paymentMethods[i].creditCardTypes[j].cardTypeId === customerCreditCardsData.cardTypeId) {
                                    isActive = true;
                                }
                                j++;
                            }
                        } else if(!paymentMethodsData.paymentMethods[i].externalProvider && (paymentMethodsData.paymentMethods[i].type === 'CREDITCARD' || paymentMethodsData.paymentMethods[i].type === 'IBERIA_PAY' || paymentMethodsData.paymentMethods[i].type === 'ONHOLD_CREDITCARD' || paymentMethodsData.paymentMethods[i].type === 'ONHOLD_IBERIA_PAY')) {
                            j = 0;
                            while (!isActive && j < paymentMethodsData.paymentMethods[i].creditCardTypes.length) {
                                if (paymentMethodsData.paymentMethods[i].creditCardTypes[j].cardTypeId === customerCreditCardsData.cardTypeId) {
                                    isActive = true;
                                }
                                j++;
                            }
                        }
                        i++;
                    }
                }
                return isActive;
            }


            function getPaymentInfoByCarId (paymentsCardsData, cardTypeId) {
                let foundedPaymentInfo = {}, foundedInfo = false, paymentCardIndex = 0;
                while (!foundedInfo && paymentCardIndex < paymentsCardsData.length) {
                    if (cardTypeId === paymentsCardsData[paymentCardIndex].cardTypeId) {
                        foundedPaymentInfo = angular.copy(paymentsCardsData[paymentCardIndex]);
                        foundedInfo = true;
                    }
                    paymentCardIndex++;
                }
                return foundedPaymentInfo;
            }

            /**
             * Check if paymentMethods required files and add to customer cards
             * @param {Object} card Credit card
             * @param {Object} paymentMethods Payment methods for check required fields
             */
            function checkRequiredFields (card, paymentMethods) {
                let i = 0, haveCard = false, indexCard, options = { showZipCode: false, showState: false };
                while (!haveCard && i < paymentMethods.length) {
                    if (paymentMethods[i].type === PmtConstants.PAYMENT_TYPES.CREDIT_CARD || paymentMethods[i].type === PmtConstants.PAYMENT_TYPES.IBERIA_PAY) {
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
        }

        /**
         * Generate all information neccesary  to show require required fields in payment view
         * @param {Object} requiredAdditionalFields Array of payment required fields by provider returned by the customer
         */
        function transformRequiredAdditionalFields (requiredAdditionalFields) {
            let requiredAdditionalFieldsIndex, typeIndex, optionsIndex, transformedRequiredAdditionalFields = {}, i;
            for (requiredAdditionalFieldsIndex = 0; requiredAdditionalFieldsIndex < requiredAdditionalFields.length; requiredAdditionalFieldsIndex++) {
                transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider || requiredAdditionalFields[requiredAdditionalFieldsIndex].type] = transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider] || {};
                for (typeIndex = 0; typeIndex < requiredAdditionalFields[requiredAdditionalFieldsIndex].info.length; typeIndex++) {
                    switch (requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type) {
                            case 'DOCUMENT':
                                for (optionsIndex = 0; optionsIndex < requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].options.length; optionsIndex++) {
                                    transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].options[optionsIndex].type] = requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].options[optionsIndex];
                                    if (transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].options[optionsIndex].type].requiredFields) {
                                        transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].options[optionsIndex].type].requiredFields = getRequiredFields(angular.copy(requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].options[optionsIndex].requiredFields));
                                    }
                                }
                                break;
                            case 'BILL_ADDRESS':
                                transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type] = requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex];
                                if (transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredFields) {
                                    transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredFields = getRequiredFields(angular.copy(requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].requiredFields));
                                }
                                break;
                            case 'PAYER':
                                transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type] = requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex];
                                if (transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredFields) {
                                    transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredFields = getRequiredFields(angular.copy(requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].requiredFields));
                                }
                                break;
                            case 'QUOTA':
                                transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type] = requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex];
                                if (transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredConditions) {
                                    transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredConditions = angular.copy(requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].requiredConditions);
                                }
                                break;
                            case 'ISSUE_BANK':
                                transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type] = requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex];
                                if ($rootScope.appMarket === 'MX' && transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type]) {
                                    for (i = 0; i < transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].options.length; i++) {
                                        if (transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].options[i].id === '123') {
                                            transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].options.splice(i, 1);
                                        }
                                    }
                                    for (i = 0; i < transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredCardTypeIds.length; i++) {
                                        if (transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredCardTypeIds[i] === '2') {
                                            transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type].requiredCardTypeIds.splice(i, 1);
                                        }
                                    }
                                }
                                break;
                            case 'DOCUMENT_COMPLEX':
                                transformedRequiredAdditionalFields[requiredAdditionalFields[requiredAdditionalFieldsIndex].paymentProvider][requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex].type] = requiredAdditionalFields[requiredAdditionalFieldsIndex].info[typeIndex];
                                break;
                            default:
                                break;
                    }
                }
            }
            return transformedRequiredAdditionalFields;

            function getRequiredFields (requiredFields) {
                let requiredFieldsIndex, transformedRequiredFields = {};
                for (requiredFieldsIndex = 0; requiredFieldsIndex < requiredFields.length; requiredFieldsIndex++) {
                    transformedRequiredFields[requiredFields[requiredFieldsIndex]] = {};
                }
                return transformedRequiredFields;
            }
        }


    }

})();
