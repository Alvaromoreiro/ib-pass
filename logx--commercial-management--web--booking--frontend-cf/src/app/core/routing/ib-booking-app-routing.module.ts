
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivateFn, CanDeactivateFn } from '@angular/router';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { IbBookingAvailabilityPageComponent } from '../../pages/ib-booking-availability-page/ib-booking-availability-page.component';
import { getRedirectionPath, RouterPathsConstants as PATHS } from '@core/constants/ib-booking-router-paths-constants';
import { BookingTranslationReadyGuardFn } from './Guards/ib-translation-ready.guard';
import { CheckPaymentAFOPRedirectGuardFn } from './Guards/ib-booking-check-payment-afop.guard';
import { BookingRoutePreconditions } from './Guards/ib-booking-route-preconditions.guard';
import { BookingFareRequiredGuardFn } from './Guards/ib-booking-fare-required.guard';
import { BookingOrderRequiredGuardFn } from './Guards/ib-booking-order-required.guard';
import { BookingOnHoldConfirmationRequiredGuardFn } from './Guards/ib-booking-on-hold-required.guard';
import { BookingStepsControlFn, ComponentCanDeactivate } from './Guards/ib-booking-steps-control.guard';
import { loadIbBookingErrorPage } from '@src/app/pages/ib-booking-bk-error/ib-booking-bk-error-loader';
import { loadIbBookingRedirectionMarketPage } from '@src/app/pages/ib-booking-redirection-market/ib-booking-redirection-market-loader';
import { loadIbBookingPriceMatrixPage } from '@src/app/pages/ib-booking-price-matrix/ib-booking-price-matrix-loader';
import { loadIbBookingFlightsRecapPage } from '@src/app/pages/ib-booking-flights-recap/ib-booking-flights-recap-loader';
import { loadIbBookingOnHoldConfirmationPage } from '@src/app/pages/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-loader';
import { loadIbBookingOnHoldAnulationPage } from '@src/app/pages/ib-booking-on-hold-anulation/ib-booking-onhold-anulation-loader';
import { loadIbBookingAlp } from '@src/app/pages/ib-booking-alp/ib-booking-alp-loader';
import { loadPassengerInfoPage } from '@src/app/pages/ib-booking-passenger-info/ib-booking-passenger-info-loader';
import { loadAncillariesPage } from '@src/app/pages/ib-booking-ancillaries/ib-booking-ancillaries-loader';
import { loadIbBookingPaymentsPage } from '@src/app/pages/ib-booking-payments-page/ib-booking-payments-loader';
import { loadIbBookingConfirmationPage } from '@src/app/pages/ib-booking-confirmation/ib-booking-confirmation-loader';
import { loadIbShuttlePage } from '@src/app/pages/ib-shuttle/ib-shuttle-loader';
import { loadIbNotAvailabilityPage } from '@src/app/pages/ib-not-availability/ib-not-availability-loader';
import { loadIbOnbNotAvailabilityPage } from '@src/app/pages/ib-onb-not-availability/ib-onb-not-availability-loader';
import { loadIbLoadingRedirectionPage } from '@src/app/pages/ib-loading-redirection/ib-loading-redirection-loader';
import { loadIbBookingPmtCommunicationLostPage } from '@src/app/pages/ib-booking-pmt-communication-lost/ib-booking-pmt-communication-lost-loader';
import { loadIbPetsNotAvailablePage } from '@src/app/pages/ib-pets-not-available/ib-pets-not-available-loader';

const defaultActivateGuards: CanActivateFn[] = [
    BookingTranslationReadyGuardFn,
    BookingRoutePreconditions //This guard must be executed last
];
const defaultDeactivateGuards: CanDeactivateFn<ComponentCanDeactivate>[] = [
    BookingStepsControlFn
];
const customActivateGuardsMap: Record<string, CanActivateFn[]> = {
    [PATHS.availability] : [CheckPaymentAFOPRedirectGuardFn ],
    [PATHS.flightsRecap]: [BookingFareRequiredGuardFn],
    [PATHS.ibairp]: [BookingFareRequiredGuardFn],
    [PATHS.ibcmtv]: [BookingOrderRequiredGuardFn],
    [PATHS.ibpurc]: [BookingOrderRequiredGuardFn]
};
const customDeactivateGuardsMap: Record<string, CanDeactivateFn<ComponentCanDeactivate>[]> = {
    [PATHS.availability] : [],
    [PATHS.flightsRecap]: [],
    [PATHS.ibairp]: [],
    [PATHS.ibcmtv]: [],
    [PATHS.ibpurc]: [],
    [PATHS.confirmation]: []
};

const getCanActivateGuards = (path: string) => {
    return [ ...(customActivateGuardsMap[path] ?? []), ...defaultActivateGuards];
};

const getCanDeactivateGuards = (path: string) => {
    return [ ...(customDeactivateGuardsMap[path] ?? []), ...defaultDeactivateGuards];
};

