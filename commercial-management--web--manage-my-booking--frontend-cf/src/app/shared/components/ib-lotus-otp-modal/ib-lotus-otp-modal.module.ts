import { NgModule } from '@angular/core';
import { IbLotusOtpModalComponent } from './ib-lotus-otp-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IbLotusOtpFormComponent } from './components/ib-lotus-otp-form/ib-lotus-otp-form.component';
import { IbLotusOtpInputComponent } from './components/ib-lotus-otp-input/ib-lotus-otp-input.component';
import { IbCOtpErrorModalComponent } from './otp-error-modal/ib-otp-error-modal.component';
import { IbLotusOtpModalService } from './ib-lotus-otp-modal.service';

const components = [
    IbLotusOtpModalComponent,
    IbLotusOtpFormComponent,
    IbLotusOtpInputComponent,
    IbCOtpErrorModalComponent
];
@NgModule({
    declarations: components,
    exports: components,
    imports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        IbLotusOtpModalService
    ]
})
export class IbLotusOtpModalModule { }
