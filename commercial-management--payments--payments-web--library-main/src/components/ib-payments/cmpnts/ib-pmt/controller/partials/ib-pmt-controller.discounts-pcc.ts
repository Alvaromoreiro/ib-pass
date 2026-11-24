import angular from 'angular';
import { applyDiscountsFromCreateOrderData, hasRestorableCreateOrderDiscounts } from '../../service/ib-pmt-discount.utils';
import type { PmtPageController } from '../ib-pmt-controller';

    /**
     * Remove the information from the avios discount information model, if the user has selected avios and changes to voucher
     * @param {Event} removeAviosDisscounts event to lunch function
     */
export function removeAviosDisscountsImpl(ctrl: PmtPageController, event) {
        ctrl.model.paymentInfo.appliedDiscounts.status = !!ctrl.model.paymentInfo.appliedDiscounts.types[ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER];
        delete ctrl.model.paymentInfo.appliedDiscounts.types[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS];
        ctrl.localStorageService.remove('selectedAviosDisccount');
        if (ctrl.model.paymentInfo.price.formattedOldPriceInfo && !ctrl.model.paymentInfo.appliedDiscounts.types[ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER]) {
            delete ctrl.model.paymentInfo.price.formattedOldPriceInfo;
        }
        ctrl.model.paymentInfo.price = {
            totalPrice: ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].total,
            formattedTotalPrice: ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].total, true),
            textTotalPrice: ctrl.$filter('translate')('SUMMARY_TOTAL'),
            showTotalPrice: true
        };

}

    /**
     *
     * @param {*} event
     * @param {*} info
     * @param {*} index
     */
export function changeSelectedHoldOptionImpl(ctrl: PmtPageController, event, info, index) {
        ctrl.onHoldFreeSelected = index === 0;
        const request = ctrl.localStorageService.get('ibpayCcFeeRequest');
        const priceToShow = ctrl.localStorageService.get('createOrderData') && ctrl.localStorageService.get('createOrderData').order.voucherDiscount ? ctrl.localStorageService.get('createOrderData').order.voucherDiscount.totalBookingAmountWithDiscountApplied : ctrl.model.paymentInfo.onHoldInfo.totalPriceBooking;
        ctrl.localStorageService.set('onHoldOptionSelected', index);
        ctrl.model.selectedData.selectedOnHoldIndex = index;
        if (ctrl.model.paymentInfo.onHoldInfo.onHoldPaymentOptions[index].type !== ctrl.PmtConstants.PAYMENT_TYPES.ONHOLD) {
            ctrl.model.paymentInfo.paymentMethods = [].concat(ctrl.model.paymentInfo.onHoldInfo.onHoldPaymentOptions[index], ctrl.model.paymentInfo.onHoldInfo.otherPaymentMethods);
        } else {
            ctrl.model.paymentInfo.paymentMethods = [ctrl.model.paymentInfo.onHoldInfo.onHoldPaymentOptions[index]];
        }
        ctrl.model.selectedData.selectedTab = 0;
        ctrl.model.summaryInfo.onHoldPayment = `${(info.total>0? '-':'')}${info.totalPriceInfo}`;
        ctrl.model.paymentInfo.onHoldInfo.priceAfterOnHold = ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, priceToShow - (info.total ? info.total : info.price.total), true);
        ctrl.model.paymentInfo.onHoldInfo.onHoldPricePerPassenger = ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, info.onHoldPricePerPassenger, true);
        ctrl.model.paymentInfo.onHoldInfo.totalOnHoldPrice = ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, info.total ? info.total : info.price.total, true);
        ctrl.model.paymentInfo.price = {
            totalPrice: info.total ? info.total : info.price.total,
            formattedTotalPrice: ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, info.total ? info.total : info.price.total, true),
            textTotalPrice: ctrl.$filter('translate')('SUMMARY_TOTAL'),
            showTotalPrice: true
        };

        ctrl.NewMainHeaderFacade.updateBasketOthers(info.type, {
            total: info.total ? info.total : info.price.total,
            totalFormatted: info.totalPriceInfo
        });

        function convertCurrencyToMinorUnit (value: string) {
            let [integerPart, fractionalPart = ''] = value.replace(/[^0-9.]/g, '').split('.');
            if (fractionalPart.length === 0) {
                return parseInt(integerPart);
            } else if (fractionalPart.length > 2) {
                return parseInt(integerPart + fractionalPart.substring(0, 3));
            } else {
                return parseInt(integerPart + fractionalPart.padEnd(2, '0'));
            }
        }

        angular.extend(request, {
            paymentPrice: {
                ...request.paymentPrice,
                price: convertCurrencyToMinorUnit(info.totalPriceInfo)
            }
        });
        ctrl.DccService.setDccData();
        ctrl.localStorageService.set('ibpayCcFeeRequest', request);
        ctrl.$scope.$broadcast('updateSelectedTabEvent', ctrl.model.selectedData.selectedTab);
        angular.element(ctrl.$window).triggerHandler('resize');
        ctrl.DccService.setDccData();
}

