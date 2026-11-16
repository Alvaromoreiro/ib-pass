import { Inject, Injectable, InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils'; 
const AJSCommonsHttpUtilService = new InjectionToken('CommonsHttpUtilService');
export const AJSCommonsHttpUtilServiceProvider = upgradeAJSServiceProvider('CommonsHttpUtilService', AJSCommonsHttpUtilService);

@Injectable({providedIn: 'root'})
export class MmbHttpUtilsService  {
    constructor (
        @Inject(AJSCommonsHttpUtilService) private AJSCommonsHttpUtilService
    ){}

    public refreshToken = async () => {
        return this.AJSCommonsHttpUtilService.refreshToken();
    };
}
