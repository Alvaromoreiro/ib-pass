import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';

export function isWidgetMountFlow (ctrl: PmtConfirmationController, flowName: string) {
    return ['BKI', 'CKI', 'MMB'].indexOf(flowName) !== -1;
}

export function isWidgetCityAllowed (ctrl: PmtConfirmationController) {
    const arrivalCode = ctrl.model.confirmationInfo.slices[0].segments[0].arrival.code;
    return ctrl.listLocationWitget.includes(ctrl.PmtOrderConfirmationService.locationForWidget(arrivalCode));
}

export function isEuroPayment (ctrl: PmtConfirmationController) {
    return ctrl.localStorageService.get('paymentsInfo').currency.code === 'EUR';
}

export function isWidgetLanguage (ctrl: PmtConfirmationController, language: string) {
    if (language === 'es') {
        return true;
    }
    if (language === 'en') {
        return true;
    }
    return language === 'zh';
}
