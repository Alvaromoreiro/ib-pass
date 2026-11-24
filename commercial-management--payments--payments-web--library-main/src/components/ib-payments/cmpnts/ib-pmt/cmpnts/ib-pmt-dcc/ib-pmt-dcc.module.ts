import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtDccComponent } from './ib-pmt-dcc.component';

@NgModule({
    imports:[
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations:[
        IbPmtDccComponent
    ],
    exports:[
        IbPmtDccComponent
    ]
})

export class IbPmtDccModule { }
export { IbPmtDccComponent } from './ib-pmt-dcc.component';