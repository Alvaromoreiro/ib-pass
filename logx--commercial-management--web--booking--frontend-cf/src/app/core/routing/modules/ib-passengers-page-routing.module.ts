import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingPassengersInfoComponent } from '@src/app/pages/ib-booking-passenger-info/ib-booking-passengers-info-upgraded.directive';
const routes: Routes = [
    {
        path: '',
        component: IbBookingPassengersInfoComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingPassengerPageRoutingModule { }