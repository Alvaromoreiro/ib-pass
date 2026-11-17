import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
import { UpgradingAncillariesResponse } from '@src/app/shared/services/ib-upgrading/models/ib-upgrading-ancillary-to-upgrade-info-mapper.model';
 
export const AJSCallAncillariesServiceToken =
    new InjectionToken<CallAncillariesServiceType>('CallAncillariesService');
 
export const AJSCallAncillariesServiceTokenProvider =
    upgradeAJSServiceProvider('CallAncillariesService', AJSCallAncillariesServiceToken);
 
export interface CallAncillariesServiceType {
    getUpgradingAncillarie: () => Promise<UpgradingAncillariesResponse>;
}