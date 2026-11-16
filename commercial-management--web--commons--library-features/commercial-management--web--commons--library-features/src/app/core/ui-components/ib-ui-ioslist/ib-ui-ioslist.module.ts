import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbUiIoslistComponent } from './ib-ui-ioslist.component';



@NgModule({
    declarations: [
        IbUiIoslistComponent
    ],
    imports: [
        TranslateModule,
        CommonModule
    ],
    exports: [
        IbUiIoslistComponent
    ]
})
export class IbUiIoslistModule { }
export { IbUiIoslistComponent } from './ib-ui-ioslist.component';
