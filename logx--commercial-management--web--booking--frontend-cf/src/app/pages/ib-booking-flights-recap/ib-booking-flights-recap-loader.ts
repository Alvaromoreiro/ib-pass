import type { LoadChildrenCallback } from '@angular/router';

export const loadIbBookingFlightsRecapPage: LoadChildrenCallback =
    async () => {
        const {IbBookingFlightsRecapModule} = await import(
            /* webpackChunkName: "flightsRecap" */
            '@src/app/pages/ib-booking-flights-recap/ib-booking-flights-recap.module'
        );
        return IbBookingFlightsRecapModule;
    };