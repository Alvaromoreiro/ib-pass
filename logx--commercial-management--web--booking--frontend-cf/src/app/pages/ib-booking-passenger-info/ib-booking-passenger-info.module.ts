import './lazyImports';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbBookingOnHoldNowComponent } from '@src/app/pages/ib-booking-passenger-info/components/ib-booking-on-hold-now/ib-booking-on-hold-now.component';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingPassengersInfoComponent, IbBookingPassengersInfoLegacyDirective } from './ib-booking-passengers-info-upgraded.directive';
import { IbBookingPassengerPageRoutingModule } from '@src/app/core/routing/modules/ib-passengers-page-routing.module';
import { IbBookingRegisterFormComponent } from './components/ib-booking-register-form/ib-booking-register-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IbBookingPassengerWarningMessageComponent } from './components/ib-booking-passenger-warning-message/ib-booking-passenger-warning-message.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbBookingContactFormModule } from './components/ib-booking-contact-form/ib-booking-contact-form.module';
import { IbBookingPassengerFormModule } from './components/ib-booking-passenger-form/ib-booking-passenger-form.module';

const downgradedComponents = [
    IbBookingOnHoldNowComponent,
    IbBookingRegisterFormComponent,
    IbBookingPassengerWarningMessageComponent
];

@NgModule({
    declarations: [
        IbBookingPassengersInfoLegacyDirective,
        IbBookingPassengersInfoComponent,
        ...downgradedComponents
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbBookingSharedModule,
        ReactiveFormsModule,
        FormsModule,
        IbBookingPassengerPageRoutingModule,
        IbBookingContactFormModule,
        IbBookingPassengerFormModule
    ],
    exports: downgradedComponents
})
export class IbBookingPassengerInfoModule {
    static components = [...downgradedComponents];
}
