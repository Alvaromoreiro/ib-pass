import { InjectionToken } from '@angular/core';
import { IbBookingAvailabilityPageUtilsService } from './ib-booking-availability-page-utils-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSIbBookingAvailabilityPageService = new InjectionToken<IbBookingAvailabilityPageUtilsService>('IbBookingAvailabilityPageUtilsService');
export const AJSIbBookingAvailabilityPageServiceProvider = upgradeAJSServiceProvider('IbBookingAvailabilityPageUtilsService', AJSIbBookingAvailabilityPageService);
export interface IbBookingAvailabilityPageServiceType extends IbBookingAvailabilityPageUtilsService{ }
