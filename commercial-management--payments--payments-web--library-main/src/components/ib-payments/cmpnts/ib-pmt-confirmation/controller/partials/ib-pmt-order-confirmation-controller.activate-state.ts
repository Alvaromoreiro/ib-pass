import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';

export function initConfirmationModel (ctrl: PmtConfirmationController) {
    ctrl.model = {};
    ctrl.model.confirmationInfo = {};
    ctrl.model.totalPriceInfo = {};
    ctrl.showAvis = ctrl.checkShowAvis();
    ctrl.ibPayTrace = ctrl.localStorageService.get('ibPayTrace');
    ctrl.model.showWineClubBanner = ctrl.localStorageService.get('showWineClubBanner');
}

export function readConfirmationStorage (ctrl: PmtConfirmationController) {
    ctrl.flowApp = ctrl.localStorageService.get('flowApp');
    ctrl.flightAviosInfo = storedOrNull(ctrl, 'flightAviosInfo');
    ctrl.isEmptyBasket = storedOrNull(ctrl, 'isEmptyBasket');
    ctrl.upgradingBidsInfo = storedOrNull(ctrl, 'upgradingBidsInfo');
    ctrl.isMMBBID_AVIOS = storedOrNull(ctrl, 'UPG_BIDS_AVIOS');
    const bookingInfo = ctrl.localStorageService.get('bookingInfo');
    ctrl.paymentViewType = ctrl.CommonsSessionStorageService.get('paymentViewType');
    ctrl.newPaymentViewType = ctrl.paymentViewType === 'NEW' ? true : false;
    return bookingInfo;
}

export function storedOrNull (ctrl: PmtConfirmationController, key: string) {
    return ctrl.localStorageService.get(key) || null;
}

export function syncShuttleFlowFlag (ctrl: PmtConfirmationController) {
    if (!ctrl.$rootScope.isShuttleFlow) {
        ctrl.$rootScope.isShuttleFlow = ctrl.localStorageService.get('isShuttleFlow');
    }
}

export function syncRedemptionFlowFlag (ctrl: PmtConfirmationController) {
    if (!ctrl.$rootScope.isRedemptionFlow) {
        ctrl.$rootScope.isRedemptionFlow = ctrl.localStorageService.get('isRedemptionFlow');
        return;
    }
    updateRedemptionHeaderAvios(ctrl);
}

export function updateRedemptionHeaderAvios (ctrl: PmtConfirmationController) {
    var headerModel = ctrl.localStorageService.get('headerModel');
    var customerData = ctrl.localStorageService.get('customerData');
    if (headerModel) {
        copyRedemptionAvios(ctrl, headerModel, customerData);
    }
    sessionStorage.removeItem('customerData');
    sessionStorage.removeItem('retrieveMemberDetail');
}

export function copyRedemptionAvios (ctrl: PmtConfirmationController, headerModel, customerData) {
    if (!customerData) {
        return;
    }
    headerModel.greyBarModel.loggedData.avios = customerData.generalInfo.aviosTransformed;
    ctrl.NewMainHeaderFacade.updateHeader(headerModel);
}

export function syncPointsObFlowFlag (ctrl: PmtConfirmationController) {
    if (!ctrl.$rootScope.isPointsOBFlow) {
        ctrl.$rootScope.isPointsOBFlow = ctrl.localStorageService.get('isPointsOBFlow');
    }
}

export function broadcastBidsConfirmation (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
        ctrl.$rootScope.$broadcast('toConfirmationBidEvent');
    }
}

export function setInsuranceBanner (ctrl: PmtConfirmationController) {
    ctrl.insuranceLink = 'https://iberia.allianz-assistance.com/';
    if (ctrl.$rootScope.appMarket === 'ES') {
        ctrl.showInsuranceBanner = true;
        return;
    }
    ctrl.showInsuranceBanner = false;
}

export function rememberConfirmationStep (ctrl: PmtConfirmationController) {
    ctrl.isShuttleFlow = ctrl.localStorageService.get('isShuttleFlow');
    ctrl.localStorageService.set('previousStepFlow', ctrl.localStorageService.get('actualStepFlow'));
    ctrl.localStorageService.set('actualStepFlow', 'confirmation');
}
