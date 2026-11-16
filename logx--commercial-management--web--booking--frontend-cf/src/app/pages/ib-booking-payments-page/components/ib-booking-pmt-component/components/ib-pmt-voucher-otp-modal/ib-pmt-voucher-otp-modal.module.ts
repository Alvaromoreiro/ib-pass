import { NgModule } from '@angular/core';
import { IbPmtVoucherOtpModalComponent } from './ib-pmt-voucher-otp-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IbPmtOtpFormComponent } from './components/ib-pmt-otp-form/ib-pmt-otp-form.component';
import { IbPmtOtpInputComponent } from './components/ib-pmt-otp-input/ib-pmt-otp-input.component';
import { IbBookingSharedModule } from '@shared/ib-booking-shared.module';
import { IbCOtpErrorModalComponent } from './otp-error-modal/ib-otp-error-modal.component';

const components = [
    IbPmtVoucherOtpModalComponent,
    IbPmtOtpFormComponent,
    IbPmtOtpInputComponent,
    IbCOtpErrorModalComponent
];
@NgModule({
    declarations: components,
    exports: [],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IbBookingSharedModule
    ],
    providers: [
    ]
})
export class IbPmtVoucherOtpModalModule { }
