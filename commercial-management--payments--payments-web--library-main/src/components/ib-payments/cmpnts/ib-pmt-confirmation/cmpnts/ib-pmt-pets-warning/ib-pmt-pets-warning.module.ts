import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbPmtPetsWarningComponent } from './ib-pmt-pets-warning.component';
import { TranslateModule } from '@ngx-translate/core';
import { IbCPipeModule } from 'ib-web-commons/pipes';


@NgModule({
    declarations: [
        IbPmtPetsWarningComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbCPipeModule
    ]
})
export class IbPmtPetsWarningModule { }
export { IbPmtPetsWarningComponent } from './ib-pmt-pets-warning.component';
