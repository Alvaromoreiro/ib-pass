import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbPetsNotAvailableComponent } from './ib-pets-not-available.component';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbBookingHeaderModule } from '@src/app/shared/components/ib-booking-header/ib-booking-header.module';
import { IbPetsNotAvailableRoutingModule } from '@core/routing/modules/ib-pets-not-available-routing.module';
import { IbMainFooterModule } from '@src/app/shared/components/ib-main-footer/ib-main-footer.module';
@NgModule({
    declarations: [
        IbPetsNotAvailableComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbBookingSharedModule,
        IbBookingHeaderModule,
        IbPetsNotAvailableRoutingModule,
        IbMainFooterModule
    ]
})
export class IbPetsNotAvailableModule { 
}
