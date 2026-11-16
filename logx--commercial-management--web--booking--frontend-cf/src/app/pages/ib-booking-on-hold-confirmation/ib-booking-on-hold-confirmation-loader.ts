import type { LoadChildrenCallback } from '@angular/router';

export const loadIbBookingOnHoldConfirmationPage: LoadChildrenCallback = async () => {
    const {IbBookingOnHoldConfirmationModule} = await import(
        /* webpackChunkName: "ohmtdt" */
        '@src/app/pages/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation.module'
    );
    return IbBookingOnHoldConfirmationModule;
};
