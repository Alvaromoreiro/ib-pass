import { InjectionToken } from '@angular/core';
import { IbOriginDestinationInfoUtilsService } from '../../../../pages/ib-booking-availability-page/components/transformers/ib-origin-destination-info-utils-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSIbOriginDestinationInfoUtilsService = new InjectionToken<IbOriginDestinationInfoUtilsService>('IbOriginDestinationInfoUtilsService');
export const AJSIbOriginDestinationInfoUtilsServiceProvider = upgradeAJSServiceProvider('IbOriginDestinationInfoUtilsService', AJSIbOriginDestinationInfoUtilsService);
export interface AJSIbOriginDestinationInfoUtilsServiceType extends IbOriginDestinationInfoUtilsService { }
