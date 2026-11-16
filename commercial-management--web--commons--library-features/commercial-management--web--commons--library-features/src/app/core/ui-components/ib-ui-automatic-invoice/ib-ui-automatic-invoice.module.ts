import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbUiAutomaticInvoiceComponent } from './ib-ui-automatic-invoice.component';

@NgModule({
    declarations: [
        IbUiAutomaticInvoiceComponent
    ],
    exports: [
        IbUiAutomaticInvoiceComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class IbUiAutomaticInvoiceModule {}
export { IbUiAutomaticInvoiceComponent } from "./ib-ui-automatic-invoice.component";
