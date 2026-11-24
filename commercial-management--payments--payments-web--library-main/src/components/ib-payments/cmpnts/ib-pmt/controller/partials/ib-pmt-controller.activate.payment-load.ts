import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import {
    hasAncillariesSummary,
    hasPartnerVoucherDiscount,
    isOnHoldPaymentMethodType,
    shouldFinishWaitingOnPaymentLoadError,
    shouldUpdateMonetateOnPaymentLoad
} from './ib-pmt-controller.activate.predicates';

function isAfopScriptReady(ctrl: PmtPageController, paymentMethod: any): boolean {
    if (paymentMethod.provider === ctrl.PmtConstants.PAYMENT_TYPES.PAYPAL) {
        return Boolean(ctrl.$window.paypal);
    }
    if (paymentMethod.provider === ctrl.PmtConstants.PAYMENT_TYPES.NEMURU) {
        return Boolean(ctrl.$window.Nemuru);
    }
    return false;
}

function isAfopPaymentMethodType(type: string, ctrl: PmtPageController): boolean {
    return [ctrl.PmtConstants.PAYMENT_TYPES.ONHOLD_IBERIA_PAY_AFOP, ctrl.PmtConstants.PAYMENT_TYPES.IBERIA_PAY_AFOP].includes(type);
}

function markReadyAfopPaymentMethods(ctrl: PmtPageController, paymentMethods: any[]): void {
    paymentMethods.forEach((paymentMethod) => {
        if (!isAfopPaymentMethodType(paymentMethod.type, ctrl) || !isAfopScriptReady(ctrl, paymentMethod)) {
            return;
        }
        paymentMethod.scriptdownloaded = 'success';
    });
}

function findLastOnHoldPaymentMethodIndex(paymentMethods: any[], onHoldType: string): number | undefined {
    for (let index = paymentMethods.length - 1; index >= 0; index--) {
        if (paymentMethods[index].type === onHoldType) {
            return index;
        }
    }
    return undefined;
}

function removeOnHoldPaymentMethod(ctrl: PmtPageController, paymentOptions: any, paymentMethods: any[], onHoldIndex: number): void {
    ctrl.PmtUtilsService.updateOnHoldOptions(paymentOptions, onHoldIndex);
    paymentMethods.splice(onHoldIndex, 1);
}

function normalizeOtherPaymentMethods(ctrl: PmtPageController, dataIssueError: any): void {
    const paymentMethods = dataIssueError.data.paymentOptions?.paymentMethods;
    if (!paymentMethods?.length) {
        return;
    }
    markReadyAfopPaymentMethods(ctrl, paymentMethods);
    const onHoldIndex = findLastOnHoldPaymentMethodIndex(paymentMethods, ctrl.PmtConstants.PAYMENT_TYPES.ONHOLD);
    if (onHoldIndex === undefined) {
        return;
    }
    removeOnHoldPaymentMethod(ctrl, dataIssueError.data.paymentOptions, paymentMethods, onHoldIndex);
}

export function handleOtherPaymentErrorFlow(ctrl: PmtPageController, dataIssueError: any): void {
    ctrl.dataRequest = ctrl.PmtTransformer.getPaymentsModel();
    ctrl.ibPayTrace = ctrl.localStorageService.get('ibPayTrace');
    ctrl.model = ctrl.localStorageService.get('modelPaymentData');
    ctrl.model.showOptions.loadingPaymentData = true;
    ctrl.localStorageService.remove('errorIssueService');
    ctrl.localStorageService.remove('selectedPaymentData');
    normalizeOtherPaymentMethods(ctrl, dataIssueError);
    ctrl.updatePaymentsWithoutCall(dataIssueError.data);
    ctrl.model.selectedData.selectedOnHoldIndex = ctrl.localStorageService.get('onHoldOptionSelected') || 0;
    ctrl.localStorageService.set('noShowMessageBockBack', true);
    ctrl.localStorageService.set('payFlowBackBlock', true);
}

