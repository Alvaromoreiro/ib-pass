import { InjectionToken } from '@angular/core';
import { DatalayerUtilsService } from './ib-datalayer-utils-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSDatalayerUtilsService = new InjectionToken<DatalayerUtilsService>('DatalayerUtilsService');
export const AJSDatalayerUtilsServiceProvider = upgradeAJSServiceProvider('DatalayerUtilsService', AJSDatalayerUtilsService);
export interface AJSDatalayerUtilsServiceType extends DatalayerUtilsService { }