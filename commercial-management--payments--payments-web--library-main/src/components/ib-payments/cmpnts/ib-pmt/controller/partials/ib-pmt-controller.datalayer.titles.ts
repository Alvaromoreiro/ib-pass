import type { PmtPageController } from '../ib-pmt-controller';

type TitlePageHandler = (ctrl: PmtPageController) => void;

function setMmbAncillariesTitle(ctrl: PmtPageController): void {
    const quadrigam = ctrl.localStorageService.get('pmtModelInfo')?.quadrigams.payments;
    if (quadrigam === 'STPURCJBR') {
        ctrl.CommonsUtilService.setTitlePage('MMB_TITLE_DEEPLINK_SEAT_PAYMENT');
        return;
    }
    if (quadrigam === 'MOPURC') {
        ctrl.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_BID_PAYMENT');
        return;
    }
    ctrl.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_ANC_PAYMENT');
}

function setMmbOnHoldTitle(ctrl: PmtPageController): void {
    const quadrigam = ctrl.localStorageService.get('pmtModelInfo')?.quadrigams.payments;
    if (quadrigam === 'OHINFO') {
        ctrl.CommonsUtilService.setTitlePage('BKI_TITLE_ON_HOLD_CONF_PAYMENT');
        return;
    }
    if (quadrigam === 'RTBKCF') {
        ctrl.CommonsUtilService.setTitlePage('BKI_TITLE_ON_HOLD_CONF_CONFIRMATION');
    }
}

function setBookingTitle(ctrl: PmtPageController): void {
    if (ctrl.isShuttleFlow) {
        ctrl.CommonsUtilService.setTitlePage('BKI_SHUTTLE_PAYMENT_PAGE');
        return;
    }
    ctrl.CommonsUtilService.setTitlePage('GENERAL_TITLE_PAYMENT_PAGE');
}

function buildTitlePageHandlers(ctrl: PmtPageController): Record<string, TitlePageHandler> {
    const titles = ctrl.PmtConstants.TITLES_APP;
    return {
        [titles.ONHOLD]: (c) => c.CommonsUtilService.setTitlePage('BKI_TITLE_PAGE_PAYMENT_PAGE_ONHOLD'),
        [titles.MANAGEMYBOOKING_BIDS]: (c) => c.CommonsUtilService.setTitlePage('MMB_TITLE_PAGE_BID_PAYMENT'),
        [titles.MANAGEMYBOOKING_ANCILLARIES]: setMmbAncillariesTitle,
        [titles.MANAGEMYBOOKING_VOLUNTARY_CHANGE]: (c) => c.CommonsUtilService.setTitlePage('MMB_VOLUNTARY_CHANGE_PAYMENT'),
        [titles.MANAGEMYBOOKING_ONHOLD]: setMmbOnHoldTitle,
        [titles.CHECKIN]: (c) => c.CommonsUtilService.setTitlePage('CKI_TITLE_PAGE_ANC_PAYMENT'),
        [titles.GIFTCARDS]: (c) => c.CommonsUtilService.setTitlePage('GIFT_CARD_CONFIGURATION_REPURC_TITLE'),
        [titles.BOOKING]: setBookingTitle
    };
}

export function setTitlePageImpl(ctrl: PmtPageController) {
    const handler = buildTitlePageHandlers(ctrl)[ctrl.flowApp]
        ?? ((c: PmtPageController) => c.CommonsUtilService.setTitlePage('GENERAL_TITLE_PAYMENT_PAGE'));
    handler(ctrl);
}
