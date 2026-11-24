import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbPmtBkiSummaryPassengersComponent } from './ib-pmt-bki-summary-passengers.component';
import { TranslateModule } from '@ngx-translate/core';
import { IbCPipeModule } from 'ib-web-commons/pipes';


@NgModule({
    declarations: [
        IbPmtBkiSummaryPassengersComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbCPipeModule
    ]
})
export class IbPmtBkiSummaryPassengersModule { }
export { IbPmtBkiSummaryPassengersComponent } from './ib-pmt-bki-summary-passengers.component';
