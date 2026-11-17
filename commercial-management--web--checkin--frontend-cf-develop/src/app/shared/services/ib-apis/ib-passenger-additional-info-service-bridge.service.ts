import { InjectionToken } from '@angular/core';
import { PassengerAdditionalInfoService } from '@src/components/ib-reusable-components/ib-http-services/pacc-pacc/services/ib-passenger-additional-info-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSPassengerAdditionalInfoService = new InjectionToken<PassengerAdditionalInfoService>('PassengerAdditionalInfoService');
export const AJSPassengerAdditionalInfoServiceProvider = upgradeAJSServiceProvider('PassengerAdditionalInfoService', AJSPassengerAdditionalInfoService);
export interface AJSPassengerAdditionalInfoServiceType extends PassengerAdditionalInfoService { }