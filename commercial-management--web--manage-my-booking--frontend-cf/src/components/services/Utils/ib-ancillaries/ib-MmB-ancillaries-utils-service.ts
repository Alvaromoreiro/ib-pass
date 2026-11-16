import * as angular from 'angular';
import dayjs from 'dayjs';
import { AncillariesMMBConstants } from '@src/components/ib-MmB-ancillaries-page/constants/ib-MmB-ancillaries-constants';

@Service(
    'ib-MmB-services-module',
    ['localStorageService','AncillariesConstants','$filter','CurrencyService','MmBAppConstants'],
    []
)
export class MmBAncillariesUtilsService {
    constructor (
        private localStorageService: angular.local.storage.ILocalStorageService,
        private AncillariesConstants: AncillariesMMBConstants,
        private $filter: ng.IFilterService,
        private CurrencyService: CurrencyService,
        private MmBAppConstants,
    ) { }

    /**
     * Calculate price baggages in all passengers
     */
    calculatePiecesBaggageTrip (passengers) {
        let i, k, numBag = 1, numBagsInterval, baggageCounter = 0;
        angular.forEach(passengers, (pas) => {
            angular.forEach(pas.trips, (trip) => {
                trip.totalPrice = 0;
                for (i = 0; i < trip.pieces.length; i++) {
                    if (trip.pieces[i].quantySelected > 0) {
                        numBag = 0;
                        for (k = 0; k < trip.pieces[i].availablePriceRanges.length; k++) {
                            numBagsInterval = 1;
                            baggageCounter = (trip.pieces[i].availablePriceRanges[k].to - trip.pieces[i].availablePriceRanges[k].from) + 1;
                            while (numBagsInterval <= baggageCounter && numBag < trip.pieces[i].quantySelected) {
                                trip.totalPrice += trip.pieces[i].availablePriceRanges[k].amount;
                                numBagsInterval++;
                                numBag++;
                            }
                        }
                    }
                }
            });
        });
    };

    /**
   * Calculate price speqs in all passengers
   */
    calculatePiecesSpeqsTrip (passengers) {
        let i, k, numSpeq = 1, numSpeqsInterval, speqCounter = 0;
        angular.forEach(passengers, (pas) => {
            angular.forEach(pas.trips, (trip) => {
                trip.totalPrice = 0;
                for (i = 0; i < trip.pieces.length; i++) {
                    if (trip.pieces[i].quantySelected > 0) {
                        numSpeq = 0;
                        for (k = 0; k < trip.pieces[i].availablePriceRanges.length; k++) {
                            numSpeqsInterval = 1;
                            speqCounter = (trip.pieces[i].availablePriceRanges[k].to - trip.pieces[i].availablePriceRanges[k].from) + 1;
                            while (numSpeqsInterval <= speqCounter && numSpeq < trip.pieces[i].quantySelected) {
                                trip.totalPrice += trip.pieces[i].availablePriceRanges[k].amount;
                                numSpeqsInterval++;
                                numSpeq++;
                            }
                        }
                    }
                }
            });
        });
    };
    /**
      * Update segments seats with new seat returned by service.
      * @param {Array} segmentSeats Array of segments seats updated
      */
    updateSegmentSeatCachedInfo (segmentSeats: any) {
        const cachedInfo:any = this.localStorageService.get('bookingInfo');

        angular.forEach(cachedInfo.order.orderItems, (item) => {
            if (item.type.toUpperCase() === this.AncillariesConstants.TYPE_ANCILLARIE.SEAT) {
                angular.forEach(segmentSeats, (segment) => {
                    if (item.segmentId === segment.id) {
                        angular.forEach(segment.passengers, (pas) => {
                            if (pas.seat && pas.id === item.passengerId) {
                                item.column = pas.column;
                                item.row = pas.row;
                            } else {
                                item.column = null;
                                item.row = null;
                            }

                        });
                    }
                });
            }
        });
        this.localStorageService.set('bookingInfo', cachedInfo);
    };

