import { InjectionToken } from '@angular/core';
import { CommonsGenericProxy } from 'ib-web-commons/app/core/proxies/ib-commons-generic-proxy';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCommonsGenericProxyService = new InjectionToken<CommonsGenericProxy>('CommonsGenericProxy');
export const AJSCommonsGenericProxyProvider = upgradeAJSServiceProvider('CommonsGenericProxy', AJSCommonsGenericProxyService);
export interface AJSCommonsGenericProxyServiceType extends CommonsGenericProxy { }