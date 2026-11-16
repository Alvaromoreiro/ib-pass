import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbShuttlePage: LoadChildrenCallback = async () => {
    const {IbBookingShuttleModule} = await import(
        /* webpackChunkName: "ibshuttle" */
        '@src/app/pages/ib-shuttle/ib-booking-shuttle.module');
    await IbBookingLazyLoaderAJSsingleton.load([
        'web-booking-shuttle-templates',
        'ib-shuttle-module'
    ]);
    return IbBookingShuttleModule;
};
