import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSCheckPaymentsServiceToken = new InjectionToken<any> ('CheckPaymentsService');
export const AJSCheckPaymentsServiceTokenProvider = upgradeAJSServiceProvider( 'CheckPaymentsService', AJSCheckPaymentsServiceToken );

export interface CheckPaymentsServiceType {
    checkPayments: () => void;
    goToIbcose: () => void;
}
