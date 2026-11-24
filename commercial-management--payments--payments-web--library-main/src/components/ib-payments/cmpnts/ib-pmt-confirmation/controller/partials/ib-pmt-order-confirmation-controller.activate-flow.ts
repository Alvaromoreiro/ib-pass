import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';
import { isVoluntaryChangeApp } from './ib-pmt-order-confirmation-controller.init';
import {
    quadrigamsByDisruptionType,
    disruptionProcess
} from './ib-pmt-order-confirmation-controller.disruption';
import { applyConfirmationInfo } from './ib-pmt-order-confirmation-controller.after-pay';

export function loadConfirmationByFlow (ctrl: PmtConfirmationController, bookingInfo) {
    switch (true) {
            case isBookingWithoutStoredAncillaries(ctrl):
                ctrl.PmtOrderConfirmationService.getConfirmationAncillaries().then(() => onConfirmationAncillariesSuccess(ctrl), () => onConfirmationAncillariesSuccess(ctrl));
                break;
            case isVoluntaryChangeQuadrigam(ctrl):
                applyVoluntaryChangeConfirmation(ctrl, bookingInfo);
                break;
            case ctrl.CommonsUtilService.isFlowAppByQuadrigam(ctrl.flowApp, ctrl.PmtConstants.APP_TYPES.ONHOLD):
                ctrl.DatalayerUtilsService.setProcessAndStep(ctrl.getProcessByPaymentViewType(), ctrl.DatalayerConstants.DATALAYER_VIEWS.ONHOLD_CONFIRMATION, ctrl.PmtConstants.QUADRIGAMS.BKIOH_CONFIRMATION);
                onConfirmationAncillariesSuccess(ctrl);
                break;
            case ctrl.CommonsUtilService.isFlowAppByQuadrigam(ctrl.flowApp, ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING):
                ctrl.DatalayerUtilsService.setProcessAndStep(ctrl.DatalayerMMBConstants.DIGITAL_DATA_PROCESS.MOCAPI, ctrl.DatalayerMMBConstants.DIGITAL_DATA_STEP.MOCAPI);
                onConfirmationAncillariesSuccess(ctrl);
                break;
            default:
                onConfirmationAncillariesSuccess(ctrl);
    }
}

export function isBookingWithoutStoredAncillaries (ctrl: PmtConfirmationController) {
    if (!ctrl.CommonsUtilService.isFlowAppByQuadrigam(ctrl.flowApp, ctrl.PmtConstants.APP_TYPES.BOOKING, ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD)) {
        return false;
    }
    if (ctrl.$rootScope.isRedemptionFlow) {
        return false;
    }
    return !ctrl.localStorageService.get('ancillariesInfo');
}

export function isVoluntaryChangeQuadrigam (ctrl: PmtConfirmationController) {
    return ctrl.CommonsUtilService.isFlowAppByQuadrigam(ctrl.flowApp, ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE, ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED);
}

export function applyVoluntaryChangeConfirmation (ctrl: PmtConfirmationController, bookingInfo) {
    let modelInfoCopy = ctrl.localStorageService.get('pmtModelInfo');
    const quadrigams = resolveVoluntaryChangeQuadrigams(ctrl, bookingInfo);
    modelInfoCopy.quadrigams.confirmation = quadrigams.quadrigamConfirmation;
    modelInfoCopy.quadrigams.payments = quadrigams.quadrigamPayments;
    ctrl.localStorageService.set('pmtModelInfo', modelInfoCopy);
    const process = disruptionProcess(ctrl, ctrl.DatalayerMMBConstants.DIGITAL_DATA_PROCESS[quadrigams.quadrigamConfirmation], quadrigams.quadrigamConfirmation, bookingInfo);
    const step = ctrl.DatalayerMMBConstants.DIGITAL_DATA_STEP[quadrigams.quadrigamConfirmation];
    ctrl.DatalayerUtilsService.setProcessAndStep(process, step, quadrigams.quadrigamConfirmation);
    ctrl.$rootScope.$emit('confirmationMMBVCEvent');
    onConfirmationAncillariesSuccess(ctrl);
}

export function resolveVoluntaryChangeQuadrigams (ctrl: PmtConfirmationController, bookingInfo) {
    if (!ctrl.$rootScope.isDisruptionFlow) {
        return {
            quadrigamConfirmation: ctrl.PmtConstants.QUADRIGAMS.MMB_VOLUNTARY_CHANGE_CONFIRMATION,
            quadrigamPayments: ctrl.PmtConstants.QUADRIGAMS.MMB_VOLUNTARY_CHANGE_PAYMENT
        };
    }
    return resolveDisruptionQuadrigams(ctrl, bookingInfo);
}

export function resolveDisruptionQuadrigams (ctrl: PmtConfirmationController, bookingInfo) {
    const typeFlowDisruption = ctrl.localStorageService.get('typeDisruptionFlow') || null;
    const optional = ctrl.localStorageService.get('optionalFlight') || false;
    if (!typeFlowDisruption) {
        return {
            quadrigamConfirmation: ctrl.PmtConstants.QUADRIGAMS.MMB_VOLUNTARY_CHANGE_CONFIRMATION,
            quadrigamPayments: ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_FLEXIBILIZATION_INVOLUNTARY_PAYMENT
        };
    }
    return quadrigamsByDisruptionType(ctrl, typeFlowDisruption, optional, bookingInfo);
}

export function addVoluntaryChangeOrderInfo (ctrl: PmtConfirmationController) {
    if (isVoluntaryChangeApp(ctrl)) {
        ctrl.setOrderInfoDatalayer();
    }
}

export function onConfirmationAncillariesSuccess (ctrl: PmtConfirmationController) {
    ctrl.PmtOrderConfirmationService.getConfirmationInfo().then((response) => {
        applyConfirmationInfo(ctrl, response);
    });
}
