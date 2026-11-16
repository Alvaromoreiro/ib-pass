import type { LoadChildrenCallback } from '@angular/router';
import { IbBookingLazyLoaderAJSsingleton } from '@src/app/core/routing/services/ib-booking-angularjs-lazy-loader';

export const loadIbBookingPriceMatrixPage: LoadChildrenCallback =async () => {
    const {IbBookingPriceMatrixModule} = await import(
        /* webpackChunkName: "caldit" */
        './ib-booking-price-matrix.module'
    );
    await IbBookingLazyLoaderAJSsingleton.load([
        'web-booking-price-matrix-templates',
        'ib-booking-price-matrix-module'
    ]);
    return IbBookingPriceMatrixModule;
};