import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils'; 
import { CommonsModalService } from 'ib-web-commons/dist/app/core/ib-modal/services/ib-modal-service';
export const AJSBookingModalService = new InjectionToken('BookingModalService');
export const AJSBookingModalServiceProvider = upgradeAJSServiceProvider('BookingModalService', AJSBookingModalService);
export interface BookingModalServiceType extends CommonsModalService {
    showLoginErrorModal(errorObject, isModalBlocked, template, extraModalClass),
    showLoginModal(template, modelObject, animationEnabled, clss),
    showFilterModal(template, modelObject, animationEnabled, clss, controller, controllerAs),
    openInsuranceModal(modelObject, tpl),
    showITravelWarningModal(modelObject), showGenericDynamicModal(isModalBlocked, template, modelObject, controller),
    showBKIGenericModal(isModalBlocked, template, modelObject, extraModalClass),
    closeAllCurrentModals(),
    showBKISliceTimeLeftModal ( timeLeft ),
    showKeepAliveModal ( genericModalObject, isModalBlocked, template, extraModalClass )
}

