import angular from 'angular';
import type { PmtPageController } from '../ib-pmt-controller';
import { buildTripLocationRequest, hasTripSegments } from './ib-pmt-controller.fee.trip';

export function createFeeHostImpl(ctrl: PmtPageController) {
    return {
        model: ctrl.model,
        getOriginalOBPrice: () => ctrl.originalOBPrice,
        setOriginalOBPrice: (price: number) => { ctrl.originalOBPrice = price; },
        setNoDiscountOBPrice: (formattedPrice: string) => { ctrl.noDiscountOBPrice = formattedPrice; },
        setAppliedCCFee: (applied: boolean) => { ctrl.appliedCCFee = applied; },
        setDonationEnabled: (enabled: boolean) => { ctrl.donationEnabled = enabled; },
        updateTotalFees: () => ctrl.updateTotalFees()
    };
}

function buildCcFeeRequest(totalPrice: number, currency: any, market: string) {
    const numberDecimals = currency?.numberDecimals ?? 0;
    const minorUnits = Math.round(totalPrice * Math.pow(10, numberDecimals));
    return {
        paymentPrice: {
            price: minorUnits,
            currency: `${currency?.code}${numberDecimals}`
        },
        channel: 'NEW_WEB',
        client: 'IB',
        market
    };
}

export function getCcFeeRequestImpl(ctrl: PmtPageController, totalPrice, currency, market, tripInfo) {
    const request = buildCcFeeRequest(totalPrice, currency, market);
    if (hasTripSegments(tripInfo)) {
        angular.extend(request, buildTripLocationRequest(tripInfo));
    }
    ctrl.localStorageService.set('ibpayCcFeeRequest', request);
}

/**
 * Update the 'fee' information
 * @param {*} selectedCard
 */
export function updateFeeImpl(ctrl: PmtPageController, selectedCard) {
    ctrl.IbPmtCreditCardFeeService.updateFee(ctrl.createFeeHost(), selectedCard);
}
