import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSComponentUtilsToken = new InjectionToken<any> ('ComponentUtils');
export const AJSComponentUtilsTokenProvider = upgradeAJSServiceProvider( 'ComponentUtils', AJSComponentUtilsToken );

export interface IComponentUtils {
    equalHeight: (e: any, reload: any) => void,
    resizeHeightListElements: (element: any) => void,
    get_parents: (el: any, fn: any) => any,
    fadeIn: (el: any) => void,
    fadeOut: (el: any) => void,
    initAddOn: () => void
}