import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadAncillariesPage: LoadChildrenCallback =async () => {
    const {IbBookingAncillariesModule} = await import(
        /* webpackChunkName: "ibcmtv" */
        '@src/app/pages/ib-booking-ancillaries/ib-booking-ancillaries.module');
    await IbBookingLazyLoaderAJSsingleton.load(

        [   'web-booking-ancillaries-templates',
            'ib-web-ancillaries-templates',
            'ib-web-ancillaries-module',
            'ib-web-ancillaries-services-module',
            'ib-new-seat-map-module',
            'ib-booking-ancillaries-module']);
    return IbBookingAncillariesModule;
};