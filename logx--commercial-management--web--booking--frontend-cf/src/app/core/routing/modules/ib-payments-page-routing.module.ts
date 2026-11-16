import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingPaymentsPageComponent } from '@src/app/pages/ib-booking-payments-page/ib-booking-payments-page.component';
const routes: Routes = [
    {
        path: '',
        component: IbBookingPaymentsPageComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingPaymentsRoutingModule { }