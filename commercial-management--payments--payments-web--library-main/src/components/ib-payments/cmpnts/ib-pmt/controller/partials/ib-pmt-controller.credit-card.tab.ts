import type { PmtPageController } from '../ib-pmt-controller';

function isPaypalOrButtonPayment(ctrl: PmtPageController, indexTab: number): boolean {
    const type = ctrl.model.paymentInfo.paymentMethods[indexTab].type;
    return type === 'PAYPAL' || type === 'BUTTON';
}


function removeAppliedCreditCardFee(ctrl: PmtPageController, oldFee: number | null): void {
    if (oldFee === null || !ctrl.appliedCCFee) {
        return;
    }
    ctrl.NewMainHeaderFacade.updateBasketOthers('CARD');
    ctrl.NewMainHeaderFacade.updateBasketOthers('DONATION');
    ctrl.model.paymentInfo.price.totalPrice -= oldFee;
}

function handlePaypalOrButtonTabFee(ctrl: PmtPageController, indexTab: number, oldFee: number | null): void {
    if (!isPaypalOrButtonPayment(ctrl, indexTab) || !ctrl.model.summaryInfo.orderFees) {
        return;
    }
    const orderFees = ctrl.model.summaryInfo.orderFees;
    let ccFeeIndex = 0;
    for (let i = 0; i < orderFees.length; i++) {
        if (orderFees[i].code === 'creditCardFee') {
            ccFeeIndex = i;
        }
    }
    removeAppliedCreditCardFee(ctrl, oldFee);
    ctrl.appliedCCFee = false;
    ctrl.model.paymentInfo.price.formattedTotalPrice = ctrl.CurrencyService.formatPrice(
        ctrl.model.paymentInfo.currency,
        ctrl.model.paymentInfo.price.totalPrice,
        true
    );
    ctrl.model.summaryInfo.orderFees.splice(ccFeeIndex, 1);
}

function restoreStoredCreditCardFee(ctrl: PmtPageController, indexTab: number): void {
    if (isPaypalOrButtonPayment(ctrl, indexTab)) {
        return;
    }
    if (!ctrl.localStorageService.get('creditCardFee') || ctrl.model.summaryInfo.orderFees.length > 0) {
        return;
    }
    ctrl.model.summaryInfo.orderFees.push(ctrl.localStorageService.get('creditCardFee'));
    ctrl.updateFee(ctrl.localStorageService.get('typeCardSelected'));
}

function isDonationAvailableForTab(ctrl: PmtPageController, donationIndex: number, indexTab: number): boolean {
    const paymentType = ctrl.model.paymentInfo.paymentMethods[indexTab].type;
    const possibilities = ctrl.model.donationsInfo[donationIndex].possibilities;
    return possibilities.some((possibility) => paymentType === possibility.type);
}

function updateDonationsForTab(ctrl: PmtPageController, indexTab: number, donationData: any): void {
    if (!ctrl.model.donationsInfo) {
        return;
    }
    for (let i = 0; i < ctrl.model.donationsInfo.length; i++) {
        ctrl.model.donationsInfo[i].available = isDonationAvailableForTab(ctrl, i, indexTab);
        if (donationData && ctrl.model.donationsInfo[i].available === false) {
            ctrl.applyStoredDonation(donationData, false);
            ctrl.NewMainHeaderFacade.updateBasketOthers('DONATION');
            ctrl.localStorageService.set('donation', donationData);
        } else {
            ctrl.applyStoredDonation(donationData);
        }
    }
}

export function resetMercadoPagoOnTabChange(ctrl: PmtPageController): void {
    const currentMethod = ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab];
    if (currentMethod.provider !== 'MERCADO_PAGO') {
        return;
    }
    ctrl.ibPmtMercadoPagoService.setMercadoPagoAvailable(false);
    ctrl.mercadoPagoIsCalled = false;
}

export function applyTabChangeSideEffects(ctrl: PmtPageController, indexTab: number): void {
    const donationData = ctrl.localStorageService.get('donation');
    const oldFee = ctrl.localStorageService.get('creditCardFee')
        ? ctrl.localStorageService.get('creditCardFee').totalFee
        : null;

    ctrl.model.paymentInfo.selectedPaymentInfo = {};
    ctrl.model.showOptions.showRegularButton = ctrl.model.paymentInfo.paymentMethods[indexTab].type !== 'PAYPAL';
    resetMercadoPagoOnTabChange(ctrl);
    handlePaypalOrButtonTabFee(ctrl, indexTab, oldFee);
    restoreStoredCreditCardFee(ctrl, indexTab);
    updateDonationsForTab(ctrl, indexTab, donationData);
    ctrl.model.selectedData.selectedTab = indexTab;
    ctrl.DccService.setDccData();
}
