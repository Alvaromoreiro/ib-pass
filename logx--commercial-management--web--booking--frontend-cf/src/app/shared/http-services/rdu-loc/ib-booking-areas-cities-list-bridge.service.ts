import { InjectionToken } from '@angular/core';
import { GetDestinationsService } from 'ib-web-commons/app/core/http-services/rdu-loc/ib-get-destination-areas-cities-list-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSGetDestinationsService = new InjectionToken('GetDestinationsService');
export const AJSGetDestinationsServiceProvider = upgradeAJSServiceProvider( 'GetDestinationsService', AJSGetDestinationsService );
export interface AJSGetDestinationsServiceType extends GetDestinationsService { }
