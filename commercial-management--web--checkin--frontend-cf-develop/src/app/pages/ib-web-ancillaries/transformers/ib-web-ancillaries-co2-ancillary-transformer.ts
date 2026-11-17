import * as angular from 'angular';
import { TransformedAncillariesInfo } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer.model';

/**
 * CO2_FOOTPRINT-ancillary handling extracted from AncillariesTransformer's
 * transformAncillariesView dispatch table
 */
export class Co2FootprintAncillaryTransformer {
    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CurrencyService: CurrencyService
    ) {}

    handleCo2FootprintAncillarie = (ancillarie: any, transformedInfo: TransformedAncillariesInfo): void => {
        const summaryInfo: any = this.localStorageService.get('summaryInfo');
        const purchased = summaryInfo && summaryInfo.issuedItems.some((e) => e.type === this.CheckinAncillariesConstants.TYPE_ANCILLARIE.CO2_FOOTPRINT);
        if (ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE && !purchased) {
            transformedInfo.ancillariesAvailable.push(ancillarie.type);
            transformedInfo.ancillariesCarbonFootprint = {
                price: ancillarie.price,
                priceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, ancillarie.price, true, false),
                priceFrom: this.CurrencyService.formatPrice(transformedInfo.currency, ancillarie.price, true, false),
                kilosCo2Equivalent: ancillarie.kilosCo2Equivalent,
                kilosCo2EquivalentFormatted: ancillarie.kilosCo2Equivalent
                    ? ancillarie.kilosCo2Equivalent.toString().replace('.', ',')
                    : '',
                confirmed: false
            };
            this.localStorageService.set('co2Footprint', transformedInfo.ancillariesCarbonFootprint);
        }
    };
}

Co2FootprintAncillaryTransformer.$inject = ['CheckinAncillariesConstants', 'localStorageService', 'CurrencyService'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('Co2FootprintAncillaryTransformer', Co2FootprintAncillaryTransformer);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('Co2FootprintAncillaryTransformer', Co2FootprintAncillaryTransformer);
}
