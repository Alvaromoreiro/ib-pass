import angular from 'angular';
import { CommonsConstants } from 'ib-web-commons/constants';
import dayjs from 'dayjs';
import { formatTotalPriceToString } from '../../cmpnts/ib-pmt-dcc/ib-pmt-dcc.utils';
import type { PmtPageController } from '../ib-pmt-controller';
import {
    hasTicketingFee,
    shouldPersistPaymentLocationSearch,
    shouldUpdateMonetateForBookingSearch
} from './ib-pmt-controller.activate.predicates';

export function registerActivateEventListeners(ctrl: PmtPageController): void {
    const rootEvents = [
        ['submitedPaymentPCCEvent', ctrl.submitPayment],
        ['generate3DSRedirectForm', ctrl.externalPayForm],
        ['generateAfopRedirect', ctrl.externalPayForm],
        ['generateAfopNemuru', ctrl.callWithKeepSessionAlive(ctrl.loadNemuruComponent)],
        ['generateAfopMercadoPago', ctrl.callWithKeepSessionAlive(ctrl.loadMercadoPagoComponent)],
        ['generate3ds2AdyenComponent', ctrl.callWithKeepSessionAlive(ctrl.adyenComponent)],
        ['generate3ds2OneSiteIframe', ctrl.oneSiteIframe],
        ['generate3DSModalForm', ctrl.generateIframeForm],
        ['generateExtenalButtonForm', ctrl.generateExternalButtonForm],
        ['paymentOnHoldOption', ctrl.submitPayment],
        ['noPaymentGoConfirmation', ctrl.noPayment],
        ['voucherFlightAviosInfo', ctrl.updateAviosCalculated],
        ['voucherFlightAviosInfoError', ctrl.aviosCalculatedError],
        ['closeOnholdLightBox', ctrl.closeOnholdLightBox],
        ['ibdcScriptLoadError', ctrl.onIbdcScriptLoadError]
    ] as const;

    rootEvents.forEach(([eventName, handler]) => {
        const unregister = ctrl.$rootScope.$on(eventName, handler);
        ctrl.$scope.$on('$destroy', unregister);
    });

    const scopeEvents = [
        ['changeSelectedCreditCard', ctrl.updateSelectedCardFields],
        ['changeUserSelectedCreditCard', ctrl.updateUserSelectedCreditCard],
        ['getSummaryInfoQuota', ctrl.getSummaryInfoQuota],
        ['getIberiaPayQuotaInfo', ctrl.getIberiaPayQuotaInfo],
        ['openModalInfoQuota', ctrl.openModalInfoQuota],
        ['showGeneralModalInfoQuota', ctrl.openGeneralModalInfoQuotas],
        ['changeIssuerCountryEvent', ctrl.changeIssuerCountry],
        ['changeSelectedTab', ctrl.changeSelectedTab],
        ['updatePaymenthMethodsInfo', ctrl.updatePaymenthMethodsInfo],
        ['paypalUndefinedEvent', ctrl.paypalUndefined],
        ['payWithPaypal', ctrl.confirmationPaypal],
        ['submitFormEvent', ctrl.callWithKeepSessionAlive(ctrl.submitForm)],
        ['submitedPaymentEvent', ctrl.submitPayment],
        ['openSummaryModalTaxesEvent', ctrl.openModalLinks],
        ['openSummaryModalLinksEvent', ctrl.openModalLinks],
        ['openModalCo2InfoEvent', ctrl.openModalLinks],
        ['paypalPaymentSuccessEvent', ctrl.goToConfirmationPage],
        ['removeAviosDisscounts', ctrl.removeAviosDisscounts],
        ['selectOnHoldOptionEvent', ctrl.changeSelectedHoldOption],
        ['disscountAviosSelected', ctrl.disabledQuotasOption],
        ['basketUpdate', ctrl.checkBasket],
        ['basketUpdateCommonHeader', ctrl.checkBasketCommonHeader],
        ['checkDonation', ctrl.checkDonation],
        ['getSummaryInfoQuotaDeferedMonth', ctrl.getSummaryInfoQuotaDeferedMonth],
        ['updateDisccountsTotal', ctrl.updateDisccountsTotal],
        ['updateCalcAvios', ctrl.updateCalcAvios],
        ['updateSubmittedTabs', ctrl.updateSubmittedTabs],
        ['updateIberiaPayLoadingIframeStatus', ctrl.updateIberiaPayLoadingIframeStatus]
    ] as const;

    scopeEvents.forEach(([eventName, handler]) => {
        ctrl.$scope.$on(eventName, handler);
    });
}

