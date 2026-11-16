import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbBookingConfirmationPage: LoadChildrenCallback = async () => {
    const {IbBookingConfirmationModule} = await import(
        /* webpackChunkName: "confirmation" */
        '@src/app/pages/ib-booking-confirmation/ib-booking-confirmation.module');
    await IbBookingLazyLoaderAJSsingleton.load(['ib-web-payments-templates', 'ib-pmt-app', 'ib-pmt-order-confirmation-module', 'ib-pmt-communication-lost-module']);
    return IbBookingConfirmationModule;
};
