import { Component, Input } from '@angular/core';
import { HeaderCompleteOriginDestinationResponse } from '@src/app/core/models/ib-booking-availability/header-model';

@Component({
    selector: 'ib-booking-header-trip',
    templateUrl: './ib-booking-header-trip.component.html',
    styleUrls: ['./ib-booking-header-trip.component.scss']
})
export class IbBookingHeaderTripComponent {
    @Input() public trip: HeaderCompleteOriginDestinationResponse;
    @Input() public isShuttleFlow: boolean;
}
