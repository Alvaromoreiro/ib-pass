import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils'; 
export const AJSBookingAvailabilityTransformer = new InjectionToken('BookingAvailabilityTransformer');
export const AJSBookingAvailabilityTransformerProvider = upgradeAJSServiceProvider('BookingAvailabilityTransformer', AJSBookingAvailabilityTransformer);