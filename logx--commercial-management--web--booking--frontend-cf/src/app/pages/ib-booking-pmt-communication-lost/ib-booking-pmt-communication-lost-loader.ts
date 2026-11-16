import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbBookingPmtCommunicationLostPage: LoadChildrenCallback = async () => {
    const {IbBookingPmtCommunicationLostModule} = await import(
        /* webpackChunkName: "ibbker" */
        '@src/app/pages/ib-booking-pmt-communication-lost/ib-booking-pmt-communication-lost.module');
    await IbBookingLazyLoaderAJSsingleton.load(['ib-web-payments-templates', 'ib-pmt-app', 'ib-pmt-order-confirmation-module', 'ib-pmt-communication-lost-module']);
    return IbBookingPmtCommunicationLostModule;
};