    /**
     * Format date
     * @param {*} date
     */
    formatDate (date):any {
        let returnDate = this.$filter<any>('DateFormatFilter')(date);
        if (returnDate && returnDate.formatedDate) {
            return returnDate.formatedDate;
        };
        return returnDate = dayjs(date).format('DD/MM/YYYY');
    };

    /**
     * Segment informationf for set for open seat modal
     * @param {Object} segmentInfo To seat in localStorage and recover in seat map modal
     */
    setSegmentInfo (segmentInfo: {segmentId: string, pasId: string}) {
        this.localStorageService.set('seatMapSegment', segmentInfo);
    };

    /**
     * Remove seats information selected in seat map
     */
    removeSeatInfoConfirmation () {
        this.localStorageService.remove('seatInfoConfirmation');
    };

    /**
     * Return seat info confirmaton of localStraoge
     */
    getSeatInfoConfirmation ():any {
        return this.localStorageService.get('seatInfoConfirmation');
    };


    /*
    * @return {BOOL} TRUE if have and FALSE if not
    * @param {Object} bookingInfo Booking information returned by service
    * @param {Object} selectedSegments Ancillaries information returned by service
    */
    checkEarlyFlights (bookingInfo: any, selectedSegments: any) :any {
        let isEarly = false;
        angular.forEach(selectedSegments, (segmentId) => {
            angular.forEach(bookingInfo.checkinSegmentsInGroup, (earlySegmentId) => {
                if (earlySegmentId === segmentId) {
                    isEarly = true;
                }
            });
        });
        return isEarly;
    };

    /**
   * check if the current user is logged or not
   * @return true if the user is logged in the app
   */
    isUserLogged () :any {
        return this.localStorageService.get('userLogged');
    };

    /**
     * Check if the currency is long
     * @return True if is long
     * @param {Strin} currency Code of currency
     */
    isCurrencyLong (currency: any):any {
        return this.AncillariesConstants.CURRENCIES_TYPE_LONG.indexOf(currency) !== -1;
    };

    /**
     *  validated if exist flightaviosinfo in sessionStorage
     * @returns boolean
     */
    validatedFlightAviosInfo ():boolean {
        return !!this.localStorageService.get('flightAviosInfo');
    };

     /**
     * Generate information of ancillaries for common header
     * @param {Object} breakDownInfo Information recovered by basket service
     * @return {Object} basket
     */
    generateAncillariesHeaderInfo = (breakDownInfo, segmentsInfo) => {
        let basket = { 'baggages': [], 'speqs': [], 'seats': [], 'insurance': null, 'upgrading': { 'upgradingTrips': [], 'total': null, 'totalFormatted': null }, 'currency': null }
        const bookingInfo: any = this.localStorageService.get('bookingInfo');
        let currencyInfo = this.getCurrencyInfo(breakDownInfo, bookingInfo);

        if (breakDownInfo.pendingPaymentItems.length > 0) {
            basket.currency = this.CurrencyService.getCurrencyObject(this.getCurrencyAncillarie(breakDownInfo.currencies, breakDownInfo.pendingPaymentItems[0]));
        } else {
            basket.currency = this.CurrencyService.getCurrencyObject(currencyInfo);
        };

        for (let i = 0; i < breakDownInfo.pendingPaymentItems.length; i++) {
            basket = this.switchPendingPaymentItems(breakDownInfo, i, basket, segmentsInfo)
        };

        return basket;
    };

    private getCurrencyInfo = (breakDownInfo, bookingInfo) => {
        return (breakDownInfo.currencies ? breakDownInfo.currencies : bookingInfo.contextMetadata.currencies.length > 0 ? bookingInfo.contextMetadata.currencies : null);
    };
    
    private getCurrencyAncillarie = (summaryCurrencies, ancillarie) => {
        let i = 0, isFound = false, currency;

        while (!isFound || i < summaryCurrencies.length) {
            if (summaryCurrencies[i].code === ancillarie.currency) {
                currency = summaryCurrencies[i];
                isFound = true;
            }
            i++;
        }
        return currency;
    };


    private switchPendingPaymentItems = (breakDownInfo, i, basket, segmentsInfo) => {       
        switch (breakDownInfo.pendingPaymentItems[i].type) {
            case this.MmBAppConstants.ANCILLARIES_TYPES.SEAT:
                angular.forEach(breakDownInfo.pendingPaymentItems[i].segments, (segment) => {
                    let trip = { 'segmentId': null, 'seats': [], 'origin': null, 'destination': null, 'quanty': 0, 'total': 0, 'totalFormatted': 0 };
                    trip.segmentId = segment.id;
                    angular.forEach(segment.passengers, (passenger) => {
                        trip = this.addNewSeat(trip, passenger, basket);
                        trip.quanty += 1;
                    });
                    trip.totalFormatted = this.CurrencyService.formatPrice(basket.currency, trip.total, true, false);
                    basket.seats.push(trip);
                });
                this.getOriginAndDestination(basket.seats, segmentsInfo);

                break;

            case this.MmBAppConstants.ANCILLARIES_TYPES.INSURANCE:
                basket.insurance = {
                    'offer': breakDownInfo.pendingPaymentItems[i].offer,
                    'total': breakDownInfo.pendingPaymentItems[i].total,
                    'totalFormatted': this.CurrencyService.formatPrice(basket.currency, breakDownInfo.pendingPaymentItems[i].total, true, false),
                    'passengers': 1,
                    'type': 'Anulación + Asistencia'
                };
                break;

            case this.MmBAppConstants.ANCILLARIES_TYPES.UPGRADING:
                angular.forEach(breakDownInfo.pendingPaymentItems[i].upgrading.offerSegmentsClass, (segment) => {
                    let trip = { 'segmentId': segment.segmentId, 'cabin': segment.cabinClass.description, 'origin': null, 'destination': null };
                    basket.upgrading.upgradingTrips.push(trip);
                });
                basket.upgrading.total = breakDownInfo.pendingPaymentItems[i].total;
                basket.upgrading.totalFormatted = this.CurrencyService.formatPrice(basket.currency, basket.upgrading.total, true, false);

                this.getOriginAndDestination(basket.upgrading.upgradingTrips, segmentsInfo);
                break;


            case this.MmBAppConstants.ANCILLARIES_TYPES.BAGGAGE:
                angular.forEach(breakDownInfo.pendingPaymentItems[i].slices, (slice)=>  {
                    let tripBaggage = { 'segmentId': slice.id, 'baggages': [], 'total': slice.total };

                    angular.forEach(slice.passengers, (passenger) => {
                        angular.forEach(passenger.pieces, (piece) => {
                            tripBaggage = this.addTripBaggage(tripBaggage, piece, basket, passenger);
                        });
                    });
                    basket.baggages.push(tripBaggage);
                });
                this.getOriginAndDestination(basket.baggages, segmentsInfo);
                break;

            case this.MmBAppConstants.ANCILLARIES_TYPES.SPEQS:
                angular.forEach(breakDownInfo.pendingPaymentItems[i].slices, (slice) => {
                    let tripSpeq = { 'segmentId': slice.id, 'speqs': [], 'total': slice.total };

                    angular.forEach(slice.passengers, (passenger) => {
                        angular.forEach(passenger.pieces, (piece) => {
                            tripSpeq = this.addTripSpeq(tripSpeq, piece, basket, passenger);
                            
                        });
                    });
                    basket.speqs.push(tripSpeq);
                });
                this.getOriginAndDestination(basket.speqs, segmentsInfo);
                break;

            };
        return basket;
    };

    private addTripBaggage = (tripBaggage, piece, basket, passenger) => {
        let paramsTripAncillary = {tripBaggage, piece, basket, passenger, field: 'baggages' };
        return this.addTripAncillary(paramsTripAncillary);
    };

    private addTripSpeq = (tripSpeq, piece, basket, passenger) => {
        let paramsTripAncillary = {tripSpeq, piece, basket, passenger, field: 'speqs' };
        return this.addTripAncillary(paramsTripAncillary);
    };

    private addTripAncillary = (params) => {
        let { trip, piece, basket, passenger, field } = params;
        if (!trip) {
            trip = {};
        };
        if (!Object.prototype.hasOwnProperty.call(trip, field) || !Array.isArray(trip[field])) {
            trip[field] = [];
        };
        if (trip[field].length > 0) {
            let found = false;
            for (let j = 0; j < trip[field].length; j++) {
                if (trip[field][j].type === piece.subtype) {
                    trip[field][j].quanty += piece.quantity;
                    trip[field][j].total += piece.total;
                    trip[field][j].totalFormatted = this.CurrencyService.formatPrice(basket.currency, trip[field][j].total, true, false);
                    trip[field][j].passengers.push(passenger.id);
                    found = true;
                    break;
                };
            };
            if (!found) {
                trip[field].push({
                    'type': piece.subtype,
                    'quanty': piece.quantity,
                    'description': piece.description,
                    'total': piece.total,
                    'totalFormatted': this.CurrencyService.formatPrice(basket.currency, piece.total, true, false),
                    'passengers': [passenger.id]
                });
            };
        } else {
            trip[field].push({
                'type': piece.subtype,
                'quanty': piece.quantity,
                'description': piece.description,
                'total': piece.total,
                'totalFormatted': this.CurrencyService.formatPrice(basket.currency, piece.total, true, false),
                'passengers': [passenger.id]
            });
        };
        return trip;
    };


    private addNewSeat = (trip, passengerInfo, basket) => {
        let i = 0, isFound = false, seatType: any = {}, seatInfo;
        if (passengerInfo.seat.features.length > 0) {
            seatInfo = this.getTypeAndDescription(passengerInfo.seat.features);
        } else {
            seatInfo = { 'type': '', 'description': '' };
        }

        while (i < trip.seats.length && !isFound) {
            if (trip.seats[i].type === seatInfo.type) {
                trip.seats[i].passengers.push({ 'id': passengerInfo.id, 'amount': passengerInfo.amount });
                trip.seats[i].quanty++;
                trip.seats[i].amount += passengerInfo.amount;
                trip.seats[i].totalFormatted = this.CurrencyService.formatPrice(basket.currency, trip.seats[i].amount, true, false);
                isFound = true;
            }
            i++;
        }

        if (!isFound) {
            seatType = { 'quanty': 1, passengers: [], 'amount': 0, 'totalFormatted': null };
            angular.extend(seatType, seatInfo);
            seatType.amount += passengerInfo.amount;
            seatType.totalFormatted = this.CurrencyService.formatPrice(basket.currency, seatType.amount, true, false);
            seatType.passengers.push({ 'id': passengerInfo.id, 'amount': passengerInfo.amount });
            trip.seats.push(seatType);
        };
        trip.total += passengerInfo.amount;
        return trip;
    };

    private getOriginAndDestination = (trips, segmentsInfo) => {
        let j, isFound: boolean;
        for (let i = 0; i < trips.length; i++) {
            j = 0; isFound = false;
            while (!isFound && j < segmentsInfo.length) {
                if (trips[i].segmentId === segmentsInfo[j].segmentId) {
                    trips[i].origin = segmentsInfo[j].departure.city;
                    trips[i].destination = segmentsInfo[j].arrival.city;
                    isFound = true;
                }
                j++;
            }
        }
    };

    getTypeAndDescription = (features) => {
        const SEAT_FEATURE = this.MmBAppConstants.SEAT_FEATURE;
        const translateFilter = (key) => this.$filter('translate')(key);

        const rules = [
            {
                condition: () =>
                    features.includes(SEAT_FEATURE.EXTRA_SIZE) &&
                    features.includes(SEAT_FEATURE.UPFRONT),
                type: SEAT_FEATURE.NEIGHBOR_FREE,
                description: () => translateFilter('CKIANCSEATS_SEAT_NEIGHBOR')
            },
            {
                condition: () => features.includes(SEAT_FEATURE.EMERGENCY_EXIT),
                type: SEAT_FEATURE.EMERGENCY_EXIT,
                description: () => translateFilter('CKIANCSEATS_SEAT_EMERGENCY_XL')
            },
            {
                condition: () => features.includes(SEAT_FEATURE.EXTRA_SIZE),
                type: SEAT_FEATURE.EXTRA_SIZE,
                description: () => translateFilter('SEATS_EXTRA_SIZE_SEAT')
            },
            {
                condition: () => features.includes(SEAT_FEATURE.INFANT) && features.includes(SEAT_FEATURE.PROMO),
                type: SEAT_FEATURE.INFANT,
                description: () => translateFilter('CKIANCSEATS_SEAT_INFANT')
            },
            {
                condition: () => features.includes(SEAT_FEATURE.INFANT),
                type: SEAT_FEATURE.INFANT,
                description: () => translateFilter('CKIANCSEATS_SEAT_INFANT')
            },
            {
                condition: () => features.includes(SEAT_FEATURE.PROMO),
                type: SEAT_FEATURE.PROMO,
                description: () => translateFilter('SEATS_SEAT_PROMO')
            },
            {
                condition: () => features.includes(SEAT_FEATURE.UPFRONT),
                type: SEAT_FEATURE.UPFRONT,
                description: () => translateFilter('CKIANCSEATS_SEAT_UPFRONT')
            },
            {
                condition: () => features.includes(SEAT_FEATURE.MOBILITY),
                type: SEAT_FEATURE.MOBILITY,
                description: () => translateFilter('CKIANCSEATS_SEAT_HANDICAP')
            },
            {
                condition: () => features.includes(SEAT_FEATURE.SCREEN) || features.includes(SEAT_FEATURE.NON_RECLINING),
                type: '',
                description: () => ''
            }
        ];

        for (const rule of rules) {
            if (rule.condition()) {
                return { type: rule.type, description: rule.description() };
            };
        };
        return { type: null, description: '' };
    };

     /**
     * Return array with description of failed items delete
     * @param {Array} cancelData
     */
    checkFailedPendingPayments = (cancelData) => {
        let returnedFailedItems = '';
        if (cancelData != null && cancelData.failedToDelete) {
            for (let i = 0; i < cancelData.failedToDelete.length; i++) {
                returnedFailedItems = this.handleFailedToDelete(i, cancelData, returnedFailedItems)
            };
        };
        return returnedFailedItems;
    };

    private handleFailedToDelete = (i, cancelData, returnedFailedItems) => {
        if (cancelData.failedToDelete[i].type === this.MmBAppConstants.ANCILLARIES_TYPES.SEAT) {
            returnedFailedItems = this.failedDeleteTypeSeat(i, cancelData, returnedFailedItems);
        } else if (cancelData.failedToDelete[i].type === this.MmBAppConstants.ANCILLARIES_TYPES.BAGGAGE) {
            for (let j = 0; j < cancelData.failedToDelete[i].segments.length; j++) {
                returnedFailedItems += cancelData.failedToDelete[i].pasengers[j].error.description;
            };
        } else if (cancelData.failedToDelete[i].type === this.MmBAppConstants.ANCILLARIES_TYPES.UPGRADING) {
            returnedFailedItems += cancelData.failedToDelete[i].error.description;
        };

        return returnedFailedItems;
    };

    private failedDeleteTypeSeat = (i, cancelData, returnedFailedItems) => {
        for (let j = 0; j < cancelData.failedToDelete[i].segments.length; j++) {
            returnedFailedItems += cancelData.failedToDelete[i].segments[j].error.description;
        };
        return returnedFailedItems;
    };
};
