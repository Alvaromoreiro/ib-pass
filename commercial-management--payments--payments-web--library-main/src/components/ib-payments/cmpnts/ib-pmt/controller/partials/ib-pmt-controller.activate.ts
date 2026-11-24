import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import { injectIbPmtStylesHost } from '../../../../../../styles/ib-pmt-styles-host';
import { configureFlowAppUI } from './ib-pmt-controller.activate.flow-ui';
import {
    shouldHandleOtherPaymentError,
    shouldHandleRedirectionFlow,
    shouldHandleShuttleIssueError,
    shouldSetBookingCurrency
} from './ib-pmt-controller.activate.predicates';
import {
    handleOtherPaymentErrorFlow,
    handleShuttleIssueError,
    loadDefaultPaymentMethods
} from './ib-pmt-controller.activate.payment-load';
import { handleRedirectionPaymentFlow } from './ib-pmt-controller.activate.redirection';
import {
    initializeActivateCtrlState,
    registerActivateEventListeners,
    setupDccSubscription,
    setupDocumentHandlers,
    setupFlowFlags,
    setupObserversAndFees,
    setupOnBFlowState,
    setupPaymentSession,
    updateMonetateForBookingSearch
} from './ib-pmt-controller.activate.setup';

interface ActivatePaymentFlowContext {
    redirectionInfo: any;
    dataIssueError: any;
    donationData: any;
    orderData: any;
    paymentTransition: string;
    paymentTypeCallback: string;
}

function initializeActivateCommonState(ctrl: PmtPageController, redirectionInfo: any, paymentTypeCallback: string): any {
    setupPaymentSession(ctrl, redirectionInfo, paymentTypeCallback);
    setupFlowFlags(ctrl);
    if (ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) {
        ctrl.NewMainHeaderFacade.updateBasketOthers();
    }
    ctrl.NewMainHeaderFacade.updateBasketDiscounts(ctrl.PmtConstants.DISCOUNT_TYPES.AVIOS);
    updateMonetateForBookingSearch(ctrl);
    return configureFlowAppUI(ctrl);
}

function initializeActivateViewState(ctrl: PmtPageController): void {
    ctrl.$rootScope.pmtPatterns = ctrl.PmtConstants.PATTERNS;
    ctrl.isChecked = ctrl.localStorageService.get('oBDiscountType');
    ctrl.LOGIN_ONB = ctrl.PmtConstants.LOGIN_ONB;
    ctrl.numberCallEvent = 0;
    if (shouldSetBookingCurrency(ctrl)) {
        ctrl.localStorageService.set(
            'currency',
            ctrl.CurrencyService.getCurrencyObject(ctrl.localStorageService.get('createOrderData').contextMetadata.currencies[0])
        );
    }
}

function resolveActivatePaymentFlow(ctrl: PmtPageController, flow: ActivatePaymentFlowContext): void {
    if (shouldHandleRedirectionFlow(flow.redirectionInfo, flow.dataIssueError)) {
        handleRedirectionPaymentFlow(ctrl, flow.redirectionInfo, flow.paymentTransition, flow.paymentTypeCallback);
        return;
    }
    if (shouldHandleOtherPaymentError(flow.dataIssueError)) {
        handleOtherPaymentErrorFlow(ctrl, flow.dataIssueError);
        return;
    }
    if (shouldHandleShuttleIssueError(ctrl, flow.dataIssueError)) {
        handleShuttleIssueError(ctrl);
        return;
    }
    loadDefaultPaymentMethods(ctrl, flow.donationData, flow.orderData);
}

export function activateImpl(ctrl: PmtPageController) {
    injectIbPmtStylesHost();
    initializeActivateCtrlState(ctrl);
    registerActivateEventListeners(ctrl);
    setupDccSubscription(ctrl);
    setupDocumentHandlers(ctrl);

    const redirectionInfo = ctrl.localStorageService.get('redirectionPaymentCallback');
    const dataIssueError = ctrl.PmtUtilsService.getOrderId() === ctrl.localStorageService.get('lastRequestedOrderId')
        ? ctrl.localStorageService.get('errorIssueService') || null
        : null;
    const donationData = ctrl.localStorageService.get('donation');
    const paymentTransition = ctrl.localStorageService.get('paymentProvider');
    const paymentTypeCallback = ctrl.PmtUtilsService.getURLFirstParameterByName(ctrl.PmtConstants.URL_PARAMS_NAMES.PAYMENT_TYPE_CALLBACK);

    const orderData = initializeActivateCommonState(ctrl, redirectionInfo, paymentTypeCallback);
    initializeActivateViewState(ctrl);
    resolveActivatePaymentFlow(ctrl, {
        redirectionInfo,
        dataIssueError,
        donationData,
        orderData,
        paymentTransition,
        paymentTypeCallback
    });

    setupOnBFlowState(ctrl);
    angular.element(ctrl.$window).triggerHandler('resize');
    setupObserversAndFees(ctrl);
}