export function restoreSummaryAncillariesImpl(ctrl: PmtPageController) {
        const summaryAncillaries = ctrl.localStorageService.get('summaryAncillaries');
        if (summaryAncillaries && ctrl.model?.summaryInfo) {
            ctrl.model.summaryInfo.ancillaries = summaryAncillaries;
        }
}

export function applyStoredDonationImpl(ctrl: PmtPageController, donationData, status = true) {
        if (donationData) {
            ctrl.checkDonation('event', status, donationData.option, donationData.donationInfo, donationData.form ? donationData.form.acceptDonationData : null, donationData.form ? donationData.form : null);
            if (status) {
                ctrl.$scope.$broadcast('syncDonationSelection');
            }
        }
}

export function updateSummaryDonationImpl(ctrl: PmtPageController) {
        ctrl.applyStoredDonation(ctrl.localStorageService.get('donation'));
}

    /**
     * Update available paymentMethods through getScripts
     * @param {boolean} restoreCreateOrderDiscounts Restore basket discounts from createOrderData after refresh
     */
export function updateAvailablePaymenMethodsImpl(ctrl: PmtPageController, restoreCreateOrderDiscounts = false) {
        ctrl.restoreSummaryAncillaries();
        const paymentsInfo = {...ctrl.model.paymentInfo};
        paymentsInfo.paymentMethods = ctrl.localStorageService.get('modelPaymentData').paymentInfo.paymentMethods;
        ctrl.model.showOptions.loadingPaymentData = true;
        ctrl.PmtService.getScripts(paymentsInfo, ctrl.model.selectedData.selectedTab).then((response) => {
            ctrl.model.paymentInfo.paymentMethods = response.paymentInfo.paymentMethods;
            ctrl.model.showOptions.loadingPaymentData = false;
            ctrl.PmtModalService.finishWaiting();
            const createOrderData = ctrl.localStorageService.get('createOrderData');
            if (restoreCreateOrderDiscounts && createOrderData) {
                ctrl.restoreBasketDiscountsFromCreateOrderData(createOrderData, false);
            }
            ctrl.syncVoucherDiscountInBasket();
            ctrl.updateSummaryDonation();
        });
}

    /**
     * Update paymentMethods when user select 'other payment method' in modal PCC option after 449 error code service uri
     * @param {Object} paymentData All information neccesary to update payment methods
     */
export function updatePaymentsWithoutCallImpl(ctrl: PmtPageController, paymentData) {
        const transformedPaymentMethods = ctrl.PmtMethodsTransformer.generateModelPayMethods(paymentData.paymentOptions, ctrl.$rootScope.appMarket);
        ctrl.deletePrivateData();
        ctrl.model.paymentInfo.paymentId = transformedPaymentMethods.paymentId;
        ctrl.model.paymentInfo.currency = transformedPaymentMethods.currency;
        ctrl.model.paymentInfo.availableDiscounts = transformedPaymentMethods.availableDiscounts;
        ctrl.model.paymentInfo.somethingToPay = transformedPaymentMethods.somethingToPay;
        ctrl.model.paymentInfo.relatedContent = ctrl.PmtUtilsService.getPaymentRelatedContent(ctrl.model.paymentInfo.relatedContent.original.termsAndConditions, ctrl.model.paymentInfo.relatedContent.original.totalPriceText);
        ctrl.$scope.$broadcast('updateSelectedTabEvent', ctrl.model.selectedData.selectedTab);
        angular.element(ctrl.$window).triggerHandler('resize');
        ctrl.updateAvailablePaymenMethods(true);
}

    /**
     *  Launch an event to the child component, to disable or enabled the quota option in the BR market,
     * if the user selects a discount or delete disscount with avios.
     * @param {Object} typeDisscount type disscount selected by user
     * @param {Event} disscountAviosSelected to lunch function
     * @param {Boolean}status define if a discount is selected
     */
export function disabledQuotasOptionImpl(ctrl: PmtPageController, event, status) {
        ctrl.$scope.$broadcast('disabledQutasOption', status);

}

