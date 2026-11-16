import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCommonsGetLoginInfoService = new InjectionToken<any> ('CommonsGetLoginInfoService');
export const AJSCommonsGetLoginInfoServiceProvider = upgradeAJSServiceProvider('CommonsGetLoginInfoService', AJSCommonsGetLoginInfoService);
export interface CommonsGetLoginInfoServiceType {
    setAPIFunctions: ( functions ) => void,
    checkCustomerStatus: (isAnonymous?: boolean) => angular.IPromise<any>,
    showChangeStatusModal: () => void,
    changePageToPermanent: ()=> void
}
