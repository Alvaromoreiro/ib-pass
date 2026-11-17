import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
import { IPromise } from 'angular';
export const AJSModalService = new InjectionToken('ModalService');
export const AJSModalServiceProvider = upgradeAJSServiceProvider('ModalService', AJSModalService);
export interface NavigationErrorModalConfig {
    title: {
        message: string;
        needsTranslate: boolean;
    };
    needsTranslate: boolean;
    message: string;
}
export interface AJSModalServiceType {
    setErrorMessage(message: any): void;
    setErrorCode(internalErrorCode: any): void;
    isError(modelObject, template?, staticModal?): unknown;
    showGenericModal: ( modelObject, isModalBlocked, template? ) => { result: IPromise<any>};
    showGenericError: ( errorObject, isModalBlocked, template? ) => { result: IPromise<any>};
    openNavigationErrorModal: ( modalObject: NavigationErrorModalConfig, isModalBlocked: boolean ) => { result: IPromise<unknown> };
    isNotWaiting: () => void;
    openSplitModal: ( size, tpl, anim, newPnrInput ) => any;
    finishWaiting: () => void;
    isWaiting: () => void;
    closeAllCurrentModals: () => void;
}
