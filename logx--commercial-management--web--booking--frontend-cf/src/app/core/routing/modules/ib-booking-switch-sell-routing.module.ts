import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IbBookingSwitchSellComponent } from 'ib-web-ancillaries';

const routes: Routes = [
    {
        path: '',
        component: IbBookingSwitchSellComponent
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IbBookingSwitchSellpRoutingModule { }
