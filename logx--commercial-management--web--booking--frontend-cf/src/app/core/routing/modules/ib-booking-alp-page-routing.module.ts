import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingAlpComponent } from '../../../pages/ib-booking-alp/ib-booking-alp.component';
const routes: Routes = [
    {
        path: '',
        component: IbBookingAlpComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingAlpPageRoutingModule { }
