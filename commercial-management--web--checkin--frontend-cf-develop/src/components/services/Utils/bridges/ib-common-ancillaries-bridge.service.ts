import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCommonsAncillariesServiceToken = new InjectionToken<any> ('CommonsAncillariesService');
export const AJSCommonsAncillariesServiceTokenProvider = upgradeAJSServiceProvider( 'CommonsAncillariesService', AJSCommonsAncillariesServiceToken );

export interface CommonsAncillariesServiceType {
    deleteAllAncillaries: ( deferredRecall?: any ) => ng.IPromise<any>;
    deleteAncillarie: ( request, deferredRecall?: any ) => angular.IPromise<any>;
    getAncillaries: ( recalDeferred?: any, locator?: string ) => angular.IPromise<any>;
    addLocator: ( endpoint: string, locator: string, deepLinkFlow ) => string;
    getInsurance: ( country, recalDeferred?: any ) => angular.IPromise<any>;
    getAncillarieSummary: ( deferredRecall?: any, isRefreshCall?: boolean, locator?: string ) => angular.IPromise<any>;
    updateAncillaries: ( ancillariesInfo: any, recalDeferred?: any ) => angular.IPromise<any>;
    deleteBundleService: ( deferredRecall?: any ) => ng.IPromise<any>;
}
