import { InjectionToken } from '@angular/core';
import { DatalayerBKIService } from './ib-datalayer-bki-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSDatalayerBKIService = new InjectionToken<DatalayerBKIService>('DatalayerBKIService');
export const AJSDatalayerBKIServiceProvider = upgradeAJSServiceProvider('DatalayerBKIService', AJSDatalayerBKIService);
export interface AJSDatalayerBKIServiceType extends DatalayerBKIService { }