import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbPetsNotAvailableComponent } from '@pages/ib-pets-not-available/ib-pets-not-available.component';
const routes: Routes = [
    {
        path: '',
        component: IbPetsNotAvailableComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbPetsNotAvailableRoutingModule { }