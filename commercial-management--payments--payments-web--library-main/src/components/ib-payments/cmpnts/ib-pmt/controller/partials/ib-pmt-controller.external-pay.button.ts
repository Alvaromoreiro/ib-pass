import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import {
    getSelectedPaymentMethod,
    isIdealButtonPayment,
    isJcbExternalCreditCard,
    shouldSubmitIdealBankPayment
} from './ib-pmt-controller.external-pay.predicates';

function collectIdealBankOptions(selectBanks: any): Array<{ id: number; bankName: string; bankValue: string }> {
    const banksSelectOptions = [];
    for (let index = 0; index < selectBanks.length; index++) {
        banksSelectOptions.push({
            id: index,
            bankName: selectBanks[index].text,
            bankValue: selectBanks[index].value
        });
    }
    return banksSelectOptions;
}

function submitIdealBankPayment(ctrl: PmtPageController, selectedBankOption: any): void {
    angular.element(ctrl.$document).find('.wpwl-control-bankName').find('option').remove().end();
    angular.element(ctrl.$document).find('select[name="bankAccount.bankName"]').append(`<option selected="selected" value="${selectedBankOption.bankValue}"></option>`);
    angular.element(ctrl.$document).find('.wpwl-form').submit();
    ctrl.PmtModalService.showWaitingModal('ib-modal-pmt-cards', 'ib-modals ib-modals--transparent', true, { transition: 'SOFORT' });
}

function handleIdealBankSelection(ctrl: PmtPageController, selectedBankOption: any): void {
    if (!shouldSubmitIdealBankPayment(ctrl, selectedBankOption)) {
        return;
    }
    submitIdealBankPayment(ctrl, selectedBankOption);
}

function showIdealBankSelectionModal(ctrl: PmtPageController, banksSelectOptions: any[]): void {
    angular.extend(getSelectedPaymentMethod(ctrl), { banksSelectOptions });
    ctrl.PmtModalService.showGenericModal(false, 'online-banking-select-modal.html', {
        title: 'IBPURC_PAYMENTS_ONLINE_BANKING_SELECT_BANK_TITLE',
        subtitle: 'IBPURC_PAYMENTS_ONLINE_BANKING_SELECT_BANK_SUBTITLE',
        accept: 'PAYMENT_BUTTON_MODAL_EXTERNAL',
        banksSelectOptions
    }).result.then(
        (selectedBankOption) => handleIdealBankSelection(ctrl, selectedBankOption),
        angular.noop
    );
}

function appendPaymentWidgetForm(ctrl: PmtPageController, formData: any, targetId: string): void {
    const form = `<form action="${ctrl.$sce.trustAsResourceUrl(formData.paymentFormURL)}" class="paymentWidgets" data-brands="${formData.paymentFormDataAttributes['data-brands']}" </form>`;
    ctrl.$timeout(() => {
        angular.element(ctrl.$document).find(`#${targetId}`).append(ctrl.$compile(form)(ctrl.$scope));
    });
}

function appendPaymentWidgetScript(ctrl: PmtPageController, formData: any, targetId: string): void {
    const script = `<script src="${formData.resourceJavaScriptURL}"></script>`;
    ctrl.$timeout(() => {
        angular.element(ctrl.$document).find(`#${targetId}`).append(ctrl.$compile(script)(ctrl.$scope));
    });
}

function generateOnlineBankingIdealForm(ctrl: PmtPageController, formData: any): void {
    ctrl.localStorageService.set('redirectionPaymentCallback', { status: true, redirectStatus: false, data: ctrl.model });
    ctrl.$window.wpwlOptions = {
        locale: ctrl.$rootScope.appLang,
        onReady: () => {
            ctrl.$rootScope.$broadcast('endLoadingPlaneEvent');
            ctrl.PmtModalService.finishWaiting();
            ctrl.$timeout(() => {
                angular.element(ctrl.$document).find('.spinner').css('display', 'none');
                angular.element(ctrl.$document).find('.wpwl-container').css('display', 'none');
                const selectBanks = angular.element(ctrl.$document).find('select[name="bankAccount.bankName"]')[0];
                showIdealBankSelectionModal(ctrl, collectIdealBankOptions(selectBanks));
            });
        }
    };
    appendPaymentWidgetForm(ctrl, formData, 'onlineBankingForm');
    appendPaymentWidgetScript(ctrl, formData, 'onlineBankingForm');
}

