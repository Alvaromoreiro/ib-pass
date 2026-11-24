import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';

export function checkPayMethodAndVouchers (ctrl: PmtConfirmationController) {
    let digital_data = ctrl.localStorageService.get( 'confirmationDigitalInfo' );
    if ( !digital_data ) return;
    const paymentMethod = setPaymentMethod(ctrl);
    const paymentMethodCode = ctrl.getPaymentMethodCode( paymentMethod );
    const voucherDiscount = setVoucherDiscount(ctrl);
    const voucherAmount = voucherDiscount?.amount || null;
    const giftCardAmount = checkGiftCardAmount(ctrl,  voucherDiscount );
    digital_data = setIfExists(ctrl,  digital_data, ctrl.DatalayerGeneralConstants.PAYMENT_METHOD, paymentMethodCode );
    digital_data = setIfExists(ctrl,  digital_data, ctrl.DatalayerBKIConstants.VOUCHER_DISCOUNT, voucherAmount );
    digital_data = setIfExists(ctrl,  digital_data, ctrl.DatalayerBKIConstants.GIFT_CARD, giftCardAmount );
    ctrl.DatalayerUtilsService.addDigitalDataInfo( digital_data );
}

export function checkGiftCardAmount (ctrl: PmtConfirmationController, voucherDiscount: any) : undefined | number {
    if ( !voucherDiscount?.remainingAmount ) return;
    return voucherDiscount.amount;
}

export function setVoucherDiscount (ctrl: PmtConfirmationController) {
    const issueOrderInfo = ctrl.localStorageService.get( 'issueOrderInfo' );
    return issueOrderInfo?.data?.order?.voucherDiscount;
}

export function setPaymentMethod (ctrl: PmtConfirmationController) {
    const selectedLoggedCard = ctrl.localStorageService.get( 'selectedLoggedCard' )?.cardTypeCode;
    const paymentProvider = ctrl.localStorageService.get( 'paymentProvider' );
    const typeCardIbPay = ctrl.localStorageService.get( 'typeCardIberiaPay' );
    return paymentProvider ?? ( typeCardIbPay || selectedLoggedCard );
}

export function setIfExists (ctrl: PmtConfirmationController, digital_data: any, key: string, value: any) : any {
    if ( value === undefined || value === null ) return digital_data;
    digital_data[ key ] = value;
    return digital_data;
}

export function checkAviosUsed (ctrl: PmtConfirmationController) : void {
    if (ctrl.model?.appliedDiscounts?.status && !!ctrl.model.appliedDiscounts.types['AVIOS_REDEMPTION']) {
        const digitalData = { AviosUsed: ctrl.model.confirmationInfo?.price.totalPriceAvios };
        ctrl.DatalayerUtilsService.addDigitalDataInfo(digitalData);
    }
}

export function canAddVoluntaryOrderInfo (ctrl: PmtConfirmationController, orderInfo, flowApp) {
    if (!orderInfo) {
        return false;
    }
    if (!orderInfo.OrderId) {
        return false;
    }
    if (flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
        return true;
    }
    return flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED;
}
