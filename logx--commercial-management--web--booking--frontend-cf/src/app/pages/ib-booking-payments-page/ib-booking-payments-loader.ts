import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbBookingPaymentsPage: LoadChildrenCallback = async () => {
    const {IbBookingPaymentsModule} = await import(
        /* webpackChunkName: "ibpurc" */
        '@src/app/pages/ib-booking-payments-page/ib-booking-payments.module');
    await IbBookingLazyLoaderAJSsingleton.load(['ib-web-payments-templates', 'ib-pmt-app']);
    return IbBookingPaymentsModule;
};
