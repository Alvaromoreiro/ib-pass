import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSGetCountriesListService = new InjectionToken<GetCountriesListService>('GetCountriesListService');
export const AJSGetCountriesListServiceProvider = upgradeAJSServiceProvider('GetCountriesListService', AJSGetCountriesListService);
export interface AJSGetCountriesListServiceType extends GetCountriesListService {
    getCountriesList(promise?: any, isLoggedflow?: boolean, existAPIS?: boolean): angular.IPromise<any>| Promise<any>;
}
