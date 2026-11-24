import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';

type FlowUIHandler = (ctrl: PmtPageController) => any;

function loadGiftCardsOrSubscriptionTerms(ctrl: PmtPageController): void {
    ctrl.pmtConditionsGiftCardsService.getTermnsAndConditions().then((data) => {
        if (data.data) {
            ctrl.localStorageService.set('termnsAndConditionGiftCards', data.data.content.text);
            ctrl.localStorageService.set('gdprGiftCardsInfo', data.data.content);
        }
    });
}

function configureCheckinFlowUI(ctrl: PmtPageController): void {
    ctrl.NewMainHeaderFacade.updateSteps(ctrl.localStorageService.get('actualStepFlow'));
    ctrl.NewMainHeaderFacade.showLogin();
    ctrl.$rootScope.showMainHeader = false;
    ctrl.$rootScope.showPmtHeader = true;
    ctrl.showCkiSummary = true;
    if (ctrl.localStorageService.get('userLogged') && ctrl.localStorageService.get('summaryInfo')) {
        ctrl.allowedCashAndAviosWithVoucher = true;
    }
}

function configureMmbAncillariesFlowUI(ctrl: PmtPageController): void {
    ctrl.$rootScope.showMainHeader = false;
    ctrl.$rootScope.showPmtHeader = false;
    ctrl.$rootScope.showHeaders = true;
    ctrl.CommonsAncillariesService.getAncillarieSummary().then((breakdownInfo) => {
        ctrl.modelSummaryMmbAnc = ctrl.PmtBreakDownUtilsService.transformBreakdownInfo(breakdownInfo);
    }, angular.noop);
    ctrl.showMmbAncillariesSummary = true;
    if (ctrl.localStorageService.get('deepLinkData')) {
        ctrl.deepLinkData = ctrl.localStorageService.get('deepLinkData');
    }
}

function configureMmbBidsFlowUI(ctrl: PmtPageController): void {
    ctrl.CommonsAncillariesService.getAncillarieSummary().then((breakdownInfo) => {
        ctrl.modelSummaryMmbAnc = ctrl.PmtBreakDownUtilsService.transformBreakdownUpgradingBid(breakdownInfo);
    }, angular.noop);
    ctrl.showMmbAncillariesSummary = true;
}

function configureGeneralSummaryFlowUI(ctrl: PmtPageController, options: { showLogin?: boolean; hideMainHeader?: boolean; hidePmtHeader?: boolean; showHeaders?: boolean } = {}): void {
    ctrl.showGeneralSummary = true;
    ctrl.NewMainHeaderFacade.updateSteps(ctrl.localStorageService.get('actualStepFlow'));
    if (options.showLogin !== false) {
        ctrl.NewMainHeaderFacade.showLogin();
    }
    if (options.hideMainHeader) {
        ctrl.$rootScope.showMainHeader = false;
    }
    if (options.showHeaders) {
        ctrl.$rootScope.showHeaders = true;
    }
    if (options.hidePmtHeader) {
        ctrl.$rootScope.showPmtHeader = false;
    }
}

function configureMmbOnHoldFlowUI(ctrl: PmtPageController): void {
    ctrl.showGeneralSummary = true;
    ctrl.$rootScope.showMainHeader = false;
    ctrl.$rootScope.showPmtHeader = true;
    ctrl.$rootScope.showHeaders = true;
    ctrl.NewMainHeaderFacade.showLogin();
}

function configureShuttleFlowUI(ctrl: PmtPageController): void {
    ctrl.showGeneralSummary = true;
    ctrl.$rootScope.showMainHeader = false;
    ctrl.$rootScope.showHeaders = true;
}

function configureGiftCardsFlowUI(ctrl: PmtPageController): void {
    configureGeneralSummaryFlowUI(ctrl, { hidePmtHeader: true });
    if (ctrl.localStorageService.get('flowApp') === ctrl.PmtConstants.APP_TYPES.GIFTCARDS) {
        loadGiftCardsOrSubscriptionTerms(ctrl);
    }
}

function configureSubscriptionModelsFlowUI(ctrl: PmtPageController): void {
    configureGeneralSummaryFlowUI(ctrl, { hidePmtHeader: true });
    if (ctrl.localStorageService.get('flowApp') === ctrl.PmtConstants.APP_TYPES.SUBSCRIPTIONMODELS) {
        loadGiftCardsOrSubscriptionTerms(ctrl);
    }
}

function configureOnHoldFlowUI(ctrl: PmtPageController): any {
    ctrl.DatalayerEcommerceUtilsService.updateAddToCartInfoOnHold();
    configureGeneralSummaryFlowUI(ctrl, { hideMainHeader: true, hidePmtHeader: true, showHeaders: true });
    return ctrl.localStorageService.get('createOrderData');
}

function configureDefaultFlowUI(ctrl: PmtPageController): any {
    configureGeneralSummaryFlowUI(ctrl, { hideMainHeader: true, hidePmtHeader: true, showHeaders: true });
    return ctrl.localStorageService.get('createOrderData');
}

function configureGeneralSummaryOnlyFlowUI(ctrl: PmtPageController): void {
    ctrl.showGeneralSummary = true;
}

function assignFlowHandler(handlers: Record<string, FlowUIHandler>, flowType: string, handler: FlowUIHandler): void {
    handlers[flowType] = handler;
}

function assignFlowHandlers(handlers: Record<string, FlowUIHandler>, flowTypes: string[], handler: FlowUIHandler): void {
    flowTypes.forEach((flowType) => assignFlowHandler(handlers, flowType, handler));
}

function buildFlowUIHandlers(ctrl: PmtPageController): Record<string, FlowUIHandler> {
    const appTypes = ctrl.PmtConstants.APP_TYPES;
    const handlers: Record<string, FlowUIHandler> = {};

    assignFlowHandler(handlers, appTypes.CHECKIN, (c) => {
        configureCheckinFlowUI(c);
    });
    assignFlowHandler(handlers, appTypes.MANAGEMYBOOKING_ANCILLARIES, (c) => {
        configureMmbAncillariesFlowUI(c);
    });
    assignFlowHandler(handlers, appTypes.MANAGEMYBOOKING_BIDS, (c) => {
        configureMmbBidsFlowUI(c);
    });
    assignFlowHandlers(handlers, [appTypes.MANAGEMYBOOKING_VOLUNTARY_CHANGE, appTypes.MANAGEMYBOOKING_UNIFIED], (c) => {
        configureGeneralSummaryOnlyFlowUI(c);
    });
    assignFlowHandler(handlers, appTypes.MANAGEMYBOOKING_ONHOLD, (c) => {
        configureMmbOnHoldFlowUI(c);
    });
    assignFlowHandlers(handlers, [
        appTypes.SHUTTLE_OPEN,
        appTypes.SHUTTLE_OPEN_ONB,
        appTypes.SHUTTLE_REDEMPTION,
        appTypes.SHUTTLE_REDEMPTION_ONB
    ], (c) => {
        configureShuttleFlowUI(c);
    });
    assignFlowHandler(handlers, appTypes.GIFTCARDS, (c) => {
        configureGiftCardsFlowUI(c);
    });
    assignFlowHandler(handlers, appTypes.SUBSCRIPTIONMODELS, (c) => {
        configureSubscriptionModelsFlowUI(c);
    });
    assignFlowHandler(handlers, appTypes.ONHOLD, (c) => configureOnHoldFlowUI(c));

    return handlers;
}

export function configureFlowAppUI(ctrl: PmtPageController): any {
    const handler = buildFlowUIHandlers(ctrl)[ctrl.flowApp] ?? configureDefaultFlowUI;
    return handler(ctrl);
}
