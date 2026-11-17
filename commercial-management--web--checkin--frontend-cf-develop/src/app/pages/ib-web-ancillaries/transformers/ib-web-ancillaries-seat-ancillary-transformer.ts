import * as angular from 'angular';
import { TransformedAncillariesInfo } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer.model';

/**
 * SEAT-ancillary handling extracted from AncillariesTransformer's transformAncillariesView
 * dispatch table, to keep that file/module's size down
 */
export class SeatAncillaryTransformer {
    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CurrencyService: CurrencyService
    ) {}

    handleSeatAncillarie = (ancillarie: any, transformedInfo: TransformedAncillariesInfo): void => {
        transformedInfo.seatsAvailable.status = ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE;
        if (transformedInfo.seatsAvailable.status) {
            transformedInfo.ancillariesAvailable.push(ancillarie.type);
            this.addSegmentSeatAvailable(ancillarie);
            transformedInfo.seatsAvailable.priceFrom = this.getMinPriceSeat(ancillarie.segments, transformedInfo.currency);
        }
    };

    private addSegmentSeatAvailable = (info: any): void => {
        const ids = info.segments
            .filter((segment) => segment.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE)
            .map((segment) => segment.id);
        this.localStorageService.set('seatsAvailableSegments', ids);
    };

    private getMinPriceSeat = (segments: any, currency: CommonsCurrencyModel.CurrencyResponse): any => {
        const listPrice = [];
        let price = null;
        segments.forEach((segment) => {
            if (segment.status.code !== this.CheckinAncillariesConstants.STATUS.AVAILABLE) {
                return;
            }
            listPrice.push(
                ...segment.passengers
                    .filter((pas) => pas.priceFrom !== null && pas.priceFrom >= 0)
                    .map((pas) => pas.priceFrom)
            );
        });

        if (listPrice.length > 0) {
            price = listPrice.sort((a, b) => {
                return a - b;
            });
            price = this.CurrencyService.formatPrice(currency, Math.floor(price[0]), false, false);
        }
        return price;
    };
}

SeatAncillaryTransformer.$inject = ['CheckinAncillariesConstants', 'localStorageService', 'CurrencyService'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('SeatAncillaryTransformer', SeatAncillaryTransformer);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('SeatAncillaryTransformer', SeatAncillaryTransformer);
}
