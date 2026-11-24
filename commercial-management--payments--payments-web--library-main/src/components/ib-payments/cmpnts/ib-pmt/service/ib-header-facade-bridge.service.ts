import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSNewMainHeaderFacadeToken = new InjectionToken<any> ('NewMainHeaderFacade');
export const AJSNewMainHeaderFacadeProvider = upgradeAJSServiceProvider('NewMainHeaderFacade', AJSNewMainHeaderFacadeToken);