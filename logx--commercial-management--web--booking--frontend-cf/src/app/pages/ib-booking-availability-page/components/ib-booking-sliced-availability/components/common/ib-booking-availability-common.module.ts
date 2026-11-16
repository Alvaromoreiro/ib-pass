import { NgModule } from '@angular/core';
import { IbBookingFareDetailsLegacyDirective } from '../ib-booking-mobile-slice-info/components/ib-booking-fare-details-legacy.component';
import { IbBookingFareDetailsSimpleLegacyDirective } from '../ib-booking-mobile-slice-info/components/ib-booking-fare-details-simple-legacy.component';
import {IbBookingFareContainerComponent} from './ib-booking-fare-container/ib-booking-fare-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
const downgradedComponents = [IbBookingFareContainerComponent];
const components = [...downgradedComponents, IbBookingFareDetailsLegacyDirective, IbBookingFareDetailsSimpleLegacyDirective];
@NgModule({
    declarations: components,
    imports: [
        TranslateModule,
        FormsModule,
        CommonModule
    ], 
    exports :components
})
export class IbBookingAvailabilityCommonModule{
    static components = [...downgradedComponents];
}