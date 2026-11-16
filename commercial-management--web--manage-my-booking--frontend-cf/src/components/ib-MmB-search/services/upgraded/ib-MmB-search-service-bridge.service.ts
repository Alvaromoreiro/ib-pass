import { InjectionToken } from '@angular/core';
import { MmBSearchService } from '../ib-MmB-search-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSMmBSearchService = new InjectionToken<MmBSearchService>('MmBSearchService');
export const AJSMmBSearchServiceProvider = upgradeAJSServiceProvider('MmBSearchService', AJSMmBSearchService);
export interface AJSMmBSearchServiceType extends MmBSearchService { }
