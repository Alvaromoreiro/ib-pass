import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IbMainFooterModule } from '@shared/components/ib-main-footer/ib-main-footer.module';
import { IbBookingErrorPageRoutingModule } from '@src/app/core/routing/modules/ib-bk-error-routing.module';
import { IbBookingBkiErrorUpgradedComponent } from './component/ib-booking-bk-error.component';
import { IbBackgroundComponent } from '@shared/components/ib-background/ib-background.component';
import { IbBookingHeaderModule } from '@src/app/shared/components/ib-booking-header/ib-booking-header.module';
@NgModule({
    declarations: [
        IbBookingBkiErrorUpgradedComponent
    ],
    imports: [
        CommonModule,
        IbBookingErrorPageRoutingModule,
        TranslateModule,
        IbMainFooterModule,
        IbBackgroundComponent,
        IbBookingHeaderModule
    ],
    providers: [
    ]
})
export class IbBookingBkErrorModule {
    constructor () {
        
    }
}
