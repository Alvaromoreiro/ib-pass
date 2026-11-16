import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IbBookingPassengerBirthDateComponent } from './ib-booking-passenger-birth-date.component';
import { IbCPipeModule } from 'ib-web-commons/pipes';

@NgModule({
    declarations: [
        IbBookingPassengerBirthDateComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AutoCompleteModule,
        TranslateModule,
        ReactiveFormsModule,
        IbCPipeModule
    ],
    exports: [
        IbBookingPassengerBirthDateComponent
    ]
})
export class IbBookingPassengerBirthDateModule {
    static components = [IbBookingPassengerBirthDateComponent];
}

