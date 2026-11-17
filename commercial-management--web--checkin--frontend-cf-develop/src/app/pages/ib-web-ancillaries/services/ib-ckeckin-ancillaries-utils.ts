import * as angular from 'angular';
import dayjs from 'dayjs';

interface PendingSegment {
    segmentId: number;
    pasId: number;
    isCompleted: boolean;
    isLast: boolean;
}

export class CkiAncillariesUtilsService {
    constructor (
        private $q: ng.IQService,
        private $rootScope: CommonsRootScope,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private $window: ng.IWindowService,
        private IbCAuthTokenService: any,
        private AncillariesUtilsTransformer: any,
        private CurrencyService: any,
        private $location: ng.ILocationService,
        private $filter: ng.IFilterService
    ) {}

    refreshToken () {
        const defered = this.$q.defer();

        if (this.localStorageService.get('userLogged')) {
            this.IbCAuthTokenService.refreshUserLoggedToken().then(() => {
                defered.resolve();
            });
        } else {
            this.IbCAuthTokenService.getAnonymousToken().then(() => {
                defered.resolve();
            });
        }
        return defered.promise;
    }

    getEndpoint (key: any): any {
        return (this.localStorageService.get('endpoints') || {})[key];
    }

    /**
     * Calculate price baggages in all passengers
     */
    calculatePiecesBaggageTrip (passengers) {
        let i,
            k,
            numBag = 1,
            numBagsInterval,
            baggageCounter = 0;
        angular.forEach(passengers, (pas) => {
            angular.forEach(pas.trips, (trip) => {
                trip.totalPrice = 0;
                for (i = 0; i < trip.pieces.length; i++) {
                    if (trip.pieces[i].quantySelected > 0) {
                        numBag = 0;
                        for (k = 0; k < trip.pieces[i].availablePriceRanges.length; k++) {
                            numBagsInterval = 1;
                            baggageCounter = trip.pieces[i].availablePriceRanges[k].to - trip.pieces[i].availablePriceRanges[k].from + 1;
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
    }

    /**
     * Calculate price speqs in all passengers
     */
    calculatePiecesSpeqsTrip (passengers) {
        let i,
            k,
            numSpeq = 1,
            numSpeqsInterval,
            speqCounter = 0;
        angular.forEach(passengers, (pas) => {
            angular.forEach(pas.trips, (trip) => {
                trip.totalPrice = 0;
                for (i = 0; i < trip.pieces.length; i++) {
                    if (trip.pieces[i].quantySelected > 0) {
                        numSpeq = 0;
                        for (k = 0; k < trip.pieces[i].availablePriceRanges.length; k++) {
                            numSpeqsInterval = 1;
                            speqCounter = trip.pieces[i].availablePriceRanges[k].to - trip.pieces[i].availablePriceRanges[k].from + 1;
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
    }

    checkConfirmationPNR (): any {
        const confirmationPNR = this.localStorageService.get('confirmationPNR');
        if (confirmationPNR) {
            this.$location.path(
                this.localStorageService.get('userLogged')
                    ? this.CheckinAncillariesConstants.PAGES_ROUTES.SEARCH_LOGGED_BOOKING
                    : this.CheckinAncillariesConstants.PAGES_ROUTES.SEARCH_BOOKING
            );
        }
        return confirmationPNR;
    }

    generateUpdateSeatsMap (updateInfo: any): any {
        const update = [{ type: this.CheckinAncillariesConstants.SeatTypes.seat, segments: [] }];
        const segmentId: any = this.localStorageService.get('seatMapSegment');
        const segment = { id: null, passengers: [] };
        for (let i = 0; i < updateInfo.length; i++) {
            const aux = { id: updateInfo[i].id, seat: { row: null, column: null } };
            updateInfo[i].seat ? (aux.seat = updateInfo[i].seat) : (aux.seat = null);
            segment.id = segmentId.segmentId;
            segment.passengers.push(aux);
        }
        update[0].segments.push(segment);
        return update;
    }

    /**
     *
     * @param {*} update
     * @param {*} segmentId
     */
    updateSeatCachedInformation (update: any, segmentId: any) {
        const cachedInfo: any = this.localStorageService.get('bookingInfo');
        const updateInfo = update[0].segments[0].passengers;

        angular.forEach(cachedInfo.order.orderItems, (item) => {
            if (item.type.toUpperCase() === this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SEAT) {
                angular.forEach(updateInfo, (pas) => {
                    if (pas.id === item.passengerId && item.segmentId === segmentId) {
                        item.row = pas.seat.row;
                        item.column = pas.seat.column;
                    }
                });
            }
        });
        this.localStorageService.set('bookingInfo', cachedInfo);
    }

    /**
     * Update segments seats with new seat returned by service.
     * @param {Array} segmentSeats Array of segments seats updated
     */
    updateSegmentSeatCachedInfo (segmentSeats: any) {
        const cachedInfo: any = this.localStorageService.get('bookingInfo');

        angular.forEach(cachedInfo.order.orderItems, (item) => {
            if (item.type.toUpperCase() === this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SEAT) {
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
    }

    /**
     * Update restBooking info on localStorage
     * @param {*} update
     */

    updateCachedCheckinInformation (update, segmentId) {
        const cachedInfo: any = this.localStorageService.get('bookingInfo');
        const updateInfo: any = update[0].segments[0].passengers;
        let j = 0,
            k,
            l,
            segmentFound = false,
            pasFound;
        while (!segmentFound && j < cachedInfo.outwardSegments.length) {
            if (Number(segmentId) === cachedInfo.outwardSegments[j].id) {
                segmentFound = true;
                for (k = 0; k < updateInfo.length; k++) {
                    (pasFound = false), (l = 0);
                    while (!pasFound && l < cachedInfo.outwardSegments[j].passengers.length) {
                        if (updateInfo[k].id === cachedInfo.outwardSegments[j].passengers[l].id) {
                            pasFound = true;
                            cachedInfo.outwardSegments[j].passengers[l].seat = updateInfo[k].seat;
                        }
                        l++;
                    }
                }
            }
            j++;
        }
        j = 0;
        while (!segmentFound && j < cachedInfo.returnSegments.length) {
            if (Number(segmentId) === cachedInfo.returnSegments[j].id) {
                segmentFound = true;
                for (k = 0; k < updateInfo.length; k++) {
                    (pasFound = false), (l = 0);
                    while (!pasFound && l < cachedInfo.returnSegments[j].passengers.length) {
                        if (updateInfo[k].id === cachedInfo.returnSegments[j].passengers[l].id) {
                            pasFound = true;
                            cachedInfo.returnSegments[j].passengers[l].seat = updateInfo[k].seat;
                        }
                        l++;
                    }
                }
            }
            j++;
        }
        j = 0;
        while (!segmentFound && j < cachedInfo.airShuttleSegments.length) {
            if (Number(segmentId) === cachedInfo.airShuttleSegments[j].id) {
                segmentFound = true;
                for (k = 0; k < updateInfo.length; k++) {
                    (pasFound = false), (l = 0);
                    while (!pasFound && l < cachedInfo.airShuttleSegments[j].passengers.length) {
                        if (updateInfo[k].id === cachedInfo.airShuttleSegments[j].passengers[l].id) {
                            pasFound = true;
                            cachedInfo.airShuttleSegments[j].passengers[l].seat = updateInfo[k].seat;
                        }
                        l++;
                    }
                }
            }
            j++;
        }
        this.localStorageService.set('bookingInfo', cachedInfo);
    }

    /**
     * Update restBooking info on localStorage
     * @param {*} update
     */
    updateSeatsCachedInfo (updateSeats) {
        const cachedInfo: any = this.localStorageService.get('bookingInfo');
        let i, j, k, l;

        for (i = 0; i < cachedInfo.outwardSegments.length; i++) {
            for (j = 0; j < updateSeats.length; j++) {
                if (updateSeats[j].id === cachedInfo.outwardSegments[i].id.toString()) {
                    for (k = 0; k < cachedInfo.outwardSegments[i].passengers.length; k++) {
                        for (l = 0; l < updateSeats[j].passengers.length; l++) {
                            if (
                                cachedInfo.outwardSegments[i].passengers[k].passengerId &&
                                updateSeats[j].passengers[l].id === cachedInfo.outwardSegments[i].passengers[k].passengerId.toString()
                            ) {
                                cachedInfo.outwardSegments[i].passengers[k].seat = updateSeats[j].passengers[l].seat;
                            }
                            if (cachedInfo.outwardSegments[i].passengers[k].id && updateSeats[j].passengers[l].id === cachedInfo.outwardSegments[i].passengers[k].id.toString()) {
                                cachedInfo.outwardSegments[i].passengers[k].seat = updateSeats[j].passengers[l].seat;
                            }
                        }
                    }
                }
            }
        }

        for (i = 0; i < cachedInfo.returnSegments.length; i++) {
            for (j = 0; j < updateSeats.length; j++) {
                if (updateSeats[j].id === cachedInfo.returnSegments[i].id.toString()) {
                    for (k = 0; k < cachedInfo.returnSegments[i].passengers.length; k++) {
                        for (l = 0; l < updateSeats[j].passengers.length; l++) {
                            if (
                                cachedInfo.returnSegments[i].passengers[k].passengerId &&
                                updateSeats[j].passengers[l].id === cachedInfo.returnSegments[i].passengers[k].passengerId.toString()
                            ) {
                                cachedInfo.returnSegments[i].passengers[k].seat = updateSeats[j].passengers[l].seat;
                            }
                            if (cachedInfo.returnSegments[i].passengers[k].id && updateSeats[j].passengers[l].id === cachedInfo.returnSegments[i].passengers[k].id.toString()) {
                                cachedInfo.returnSegments[i].passengers[k].seat = updateSeats[j].passengers[l].seat;
                            }
                        }
                    }
                }
            }
        }

        for (i = 0; i < cachedInfo.airShuttleSegments.length; i++) {
            for (j = 0; j < updateSeats.length; j++) {
                if (updateSeats[j].id === cachedInfo.airShuttleSegments[i].id.toString()) {
                    for (k = 0; k < cachedInfo.airShuttleSegments[i].passengers.length; k++) {
                        for (l = 0; l < updateSeats[j].passengers.length; l++) {
                            if (
                                cachedInfo.airShuttleSegments[i].passengers[k].passengerId &&
                                updateSeats[j].passengers[l].id === cachedInfo.airShuttleSegments[i].passengers[k].passengerId.toString()
                            ) {
                                cachedInfo.airShuttleSegments[i].passengers[k].seat = updateSeats[j].passengers[l].seat;
                            }
                            if (
                                cachedInfo.airShuttleSegments[i].passengers[k].id &&
                                updateSeats[j].passengers[l].id === cachedInfo.airShuttleSegments[i].passengers[k].id.toString()
                            ) {
                                cachedInfo.airShuttleSegments[i].passengers[k].seat = updateSeats[j].passengers[l].seat;
                            }
                        }
                    }
                }
            }
        }

        this.localStorageService.set('bookingInfo', cachedInfo);
    }

    /**
     * Check if flown is early or not
     * @param {*} passengersSelected
     */
    checkEarlySegments (passengersData?, segmentsSelectedData?): any {
        const bookingInfo: any = this.localStorageService.get('bookingInfo');
        const passengers = passengersData || this.localStorageService.get('passengersSelected');
        const segmentsSelected = segmentsSelectedData || this.localStorageService.get('segmentsSelected');
        const pendingSegmentsSeat = [];

        const isEarlyFlow = this.isEarlyCheckInFlow(segmentsSelected, bookingInfo);

        if (isEarlyFlow) {
            this.processSegmentsForEarlyCheckIn(
                bookingInfo.checkinSegmentsInGroup,
                bookingInfo.outwardSegments,
                bookingInfo.returnSegments,
                passengers,
                pendingSegmentsSeat
            );
            if (this.localStorageService.get('isFirstEarlyMap') === null) {
                this.localStorageService.set('isFirstEarlyMap', true);
            }
        }
        this.localStorageService.set('pendingSegmentSeats', pendingSegmentsSeat);
        this.localStorageService.set('earlyCheckinCode', isEarlyFlow && pendingSegmentsSeat.length > 0);
        return isEarlyFlow && pendingSegmentsSeat.length > 0;
    }

    /**
     * Return first segment with pending seats
     * @return {Object} Segment
     */
    getSegmentSeatsPending (): any {
        let i = 0,
            isFound = false;
        let segment = null;
        const segmentsPending: any = this.localStorageService.get('pendingSegmentSeats') || [];
        while (!isFound && i < segmentsPending.length) {
            if (!segmentsPending[i].isCompleted) {
                segment = segmentsPending[i];
                isFound = true;
            }
            i++;
        }
        if (segment) {
            if (segmentsPending[segmentsPending.length - 1].segmentId === segment.segmentId) {
                segment.isLast = true;
            }
        }
        return segment;
    }

    /**
     * Return cabin class label
     * @param {String} cabinClassType
     */
    getCabinClassName (cabinClassType: any): string {
        let label = '';
        //Switch case for input cabinClassType
        switch (cabinClassType) {
                case 'ECONOMY':
                    label = 'CABIN_TOURIST';
                    break;
                case 'BUSINESS':
                    label = 'CABIN_BUSINESS';
                    break;
                case 'BUSINESS_PLUS':
                    label = 'CABIN_BUSINESS';
                    break;
                case 'BUSINESS_CLUB':
                    label = 'CABIN_BUSINESS';
                    break;
                case 'BUSINESS_CLASS':
                    label = 'CABIN_BUSINESS';
                    break;
                case 'PREMIUMTOURIST':
                    label = 'CABIN_PREMIUM_TOURIST';
                    break;
                default:
                    label = 'CABIN_TOURIST';
                    break;
        }
        return label;
    }

    /**
     * Return if passenger is selected
     * @param {Integer} passengerId
     */
    isPassengerSelected (passengerId: any): any {
        const idSelectedPassengers: any = this.localStorageService.get('passengersSelected');
        return idSelectedPassengers && idSelectedPassengers.indexOf(passengerId) !== -1;
    }

    /**
     * Update segment seat in localStorage
     * @param {Array} passsengersUpdated List of passenger updated on segment
     * @param {Integer} segmentId Segmet to update seats
     */
    updateSegmentSeatStatus (passsengersUpdated: any, segmentId: any) {
        let i,
            isFound = false;
        const segmentsPending = this.localStorageService.get('pendingSegmentSeats');
        angular.forEach(segmentsPending, (segment) => {
            (isFound = false), (i = 0);
            while (!isFound && i < passsengersUpdated.length) {
                if (segment.segmentId === segmentId) {
                    if (segment.pasId === passsengersUpdated[i].id) {
                        isFound = true;
                        segment.isCompleted = true;
                    }
                }
                i++;
            }
        });
        this.localStorageService.set('pendingSegmentSeats', segmentsPending);
    }

    /**
     * Update passengerTrips information on localStorage
     * @param {String} segmentId Segment id for delete of passenger baggage trips information of localStorage
     */
    updatePassengertrips (segmentId: any) {
        const passengerBaggageTrips: any = this.localStorageService.get('passengerBaggagesTrips');
        for (let i = 0; i < passengerBaggageTrips.length; i++) {
            for (let j = 0; j < passengerBaggageTrips[i].trips.length; j++) {
                if (passengerBaggageTrips[i].trips[j].id === segmentId) {
                    passengerBaggageTrips[i].trips[j].baggagesChoosed = 0;
                    passengerBaggageTrips[i].trips[j].totalPrice = 0;
                }
            }
        }

        this.localStorageService.set('passengerBaggagesTrips', passengerBaggageTrips);
    }

    /**
     * Format date
     * @param {*} date
     */
    formatDate (date): any {
        let returnDate = this.$filter<any>('DateFormatFilter')(date);
        if (returnDate && returnDate.formatedDate) {
            return returnDate.formatedDate;
        }
        return (returnDate = dayjs(date).format('DD/MM/YYYY'));
    }

    //Detect if is touch device and add/remove class in Mosaic View
    isTouchDevice () {
        return true === ('ontouchstart' in this.$window || this.$window.DocumentTouch);
    }

    //Detect resolution to mobile
    isResolutionToMobile (): boolean {
        if (this.$window.innerWidth <= 767) {
            return true;
        }
        return false;
    }

    /**
     * Segment informationf for set for open seat modal
     * @param {Object} segmentInfo To seat in localStorage and recover in seat map modal
     */
    setSegmentInfo (segmentInfo) {
        this.localStorageService.set('seatMapSegment', segmentInfo);
    }

    /**
     * Remove seats information selected in seat map
     */
    removeSeatInfoConfirmation () {
        this.localStorageService.remove('seatInfoConfirmation');
    }

    /**
     * Return seat info confirmaton of localStraoge
     */
    getSeatInfoConfirmation (): any {
        return this.localStorageService.get('seatInfoConfirmation');
    }

    /**
     * Return upgrading info in localStorage
     */
    getUpgradingInfo (currency?): any {
        const upgradeInfo: any = this.localStorageService.get('upgradinfInfoAccepted');
        const upgradeOffers: any = this.localStorageService.get('upgradeInfo');
        let upgradeData;
        const upgradeArray = [];

        if (upgradeInfo) {
            angular.forEach(upgradeInfo, (info) => {
                angular.forEach(upgradeOffers.offers, (offer) => {
                    if (info.offer === offer.id) {
                        angular.forEach(offer.offerSegmentClasses, (segment) => {
                            upgradeArray.push(segment);
                        });
                        upgradeData = {
                            segments: this.setSegmentData(upgradeArray),
                            total: offer.totalAmount,
                            totalFormatted: this.CurrencyService.formatPrice(currency, offer.totalAmount, true),
                            hasUpgrading: true
                        };
                    }
                });
            });
        }

        return upgradeData;
    }

    setSegmentData (segments: any): any {
        const localSegments = this.localStorageService.get('segmentsSelected');
        angular.forEach(segments, (segment) => {
            angular.forEach(localSegments, (localSegment) => {
                if (segment.segment === localSegment.id) {
                    segment.origin = {
                        description:
                            localSegment.departure && localSegment.departure.cityDescription ? localSegment.departure.cityDescription : localSegment.departure.airportDescription,
                        code: localSegment.departure && localSegment.departure.cityCode ? localSegment.departure.cityCode : localSegment.departure.airportCode
                    };
                    segment.destination = {
                        description: localSegment.arrival && localSegment.arrival.cityDescription ? localSegment.arrival.cityDescription : localSegment.arrival.airportDescription,
                        code: localSegment.arrival && localSegment.arrival.cityCode ? localSegment.arrival.cityCode : localSegment.arrival.airportCode
                    };
                }
            });
        });
        return segments;
    }

    /*
     * @return {BOOL} TRUE if have and FALSE if not
     * @param {Object} bookingInfo Booking information returned by service
     * @param {Object} selectedSegments Ancillaries information returned by service
     */
    checkEarlyFlights (bookingInfo: any, selectedSegments: any): boolean {
        let isEarly = false;
        angular.forEach(selectedSegments, (segmentId) => {
            angular.forEach(bookingInfo.checkinSegmentsInGroup, (earlySegmentId) => {
                if (earlySegmentId === segmentId) {
                    isEarly = true;
                }
            });
        });
        return isEarly;
    }

    /**
     * check if the current user is logged or not
     * @return true if the user is logged in the app
     */
    isUserLogged (): any {
        return this.localStorageService.get('userLogged');
    }

    /**
     * Return segment info of localStorage
     */
    getSegmentInfo (): any {
        const segmentInfo: any = this.localStorageService.get('seatMapSegment');
        return { segmentId: segmentInfo.segmentId, pasId: segmentInfo.pasId };
    }

    generateUpdateSpecialMeals (updateInfo: any, specialMealsCopy: any): any {
        const updateMeal = [{ type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPECIAL_MEALS, segments: [] }];
        const deleteMeal = [{ type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPECIAL_MEALS, segments: [] }];
        let auxSegment = { id: null, passengers: [] },
            auxPassenger,
            hasSpecialMealsSelected;
        let arrayPassengers,
            arrayPassengersDeleteMeal = [];
        const arraySegments: any = Object.values(updateInfo);
        for (let i = 0; i < arraySegments.length; i++) {
            hasSpecialMealsSelected = false;
            auxSegment = { id: null, passengers: [] };
            auxSegment.id = arraySegments[i].segment;
            arrayPassengers = Object.values(arraySegments[i].passengers);
            for (let j = 0; j < arrayPassengers.length; j++) {
                if (arrayPassengers[j].menu !== 'standard') {
                    for (let x = 0; x < specialMealsCopy.length; x++) {
                        if (
                            specialMealsCopy[x].segmentId === arraySegments[i].segment &&
                            specialMealsCopy[x].id === arrayPassengers[j].id &&
                            specialMealsCopy[x].menu !== arrayPassengers[j].menu
                        ) {
                            hasSpecialMealsSelected = true;
                            auxPassenger = { id: arrayPassengers[j].id, specialMealCode: arrayPassengers[j].menu };
                            auxSegment.passengers.push(auxPassenger);
                        }
                    }
                } else {
                    if (!specialMealsCopy) {
                        arrayPassengersDeleteMeal.push(arrayPassengers[j].id);
                    } else {
                        for (let x = 0; x < specialMealsCopy.length; x++) {
                            if (
                                specialMealsCopy[x].segmentId === arraySegments[i].segment &&
                                specialMealsCopy[x].id === arrayPassengers[j].id &&
                                specialMealsCopy[x].menu !== arrayPassengers[j].menu
                            ) {
                                arrayPassengersDeleteMeal.push(arrayPassengers[j].id);
                            }
                        }
                    }
                }
            }
            if (hasSpecialMealsSelected) {
                updateMeal[0].segments.push(auxSegment);
            }
            if (arrayPassengersDeleteMeal.length > 0) {
                deleteMeal[0].segments.push({
                    id: auxSegment.id,
                    passengerIds: arrayPassengersDeleteMeal
                });
            }
            arrayPassengersDeleteMeal = [];
        }
        return {
            update: updateMeal,
            delete: deleteMeal
        };
    }

    /**
     * Create model of ancillaries summary for show on basket (common header)
     * @param {Object} breakDownInfo Information recovered by ancillaries
     * @param {Array} segmentsInfo List of segments for get information of origin/destination
     * @return {Object} basket
     */
    getBookingSegmentInformation (): any {
        return this.AncillariesUtilsTransformer.getBookingSegmentInformation();
    }

    /**
     * Create model of ancillaries summary for show on basket (common header)
     * @param {Object} breakDownInfo Information recovered by ancillaries
     * @param {Array} segmentsInfo List of segments for get information of origin/destination
     * @return {Object} basket
     */
    generateAncillariesHeaderInfo (breakDownInfo: any, segmentsInfo: any): any {
        return this.AncillariesUtilsTransformer.generateAncillariesHeaderInfo(breakDownInfo, segmentsInfo);
    }

    /**
     * Return arrival, departure and id information of segments
     * @return {Array} List of segment information of booking
     */
    getMmBbookingSegmentInformation (): any {
        const bookingInfo: any = this.localStorageService.get('bookingInfo'),
            segments = [];

        angular.forEach(bookingInfo.order.slices, (slice) => {
            angular.forEach(slice.segments, (segment) => {
                const segmentInfo = {
                    id: segment.id,
                    arrival: segment.arrival,
                    arrivalDateTime: segment.arrivalUtcDateTime,
                    departure: segment.departure,
                    departureDateTime: segment.departureUtcDateTime,
                    cabinDescription: segment.cabin.description,
                    cabinType: segment.cabin.type
                };
                segments.push(segmentInfo);
            });
        });

        return segments;
    }

    /**
     * Return the credit card logo url in the project.
     * @param {String} creditCardCode -The credit card code
     * @returns {String} - the credit card logo url that matches with its credit card code in the data on localStorage
     */
    getCreditCardIcon (creditCardCode: any, creditCards: any): any {
        let i = 0,
            found = false,
            creditCardURL = '';
        while (!found && i < creditCards.length) {
            if (creditCards[i].cardTypeId === creditCardCode) {
                found = true;
                creditCardURL = this.CheckinAncillariesConstants.ROUTES.icons + this.CheckinAncillariesConstants.ROUTES.creditCardLogoBaseRoute + creditCards[i].name;
            }
            i++;
        }
        if (!found) {
            creditCardURL =
                this.CheckinAncillariesConstants.ROUTES.icons +
                this.CheckinAncillariesConstants.ROUTES.creditCardLogoBaseRoute +
                this.CheckinAncillariesConstants.ROUTES.defaultCreditCardLogo;
        }

        return creditCardURL;
    }

    /**
     * Check if the currency is long
     * @return True if is long
     * @param {Strin} currency Code of currency
     */
    isCurrencyLong (currency: any): any {
        return this.CheckinAncillariesConstants.CURRENCIES_TYPE_LONG.indexOf(currency) !== -1;
    }

    /**
     *Add seat of segment fly to local variable
     * @return [passengerSeat]
     *  code: Combination of name of user + code departure +code arrival
     *  row: row seat
     *  column: column seat
     *@param {object} seatMapInfo
     * @param [array] passengers -> local variable
     */
    addEarlyChecking (seatMapInfo: any, passengers: any): any {
        const passengerSeat = passengers === null ? [] : passengers;
        angular.forEach(seatMapInfo.passengersInfo, (pass) => {
            const name = seatMapInfo.segmentInfo.departure.code + seatMapInfo.segmentInfo.arrival.code + pass.name.replace(' ', '');
            let insert = true;
            angular.forEach(passengerSeat, (passenger) => {
                if (passenger.code === name) {
                    insert = false;
                    passenger.row = pass.initialSeat.row;
                    passenger.column = pass.initialSeat.column;
                }
            });
            if (insert) {
                passengerSeat.push({
                    code: name,
                    row: pass.initialSeat.row,
                    column: pass.initialSeat.column
                });
            }
        });
        return passengerSeat;
    }

    /**
     *  validated if exist flightaviosinfo in sessionStorage
     * @returns boolean
     */
    validatedFlightAviosInfo (): boolean {
        return !!this.localStorageService.get('flightAviosInfo');
    }

    /**
     * Determines if a segment is eligible for the Early Check-in (ECKI) process.
     * Currently, a segment is eligible if its 'typeOfTransport' is NOT "TRAIN".
     * @param typeOfTransport string, it could be FLIGHT, TRAIN or BUS
     * @returns `true` if the segment is eligible for Early CKI (i.e., it's not a train), `false` otherwise.
     */
    isSegmentAllowedForEarlyCheckIn (typeOfTransport: string): boolean {
        if (!typeOfTransport) return false;
        // Further filtering rules can be added here in the future if other conditions are needed.
        return typeOfTransport !== 'TRAIN';
    }

    /**
     * Determines if the current flow is an Early Check-in flow by comparing selected segments with check-in segments group.
     * 
     * @param segmentsSelected
     * @param bookingInfo
     * @returns boolean - True if selected segments match exactly with checkin segments group, false otherwise
     */
    private isEarlyCheckInFlow (segmentsSelected: any[], bookingInfo: any): boolean {
        if (!segmentsSelected?.length || !bookingInfo?.checkinSegmentsInGroup?.length) {
            return false;
        }
    
        const selectedIds = segmentsSelected
            .filter(segment => segment?.isSelected)
            .map(segment => segment.id)
            .sort((a, b) => a - b);
    
        const checkinIds = [...bookingInfo.checkinSegmentsInGroup].sort((a, b) => a - b);
    
        if (selectedIds.length !== checkinIds.length) {
            return false;
        }
    
        return selectedIds.every((id, index) => id === checkinIds[index]);
    }

    private processSegmentsForEarlyCheckIn (
        checkinSegments: number[],
        outwardSegments: any[],
        returnSegments: any[],
        passengers: number[],
        pendingSegmentsSeat: PendingSegment[]
    ): void {
        checkinSegments.forEach(checkinSegmentId => {
            this.processSegmentGroup(outwardSegments, checkinSegmentId, passengers, pendingSegmentsSeat);
            this.processSegmentGroup(returnSegments, checkinSegmentId, passengers, pendingSegmentsSeat);
        });
    }
    
    private processSegmentGroup (
        segments: any[],
        checkinSegmentId: number,
        passengers: number[],
        pendingSegmentsSeat: PendingSegment[]
    ): void {
        segments.forEach(segment => {
            if (segment.id === checkinSegmentId) {
                this.processPassengers(segment, passengers, pendingSegmentsSeat);
            }
        });
    }
    
    private processPassengers (
        segment: any,
        passengers: number[],
        pendingSegmentsSeat: PendingSegment[]
    ): void {
        segment.passengers.forEach(pas => {
            if (this.isPassengerEligibleForEarlyCheckIn(pas, passengers, segment)) {
                pendingSegmentsSeat.push(this.createPendingSegment(segment.id, pas.id));
            }
        });
    }
    
    private isPassengerEligibleForEarlyCheckIn (passenger: any, passengers: number[], segment: any): boolean {
        return !passenger.seat &&
            this.CheckinAncillariesConstants.FLIGHT_PASSENGERS_STATUS_LIST.NOT_AVAILABLE.indexOf(passenger.status.code) === -1 &&
            passengers.indexOf(passenger.id) !== -1 &&
            this.isSegmentAllowedForEarlyCheckIn(segment.typeOfTransport);
    }
    
    private createPendingSegment (segmentId: number, pasId: number): PendingSegment {
        return {
            segmentId,
            pasId,
            isCompleted: false,
            isLast: false
        };
    }
}

CkiAncillariesUtilsService.$inject = [
    '$q',
    '$rootScope',
    'localStorageService',
    'CheckinAncillariesConstants',
    '$window',
    'IbCAuthTokenService',
    'AncillariesUtilsTransformer',
    'CurrencyService',
    '$location',
    '$filter'
];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('CkiAncillariesUtilsService', CkiAncillariesUtilsService);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('CkiAncillariesUtilsService', CkiAncillariesUtilsService);
}
