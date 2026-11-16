import { InjectionToken } from '@angular/core';
import { MmBUtilService } from './ib-MmB-utils';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSMmbUtilService = new InjectionToken<MmBUtilService>('MmBUtilService');
export const AJSMmbUtilServiceProvider = upgradeAJSServiceProvider('MmBUtilService', AJSMmbUtilService);
export interface AJSMmbUtilServiceType extends MmBUtilService { }
