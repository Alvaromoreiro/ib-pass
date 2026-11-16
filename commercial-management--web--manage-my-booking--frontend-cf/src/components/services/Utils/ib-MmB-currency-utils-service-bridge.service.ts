import { InjectionToken } from '@angular/core';
import { MmBCurrencyService } from './ib-MmB-currency-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCurrencyUtilsService = new InjectionToken<MmBCurrencyService>('MmBCurrencyService');
export const AJSCurrencyUtilsServiceProvider = upgradeAJSServiceProvider('MmBCurrencyService', AJSCurrencyUtilsService);
export interface AJSCurrencyUtilsServiceType extends MmBCurrencyService { }
