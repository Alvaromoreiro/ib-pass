import { Inject, Injectable } from '@angular/core';
import { AJSBookingModalService, BookingModalServiceType } from '../../ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { IbBookingRetrieveOrderService } from '@src/app/shared/http-services/sse-orm/ib-booking-retrieve-order.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { getRedirectionPath, RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { TranslateService } from '@ngx-translate/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { HeaderCompleteOriginDestinationModel } from '@src/app/core/models/ib-booking-availability/header-model';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';

type PassengersCountStringType = {
    adult: string;
    senior: string;
    young: string;
    teenager: string;
    infant: string;
    child: string;
};

@Injectable()
export class UserActivityModalUtilsService {
    constructor (
        @Inject(AJSRootScope) private rootScope: CommonsRootScope,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        @Inject(AJSBookingUtilsService) private BookingUtilService,
        @Inject( WINDOW_TOKEN ) private window: Window,
        private TranslateService: TranslateService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsService,
        private BookingRedirectionService: BookingRedirectionService,
        private IbBookingRetrieveOrderService: IbBookingRetrieveOrderService
    ) {
    }
    
    public controlFlow = () => {
        const isOnHold: boolean = this.CommonsSessionStorageService.get( BkiStorageConstants.FLOW_APP ) === 'MMBOH';
        this.IbBookingPassengerInfoUtilsService.deleteTemporalPNR();
        if ( this.rootScope.keepAliveRefreshFlow ) {
            this.rootScope.keepAliveRefreshFlow = false;
            if ( isOnHold ) {
                this.retrieveOnHold();
            } else {
                this.redirectToURL();
            }
        } else {
            this.window.location.href = this.window.location.origin;
        }
    };
    
    private redirectToURL = () => {
        let redirectURL;
        const flashOffer = this.BookingUtilService.getURLFirstParameterByName( 'flashOffer' );
        const flashOfferId = this.BookingUtilService.getURLFirstParameterByName( 'flashOfferId' );
        if (flashOffer && flashOfferId) {
            redirectURL = this.window.location.pathname + this.window.location.search;
        } else {
            redirectURL = this.window.location.pathname + this.BookingUtilService.checkExistNewAvailabilitySearch();
            redirectURL = this.rootScope.isShuttleFlow === true ? redirectURL + '#!/ibshuttle' : redirectURL;
        }
        if (this.shouldReloadPage.call(this, redirectURL, flashOffer, flashOfferId)) {
            this.window.location.reload();
        } else {
            this.window.location.href = redirectURL;
        }
    };
    
    private shouldReloadPage = ( redirectURL: string, flashOffer: string | null, flashOfferId: string | null ): boolean => {
        return this.window.location.href === this.window.location.origin + redirectURL && !flashOffer && !flashOfferId;
    };
    
    private retrieveOnHold = () =>{
        const locator = this.CommonsSessionStorageService.get<string>( BkiStorageConstants.PNR );
        const surname = this.CommonsSessionStorageService.get<string>( BkiStorageConstants.SURNAME );
        this.IbBookingRetrieveOrderService.retrieveOrder( surname, locator ).then( ( response ) => {
            this.CommonsSessionStorageService.set( BkiStorageConstants.IMPORT_ORDER, response );
            this.BookingRedirectionService.path( getRedirectionPath( RouterPathsConstants.ohmtdt ) );
        }, ( error ) => {
            this.BookingModalService.finishWaiting();
            this.CommonsSessionStorageService.set( 'availabilityErrror', error );
            this.BookingRedirectionService.path( getRedirectionPath( RouterPathsConstants.ibbkerror ) );
        });
    };
    
    public setTravelInfoPassAvail = ( travelInfo: HeaderCompleteOriginDestinationModel ) => {
        const passengerList = [];
        const passengers: PassengersCountStringType = this.populatePassengerCounts( travelInfo );

        travelInfo.numAdults > 0 && passengerList.push( passengers.adult );
        travelInfo.numSeniors > 0 && passengerList.push( passengers.senior );
        travelInfo.numYoung > 0 && passengerList.push( passengers.young );
        travelInfo.numTeenager > 0 && passengerList.push( passengers.teenager );
        travelInfo.numChilds > 0 && passengerList.push( passengers.child );
        travelInfo.numInfant > 0 && passengerList.push( passengers.infant );

        return passengerList;
    };
    
    private populatePassengerCounts = ( travelInfo: HeaderCompleteOriginDestinationModel ): PassengersCountStringType => {
        const passengersCount = { adult: '', senior: '', young: '', teenager: '', infant: '', child: '' } as PassengersCountStringType;
        passengersCount.adult = this.getPassengerString( travelInfo.numAdults, BookingAppConstants.passengerTypesWithPlurals.adult );
        passengersCount.senior = this.getPassengerString( travelInfo.numSeniors, BookingAppConstants.passengerTypesWithPlurals.senior );
        passengersCount.young = this.getPassengerString( travelInfo.numYoung, BookingAppConstants.passengerTypesWithPlurals.young );
        passengersCount.teenager = this.getPassengerString( travelInfo.numTeenager, BookingAppConstants.passengerTypesWithPlurals.teenager );
        passengersCount.child = this.getPassengerString( travelInfo.numChilds, BookingAppConstants.passengerTypesWithPlurals.child );
        passengersCount.infant = this.getPassengerString( travelInfo.numInfant, BookingAppConstants.passengerTypesWithPlurals.infant );
        return passengersCount;
    };
    
    private getPassengerString = ( numPassengers: number, passengerType: string[] ): string => {
        return ( numPassengers === 1 ) ? numPassengers + ' ' + this.TranslateService.instant( passengerType[ 0 ] ) : numPassengers + ' ' + this.TranslateService.instant( passengerType[ 1 ] );
    };
  
}