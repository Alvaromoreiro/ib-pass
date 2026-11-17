import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCheckAncillariesServiceToken = new InjectionToken<any> ('CheckAncillariesService');
export const AJSCheckAncillariesServiceTokenProvider = upgradeAJSServiceProvider( 'CheckAncillariesService', AJSCheckAncillariesServiceToken );

export interface CheckAncillariesServiceType {
    checkAncillaries: () => angular.IPromise<unknown>;
}
