import { Component, Input, OnDestroy, OnInit } from '@angular/core';


@Component({
    selector: 'ib-booking-slice-details-info-warning',
    templateUrl: './ib-booking-slice-details-info-warning.component.html',
    styleUrls: ['./ib-booking-slice-details-info-warning.component.scss']
})
export class IbBookingSliceDetailsInfoWarningComponent implements OnInit, OnDestroy {
    @Input() public warningModel: AvailabilityTransformerModel.SliceSegment;
    public warningInfo: AvailabilityTransformerModel.ChangeInfo = {};

    ngOnInit (): void {
        if(this.warningModel.terminalChange.show) {
            this.warningInfo.title = 'CHANGE_TERMINAL_TITLE';
            this.warningInfo.arrivalTitle = 'CHANGE_TERMINAL_ARRIVAL';
            this.warningInfo.departureTitle = 'CHANGE_TERMINAL_DEPARTURE';
            this.warningInfo.arrival = this.warningModel.terminalChange.arrival;
            this.warningInfo.departure = this.warningModel.terminalChange.departure;
        } else if (this.warningModel.airportChange.show) {
            this.warningInfo.title = 'CHANGE_AIRPORT_TITLE';
            this.warningInfo.arrivalTitle = 'AVAILABILITY_ARRIVAL_FILTER';
            this.warningInfo.departureTitle = 'AVAILABILITY_DEPARTURE_FILTER';
            this.warningInfo.arrival = this.warningModel.airportChange.arrival;
            this.warningInfo.departure = this.warningModel.airportChange.departure;
        }
    }

    ngOnDestroy (): void {
        this.warningInfo = {};
    }

}
