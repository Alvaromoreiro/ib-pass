import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingLoadingRedirectioUpgradedComponent } from '@src/app/pages/ib-loading-redirection/ib-booking-loading-redirectionr-legacy.directive';
const routes: Routes = [
    {
        path: '',
        component: IbBookingLoadingRedirectioUpgradedComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingLoadingRedirectionPageRoutingModule { }