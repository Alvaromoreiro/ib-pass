import type { LoadChildrenCallback } from '@angular/router';

export const loadIbOnbNotAvailabilityPage: LoadChildrenCallback = async () => {
    const {IbOnbNotAvailabilityModule} = await import(
        /* webpackChunkName: "OBERRA" */
        '@src/app/pages/ib-onb-not-availability/ib-onb-not-availability.module');
    return IbOnbNotAvailabilityModule;
};