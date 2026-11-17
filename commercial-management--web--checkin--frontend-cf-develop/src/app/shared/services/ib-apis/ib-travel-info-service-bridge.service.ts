import { InjectionToken } from '@angular/core';
import { TravelInfoService } from '@src/components/ib-reusable-components/ib-http-services/cust-cust/services/ib-travel-info-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSTravelInfoService = new InjectionToken<TravelInfoService>('TravelInfoService');
export const AJSTravelInfoServiceProvider = upgradeAJSServiceProvider('TravelInfoService', AJSTravelInfoService);
export interface AJSTravelInfoServiceType extends TravelInfoService { }