function generateJcbForm(ctrl: PmtPageController, formData: any, event: any): void {
    const banksSelectOptions = [];
    const foundElement = angular.element(ctrl.$document).find('#externalPayment').length > 0;
    ctrl.localStorageService.set('redirectionPaymentCallback', { status: true, redirectStatus: false, data: ctrl.model });
    ctrl.$window.wpwlOptions = {
        locale: ctrl.$rootScope.appLang,
        onReady: () => {
            ctrl.$rootScope.$broadcast('endLoadingPlaneEvent');
            ctrl.PmtModalService.finishWaiting();
            ctrl.$timeout(() => {
                angular.element(ctrl.$document).find('.spinner').css('display', 'none');
                angular.element(ctrl.$document).find('.wpwl-container').css('display', 'none');
                angular.extend(getSelectedPaymentMethod(ctrl), { banksSelectOptions });
                ctrl.PmtModalService.showGenericModal(false, 'external-payment-modal.html', {
                    title: 'IBPURC_EXTERNAL_PAYMENT_IFRAME_BANKING_SELECT_BANK_TITLE',
                    subtitle: 'IBPURC_EXTERNAL_PAYMENT_IFRAME_BANKING_SELECT_BANK_SUBTITLE',
                    accept: 'PAYMENT_BUTTON_MODAL_EXTERNAL'
                }).result.then(() => {
                    angular.element(ctrl.$document).find('.wpwl-form').submit();
                    event.preventDefault();
                }, angular.noop);
                ctrl.$timeout(() => {
                    angular.element(ctrl.$document).find('#iframeExternalPayment').remove();
                    angular.element(ctrl.$document).find('#externalPayment').removeClass('u-hide');
                    angular.element(ctrl.$document).find('.wpwl-form').removeClass('wpwl-form-card');
                    angular.element(ctrl.$document).find('.wpwl-group-brand').css({ display: 'none' });
                    angular.element(ctrl.$document).find('.wpwl-label').css({ 'font-weight': 'bold' });
                    angular.element(ctrl.$document).find('.wpwl-group').css({ width: '100%', 'padding-right': '0px', 'font-family': 'iberiaheadline' });
                    angular.element(ctrl.$document).find('.wpwl-button.wpwl-button-pay').addClass('ib-button ib-button--w-medium');
                    angular.element(ctrl.$document).find('.wpwl-button.wpwl-button-pay').removeClass('wpwl-button wpwl-button-pay');
                    angular.element(ctrl.$document).find('#externalPaymentModal').append(angular.element(ctrl.$document).find('#externalPayment'));
                });
                ctrl.$timeout(() => {
                    angular.element(ctrl.$document).find('.wpwl-container').css('display', '');
                }, 2000);
            });
        }
    };
    ctrl.$timeout(() => {
        if (!foundElement) {
            angular.element(ctrl.$document).find('body').append('<div id="externalPayment" class="u-hide"></div>');
        }
        const form = `<form action="${ctrl.$sce.trustAsResourceUrl(formData.paymentFormURL)}" class="paymentWidgets" data-brands="${formData.paymentFormDataAttributes['data-brands']}" </form>`;
        angular.element(ctrl.$document).find('#externalPayment').append(ctrl.$compile(form)(ctrl.$scope));
    });
    const script = `<script src="${formData.resourceJavaScriptURL}"></script>`;
    ctrl.$timeout(() => {
        angular.element(ctrl.$document).find('#externalPayment').append(ctrl.$compile(script)(ctrl.$scope));
        angular.element(ctrl.$document).find('.spinner').css('display', 'none');
    });
}

function generateOnlineBankingForm(ctrl: PmtPageController, formData: any): void {
    const form = `<form action="${ctrl.$sce.trustAsResourceUrl(formData.paymentFormURL)}" class="paymentWidgets u-hide" data-brands="${formData.paymentFormDataAttributes['data-brands']}" </form>`;
    const script = `<script src="${formData.resourceJavaScriptURL}"></script>`;
    ctrl.loadingOnlineBankingForm = true;
    ctrl.localStorageService.set('redirectionPaymentCallback', { status: true, redirectStatus: false, data: ctrl.model });
    angular.element(ctrl.$document).find('body').append(ctrl.$compile(form)(ctrl.$scope));
    ctrl.$window.wpwlOptions = {
        locale: ctrl.$rootScope.appLang,
        onReady: () => {
            angular.element(ctrl.$document).find('.spinner').css('display', 'none');
            angular.element(ctrl.$document).find('.wpwl-container').css('display', 'none');
            angular.element(ctrl.$document).find('.wpwl-control-country').find('option').remove().end();
            angular.element(ctrl.$document).find('select[name="bankAccount.country"]').append(`<option selected="selected" value="${ctrl.dataRequest.issueCountry}"></option>`);
            angular.element(ctrl.$document).find('.wpwl-form').submit();
        }
    };
    ctrl.$timeout(() => {
        angular.element(ctrl.$document).find('body').append(ctrl.$compile(script)(ctrl.$scope));
    });
}

/**
 * Generates a forms when the payment method is 'button'. The form is generated, depending on the type of provider.
 */
export function generateExternalButtonFormImpl(ctrl: PmtPageController, event, formData) {
    if (isIdealButtonPayment(ctrl)) {
        generateOnlineBankingIdealForm(ctrl, formData);
        return;
    }
    if (isJcbExternalCreditCard(ctrl)) {
        generateJcbForm(ctrl, formData, event);
        return;
    }
    generateOnlineBankingForm(ctrl, formData);
}
