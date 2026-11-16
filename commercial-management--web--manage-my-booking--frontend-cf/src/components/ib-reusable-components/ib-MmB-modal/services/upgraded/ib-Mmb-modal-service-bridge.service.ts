import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
import { CommonsModalService } from 'ib-web-commons/dist/app/core/ib-modal/services/ib-modal-service';
export const AJSMmbModalService = new InjectionToken('MmBModalService');
export const AJSMmbModalServiceProvider = upgradeAJSServiceProvider('MmBModalService', AJSMmbModalService);
export interface MmbModalServiceType{
    showGenericError(errorObject, isModalBlocked, template),
    showLoginErrorModal(errorObject, isModalBlocked, template),
    showModalError(evt, data),
    tryAgain(),
    showGenericModal(isModalBlocked, template, modelObject, windowClass),
    showGenericInfoModal(modelObject, isModalBlocked, template),
    showFlightReminderModal(isModalBlocked, template, modelObject, windowClass),
    showWidgetModal(template, modelObject, windowClass),
    showBookingNameModal(modelObject),
    showTransferWidgetModal(template, modelObject, windowClass),
    showWaitingModal(template, classTpl, background, modelObject),
    finishWaiting(),
    closeAllCurrentModals(),
    closeModal(),
    showLoginModal(template, modelObject, animationEnabled, clss),
    isError(modelObject, template, staticModal),
    getErrorCode(),
    setErrorCode(object),
    setErrorMessage(object),
    showPassengerModal(isModalBlocked, template, modelObject, windowClass),
    showInvoiceRequestModal(isModalBlocked, template, modelObject, windowClass),
    showEmptyBasketModal(),
    showFullModal(isModalBlocked, template, modelObject),
    showRefundContinueModal(isModalBlocked, template, modelObject),
    showVoluntaryChangeModal(isModalBlocked, template, modelObject, modalClass, controller, ctrl),
    showModalAssitanceVoucherEmail(isModalBlocked, template, modelObject, modalClass)
}
