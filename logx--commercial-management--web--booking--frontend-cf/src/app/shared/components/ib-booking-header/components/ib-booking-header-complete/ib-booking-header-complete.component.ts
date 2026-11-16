import { Component, Input, Output, EventEmitter, Inject, HostListener, OnChanges } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSRootScope } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-header-complete',
    templateUrl: './ib-booking-header-complete.component.html',
    styleUrls: ['./ib-booking-header-complete.component.scss']
} )

export class IbBookingHeaderCompleteComponent implements OnChanges{
    @Input() public model;
    @Input() public showPassengersInfo;
    @Input() public numberTrips;
    @Input() public login;
    @Input() public isHMad;
    public isShuttleFlow: boolean;
    public isMobile: boolean;
    @Output() activeSeeker = new EventEmitter<boolean>();
    @Output() multicityReturn = new EventEmitter<boolean>();
    @Output() mainReturn = new EventEmitter<boolean>();
    public iconsPath: string = BookingAppConstants.iconsRoute;
    public profileIcon: boolean = false;
    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope
    ) { }
    ngOnChanges (): void {
        this.isShuttleFlow = this.model?.flightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN;
        this.onResize();
    }
    backToMain = ( backToMain ) => {
        this.mainReturn.emit( backToMain );
    };
    backToMultiFlight = ( goToHome ) => {
        this.multicityReturn.emit( goToHome );
    };
    activeAdvancedSearch = ( ) => {
        this.activeSeeker.emit( );
    };
    @HostListener( 'window:resize', ['$event'] )
        onResize = () => {
            this.isMobile = this.rootScope.isMobile.general;
        };
}
