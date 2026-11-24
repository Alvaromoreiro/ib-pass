import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import * as angular from 'angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class UpgradingUtilService {
    constructor (private translateService: TranslateService) {}

    getSummaryText (totalAviosAmountFormatted, totalAviosAmount, numberFreeUpgrade) {
        const aviosTranslate = `${totalAviosAmountFormatted} ${this.translateService.instant('AVIOS_TEXT')}`;
        const upgradingTranslate = `${numberFreeUpgrade} ${this.translateService.instant(
            numberFreeUpgrade === 1
                ? 'MMB_UPGRADING_AVIOS_SINGULAR_UPGRADE'
                : 'MMB_UPGRADING_AVIOS_PLURAL_UPGRADES'
        )}`;
        let summary = `${aviosTranslate}`;

        if (totalAviosAmount !== 0 && numberFreeUpgrade) {
            summary = `${aviosTranslate} + ${upgradingTranslate}`;
        }

        if (totalAviosAmount === 0 && numberFreeUpgrade) {
            summary = `${upgradingTranslate}`;
        }
        return summary;
    }

    getSummaryTextByBid (
        onHoldInfo,
        isMMBBID_AVIOS,
        bidsAvailable,
        totalPriceFormatted,
        totalAviosAmount,
        numberFreeUpgrade
    ) {
        const aviosTranslate = `${totalPriceFormatted} ${this.translateService.instant('AVIOS_TEXT')}`;
        const upgradingTranslate = `${numberFreeUpgrade} ${this.translateService.instant(
            numberFreeUpgrade === 1
                ? 'MMB_UPGRADING_AVIOS_SINGULAR_UPGRADE'
                : 'MMB_UPGRADING_AVIOS_PLURAL_UPGRADES'
        )}`;
        let summary = `${totalPriceFormatted}`;
        if (onHoldInfo) {
            summary = onHoldInfo.priceAfterOnHold;
        }
        if (isMMBBID_AVIOS && totalAviosAmount !== 0 && !numberFreeUpgrade) {
            summary = `${aviosTranslate}`;
        }
        if (isMMBBID_AVIOS && totalAviosAmount === 0 && numberFreeUpgrade) {
            summary = `${upgradingTranslate}`;
        }
        if (isMMBBID_AVIOS && totalAviosAmount !== 0 && numberFreeUpgrade) {
            summary = `${aviosTranslate} + ${upgradingTranslate}`;
        }
        if (bidsAvailable && !isMMBBID_AVIOS && totalAviosAmount && totalAviosAmount !== 0 && numberFreeUpgrade) {
            summary = `${totalPriceFormatted} + ${aviosTranslate} + ${upgradingTranslate}`;
        }
        if (bidsAvailable && !isMMBBID_AVIOS && totalAviosAmount && totalAviosAmount !== 0 && !numberFreeUpgrade) {
            summary = `${totalPriceFormatted} + ${aviosTranslate}`;
        }
        if (bidsAvailable && !isMMBBID_AVIOS && (!totalAviosAmount || totalAviosAmount === 0) && numberFreeUpgrade) {
            summary = `${totalPriceFormatted} + ${upgradingTranslate}`;
        }
        return summary;
    }
}

try {
    angular
        .module('ib-pmt-services-http-module')
        .service('UpgradingUtilService', downgradeInjectable(UpgradingUtilService));
} catch {
    angular
        .module('ib-pmt-services-http-module', [])
        .service('UpgradingUtilService', downgradeInjectable(UpgradingUtilService));
}
