import * as angular from 'angular';
import { TransformedAncillariesInfo } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer.model';

/**
 * GLOBICK-ancillary handling extracted from AncillariesTransformer's transformAncillariesView
 * dispatch table
 */
export class GlobickAncillaryTransformer {
    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CurrencyService: CurrencyService
    ) {}

    handleGlobickAncillarie = (ancillarie: any, transformedInfo: TransformedAncillariesInfo): void => {
        const transfer = ancillarie.subTypes.find((subtype) => subtype.glbType === 'TRANS');
        const exp = ancillarie.subTypes.find((subtype) => subtype.glbType === 'EXP');
        if (ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE
            && transfer.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE) {
            transformedInfo.ancillariesAvailable.push(ancillarie.type);
            transformedInfo.ancillariesTransfersGlobick = {
                price: ancillarie.price,
                priceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, ancillarie.price, true, false),
                date: ancillarie.date,
                transferCar: ancillarie.transferCar,
                confirmed: false
            };
            this.localStorageService.set('globickTransfers', transformedInfo.ancillariesTransfersGlobick);
        }
        if (exp) {
            this.localStorageService.set('isGlobickActivities', true);
        }
    };
}

GlobickAncillaryTransformer.$inject = ['CheckinAncillariesConstants', 'localStorageService', 'CurrencyService'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('GlobickAncillaryTransformer', GlobickAncillaryTransformer);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('GlobickAncillaryTransformer', GlobickAncillaryTransformer);
}