export function setupDccSubscription(ctrl: PmtPageController): void {
    ctrl.DccService.setDccData();
    ctrl.dccDataObersever = ctrl.DccService.dccDataObservable.subscribe((value: DccModel.DccResponse) => {
        ctrl.currentDccData = value ? {
            ...value,
            formattedBasePrice: { totalPrice: ctrl.model.paymentInfo.price.formattedTotalPrice, currencyCode: value.basePrice.currency.code },
            formattedSourceTimestamp: dayjs(value.sourceTimestamp).format(ctrl.$rootScope.appMarket === 'US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'),
            totalPrice: formatTotalPriceToString(value.DCCPrice.value, {
                decimalSeparator: value.basePrice.currency.decimalSeparator,
                numberDecimals: Number(value.DCCPrice.currencyCode.substring(3)),
                groupingSeparator: value.basePrice.currency.groupingSeparator
            }),
            currencyCode: value.DCCPrice.currencyCode.replace(/\d/g, ''),
            selectedValue: value.creditCardType === 'CA' ? ctrl.PmtConstants.PAYMENTS_DCC.DCC_ENABLED : undefined
        } : undefined;
    });
}

function shouldResetDatalayerOnDestroy(ctrl: PmtPageController): boolean {
    const flowApp = ctrl.localStorageService.get('flowApp');
    return flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE
        || flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED;
}

export function setupDocumentHandlers(ctrl: PmtPageController): void {
    ctrl.$document.on('success', ctrl.iberiaPayTokenizeSucces);
    ctrl.$document.on('ready', ctrl.iberiaPayIframeReady);
    ctrl.$document.on('error', ctrl.iberiaPayErrorsControll);
    ctrl.$scope.$on('$destroy', () => {
        ctrl.$document.off('success');
        ctrl.$document.off('ready');
        ctrl.$document.off('error');
        if (shouldResetDatalayerOnDestroy(ctrl)) {
            ctrl.PmtDatalayerUtilsService.resetDatalayer();
        }
    });
    ctrl.$document.off('mouseleave');
    ctrl.$document.on('mouseleave', ctrl.openOnholdLightBox);
}

export function initializeActivateCtrlState(ctrl: PmtPageController): void {
    ctrl.showQuotasInfoFlowAppDisallowed = [CommonsConstants.APP_TYPES.GIFTCARDS, CommonsConstants.APP_TYPES.ONHOLD, CommonsConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES];
    ctrl.showGeneralSummary = false;
    ctrl.showCkiSummary = false;
    ctrl.showMmbAncillariesSummary = false;
    ctrl.appliedCCFee = false;
    ctrl.aviosToEarn = null;
    ctrl.elitePointsToEarn = null;
    ctrl.rolOb = false;
    ctrl.numberFreeUpgrade = ctrl.localStorageService.get('numberFreeUpgrade');
    ctrl.submittedTabs = {};
    ctrl.totalAviosAmount = ctrl.localStorageService.get('totalAviosAmount');
    ctrl.isCheckAviosMmbvc = ctrl.checkAviosMmbvc();
    ctrl.isCheckVoucherMmbvc = ctrl.checkVoucherMmbvc();
}

export function setupPaymentSession(ctrl: PmtPageController, redirectionInfo: any, paymentTypeCallback: string): void {
    ctrl.isIbZero = ctrl.CommonsUserUtilsService.isIbZero();
    ctrl.isSoftUser = ctrl.CommonsUserUtilsService.isSoftUser();
    ctrl.$rootScope.production = ctrl.$rootScope.production || ctrl.$window.env.production;
    ctrl.showOnHoldNotice = false;
    ctrl.iframeReadyCount = 0;
    ctrl.allowedCashAndAviosWithVoucher = ctrl.localStorageService.get('commercialData')
        && ctrl.localStorageService.get('commercialData').marketFlags
        && ctrl.localStorageService.get('commercialData').marketFlags.allowedCashAndAviosWithVoucher;
    if (shouldPersistPaymentLocationSearch(ctrl, redirectionInfo, paymentTypeCallback)) {
        ctrl.localStorageService.set('paymentLocationSearch', ctrl.$window?.location?.search);
    }
    if (ctrl.localStorageService.get('paySucces')) {
        ctrl.goToHome();
    }
    ctrl.localStorageService.set('noShowMessageBockBack', false);
    ctrl.localStorageService.set('nextStepAllowed', true);
    ctrl.localStorageService.set('previousStepFlow', ctrl.localStorageService.get('actualStepFlow'));
    ctrl.localStorageService.set('actualStepFlow', 'ibpurc');
    ctrl.$rootScope.$broadcast('warnUserOnBackPressed', history, ctrl.$window, location, angular, () => {
        return ctrl.PmtModalService.closeAllCurrentModals();
    });
    ctrl.$rootScope.$emit('closeCollapseHeader');
    ctrl.loadingOnlineBankingForm = false;
    ctrl.loadingIframeForm = false;
    ctrl.flowApp = ctrl.localStorageService.get('flowApp');
    ctrl.actualStepFlow = ctrl.localStorageService.get('actualStepFlow');
    ctrl.$timeout(() => {
        ctrl.setTitlePage();
    }, 1600);
}

