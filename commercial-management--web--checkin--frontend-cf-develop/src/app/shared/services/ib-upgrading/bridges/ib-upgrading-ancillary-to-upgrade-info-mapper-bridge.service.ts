import { InjectionToken } from '@angular/core';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
import { UpgradingAncillaryToUpgradeInfoMapperServiceType } from '../models/ib-upgrading-ancillary-to-upgrade-info-mapper.model';
 
export const AJSUpgradingAncillaryToUpgradeInfoMapperServiceToken =
    new InjectionToken<UpgradingAncillaryToUpgradeInfoMapperServiceType>('UpgradingAncillaryToUpgradeInfoMapperService');
 
export const AJSUpgradingAncillaryToUpgradeInfoMapperServiceTokenProvider =
    upgradeAJSServiceProvider(
        'UpgradingAncillaryToUpgradeInfoMapperService',
        AJSUpgradingAncillaryToUpgradeInfoMapperServiceToken
    );