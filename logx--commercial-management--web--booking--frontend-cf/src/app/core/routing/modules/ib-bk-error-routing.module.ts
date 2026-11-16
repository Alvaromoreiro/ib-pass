import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingBkiErrorUpgradedComponent } from '@src/app/pages/ib-booking-bk-error/component/ib-booking-bk-error.component';
const routes: Routes = [
    {
        path: '',
        component: IbBookingBkiErrorUpgradedComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingErrorPageRoutingModule { }
