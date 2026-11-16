import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCabinTypesServiceToken = new InjectionToken<any> ('CabinTypesService');
export const AJSCabinTypesServiceProvider = upgradeAJSServiceProvider('CabinTypesService', AJSCabinTypesServiceToken);
export interface CabinTypesServiceType {
    getCabinTypes: () => ng.IPromise<any>
}
