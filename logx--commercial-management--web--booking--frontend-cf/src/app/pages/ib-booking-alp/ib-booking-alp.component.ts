import { Component } from '@angular/core';
import { getRedirectionPath, RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';


@Component({
    selector: 'ib-booking-alp',
    templateUrl:'./ib-booking-alp.component.html'
})
export class IbBookingAlpComponent {
    constructor (
        private readonly bookingRedirectionService: BookingRedirectionService
    ){}

    continueToNextStep (){
        this.bookingRedirectionService.path(getRedirectionPath(RouterPathsConstants.ibairp));
    }

    onErrorOcurred (){
        this.bookingRedirectionService.path( getRedirectionPath( RouterPathsConstants.ibairp ), { replaceUrl: true } );
    }
    
}
