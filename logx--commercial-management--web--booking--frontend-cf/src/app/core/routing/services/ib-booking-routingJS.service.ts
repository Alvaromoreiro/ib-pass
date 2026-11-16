import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { BookingNavigationService } from '@shared/services/ib-utils/ib-booking-navigation.service';

@Injectable({ providedIn: 'root' })
export class IbBookingRoutingAJS {

    constructor (
        private BookingNavigationService: BookingNavigationService
    ){}
    public reload = ()=> {
        const currentUrl = this.BookingNavigationService.currentURL;
        this.BookingNavigationService.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.BookingNavigationService.navigateTo(currentUrl);
        });
    };
}

downgradeToAJSService('$route', IbBookingRoutingAJS, 'ib-booking-routing-module', []);
