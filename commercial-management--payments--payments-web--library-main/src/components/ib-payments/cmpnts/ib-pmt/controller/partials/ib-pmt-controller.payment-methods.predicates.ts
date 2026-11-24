import type { PmtPageController } from '../ib-pmt-controller';

export function getIssueCountry(ctrl: PmtPageController): string {
    return ctrl.localStorageService.get('selectedIssuerCountry')
        ? ctrl.localStorageService.get('selectedIssuerCountry').code
        : ctrl.model.generalData.issuerCountry.code;
}

export function hasBasketDiscountsApplied(createOrderData: any): boolean {
    // Exact 0f66b1b condition (no optional-chaining softening).
    return Boolean(
        createOrderData
        && createOrderData.order
        && createOrderData.order.discountsApplied
        && createOrderData.order.discountsApplied.discounts
        && createOrderData.order.discountsApplied.discounts.length > 0
    );
}

export function shouldRefreshBasketDiscounts(ctrl: PmtPageController, selectAviosDisscount: any): boolean {
    // Preserve original nested boolean exactly.
    return !(ctrl.selectedData && ctrl.selectedData.selectedAviosIndex && selectAviosDisscount
        && ctrl.model.paymentInfo.paymentMethods[0].type !== ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER
        && (ctrl.model.paymentInfo.availableDiscounts[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS]
            && ctrl.model.paymentInfo.availableDiscounts[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts.length >= ctrl.selectedData.selectedAviosIndex))
        || !(ctrl.model.paymentInfo.appliedDiscounts && ctrl.model.paymentInfo.appliedDiscounts.types[ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER])
        || !(ctrl.model.paymentInfo.appliedDiscounts && ctrl.model.paymentInfo.appliedDiscounts.types[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS]
            && !ctrl.model.paymentInfo.availableDiscounts[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS].available);
}

export function shouldApplyAviosDiscount(ctrl: PmtPageController, selectAviosDisscount: any): boolean {
    return Boolean(
        ctrl.selectedData && ctrl.selectedData.selectedAviosIndex
        && selectAviosDisscount
        && ctrl.model.paymentInfo.paymentMethods[0].type !== ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER
        && ctrl.model.paymentInfo.availableDiscounts
        && ctrl.model.paymentInfo.availableDiscounts[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS]
        && ctrl.model.paymentInfo.availableDiscounts[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS].available
        && (ctrl.model.paymentInfo.availableDiscounts[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS]
            && ctrl.model.paymentInfo.availableDiscounts[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS].disscounts.length >= ctrl.selectedData.selectedAviosIndex)
    );
}
