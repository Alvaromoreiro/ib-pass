import * as angular from 'angular';
import {
    CurrencyInfo,
    LegacyOfferSegmentClass,
    LegacyUpgradeInfo,
    LegacyUpgradeOffer,
    UpgradingAncillariesResponse,
    UpgradingAncillary,
    UpgradingAncillaryToUpgradeInfoMapperServiceType,
    UpgradingOffer,
    UpgradingOfferSegmentClass
} from '../models/ib-upgrading-ancillary-to-upgrade-info-mapper.model';
 
export class UpgradingAncillaryToUpgradeInfoMapperService implements UpgradingAncillaryToUpgradeInfoMapperServiceType {
    map = (upgradingAncillarieResponse: UpgradingAncillariesResponse | null | undefined): LegacyUpgradeInfo | null => {
        const upgradingInfo = this.getAvailableUpgrading(upgradingAncillarieResponse);
 
        return upgradingInfo
            ? this.mapToAcceptUpgradingModel(upgradingAncillarieResponse, upgradingInfo)
            : null;
    };
 
    private getAvailableUpgrading (upgradingAncillarieResponse: UpgradingAncillariesResponse | null | undefined): UpgradingAncillary | undefined {
        return this.getAncillaries(upgradingAncillarieResponse)
            .find((ancillary) => this.isAvailableUpgrading(ancillary));
    }
 
    private getAncillaries (upgradingAncillarieResponse: UpgradingAncillariesResponse | null | undefined): UpgradingAncillary[] {
        return upgradingAncillarieResponse && Array.isArray(upgradingAncillarieResponse.ancillaries)
            ? upgradingAncillarieResponse.ancillaries
            : [];
    }
 
    private isAvailableUpgrading (ancillary: UpgradingAncillary): boolean {
        return this.isUpgrading(ancillary) &&
            this.isAvailable(ancillary) &&
            this.hasOffers(ancillary);
    }
 
    private isUpgrading (ancillary: UpgradingAncillary): boolean {
        return !!ancillary && ancillary.type === 'UPGRADING';
    }
 
    private isAvailable (ancillary: UpgradingAncillary): boolean {
        return !!ancillary &&
            !!ancillary.status &&
            ancillary.status.code === 'AVAILABLE';
    }
 
    private hasOffers (ancillary: UpgradingAncillary): boolean {
        return !!ancillary &&
            Array.isArray(ancillary.offers) &&
            ancillary.offers.length > 0;
    }
 
    private mapToAcceptUpgradingModel (
        upgradingAncillarieResponse: UpgradingAncillariesResponse | null | undefined,
        upgradingInfo: UpgradingAncillary
    ): LegacyUpgradeInfo {
        return {
            ...angular.copy(upgradingInfo),
            currency: this.getCurrencyObject(upgradingAncillarieResponse, upgradingInfo.currency),
            offers: this.getLegacyOffers(upgradingInfo.offers)
        };
    }
 
    private getCurrencyObject (
        upgradingAncillarieResponse: UpgradingAncillariesResponse | null | undefined,
        currency: string | CurrencyInfo | undefined
    ): CurrencyInfo | string | undefined {
        if (!currency || typeof currency !== 'string') {
            return currency;
        }
 
        return this.getCurrencies(upgradingAncillarieResponse)
            .find((currentCurrency) => currentCurrency.code === currency) || currency;
    }
 
    private getCurrencies (upgradingAncillarieResponse: UpgradingAncillariesResponse | null | undefined): CurrencyInfo[] {
        return upgradingAncillarieResponse && Array.isArray(upgradingAncillarieResponse.currencies)
            ? upgradingAncillarieResponse.currencies
            : [];
    }
 
    private getLegacyOffers (offers: UpgradingOffer[] = []): LegacyUpgradeOffer[] {
        return offers.map((offer) => {
            const legacyOffer = angular.copy(offer);
            const offerSegmentClasses = this.getOfferSegmentClasses(legacyOffer);
 
            delete legacyOffer.offerSegmentsClass;
            delete legacyOffer.offerSegmentClasses;
 
            return {
                ...legacyOffer,
                offerSegmentClasses: this.getLegacyOfferSegmentClasses(offerSegmentClasses)
            };
        });
    }
 
    private getOfferSegmentClasses (offer: UpgradingOffer): UpgradingOfferSegmentClass[] {
        return offer.offerSegmentClasses || offer.offerSegmentsClass || [];
    }
 
    private getLegacyOfferSegmentClasses (offerSegmentClasses: UpgradingOfferSegmentClass[] = []): LegacyOfferSegmentClass[] {
        return offerSegmentClasses
            .filter((offerSegmentClass) => !!offerSegmentClass)
            .map((offerSegmentClass) => {
                const legacyOfferSegmentClass = angular.copy(offerSegmentClass);
 
                delete legacyOfferSegmentClass.segmentId;
 
                return {
                    ...legacyOfferSegmentClass,
                    segment: this.getSegment(offerSegmentClass)
                };
            });
    }
 
    private getSegment (offerSegmentClass: UpgradingOfferSegmentClass): string | number | undefined {
        const segment = offerSegmentClass.segment !== undefined
            ? offerSegmentClass.segment
            : offerSegmentClass.segmentId;
 
        const numericSegment = Number(segment);
 
        return isNaN(numericSegment) ? segment : numericSegment;
    }
}
 
UpgradingAncillaryToUpgradeInfoMapperService.$inject = [];
 
angular
    .module('ib-shared-services-module')
    .service('UpgradingAncillaryToUpgradeInfoMapperService', UpgradingAncillaryToUpgradeInfoMapperService);