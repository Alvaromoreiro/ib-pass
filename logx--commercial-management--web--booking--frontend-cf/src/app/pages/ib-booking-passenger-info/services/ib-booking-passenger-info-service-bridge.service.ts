import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';

export const AJSBookingPassengerInfoService = new InjectionToken('BookingPassengerInfoService');
export const AJSBookingPassengerInfoServiceProvider = upgradeAJSServiceProvider('BookingPassengerInfoService', AJSBookingPassengerInfoService);

export interface BookingPassengerInfoServiceType  {
    showGender ( requiredFields: any ): boolean;
    recoverUserName ( mail: any ): Promise<any>;
    getDPCookieParameter ();
}

