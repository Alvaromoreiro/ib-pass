import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { IbMmBJSComponent } from './ib-MmB-js.component';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MmBRouterConstants } from './components/routing/ib-MmB-router-constants';


// Match any URL
export function isAngularJSUrl (url: UrlSegment[]) {
    const routesArray = [
        MmBRouterConstants.PAGES_URL.SEARCH,
        MmBRouterConstants.PAGES_URL.SEARCHNEW,
        MmBRouterConstants.PAGES_URL.TRIP_LIST,
        MmBRouterConstants.PAGES_URL.BOOKING_MANAGE,
        MmBRouterConstants.PAGES_URL.CHANGE_FLIGHT,
        MmBRouterConstants.PAGES_URL.FLIGHT_CONFIRMATION,
        MmBRouterConstants.PAGES_URL.BOOKINGS_LIST,
        MmBRouterConstants.PAGES_URL.PASSENGERS_INFO,
        MmBRouterConstants.PAGES_URL.PAYMENTS,
        MmBRouterConstants.PAGES_URL.MMB_PAYMENTS_CONFIRM,
        MmBRouterConstants.PAGES_URL.NEW_MMB_PAYMENTS_CONFIRM,
        MmBRouterConstants.PAGES_URL.MMB_CONFIRMATION_ORDER,
        MmBRouterConstants.PAGES_URL.MMB_COMMUNICATION_LOST,
        MmBRouterConstants.PAGES_URL.MMB_DASHBOARD,
        MmBRouterConstants.PAGES_URL.MMB_INVOLUNTARY_CHANGE,
        MmBRouterConstants.PAGES_URL.DISRUPTION_DASHBOARD,
        MmBRouterConstants.PAGES_URL.DISRUPTION_REFUND,
        MmBRouterConstants.PAGES_URL.REBOOK_ERROR,
        MmBRouterConstants.PAGES_URL.ANCILLARIES,
        MmBRouterConstants.PAGES_URL.MMB_PAYMENT,
        '/loading'
    ];
    if(url.toString().includes('ibdash&')) {
        const arr = window.location.href.split('#!/ibdash');
        window.location.href = arr[0] + arr[1] + '#!/ibdash';
    } else if(url.toString().includes('ohinfo&')) {
        const arr = window.location.href.split('#!/ohinfo');
        window.location.href = arr[0] + arr[1] + '#!/ohinfo';
    } else if(url.toString().includes('disrptn&')) {
        const arr = window.location.href.split('#!/disrptn');
        window.location.href = arr[0] + arr[1] + '#!/disrptn';
    }
    const routeExist = routesArray.some((route) => route === url.toString() || route === `/${url.toString()}`);
    return routeExist ? ({ consumed: url }) : null;
}

export const routes: Routes = [
    // Routes rendered by Angular
    // { path: 'ibg', component: IbPlusLoadingComponent },
    // { path: 'htu', loadChildren: async () => import('./app/feature/ib-plus-your-iberia/ib-plus-your-iberia.module').then((m) => m.IbPlusYourIberiaModule) },

    // AngularJS routes
    { matcher: isAngularJSUrl, component: IbMmBJSComponent },

    // Catch-all route
    { path: '**', redirectTo: MmBRouterConstants.PAGES_URL.SEARCH }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        { provide: APP_BASE_HREF, useValue: '!' },
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
})
export class IbMmBAppRoutingModule {}
