import { Component, Input, OnInit } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { OutboundSelectedDurationType } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';
import { IbSliceDetailsComponentService } from '@shared/components/ib-booking-slice-details-info/ib-booking-slice-details.service';
import { IbSliceUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-slice-utils.service';
@Component({
    selector: 'ib-booking-recap-details',
    templateUrl: 'ib-booking-recap-details.component.html',
    styleUrls: ['./ib-booking-recap-details.component.scss']
})
export class IbBookingRecapDetailsComponent implements OnInit{
    @Input() sliceInfo: AvailabilityTransformerModel.SelectedSlice;
    @Input() adaptativeFlow: boolean;
    public duration: OutboundSelectedDurationType = <OutboundSelectedDurationType>{};
    public fareClass: string = `cabin-${BookingAppConstants.CABIN_TYPES.ECONOMY.toLowerCase()}`;
    public showAirlineLogo: boolean = true;
    constructor (
        private IbSliceUtilsService: IbSliceUtilsService,
        private IbSliceDetailsComponentService: IbSliceDetailsComponentService
    ) {
    }

    ngOnInit () {
        this.fareClass = `cabin-${this.IbSliceUtilsService.getFlightFareClass( this.sliceInfo.info.selectedFareFamily.cabinType )}`;
        this.duration = this.IbSliceUtilsService.setDurationType( this.sliceInfo.info.stopsNumber, this.sliceInfo.info.technicalStop );
    }

    public showDetails = (): void => {
        this.IbSliceDetailsComponentService.show( this.sliceInfo.info );
    };

    public handleAirlineLogoError = () => {
        this.showAirlineLogo = false;
    };

}
