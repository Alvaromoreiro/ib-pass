import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbUiOtpModalErrorComponent } from './ib-ui-otp-modal-error.component';

@NgModule({
    declarations: [IbUiOtpModalErrorComponent],
    exports: [IbUiOtpModalErrorComponent],
    imports: [CommonModule, TranslateModule],
    })
export class IbUiOtpModalErrorModule {}

export { IbUiOtpModalErrorComponent } from './ib-ui-otp-modal-error.component';
