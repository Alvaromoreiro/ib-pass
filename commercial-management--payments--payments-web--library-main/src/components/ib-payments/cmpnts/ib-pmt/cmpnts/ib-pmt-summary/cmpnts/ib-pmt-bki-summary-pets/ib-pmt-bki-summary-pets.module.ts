import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbPmtBkiSummaryPetsComponent } from './ib-pmt-bki-summary-pets.component';
import { TranslateModule } from '@ngx-translate/core';
import { IbCPipeModule } from 'ib-web-commons/pipes';


@NgModule({
    declarations: [
        IbPmtBkiSummaryPetsComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbCPipeModule
    ]
})
export class IbPmtBkiSummaryPetsModule { }
export { IbPmtBkiSummaryPetsComponent } from './ib-pmt-bki-summary-pets.component';
