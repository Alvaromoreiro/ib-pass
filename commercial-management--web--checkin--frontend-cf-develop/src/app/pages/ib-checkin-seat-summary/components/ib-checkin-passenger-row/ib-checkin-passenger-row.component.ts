import { Component, Input } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-checkin-passenger-row',
    templateUrl: './ib-checkin-passenger-row.component.html',
    styleUrls: ['./ib-checkin-passenger-row.scss']
})
export class IbCheckinPassengerRowComponent {
    @Input() passengerInfo: CkiSeatSummary.IPassenger;
}

downgradeToAJSComponent(
    'ibCheckinPassengerRow',
    {
        component: IbCheckinPassengerRowComponent
    },
    'ib-checkin-seat-summary-page-module',
    []
);
