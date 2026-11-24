import type { PmtPageController } from '../ib-pmt-controller';

export function openOnholdLightBoxImpl(ctrl: PmtPageController, event) {
        ctrl.modelLightBox = {
            title: 'ONHOLD_OPTION_TITLE',
            subtitle: ctrl.CommonsUtilService.fiterTextOptionOnhold().modalText,
            text: 'ONHOLD_OPTION_TEXT_ANC'
        };
        if (ctrl.CommonsUtilService.isAvailableLightBox()) {
            ctrl.localStorageService.set('OnholdLightBoxShowed', true);
            ctrl.showOnHoldNotice = true;
        }
}

export function closeOnholdLightBoxImpl(ctrl: PmtPageController, event, show) {
        ctrl.showOnHoldNotice = show;
}

export function loadNemuruComponentImpl(ctrl: PmtPageController, event, formData) {
        ctrl.ibPmtNemuruService.setNemuruAvailable(true);
        ctrl.model.paymentInfo.Nemuru={
            accessToken:formData.component.accessToken,
            orderId:formData.component.orderId
        };
}

export function loadMercadoPagoComponentImpl(ctrl: PmtPageController, event, formData) {
        ctrl.ibPmtMercadoPagoService.setMercadoPagoAvailable(true);
        ctrl.model.paymentInfo.MERCADO_PAGO = {
            preferenceId :formData.component.id
        };
        ctrl.localStorageService.set('redirectionPaymentCallback', { status: true, redirectStatus: false, data: ctrl.model });
}

export function updateCalcAviosImpl(ctrl: PmtPageController, evt, flightAviosInfo) {
        ctrl.IbUiAviosSummaryService.getCalculateAviosSummary(flightAviosInfo).then(
            (response) => ctrl.updateAviosCalculated(),
            (error) => ctrl.aviosCalculatedError()
        );
}

export function callWithKeepSessionAliveImpl(ctrl: PmtPageController, paymentMethod) {
        return (...args) => {
            ctrl.CommonsKeepAliveUtilsService.keepSessionAlive();
            return paymentMethod.apply(ctrl, args);
        };
}

    /**
     * Calls finishWaiting function if flows are CKI, MMB, GiftCards and Subscription Models
     * @param {string} flowApp string with information of application flow
     * @returns {void}
     */
export function callFinishWaitingModalImpl(ctrl: PmtPageController, flowApp: string) {
        const finishWaitingFlows: string[] = [
            ctrl.PmtConstants.APP_TYPES.CHECKIN,
            ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES,
            ctrl.PmtConstants.APP_TYPES.GIFTCARDS,
            ctrl.PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS
        ];
        finishWaitingFlows.includes(flowApp) && ctrl.PmtModalService.finishWaiting();
}

export function checkVoucherMmbvcImpl(ctrl: PmtPageController) {
        let isActiveVoucherMmb:boolean = ctrl.localStorageService.get('isActiveVoucherMmb');
        let flowApp = ctrl.localStorageService.get('flowApp');
        return (isActiveVoucherMmb ? isActiveVoucherMmb : flowApp !== 'MMBVC');
}

export function checkAviosMmbvcImpl(ctrl: PmtPageController) {
        let isActiveAviosMmb:boolean = ctrl.localStorageService.get('isActiveAviosMmb');
        let flowApp = ctrl.localStorageService.get('flowApp');
        return (isActiveAviosMmb ? isActiveAviosMmb : flowApp !== 'MMBVC');
}

export function getPNRTypeImpl(ctrl: PmtPageController) {
        const bookingInfo: any = ctrl.localStorageService.get('bookingInfo');
        let pnrType: string;
        if (!bookingInfo) return;
        const hasDisruption =
        !!bookingInfo.genericDisruptionCapabilitiesInformation;
        const hasFlexibility = !!bookingInfo.flexibilizationCapabilitiesInformation;
        const isIssued = bookingInfo.order.status === 'ISSUED';
        const isDisruptedCase = hasDisruption || (hasFlexibility && !isIssued);
        const isFlexibleCase = hasFlexibility && isIssued;
        pnrType = ctrl.determinePNRType(isDisruptedCase, isFlexibleCase);
        return pnrType;
}

export function getPNRImpl(ctrl: PmtPageController) {
        const bookingInfo: any = ctrl.localStorageService.get('bookingInfo');
        const pnrFromLocalStorage: any = ctrl.localStorageService.get('PNR');

        return (pnrFromLocalStorage ? pnrFromLocalStorage : bookingInfo?.order?.clientLocator) ?? '';
}

export function determinePNRTypeImpl(ctrl: PmtPageController, isDisrupted: boolean, isFlexible: boolean) {
        if (isDisrupted) {
            return ctrl.PmtDatalayerConstants.DATALAYER_VALUES.DISRUPTED;
        }
        if (isFlexible) {
            return ctrl.PmtDatalayerConstants.DATALAYER_VALUES.FLEXIBLE;
        }
        return ctrl.PmtDatalayerConstants.DATALAYER_VALUES.NON_FLEXIBLE;
}
