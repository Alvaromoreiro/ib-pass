import type { LoadChildrenCallback } from '@angular/router';

export const loadIbBookingOnHoldAnulationPage: LoadChildrenCallback = async () => {
    const {IbBookingOnHoldAnulationModule} = await import(
        /* webpackChunkName: "cnclit" */
        '@src/app/pages/ib-booking-on-hold-anulation/ib-booking-on-hold-anulation.module');
    return IbBookingOnHoldAnulationModule;
};
