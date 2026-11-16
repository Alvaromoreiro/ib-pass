import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbNotAvailabilityPage: LoadChildrenCallback = async () => {
    const {IbNotAvailabilityModule} = await import(
        /* webpackChunkName: "ibAviosAlert" */
        '@src/app/pages/ib-not-availability/ib-not-availability.module');
    await IbBookingLazyLoaderAJSsingleton.load([
        'web-booking-not-availability-templates',
        'ib-not-avaibility-module'
    ]);
    return IbNotAvailabilityModule;
};
