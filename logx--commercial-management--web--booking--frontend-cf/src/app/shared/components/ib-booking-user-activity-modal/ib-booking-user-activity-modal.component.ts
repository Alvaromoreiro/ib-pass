import { Component, Inject, OnInit } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AJSBookingUtilsService } from '../../services/ib-utils/ib-booking-utils-service-bridge.service';
import { TranslateService } from '@ngx-translate/core';
import { BookingURLParams } from '@src/app/core/models/generic-models/generic-models';
import { HeaderCompleteOriginDestinationModel } from '@src/app/core/models/ib-booking-availability/header-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserActivityModalUtilsService } from './services/ib-user-activity-modal-utils.service';

type DepatureType = {
    city: string;
    code: string;
    view: string;
};
export type MoreInfoJourneyTripType = {
    date: string,
    origin: DepatureType;
    destination: DepatureType;
    type: string;
    formedInfo: string;
};

export type MoreInfoJourneyType = {
    passengers: string[];
    trips: MoreInfoJourneyTripType[];
};
    
export type ActivityModalMoreInfoType = {
    showMoreInfo: boolean;
    show: boolean;
    journey: MoreInfoJourneyType[],
    moreInfoText: string;
    
};
interface ExtendedRootScope extends CommonsRootScope {
    destination?: string;
    destinationCity?: string;
}

@Component({
    selector: 'ib-modal-generic',
    templateUrl: './ib-booking-user-activity-modal.component.html',
    styleUrls: ['./ib-booking-user-activity-modal.component.scss']
} )

export class UserActivityModalComponent implements OnInit {
    public isRedemptionFlow: boolean = false;
    public isAvailability: boolean = false;
    public isPointsOBFlow: boolean = false;
    public isPa: boolean = false;
    public isPaOpen: boolean = false;
    public isMultiCity: boolean = false;
    public isOpenJaw: boolean = false;
    public isStopOver: boolean = false;
    public isOnHold: boolean = false;
    public searchFlightType: string = '';
    public bkiUrlParams: BookingURLParams | null;
    public travelInfo = <HeaderCompleteOriginDestinationModel> {};
    public moreInfo = <ActivityModalMoreInfoType> {};
    private destinationCity: string | null = null;
    private moreInfoObject = <ActivityModalMoreInfoType> {};
    constructor (
        @Inject(AJSRootScope) private rootScope: ExtendedRootScope,
        @Inject(AJSBookingUtilsService) private BookingUtilService,
        private TranslateService: TranslateService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private UserActivityModalUtilsService: UserActivityModalUtilsService,
        private NgbActiveModal: NgbActiveModal
    ) {
        this.isRedemptionFlow = this.rootScope.isRedemptionFlow;
        this.isAvailability = this.rootScope.isAvailability;
        this.isPointsOBFlow = this.rootScope.isPointsOBFlow;
    }

    ngOnInit () {
        this.setTravelPorperties();
    }
    
    private setTravelPorperties = () => {
        if ( !this.isRedemptionFlow ) {
            this.setNonRedemptionFlowProperties();
        }
    };

    private setNonRedemptionFlowProperties = () => {
        this.isPa = false;
        this.isPaOpen = this.CommonsSessionStorageService.get( BkiStorageConstants.SHUTTLE_FLOW ) || false;
        this.isMultiCity = this.CommonsSessionStorageService.get( BkiStorageConstants.MULTICITY ) || false;
        this.isOpenJaw = this.CommonsSessionStorageService.get( BkiStorageConstants.OPEN_JAW ) || false;
        this.isStopOver = this.CommonsSessionStorageService.get( BkiStorageConstants.HOLA_MADRID ) || false;
        this.isOnHold = this.CommonsSessionStorageService.get( BkiStorageConstants.FLOW_APP ) === 'MMBOH' || false;
        this.searchFlightType = this.CommonsSessionStorageService.get<string>( BkiStorageConstants.SEARCH_FLIGHT_TYPE );
        this.bkiUrlParams = this.CommonsSessionStorageService.get<BookingURLParams>( BkiStorageConstants.BOOKING_URL_PARAMS ) || null;
        this.moreInfo = !this.isOnHold && this.setTravelInfo();
    };
    
    /**
     * Function to form the data to show more info about search on modal view
     *
     * @returns The info object
     */
    private setTravelInfo = () => {
        const isOpenJawMetaSearch = (this.isOpenJaw && (this.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH)) ?? false;
        let flightType = isOpenJawMetaSearch ? BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP : this.searchFlightType;
        this.travelInfo = this.CommonsSessionStorageService.get<HeaderCompleteOriginDestinationModel>(BkiStorageConstants.ORIGIN_DESTINATIONS);
        this.destinationCity = this.rootScope.destinationCity ?? this.travelInfo.destinationCity.description;
        flightType = this.determineFlightType(flightType);
        this.moreInfoObject.showMoreInfo = false;
        this.handleFlightType( flightType );
        this.moreInfoObject.showMoreInfo = this.moreInfoObject.show;
        this.moreInfoObject.moreInfoText = this.TranslateService.instant('BKI_KEEP_ALIVE_SEARCH_DESTINATION_1') + this.destinationCity + this.TranslateService.instant('BKI_KEEP_ALIVE_SEARCH_DESTINATION_2');

        return this.moreInfoObject;
    };

    private determineFlightType = ( flightType: string ): string => {
        if ( this.isStopOver ) return BookingAppConstants.FLIGHT_SEARCH_FLOWS.STOPOVER;
        if ( this.isPaOpen ) return BookingAppConstants.FLIGHT_SEARCH_FLOWS.PA_OPEN;
        return flightType;
    };

