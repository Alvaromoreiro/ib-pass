import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbUiOtpModalComponent } from './ib-ui-otp-modal.component';

@NgModule({
    declarations: [IbUiOtpModalComponent],
    exports: [IbUiOtpModalComponent],
    imports: [CommonModule, TranslateModule],
    })
export class IbUiOtpModalModule {}

export { IbUiOtpModalComponent } from './ib-ui-otp-modal.component';
