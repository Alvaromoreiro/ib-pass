import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtTabNewComponent } from './ib-pmt-tab-new.component';

@NgModule({
    imports:[
        CommonModule,
        TranslateModule
    ],
    declarations:[
        IbPmtTabNewComponent
    ],
    exports:[
        IbPmtTabNewComponent
    ]
})

export class IbPmtTabNewModule { }
export { IbPmtTabNewComponent } from './ib-pmt-tab-new.component';