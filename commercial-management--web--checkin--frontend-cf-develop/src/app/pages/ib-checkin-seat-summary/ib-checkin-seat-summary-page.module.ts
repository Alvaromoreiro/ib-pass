import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IbCheckinSeatSummaryPageComponent } from './ib-checkin-seat-summary-page.component';
import { IbCheckinSegmentSummaryComponent } from './components/ib-checkin-segment-summary/ib-checkin-segment-summary.component';
import { IbCheckinPassengerRowComponent } from './components/ib-checkin-passenger-row/ib-checkin-passenger-row.component';
import { IbCheckinSegmentInfoComponent } from './components/ib-checkin-segment-info/ib-checkin-segment-info.component';

const downgradedComponent = [
    IbCheckinSeatSummaryPageComponent,
    IbCheckinSegmentSummaryComponent,
    IbCheckinPassengerRowComponent,
    IbCheckinSegmentInfoComponent
];

@NgModule({
    declarations: [
        IbCheckinSeatSummaryPageComponent,
        IbCheckinSegmentSummaryComponent,
        IbCheckinPassengerRowComponent,
        IbCheckinSegmentInfoComponent
    ],
    imports: [
        CommonModule,
        TranslateModule
    ],
    exports: [
        IbCheckinSeatSummaryPageComponent
    ]
})

export class IbCheckinSeatSummaryPageModule {
    static components = [...downgradedComponent];
}