export function updateDisccountsTotalImpl(ctrl: PmtPageController, event, appliedDiscountTypes, refreshPaymentMethods = true) {
        let headerModelData: any = {};
        headerModelData = ctrl.localStorageService.get('headerModel');
        ctrl.model.paymentInfo.appliedDiscounts.discountsTotal = 0;
        angular.forEach(appliedDiscountTypes, (discount) => {
            ctrl.model.paymentInfo.appliedDiscounts.discountsTotal += discount.originalDiscount;
        });
        headerModelData.headerModel.shoppingBasket.discountsModel.total = ctrl.model.paymentInfo.appliedDiscounts.discountsTotal;
        headerModelData.headerModel.shoppingBasket.discountsModel.totalFormated = ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, -ctrl.model.paymentInfo.appliedDiscounts.discountsTotal, true);
        ctrl.NewMainHeaderFacade.updateHeaderModel(headerModelData);
        ctrl.model.paymentInfo.appliedDiscounts.discountsTotalFormatted = ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, -ctrl.model.paymentInfo.appliedDiscounts.discountsTotal, true).trim();
        ctrl.updateTotalFees();
        if (refreshPaymentMethods) {
            ctrl.updateAvailablePaymenMethods();
        }
        ctrl.$rootScope.$broadcast('loadingVoucherBasket', false);
}

export function populateAppliedDiscountsFromCreateOrderDataImpl(ctrl: PmtPageController, createOrderData) {
        applyDiscountsFromCreateOrderData({
            appliedDiscounts: ctrl.model.paymentInfo.appliedDiscounts,
            createOrderData,
            flowApp: ctrl.flowApp,
            currency: ctrl.model.paymentInfo.currency,
            formatPrice: (currency, amount) => ctrl.CurrencyService.formatPrice(currency, amount, true),
            isDiscountTypePartnerEquivalent: (discountType) =>
                ctrl.CommonsUtilService.isDiscountTypePartnerEquivalent(discountType)
        });
}

export function restoreBasketDiscountsFromCreateOrderDataImpl(ctrl: PmtPageController, createOrderData, refreshPaymentMethods = false) {
        if (!hasRestorableCreateOrderDiscounts({
            createOrderData,
            flowApp: ctrl.flowApp,
            isDiscountTypePartnerEquivalent: (discountType) =>
                ctrl.CommonsUtilService.isDiscountTypePartnerEquivalent(discountType)
        })) {
            return;
        }

        ctrl.populateAppliedDiscountsFromCreateOrderData(createOrderData);

        const appliedTypes = ctrl.model.paymentInfo?.appliedDiscounts?.types ?? {};
        if (!Object.keys(appliedTypes).length) {
            return;
        }

        const headerModelData = ctrl.localStorageService.get('headerModel');
        headerModelData.headerModel.shoppingBasket.discountsModel.discounts = appliedTypes;
        headerModelData.headerModel.shoppingBasket.discountsModel.hasDiscounts = Object.keys(appliedTypes).length > 0;
        headerModelData.headerModel.shoppingBasket.total.totalPrice = ctrl.model.paymentInfo.price.totalPrice;
        headerModelData.headerModel.shoppingBasket.total.formatted = ctrl.model.paymentInfo.price.formattedTotalPrice;
        ctrl.NewMainHeaderFacade.updateHeaderModel(headerModelData);
        ctrl.model.paymentInfo.appliedDiscounts.status = headerModelData.headerModel.shoppingBasket.discountsModel.hasDiscounts;
        ctrl.updateDisccountsTotal(false, ctrl.model.paymentInfo.appliedDiscounts.types, refreshPaymentMethods);
        ctrl.DatalayerUtilsService.updateDiscountData(createOrderData.order?.specialDiscounts ?? []);
        ctrl.localStorageService.set('modelPaymentData', ctrl.model);
}

export function syncVoucherDiscountInBasketImpl(ctrl: PmtPageController) {
        const voucherDiscount = ctrl.model.paymentInfo?.appliedDiscounts?.types?.[ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER];
        if (!voucherDiscount) {
            return;
        }
        const isPartnerVoucher = ctrl.CommonsUtilService.isDiscountTypePartnerEquivalent(voucherDiscount.voucherType)
            || voucherDiscount.voucherType === ctrl.PmtConstants.DISCOUNT_TYPES.PARTNER;
        const discountType = isPartnerVoucher
            ? ctrl.PmtConstants.DISCOUNT_TYPES.PARTNER
            : ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER;
        ctrl.NewMainHeaderFacade.updateBasketDiscounts(discountType, voucherDiscount);
}
