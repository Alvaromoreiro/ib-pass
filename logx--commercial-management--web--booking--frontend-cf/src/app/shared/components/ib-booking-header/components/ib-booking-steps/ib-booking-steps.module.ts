import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingStepsComponent } from './ib-booking-steps.component';
import { IbBookingStepsNavComponent } from './components/ib-booking-steps-nav/ib-booking-steps-nav.component';


@NgModule({
    imports: [
        TranslateModule,
        CommonModule
    ],   
    exports: [
        IbBookingStepsComponent

    ],
    declarations: [
        IbBookingStepsComponent,
        IbBookingStepsNavComponent
    ]
})
export class IbBookingHeaderStepsModule {}
