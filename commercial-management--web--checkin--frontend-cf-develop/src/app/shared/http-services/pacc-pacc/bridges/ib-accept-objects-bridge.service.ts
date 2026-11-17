import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSAcceptObjectsPolicyServiceToken = new InjectionToken<any> ('AcceptObjectsPolicyService');
export const AJSAcceptObjectsPolicyServiceTokenProvider = upgradeAJSServiceProvider( 'AcceptObjectsPolicyService', AJSAcceptObjectsPolicyServiceToken );

export interface AcceptObjectsPolicyServiceType {
    acceptForbiddenObjectsPolicy: ( passengersInfo ) => angular.IPromise<unknown>;
}
