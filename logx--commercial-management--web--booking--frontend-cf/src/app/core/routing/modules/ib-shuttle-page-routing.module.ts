import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingShuttleUpgradedComponent } from '@src/app/pages/ib-shuttle/ib-booking-shuttle-legacy.directive';
const routes: Routes = [
    {
        path: '',
        component: IbBookingShuttleUpgradedComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingShuttleRoutingModule { }