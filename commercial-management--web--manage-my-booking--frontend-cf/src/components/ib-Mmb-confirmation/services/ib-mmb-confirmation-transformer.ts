import { Inject, Injectable } from "@angular/core";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import angular from "angular";
import { AJSCurrencyService, CommonsSessionStorageService } from "ib-web-commons/utils";

@Injectable()
export class MmbConfirmationTransformer {

    constructor(
        @Inject(AJSCurrencyService) private currencyService: CurrencyService,
        private localStorageService: CommonsSessionStorageService) {}

    transformInfoConfirmation = () => {
        const headerModel: any = this.localStorageService.get('headerModel');
        const bookingInfo: any = this.localStorageService.get('bookingInfo');
        let confirmationInfo = [];
        let infoSlice: any = {};
        let segmentsSlice = [];

        angular.forEach(bookingInfo.order.slices, function (slice) {
            infoSlice = {
                'origin': {
                    'description': slice.segments[0].departure.city.description,
                    'code': slice.segments[0].departure.city.code
                },
                'destination': {
                    'description': slice.segments[slice.segments.length - 1].arrival.city.description,
                    'code': slice.segments[slice.segments.length - 1].arrival.city.description
                },
                'segments': []
            };
            segmentsSlice = [];
            angular.forEach(slice.segments, function (segment) {
                angular.forEach(headerModel.headerModel.shoppingBasket.seats.segments, function (headerSegment) {
                    if (angular.equals(segment.id, headerSegment.segmentId)) {
                        infoSlice.segments.push(headerSegment);
                    }
                });
            });
            confirmationInfo.push(infoSlice);
        });
        return confirmationInfo;
    }

    transformCO2InfoConfirmation = () => {
        const ancillariesInfo: any = this.localStorageService.get('ancillariesInfo');
        const co2Ancillary = ancillariesInfo?.ancillaries?.find(ancillary => ancillary.type === MmBAppConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT && ancillary.status.code === MmBAppConstants.GENERAL_STATUS.AVAILABLE);
        if (co2Ancillary) {
            return {
                kilosCo2Equivalent: co2Ancillary.kilosCo2Equivalent,
                kilosCo2EquivalentFormatted: co2Ancillary.kilosCo2Equivalent.toString().replace('.', ','),
                price: co2Ancillary.price,
                priceFormatted: this.currencyService.formatPrice(this.currencyService.getCurrencyObject(ancillariesInfo.currencies[0]), co2Ancillary.price, true, null)
            };
        }
        return null;
    }
}