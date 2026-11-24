import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';
import { isVoluntaryChangeApp } from './ib-pmt-order-confirmation-controller.init';

export function applyHeaderVisibility (ctrl: PmtConfirmationController) {
    ctrl.isBKIApp = flowIsBookingFamily(ctrl);
    ctrl.isVoluntaryChange = isVoluntaryChangeApp(ctrl);
    if (ctrl.isVoluntaryChange) {
        ctrl.isVoluntaryChangeView = true;
        return;
    }
    applyNonVoluntaryHeader(ctrl);
}

export function flowIsBookingFamily (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.BOOKING) {
        return true;
    }
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.ONHOLD) {
        return true;
    }
    return ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD;
}

export function applyNonVoluntaryHeader (ctrl: PmtConfirmationController) {
    ctrl.$rootScope.showMainHeader = false;
    ctrl.isVoluntaryChangeView = false;
    if (!ctrl.isBKIApp) {
        ctrl.$rootScope.showHeaders = false;
        return;
    }
    ctrl.$rootScope.showHeaders = true;
}

export function openConfirmationWaiting (ctrl: PmtConfirmationController) {
    ctrl.localStorageService.set('paySucces', true);
    ctrl.PmtModalService.finishWaiting();
    ctrl.PmtModalService.showWaitingModal('ib-modal-loading-plane-pmt', 'ib-modals ib-modals--transparent', true);
}

export function saveNewsletterForAnonymousBooking (ctrl: PmtConfirmationController) {
    const newsletterPersonalData = ctrl.localStorageService.get('newsletterPersonalDataToSave');
    if (!isBookingOrOnHold(ctrl)) {
        return;
    }
    const isSoft = ctrl.CommonsUserUtilsService.isSoftUser();
    const isIbZero = ctrl.CommonsUserUtilsService.isIbZero();
    const handledAsAnon = isHandledAsAnon(ctrl, isIbZero, isSoft);
    if (shouldSaveNewsletter(ctrl, newsletterPersonalData, handledAsAnon)) {
        ctrl.PmtOrderConfirmationService.saveNewsletterSubscription(newsletterPersonalData);
    }
    ctrl.NewMainHeaderFacade.updateSteps(ctrl.localStorageService.get('actualStepFlow'));
    ctrl.NewMainHeaderFacade.showLogin();
}

export function isBookingOrOnHold (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.BOOKING) {
        return true;
    }
    return ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.ONHOLD;
}

export function shouldSaveNewsletter (ctrl: PmtConfirmationController, newsletterPersonalData, handledAsAnon) {
    if (!newsletterPersonalData) {
        return false;
    }
    return !!handledAsAnon;
}

export function isHandledAsAnon (ctrl: PmtConfirmationController, isIbZero, isSoft) {
    if (isIbZero) {
        return true;
    }
    if (isSoft) {
        return true;
    }
    return !ctrl.PmtUtilsService.isUserLogged();
}

export function resetOnholdHeaderCurrency (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) {
        ctrl.$rootScope.$broadcast('resetHeaderCurrency');
    }
}
