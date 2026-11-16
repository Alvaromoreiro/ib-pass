import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingPmtConfirmationComponent } from '@src/app/pages/ib-booking-confirmation/ib-booking-confirmation-upgraded.directive';
const routes: Routes = [
    {
        path: '',
        component: IbBookingPmtConfirmationComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingConfirmationRoutingModule { }