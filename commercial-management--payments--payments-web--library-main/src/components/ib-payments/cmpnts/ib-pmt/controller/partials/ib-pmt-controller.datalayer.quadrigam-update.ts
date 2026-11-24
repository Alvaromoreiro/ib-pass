import type { PmtPageController } from '../ib-pmt-controller';

type DatalayerExtensionTargets = {
    extendObj: Record<string, unknown>;
    extendDigitalData: Record<string, unknown>;
};

function getDatalayerExtensionTargets(ctrl: PmtPageController, extendedObject: any): DatalayerExtensionTargets {
    return {
        extendObj: extendedObject || {},
        extendDigitalData: ctrl.localStorageService.get('confirmationDigitalInfo') || {}
    };
}

function applyCkiPaymentExtensions(ctrl: PmtPageController, quadrigam: string, targets: DatalayerExtensionTargets): void {
    if (quadrigam !== ctrl.PmtConstants.QUADRIGAMS.CKI_PAYMENT || ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.CHECKIN) {
        return;
    }
    const isFlowDuplicated = ctrl.localStorageService.get('isFlowDuplicated');
    const process = isFlowDuplicated
        ? ctrl.DatalayerConstants.DATALAYER_FLOW_CKI.PROCESS_DUPLICATE
        : ctrl.DatalayerConstants.DATALAYER_FLOW_CKI.PROCESS;
    targets.extendObj[ctrl.DatalayerConstants.DATALAYER_INFO.STEP] = ctrl.DatalayerConstants.DATALAYER_FLOW_CKI.IBCKIPURC;
    targets.extendObj[ctrl.DatalayerConstants.DATALAYER_INFO.PROCESS] = process;
    targets.extendDigitalData[ctrl.DatalayerGeneralConstants.STEP] = ctrl.DatalayerConstants.DATALAYER_FLOW_CKI.IBCKIPURC;
    targets.extendDigitalData[ctrl.DatalayerGeneralConstants.PROCESS] = process;
}

function applyBookingOrOnHoldExtensions(ctrl: PmtPageController, targets: DatalayerExtensionTargets): void {
    if (ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.BOOKING && ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.ONHOLD) {
        return;
    }
    const process = ctrl.CommonsUtilService.getProcess();
    targets.extendObj[ctrl.DatalayerConstants.DATALAYER_INFO.PROCESS] = process;
    targets.extendDigitalData[ctrl.DatalayerGeneralConstants.PROCESS] = process;
}

function applyBookingOnHoldStepExtensions(ctrl: PmtPageController, quadrigam: string, targets: DatalayerExtensionTargets): void {
    if (ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.BOOKING && ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.ONHOLD) {
        return;
    }
    const step = ctrl.DatalayerUtilsService.getStepFromQuadrigam(quadrigam, ctrl.DatalayerConstants.DATALAYER_VIEWS.PAYMENTS);
    targets.extendObj[ctrl.DatalayerConstants.DATALAYER_INFO.STEP] = step;
    targets.extendDigitalData[ctrl.DatalayerGeneralConstants.STEP] = step;
}

function applyMmbOnHoldConfirmationExtensions(ctrl: PmtPageController, quadrigam: string, targets: DatalayerExtensionTargets): void {
    if (quadrigam !== ctrl.PmtConstants.QUADRIGAMS.ON_HOLD_CONF_PAYMENT
        || ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) {
        return;
    }
    targets.extendObj[ctrl.DatalayerConstants.DATALAYER_INFO.PROCESS] = ctrl.DatalayerConstants.DATALAYER_VIEWS.ONHOLD_CONFIRMATION;
    targets.extendObj[ctrl.DatalayerConstants.DATALAYER_INFO.STEP] = ctrl.PmtDatalayerConstants.DATALAYER_VALUES.PAYMENT;
    targets.extendDigitalData[ctrl.DatalayerGeneralConstants.PROCESS] = ctrl.DatalayerConstants.DATALAYER_VIEWS.ONHOLD_CONFIRMATION;
    targets.extendDigitalData[ctrl.DatalayerGeneralConstants.STEP] = ctrl.PmtDatalayerConstants.DATALAYER_VALUES.PAYMENT;
}

function applyMmbAncillariesExtensions(ctrl: PmtPageController, quadrigam: string, targets: DatalayerExtensionTargets): void {
    if (quadrigam !== ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_PAYMENT
        || ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES) {
        return;
    }
    targets.extendObj[ctrl.DatalayerConstants.DATALAYER_INFO.PROCESS] = ctrl.DatalayerConstants.DATALAYER_VIEWS.ANCILLARIES;
    targets.extendDigitalData[ctrl.DatalayerGeneralConstants.PROCESS] = ctrl.DatalayerConstants.DATALAYER_VIEWS.ANCILLARIES;
}

function applyMmbVoluntaryChangeExtensions(ctrl: PmtPageController, targets: DatalayerExtensionTargets): void {
    if (ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE
        && ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
        return;
    }
    targets.extendObj[ctrl.DatalayerConstants.DATALAYER_INFO.STEP] = ctrl.PmtDatalayerConstants.DATALAYER_VALUES.PAYMENT;
    targets.extendDigitalData[ctrl.DatalayerGeneralConstants.STEP] = ctrl.PmtDatalayerConstants.DATALAYER_VALUES.PAYMENT;
}

function applyPnrReferenceExtensions(ctrl: PmtPageController, quadrigam: string, targets: DatalayerExtensionTargets): void {
    const isPaymentQuadrigam = quadrigam === ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_PAYMENT;
    const isConfirmationQuadrigam = quadrigam === ctrl.PmtConstants.QUADRIGAMS.MMB_ANCILLARIES_CONFIRMATION;
    if (!isPaymentQuadrigam && !isConfirmationQuadrigam) {
        return;
    }
    const pnrType = ctrl.getPNRType();
    const pnr = ctrl.getPNR();
    targets.extendObj.Reference = pnr;
    targets.extendObj.PNRType = pnrType;
    targets.extendDigitalData.Reference = pnr;
    targets.extendDigitalData.PNRType = pnrType;
}

export function updateDatalayerWithQuadrigamImpl(ctrl: PmtPageController, quadrigam, extendedObject, isUserLogged) {
    const targets = getDatalayerExtensionTargets(ctrl, extendedObject);
    applyCkiPaymentExtensions(ctrl, quadrigam, targets);
    applyBookingOrOnHoldExtensions(ctrl, targets);
    applyBookingOnHoldStepExtensions(ctrl, quadrigam, targets);
    applyMmbOnHoldConfirmationExtensions(ctrl, quadrigam, targets);
    applyMmbAncillariesExtensions(ctrl, quadrigam, targets);
    applyMmbVoluntaryChangeExtensions(ctrl, targets);
    applyPnrReferenceExtensions(ctrl, quadrigam, targets);
    ctrl.DatalayerUtilsService.updateDatalayerWithQuadrigam(quadrigam, targets.extendObj, isUserLogged);
    ctrl.DatalayerUtilsService.updateDigitalDataWithQuadrigam(quadrigam, targets.extendDigitalData, isUserLogged);
}