function updateShuttleDatalayer(ctrl: PmtPageController, orderData: any): void {
    // Match 0f66b1b: mutate the object returned by localStorage (no clone).
    const paDatalayerObject = ctrl.localStorageService.get('pmtModelInfo');
    paDatalayerObject.CurrencySymbol = orderData.contextMetadata.currencies[0].code;
    paDatalayerObject.SearchDest = orderData.order.slices[0].segments[0].arrival.city.code;
    paDatalayerObject.SearchOrigin = orderData.order.slices[0].segments[0].departure.city.code;
    paDatalayerObject.TotalPrice = (orderData.order.price.total).toString();
    paDatalayerObject.TotalPriceNoTaxFee = (orderData.order.price.fare).toString();
    delete paDatalayerObject.ident;
    delete paDatalayerObject.quadrigams;
    delete paDatalayerObject.issueCountry;
    ctrl.DatalayerUtilsService.updateDatalayerWithQuadrigam(
        ctrl.localStorageService.get('pmtModelInfo').quadrigams.payments,
        paDatalayerObject,
        ctrl.PmtUtilsService.isUserLogged()
    );

    const paDigitalDataObject = ctrl.localStorageService.get('pmtModelInfo');
    paDigitalDataObject.CurrencySymbol = orderData.contextMetadata.currencies[0].code;
    paDigitalDataObject.SearchDest = orderData.order.slices[0].segments[0].arrival.city.code;
    paDigitalDataObject.SearchOrigin = orderData.order.slices[0].segments[0].departure.city.code;
    paDigitalDataObject.TotalPrice = (orderData.order.price.total).toString();
    paDigitalDataObject.TotalPriceWithoutTaxes = (orderData.order.price.fare).toString();
    delete paDigitalDataObject.ident;
    delete paDigitalDataObject.quadrigams;
    delete paDigitalDataObject.issueCountry;
    ctrl.DatalayerUtilsService.updateDigitalDataWithQuadrigam(
        ctrl.localStorageService.get('pmtModelInfo').quadrigams.payments,
        paDigitalDataObject,
        ctrl.PmtUtilsService.isUserLogged()
    );
}

function checkOnHoldConditions(ctrl: PmtPageController, ident: string, issueCountry: string, serviceURI: string) {
    const isUserLogged = ctrl.PmtUtilsService.isUserLogged() ?? null;
    const bookingInfo = ctrl.localStorageService.get('bookingInfo') ?? null;
    const voucherCode = `${bookingInfo?.order?.voucherDiscount?.partnerId}/${bookingInfo?.order?.voucherDiscount?.productId}` ?? null;
    const hasPartnerDiscount = bookingInfo?.order?.voucherDiscount?.type === ctrl.PmtConstants.DISCOUNT_TYPES.PARTNER ?? null;
    if (!isUserLogged && hasPartnerDiscount) {
        return ctrl.PMTCheckPartnerDiscountsService.deletePartnerDiscount(serviceURI, voucherCode, ident)
            .then((data) => {
                const savedBookingInfo = ctrl.localStorageService.get('bookingInfo') ?? null;
                savedBookingInfo.order = data.order;
                ctrl.localStorageService.set('bookingInfo', savedBookingInfo);
                return ctrl.PmtService.getPaymenMethodsInfo(ident, issueCountry, serviceURI);
            })
            .catch(() => ctrl.PmtService.getPaymenMethodsInfo(ident, issueCountry, serviceURI));
    }
    return ctrl.PmtService.getPaymenMethodsInfo(ident, issueCountry, serviceURI);
}

function getAncillariesTotalForCheckin(ctrl: PmtPageController, data: any): any {
    return ctrl.DatalayerEcommerceUtilsService.updateDatalayerWithAncillaries(data.paymentInfo.price.totalPrice);
}

function getAncillariesTotalForVoluntaryChange(ctrl: PmtPageController, data: any): any {
    return ctrl.DatalayerEcommerceUtilsService.updateDatalayerVoluntaryChanges(data);
}

