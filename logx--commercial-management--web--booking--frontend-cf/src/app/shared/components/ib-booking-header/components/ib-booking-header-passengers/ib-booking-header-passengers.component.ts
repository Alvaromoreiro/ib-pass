import { Component, Input } from '@angular/core';

@Component({
    selector: 'ib-booking-header-passengers',
    templateUrl: './ib-booking-header-passengers.component.html',
    styleUrls: ['./ib-booking-header-passengers.component.scss']
})
export class IbBookingHeaderPassengersComponent {
    @Input() public isMultiflight: boolean;
    @Input() public passengerNumber: number;

}
