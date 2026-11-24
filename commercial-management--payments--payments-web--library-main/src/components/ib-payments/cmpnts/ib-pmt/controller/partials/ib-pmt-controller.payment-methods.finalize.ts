import type { PmtPageController } from '../ib-pmt-controller';

function scheduleFlexAndCheckinReload(ctrl: PmtPageController): void {
    ctrl.$timeout(() => {
        if (ctrl.localStorageService.get('selectedFlex') && ctrl.$rootScope.ancOffers) {
            ctrl.model.paymentInfo.price.formattedTotalPrice = ctrl.localStorageService.get('headerModel').headerModel.shoppingBasket.total.formatted;
            ctrl.model.paymentInfo.price.totalPrice = ctrl.localStorageService.get('headerModel').headerModel.shoppingBasket.total.original;
        }
        if (ctrl.flowApp === 'CKI') {
            ctrl.$rootScope.$broadcast('reloadSlider', ctrl.model.paymentInfo);
        }
    });
}

function persistAppliedDiscountsForMarket(ctrl: PmtPageController): void {
    if (ctrl.$rootScope.appMarket === 'BR' || ctrl.$rootScope.appMarket === 'AR') {
        ctrl.localStorageService.set('appliedDisscounts', ctrl.model.paymentInfo.appliedDiscounts.status);
    }
}

export function finalizePaymentMethodsUpdate(ctrl: PmtPageController, donationData: any): void {
    scheduleFlexAndCheckinReload(ctrl);
    if (ctrl.model.paymentInfo.price.totalPrice !== 0) {
        ctrl.applyStoredDonation(donationData);
    }
    ctrl.model.showOptions.loadingPaymentData = false;
    ctrl.model.showOptions.showLoadingData = false;
    ctrl.PmtModalService.finishWaiting();
    persistAppliedDiscountsForMarket(ctrl);
    if (ctrl.model.paymentInfo.appliedDiscounts) {
        ctrl.updateDisccountsTotal(false, ctrl.model.paymentInfo.appliedDiscounts.types);
    }
    if (ctrl.model.paymentInfo.fullAvios) {
        ctrl.submitPayment();
    }
}
