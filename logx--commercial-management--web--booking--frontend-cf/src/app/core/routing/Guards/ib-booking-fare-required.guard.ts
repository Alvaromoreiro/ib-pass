import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { BkiStorageConstants } from './ib-booking-route-preconditions.guard';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { RouterPathsConstants, getRedirectionPath } from '../../constants/ib-booking-router-paths-constants';
export const BookingFareRequiredGuardFn: CanActivateFn = (): boolean => {
    const storage: CommonsSessionStorageService  = inject(CommonsSessionStorageService);
    const redirectionService:BookingRedirectionService = inject(BookingRedirectionService);
    const fareData = storage.get(BkiStorageConstants.FARE);
    if(fareData === null) {
        redirectionService.path(getRedirectionPath(RouterPathsConstants.ibbkerror));
    }
    return fareData !== null;
};