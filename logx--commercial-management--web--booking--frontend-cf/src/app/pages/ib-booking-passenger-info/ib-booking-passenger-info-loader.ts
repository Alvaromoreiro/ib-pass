import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadPassengerInfoPage: LoadChildrenCallback =  async () => {
    const {IbBookingPassengerInfoModule} = await import(
        /* webpackChunkName: "ibairp" */
        '@src/app/pages/ib-booking-passenger-info/ib-booking-passenger-info.module');
    await IbBookingLazyLoaderAJSsingleton.load([
        'web-booking-passenger-templates',
        'ib-booking-passenger-info-module'
    ]);
    return IbBookingPassengerInfoModule;
};