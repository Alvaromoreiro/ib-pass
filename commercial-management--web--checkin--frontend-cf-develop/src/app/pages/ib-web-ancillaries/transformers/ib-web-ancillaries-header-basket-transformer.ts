import * as angular from 'angular';
import { AncillariesHeaderBasket, AncillariesHeaderTrip, FlatSegmentInfo } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer.model';

/**
 * Builds the ancillaries "basket" summary shown in the checkout header (SEAT/INSURANCE/UPGRADING/
 * BAGGAGE/SPEQS breakdown), extracted from AncillariesTransformer to keep that file/module's size
 * down.
 */
export class AncillariesHeaderBasketTransformer {
    constructor (
        private CurrencyService: CurrencyService,
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private $filter: ng.IFilterService
    ) {}

    generateAncillariesHeaderInfo = (breakDownInfo: any, segmentsInfo: FlatSegmentInfo[]): AncillariesHeaderBasket => {
        const basket = this.initAncillariesHeaderBasket();
        const trip = this.initAncillariesHeaderTrip();

        if (breakDownInfo.pendingPaymentItems.length > 0) {
            basket.currency = this.CurrencyService.getCurrencyObject(this.findCurrencyForAncillarie(breakDownInfo.currencies, breakDownInfo.pendingPaymentItems[0]));
        }

        const handlers = this.getAncillariesHeaderHandlers();
        breakDownInfo.pendingPaymentItems.forEach((item) => {
            const handler = handlers[item.type];
            if (handler) {
                handler(item, basket, segmentsInfo, trip);
            }
        });

        return basket;
    };

    private initAncillariesHeaderBasket (): AncillariesHeaderBasket {
        return {
            baggages: [],
            speqs: [],
            seats: [],
            insurance: null,
            upgrading: {
                upgradingTrips: [],
                total: null,
                totalFormatted: null
            },
            currency: null
        };
    }

    /**
     * Shared across all SEAT pendingPaymentItems (created once per generateAncillariesHeaderInfo
     * call, not per item), matching the original's single outer `trip` const - a quirk of the
     * original design (multiple SEAT items would keep accumulating into the same trip/basket.seats
     * entries), preserved as-is.
     */
    private initAncillariesHeaderTrip (): AncillariesHeaderTrip {
        return {
            segmentId: null,
            cabin: null,
            seats: [],
            origin: null,
            destination: null,
            quanty: 0,
            total: 0,
            totalFormatted: 0
        };
    }

    private getAncillariesHeaderHandlers (): { [type: string]: (item: any, basket: AncillariesHeaderBasket, segmentsInfo: FlatSegmentInfo[], trip: AncillariesHeaderTrip) => void } {
        return {
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SEAT]: this.handleSeatHeaderItem,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INSURANCE]: this.handleInsuranceHeaderItem,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.UPGRADING]: this.handleUpgradingHeaderItem,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE]: this.handleBaggageHeaderItem,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS]: this.handleSpeqsHeaderItem
        };
    }

    private handleSeatHeaderItem = (item: any, basket: AncillariesHeaderBasket, segmentsInfo: FlatSegmentInfo[], trip: AncillariesHeaderTrip): void => {
        item.segments.forEach((segment) => {
            trip.segmentId = segment.id;
            segment.passengers.forEach((passenger) => {
                this.addNewHeaderSeat(basket, trip, passenger);
                trip.quanty += 1;
            });
            trip.totalFormatted = this.CurrencyService.formatPrice(basket.currency, trip.total, true, false);
            basket.seats.push(trip);
        });
        this.applyOriginAndDestination(basket.seats, segmentsInfo);
    };

    private handleInsuranceHeaderItem = (item: any, basket: AncillariesHeaderBasket): void => {
        basket.insurance = {
            offer: item.offer,
            total: item.total,
            totalFormatted: this.CurrencyService.formatPrice(basket.currency, item.total, true, false),
            passengers: 1,
            type: 'Anulaci?n + Asistencia'
        };
    };

    private handleUpgradingHeaderItem = (item: any, basket: AncillariesHeaderBasket, segmentsInfo: FlatSegmentInfo[]): void => {
        basket.upgrading.upgradingTrips.push(
            ...item.upgrading.offerSegmentsClass.map((segment) => ({
                segmentId: segment.segmentId,
                cabin: segment.cabinClass.description,
                origin: null,
                destination: null
            }))
        );
        basket.upgrading.total = item.total;
        basket.upgrading.totalFormatted = this.CurrencyService.formatPrice(basket.currency, basket.upgrading.total, true, false);

        this.applyOriginAndDestination(basket.upgrading.upgradingTrips, segmentsInfo);
    };

    private handleBaggageHeaderItem = (item: any, basket: AncillariesHeaderBasket, segmentsInfo: FlatSegmentInfo[]): void => this.buildTripAncillaryBreakdown(item, basket, segmentsInfo, 'baggages');

    private handleSpeqsHeaderItem = (item: any, basket: AncillariesHeaderBasket, segmentsInfo: FlatSegmentInfo[]): void => this.buildTripAncillaryBreakdown(item, basket, segmentsInfo, 'speqs');

    /**
     * Consolidates the former BAGGAGE/SPEQS cases (near-identical, differing only in which
     * basket array they build) into one implementation parametrized by resultKey.
     * NOTE: `isFound` is intentionally shared across all pieces of a slice (not reset per piece),
     * matching the original - once any piece matches an existing entry, isFound stays true for
     * the rest of the slice's pieces, which can suppress the push-new-entry branch for a later
     * genuinely-new subtype in the same slice. Preserved as-is, not fixed.
     */
    private buildTripAncillaryBreakdown = (item: any, basket: AncillariesHeaderBasket, segmentsInfo: FlatSegmentInfo[], resultKey: 'baggages' | 'speqs'): void => {
        item.slices.forEach((slice) => {
            let isFound = false;
            const tripBreakdown: any = { segmentId: slice.id, [resultKey]: [], total: slice.total };

            slice.passengers.forEach((passenger) => {
                passenger.pieces.forEach((piece) => {
                    const entries = tripBreakdown[resultKey];
                    if (entries.length > 0) {
                        for (let j = 0; j < entries.length; j++) {
                            if (entries[j].type === piece.subtype) {
                                entries[j].quanty += piece.quantity;
                                entries[j].total += piece.total;
                                entries[j].totalFormatted = this.CurrencyService.formatPrice(basket.currency, entries[j].total, true, false);
                                entries[j].passengers.push(passenger.id);
                                isFound = true;
                            }
                        }
                    }
                    if (!isFound || entries.length < 1) {
                        entries.push({
                            type: piece.subtype,
                            quanty: piece.quantity,
                            description: piece.description,
                            total: piece.total,
                            totalFormatted: this.CurrencyService.formatPrice(basket.currency, piece.total, true, false),
                            passengers: [passenger.id]
                        });
                    }
                });
            });
            basket[resultKey].push(tripBreakdown);
        });
        this.applyOriginAndDestination(basket[resultKey], segmentsInfo);
    };

    private getSeatFeatureTypeAndDescription = (features: any): any => {
        const type = this.classifySeatFeatureType(features);
        const descriptionKey = this.getSeatFeatureDescriptionKeys()[type];
        return {
            type,
            description: descriptionKey ? this.$filter('translate')(descriptionKey) : ''
        };
    };

    /**
     * Rule list applied in order; the LAST matching rule wins (mirrors the original's sequential
     * if-reassignment onto a shared `type` variable, where every condition was checked regardless
     * of earlier matches). The emergencyExit-present guards on extraSize/promo are preserved verbatim.
     */
    private classifySeatFeatureType (features: any): any {
        const f = this.CheckinAncillariesConstants.SeatFeatures;
        const rules: Array<{ matches: boolean; type: any }> = [
            { matches: features.indexOf(f.emergencyExit) !== -1, type: f.emergencyExit },
            { matches: features.indexOf(f.emergencyExit) === -1 && features.indexOf(f.extraSize) !== -1, type: f.extraSize },
            { matches: features.indexOf(f.infant) !== -1, type: f.infant },
            { matches: features.indexOf(f.promo) !== -1 && features.indexOf(f.emergencyExit) === -1, type: f.promo },
            { matches: features.indexOf(f.upfront) !== -1, type: f.upfront },
            { matches: features.indexOf(f.mobility) !== -1, type: f.mobility },
            { matches: features.indexOf(f.screen) !== -1, type: '' },
            { matches: features.indexOf(f.nonReclining) !== -1, type: '' }
        ];
        let type = null;
        rules.forEach((rule) => {
            if (rule.matches) {
                type = rule.type;
            }
        });
        return type;
    }

    /**
     * NOTE: a type with no entry here (e.g. null, or '' from screen/nonReclining) falls back to
     * '' directly in getSeatFeatureTypeAndDescription without calling $filter('translate') -
     * matching the original switch's default case exactly (translate('') is not the same as '').
     */
    private getSeatFeatureDescriptionKeys (): Record<string, string> {
        const f = this.CheckinAncillariesConstants.SeatFeatures;
        return {
            [f.emergencyExit]: 'CKIANCSEATS_SEAT_EMERGENCY_XL',
            [f.extraSize]: 'SEATS_EXTRA_SIZE_SEAT',
            [f.promo]: 'CKIANCSEATS_SEAT_PROMO',
            [f.infant]: 'CKIANCSEATS_SEAT_INFANT',
            [f.mobility]: 'CKIANCSEATS_SEAT_HANDICAP',
            [f.upfront]: 'CKIANCSEATS_SEAT_UPFRONT'
        };
    }

    private addNewHeaderSeat = (basket: AncillariesHeaderBasket, trip: AncillariesHeaderTrip, passengerInfo: any): void => {
        let i = 0,
            isFound = false,
            seatType: any = {},
            seatInfo;
        if (passengerInfo.seat.features.length > 0) {
            seatInfo = this.getSeatFeatureTypeAndDescription(passengerInfo.seat.features);
        } else {
            seatInfo = { type: '', description: '' };
        }

        while (i < trip.seats.length && !isFound) {
            if (trip.seats[i].type === seatInfo.type) {
                trip.seats[i].passengers.push({ id: passengerInfo.id, amount: passengerInfo.amount });
                trip.seats[i].quanty++;
                trip.seats[i].amount += passengerInfo.amount;
                trip.seats[i].totalFormatted = this.CurrencyService.formatPrice(basket.currency, trip.seats[i].amount, true, false);
                trip.quanty++;
                trip.total += passengerInfo.amount;
                isFound = true;
            }
            i++;
        }

        if (!isFound) {
            seatType = { quanty: 1, passengers: [], amount: 0, totalFormatted: null };
            angular.extend(seatType, seatInfo);
            seatType.amount += passengerInfo.amount;
            seatType.totalFormatted = this.CurrencyService.formatPrice(basket.currency, seatType.amount, true, false);
            seatType.passengers.push({ id: passengerInfo.id, amount: passengerInfo.amount });
            trip.total += seatType.amount;
            trip.quanty++;
            trip.seats.push(seatType);
        }
    };

    /**
     * NOTE: preserves the original's `while (!isFound || i < summaryCurrencies.length)` condition
     * verbatim - it uses `||` where `&&` would be expected, meaning this throws once `i` runs past
     * the array if no currency ever matches (isFound stays false, so the condition never becomes
     * false via the length check alone). Flagged, not fixed - callers must always supply a matching
     * currency in breakDownInfo.currencies.
     */
    private findCurrencyForAncillarie = (summaryCurrencies: CommonsCurrencyModel.CurrencyObject[], ancillarie: any): CommonsCurrencyModel.CurrencyObject => {
        let i = 0,
            isFound = false,
            currency: CommonsCurrencyModel.CurrencyObject = null;

        while (!isFound || i < summaryCurrencies.length) {
            if (summaryCurrencies[i].code === ancillarie.currency) {
                currency = summaryCurrencies[i];
                isFound = true;
            }
            i++;
        }
        return currency;
    };

    /**
     * Mutates each trip in place, setting origin/destination from the matching
     * segmentsInfo entry (flat .origin/.destination fields, not the .arrival/.departure
     * airport shape used by AncillariesTransformer.getInfoSegment).
     */
    private applyOriginAndDestination (trips: Array<{ segmentId: any; origin?: any; destination?: any }>, segmentsInfo: FlatSegmentInfo[]): void {
        let i, j, isFound;
        for (i = 0; i < trips.length; i++) {
            j = 0;
            isFound = false;
            while (!isFound && j < segmentsInfo.length) {
                if (trips[i].segmentId === segmentsInfo[j].id) {
                    trips[i].origin = segmentsInfo[j].origin;
                    trips[i].destination = segmentsInfo[j].destination;
                    isFound = true;
                }
                j++;
            }
        }
    }
}

AncillariesHeaderBasketTransformer.$inject = ['CurrencyService', 'CheckinAncillariesConstants', '$filter'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('AncillariesHeaderBasketTransformer', AncillariesHeaderBasketTransformer);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('AncillariesHeaderBasketTransformer', AncillariesHeaderBasketTransformer);
}
