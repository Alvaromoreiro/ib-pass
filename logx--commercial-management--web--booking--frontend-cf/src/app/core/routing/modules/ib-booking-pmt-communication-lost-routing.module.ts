import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingPmtCommunicationLostComponent } from '@src/app/pages/ib-booking-pmt-communication-lost/ib-booking-pmt-communication-lost.directive';
const routes: Routes = [
    {
        path: '',
        component: IbBookingPmtCommunicationLostComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingPmtCommunicationLostRoutingModule { }