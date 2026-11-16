import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbOnbNotAvailabilityComponent } from './ib-onb-not-availability.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbBookingHeaderModule } from '@src/app/shared/components/ib-booking-header/ib-booking-header.module';
import { IbOnbNotAvailabilityRoutingModule } from '@src/app/core/routing/modules/ib-onb-not-availability-page-routing.module';
import { IbMainFooterModule } from '@src/app/shared/components/ib-main-footer/ib-main-footer.module';
@NgModule({
    declarations: [
        IbOnbNotAvailabilityComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbBookingSharedModule,
        IbBookingHeaderModule,
        IbOnbNotAvailabilityRoutingModule,
        IbMainFooterModule
    ]
})
export class IbOnbNotAvailabilityModule { 
}
