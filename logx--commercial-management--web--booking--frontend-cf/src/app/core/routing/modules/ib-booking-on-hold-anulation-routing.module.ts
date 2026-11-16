import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingOnHoldAnulationComponent } from '@src/app/pages/ib-booking-on-hold-anulation/ib-booking-on-hold-anulation.component';

const routes: Routes = [
    {
        path: '',
        component: IbBookingOnHoldAnulationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingOnHoldAnulationRoutingModule { }
