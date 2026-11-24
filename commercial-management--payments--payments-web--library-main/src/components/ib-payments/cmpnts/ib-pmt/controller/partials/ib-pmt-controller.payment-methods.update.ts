import type { PmtPageController } from '../ib-pmt-controller';
import { applyAviosDiscount, refreshAviosBasket } from './ib-pmt-controller.payment-methods.avios';
import {
    syncBasketDiscountsFromOrder,
    syncDiscountDatalayer,
    syncModelAfterPaymentMethodsLoad
} from './ib-pmt-controller.payment-methods.basket-sync';
import { finalizePaymentMethodsUpdate } from './ib-pmt-controller.payment-methods.finalize';
import { updateCreditCardFeeInBasket } from './ib-pmt-controller.payment-methods.fee-basket';
import {
    shouldApplyAviosDiscount,
    shouldRefreshBasketDiscounts
} from './ib-pmt-controller.payment-methods.predicates';

export type PaymentMethodsUpdateContext = {
    data: any;
    errorVoucher: any;
    donationData: any;
    createOrderData: any;
    hasBasketDiscounts: boolean;
};

export function handlePaymentMethodsUpdated(ctrl: PmtPageController, ctx: PaymentMethodsUpdateContext): void {
    const selectAviosDisscount = ctrl.localStorageService.get('selectedAviosDisccount');
    const previousAncillaries = ctrl?.model?.summaryInfo?.ancillaries;
    const headerModelData = syncModelAfterPaymentMethodsLoad(ctrl, ctx.data);

    if (shouldRefreshBasketDiscounts(ctrl, selectAviosDisscount)) {
        refreshAviosBasket(ctrl);
    }
    ctrl.model.paymentInfo.appliedDiscounts.error = ctx.errorVoucher;
    if (shouldApplyAviosDiscount(ctrl, selectAviosDisscount)) {
        applyAviosDiscount(ctrl, selectAviosDisscount);
    }
    updateCreditCardFeeInBasket(ctrl, headerModelData);
    syncBasketDiscountsFromOrder(ctrl, ctx.createOrderData, previousAncillaries, ctx.hasBasketDiscounts);
    ctrl.syncVoucherDiscountInBasket();
    syncDiscountDatalayer(ctrl, ctx.createOrderData);
    finalizePaymentMethodsUpdate(ctrl, ctx.donationData);
}

export function handlePaymentMethodsUpdateError(ctrl: PmtPageController): void {
    ctrl.model.showOptions.loadingPaymentData = false;
    ctrl.PmtModalService.finishWaiting();
}
