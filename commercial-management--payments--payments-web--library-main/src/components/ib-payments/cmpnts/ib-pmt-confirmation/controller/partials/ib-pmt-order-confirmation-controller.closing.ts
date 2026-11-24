import type { PmtConfirmationController } from '../ib-pmt-order-confirmation-controller';

export function closeConfirmationModals (ctrl: PmtConfirmationController) {
    ctrl.$timeout(() => {
        ctrl.PmtModalService.finishWaiting();
        closeCurrentModalsUnlessChangeFlow(ctrl);
    });
}

export function closeCurrentModalsUnlessChangeFlow (ctrl: PmtConfirmationController) {
    if (shouldCloseConfirmationModals(ctrl)) {
        ctrl.PmtModalService.closeAllCurrentModals();
    }
}

export function shouldCloseConfirmationModals (ctrl: PmtConfirmationController) {
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) {
        return false;
    }
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_UNIFIED) {
        return false;
    }
    if (ctrl.flowApp === ctrl.PmtConstants.APP_TYPES.MANAGEMYBOOKING_BIDS) {
        return false;
    }
    return true;
}

export function buildCheckinUrl (ctrl: PmtConfirmationController) {
    return ctrl.$filter('LinksFilter')('CHECKIN_ONLINE_APP') + '?language=' + ctrl.$rootScope.appLang + '&market=' + ctrl.$rootScope.appMarket + '&pnr=' + encodeURIComponent(ctrl.model.confirmationInfo.pnr) + '&surname=' + encodeURIComponent(ctrl.model.confirmationInfo.summaryInfo.passengers.personalData[0].surname);
}

export function collectFlightSummary (ctrl: PmtConfirmationController, bookingInfo) {
    const flightList = [];
    bookingInfo.order.slices.forEach(slice => slice.segments.forEach(segment => {
        const item = {from: segment.departure.code, to: segment.arrival.code, cabin: segment.cabin.type};
        flightList.push(item);
    }));
    ctrl.flightList = flightList;
    ctrl.numPax = bookingInfo.passengers.length;
}
