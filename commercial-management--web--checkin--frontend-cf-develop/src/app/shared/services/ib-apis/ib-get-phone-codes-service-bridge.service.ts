import { InjectionToken } from '@angular/core';
import { GetPhoneCodesService } from 'ib-web-commons/http-services';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSGetPhoneCodesService = new InjectionToken<GetPhoneCodesService>('GetPhoneCodesService');
export const AJSGetPhoneCodesServiceProvider = upgradeAJSServiceProvider('GetPhoneCodesService', AJSGetPhoneCodesService);
export interface AJSGetPhoneCodesServiceType extends GetPhoneCodesService {
    getPhoneCodesList(): any;
}
