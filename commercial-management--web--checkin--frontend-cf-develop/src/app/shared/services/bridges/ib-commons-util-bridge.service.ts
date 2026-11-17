import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';

export const AJSCommonsUtilService = new InjectionToken<CommonsUtilService>('CommonsUtilService');
export const AJSCommonsUtilServiceProvider = upgradeAJSServiceProvider('CommonsUtilService', AJSCommonsUtilService);