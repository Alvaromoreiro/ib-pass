import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbBookingOnHoldAnulationRoutingModule } from '@src/app/core/routing/modules/ib-booking-on-hold-anulation-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingSharedModule } from '@src/app/shared/ib-booking-shared.module';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { IbBookingOnHoldAnulationComponent } from './ib-booking-on-hold-anulation.component';
import { IbMainFooterModule } from '@src/app/shared/components/ib-main-footer/ib-main-footer.module';


@NgModule({
    declarations: [
        IbBookingOnHoldAnulationComponent
    ],
    imports: [
        TranslateModule,
        CommonModule,
        IbBookingOnHoldAnulationRoutingModule,
        IbBookingSharedModule,
        IbCPipeModule,
        IbMainFooterModule
    ],
    providers: [
    ]
})

export class IbBookingOnHoldAnulationModule { }