const routes: Routes = [
    // Routes rendered by Angular
    // { path: 'ibg', component: IbPlusLoadingComponent },
    // { path: 'htu', loadChildren: async () => import('./app/feature/ib-plus-your-iberia/ib-plus-your-iberia.module').then((m) => m.IbPlusYourIberiaModule) },

    // AngularJS routes
    {path: PATHS.availability,  component: IbBookingAvailabilityPageComponent, canActivate: getCanActivateGuards(PATHS.availability), 
        canDeactivate: getCanDeactivateGuards( PATHS.availability )},
    {
        path: PATHS.ibbkerror,
        canActivate: getCanActivateGuards(PATHS.ibbkerror),
        loadChildren: loadIbBookingErrorPage
    }, {
        path: PATHS.ibrednm,
        canActivate: getCanActivateGuards( PATHS.ibrednm ),
        canDeactivate: getCanDeactivateGuards( PATHS.ibrednm ),
        loadChildren: loadIbBookingRedirectionMarketPage
    }, {
        path:PATHS.caldit,
        canActivate: getCanActivateGuards( PATHS.caldit ),
        loadChildren: loadIbBookingPriceMatrixPage
    }, {
        path: PATHS.flightsRecap,
        canActivate: getCanActivateGuards(PATHS.flightsRecap),
        canDeactivate: getCanDeactivateGuards( PATHS.flightsRecap ),
        loadChildren: loadIbBookingFlightsRecapPage
    }, {
        path: PATHS.ohmtdt,
        canActivate: getCanActivateGuards(PATHS.ohmtdt),
        canDeactivate: getCanDeactivateGuards( PATHS.ohmtdt ),
        resolve: [BookingOnHoldConfirmationRequiredGuardFn],
        loadChildren: loadIbBookingOnHoldConfirmationPage
            
    },  {
        path: PATHS.cnclit,
        loadChildren: loadIbBookingOnHoldAnulationPage
    },
    {
        path:PATHS.ibpbah,
        canActivate: getCanActivateGuards(PATHS.ibpbah),
        canDeactivate: getCanDeactivateGuards( PATHS.ibpbah ),
        loadChildren: loadIbBookingAlp
    }, {
        path:PATHS.ibairp,
        canActivate: getCanActivateGuards(PATHS.ibairp),
        canDeactivate: getCanDeactivateGuards( PATHS.ibairp ),
        loadChildren: loadPassengerInfoPage
    }, {
        path: PATHS.ibcmtv,
        canActivate: getCanActivateGuards( PATHS.ibcmtv ),
        canDeactivate: getCanDeactivateGuards( PATHS.ibcmtv ),
        loadChildren: loadAncillariesPage
    }, {
        path: PATHS.ibpurc,
        canActivate: getCanActivateGuards(PATHS.ibpurc),
        canDeactivate: getCanDeactivateGuards( PATHS.ibpurc ),
        loadChildren: loadIbBookingPaymentsPage
    }, {
        path: PATHS.confirmation,
        canActivate: getCanActivateGuards(PATHS.confirmation),
        canDeactivate: getCanDeactivateGuards( PATHS.confirmation ),
        loadChildren: loadIbBookingConfirmationPage
    }, {
        path: PATHS.ibshuttle,
        canActivate: getCanActivateGuards(PATHS.ibshuttle),
        canDeactivate: getCanDeactivateGuards( PATHS.ibshuttle ),
        loadChildren: loadIbShuttlePage
    }, {
        path: PATHS.ibAviosAlert,
        canActivate: getCanActivateGuards(PATHS.ibAviosAlert),
        canDeactivate: getCanDeactivateGuards( PATHS.ibAviosAlert ),
        loadChildren: loadIbNotAvailabilityPage
    }, {
        path: PATHS.OBERRA,
        canActivate: getCanActivateGuards(PATHS.OBERRA),
        canDeactivate: getCanDeactivateGuards( PATHS.OBERRA ),
        loadChildren: loadIbOnbNotAvailabilityPage
    }, {
        path: PATHS.loading,
        canActivate: getCanActivateGuards(PATHS.loading),
        loadChildren: loadIbLoadingRedirectionPage
    }, {
        path: PATHS.ibbker,
        canActivate: getCanActivateGuards(PATHS.ibbker),
        canDeactivate: getCanDeactivateGuards( PATHS.ibbker ),
        loadChildren: loadIbBookingPmtCommunicationLostPage
    }, {
        path: PATHS.errpetc,
        canActivate: getCanActivateGuards(PATHS.errpetc),
        loadChildren: loadIbPetsNotAvailablePage
    },

    // Catch-all route
    { path:'**', redirectTo: getRedirectionPath(PATHS.availability)}
    
];


@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration:'top', onSameUrlNavigation: 'reload', initialNavigation: 'enabledBlocking'})],
    exports: [RouterModule],
    providers: [
        { provide: APP_BASE_HREF, useValue: '!' },
        { provide: LocationStrategy, useClass: HashLocationStrategy }

    ]
})
export class IbBookingAppRoutingModule {
    private DEFAULT_ROUTE = PATHS.availability;
    private routesSet = new Set(Object.values(PATHS));

    constructor (
    ) {
        
        this.setInitialRoute();
    }

    private setInitialRoute = () => {
        if(window.location.hash.length === 0 || !this.routesSet.has(window.location.hash.replace('#!/', ''))) {
            window.history.replaceState({}, '', window.location.href.split('#')[0] + '#!' + getRedirectionPath(this.DEFAULT_ROUTE));
        }
    };
}