export function setupFlowFlags(ctrl: PmtPageController): void {
    if (!ctrl.$rootScope.isShuttleFlow) {
        ctrl.$rootScope.isShuttleFlow = ctrl.localStorageService.get('isShuttleFlow');
    }
    if (!ctrl.$rootScope.isRedemptionFlow) {
        ctrl.$rootScope.isRedemptionFlow = ctrl.localStorageService.get('isRedemptionFlow');
    }
    if (!ctrl.$rootScope.isPointsOBFlow) {
        ctrl.$rootScope.isPointsOBFlow = ctrl.localStorageService.get('isPointsOBFlow');
    }
    ctrl.isShuttleFlow = ctrl.localStorageService.get('isShuttleFlow');
    ctrl.isONBFlow = false;
}

function getBookingSearchQuadrigam(ctrl: PmtPageController): string {
    if (!ctrl.localStorageService.get('multiCitySearch')) {
        return ctrl.selectQuadrigam();
    }
    return ctrl.localStorageService.get('isHMAD')
        ? ctrl.PmtConstants.QUADRIGAMS.HMAD_PASSENGERS_INFO
        : ctrl.PmtConstants.QUADRIGAMS.MULTI_PASSENGERS_INFO;
}

export function updateMonetateForBookingSearch(ctrl: PmtPageController): void {
    if (!shouldUpdateMonetateForBookingSearch(ctrl)) {
        return;
    }
    ctrl.MonetateUtilsService.updateMonetateWithQuadrigam(
        ctrl.MonetateConstants.MONETATE_INFO.SETPAGETYPE,
        getBookingSearchQuadrigam(ctrl)
    );
    const selectedSlicesMntt = ctrl.localStorageService.get('selectedTripSegments')
        ?? ctrl.localStorageService.get('avSelectedOffer').slices?.map(el => [...el.segments]);
    ctrl.MonetateUtilsService.addFlightReviewMonetate(
        ctrl.localStorageService.get('bookingUrlParams'),
        ctrl.localStorageService.get('originDestination'),
        selectedSlicesMntt,
        ctrl.localStorageService.get('avSelectedOffer'),
        ctrl.localStorageService.get('fareFamilyConditionsInfo')
    );
}

function applyOnBDiscountPrices(ctrl: PmtPageController): void {
    ctrl.noDiscountOBPrice = ctrl.localStorageService.get('noDiscountOBPriceUpdated')
        ? ctrl.localStorageService.get('noDiscountOBPriceUpdated')
        : ctrl.localStorageService.get('noDiscountOBPrice');
    ctrl.originalOBPrice = ctrl.localStorageService.get('originalOBPrice');
    ctrl.showNoDiscountOBPrice = ctrl.localStorageService.get('showNoDiscountOBPrice');
}

export function setupOnBFlowState(ctrl: PmtPageController): void {
    if (ctrl.localStorageService.get('userLogged') !== ctrl.PmtConstants.LOGIN_ONB) {
        return;
    }
    ctrl.isONBFlow = true;
    if (ctrl.localStorageService.get('pointsChecked')) {
        ctrl.oBPoints = ctrl.localStorageService.get('oBPoints');
        ctrl.showOBPoints = 'SHOW';
        if (ctrl.localStorageService.get('discountsAndPoints')) {
            applyOnBDiscountPrices(ctrl);
        }
        return;
    }
    applyOnBDiscountPrices(ctrl);
}

export function setupObserversAndFees(ctrl: PmtPageController): void {
    const pointsData = ctrl.localStorageService.get('CalculatedPoints');
    ctrl.aviosToEarn = pointsData ? pointsData.Avios : 0;
    ctrl.elitePointsToEarn = pointsData ? pointsData.Elite : 0;
    const fareData = ctrl.localStorageService.get('fareData');

    ctrl.nemuruAvailableObserver = ctrl.ibPmtNemuruService.nemuruIsAvailableObser.subscribe((currentStatus) => {
        ctrl.nemuruIsCalled = currentStatus;
    });
    ctrl.mercadoPagoAvailableObserver = ctrl.ibPmtMercadoPagoService.mercadoPagoIsAvailableObserver.subscribe((currentStatus) => {
        ctrl.mercadoPagoIsCalled = currentStatus;
    });

    const membershipDataOB = ctrl.localStorageService.get('membershipData');
    if (membershipDataOB) {
        ctrl.rolOb = membershipDataOB.userInfo.role.code === 'I_PART';
    }
    if (!hasTicketingFee(fareData)) {
        return;
    }
    ctrl.NewMainHeaderFacade.updateBasketOthers('SUMMARY_OTHER_FEES_ADMINISTRATION', {
        code: 'ticketingFee',
        description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
        parsedFee: ctrl.CurrencyService.formatPrice(
            ctrl.CurrencyService.getCurrencyObject(fareData.contextMetadata.currencies[0]),
            fareData.offers[0].price.ticketingFee,
            true
        ),
        totalFee: fareData.offers[0].price.ticketingFee
    });
    ctrl.updateTotalFees();
}
