import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbOnbNotAvailabilityComponent } from '@src/app/pages/ib-onb-not-availability/ib-onb-not-availability.component';
const routes: Routes = [
    {
        path: '',
        component: IbOnbNotAvailabilityComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbOnbNotAvailabilityRoutingModule { }