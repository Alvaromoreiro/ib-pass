import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';
import angular from 'angular';

export function applyHolaMadridFlow (ctrl: PmtConfirmationController, bkiInfo) {
    if (!flightIsHolaMadrid(ctrl, bkiInfo)) {
        return;
    }
    ctrl.holaMadridFlow = true;
}

export function flightIsHolaMadrid (ctrl: PmtConfirmationController, bkiInfo) {
    let hmFlight = true;
    bkiInfo.order.orderItems.forEach((item) => {
        if (!orderItemIsHolaMadrid(ctrl, item)) {
            hmFlight = false;
        }
    });
    return hmFlight;
}

export function orderItemIsHolaMadrid (ctrl: PmtConfirmationController, item) {
    if (item.type !== 'flight') {
        return true;
    }
    return passengerPricesAreHolaMadrid(ctrl, item.passengerPrices);
}

export function passengerPricesAreHolaMadrid (ctrl: PmtConfirmationController, passengerPrices) {
    let hmFlight = true;
    passengerPrices.forEach((passenger) => {
        if (!segmentPricesAreHolaMadrid(ctrl, passenger.segmentPrices)) {
            hmFlight = false;
        }
    });
    return hmFlight;
}

export function segmentPricesAreHolaMadrid (ctrl: PmtConfirmationController, segmentPrices) {
    let hmFlight = true;
    segmentPrices.forEach((segPrices) => {
        if (segPrices.ticketDesignator !== 'HM') {
            hmFlight = false;
        }
    });
    return hmFlight;
}

export function readAllianzContract (ctrl: PmtConfirmationController) {
    const issueOrderInfo: any = ctrl.CommonsSessionStorageService.get('issueOrderInfo');
    if (!issueOrderInfo) {
        return;
    }
    angular.forEach(issueOrderInfo.data?.order?.orderItems, (item) => {
        assignAllianzContract(ctrl, item);
    });
}

export function assignAllianzContract (ctrl: PmtConfirmationController, item) {
    if (item.type === 'allianzFusion') {
        ctrl.allianzFusionContractNumber = item.contractNumber;
    }
}

export function addDigitalDataUnlessOnHold (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp != ctrl.PmtConstants.APP_TYPES.ONHOLD) {
        ctrl.setDigitalDataInfo();
    }
}
