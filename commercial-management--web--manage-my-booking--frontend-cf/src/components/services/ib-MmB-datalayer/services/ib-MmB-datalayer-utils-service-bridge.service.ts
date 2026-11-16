import { InjectionToken } from '@angular/core';
import { MmBDatalayerUtilsService } from './ib-MmB-datalayer-utils-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSMmBDatalayerUtilsService = new InjectionToken<MmBDatalayerUtilsService>('MmBDatalayerUtilsService');
export const AJSMmBDatalayerUtilsServiceProvider = upgradeAJSServiceProvider('MmBDatalayerUtilsService', AJSMmBDatalayerUtilsService);
export interface AJSMmBDatalayerUtilsServiceType extends MmBDatalayerUtilsService { }