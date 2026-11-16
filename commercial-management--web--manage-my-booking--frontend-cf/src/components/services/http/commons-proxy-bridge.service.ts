import { InjectionToken } from '@angular/core';
import { CommonsGenericProxy } from 'ib-web-commons/app/core/proxies/ib-commons-generic-proxy';
import { CommonsNewHttpUtilsErrorService } from 'ib-web-commons/app/core/utils/http-utils-services/ib-commons-new-http-utils-error-service';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/app/core/http-services/errors/ib-commons-http-error-handler.service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCommonsGenericProxyService = new InjectionToken<CommonsGenericProxy>('CommonsGenericProxy');
export const AJSCommonsGenericProxyProvider = upgradeAJSServiceProvider('CommonsGenericProxy', AJSCommonsGenericProxyService);
export const AJSCommonsNewHttpUtilsErrorService = new InjectionToken<CommonsNewHttpUtilsErrorService>('CommonsNewHttpUtilsErrorService');
export const AJSCommonsNewHttpUtilsErrorProvider = upgradeAJSServiceProvider('CommonsNewHttpUtilsErrorService', AJSCommonsNewHttpUtilsErrorService);
export interface AJSCommonsGenericProxyServiceType extends CommonsGenericProxy { }
export interface AJSCommonsNewHttpUtilsErrorServiceType extends CommonsNewHttpUtilsErrorService { }
export interface AJSIbCHttpErrorHandlerServiceType extends IbCHttpErrorHandlerService { }
