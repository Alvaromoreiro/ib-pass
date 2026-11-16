import './lazyImports';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IbBookingAlpComponent } from './ib-booking-alp.component';
import { IbBookingAlpPageRoutingModule } from '@src/app/core/routing/modules/ib-booking-alp-page-routing.module';
import { IbBookingSwitchSellModule } from 'ib-web-ancillaries';
import { TranslateModule } from '@ngx-translate/core';
import { IbMainFooterModule } from '@src/app/shared/components/ib-main-footer/ib-main-footer.module';

@NgModule({
    declarations: [
        IbBookingAlpComponent
    ],
    imports: [
        CommonModule,
        IbBookingAlpPageRoutingModule,
        IbBookingSwitchSellModule,
        TranslateModule,
        IbMainFooterModule
    ],
    providers: [
    ]
})
export class IbBookingAlpPageModule {
    constructor (){



    }
}
