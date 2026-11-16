import type { LoadChildrenCallback } from '@angular/router';

export const loadIbPetsNotAvailablePage: LoadChildrenCallback =async () => {
    const {IbPetsNotAvailableModule} = await import(
        /* webpackChunkName: "errpetc" */
        '@src/app/pages/ib-pets-not-available/ib-pets-not-available.module'
    );
    return IbPetsNotAvailableModule;
};
