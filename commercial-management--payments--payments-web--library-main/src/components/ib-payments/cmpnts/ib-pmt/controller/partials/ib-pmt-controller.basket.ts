import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';

    /**
     * When change something in the basket we generate the payment model with the changes
     */
export function checkBasketImpl(ctrl: PmtPageController, evt) {
        const flowApp = ctrl.localStorageService.get('flowApp');
        ctrl.CommonsAncillariesService.getAncillarieSummary().then((breakdownInfo) => {
            ctrl.modelSummaryMmbAnc = ctrl.PmtBreakDownUtilsService.transformBreakdownInfo(breakdownInfo);
            if (flowApp === ctrl.PmtConstants.APP_TYPES.BOOKING) {
                ctrl.localStorageService.set('ancillariesPendingBKIFlow', breakdownInfo);
            }
        }, angular.noop);
        ctrl.generateInfoModel(ctrl.localStorageService.get('paymentInfo') && ctrl.localStorageService.get('paymentInfo').issuerCountry || null);
}

export function generateInfoModelImpl(ctrl: PmtPageController, issuerCountry) {

        ctrl.PmtModalService.showWaitingModal('ib-modal-loading-plane-pmt', 'ib-modals ib-modals--transparent', true);
        ctrl.PmtService.getPaymenMethodsInfo(ctrl.dataRequest.ident, issuerCountry, ctrl.$rootScope.serviceURI).then((transformedData) => {
            ctrl.model = transformedData;
            ctrl.model.customerData = ctrl.localStorageService.get('customerData') || null;
            ctrl.model.isLogged = ctrl.localStorageService.get('userLogged');

            ctrl.model.originalPaymentMethods = angular.copy(transformedData.paymentMethods);
            ctrl.model.selectedData.selectedTab = ctrl.getActivateSelectedTab(ctrl.localStorageService.get('selectedPaymentMethod'), ctrl.model.paymentInfo.paymentMethods);
            ctrl.$scope.$broadcast('updateSelectedTabEvent', ctrl.model.selectedData.selectedTab);
            angular.element(ctrl.$window).triggerHandler('resize');
            ctrl.PmtModalService.finishWaiting();
        }, (error) => {
            //reset the total price a 0
            ctrl.model.paymentInfo.price.totalPrice = 0;
            ctrl.model.showOptions.showRegularButton = false;
            ctrl.PmtModalService.finishWaiting();
        });
}

    /**
     * When change something in the basket we generate the payment model with the changes
     * this function was create to eliminate modal plane view when remove items from basket
     */
export function checkBasketCommonHeaderImpl(ctrl: PmtPageController, evt) {
        ctrl.modelSummaryMmbAnc = ctrl.localStorageService.get('headerModel');
        ctrl.CommonsAncillariesService.getAncillarieSummary().then((breakdownInfo) => {
            ctrl.localStorageService.set('breakdownInfo', breakdownInfo);
            ctrl.generateInfoModelCommonHeader(ctrl.localStorageService.get('paymentInfo') && ctrl.localStorageService.get('paymentInfo').issuerCountry || null);
        }, () => {
            ctrl.generateInfoModelCommonHeader(ctrl.localStorageService.get('paymentInfo') && ctrl.localStorageService.get('paymentInfo').issuerCountry || null);
        });
}

export function generateInfoModelCommonHeaderImpl(ctrl: PmtPageController, issuerCountry) {
        const getPaymentMethodsInfo = () => {
            const donationData = ctrl.localStorageService.get('donation');
            ctrl.PmtService.getPaymenMethodsInfo(ctrl.dataRequest.ident, issuerCountry, ctrl.$rootScope.serviceURI).then((transformedData) => {
                ctrl.model = transformedData;
                ctrl.model.customerData = ctrl.localStorageService.get('customerData') || null;
                ctrl.model.isLogged = ctrl.localStorageService.get('userLogged');
                ctrl.model.originalPaymentMethods = angular.copy(transformedData.paymentMethods);
                ctrl.model.selectedData.selectedTab = ctrl.getActivateSelectedTab(ctrl.localStorageService.get('selectedPaymentMethod'), ctrl.model.paymentInfo.paymentMethods);
                ctrl.$scope.$broadcast('updateSelectedTabEvent', ctrl.model.selectedData.selectedTab);
                angular.element(ctrl.$window).triggerHandler('resize');
                ctrl.applyStoredDonation(donationData);
                ctrl.$scope.$broadcast('hideLoadingCard');
                ctrl.$rootScope.$broadcast('closeModalWaitMenu');
            }, (error) => {
                ctrl.model.paymentInfo.price.totalPrice = 0;
                ctrl.model.showOptions.showRegularButton = false;
                ctrl.$scope.$broadcast('hideLoadingCard');
                ctrl.$rootScope.$broadcast('closeModalWaitMenu');
                ctrl.localStorageService.set('nextStepAllowed', false);
            });
        };
        if (ctrl.model.paymentInfo.appliedDiscounts.status && ctrl.model.paymentInfo.appliedDiscounts.types.VOUCHER) {
            ctrl.PmtAssFassAncillariesService.deleteVoucher(ctrl.model.paymentInfo.appliedDiscounts.types.VOUCHER.id).then((response) => {
                response.pendingPaymentItems.length > 0 ? ctrl.PmtAssFassAncillariesService.getVoucherValidation(ctrl.model.paymentInfo.appliedDiscounts.types.VOUCHER.id, { email: null }).then(getPaymentMethodsInfo, angular.noop) : getPaymentMethodsInfo();
            }, angular.noop);
        } else {
            getPaymentMethodsInfo();
        }
}
