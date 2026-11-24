import type { PmtPageController } from '../ib-pmt-controller';

function hasOrderFeeAndOthers(ctrl: PmtPageController, headerModelData: any): boolean {
    return Boolean(
        ctrl.model
        && ctrl.model.summaryInfo
        && ctrl.model.summaryInfo.orderFees
        && ctrl.model.summaryInfo.orderFees[0]
        && headerModelData.headerModel.shoppingBasket.othersModel.others
    );
}

function hasMatchingCreditCardFee(otherFee: any, firstOrderFee: any, ctrl: PmtPageController): boolean {
    return otherFee.code === ctrl.PmtConstants.ORDER_ITEMS_TYPES.CREDIT_CARD_FEE
        && otherFee.code === firstOrderFee.code;
}

function basketHasExistingCreditCardFee(others: any[], firstOrderFee: any, ctrl: PmtPageController): boolean {
    if (!others || others.length === 0) {
        return false;
    }
    return others.some((otherFee) => hasMatchingCreditCardFee(otherFee, firstOrderFee, ctrl));
}

function addCreditCardFeeToBasket(ctrl: PmtPageController, firstOrderFee: any): void {
    ctrl.NewMainHeaderFacade.updateBasketOthers(firstOrderFee.description, {
        code: firstOrderFee.code,
        description: firstOrderFee.description,
        parsedFee: firstOrderFee.fee,
        totalFee: firstOrderFee.totalFee
    });
    ctrl.updateTotalFees();
}

export function updateCreditCardFeeInBasket(ctrl: PmtPageController, headerModelData: any): void {
    if (!hasOrderFeeAndOthers(ctrl, headerModelData)) {
        return;
    }
    const firstOrderFee = ctrl.model.summaryInfo.orderFees[0];
    const others = headerModelData.headerModel.shoppingBasket.othersModel.others;
    if (!basketHasExistingCreditCardFee(others, firstOrderFee, ctrl)) {
        addCreditCardFeeToBasket(ctrl, firstOrderFee);
    }
}
