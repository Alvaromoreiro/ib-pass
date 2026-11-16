import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingRedirectionMarketUpgradedComponent } from '@src/app/pages/ib-booking-redirection-market/ib-booking-redirection-market.directive';
const routes: Routes = [
    {
        path: '',
        component: IbBookingRedirectionMarketUpgradedComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingRedirectionMarketRoutingModule { }