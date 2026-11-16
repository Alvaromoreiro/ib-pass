import { Component, Input } from '@angular/core';

@Component({
    selector: 'ib-booking-header-multitrip-tooltip',
    templateUrl: './ib-booking-header-multitrip-tooltip.component.html',
    styleUrls: ['./ib-booking-header-multitrip-tooltip.component.scss']
})
export class IbBookingHeaderMultitripTooltipComponent {
    @Input() public model;
    @Input() public numberTrips;

}
