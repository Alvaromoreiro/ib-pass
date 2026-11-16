import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';

export const AJSBookingAncillariesServiceToken = new InjectionToken<any>('BookingAncillariesService');
export const AJSBookingAncillariesServiceProvider = upgradeAJSServiceProvider('BookingAncillariesService', AJSBookingAncillariesServiceToken);
export interface BookingAncillariesServiceType {
    countSeatsTotal: (orderItems: any) => any;
}
