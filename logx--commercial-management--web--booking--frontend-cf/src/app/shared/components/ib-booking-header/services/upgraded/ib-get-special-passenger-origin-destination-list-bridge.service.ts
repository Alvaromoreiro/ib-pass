import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSGetSpecialPassengerOriginDestinationListServiceToken = new InjectionToken<any> ('getSpecialPassengerOriginDestinationListService');
export const AJSGetSpecialPassengerOriginDestinationListServiceProvider = upgradeAJSServiceProvider('getSpecialPassengerOriginDestinationListService', AJSGetSpecialPassengerOriginDestinationListServiceToken);
export interface GetSpecialPassengerOriginDestinationListServiceType {
    getSpecialPassengerOriginDestinationList: ( passengerType: string ) => ng.IPromise<any>
}
