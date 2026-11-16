import {Injectable } from '@angular/core';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { RouterPathsConstants, getRedirectionPath } from '@src/app/core/constants/ib-booking-router-paths-constants';
@Injectable()
export class IbBookingRecapPageService {
    constructor (
        private BookingRedirectionService: BookingRedirectionService
    ) {}

    public redirectToNextStep = ( ) => {
        this.BookingRedirectionService.path(getRedirectionPath(RouterPathsConstants.ibpbah));
    };
}