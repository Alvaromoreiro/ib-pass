import { Component, Input, OnInit } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { SortedFlightInfo } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-flight-info-on-hold-conf-model';
import { FlightInfo } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';


@Component({
    selector: 'ib-flight-info-on-hold-conf',
    templateUrl: './ib-flight-info-on-hold-conf.component.html',
    styleUrls: ['./ib-flight-info-on-hold-conf.component.scss']
})
export class IbFlightInfoOnHoldConfComponent implements OnInit{
    @Input() flightInfo: FlightInfo;
    public iconsPath: string = BookingAppConstants.iconsRoute;
    sortedFlightInfo:SortedFlightInfo[];

    ngOnInit (): void {
        this.sortedFlightInfo = Object.entries(this.flightInfo)
            .sort((a, b) => {
                const dateA = new Date(a[1].departureDateParsed.originalDate);
                const dateB = new Date(b[1].departureDateParsed.originalDate);
                return dateA.getTime() - dateB.getTime();
            })
            .map(([key, value]) => ({ key, value }));
    }

}
