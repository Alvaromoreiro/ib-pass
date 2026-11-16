import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSIbCPermanentUserService = new InjectionToken<any> ('IbCPermanentUserService');
export const AJSIbCPermanentUserServiceProvider = upgradeAJSServiceProvider('IbCPermanentUserService', AJSIbCPermanentUserService);
export interface IbCPermanentUserServiceType {

    checkPermanentUserFlow: (flow?: string)=> Promise<void>,
    isAfterLoginPermanentUser: () => boolean,
    isAfterLoginBidsPermanentUser: () => boolean,
    removeParamsAfterLogin: () => void
}
