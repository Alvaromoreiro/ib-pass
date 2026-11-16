import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
import { IbBookingAvailabilityUtilsService } from './ib-booking-availability-utils-service';

export const AJSIbBookingAvailabilityUtilsService = new InjectionToken('IbBookingAvailabilityUtilsService');
export const AJSIbBookingAvailabilityUtilsServiceProvider = upgradeAJSServiceProvider('IbBookingAvailabilityUtilsService', AJSIbBookingAvailabilityUtilsService);
export interface AJSIbBookingAvailabilityUtilsServiceType extends IbBookingAvailabilityUtilsService {}
