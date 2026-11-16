import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbLoadingRedirectionPage: LoadChildrenCallback = async () => {
    const {IbBookingLoadingRedirectionModule} = await import(
        /* webpackChunkName: "loading" */
        '@src/app/pages/ib-loading-redirection/ib-booking-loading-redirection.module');
    await IbBookingLazyLoaderAJSsingleton.load([
        'web-booking-loading-redirection',
        'ib-loading-redirection-module'
    ]);
    return IbBookingLoadingRedirectionModule;
};
