import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IbCitySelectorComponent } from './ib-booking-city-selector.component';
import { IbCitySearchPipe } from './filters/ib-booking-city-search.pipe';
import { IbUiIoslistModule } from 'ib-web-commons/ui-components';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        IbUiIoslistModule
    ],
    declarations: [
        IbCitySelectorComponent,
        IbCitySearchPipe
    ],
    exports: [
        IbCitySelectorComponent
    ]
})
export class IbBookingCitySelectorModule {
    static components = [
        IbCitySelectorComponent
    ];
}

