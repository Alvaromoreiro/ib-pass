import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';

export const AJSCheckForDeepLink = new InjectionToken<ICheckForDeepLink>('CheckForDeepLink');
export const AJSCheckForDeepLinkProvider = upgradeAJSServiceProvider('CheckForDeepLink', AJSCheckForDeepLink);

export interface ICheckForDeepLink {
    checkDeepLink(deepLinkData: CkiSegmentsSelected.IDeepLink): ng.IPromise<void>
}