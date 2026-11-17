import { InjectionToken } from '@angular/core';
import { CkiDatalayerUtilsService } from './ib-cki-datalayer-utils-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSDatalayerUtilsService = new InjectionToken<CkiDatalayerUtilsService>('CkiDatalayerUtilsService');
export const AJSDatalayerUtilsServiceProvider = upgradeAJSServiceProvider('CkiDatalayerUtilsService', AJSDatalayerUtilsService);
export interface AJSDatalayerUtilsServiceType extends CkiDatalayerUtilsService { }