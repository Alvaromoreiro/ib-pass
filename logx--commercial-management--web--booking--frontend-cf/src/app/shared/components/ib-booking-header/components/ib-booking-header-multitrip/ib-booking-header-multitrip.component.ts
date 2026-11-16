import { Component, Input } from '@angular/core';
import { HeaderCompleteOriginDestinationResponse } from '@src/app/core/models/ib-booking-availability/header-model';

@Component({
    selector: 'ib-booking-header-multitrip',
    templateUrl: './ib-booking-header-multitrip.component.html',
    styleUrls: ['./ib-booking-header-multitrip.component.scss']
})
export class IbBookingHeaderMultitripComponent {
    @Input() public trip: HeaderCompleteOriginDestinationResponse;
}
