import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingAncillariesUpgradedComponent } from '@src/app/pages/ib-booking-ancillaries/ib-booking-ancillaries-legacy.directive';

const routes: Routes = [
    {
        path: '',
        component: IbBookingAncillariesUpgradedComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingAncillariesPageRoutingModule { }