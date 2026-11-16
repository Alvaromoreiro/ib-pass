import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
import { BookingAvailabilityService } from './ib-booking-availability-service';
export const AJSBookingAvailabilityService = new InjectionToken('BookingAvailabilityService');
export const AJSBookingAvailabilityServiceProvider = upgradeAJSServiceProvider( 'BookingAvailabilityService', AJSBookingAvailabilityService );
export interface AJSBookingAvailabilityServiceType extends BookingAvailabilityService { }
