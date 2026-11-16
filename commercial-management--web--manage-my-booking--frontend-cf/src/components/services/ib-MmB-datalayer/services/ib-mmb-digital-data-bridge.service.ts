import { InjectionToken } from '@angular/core';
import { MmBDigitalDataService } from './ib-MmB-digital-data-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSMmBDigitalDataService = new InjectionToken<MmBDigitalDataService>('MmBDigitalDataService');
export const AJSMmBDigitalDataServiceProvider = upgradeAJSServiceProvider('MmBDigitalDataService', AJSMmBDigitalDataService);
export interface AJSMmBDigitalDataServiceType extends MmBDigitalDataService { }