import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';

export function calculateFrequencyDisplay (ctrl: PmtConfirmationController) {
    const number = Math.floor(Math.random() * Math.floor(3));
    return (number !== 0);
}

export function isFrequentFlyer (ctrl: PmtConfirmationController) {
    const issueOrderInfo = ctrl.localStorageService.get('issueOrderInfo');
    const passengers = issueOrderPassengers(ctrl, issueOrderInfo);
    return passengersIncludeFrequentFlyer(ctrl, passengers);
}

export function issueOrderPassengers (ctrl: PmtConfirmationController, issueOrderInfo: any) {
    if (!issueOrderInfo) {
        return [];
    }
    if (!issueOrderInfo.data) {
        return [];
    }
    if (!(issueOrderInfo.data.passengers.length > 0)) {
        return [];
    }
    return issueOrderInfo.data.passengers;
}

export function passengersIncludeFrequentFlyer (ctrl: PmtConfirmationController, passengers: any[]) {
    for (let passengersIndex = 0; passengersIndex < passengers.length; passengersIndex++) {
        if (passengers[passengersIndex].frequentFlyerInfo) {
            return true;
        }
    }
    return false;
}
