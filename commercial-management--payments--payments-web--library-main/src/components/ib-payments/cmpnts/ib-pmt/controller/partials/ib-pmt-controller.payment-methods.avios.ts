import type { PmtPageController } from '../ib-pmt-controller';

export function applyAviosDiscount(ctrl: PmtPageController, selectAviosDisscount: any): void {
    ctrl.model.paymentInfo.appliedDiscounts.types[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS] = {
        formatedAvios: ctrl.CurrencyService.formatAvios(ctrl.model.paymentInfo.currency.groupingSeparator, selectAviosDisscount.aviosRequired).trim(),
        type: ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS,
        id: selectAviosDisscount.aviosRequired,
        discount: ctrl.CurrencyService.formatPrice(ctrl.model.paymentInfo.currency, selectAviosDisscount.totalDiscount.fare, true),
        originalDiscount: selectAviosDisscount.totalDiscount.fare
    };
    ctrl.NewMainHeaderFacade.updateBasketDiscounts(
        ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS,
        ctrl.model.paymentInfo.appliedDiscounts.types[ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS]
    );
    ctrl.$scope.$broadcast('selectInitialAviosIndex', false);
}

export function refreshAviosBasket(ctrl: PmtPageController): void {
    ctrl.NewMainHeaderFacade.updateBasketDiscounts();
    ctrl.$scope.$broadcast('selectInitialAviosIndex', true);
}
