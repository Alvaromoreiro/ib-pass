import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';

export function quadrigamsByDisruptionType (ctrl: PmtConfirmationController, typeFlowDisruption, optional, bookingInfo) {
    switch (typeFlowDisruption) {
            case ctrl.DatalayerMMBConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_TOTAL_WITH_FLEXIBILIZATION:
                return {
                    quadrigamConfirmation: ctrl.PmtConstants.QUADRIGAMS.MMB_VOLUNTARY_CHANGE_CONFIRMATION,
                    quadrigamPayments: ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_FLEXIB_TOTAL_PAYMENTS
                };
            case ctrl.DatalayerMMBConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITH_FLEXIBILIZATION:
                return quadrigamsParcialWithFlex(ctrl, optional, bookingInfo);
            case ctrl.DatalayerMMBConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERANTIVE_TOTAL_WITHOUT_FLEXIBILIZATION:
                return quadrigamsTotalWithoutFlex(ctrl);
            case ctrl.DatalayerMMBConstants.QUADRIGAM_BY_DISRUPTION_FLOW.ALTERNATIVE_PARCIAL_WITHOUT_FLEXIBILIZATION:
                return quadrigamsParcialWithoutFlex(ctrl);
            default:
                return { quadrigamConfirmation: '', quadrigamPayments: '' };
    }
}

export function quadrigamsParcialWithFlex (ctrl: PmtConfirmationController, optional, bookingInfo) {
    if (optional) {
        return {
            quadrigamConfirmation: ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL_CONFIRMATION,
            quadrigamPayments: ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL_PAYMENT
        };
    }
    return quadrigamsParcialWithoutOptional(ctrl, bookingInfo);
}

export function quadrigamsParcialWithoutOptional (ctrl: PmtConfirmationController, bookingInfo) {
    const quadrigams = {
        quadrigamConfirmation: ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL_CONFIRMATION,
        quadrigamPayments: ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL_PAYMENT
    };
    if (isUnOrUntkStatus(ctrl, bookingInfo)) {
        quadrigams.quadrigamConfirmation = ctrl.PmtConstants.QUADRIGAMS.MMB_VOLUNTARY_CHANGE_CONFIRMATION;
    }
    return quadrigams;
}

export function isUnOrUntkStatus (ctrl: PmtConfirmationController, bookingInfo) {
    if (bookingInfo.order.status === ctrl.PmtConstants.MMB_DISRUPTION_ORDER_STATUS.UN) {
        return true;
    }
    return bookingInfo.order.status === ctrl.PmtConstants.MMB_DISRUPTION_ORDER_STATUS.UNTK;
}

export function quadrigamsTotalWithoutFlex (ctrl: PmtConfirmationController) {
    let quadrigamConfirmation = ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL_CONFIRMATION;
    quadrigamConfirmation = ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL_PAYMENT;
    return { quadrigamConfirmation: quadrigamConfirmation, quadrigamPayments: '' };
}

export function quadrigamsParcialWithoutFlex (ctrl: PmtConfirmationController) {
    let quadrigamConfirmation = ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL_CONFIRMATION;
    quadrigamConfirmation = ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL_PAYMENT;
    return { quadrigamConfirmation: quadrigamConfirmation, quadrigamPayments: '' };
}

export function disruptionProcess (ctrl: PmtConfirmationController, process, quadrigamConfirmation, bookingInfo) {
    if (!ctrl.PmtConstants.MMB_DISRUPTION_PAYMENT_QUADRIGAM_UN_UNTK.includes(quadrigamConfirmation)) {
        return process;
    }
    return processByOrderStatus(ctrl, process, bookingInfo);
}

export function processByOrderStatus (ctrl: PmtConfirmationController, process, bookingInfo) {
    switch (bookingInfo.order.status) {
            case ctrl.PmtConstants.MMB_DISRUPTION_ORDER_STATUS.UN:
                return ctrl.PmtConstants.PROCESS_DISRUPTION.CANCELLATION;
            case ctrl.PmtConstants.MMB_DISRUPTION_ORDER_STATUS.UNTK:
                return ctrl.PmtConstants.PROCESS_DISRUPTION.CANCELLATION_ALTERNATIVE;
            default:
                return process;
    }
}
