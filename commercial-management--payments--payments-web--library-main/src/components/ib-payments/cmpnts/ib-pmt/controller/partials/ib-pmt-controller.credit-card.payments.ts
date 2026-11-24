import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import { getSelectedLoggedCardImpl } from './ib-pmt-controller.credit-card.logged-card';

export type ChangeIssuerCountryParams = {
    event: any;
    issuerCountry: any;
    selectedCard: any;
    creditCardFormModel: any;
};

export type UpdatePaymentsParams = {
    issuerCountry: any;
    customerCards: any;
    selectedCard: any;
    creditCardFormModel: any;
};

function buildNewLoggedCardOption() {
    return {
        description: 'CREDIT_CARD_FORM_SELECT_NEW_LOGGED_OPTION',
        cardTypeId: 'newCard',
        profileCardId: 'newCard',
        active: true,
        provider: {
            CREDITCARD: true,
            IBERIA_PAY: true
        }
    };
}

function finalizePaymentsUpdate(ctrl: PmtPageController): void {
    ctrl.$timeout(() => {
        ctrl.model.selectedData.selectedTab = ctrl.getActivateSelectedTab(
            ctrl.localStorageService.get('selectedPaymentMethod'),
            ctrl.model.paymentInfo.paymentMethods
        );
        ctrl.$scope.$broadcast('updateSelectedTabEvent', ctrl.model.selectedData.selectedTab);
        if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.ONHOLD) {
            ctrl.model.selectedData.selectedOnHoldIndex = ctrl.localStorageService.get('onHoldOptionSelected')
                ? ctrl.localStorageService.get('onHoldOptionSelected')
                : 0;
            ctrl.changeSelectedHoldOption(
                null,
                ctrl.model.paymentInfo.onHoldInfo.onHoldPaymentOptions[ctrl.model.selectedData.selectedOnHoldIndex],
                ctrl.model.selectedData.selectedOnHoldIndex
            );
        }
        ctrl.model.showOptions.showLoadingData = false;
        angular.element(ctrl.$window).triggerHandler('resize');
    });
}

function persistIssuerCountryChange(ctrl: PmtPageController, issuerCountry: any): void {
    ctrl.model.showOptions.showLoadingData = true;
    ctrl.NewMainHeaderFacade.updateBasketOthers('CARD');
    ctrl.localStorageService.set('selectedIssuerCountry', issuerCountry);
    ctrl.localStorageService.set('changeCountryInCombo', true);
    ctrl.localStorageService.set('selectedPaymentMethod', {
        type: ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].type,
        provider: ctrl.model.paymentInfo.paymentMethods[ctrl.model.selectedData.selectedTab].provider
    });
    if (ctrl.localStorageService.get('creditCardFee')) {
        ctrl.localStorageService.remove('creditCardFee');
    }
}

export function changeIssuerCountryImpl(ctrl: PmtPageController, params: ChangeIssuerCountryParams) {
    persistIssuerCountryChange(ctrl, params.issuerCountry);
    ctrl.PmtService.getPaymenMethodsInfo(ctrl.dataRequest.ident, params.issuerCountry.code, ctrl.$rootScope.serviceURI, true).then(
        (data) => {
            ctrl.model = data;
            ctrl.updatePayments(params.issuerCountry, ctrl.model.paymentInfo.customerCreditCards, params.selectedCard, params.creditCardFormModel);
        },
        () => {
            ctrl.model.showOptions.showLoadingData = false;
        }
    );
}

export function updatePaymentsImpl(ctrl: PmtPageController, params: UpdatePaymentsParams) {
    const donationData = ctrl.localStorageService.get('donation');
    ctrl.model.generalData.issuerCountry = params.issuerCountry;
    if (ctrl.localStorageService.get('userLogged')) {
        ctrl.model.paymentInfo.selectedPaymentInfo.selectedLoggedCard = params.selectedCard
            ? getSelectedLoggedCardImpl(ctrl, {
                selectedLoggedCard: params.selectedCard,
                customerCreditCards: params.customerCards,
                issuerCountry: params.issuerCountry,
                creditCardFormModel: params.creditCardFormModel
            })
            : buildNewLoggedCardOption();
    }
    ctrl.updateFee(ctrl.model.paymentInfo.selectedPaymentInfo.selectedLoggedCard);
    ctrl.applyStoredDonation(donationData);
    finalizePaymentsUpdate(ctrl);
}
