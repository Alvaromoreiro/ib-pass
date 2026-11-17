import { InjectionToken } from '@angular/core';
import { CkiDigitalDataService } from './ib-cki-digital-data-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSDigitalDataService = new InjectionToken<CkiDigitalDataService>('CkiDigitalDataService');
export const AJSDigitalDataServiceProvider = upgradeAJSServiceProvider('CkiDigitalDataService', AJSDigitalDataService);
export interface AJSDigitalDataServiceType extends CkiDigitalDataService { }