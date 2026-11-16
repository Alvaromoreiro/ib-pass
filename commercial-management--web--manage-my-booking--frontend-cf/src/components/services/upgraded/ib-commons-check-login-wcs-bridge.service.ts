import { InjectionToken } from '@angular/core';
import { CommonsCheckLoginWCSService } from 'ib-web-commons/app/core/ib-login/services/ib-commons-check-login-wcs';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCommonsCheckLoginWCSService = new InjectionToken<CommonsCheckLoginWCSService>('CommonsCheckLoginWCSService');
export const AJSCommonsCheckLoginWCSServiceProvider = upgradeAJSServiceProvider('CommonsCheckLoginWCSService', AJSCommonsCheckLoginWCSService);
export interface AJSCommonsCheckLoginWCSServiceType extends CommonsCheckLoginWCSService { }