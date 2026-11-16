import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingPhoneNumberComponent } from './components/ib-booking-phone-number/ib-booking-phone-number.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IbBookingContactFormComponent } from './ib-booking-contact-form.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IbBookingMarketingCheckComponent } from './components/ib-booking-marketing-check/ib-booking-marketing-check.component';

const downgradedComponents = [
    IbBookingContactFormComponent
];

@NgModule({
    declarations: [
        IbBookingPhoneNumberComponent,
        ...downgradedComponents,
        IbBookingMarketingCheckComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbBookingSharedModule,
        AutoCompleteModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports:[
        IbBookingPhoneNumberComponent
    ]
})
export class IbBookingContactFormModule {
    static components = [...downgradedComponents];
}
