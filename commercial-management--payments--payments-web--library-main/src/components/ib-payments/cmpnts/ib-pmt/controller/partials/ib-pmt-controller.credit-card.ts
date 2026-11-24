import type { PmtPageController } from '../ib-pmt-controller';
import { applyTabChangeSideEffects } from './ib-pmt-controller.credit-card.tab';
import { abortIberiaPayIframeLoadOnTabChangeImpl } from './ib-pmt-controller.iberia-pay';

export { getSelectedLoggedCardImpl } from './ib-pmt-controller.credit-card.logged-card';
export { changeIssuerCountryImpl, updatePaymentsImpl } from './ib-pmt-controller.credit-card.payments';

/**
 * Delete data on model
 * @param {BOOL} isComplete If pay is complete, clean loggedCard.
 */
export function deletePrivateDataImpl(ctrl: PmtPageController, isComplete?) {
    if (ctrl.model.selectedLoggedCard && ctrl.model.selectedLoggedCard.paymentInfo.cardTypeId !== 'newCard') {
        delete ctrl.model.paymentInfo.selectedCard;
    }
    delete ctrl.model.paymentInfo.selectedPaymentInfo.cardNumber;
    delete ctrl.model.paymentInfo.selectedPaymentInfo.newCvv;
    delete ctrl.model.paymentInfo.selectedPaymentInfo.month;
    delete ctrl.model.paymentInfo.selectedPaymentInfo.year;
    delete ctrl.model.paymentInfo.selectedPaymentInfo.selectedCard;
    delete ctrl.model.paymentInfo.selectedPaymentInfo.zipCode;
    if (isComplete) {
        delete ctrl.model.selectedLoggedCard;
    }
}

function matchesPaymentMethod(actualMethod: any, previousMethod: any): boolean {
    if (actualMethod.type !== previousMethod.type) {
        return false;
    }
    return !previousMethod.provider || previousMethod.provider === actualMethod.provider;
}

/**
 * @param {*} previousSelectedPaymentMethod
 * @param {*} actualPaymentMehods
 */
export function getActivateSelectedTabImpl(ctrl: PmtPageController, previousSelectedPaymentMethod, actualPaymentMehods) {
    if (!previousSelectedPaymentMethod || !actualPaymentMehods) {
        return 0;
    }
    const index = actualPaymentMehods.findIndex((method) => matchesPaymentMethod(method, previousSelectedPaymentMethod));
    return index >= 0 ? index : 0;
}

/**
 * Update tab if the user change payment method
 */
export function changeSelectedTabImpl(ctrl: PmtPageController, event, indexTab, previousActiveTab) {
    const previousIndex = previousActiveTab != null
        ? previousActiveTab
        : ctrl.model?.selectedData?.selectedTab;
    abortIberiaPayIframeLoadOnTabChangeImpl(ctrl, previousIndex, indexTab);
    applyTabChangeSideEffects(ctrl, indexTab);
}

/**
 * Update the 'fee' information and launch an event to the child component to update information.
 */
export function updateSelectedCardFieldsImpl(ctrl: PmtPageController, event, selectedCard) {
    ctrl.updateFee(selectedCard);
    ctrl.$scope.$broadcast('cardChanged', selectedCard);
}

/**
 * Update the 'fee' information when select an user credit card
 */
export function updateUserSelectedCreditCardImpl(ctrl: PmtPageController, event, selectedCard) {
    ctrl.updateFee(selectedCard);
}
