import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { IbBookingPassengerFormComponent } from './ib-booking-passenger-form.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbBookingPassengerBirthDateModule } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-contact-form/components/ib-booking-passenger-birth-date/ib-booking-passenger-birth-date.module';
import { IbBookingPassengerSpecialNeedsComponent } from '../ib-booking-passenger-special-needs/ib-booking-passenger-special-needs.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { IbBookingOnbProgramComponent } from './components/ib-booking-onb-program/ib-booking-onb-program.component';
@NgModule({
    declarations: [
        IbBookingPassengerFormComponent,
        IbBookingPassengerSpecialNeedsComponent,
        IbBookingOnbProgramComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        AutoCompleteModule,
        TranslateModule,
        ReactiveFormsModule,
        IbCPipeModule,
        IbBookingSharedModule,
        IbBookingPassengerBirthDateModule,
        OverlayPanelModule
    ],
    exports: [
        IbBookingPassengerFormComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IbBookingPassengerFormModule {
    static components = [IbBookingPassengerFormComponent];
}

