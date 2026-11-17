import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSGetFrequentFlyersService = new InjectionToken<GetFrequentFlyersService>('GetFrequentFlyersService');
export const AJSGetFrequentFlyersServiceProvider = upgradeAJSServiceProvider('GetFrequentFlyersService', AJSGetFrequentFlyersService);
export interface AJSGetFrequentFlyersServiceType extends GetFrequentFlyersService { }