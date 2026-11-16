import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils'; 
export const AJSBookingUtilsService = new InjectionToken('BookingUtilService');
export const AJSBookingUtilsServiceProvider= upgradeAJSServiceProvider('BookingUtilService', AJSBookingUtilsService);