    private handleFlightType = ( flightType: string ): void => {
        switch ( flightType ) {
                case BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP:
                    this.travelInfo = this.CommonsSessionStorageService.get<HeaderCompleteOriginDestinationModel>( BkiStorageConstants.ORIGIN_DESTINATIONS_MULTICITY );
                    this.moreInfoObject.show = true;
                    this.moreInfoObject.journey = this.setTravelInfoTrip( this.travelInfo );
                    break;
                case BookingAppConstants.FLIGHT_SEARCH_FLOWS.STOPOVER:
                    this.travelInfo = this.CommonsSessionStorageService.get<HeaderCompleteOriginDestinationModel>( 'originDestinationMulticity' );
                    this.destinationCity = this.travelInfo[ 0 ].destinationCity.code !== 'MAD' ? this.travelInfo[ 0 ].destinationCity.description : this.travelInfo[ 1 ].destinationCity.description;
                    this.moreInfoObject.show = true;
                    this.moreInfoObject.journey = this.setTravelInfoTrip( this.travelInfo );
                    break;
                case BookingAppConstants.FLIGHT_SEARCH_FLOWS.PA_OPEN:
                    this.moreInfoObject.show = true;
                    this.moreInfoObject.journey = this.setTravelInfoTrip( this.travelInfo );
                    break;
                default:
                    this.moreInfoObject.show = true;
                    this.moreInfoObject.journey = this.setTravelInfoTrip( this.travelInfo );
                    break;
        }
    };
    
    private setTravelInfoTrip = ( travelInfo: HeaderCompleteOriginDestinationModel ) => {
        let trip = {}, outboundTrip, returnTrip;
        const journey = [];
        const tripsInfo = {
            passengers: [],
            trips: []
        };
        const dateFormat = BookingAppConstants.COMMERCIAL_DATE_FORMATS.SHORT;
        const isMulticity = Array.isArray( travelInfo );
        if ( !isMulticity ) {
            tripsInfo.passengers = this.UserActivityModalUtilsService.setTravelInfoPassAvail( travelInfo );
            outboundTrip = this.tripComposition( travelInfo, dateFormat, BookingAppConstants.FLIGHT_SEARCH_TYPE.OUTBOUND );
            tripsInfo.trips.push( outboundTrip );
            if ( this.shouldAddReturnTrip( ) ) {
                returnTrip = this.tripComposition( travelInfo, dateFormat, BookingAppConstants.FLIGHT_SEARCH_TYPE.RETURN );
                tripsInfo.trips.push( returnTrip );
            }
            journey.push( tripsInfo );
        } else {
            tripsInfo.passengers = this.UserActivityModalUtilsService.setTravelInfoPassAvail( travelInfo[ 0 ] );
            travelInfo.forEach( ( travel ) => {
                trip = this.tripComposition( travel, dateFormat );
                tripsInfo.trips.push( trip );
            } );
            journey.push( tripsInfo );
        }
        return journey;
    };

    private shouldAddReturnTrip = (): boolean => {
        return !!this.travelInfo.dates.returnFlight || ( this.isPaOpen && this.bkiUrlParams.tripType === '2' );
    };
    
    private tripComposition = ( tripData, dateView, flightType: string | null = null ) => {
        const trip = {date: '', origin: {city:'', code:'', view:''}, destination: {city:'', code:'', view:''}} as MoreInfoJourneyTripType;
        if ( flightType && flightType === BookingAppConstants.FLIGHT_SEARCH_TYPE.RETURN ) {
            trip.origin.city = this.travelInfo.destinationCity.description;
            trip.origin.code = this.travelInfo.destinationCity.code;
            trip.origin.view = this.travelInfo.destinationCity.description + ' (' + this.travelInfo.destinationCity.code + ')';
            trip.destination.city = this.travelInfo.originCity.description;
            trip.destination.code = this.travelInfo.originCity.code;
            trip.destination.view = this.travelInfo.originCity.description + ' (' + this.travelInfo.originCity.code + ')';
            trip.date = !this.isPaOpen ? this.BookingUtilService.getFormatedDate( tripData.dates.returnFlight, dateView ).formatedDate : '';
        } else {
            trip.origin.city = tripData.originCity.description;
            trip.origin.code = tripData.originCity.code;
            trip.origin.view = tripData.originCity.description + ' (' + tripData.originCity.code + ')';
            trip.destination.city = tripData.destinationCity.description;
            trip.destination.code = tripData.destinationCity.code;
            trip.destination.view = tripData.destinationCity.description + ' (' + tripData.destinationCity.code + ')';
            trip.date = !this.isPaOpen ? this.BookingUtilService.getFormatedDate( tripData.dates.outboundFlight, dateView ).formatedDate : '';
        }
        trip.type = flightType ? flightType : BookingAppConstants.FLIGHT_SEARCH_TYPE.MULTICITY;
        trip.formedInfo = trip.origin.view + ' - ' + trip.destination.view;
        return trip;
    };
  
    public close = () => {
        this.NgbActiveModal.close();
    };
    
    /**
     * Closes de modal and sets a falg in rootscope to let keepalive service that should  refresh all flow
     * after execute ignore order.
     */
    public controlFlow = ( refresh: boolean ): void => {
        this.rootScope.keepAliveRefreshFlow = refresh;
        this.UserActivityModalUtilsService.controlFlow();
        this.close();
    };
    
}