function getAncillariesTotalForNonCheckin(ctrl: PmtPageController, data: any): any {
    const ancillaries = data.summaryInfo.ancillaries;
    const total = ancillaries.total
        || (ancillaries.generalInfo ? ancillaries.generalInfo.totalPrice : 0);
    return ctrl.DatalayerEcommerceUtilsService.updateDatalayerWithAncillaries(total);
}

function getAncillariesTotalUpdate(ctrl: PmtPageController, data: any): any {
    const flowApp = ctrl.localStorageService.get('flowApp');
    if (hasAncillariesSummary(data) && flowApp !== ctrl.PmtConstants.APP_TYPES.CHECKIN) {
        return getAncillariesTotalForNonCheckin(ctrl, data);
    }
    if (flowApp === ctrl.PmtConstants.APP_TYPES.CHECKIN) {
        return getAncillariesTotalForCheckin(ctrl, data);
    }
    if (flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE
        || flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
        return getAncillariesTotalForVoluntaryChange(ctrl, data);
    }
    return undefined;
}

function sendBookingDatalayerInfo(ctrl: PmtPageController, data: any): void {
    const voucherElect = ctrl.PmtUtilsService.voucherSelected(data.paymentInfo.appliedDiscounts);
    if (ctrl.isShuttleFlow) {
        ctrl.DatalayerUtilsService.addShuttleDatalayer(ctrl.localStorageService.get('actualStepFlow'), ctrl.model);
    }
    ctrl.DatalayerUtilsService.addDataLayerInfo(voucherElect);
    const eligibleVoucherElect = ctrl.PmtUtilsService.eligibleVoucherSelected(data.paymentInfo.appliedDiscounts);
    if (ctrl.isShuttleFlow) {
        ctrl.DatalayerUtilsService.addShuttleDigitalData(ctrl.localStorageService.get('actualStepFlow'), ctrl.model);
    }
    ctrl.DatalayerUtilsService.addDigitalDataInfo(eligibleVoucherElect);
}

function updateHeaderBasketTotal(ctrl: PmtPageController, headerModelData: any): void {
    headerModelData.headerModel.shoppingBasket.total.totalPrice = ctrl.model.paymentInfo.price.totalPrice;
    headerModelData.headerModel.shoppingBasket.total.formatted = ctrl.model.paymentInfo.price.formattedTotalPrice;
    ctrl.NewMainHeaderFacade.updateHeaderModel(headerModelData);
}

function hasOrderDiscountsApplied(orderData: any): boolean {
    return Boolean(orderData.order?.discountsApplied?.discounts?.length);
}

function syncHeaderDiscountsFromOrder(ctrl: PmtPageController, headerModelData: any, orderData: any): void {
    ctrl.populateAppliedDiscountsFromCreateOrderData(orderData);
    const discounts = ctrl.model.paymentInfo?.appliedDiscounts?.types ?? {};
    headerModelData.headerModel.shoppingBasket.discountsModel.discounts = discounts;
    headerModelData.headerModel.shoppingBasket.discountsModel.hasDiscounts = Object.keys(discounts).length > 0;
    ctrl.NewMainHeaderFacade.updateHeaderModel(headerModelData);
    ctrl.model.paymentInfo.appliedDiscounts.status = headerModelData.headerModel.shoppingBasket.discountsModel.hasDiscounts;
    ctrl.updateDisccountsTotal(false, ctrl.model.paymentInfo.appliedDiscounts.types);
}

function updateHeaderFromOrderData(ctrl: PmtPageController, orderData: any): void {
    const headerModelData = ctrl.localStorageService.get('headerModel');
    updateHeaderBasketTotal(ctrl, headerModelData);
    if (!hasOrderDiscountsApplied(orderData)) {
        ctrl.DatalayerUtilsService.updateDiscountData(orderData.order?.specialDiscounts ?? []);
        return;
    }
    syncHeaderDiscountsFromOrder(ctrl, headerModelData, orderData);
    ctrl.DatalayerUtilsService.updateDiscountData(orderData.order?.specialDiscounts ?? []);
}

