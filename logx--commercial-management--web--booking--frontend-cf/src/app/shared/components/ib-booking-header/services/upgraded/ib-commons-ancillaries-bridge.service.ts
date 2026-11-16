import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCommonsAncillariesServiceToken = new InjectionToken<any> ('CommonsAncillariesService');
export const AJSCommonsAncillariesServiceProvider = upgradeAJSServiceProvider('CommonsAncillariesService', AJSCommonsAncillariesServiceToken);
export interface CommonsAncillariesServiceType {
    getCabinTypes: () => ng.IPromise<any>;
    updateAncillaries: (ancillariesInfo: any, recalDeferred?: any) => angular.IPromise<any>;
}
