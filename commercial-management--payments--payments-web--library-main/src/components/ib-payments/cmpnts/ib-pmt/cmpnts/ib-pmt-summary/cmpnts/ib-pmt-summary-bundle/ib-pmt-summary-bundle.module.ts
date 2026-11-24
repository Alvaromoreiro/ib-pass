import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbPmtSummaryBundleComponent } from './ib-pmt-summary-bundle.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
    declarations: [
        IbPmtSummaryBundleComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        IbPmtSummaryBundleComponent
    ]
})
export class IbPmtSummaryBundleModule { }
export { IbPmtSummaryBundleComponent } from './ib-pmt-summary-bundle.component';
