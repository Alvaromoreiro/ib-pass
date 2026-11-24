import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtSummaryGlobickTransfersComponent } from './ib-pmt-summary-globick-transfers.component';

@NgModule({
    imports:[
        CommonModule,
        TranslateModule
    ],
    declarations:[
        IbPmtSummaryGlobickTransfersComponent
    ],
    exports:[
        IbPmtSummaryGlobickTransfersComponent
    ]
})

export class IbPmtSummaryGlobickTransfersModule { }
export { IbPmtSummaryGlobickTransfersComponent } from './ib-pmt-summary-globick-transfers.component';