function updateOnHoldBasketIfNeeded(ctrl: PmtPageController): void {
    if (ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.ONHOLD) {
        return;
    }
    const onHoldInfo = { ...ctrl.model.paymentInfo.onHoldInfo };
    if (hasPartnerVoucherDiscount(ctrl)) {
        onHoldInfo.totalPriceBooking -= ctrl.model.paymentInfo.appliedDiscounts.types[ctrl.PmtConstants.DISCOUNT_TYPES.VOUCHER].totalDiscount;
    }
    ctrl.updateBasketOnHold(onHoldInfo, ctrl.model.paymentInfo.appliedDiscounts.types);
}

function sendPaymentMethodsLoadedTracking(ctrl: PmtPageController, data: any, ancillariesTotalUpdate: any): void {
    const datalayerConfirmation = Object.assign(ctrl.localStorageService.get('confirmationDatalayerInfo') ?? {}, ancillariesTotalUpdate ?? {});
    ctrl.updateDatalayerWithQuadrigam(
        ctrl.localStorageService.get('pmtModelInfo')?.quadrigams.payments,
        datalayerConfirmation,
        ctrl.PmtUtilsService.isUserLogged()
    );
    if (ctrl.localStorageService.get('flowApp') === ctrl.PmtConstants.APP_TYPES.BOOKING) {
        sendBookingDatalayerInfo(ctrl, data);
    }
    ctrl.DatalayerUtilsService.sendDatalayerEvent(ctrl.PmtDatalayerConstants.DATALAYER_EVENT_TYPES.VIEW);
    ctrl.DigitalDataService.emitViewEvent();
    ctrl.DatalayerEcommerceUtilsService.setAddPaymentInfo();
    if (shouldUpdateMonetateOnPaymentLoad(ctrl)) {
        ctrl.MonetateUtilsService.updateMonetateWithQuadrigam(
            ctrl.PmtConstants.MONETATE_INFO.SETPAGETYPE,
            ctrl.localStorageService.get('pmtModelInfo')?.quadrigams.payments
        );
    }
}

function applyFlexPriceFromHeader(ctrl: PmtPageController): void {
    if (!ctrl.localStorageService.get('selectedFlex') || !ctrl.$rootScope.ancOffers) {
        return;
    }
    ctrl.model.paymentInfo.price.formattedTotalPrice = ctrl.localStorageService.get('headerModel').headerModel.shoppingBasket.total.formatted;
    ctrl.model.paymentInfo.price.totalPrice = ctrl.localStorageService.get('headerModel').headerModel.shoppingBasket.total.original;
}

function updateOnHoldBasketOthers(ctrl: PmtPageController): void {
    const firstPaymentMethod = ctrl.model.paymentInfo?.paymentMethods?.[0];
    if (!firstPaymentMethod || !isOnHoldPaymentMethodType(firstPaymentMethod.type)) {
        return;
    }
    ctrl.NewMainHeaderFacade.updateBasketOthers(firstPaymentMethod.type, firstPaymentMethod);
}

function applyPaymentMethodsModel(ctrl: PmtPageController, data: any, donationData: any): void {
    ctrl.model = data;
    ctrl.getCcFeeRequest(data.paymentInfo?.price.totalPrice, data.paymentInfo?.currency, ctrl.dataRequest?.issueCountry, data.summaryInfo?.trips);
    if (ctrl.localStorageService.get('addedCartProductCollection')) {
        ctrl.localStorageService.remove('addedCartProductCollection');
    }
    if (ctrl.localStorageService.get('flowApp') === ctrl.PmtConstants.APP_TYPES.BOOKING) {
        ctrl.$timeout(() => {
            ctrl.trackInfoToMonetate();
            ctrl.checkAssistCardAncillary();
        });
    }
    ctrl.applyStoredDonation(donationData);
    ctrl.$timeout(() => applyFlexPriceFromHeader(ctrl));
    ctrl.localStorageService.set('modelPaymentData', ctrl.model);
    ctrl.localStorageService.set('paymentMethodsWithoutDiscount', ctrl.model.paymentInfo?.paymentMethods);
    updateOnHoldBasketOthers(ctrl);
}

