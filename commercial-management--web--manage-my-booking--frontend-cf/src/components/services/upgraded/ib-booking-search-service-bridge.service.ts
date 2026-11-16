import { InjectionToken } from '@angular/core';
import { BookingSearchService } from '../ib-booking-search-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSBookingSearchService = new InjectionToken<BookingSearchService>('BookingSearchService');
export const AJSBookingSearchServiceProvider = upgradeAJSServiceProvider('BookingSearchService', AJSBookingSearchService);
export interface AJSBookingSearchServiceType extends BookingSearchService { }
