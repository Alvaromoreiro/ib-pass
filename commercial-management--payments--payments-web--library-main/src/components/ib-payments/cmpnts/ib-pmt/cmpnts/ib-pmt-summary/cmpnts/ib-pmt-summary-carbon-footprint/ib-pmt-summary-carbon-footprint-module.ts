import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtSummaryCarbonFootprintComponent } from './ib-pmt-summary-carbon-footprint.component';

@NgModule({
    imports:[
        CommonModule,
        TranslateModule
    ],
    declarations:[
        IbPmtSummaryCarbonFootprintComponent
    ],
    exports:[
        IbPmtSummaryCarbonFootprintComponent
    ]
})

export class IbPmtSummaryCarbonFootprintModule { }
export { IbPmtSummaryCarbonFootprintComponent } from './ib-pmt-summary-carbon-footprint.component';