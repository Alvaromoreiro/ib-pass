import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { IbBookingAvailabilityPageServiceType, AJSIbBookingAvailabilityPageService  } from '@pages/ib-booking-availability-page/services/ib-booking-availability-page-utils-bridge.service';

export const CheckPaymentAFOPRedirectGuardFn: CanActivateFn = () : boolean=> {
    const IbBookingAvailabilityPageUtilsService = inject(AJSIbBookingAvailabilityPageService) as IbBookingAvailabilityPageServiceType;

    // Array that contains functions which performs redirections to another route
    const checkRedirections = [
        IbBookingAvailabilityPageUtilsService.checkPaymentRedirect,
        IbBookingAvailabilityPageUtilsService.checkOldPaymentRedirect.bind(this, IbBookingAvailabilityPageUtilsService.getPaymentRedirectionInfo())
    ];
    // Avoid checking and loading if there is no hash in the URL
    if(window.location.hash.length === 0 ){
        return false;
    }
    const isRedirected = checkRedirections.some((checkRedirection) => checkRedirection());
    return !isRedirected;
};