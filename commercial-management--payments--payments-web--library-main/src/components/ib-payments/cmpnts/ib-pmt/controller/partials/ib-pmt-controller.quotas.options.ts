import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import { isSavedCardForQuota } from './ib-pmt-controller.quotas.predicates';

function clearSummaryInfoQuota(ctrl: PmtPageController): void {
    if (ctrl.model.summaryInfoQuota) {
        delete ctrl.model.summaryInfoQuota;
    }
}

function buildQuotaExpiryDate(ctrl: PmtPageController, isSavedCard: boolean): string {
    const paymentInfo = ctrl.model.paymentInfo.selectedPaymentInfo;
    if (isSavedCard) {
        const expiryDate = paymentInfo.selectedLoggedCard.expiryDate;
        return expiryDate.slice(2) + expiryDate.slice(0, 2);
    }
    const yearStr = String(paymentInfo.year);
    return yearStr.slice(-2) + paymentInfo.month.padStart(2, '0');
}

function getQuotaCardTypeId(ctrl: PmtPageController, isSavedCard: boolean): string {
    const paymentInfo = ctrl.model.paymentInfo.selectedPaymentInfo;
    return isSavedCard
        ? paymentInfo.selectedLoggedCard.cardTypeId
        : paymentInfo.selectedCard.cardTypeId;
}

function applyGraceMonthOptionsToModel(ctrl: PmtPageController, graceMonthOptions: any): void {
    angular.forEach(ctrl.model.paymentInfo.requiredAdditionalFields.info, (value) => {
        if (!value.QUOTA) {
            return;
        }
        value.QUOTA.graceMonthOptions = graceMonthOptions;
        value.QUOTA.graceMonthOptions.items = ctrl.$filter('orderBy')(graceMonthOptions.items, 'deferredMonths');
        angular.forEach(graceMonthOptions.items, (item) => {
            if (item.deferredMonths === 0) {
                value.QUOTA.graceMonthDefault = item;
            }
        });
    });
}

function finishQuotaOptionsLoading(ctrl: PmtPageController): void {
    ctrl.quotaIsLoading = false;
    ctrl.$scope.$broadcast('selectDefaultDeferedMonth');
}

function handleQuotaOptionsSuccess(ctrl: PmtPageController, graceMonthOptions: any): void {
    applyGraceMonthOptionsToModel(ctrl, graceMonthOptions);
    finishQuotaOptionsLoading(ctrl);
}

function applyFallbackGraceMonthOptions(ctrl: PmtPageController, graceMonthOptions: any): void {
    angular.forEach(ctrl.model.paymentInfo.requiredAdditionalFields.info, (value) => {
        if (!value.QUOTA) {
            return;
        }
        value.QUOTA.graceMonthOptions = graceMonthOptions;
        value.QUOTA.graceMonthDefault = graceMonthOptions.items[0];
    });
    finishQuotaOptionsLoading(ctrl);
}

function uncheckQuotasOnError(ctrl: PmtPageController): void {
    ctrl.$scope.$broadcast('unCheckQuotas');
    ctrl.quotaIsLoading = false;
}

function handleQuotaOptionsError(ctrl: PmtPageController, error: any): void {
    // Match 0f66b1b: eagerly build modal + fallback objects before branching
    // (including potential throw when errors[0] is missing).
    const hasReason = error.data && error.data.errors && error.data.errors.length > 0;
    const emptyError = !!(hasReason && error.data.errors[0].code === 'PMT_PPM_13100');
    const modalObject = {
        title: 'MODAL_ERROR_TITLE',
        message: hasReason
            ? error.data.errors[0].reason
            : error.data && error.data.error
                ? error.data.error.reason
                : ctrl.$filter('translate')(ctrl.PmtConstants.GENERAL_ERRORS.SERVICE_GENERAL_ERROR),
        needsTranslate: !hasReason,
        showbuttons: {
            accept: {
                status: true,
                text: 'MODAL_CANCEL_BUTTON',
                accessibleText: 'MODAL_CANCEL_BUTTON'
            }
        }
    };
    const graceMonthOptions = {
        items: [{
            deferredMonths: 0,
            errorCode: error.data.errors[0].code,
            deferredQuotaAmount: { total: '' },
            interest: 0,
            totalAmount: { total: '' }
        }]
    };
    if (emptyError) {
        applyFallbackGraceMonthOptions(ctrl, graceMonthOptions);
        return;
    }
    ctrl.PmtModalService.showGenericError(modalObject, true, ctrl.PmtConstants.MODALS.GENERIC_ERROR_MODAL_PAYMENT).result.then(
        () => uncheckQuotasOnError(ctrl),
        () => uncheckQuotasOnError(ctrl)
    );
}

export function getIberiaPayQuotaOptionsImpl(ctrl: PmtPageController) {
    clearSummaryInfoQuota(ctrl);
    const isSavedCard = isSavedCardForQuota(ctrl);
    const expiryDate = buildQuotaExpiryDate(ctrl, isSavedCard);
    const paymentInfo = ctrl.model.paymentInfo;
    const selectedTab = ctrl.model.selectedData.selectedTab;

    ctrl.PmtService.getIberiaPayQuotaOptions(
        ctrl.$rootScope.serviceURI,
        paymentInfo.paymentId,
        paymentInfo.paymentMethods[selectedTab].vault.id,
        expiryDate,
        getQuotaCardTypeId(ctrl, isSavedCard),
        paymentInfo.requiredAdditionalFields.info.IBERIA_PAY.QUOTA.value
    ).then(
        (graceMonthOptions) => handleQuotaOptionsSuccess(ctrl, graceMonthOptions),
        (error) => handleQuotaOptionsError(ctrl, error)
    );
}
