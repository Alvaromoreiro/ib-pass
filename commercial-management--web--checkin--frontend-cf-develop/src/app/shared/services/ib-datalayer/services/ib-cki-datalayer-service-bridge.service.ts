import { InjectionToken } from '@angular/core';
import { CkiDataLayerService } from './ib-cki-datalayer-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSDatalayerService = new InjectionToken<CkiDataLayerService>('CkiDataLayerService');
export const AJSDatalayerServiceProvider = upgradeAJSServiceProvider('CkiDataLayerService', AJSDatalayerService);
export interface AJSDatalayerServiceType extends CkiDataLayerService { }