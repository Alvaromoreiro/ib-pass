import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IbBookingFlightsRecapPageComponent} from '@pages/ib-booking-flights-recap/ib-booking-flights-recap.component';
const routes: Routes = [
    {
        path: '',
        component: IbBookingFlightsRecapPageComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingFlightsRecapRoutingModule { }