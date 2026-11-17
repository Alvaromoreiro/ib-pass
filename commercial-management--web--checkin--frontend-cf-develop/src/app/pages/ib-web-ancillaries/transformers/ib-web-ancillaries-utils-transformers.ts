/* eslint-disable @typescript-eslint/no-loop-func */
import * as angular from 'angular';

export class AncillariesUtilsTransformer {
    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private CurrencyService: CurrencyService,
        private $filter: ng.IFilterService,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    /**
     * Return arrival, departure and id information of segments
     * @return {Array} List of segment information of booking
     */
    getBookingSegmentInformation = (): any => {
        const bookingInfo: any = this.localStorageService.get('bookingInfo'),
            segments = [];

        angular.forEach(bookingInfo.outwardSegments, (segment) => {
            segments.push({ id: segment.id, arrival: segment.arrival, departure: segment.departure });
        });

        angular.forEach(bookingInfo.returnSegments, (segment) => {
            segments.push({ id: segment.id, arrival: segment.arrival, departure: segment.departure });
        });

        return segments;
    };

    /**
     * Create model of ancillaries summary for show on basket (common header)
     * @param {Object} breakDownInfo Information recovered by ancillaries
     * @param {Array} segmentsInfo List of segments for get information of origin/destination
     * @return {Object} basket
     */
    generateAncillariesHeaderInfo = (breakDownInfo: any, segmentsInfo: any): any => {
        const basket = {
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

        const getCurrencyAncillarie = (summaryCurrencies: any, ancillarie: any): any => {
            let i = 0,
                isFound = false,
                currency = null;

            while (!isFound || i < summaryCurrencies.length) {
                if (summaryCurrencies[i].code === ancillarie.currency) {
                    currency = summaryCurrencies[i];
                    isFound = true;
                }
                i++;
            }
            return currency;
        };

        if (breakDownInfo.pendingPaymentItems.length > 0) {
            basket.currency = this.CurrencyService.getCurrencyObject(getCurrencyAncillarie(breakDownInfo.currencies, breakDownInfo.pendingPaymentItems[0]));
        }

        const getTypeAndDescription = (features: any): any => {
            const seat = { type: null, description: null };

            if (features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.emergencyExit) !== -1) {
                seat.type = this.CheckinAncillariesConstants.SeatFeatures.emergencyExit;
            }
            if (
                features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.emergencyExit) === -1 &&
                features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.extraSize) !== -1
            ) {
                seat.type = this.CheckinAncillariesConstants.SeatFeatures.extraSize;
            }
            if (
                features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.emergencyWindow) !== -1 &&
                features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.extraSize) === -1
            ) {
            }
            if (features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.infant) !== -1) {
                seat.type = this.CheckinAncillariesConstants.SeatFeatures.infant;
            }
            if (
                features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.promo) !== -1 &&
                features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.emergencyExit) === -1
            ) {
                seat.type = this.CheckinAncillariesConstants.SeatFeatures.promo;
            }
            if (features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.upfront) !== -1) {
                seat.type = this.CheckinAncillariesConstants.SeatFeatures.upfront;
            }
            if (features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.mobility) !== -1) {
                seat.type = this.CheckinAncillariesConstants.SeatFeatures.mobility;
            }
            if (features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.screen) !== -1) {
                seat.type = '';
            }
            if (features.indexOf(this.CheckinAncillariesConstants.SeatFeatures.nonReclining) !== -1) {
                seat.type = '';
            }

            switch (seat.type) {
                    case this.CheckinAncillariesConstants.SeatFeatures.emergencyExit:
                        seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_EMERGENCY_XL');
                        break;
                    case this.CheckinAncillariesConstants.SeatFeatures.extraSize:
                        seat.description = this.$filter('translate')('SEATS_EXTRA_SIZE_SEAT');
                        break;
                    case this.CheckinAncillariesConstants.SeatFeatures.promo:
                        seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_PROMO');
                        break;
                    case this.CheckinAncillariesConstants.SeatFeatures.infant:
                        seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_INFANT');
                        break;
                    case this.CheckinAncillariesConstants.SeatFeatures.mobility:
                        seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_HANDICAP');
                        break;
                    case this.CheckinAncillariesConstants.SeatFeatures.upfront:
                        seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_UPFRONT');
                        break;
                    default:
                        seat.description = '';
                        break;
            }

            return seat;
        };

        const addNewSeat = (segment: any, passengerInfo: any): any => {
            let i = 0,
                isFound = false,
                seatType: any = {},
                seatInfo;
            if (passengerInfo.seat.features.length > 0) {
                seatInfo = getTypeAndDescription(passengerInfo.seat.features);
            } else {
                seatInfo = { type: '', description: '' };
            }

            while (i < segment.seats.length && !isFound) {
                if (segment.seats[i].type === seatInfo.type) {
                    segment.seats[i].passengers.push({ id: passengerInfo.id, amount: passengerInfo.amount });
                    segment.seats[i].quanty++;
                    segment.seats[i].amount += passengerInfo.amount;
                    segment.seats[i].totalFormatted = this.CurrencyService.formatPrice(basket.currency, segment.seats[i].amount, true, false);
                    segment.quanty++;
                    segment.total += passengerInfo.amount;
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
                segment.total += seatType.amount;
                segment.quanty++;
                segment.seats.push(seatType);
            }
        };

        const getOriginAndDestination = (trips, segmentsInfo): any => {
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
        };

        for (let i = 0; i < breakDownInfo.pendingPaymentItems.length; i++) {
            switch (breakDownInfo.pendingPaymentItems[i].type) {
                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SEAT:
                        angular.forEach(breakDownInfo.pendingPaymentItems[i].segments, (segment) => {
                            const trip: any = { segmentId: segment.id, seats: [], origin: null, destination: null, quanty: 0, total: 0, totalFormatted: 0 };
                            angular.forEach(segment.passengers, (passenger) => {
                                addNewSeat(trip, passenger);
                                trip.quanty += 1;
                            });
                            trip.totalFormatted = this.CurrencyService.formatPrice(basket.currency, trip.total, true, false);
                            basket.seats.push(trip);
                        });
                        getOriginAndDestination(basket.seats, segmentsInfo);

                        break;

                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INSURANCE:
                        basket.insurance = {
                            offer: breakDownInfo.pendingPaymentItems[i].offer,
                            total: breakDownInfo.pendingPaymentItems[i].total,
                            totalFormatted: this.CurrencyService.formatPrice(basket.currency, breakDownInfo.pendingPaymentItems[i].total, true, false),
                            passengers: 1,
                            type: 'Anulación + Asistencia'
                        };
                        break;

                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.UPGRADING:
                        angular.forEach(breakDownInfo.pendingPaymentItems[i].upgrading.offerSegmentsClass, (segment) => {
                            const trip = { segmentId: segment.segmentId, cabin: segment.cabinClass.description, origin: null, destination: null };
                            basket.upgrading.upgradingTrips.push(trip);
                        });
                        basket.upgrading.total = breakDownInfo.pendingPaymentItems[i].total;
                        basket.upgrading.totalFormatted = this.CurrencyService.formatPrice(basket.currency, basket.upgrading.total, true, false);

                        getOriginAndDestination(basket.upgrading.upgradingTrips, segmentsInfo);
                        break;

                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE:
                        angular.forEach(breakDownInfo.pendingPaymentItems[i].slices, (slice) => {
                            let isFound = false;
                            const tripBaggage = { segmentId: slice.id, baggages: [], total: slice.total };

                            angular.forEach(slice.passengers, (passenger) => {
                                angular.forEach(passenger.pieces, (piece) => {
                                    if (tripBaggage.baggages.length > 0) {
                                        for (let j = 0; j < tripBaggage.baggages.length; j++) {
                                            if (tripBaggage.baggages[j].type === piece.subtype) {
                                                tripBaggage.baggages[j].quanty += piece.quantity;
                                                tripBaggage.baggages[j].total += piece.total;
                                                tripBaggage.baggages[j].totalFormatted = this.CurrencyService.formatPrice(basket.currency, tripBaggage.baggages[j].total, true, false);
                                                tripBaggage.baggages[j].passengers.push(passenger.id);
                                                isFound = true;
                                            }
                                        }
                                    }
                                    if (!isFound || tripBaggage.baggages.length < 1) {
                                        tripBaggage.baggages.push({
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
                            basket.baggages.push(tripBaggage);
                        });
                        getOriginAndDestination(basket.baggages, segmentsInfo);
                        break;

                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS:
                        angular.forEach(breakDownInfo.pendingPaymentItems[i].slices, (slice) => {
                            let isFound = false;
                            const tripSpeq = { segmentId: slice.id, speqs: [], total: slice.total };

                            angular.forEach(slice.passengers, (passenger) => {
                                angular.forEach(passenger.pieces, (piece) => {
                                    if (tripSpeq.speqs.length > 0) {
                                        for (let j = 0; j < tripSpeq.speqs.length; j++) {
                                            if (tripSpeq.speqs[j].type === piece.subtype) {
                                                tripSpeq.speqs[j].quanty += piece.quantity;
                                                tripSpeq.speqs[j].total += piece.total;
                                                tripSpeq.speqs[j].totalFormatted = this.CurrencyService.formatPrice(basket.currency, tripSpeq.speqs[j].total, true, false);
                                                tripSpeq.speqs[j].passengers.push(passenger.id);
                                                isFound = true;
                                            }
                                        }
                                    }
                                    if (!isFound || tripSpeq.speqs.length < 1) {
                                        tripSpeq.speqs.push({
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
                            basket.speqs.push(tripSpeq);
                        });
                        getOriginAndDestination(basket.speqs, segmentsInfo);
                        break;
            }
        }

        return basket;
    };
}

AncillariesUtilsTransformer.$inject = ['CheckinAncillariesConstants', 'CurrencyService', '$filter', 'localStorageService'];
try {
    const mod = angular.module('ib-booking-ancillaries-module');
    mod.service('AncillariesUtilsTransformer', AncillariesUtilsTransformer);
} catch (error) {
    const mod = angular.module('ib-booking-ancillaries-module', []);
    mod.service('AncillariesUtilsTransformer', AncillariesUtilsTransformer);
}
