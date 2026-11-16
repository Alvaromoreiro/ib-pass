import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';

export const AJSModalServiceAncillariesToken = new InjectionToken<any>('ModalServiceAncillaries');
export const AJSModalServiceAncillariesProvider = upgradeAJSServiceProvider('ModalServiceAncillaries', AJSModalServiceAncillariesToken);
export interface ModalServiceAncillariesType {
    isNotWaiting: () => void;
    showGenericError: (errorObject: any, isModalBlocked?: any, template?: any) => any;
}
