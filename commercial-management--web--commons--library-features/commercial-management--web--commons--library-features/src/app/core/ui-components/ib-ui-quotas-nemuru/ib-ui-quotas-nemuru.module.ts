import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbUiQuotasNemuruComponent } from './ib-ui-quotas-nemuru.component';

@NgModule({
    declarations: [
        IbUiQuotasNemuruComponent
    ],
    exports: [
        IbUiQuotasNemuruComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class IbUiQuotasNemuruModule {}
export { IbUiQuotasNemuruComponent } from "./ib-ui-quotas-nemuru.component";
