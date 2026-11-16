import {  NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { IbMobileRibbonDayComponent } from './components/ib-mobile-ribbon-day/ib-mobile-ribbon-day.component';
import { IbBookingMobileRibbonComponent } from './ib-booking-mobile-ribbon.component';
const components = [
    IbMobileRibbonDayComponent,
    IbBookingMobileRibbonComponent
];

@NgModule({
    declarations: components,
    imports: [
        TranslateModule,
        CommonModule

    ],
    exports: components
})
export class IbBookingMobileRibbonModule{}