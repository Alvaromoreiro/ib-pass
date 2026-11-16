import './lazyImports';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingShuttleLegacyDirective, IbBookingShuttleUpgradedComponent } from './ib-booking-shuttle-legacy.directive';
import { IbBookingShuttleRoutingModule } from '@src/app/core/routing/modules/ib-shuttle-page-routing.module';




@NgModule({
    declarations: [
        IbBookingShuttleLegacyDirective,
        IbBookingShuttleUpgradedComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IbBookingShuttleRoutingModule
    ],
    exports:[]
})
export class IbBookingShuttleModule {}
