import { NgModule } from '@angular/core';
import { IbBookingFlightsRecapPageComponent } from './ib-booking-flights-recap.component';
import { IbBookingFlightsRecapRoutingModule } from '@src/app/core/routing/modules/ib-booking-flights-recap-routing.module';
import { IbBookingRecapDetailsComponent } from './components/ib-booking-recap-details/ib-booking-recap-details.component';
import { IbBookingFareRecapComponent } from './components/ib-booking-fare-recap/ib-booking-fare-recap.component';
import { IbBookingFareSummaryComponent } from './components/ib-booking-fare-recap/component/ib-booking-fare-summary/ib-booking-fare-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IbBookingSharedModule } from '../../shared/ib-booking-shared.module';
import { IbMainFooterModule } from '@src/app/shared/components/ib-main-footer/ib-main-footer.module';

@NgModule({
    declarations: [
        IbBookingFlightsRecapPageComponent,
        IbBookingRecapDetailsComponent,
        IbBookingFareRecapComponent,
        IbBookingFareSummaryComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        IbBookingFlightsRecapRoutingModule,
        IbBookingSharedModule,
        IbMainFooterModule
    ],
    providers: [

    ]
})
export class IbBookingFlightsRecapModule {

}

