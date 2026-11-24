import dayjs from 'dayjs';
import type { PmtPageController } from '../ib-pmt-controller';
import {
    getIssueCountry,
    hasBasketDiscountsApplied
} from './ib-pmt-controller.payment-methods.predicates';
import {
    handlePaymentMethodsUpdated,
    handlePaymentMethodsUpdateError
} from './ib-pmt-controller.payment-methods.update';

/**
 *  Update payment methods when user check voucher or change countryIssue
 * @param {Event} updatePaymenthMethodsInfo Event to lunch function
 */
export function updatePaymenthMethodsInfoImpl(ctrl: PmtPageController, event) {
    const errorVoucher = ctrl.model.paymentInfo.appliedDiscounts.error;
    const issueCountry = getIssueCountry(ctrl);
    const donationData = ctrl.localStorageService.get('donation');
    // Match 0f66b1b: do not coerce null/undefined to {}.
    const createOrderData = ctrl.localStorageService.get('createOrderData');
    const hasBasketDiscounts = hasBasketDiscountsApplied(createOrderData);

    ctrl.model.showOptions.loadingPaymentData = true;
    ctrl.PmtService.getPaymenMethodsInfo(ctrl.dataRequest.ident, issueCountry, ctrl.$rootScope.serviceURI).then(
        (data) => {
            ctrl.getCcFeeRequest(data.paymentInfo?.price.totalPrice, data.paymentInfo?.currency, ctrl.dataRequest?.issueCountry, data.summaryInfo?.trips);
            ctrl.DccService.setDccData();
            handlePaymentMethodsUpdated(ctrl, {
                data,
                errorVoucher,
                donationData,
                createOrderData,
                hasBasketDiscounts
            });
        },
        () => handlePaymentMethodsUpdateError(ctrl)
    );

    if (ctrl.localStorageService.get('flowApp') === ctrl.PmtConstants.APP_TYPES.CHECKIN) {
        ctrl.$rootScope.timeSession.startTime = dayjs();
    }
}
