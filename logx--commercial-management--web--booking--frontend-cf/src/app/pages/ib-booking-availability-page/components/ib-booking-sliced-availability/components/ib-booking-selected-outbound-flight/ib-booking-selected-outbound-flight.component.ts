import { Component, Input, OnInit, Inject, HostListener, Output, EventEmitter, OnChanges } from '@angular/core';
import { OutboundSelected, OutboundSelectedDurationType, OutboundSelectedTravelDays } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { IbSliceUtilsService } from '../../../../../../shared/services/ib-utils/ib-booking-slice-utils.service';
@Component({
    selector: 'ib-booking-selected-outbound-flight',
    templateUrl: './ib-booking-selected-outbound-flight.component.html',
    styleUrls: ['./ib-booking-selected-outbound-flight.component.scss']
})
export class IbBookingSelectedOutboundFlightComponent implements OnChanges, OnInit {
    @Input() public selectedFlight: AvailabilityTransformerModel.SelectedSlice = <AvailabilityTransformerModel.SelectedSlice> {};
    @Output() repeatSearch = new EventEmitter<string>();
    private cabinClass: string = 'cabin-';
    public isMobile: boolean = false;
    public fareClass: string = `${this.cabinClass}${BookingAppConstants.CABIN_TYPES.ECONOMY.toLowerCase()}`;
    public sliceModel: OutboundSelected = <OutboundSelected> {};

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        @Inject( WINDOW_TOKEN ) private window: Window,
        public IbSliceUtilsService: IbSliceUtilsService
    ) { }

    activate (): void {
        this.isMobile = this.rootScope?.isMobile?.general;
        this.fareClass = `${this.cabinClass}${this.IbSliceUtilsService.getFlightFareClass( this.selectedFlight.info.selectedFareFamily.cabinType )}`;
        this.sliceModel = this.getSliceViewModel( this.selectedFlight );
    }
    ngOnChanges () {
        this.activate();
    }
    ngOnInit (): void {
        this.mnttCall();
    }
    public returnToOutboundSelection (): void {
        //delegate on Output() to recover the original query from this selection to repeat it when you click on module
        this.repeatSearch.emit( 'repeatItinerarySearch' );
    }
    @HostListener('window:resize', ['$event'])
    public onResize ( ): void {
        this.isMobile = this.rootScope.isMobile.general;
    }
    private getSliceViewModel ( selectedFlight: AvailabilityTransformerModel.SelectedSlice ): OutboundSelected {
        const viewModel: OutboundSelected = {
            cabin: selectedFlight.info.selectedFareFamily.cabinDescription,
            daysOfTravel: this.setTravelDaysKey( selectedFlight.info.daysOfTravel ),
            destination: {
                city: selectedFlight.destination,
                time: selectedFlight.info.arrivalDateTimeParsed
            },
            fare: selectedFlight.info.selectedFareFamily.commercialName,
            flightDate: {
                day: selectedFlight.info.departureDateParsed.day,
                month: selectedFlight.info.departureDateParsed.month
            },
            flightDuration: {
                type: this.IbSliceUtilsService.setDurationType( selectedFlight.info.stopsNumber, selectedFlight.info.technicalStop ),
                time: selectedFlight.info.durationParsed
            },
            origin: {
                city: selectedFlight.origin,
                time: selectedFlight.info.departureDateTimeParsed
            },
            price: selectedFlight.info.selectedFareFamily.farePriceShown

        };
        return viewModel;
    }
    private setTravelDaysKey ( travelDays: number ): OutboundSelectedTravelDays {
        const dayString: string = travelDays > 0 && travelDays !== 1 ? 'SOME_AVAILABILITY_SLICE_INFO_DAY' : 'AVAILABILITY_SLICE_INFO_DAY';
        return travelDays > 0 ? { days: travelDays, text: dayString } : null;
    }
    public mnttCall (): void {
        const outboundLoadedEvent = new CustomEvent( 'outboundLoadedEvent', {
            bubbles: true,
            composed: true,
            cancelable: false
        } );
        this.window.dispatchEvent( outboundLoadedEvent );
    }
}
