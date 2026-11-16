import { Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { UrlUtilsService } from '@shared/services/ib-utils/ib-booking-url-utils.service';
import { downgradeToAJSService } from 'ib-web-commons/utils';


@Injectable({
    providedIn: 'root'
})
export class IbBookingPetsFlowService {
    
    constructor (
        private UrlUtilsService: UrlUtilsService

    ) {}

    get isPetsFlow (): boolean {
        return this.UrlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT) === 'true';
    }
}


downgradeToAJSService('IbBookingPetsFlowService', IbBookingPetsFlowService, 'ib-header-seeker-module', ['ib-commons-modal-service-module', 'ib-commons-http-service-module', 'ib-booking-city-selector-module']);
