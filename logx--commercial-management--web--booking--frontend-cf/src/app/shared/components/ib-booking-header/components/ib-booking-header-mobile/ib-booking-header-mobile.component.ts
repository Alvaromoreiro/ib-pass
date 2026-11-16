import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { HeaderStep } from '@src/app/core/models/ib-booking-availability/header-model';

@Component({
    selector: 'ib-booking-header-mobile',
    templateUrl: './ib-booking-header-mobile.component.html',
    styleUrls: ['./ib-booking-header-mobile.component.scss']
})
export class IbBookingHeaderMobileComponent implements OnInit {
    @Input() public currentStep: HeaderStep;
    @Input() public model;
    @Input() public login;
    @Input() public advancedSearch;
    @Input() public numberTrips;
    @Output() seekerToggle = new EventEmitter<any>();
    @Output() backToMulti = new EventEmitter<boolean>();
    @Output() mainReturn = new EventEmitter<boolean>();
    public iconsPath: string = BookingAppConstants.iconsRoute;
    public isMobile: boolean = true;

    constructor (
    ) { }
    ngOnInit () {
        this.isMobile = true;
    }
    public toggleSeeker ( ) {
        this.seekerToggle.emit( );
    }
    public multiCityBack ( event ) {
        this.backToMulti.emit( event );
    }
    public returnToMain ( event ) {
        this.mainReturn.emit( event );
    }
}
