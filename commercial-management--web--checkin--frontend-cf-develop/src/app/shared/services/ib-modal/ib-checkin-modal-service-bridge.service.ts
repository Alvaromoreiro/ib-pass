import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
import { CommonsModalService } from 'ib-web-commons/app/core/ib-modal/services/ib-modal-service';
export const AJSCheckinModalService = new InjectionToken('CommonsModalService');
export const AJSCheckinModalServiceProvider = upgradeAJSServiceProvider('CommonsModalService', AJSCheckinModalService);
export interface CheckinModalServiceType extends CommonsModalService {
    showLoginErrorModal(errorObject, isModalBlocked, template, extraModalClass),
    showLoginModal(template, modelObject, animationEnabled, clss),
    showFilterModal(template, modelObject, animationEnabled, clss, controller, controllerAs),
    openInsuranceModal(modelObject, tpl),
    showITravelWarningModal(modelObject), showGenericDynamicModal(isModalBlocked, template, modelObject, controller),
    showBKIGenericModal(isModalBlocked, template, modelObject, extraModalClass),
    closeAllCurrentModals(),
    showBKISliceTimeLeftModal(timeLeft)
}

