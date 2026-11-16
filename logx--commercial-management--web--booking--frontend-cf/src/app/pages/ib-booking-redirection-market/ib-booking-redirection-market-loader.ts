import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbBookingRedirectionMarketPage: LoadChildrenCallback = async () => {
    const {IbBookingRedirectionMarketModule} = await import(
        /* webpackChunkName: "ibrednm" */
        './ib-booking-redirection-market.module'
    );
    await IbBookingLazyLoaderAJSsingleton.load([
        'web-booking-redirection-markets-templates',
        'ib-booking-redirection-market-module'
    ]);
    return IbBookingRedirectionMarketModule;
};