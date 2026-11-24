import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';
import angular from 'angular';
import {
    closeConfirmationModals,
    buildCheckinUrl
} from './ib-pmt-order-confirmation-controller.closing';

export function applyConfirmationInfo (ctrl: PmtConfirmationController, response) {
    ctrl.model = response;
    if (ctrl.isUMFlight) {
        setLoggedMMBUrl(ctrl);
    }
    ctrl.model.appliedDiscounts = resolveAppliedDiscounts(ctrl);
    angular.element(ctrl.$window).triggerHandler('resize');
    ctrl.updateDatalayerInformation();
    addBookingConfirmationDatalayer(ctrl);
    ctrl.DatalayerUtilsService.sendDatalayerEvent(ctrl.PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
    ctrl.DigitalDataService.emitViewEvent();
    ctrl.updateDatalayerInfoPurchase();
    updateMonetateOnConfirmation(ctrl);
    closeConfirmationModals(ctrl);
    ctrl.$rootScope.$broadcast('sendUpdateToMonetate');
    ctrl.urlCki = buildCheckinUrl(ctrl);
    ctrl.$timeout(() => {
        ctrl.initRecommendAppWidget();
        ctrl.initTransferWidget();
    }, 1000);
    ctrl.displayWineClubBanner();
    ctrl.displayCarbonFootprintBanner();
    ctrl.localStorageService.set('confirmationInfo', ctrl.model.confirmationInfo);
}

export function setLoggedMMBUrl (ctrl: PmtConfirmationController) {
    const bookingInfo = ctrl.localStorageService.get('bookingInfo');
    const surname =
        bookingInfo?.passengers?.[0]?.personalInfo?.surname
        ?? ctrl.model?.confirmationInfo?.summaryInfo?.passengers?.personalData?.[0]?.surname
        ?? '';
    const pnr = ctrl.model?.confirmationInfo?.pnr ?? '';
    const baseLink = ctrl.$filter('LinksFilter')('MANAGE_MY_BOOKING_LOGGED_LINK', ctrl.appLang);
    const url = new URL(baseLink, ctrl.$window.location.origin);
    url.searchParams.set('pnr', pnr);
    if (surname) {
        url.searchParams.set('surname', surname);
    }
    url.hash = '!/';
    ctrl.manageMyBookingUrl = /^https?:\/\//i.test(baseLink)
        ? url.toString()
        : `${url.pathname}${url.search}${url.hash}`;
}

export function resolveAppliedDiscounts (ctrl: PmtConfirmationController) {
    if (ctrl.localStorageService.get('putWithoutOfferBin')) {
        return { status: false };
    }
    const paymentsInfo = ctrl.localStorageService.get('paymentsInfo');
    if (!paymentsInfo) {
        return null;
    }
    if (!paymentsInfo.appliedDiscounts) {
        return null;
    }
    return paymentsInfo.appliedDiscounts;
}

export function addBookingConfirmationDatalayer (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.BOOKING) {
        return;
    }
    const voucherElect = ctrl.PmtUtilsService.voucherSelected(ctrl.model.appliedDiscounts);
    if (ctrl.isShuttleFlow) {
        ctrl.DatalayerUtilsService.addShuttleDatalayer(ctrl.localStorageService.get('actualStepFlow'), ctrl.model);
    }
    ctrl.DatalayerUtilsService.addDataLayerInfo(voucherElect);
    const eligibleVoucherElect = ctrl.PmtUtilsService.eligibleVoucherSelected(ctrl.model.appliedDiscounts);
    if (ctrl.isShuttleFlow) {
        ctrl.DatalayerUtilsService.addShuttleDigitalData(ctrl.localStorageService.get('actualStepFlow'), ctrl.model);
    }
    ctrl.DatalayerUtilsService.addDigitalDataInfo(eligibleVoucherElect);
    ctrl.model.userPreferencesStoredWarning = ctrl.localStorageService.get('savePassengerPreferencesResponse');
    ctrl.deleteTemporalPNR();
}

export function updateMonetateOnConfirmation (ctrl: PmtConfirmationController) {
    if (!passesMmbMonetateGate(ctrl)) {
        return;
    }
    ctrl.MonetateUtilsService.updateMonetateWithQuadrigam(ctrl.PmtConstants.MONETATE_INFO.SETPAGETYPE, ctrl.localStorageService.get('pmtModelInfo').quadrigams.confirmation);
    addFlightBookingMonetate(ctrl);
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) {
        ctrl.$rootScope.$broadcast('changeStatusBasket', false);
    }
}

export function passesMmbMonetateGate (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING) {
        return true;
    }
    return ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD;
}

export function addFlightBookingMonetate (ctrl: PmtConfirmationController) {
    if (!shouldAddFlightBookingMonetate(ctrl)) {
        return;
    }
    const fareFamilyConditionsInfo = ctrl.localStorageService.get('fareFamilyConditionsInfo');
    const fareConditions = fareFamilyConditionsInfo ? fareFamilyConditionsInfo : ctrl.localStorageService.get('fareData').fareFamilyConditions;
    ctrl.MonetateUtilsService.addFlightBookingMonetate(ctrl.localStorageService.get('bookingUrlParams'), ctrl.localStorageService.get('originDestination'), ctrl.model.confirmationInfo, fareConditions);
    ctrl.$rootScope.$broadcast('updateDatalayer');
}

export function shouldAddFlightBookingMonetate (ctrl: PmtConfirmationController) {
    if (ctrl.$rootScope.isPointsOBFlow) {
        return false;
    }
    if (ctrl.$rootScope.isShuttleFlow) {
        return false;
    }
    if (ctrl.flowApp === 'BBKI') {
        return true;
    }
    return ctrl.flowApp === 'BBKIOH';
}
