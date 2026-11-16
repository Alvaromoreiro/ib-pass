import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSMonetateUtilsService = new InjectionToken('MonetateUtilsService');
export const AJSMonetateUtilsProvider = upgradeAJSServiceProvider('MonetateUtilsService', AJSMonetateUtilsService);