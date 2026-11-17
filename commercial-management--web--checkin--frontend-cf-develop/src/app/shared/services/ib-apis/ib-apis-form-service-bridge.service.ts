import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSApisFormService = new InjectionToken('ApisFormService');
export const AJSApisFormServiceProvider = upgradeAJSServiceProvider('ApisFormService', AJSApisFormService); 