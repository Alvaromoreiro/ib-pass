import type { PmtPageController } from '../ib-pmt-controller';

export { updateDatalayerWithQuadrigamImpl } from './ib-pmt-controller.datalayer.quadrigam-update';
export { selectQuadrigamImpl } from './ib-pmt-controller.datalayer.select-quadrigam';
export { setTitlePageImpl } from './ib-pmt-controller.datalayer.titles';

export type DonationCheckParams = {
    event: unknown;
    status: unknown;
    option: unknown;
    donationInfo: unknown;
    newsletter: unknown;
    donationForm: unknown;
};

/**
 * Update layer information when payment finish
 */
export function updateDatalayerInformationCkiFlowImpl(ctrl: PmtPageController) {
    const confirmationDatalayerInfo = ctrl.localStorageService.get('confirmationDatalayerInfo') || {};
    if (ctrl.model.paymentInfo.selectedCard) {
        confirmationDatalayerInfo[ctrl.PmtDatalayerConstants.DATALAYER_INFO.CREDITCARD_TYPE] = ctrl.model.paymentInfo.selectedCard.cardTypeCode;
    }
    confirmationDatalayerInfo[ctrl.PmtDatalayerConstants.DATALAYER_INFO.CURRENCY] = ctrl.model.currencyCode;
    ctrl.localStorageService.set('confirmationDatalayerInfo', confirmationDatalayerInfo);

    const datalayerEcommerceInfo = ctrl.DatalayerEcommerceUtilsService.updateDatalayerCkiInfoPayments(ctrl.model);
    ctrl.localStorageService.set('confirmationEcommerceInfo', datalayerEcommerceInfo);
}

/**
 * Update payment methods, summary and total price when user interacts with donation component
 */
export function checkDonationImpl(ctrl: PmtPageController, params: DonationCheckParams) {
    ctrl.IbPmtCreditCardFeeService.checkDonation(ctrl.createFeeHost(), {
        status: params.status,
        option: params.option,
        donationInfo: params.donationInfo,
        newsletter: params.newsletter,
        donationForm: params.donationForm
    });
}

export function updateBasketOnHoldImpl(ctrl: PmtPageController, onHoldInfo, appliedDiscountTypes) {
    let headerModelData: any = {};
    headerModelData = ctrl.localStorageService.get('headerModel');
    if (headerModelData?.headerModel?.shoppingBasket?.total && onHoldInfo) {
        headerModelData.headerModel.shoppingBasket.discountsModel.discounts = appliedDiscountTypes || {};
        headerModelData.headerModel.shoppingBasket.discountsModel.hasDiscounts = Object.keys(appliedDiscountTypes).length > 0;
        headerModelData.headerModel.shoppingBasket.total = {
            formatted: onHoldInfo.priceAfterOnHold,
            original: onHoldInfo.totalPriceBooking,
            total: onHoldInfo.totalPriceBooking
        };
        ctrl.NewMainHeaderFacade.updateHeaderModel(headerModelData);
        if (appliedDiscountTypes) {
            ctrl.updateDisccountsTotal(false, appliedDiscountTypes);
        }
    }
}
