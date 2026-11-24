import { NgModule } from '@angular/core';
import { IbPmtOrmVoucherOtpModalComponent } from './ib-pmt-orm-voucher-otp-modal.component';
import { IbPmtAssfassVoucherOtpModalComponent } from './ib-pmt-assfass-voucher-otp-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IbPmtOtpFormComponent } from './components/ib-pmt-otp-form/ib-pmt-otp-form.component';
import { IbPmtOtpInputComponent } from './components/ib-pmt-otp-input/ib-pmt-otp-input.component';
import { SharedModule } from '../../../shared/shared.module';

const components = [
    IbPmtOrmVoucherOtpModalComponent,
    IbPmtAssfassVoucherOtpModalComponent,
    IbPmtOtpFormComponent,
    IbPmtOtpInputComponent
];
@NgModule({
    declarations: components,
    exports: [],
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    providers: [
    ]
})
export class IbPmtVoucherOtpModalModule { }
