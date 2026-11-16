import { NgModule } from '@angular/core';
import { IbBookingOnHoldConfirmationPageComponent } from './ib-booking-on-hold-confirmation.component';
import { IbTripInfoOnHoldConfComponent } from './components/ib-trip-info-on-hold-conf/ib-trip-info-on-hold-conf.component';
import { IbBookingOnHoldRoutingModule } from '@src/app/core/routing/modules/ib-booking-on-hold-confirmation-routing.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbPassengerInfoOnHoldConfComponent } from './components/ib-trip-info-on-hold-conf/components/ib-passenger-info-on-hold-conf/ib-passenger-info-on-hold-conf.component';
import { IbSpecialNeedsModalComponent } from './components/ib-trip-info-on-hold-conf/components/ib-passenger-info-on-hold-conf/components/ib-special-needs-modal/ib-special-needs-modal.component';
import { IbCashAviosInfoComponent } from './components/ib-cash-avios-info/ib-cash-avios-info.component';
import { IbContactInfoOnHoldConfComponent } from './components/ib-trip-info-on-hold-conf/components/ib-contact-info-on-hold-conf/ib-contact-info-on-hold-conf.component';
import { IbPriceBreakdownOnHoldConfComponent } from './components/ib-trip-info-on-hold-conf/components/ib-price-breakdown-on-hold-conf/ib-price-breakdown-on-hold-conf.component';
import { IbTaxBreakdownModalComponent } from './components/ib-trip-info-on-hold-conf/components/ib-price-breakdown-on-hold-conf/components/ib-tax-breakdown-modal/ib-tax-breakdown-modal.component';
import { IbGeneralInfoOnHoldConfComponent } from './components/ib-general-info-on-hold-conf/ib-general-info-on-hold-conf.component';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { IbFlightInfoOnHoldConfComponent } from './components/ib-trip-info-on-hold-conf/components/ib-flight-info-on-hold-conf/ib-flight-info-on-hold-conf.component';
import { IbBookingFareFamilyConditionsComponent } from './components/ib-trip-info-on-hold-conf/components/ib-flight-info-on-hold-conf/components/ib-booking-fare-family-conditions/ib-booking-fare-family-conditions.component';
import { IbCompareFaresModalComponent } from './components/ib-trip-info-on-hold-conf/components/ib-flight-info-on-hold-conf/components/ib-booking-fare-family-conditions/components/ib-compare-fares-modal/ib-compare-fares-modal.component';
import { IbMainFooterModule } from '@src/app/shared/components/ib-main-footer/ib-main-footer.module';
@NgModule({
    declarations: [

        IbBookingOnHoldConfirmationPageComponent,
        IbCashAviosInfoComponent,
        IbTripInfoOnHoldConfComponent,
        IbPassengerInfoOnHoldConfComponent,
        IbSpecialNeedsModalComponent,
        IbContactInfoOnHoldConfComponent,
        IbPriceBreakdownOnHoldConfComponent,
        IbTaxBreakdownModalComponent,
        IbGeneralInfoOnHoldConfComponent,
        IbFlightInfoOnHoldConfComponent,
        IbBookingFareFamilyConditionsComponent,
        IbCompareFaresModalComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        IbBookingOnHoldRoutingModule,
        IbBookingSharedModule,
        IbCPipeModule,
        IbMainFooterModule
    ],
    providers: [

    ]
})
export class IbBookingOnHoldConfirmationModule {

}
