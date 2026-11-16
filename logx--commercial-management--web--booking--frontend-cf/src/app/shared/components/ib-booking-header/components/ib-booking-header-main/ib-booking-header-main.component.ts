import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'ib-booking-header-main',
    templateUrl: './ib-booking-header-main.component.html',
    styleUrls: ['./ib-booking-header-main.component.scss']
})
export class IbBookingHeaderMainComponent {
    @Input() public model;
    @Input() public login;
    @Input() public advancedSearch;
    @Input() public numberTrips;
    @Input() public isHMad;
    @Output() seekerToggle = new EventEmitter<any>();
    @Output() backToMulti = new EventEmitter<boolean>();
    @Output() mainReturn = new EventEmitter<boolean>();
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
