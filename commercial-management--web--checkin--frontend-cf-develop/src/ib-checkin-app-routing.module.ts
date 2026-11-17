import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
import { IbCheckinJSComponent } from './ib-checkin-js.component';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';


// Match any URL
export function isAngularJSUrl (url: UrlSegment[]) {
    const routesArray = [
        '/ibcose',
        '/uncose',
        '/ibcoac',
        '/ibcose2',
        '/ibcoac2',
        '/ckiacpt',
        '/ckianc',
        '/ibpurc',
        '/ibecbp',
        '/ckiancupp',
        '/ibcocf-and-ibeccf',
        '/ibfnpa',
        '/ibfncopa',
        '/uncoac',
        '/ckbio',
        '/loading'
    ];
    const routeExist = routesArray.some((route) => route === url.toString() || route === `/${url.toString()}`);
    return routeExist ? ({ consumed: url }) : null;
}

export const routes: Routes = [
    // Routes rendered by Angular
    // { path: 'ibg', component: IbPlusLoadingComponent },
    // { path: 'htu', loadChildren: async () => import('./app/feature/ib-plus-your-iberia/ib-plus-your-iberia.module').then((m) => m.IbPlusYourIberiaModule) },

    // AngularJS routes
    { matcher: isAngularJSUrl, component: IbCheckinJSComponent },

    // Catch-all route
    { path: '**', redirectTo: '/ibcose' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        { provide: APP_BASE_HREF, useValue: '!' },
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]
})
export class IbCheckinAppRoutingModule {}
