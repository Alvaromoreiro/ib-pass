import type { LoadChildrenCallback } from '@angular/router';
export const loadIbBookingErrorPage: LoadChildrenCallback = async ()=> {
    const { IbBookingBkErrorModule } = await import(/* webpackChunkName: "ibbkerror" */ './ib-booking-bk-error.module');
    return IbBookingBkErrorModule;
};