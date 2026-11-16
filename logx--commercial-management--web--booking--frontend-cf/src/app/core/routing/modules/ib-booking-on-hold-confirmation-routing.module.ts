import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingOnHoldConfirmationPageComponent } from '@src/app/pages/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation.component';

const routes: Routes = [
    {
        path: '',
        component: IbBookingOnHoldConfirmationPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingOnHoldRoutingModule { }
