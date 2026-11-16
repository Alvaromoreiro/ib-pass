import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingSliceDetailsInfoComponent } from './ib-booking-slice-details-info.component';
import { IbBookingSliceDetailsInfoWarningComponent } from './components/ib-booking-slice-details-info-warning/ib-booking-slice-details-info-warning.component';


const downgradedComponents = [
    IbBookingSliceDetailsInfoComponent
];
@NgModule({
    declarations: [
        ...downgradedComponents,
        IbBookingSliceDetailsInfoWarningComponent
    ],
    imports: [
        TranslateModule,
        CommonModule
    ],
    exports: downgradedComponents
})
export class IbBookingSliceDetailsInfoModule {
    static components = [...downgradedComponents];
}
