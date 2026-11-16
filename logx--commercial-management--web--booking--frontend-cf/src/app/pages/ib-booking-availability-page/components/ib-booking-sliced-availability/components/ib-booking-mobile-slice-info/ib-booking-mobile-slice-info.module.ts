import {  NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IbBookingMobileSliceInfoComponent } from './ib-booking-mobile-slice-info.component';
import { IbBookingMobileSliceInfoFlightComponent } from './components/ib-booking-mobile-slice-info-flight/ib-booking-mobile-slice-info-flight.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbBookingAvailabilityCommonModule } from '../common/ib-booking-availability-common.module';

const downgradedComponents = [
    IbBookingMobileSliceInfoComponent
];
const components  = [
    ...downgradedComponents,
    IbBookingMobileSliceInfoFlightComponent
];

@NgModule({
    declarations: components,
    imports: [
        TranslateModule,
        CommonModule,
        IbBookingAvailabilityCommonModule,
        IbBookingSharedModule
    ],
    exports: components
})
export class IbBookingMobileSliceInfoModule{
    static components = [...downgradedComponents];
}
