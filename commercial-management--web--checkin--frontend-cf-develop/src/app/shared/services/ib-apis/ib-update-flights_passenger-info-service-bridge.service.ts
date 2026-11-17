import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSUpdateFlightsPassengerInfoService = new InjectionToken('UpdateFlightsPassengerInfoService');
export const AJSUpdateFlightsPassengerInfoServiceProvider = upgradeAJSServiceProvider('UpdateFlightsPassengerInfoService', AJSUpdateFlightsPassengerInfoService); 