import { InjectionToken } from '@angular/core';
import { GetStatesListService } from 'ib-web-commons/app/core/http-services/rdu-loc/ib-get-states-list-service';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSGetStatesListService = new InjectionToken<GetStatesListService>('GetStatesListService');
export const AJSGetStatesListServiceProvider = upgradeAJSServiceProvider('GetStatesListService', AJSGetStatesListService);
export interface AJSGetStatesListServiceType extends GetStatesListService{
    getStatesList(country: string, promise?: any, isLoggedflow?: boolean): angular.IPromise<any>;
}
