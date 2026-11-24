import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import {
    hasValidQuotaPaymentInfo,
    isIberiaPaySelectedTab
} from './ib-pmt-controller.quotas.predicates';

export { getIberiaPayQuotaOptionsImpl } from './ib-pmt-controller.quotas.options';

function uncheckQuotas(ctrl: PmtPageController): void {
    ctrl.$scope.$broadcast('unCheckQuotas');
}

function startIberiaPayTokenization(ctrl: PmtPageController): void {
    ctrl.quotaIsLoading = true;
    ctrl.quotaIbPayCall = true;
    ctrl.numberCallEvent = 0;
    ctrl.$window.IBDC.tokenizeCreditCard();
}

/**
 * Get all information about selected quota when service additionalField return variable 'showButtonQuotas' and save in the model
 */
export function getSummaryInfoQuotaImpl(ctrl: PmtPageController, event, quotaSelected) {
    if (!ctrl.model.paymentInfo.selectedPaymentInfo.selectedCard) {
        return;
    }
    if (ctrl.model.summaryInfoQuota) {
        delete ctrl.model.summaryInfoQuota;
    }
    ctrl.PmtService.getSummaryInfoQuota(
        ctrl.$rootScope.serviceURI,
        quotaSelected,
        ctrl.model.paymentInfo.paymentId,
        ctrl.model.paymentInfo.selectedPaymentInfo.selectedCard.cardTypeId,
        0
    ).then((infoSummaryQuota) => {
        ctrl.model.summaryInfoQuota = infoSummaryQuota;
    }, angular.noop);
}

/**
 * If all param needed from the form call tokenizeCreditCard to save iframe number and cvv
 */
export function getIberiaPayQuotaInfoImpl(ctrl: PmtPageController, event, quotaSelected) {
    if (!hasValidQuotaPaymentInfo(ctrl)) {
        uncheckQuotas(ctrl);
        return;
    }
    if (!isIberiaPaySelectedTab(ctrl)) {
        uncheckQuotas(ctrl);
        return;
    }
    startIberiaPayTokenization(ctrl);
}

export function getSummaryInfoQuotaDeferedMonthImpl(ctrl: PmtPageController, event, deferedMonthSelected, quotaSelected) {
    let summaryInfoQuota;
    if (deferedMonthSelected && !deferedMonthSelected.errorCode) {
        summaryInfoQuota = {
            quotaPrice: { fare: deferedMonthSelected.deferredQuotaAmount.total },
            interest: { percentage: deferedMonthSelected.interest + '' },
            totalPrice: { total: ctrl.model.paymentInfo.paymentMethods[0].total, currency: deferedMonthSelected.totalAmount.currency },
            finalPrice: { fare: deferedMonthSelected.totalAmount.total },
            quotasQuantity: quotaSelected,
            deferredMonths: deferedMonthSelected.deferredMonths
        };
    } else if (deferedMonthSelected?.errorCode) {
        ctrl.model.deferredMonthsError = true;
    }
    if (ctrl.model.summaryInfoQuota) {
        delete ctrl.model.summaryInfoQuota;
    }
    ctrl.model.summaryInfoQuota = summaryInfoQuota;
}

/**
 * Open modal summary-info-quotas with all details about selected quota
 */
export function openModalInfoQuotaImpl(ctrl: PmtPageController, event) {
    const model = ctrl.model.summaryInfoQuota;
    angular.extend(model, { idModal: '' });
    ctrl.PmtModalService.showGenericModal(false, 'ib-modal-summary-info-quota.html', model).result.then(angular.noop, angular.noop);
}

/**
 * Open Modal general-info-quotas with general information about quotas
 */
export function openGeneralModalInfoQuotasImpl(ctrl: PmtPageController, event) {
    const typesCreditCards = ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].types;
    ctrl.PmtModalService.showGenericModal(false, 'ib-modal-general-info-quotas.html', typesCreditCards).result.then(angular.noop, angular.noop);
}
