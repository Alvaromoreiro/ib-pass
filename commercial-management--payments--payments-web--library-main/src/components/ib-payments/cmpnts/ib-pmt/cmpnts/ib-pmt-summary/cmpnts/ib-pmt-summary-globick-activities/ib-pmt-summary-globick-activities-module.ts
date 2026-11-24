import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtSummaryGlobickActivitiesComponent } from './ib-pmt-summary-globick-activities.component';

@NgModule({
    imports:[
        CommonModule,
        TranslateModule
    ],
    declarations:[
        IbPmtSummaryGlobickActivitiesComponent
    ],
    exports:[
        IbPmtSummaryGlobickActivitiesComponent
    ]
})

export class IbPmtSummaryGlobickActivitiesModule { }
export { IbPmtSummaryGlobickActivitiesComponent } from './ib-pmt-summary-globick-activities.component';