function scheduleFlexibilizationUpdate(ctrl: PmtPageController): void {
    ctrl.$timeout(() => {
        if (!ctrl.localStorageService.get('selectedFlex') || !ctrl.$rootScope.ancOffers) {
            return;
        }
        const flexAvailable = ctrl.localStorageService.get('selectedFlex');
        ctrl.NewMainHeaderFacade.updateBasketFlexibilization('');
        ctrl.NewMainHeaderFacade.updateBasketFlexibilization(flexAvailable);
    });
}

function scheduleMonetateUpdate(ctrl: PmtPageController): void {
    ctrl.$timeout(() => {
        if (ctrl.localStorageService.get('flowApp') === ctrl.PmtConstants.APP_TYPES.BOOKING) {
            return;
        }
        ctrl.$rootScope.$broadcast('sendUpdateToMonetate');
    });
}

function handlePaymentMethodsLoaded(ctrl: PmtPageController, data: any, donationData: any, orderData: any): void {
    const ancillariesTotalUpdate = getAncillariesTotalUpdate(ctrl, data);
    sendPaymentMethodsLoadedTracking(ctrl, data, ancillariesTotalUpdate);
    ctrl.PmtModalService.finishWaiting();
    scheduleMonetateUpdate(ctrl);
    scheduleFlexibilizationUpdate(ctrl);
    applyPaymentMethodsModel(ctrl, data, donationData);
    if (orderData?.order) {
        ctrl.NewMainHeaderFacade.updateTripsFromOrder(orderData);
        updateHeaderFromOrderData(ctrl, orderData);
    }
    updateOnHoldBasketIfNeeded(ctrl);
    ctrl.updateTotalFees();
    ctrl.$timeout(() => {
        angular.element(ctrl.$window).triggerHandler('resize');
    });
    ctrl.validateIberiaPayAfterInit();
}

function handlePaymentMethodsLoadError(ctrl: PmtPageController, error: any): void {
    if (!shouldFinishWaitingOnPaymentLoadError(ctrl, error)) {
        return;
    }
    ctrl.PmtModalService.finishWaiting();
}

function showPaymentMethodsWaitingModal(ctrl: PmtPageController): void {
    if (ctrl.localStorageService.get('flowApp') === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) {
        ctrl.PmtModalService.showWaitingModal();
        return;
    }
    ctrl.PmtModalService.showWaitingModal('ib-modal-loading-plane-pmt', 'ib-modals ib-modals--transparent', true);
}

function getPaymentMethodsPromise(ctrl: PmtPageController) {
    if (ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) {
        return ctrl.PmtService.getPaymenMethodsInfo(ctrl.dataRequest?.ident, ctrl.dataRequest?.issueCountry, ctrl.$rootScope.serviceURI);
    }
    return checkOnHoldConditions(ctrl, ctrl.dataRequest?.ident, ctrl.dataRequest?.issueCountry, ctrl.$rootScope.serviceURI);
}

export function loadDefaultPaymentMethods(ctrl: PmtPageController, donationData: any, orderData: any): void {
    showPaymentMethodsWaitingModal(ctrl);
    ctrl.PmtUtilsService.initStorage();
    ctrl.localStorageService.set('nextStepAllowed', true);
    ctrl.dataRequest = ctrl.PmtTransformer.getPaymentsModel();
    if (ctrl.isShuttleFlow && ctrl.flowApp !== ctrl.PmtConstants.APP_TYPES.GIFTCARDS) {
        orderData = ctrl.localStorageService.get('createOrderData');
        updateShuttleDatalayer(ctrl, orderData);
    }
    getPaymentMethodsPromise(ctrl).then(
        (data) => handlePaymentMethodsLoaded(ctrl, data, donationData, orderData),
        (error) => handlePaymentMethodsLoadError(ctrl, error)
    );
}

export function handleShuttleIssueError(ctrl: PmtPageController): void {
    ctrl.updateDatalayerWithQuadrigam(
        ctrl.localStorageService.get('pmtModelInfo').quadrigams.error,
        null,
        ctrl.PmtUtilsService.isUserLogged()
    );
}
