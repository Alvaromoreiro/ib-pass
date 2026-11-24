import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';

    /**
     * show regular button if paypal variable is undefined
     * @param {Event} paypalUndefinedEvent Event to lunch function
     */
export function paypalUndefinedImpl(ctrl: PmtPageController, event) {
        ctrl.model.showOptions.showRegularButton = true;
}

    /**
     * Save paypal token , when user pay with paypal and checkOutService is called
     * @param {Event} payWithPaypal payWithPaypal event to lunch function
     * @param {String} token token to confirm payment in PayPal
     */
export function confirmationPaypalImpl(ctrl: PmtPageController, event, token) {
        ctrl.localStorageService.set('redirectionPaymentCallback', { status: true, redirectStatus: false, data: ctrl.model, paypalToken: token });
}

    /**
     * Update param $submitted in paymentForm Object if user click in button paypal
     * @param {Event} submitFormEvent event to launch function
     */
export function submitFormImpl(ctrl: PmtPageController, event) {
        /* ctrl.paymentsForm.$submitted = true; */
        ctrl.$timeout(() => {
            ctrl.$scope.$apply(() => {
                ctrl.paymentsForm.$submitted = true;
                ctrl.updateSubmittedTabs();
                ctrl.checkFirstFormElementError();
            });
        });
}

export function updateSubmittedTabsImpl(ctrl: PmtPageController) {
        ctrl.submittedTabs[ctrl.model.selectedData.selectedTab] = true;
}

export function checkFirstFormElementErrorImpl(ctrl: PmtPageController) {
        let firstInvalid, errorIberiaPay, elementFound = null, headerSize;
        firstInvalid = angular.element('html, body').find('form[name="paymentCtrl.paymentsForm"] input.ng-invalid:visible:first');
        errorIberiaPay = angular.element('html, body').find('#creditCardNumberIbPay');
        elementFound = firstInvalid.length > 0 ? firstInvalid : errorIberiaPay.length > 0 ? errorIberiaPay : null;
        headerSize = angular.element('html, body').find('[ib-sticky]').outerHeight() + 20;
        if (elementFound) {
            angular.element('html, body').animate({
                scrollTop: elementFound.offset().top - headerSize - 20
            });
        }
}

    /**
     *  Open the modal with all the information
     * @param {Event} event  Event to lunch function
     * @param {String} modalTemplate The html file of the modal
     * @param {Object} model All the necessary information to show the modal
     */
export function openModalLinksImpl(ctrl: PmtPageController, event, modalTemplate, model) {
        model = model || {};
        angular.extend(model, { idModal: modalTemplate });
        ctrl.PmtModalService.showGenericModal(false, modalTemplate, model).result.then(angular.noop, angular.noop);
}

    /**
     * Redirection to confirmation page when pay is done
     * @param {Event} paypalPaymentSuccessEvent event to lunch function
     */
export function goToConfirmationPageImpl(ctrl: PmtPageController, event?) {
        ctrl.localStorageService.remove('redirectionPaymentCallback');
        if (ctrl.asComponent) {
            ctrl.$scope.$emit('changeStep', ctrl.PmtConstants.COMPONENT_PAGE.PAYMENTS_PAGE, ctrl.PmtConstants.COMPONENT_PAGE.CONFIRMATION_PAGE);
        } else if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.CHECKIN) {
            ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.CKI_BOARDING_CARD_PAGE);
        } else if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES) {
            ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.MMB_CONFIRMATION_PAGE);
        } else {
            ctrl.$location.path(ctrl.PmtConstants.PAGES_URL.CONFIRMATION_PAGE);
        }
}
