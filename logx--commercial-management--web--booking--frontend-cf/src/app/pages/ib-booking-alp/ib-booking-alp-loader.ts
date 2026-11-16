import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbBookingAlp: LoadChildrenCallback = async () => {
    const {IbBookingAlpPageModule} = await import(
        /* webpackChunkName: "ibpbah" */
        '@src/app/pages/ib-booking-alp/ib-booking-alp.module');
    await IbBookingLazyLoaderAJSsingleton.load(['ib-web-ancillaries-templates', 'ib-web-ancillaries-module']);
    return IbBookingAlpPageModule;
};