import { Component, Input, Inject, OnInit } from '@angular/core';
import { ShoppingBasketTotal, ShoppingBasketTrip } from '@src/app/core/models/ib-booking-availability/header-model';
import { AJSRootScope } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-header-basket-trips',
    templateUrl: './ib-booking-header-basket-trips.component.html',
    styleUrls: ['./ib-booking-header-basket-trips.component.scss']
})
export class IbBookingHeaderBasketTripsComponent implements OnInit {
    @Input() public model: ShoppingBasketTrip[];
    @Input() public totalTrips: ShoppingBasketTotal;
    public isONB: boolean = false;

    constructor (
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope
    ) { }

    ngOnInit (): void {
        this.isONB = this.rootScope.isPointsOBFlow || false;
    }

}
