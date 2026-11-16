import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingPriceMatrixUpgradedComponent } from '@src/app/pages/ib-booking-price-matrix/ib-booking-price-matrix.directive';
const routes: Routes = [
    {
        path: '',
        component: IbBookingPriceMatrixUpgradedComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingPriceMatrixRoutingModule { }