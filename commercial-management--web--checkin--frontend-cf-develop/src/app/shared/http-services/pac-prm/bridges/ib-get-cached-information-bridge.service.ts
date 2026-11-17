import { InjectionToken } from '@angular/core';
import { GetCKICachedInformationService } from '@src/components/ib-reusable-components/ib-http-services/pac-prm/services/ib-get-cached-information-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSGetCKICachedInformationServiceToken = new InjectionToken<GetCKICachedInformationService>('GetCKICachedInformationService');
export const AJSGetCKICachedInformationServiceProvider = upgradeAJSServiceProvider( 'GetCKICachedInformationService', AJSGetCKICachedInformationServiceToken );

export interface AJSGetCKICachedInformationServiceType extends GetCKICachedInformationService {}
