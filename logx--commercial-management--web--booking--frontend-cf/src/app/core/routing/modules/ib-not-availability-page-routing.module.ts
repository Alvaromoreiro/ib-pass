import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbNotAvailabilityUpgradedComponent } from '@src/app/pages/ib-not-availability/ib-not-availability-legacy.directive';
const routes: Routes = [
    {
        path: '',
        component: IbNotAvailabilityUpgradedComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbNotAvailabilityPageRoutingModule { }