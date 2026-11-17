/* eslint-disable @typescript-eslint/no-loop-func */
import * as angular from 'angular';
import { CkiAncillariesUtilsService } from '@pages/ib-web-ancillaries/services/ib-ckeckin-ancillaries-utils';
import { CkiDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import { AncillariesHeaderBasketTransformer } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-header-basket-transformer';
import { SeatAncillaryTransformer } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-seat-ancillary-transformer';
import { IntegratedBobAncillaryTransformer } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-bob-ancillary-transformer';
import { InsuranceAncillaryTransformer } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-insurance-ancillary-transformer';
import { Co2FootprintAncillaryTransformer } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-co2-ancillary-transformer';
import { GlobickAncillaryTransformer } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-globick-ancillary-transformer';
import { SpeqsAncillaryTransformer } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-speqs-ancillary-transformer';
import {
    AncillariesCommonInfo,
    AncillariesHeaderBasket,
    AncillaryTripsRequest,
    BookingSegmentInfo,
    FlatSegmentInfo,
    InsuranceHandlerContext,
    TransformedAncillariesInfo
} from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer.model';

export class AncillariesTransformer {
    constructor (
        private CurrencyService: CurrencyService,
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CkiAncillariesUtilsService: CkiAncillariesUtilsService,
        private $rootScope: CommonsRootScope,
        private $filter: ng.IFilterService,
        private CkiDatalayerUtilsService: CkiDatalayerUtilsService,
        private AncillariesHeaderBasketTransformer: AncillariesHeaderBasketTransformer,
        private SeatAncillaryTransformer: SeatAncillaryTransformer,
        private IntegratedBobAncillaryTransformer: IntegratedBobAncillaryTransformer,
        private InsuranceAncillaryTransformer: InsuranceAncillaryTransformer,
        private Co2FootprintAncillaryTransformer: Co2FootprintAncillaryTransformer,
        private GlobickAncillaryTransformer: GlobickAncillaryTransformer,
        private SpeqsAncillaryTransformer: SpeqsAncillaryTransformer
    ) {}

    /**
     *
     * @param {*} oldSegment
     */
    showSegmentsSelected = (oldSegment: any): any => {
        const selectedSegments: any = [];
        const idSelectedSegments: any = this.localStorageService.get('ancillariesAvailableSegments') || [];
        for (let i = 0; i < oldSegment.length; i++) {
            for (let j = 0; j < idSelectedSegments.length; j++) {
                if (oldSegment[i].id === idSelectedSegments[j]) {
                    selectedSegments.push(oldSegment[i]);
                }
            }
        }
        return selectedSegments;
    };


    /**
     * Sums a numeric value produced from leaf nodes reached by walking nested array keys.
     * e.g. sumOverPath(passengers, ['trips','pieces'], p => p.purchasedPieces) sums
     * purchasedPieces across passengers[].trips[].pieces[].
     */
    private sumOverPath (items: any[], path: string[], selectValue: (leaf: any) => number): number {
        if (path.length === 0) {
            return (items || []).reduce((total, leaf) => total + selectValue(leaf), 0);
        }
        const [childKey, ...restPath] = path;
        return (items || []).reduce((total, item) => total + this.sumOverPath(item[childKey], restPath, selectValue), 0);
    }

    countBaggageTotal = (passengers: any) => this.sumOverPath(passengers, ['trips', 'pieces'], (piece) => piece.purchasedPieces + piece.quantySelected);

    concatData = (quantity: any, description: any, text: any, type: any) => {
        if (text === null) {
            if (type === this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE) {
                text =
                    quantity.toString() +
                    ' ' +
                    (quantity === 1 ? this.$filter('translate')('BAGGAGE_SINGULAR_TEXT') : this.$filter('translate')('BAGGAGE_PLURAL_TEXT')) +
                    ' ' +
                    description;
            } else {
                text = quantity.toString() + ' ' + description;
            }
        } else {
            if (type === this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE) {
                text +=
                    ', ' +
                    quantity.toString() +
                    ' ' +
                    (quantity === 1 ? this.$filter('translate')('BAGGAGE_SINGULAR_TEXT') : this.$filter('translate')('BAGGAGE_PLURAL_TEXT')) +
                    ' ' +
                    description;
            } else {
                text += ', ' + quantity.toString() + ' ' + description;
            }
        }
        return text;
    };

    generateBaggageSpeqsHaveInfo = (info: any, type: any): any => {
        let text, count;
        info.forEach((data) => {
            data.trips.forEach((trip) => {
                text = null;
                trip.pieces.forEach((piece) => {
                    count = 0;
                    count += piece.purchasedPieces ? piece.purchasedPieces : 0;
                    count += piece.franchisePieces ? piece.franchisePieces : 0;
                    count += piece.extraPieces && piece.extraPieces.units ? piece.extraPieces.units : 0;
                    if (count > 0) {
                        text = this.concatData(count, piece.description, text, type);
                    }
                });
                trip.text = text;
            });
        });
        return info;
    };

    generatePreorderInfo = (ancillary: any, transformedInfo: AncillariesCommonInfo): any => {
        const preOrderConfig = {
            currency: ancillary.currency,
            info: ancillary.externalUrl,
            priceFrom: '',
            status: ancillary.status,
            type: ancillary.type,
            name: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.NAME,
            cardCols: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDCOLS,
            cardType: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDTYPE,
            cardImg: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDIMG,
            cardTitle: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDTITLE,
            cardText: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDTEXT,
            cardSubtext: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDSUBTEXT,
            cardSubtextSelect: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDSUBTEXTSELECT,
            cardButton: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDBUTTON,
            confirmed: this.localStorageService.get('hasPreorderAncillarie'),
            selectedFlex: null,
            modal: this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.MODAL,
            datalayer: this.CheckinAncillariesConstants.DATALAYER_INFO.PREORDER_DISPLAY,
            cardPriceFormatted: this.CurrencyService.formatPrice(
                transformedInfo.currency,
                Math.floor(parseFloat(this.CheckinAncillariesConstants.PREORDER_CONFIGURATION.CARDPRICE)),
                false,
                false
            )
        };
        return preOrderConfig;
    };
    getInfoSegment = (segmentId: string, segmentsInfo: BookingSegmentInfo[]): { departure: CkiBookingInfo.Airport | null; arrival: CkiBookingInfo.Airport | null } => {
        const info: { departure: CkiBookingInfo.Airport | null; arrival: CkiBookingInfo.Airport | null } = { departure: null, arrival: null };
        for (let i = 0; i < segmentsInfo.length; i++) {
            if (segmentsInfo[i].id.toString() === segmentId) {
                info.arrival = segmentsInfo[i].arrival.airport;
                info.departure = segmentsInfo[i].departure.airport;
            }
        }

        return info;
    };

    generateBaggageTripsInformation = (ancillariesSlices: any, ancillariesTrips: any, cachedData: any): any => {
        const passengersBaggages = [];
        const segmentsInfo: BookingSegmentInfo[] = this.CkiAncillariesUtilsService.getBookingSegmentInformation();
        const getInfoPassenger = (id: any): any => {
            const pasInfo: any = {};
            cachedData.passengers.forEach((pas) => {
                if (pas.passengerId.toString() === id) {
                    pasInfo.name = pas.personalInfo.name;
                    pasInfo.surname = pas.personalInfo.surname;
                    pasInfo.infant = pas.personalInfo.infant;
                }
            });
            return pasInfo;
        };

        const getInfoCkiPassenger = (id: any): any => {
            const pasInfo: any = {};
            cachedData.passengers.forEach((pas) => {
                if (pas.id.toString() === id) {
                    pasInfo.name = pas.name;
                    pasInfo.surname = pas.surname;
                    pasInfo.infant = pas.infant;
                }
            });

            return pasInfo;
        };

        for (let i = 0; i < ancillariesTrips.length; i++) {
            let isFound = false;
            if (ancillariesTrips[i].status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE) {
                ancillariesTrips[i].passengers.forEach((passengerTrip) => {
                    const passenger = {
                        id: passengerTrip.id,
                        trips: [],
                        info: getInfoCkiPassenger(passengerTrip.id)
                    };
                    const trip: any = {
                        id: ancillariesTrips[i].id,
                        pieces: [],
                        maxAdditionalPieces: passengerTrip.maxAdditionalPieces,
                        piecesChoosed: 0,
                        totalPrice: 0,
                        totalBaggages: 0
                    };

                    ancillariesSlices.forEach((slice) => {
                        if (slice.id === ancillariesTrips[i].id) {
                            if (slice.segmentIds.length > 1) {
                                trip.departure = this.getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                                trip.arrival = this.getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                            } else {
                                angular.extend(trip, this.getInfoSegment(slice.segmentIds[0], segmentsInfo));
                            }
                        }
                    });

                    passengerTrip.pieces.forEach((pasPieces) => {
                        isFound = false;
                        if (pasPieces.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE) {
                            pasPieces.quantySelected = 0;
                            pasPieces.purchasedPieces > 0 ? (trip.totalBaggages += pasPieces.purchasedPieces) : angular.noop;
                            pasPieces.franchisePieces > 0 ? (trip.totalBaggages += pasPieces.franchisePieces) : angular.noop;
                            pasPieces.extraPieces ? (trip.totalBaggages += pasPieces.extraPieces.units) : angular.noop;
                            trip.pieces.push(pasPieces);
                        }
                    });

                    for (let j = 0; j < passengersBaggages.length; j++) {
                        if (passenger.id === passengersBaggages[j].id) {
                            passengersBaggages[j].trips.push(trip);
                            isFound = true;
                        }
                    }
                    if (!isFound && trip.pieces.length > 0) {
                        passenger.trips.push(trip);
                        passengersBaggages.push(passenger);
                    }
                });
            }
        }

        return passengersBaggages;
    };

    formatPriceFlexibilization = (flexInfo: any, transformedInfo: AncillariesCommonInfo): any => {
        flexInfo.forEach((info) => {
            if (info.passengerPrices.length > 0) {
                info.priceFormatted = this.CurrencyService.formatPrice(transformedInfo.currency, info.passengerPrices[0].amount, true, false);
            }
        });
        return flexInfo;
    };

    generateFlexibilizationInfo = (ancillarie: any, transformedInfo: AncillariesCommonInfo): any => {
        const flexibilization = {
            currency: ancillarie.currency,
            info: this.formatPriceFlexibilization(ancillarie.flexibilityAncillaries, transformedInfo),
            priceFrom: ancillarie.priceFrom,
            cardPriceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(ancillarie.priceFrom), false, false),
            status: ancillarie.status,
            type: ancillarie.type,
            name: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.NAME,
            cardCols: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.CARDCOLS,
            cardType: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.CARDTYPE,
            cardImg: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.CARDIMG,
            cardTitle: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.CARDTITLE,
            cardText: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.CARDTEXT,
            cardSubtext: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.CARDSUBTEXT,
            cardSubtextSelect: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.CARDSUBTEXTSELECT,
            cardButton: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.CARDBUTTON,
            confirmed: false,
            selectedFlex: null,
            modal: this.CheckinAncillariesConstants.FLEX_CONFIGURATION.MODAL,
            datalayer: this.CheckinAncillariesConstants.DATALAYER_INFO.FLEXIBILIZATION_OPEN
        };
        return flexibilization;
    };

    generatePriorityOffersInfo = (segments: any, ancilariesInfoSlices: any, cachedData: any): any => {
        const currency: CommonsCurrencyModel.CurrencyResponse = this.localStorageService.get('currency');
        const bookingInfo: CkiBookingInfo.BookingInfo = this.localStorageService.get('bookingInfo');
        const segmentsInfo: BookingSegmentInfo[] = this.CkiAncillariesUtilsService.getBookingSegmentInformation();

        this.fillEmptySegmentPassengers(segments);
        this.attachSliceInfoToSegments(segments, ancilariesInfoSlices, segmentsInfo);

        return this.buildPassengersPriorityList(segments, segmentsInfo, cachedData, bookingInfo, currency);
    };

    /**
     * Quirk preserved as-is: `{ ...segments[i].passengers }` spreads an ARRAY into an object
     * literal, producing a plain object (not an array). passengerAux.length is then undefined,
     * so the NOT_AVAILABLE/amount=null mutation loop below never runs, and any empty segment
     * ends up with a non-array `passengers` (a {0:..,1:..} object) copied from the first
     * non-empty segment, unmutated. See characterization test for the exact observable effect.
     */
    private fillEmptySegmentPassengers (segments: any): void {
        let i = 0,
            isFound = false,
            passengerAux: any = [];
        while (i < segments.length && !isFound) {
            if (segments[i].passengers.length > 0) {
                passengerAux = { ...segments[i].passengers };
                isFound = true;
            }
            i++;
        }
        for (i = 0; i < passengerAux.length; i++) {
            passengerAux[i].amount = null;
            passengerAux[i].status.code = 'NOT_AVAILABLE';
        }
        for (i = 0; i < segments.length; i++) {
            if (segments[i].passengers.length === 0) {
                segments[i].passengers = passengerAux;
            }
        }
    }

    private attachSliceInfoToSegments (segments: any, ancilariesInfoSlices: any, segmentsInfo: BookingSegmentInfo[]): void {
        let i,
            j = 0,
            isFound;
        const sliceInfo: any = {};

        ancilariesInfoSlices.forEach((slice) => {
            if (slice.segmentIds.length > 1) {
                isFound = false;
                j = 0;
                sliceInfo.departure = this.getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                sliceInfo.arrival = this.getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                for (i = 0; i < slice.segmentIds.length; i++) {
                    while (j < segments.length && !isFound) {
                        if (segments[j].id === slice.segmentIds[i]) {
                            segments[j].withSliceInfo = true;
                            segments[j].sliceInfo = {};
                            segments[j].sliceInfo.departure = sliceInfo.departure;
                            segments[j].sliceInfo.arrival = sliceInfo.arrival;
                            isFound = true;
                        }
                        j++;
                    }
                }
            } else {
                j = 0;
                isFound = false;
                while (j < segments.length && !isFound) {
                    if (segments[j].id === slice.segmentIds[0]) {
                        segments[j].onlySliceInfo = true;
                        isFound = true;
                    }
                    j++;
                }
            }
        });
    }

    private buildPassengersPriorityList (segments: any, segmentsInfo: BookingSegmentInfo[], cachedData: any, bookingInfo: CkiBookingInfo.BookingInfo, currency: CommonsCurrencyModel.CurrencyResponse): any[] {
        const passengersPriority = [];
        segments.forEach((segment) => {
            for (let i = 0; i < segment.passengers.length; i++) {
                const trip = this.buildPriorityTrip(segment, segment.passengers[i], segmentsInfo, currency);
                const index = this.findOrCreatePriorityPassenger(passengersPriority, segment.passengers[i].id, trip);
                if (index === -1) {
                    const passenger: any = { id: segment.passengers[i].id, trips: [], passengerType: this.resolvePassengerType(segment.passengers[i].id, bookingInfo) };
                    passenger.info = this.getPriorityInfoCkiPassenger(passenger.id, cachedData);
                    passenger.trips.push(trip);
                    passengersPriority.push(passenger);
                }
            }
        });
        return passengersPriority;
    }

    private buildPriorityTrip (segment: any, segmentPassenger: any, segmentsInfo: BookingSegmentInfo[], currency: CommonsCurrencyModel.CurrencyResponse): any {
        const trip: any = {
            id: null,
            amount: segmentPassenger.amount,
            tripPrice: this.CurrencyService.formatPrice(currency, segmentPassenger.amount, true, false),
            checkedTrip: false
        };
        if (segment.sliceInfo) {
            trip.sliceInfo = segment.sliceInfo;
            trip.withSliceInfo = segment.withSliceInfo;
        } else if (segment.onlySliceInfo) {
            trip.onlySliceInfo = true;
        } else {
            trip.withSliceInfo = false;
        }
        trip.id = segment.id;
        trip.status = segmentPassenger.status.code;
        trip.departure = this.getInfoSegment(segment.id, segmentsInfo).departure;
        trip.arrival = this.getInfoSegment(segment.id, segmentsInfo).arrival;
        return trip;
    }

    /**
     * Preserves the original's contract: returns 0 (not the actual index) on a match, -1 otherwise.
     * Only ever used as a truthy/-1 check at the call site, so the "wrong" index value is harmless.
     */
    private findOrCreatePriorityPassenger (passengersPriority: any, idPassenger: any, trip: any): any {
        let index = -1;
        for (let i = 0; i < passengersPriority.length; i++) {
            if (passengersPriority[i].id === idPassenger) {
                passengersPriority[i].trips.push(trip);
                index = 0;
            }
        }
        return index;
    }

    private resolvePassengerType (idPassenger: any, bookingInfo: CkiBookingInfo.BookingInfo): any {
        let passengerType = '';
        for (let i = 0; i < bookingInfo.passengers.length; i++) {
            if (idPassenger === String(bookingInfo.passengers[i].id)) {
                passengerType = bookingInfo.passengers[i].type;
            }
        }
        return passengerType;
    }

    private getPriorityInfoCkiPassenger (id: any, cachedData: any): any {
        const pasInfo: any = {};
        cachedData.passengers.forEach((pas) => {
            if (pas.id.toString() === id) {
                pasInfo.name = pas.name;
                pasInfo.surname = pas.surname;
                pasInfo.infant = pas.infant;
            }
        });

        return pasInfo;
    }

    checkFlags = (transformedInfo: AncillariesCommonInfo): void => {
        const orderInformation: any = this.localStorageService.get('createOrderData');
        if (orderInformation && orderInformation.orderFlags) {
            orderInformation.orderFlags.forEach((flag) => {
                switch (flag.type) {
                        case this.CheckinAncillariesConstants.FLAGS_KEYS.XL_BANNER:
                            transformedInfo.flags.showBannerConfort = flag.enabled;
                            break;
                        case this.CheckinAncillariesConstants.FLAGS_KEYS.RESIDENT_BAGGAGE:
                            transformedInfo.flags.showBannerResident = flag.enabled;
                            break;
                }
            });
        }
    };

    generatePriorityBoardingInfo = (ancillarie: any, ancilariesInfoSlices: any, cachedData: any, transformedInfo: AncillariesCommonInfo): any => {
        const priorityBoarding = {
            currency: ancillarie.currency,
            info: this.generatePriorityOffersInfo(ancillarie.segments, ancilariesInfoSlices, cachedData),
            priceFrom: ancillarie.priceFrom,
            cardPriceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(ancillarie.priceFrom), false, false),
            status: ancillarie.status,
            type: ancillarie.type,
            name: this.CheckinAncillariesConstants.PRIORITY_BOARDING.NAME,
            cardCols: this.CheckinAncillariesConstants.PRIORITY_BOARDING.CARDCOLS,
            cardType: this.CheckinAncillariesConstants.PRIORITY_BOARDING.CARDTYPE,
            cardImg: this.CheckinAncillariesConstants.PRIORITY_BOARDING.CARDIMG,
            cardTitle: this.CheckinAncillariesConstants.PRIORITY_BOARDING.CARDTITLE,
            cardText: this.CheckinAncillariesConstants.PRIORITY_BOARDING.CARDTEXT,
            cardSubtext: this.CheckinAncillariesConstants.PRIORITY_BOARDING.CARDSUBTEXT,
            cardSubtextSelect: this.CheckinAncillariesConstants.PRIORITY_BOARDING.CARDSUBTEXTSELECT,
            cardButton: this.CheckinAncillariesConstants.PRIORITY_BOARDING.CARDBUTTON,
            confirmed: false,
            selectedPriorityBoarding: null,
            modal: this.CheckinAncillariesConstants.PRIORITY_BOARDING.MODAL,
            datalayer: this.CheckinAncillariesConstants.DATALAYER_INFO.PRIORITY_BOARDING_OPEN
        };
        return priorityBoarding;
    };

    ////////////////
    generateInfoCommon = (ancillariesInfo: any, cachedData: any): any => {
        let ancilleriesBaggageInfo, i, preorderInfo;
        const ancilariesInfoSlices = ancillariesInfo.slices;

        const transformedInfo: AncillariesCommonInfo = {
            ancillariesAvailable: [],
            currency: null,
            isCurrencyLong: false,
            pendingSeats: false,
            isPaFlow: false,
            upgradingInfo: null,
            baggageAvailable: false,
            passengerBaggagesTrips: [],
            baggageAvailablePrice: {
                priceFrom: ''
            },
            flexibilizationInfo: {},
            flags: {
                showBannerConfort: false,
                showBannerResident: false
            },
            preorderAncillarieInfo: {},
            priorityBoardingInfo: {},
            baggagesQuanty: 0
        };

        transformedInfo.currency = this.localStorageService.get('currency');
        transformedInfo.isCurrencyLong = this.CkiAncillariesUtilsService.isCurrencyLong(transformedInfo.currency.code);
        ancillariesInfo.ancillaries.forEach((ancillarie) => {
            switch (ancillarie.type) {
                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE:
                        ancilleriesBaggageInfo = ancillarie;
                        transformedInfo.baggageAvailable = ancilleriesBaggageInfo.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE;
                        if (transformedInfo.baggageAvailable) {
                            transformedInfo.ancillariesAvailable.push(ancilleriesBaggageInfo.type);
                            transformedInfo.baggageAvailablePrice.priceFrom = this.CurrencyService.formatPrice(
                                transformedInfo.currency,
                                Math.floor(ancilleriesBaggageInfo.priceFrom),
                                false,
                                false
                            );
                        }
                        break;
                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.FLEXIBILITY:
                        if (ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE) {
                            transformedInfo.ancillariesAvailable.push(ancillarie.type);
                            transformedInfo.flexibilizationInfo = this.generateFlexibilizationInfo(ancillarie, transformedInfo);
                            for (i = 0; i < transformedInfo.flexibilizationInfo.info.length; i++) {
                                if (transformedInfo.flexibilizationInfo.info[i].subtype === 'VOUCHER_REFUND') {
                                    if (transformedInfo.flexibilizationInfo.info[i].percentage >= 100) {
                                        transformedInfo.flexibilizationInfo.info[i].description = '';
                                        transformedInfo.flexibilizationInfo.info[i].description = this.$filter('translate')('ANCILLARIES_VOUCHER_REFUND_MODAL_TITLE');
                                        this.$rootScope.$broadcast('isTotalRefund', true);
                                    }
                                }
                            }
                        }
                        break;
                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.PREORDER:
                        preorderInfo = ancillarie;
                        if (preorderInfo.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE) {
                            transformedInfo.ancillariesAvailable.push(preorderInfo.type);
                            transformedInfo.preorderAncillarieInfo = this.generatePreorderInfo(preorderInfo, transformedInfo);
                        }
                        break;
                    case this.CheckinAncillariesConstants.TYPE_ANCILLARIE.PRIORITY_BOARDING:
                        if (ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE) {
                            transformedInfo.ancillariesAvailable.push(ancillarie.type);
                            transformedInfo.priorityBoardingInfo = this.generatePriorityBoardingInfo(ancillarie, ancilariesInfoSlices, cachedData, transformedInfo);
                        }
                        break;
            }
        });

        if (transformedInfo.baggageAvailable) {
            if (this.localStorageService.get('passengerBaggagesTrips')) {
                transformedInfo.passengerBaggagesTrips = this.localStorageService.get('passengerBaggagesTrips');
            } else {
                transformedInfo.passengerBaggagesTrips = this.generateBaggageSpeqsHaveInfo(
                    this.generateBaggageTripsInformation(ancillariesInfo.slices, ancilleriesBaggageInfo.slices, cachedData),
                    this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE
                );
            }
            transformedInfo.baggagesQuanty = this.countBaggageTotal(transformedInfo.passengerBaggagesTrips);
        }

        transformedInfo.pendingSeats = this.CkiAncillariesUtilsService.checkEarlySegments();
        transformedInfo.upgradingInfo = this.CkiAncillariesUtilsService.getUpgradingInfo(transformedInfo.currency);
        transformedInfo.isPaFlow = this.localStorageService.get('isPaFlow');
        this.checkFlags(transformedInfo);
        return transformedInfo;
    };

    countSpeqsTotal = (passengers: any): any => this.sumOverPath(passengers, ['trips', 'pieces'], (piece) => piece.purchasedPieces + piece.quantySelected);

    transformAncillariesView = (transfomerFlow: any, ancillariesInfo: any, cachedData: any): any => {
        const transformedInfo = this.initTransformedAncillariesView(transfomerFlow, cachedData);
        const insuranceContext: InsuranceHandlerContext = { ancillariesInsuranceInfo: undefined, countryInsurance: '' };
        const handlers = this.getAncillarieTypeHandlers();

        ancillariesInfo.ancillaries.forEach((ancillarie) => {
            const handler = handlers[ancillarie.type];
            if (handler) {
                handler(ancillarie, transformedInfo, insuranceContext, ancillariesInfo, cachedData);
            }
        });

        this.InsuranceAncillaryTransformer.enrichInsuranceOffers(transformedInfo, insuranceContext, cachedData);
        this.InsuranceAncillaryTransformer.applyInsuranceCountryDefaults(transformedInfo, insuranceContext.countryInsurance);

        if (transformedInfo.ancillariesAvailable.length >= 1) {
            this.localStorageService.set('ancillariesSlices', ancillariesInfo.slices);
        }

        return angular.extend(transformedInfo, transfomerFlow);
    };

    private initTransformedAncillariesView (transfomerFlow: any, cachedData: any): TransformedAncillariesInfo {
        return {
            ancillariesAvailable: transfomerFlow.ancillariesAvailable ? transfomerFlow.ancillariesAvailable : [],
            ancillariesTrips: transfomerFlow.ancillariesTrips ? transfomerFlow.ancillariesTrips : [],
            ancillariesInsurance: [],
            insuranceInfo: {
                countriesList: [],
                insuranceCountry: null,
                id: null,
                price: null,
                priceZero: null,
                originalPrice: null,
                passengers: cachedData.passengers,
                conditionsUri: '',
                isModalLoading: false,
                countryInsurance: '',
                insurancePatterns: {},
                consent: '',
                issueCountry: null,
                oldInsuranceCountry: null
            },
            seatsAvailable: {
                status: false,
                priceFrom: 0
            },
            insuranceAvailable: false,
            insuranceAllianzFusionAvailable: false,
            bobAvailable: false,
            bobInfo: { slices: [], priceFrom: '', additionalBagsPrice: '' },
            currency: <any>this.localStorageService.get('currency'),
            ancillariesSpeqs: [],
            speqsAvailablePrice: {
                priceFrom: ''
            },
            speqsQuanty: 0,
            ancillariesCarbonFootprint: null,
            ancillariesTransfersGlobick: null
        };
    }

    /**
     * Dispatch table for transformAncillariesView's per-ancillary-type handling, replacing the
     * former if/else-if chain. Built per-call (not static) because keys depend on this.CheckinAncillariesConstants.
     * Handlers mutate transformedInfo/insuranceContext in place rather than returning a value.
     */
    private getAncillarieTypeHandlers (): { [type: string]: (ancillarie: any, transformedInfo: TransformedAncillariesInfo, insuranceContext: InsuranceHandlerContext, ancillariesInfo: any, cachedData: any) => void } {
        return {
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SEAT]: this.SeatAncillaryTransformer.handleSeatAncillarie,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INTEGRATED_BOB]: this.IntegratedBobAncillaryTransformer.handleIntegratedBobAncillarie,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INSURANCE]: this.InsuranceAncillaryTransformer.handleInsuranceAncillarie,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INSURANCE_ALLIANZ]: this.InsuranceAncillaryTransformer.handleInsuranceAllianzAncillarie,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS]: (ancillarie, transformedInfo, insuranceContext, ancillariesInfo, cachedData) =>
                this.SpeqsAncillaryTransformer.handleSpeqsAncillarie(ancillarie, transformedInfo, {
                    ancillariesInfo,
                    cachedData,
                    helpers: {
                        generateBaggageSpeqsHaveInfo: this.generateBaggageSpeqsHaveInfo,
                        countSpeqsTotal: this.countSpeqsTotal,
                        getInfoSegment: this.getInfoSegment
                    }
                }),
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.CO2_FOOTPRINT]: this.Co2FootprintAncillaryTransformer.handleCo2FootprintAncillarie,
            [this.CheckinAncillariesConstants.TYPE_ANCILLARIE.GLOBICK]: this.GlobickAncillaryTransformer.handleGlobickAncillarie
        };
    }

    /**
     *
     * @param {*} passengerId
     * @param {*} segmentId
     * @param {*} seat
     */
    updateCachedInformation = (passengerId: any, segmentId: any, seat: any): any => {
        const cachedInfo: any = this.localStorageService.get('bookingInfo');
        let j = 0,
            l,
            pasFound = false;
        while (!pasFound && j < cachedInfo.outwardSegments.length) {
            if (segmentId === cachedInfo.outwardSegments[j].id) {
                l = 0;
                while (!pasFound && l < cachedInfo.outwardSegments[j].passengers.length) {
                    if (passengerId === cachedInfo.outwardSegments[j].passengers[l].id) {
                        pasFound = true;
                        cachedInfo.outwardSegments[j].passengers[l].seat.row = seat.row;
                        cachedInfo.outwardSegments[j].passengers[l].seat.column = seat.column;
                    }
                    l++;
                }
            }
            j++;
        }
        j = 0;
        while (!pasFound && j < cachedInfo.returnSegments.length) {
            if (segmentId === cachedInfo.returnSegments[j].id) {
                l = 0;
                while (!pasFound && l < cachedInfo.returnSegments[j].passengers.length) {
                    if (passengerId === cachedInfo.returnSegments[j].passengers[l].id) {
                        pasFound = true;
                        cachedInfo.returnSegments[j].passengers[l].seat.row = seat.row;
                        cachedInfo.returnSegments[j].passengers[l].seat.column = seat.column;
                    }
                    l++;
                }
            }
            j++;
        }
        this.localStorageService.set('bookingInfo', cachedInfo);
    };

    /**
     * Update ancillaries information of passenger and save in localStorage
     * @param {Integer} passengerId LAYQL8
     * @param {Integer} segmentId
     */
    updateAncillariesInformation = (passengerId: any, segmentId: any): any => {
        let i = 0,
            k,
            pasFound = false;
        const ancillariesSeatInfo: any = this.localStorageService.get('ancillariesSeatInfo') || [];
        while (!pasFound && i < ancillariesSeatInfo.length) {
            if (ancillariesSeatInfo[i].id === parseInt(segmentId)) {
                k = 0;
                while (!pasFound && k < ancillariesSeatInfo[i].passengers.length) {
                    if (parseInt(passengerId) === ancillariesSeatInfo[i].passengers[k].id) {
                        pasFound = true;
                        ancillariesSeatInfo[i].passengers.splice(k, 1);
                        if (ancillariesSeatInfo[i].passengers.length === 0) {
                            ancillariesSeatInfo.splice(i, 1);
                        }
                        this.localStorageService.set('ancillariesSeatInfo', ancillariesSeatInfo);
                    }
                    k++;
                }
            }
            i++;
        }
    };

    /**
     *
     * @param {Object} data
     */
    transformDeleteResponse = (data: any): any => {
        const transformedDelete: any = {};
        if (data.failedToDelete && data.failedToDelete.length > 0) {
            transformedDelete.error = {
                message: data.failedToDelete[0].segments[0].error.description,
                internalErrorCode: data.failedToDelete[0].segments[0].error.code
            };
        } else if (data.ancillaries && data.ancillaries.length > 0) {
            transformedDelete.data = {
                row: data.ancillaries[0].segments[0].passengers[0].seat.row,
                column: data.ancillaries[0].segments[0].passengers[0].seat.column
            };
            this.updateCachedInformation(data.ancillaries[0].segments[0].passengers[0].id, data.ancillaries[0].segments[0].id, transformedDelete.data);
            this.updateAncillariesInformation(data.ancillaries[0].segments[0].passengers[0].id, data.ancillaries[0].segments[0].id);
        }
        return transformedDelete;
    };

    /**
     * Update ancillarie information of passengers in localStorage
     * @param {Object} transformedInfo
     * @param {Object} ancillariesLocalInfo
     */

    transformFromLocalStorage = (transformedInfo: TransformedAncillariesInfo, ancillariesLocalInfo: any): any => {
        updateBaggagesPassenger(transformedInfo, ancillariesLocalInfo);
        return transformedInfo;

        function updateBaggagesPassenger (transformedInfo, ancillariesLocalInfo) {
            for (let i = 0; i < transformedInfo.ancillariesTrips.length; i++) {
                if (transformedInfo.ancillariesTrips[i].baggages) {
                    for (let j = 0; j < transformedInfo.ancillariesTrips[i].baggages.passengersBaggage.length; j++) {
                        const passengerInfo = getLocalPassengerInformation(
                            ancillariesLocalInfo,
                            transformedInfo.ancillariesTrips[i].id,
                            transformedInfo.ancillariesTrips[i].baggages.passengersBaggage[j].id
                        );
                        if (passengerInfo !== null) {
                            transformedInfo.ancillariesTrips[i].baggages.passengersBaggage[j].baggageChoosed = passengerInfo.baggageChoosed;
                            transformedInfo.ancillariesTrips[i].baggages.passengersBaggage[j].totalBaggage += passengerInfo.baggageChoosed.quantity;
                            transformedInfo.ancillariesTrips[i].baggages.totalBaggages += passengerInfo.baggageChoosed.quantity;
                            transformedInfo.ancillariesTrips[i].baggages.numExtraBaggages += passengerInfo.baggageChoosed.quantity;
                        }
                    }
                }
            }

            function getLocalPassengerInformation (ancillariesLocalInfo, tripId, passengerId) {
                let pasInfo = null,
                    i = 0,
                    j,
                    found = false;
                while (!found && i < ancillariesLocalInfo.ancillariesTrips.length) {
                    if (ancillariesLocalInfo.ancillariesTrips[i].id === tripId) {
                        j = 0;
                        while (!found && j < ancillariesLocalInfo.ancillariesTrips[i].baggages.passengersBaggage.length) {
                            if (ancillariesLocalInfo.ancillariesTrips[i].baggages.passengersBaggage[j].id === passengerId) {
                                found = true;
                                pasInfo = ancillariesLocalInfo.ancillariesTrips[i].baggages.passengersBaggage[j];
                            }
                            j++;
                        }
                    }
                    i++;
                }
                return pasInfo;
            }
        }
    };

    private createEmptyDeleteSliceEntry (type: any, sliceId: any): any {
        return { type, slices: [{ id: sliceId, passengers: [{ subtypes: [] }] }] };
    }

    buildDeleteAllAncillariesBaggageRequest = (model: any, typeAncillarie: any, passengerBaggagesTrips: any): any => {
        let ancillariesData: any = {},
            cont = 0;
        const deleteRequest = [];
        model.trips.forEach((data) => {
            ancillariesData = this.createEmptyDeleteSliceEntry(typeAncillarie, data.id);
            data.pieces?.forEach((piece) => {
                if (piece.quantySelected > 0) {
                    ancillariesData.slices[0].passengers[0].subtypes.push(piece.subtype);
                }
            });
            if (ancillariesData.slices[0].passengers[0].subtypes.length > 0) {
                deleteRequest.push(ancillariesData);
            }
        });
        passengerBaggagesTrips.forEach((data) => {
            data.trips.forEach((trip) => {
                trip.pieces?.forEach((piece) => {
                    if (piece.quantySelected > 0) {
                        deleteRequest.forEach((delReq) => {
                            if (piece.quantySelected > 0) {
                                delReq.slices[0].passengers[0].id = model.id;
                            }
                        });
                    }
                });
                cont++;
            });
        });
        return deleteRequest;
    };

    mergePassengerItemsForDelete = (deleteInfo: any): any => {
        let cont = 0,
            deleteInfoReturn,
            skip;
        if (deleteInfo[0].length >= deleteInfo[1].length) {
            deleteInfoReturn = deleteInfo[0];
            skip = 0;
        } else {
            deleteInfoReturn = deleteInfo[1];
            skip = 1;
        }
        deleteInfo.forEach((data) => {
            if (cont !== skip) {
                deleteInfoReturn.forEach((deleteRetunr, index) => {
                    if (data[index] && deleteRetunr.slices[0].id === data[index].slices[0].id) {
                        deleteRetunr.slices[0].passengers.push(data[index].slices[0].passengers[0]);
                    }
                });
            }
            cont++;
        });
        return deleteInfoReturn;
    };

    buildDeleteOneAncillariesBaggageRequest = (model: any, typeAncillarie: any, baggageTypeSelected: any, segmentId: any, passengerBaggagesTrips: any): any => {
        let ancillariesData: any = {},
            passengerIdTemp = null,
            passengerTemp = null,
            check = false;
        const deleteRequest = [];
        model.trips.forEach((data) => {
            if (data.id === segmentId) {
                ancillariesData = this.createEmptyDeleteSliceEntry(typeAncillarie, segmentId);
                ancillariesData.slices[0].passengers[0].subtypes.push(baggageTypeSelected);
                if (ancillariesData.slices[0].passengers[0].subtypes.length > 0) {
                    deleteRequest.push(ancillariesData);
                }
            }
        });
        passengerBaggagesTrips.forEach((data) => {
            passengerIdTemp = data.id;
            data.trips.forEach((trip) => {
                if (trip.id === segmentId) {
                    trip.pieces?.forEach((piece) => {
                        if (piece.subtype === baggageTypeSelected && piece.quantySelected > 0) {
                            if (!check) {
                                deleteRequest[0].slices[0].passengers[0].id = passengerIdTemp;
                                check = true;
                            } else {
                                passengerTemp = { ...deleteRequest[0].slices[0].passengers[0] };
                                passengerTemp.id = passengerIdTemp;
                                deleteRequest[0].slices[0].passengers.push(passengerTemp);
                            }
                        }
                    });
                }
            });
        });
        return deleteRequest;
    };

    /**
     * Builds the delete ancillaries request to deleta a trip baggage
     * @param {Integer} index the trip index to be deleted
     * @param {Object} model the current model page state
     */
    buildDeleteAncillariesBaggageRequest = (index: any, model: any): any => {
        let j,
            pasLength,
            ancillariesData: any = {};
        const deleteRequest = [];
        if (index >= 0 && index < model.ancillariesTrips.length) {
            ancillariesData = {
                type: 'BAGGAGE',
                trips: [{ id: model.ancillariesTrips[index].id, passengers: [] }]
            };
            for (j = 0, pasLength = model.ancillariesTrips[index].baggages.passengersBaggage.length; j < pasLength; j++) {
                if (model.ancillariesTrips[index].baggages.passengersBaggage[j].totalBaggage > 0) {
                    ancillariesData.trips[0].passengers.push(model.ancillariesTrips[index].baggages.passengersBaggage[j].id);
                }
            }
            deleteRequest.push(ancillariesData);
        }
        return deleteRequest;
    };

    /**
     * Update Insurance from localStorage
     * @param {Object} transformedInfo Information of ancillaries for update with new insurance
     */
    updateInsuranceSelected = (transformedInfo: TransformedAncillariesInfo): any => {
        const insuranceSelected: any = this.localStorageService.get('insuranceSelected');
        if (insuranceSelected) {
            transformedInfo.insuranceInfo = insuranceSelected;
            transformedInfo.ancillariesInsurance[0].id = insuranceSelected.id;
            transformedInfo.ancillariesInsurance[0].originalPrice = insuranceSelected.originalPrice;
            transformedInfo.ancillariesInsurance[0].price = insuranceSelected.price;
            transformedInfo.ancillariesInsurance[0].termsAndConditionsDocumentURI = insuranceSelected.conditionsUri;
        }

        return transformedInfo;
    };

    /**
     * Return quantry of baggages selected
     * @param {Array} passengerTrips List of trips
     */
    calculateTotalBaggages = (passengerTrips: any): any => this.sumOverPath(passengerTrips, ['trips'], (trip) => trip.piecesChoosed);

    /**
     * Return quantry of speqs selected
     * @param {Array} passengerTrips List of trips
     */
    calculateTotalSpeqs = (passengerTrips: any): any => this.sumOverPath(passengerTrips, ['trips'], (trip) => trip.speqsChoosed);

    /**
     *
     * @param {Object} seats
     */
    calculateTotalSeats = (segments): any =>
        this.sumOverPath(segments, ['passengers'], (pas) =>
            (pas.currentSeat.row !== pas.initialSeat.row || pas.currentSeat.column !== pas.initialSeat.column) ? 1 : 0);

    countSeatsTotal = (orderItems: any): any => this.sumOverPath(orderItems, ['segments'], (segment) => segment.passengers.length);

    /**
     * Update seats information of passenger returned by service when delete seat of passenger.
     * @param {*} trips Ancillaries trips
     * @param {*} seats Seats returned by service for update
     */
    updateSeatInformation = (passengerTrips: any, segmentSeats: any): any => {
        passengerTrips.forEach((trip) => {
            trip.segments.forEach((segment) => {
                segmentSeats.forEach((segmentSeat) => {
                    if (segment.id.toString() === segmentSeat.id) {
                        segment.passengers.forEach((pasTrip) => {
                            segmentSeat.passengers.forEach((pasUpdated) => {
                                if (pasTrip.id.toString() === pasUpdated.id) {
                                    pasTrip.seat = pasUpdated.seat;
                                    pasTrip.hasSeatPrice = false;
                                }
                            });
                        });
                    }
                });
            });
        });
    };

    /**
     * Return array with segments seats update by service
     * @param {Object} seatInfo
     */
    getUpdateSeatInfo = (seatInfo: any): any =>
        seatInfo.seats.flatMap((typeSeat) => typeSeat.segments.map((segment) => ({ id: segment.id, passengers: segment.passengers })));

    /**
     * Return array with the additional info if is required
     * @param {Object} insurance data of the insurance selected
     */
    hasAdditionalInfo = (insurance: any): any => {
        let i = 0,
            additionalInfoFound = false,
            additionalInfo = [];
        if (insurance.passengerInfo) {
            while (!additionalInfoFound && i < insurance.passengerInfo.length) {
                if (insurance.passengerInfo[i].document) {
                    additionalInfoFound = true;
                    additionalInfo = [
                        {
                            passengerId: insurance.passengerInfo[i].passengerId ? insurance.passengerInfo[i].passengerId : insurance.passengerInfo[i].id,
                            policyHolder: true,
                            values: [
                                { idDoc: insurance.passengerInfo[i].document, type: 'DOCUMENT_ID' },
                                { birthDate: insurance.passengerInfo[i].birthDate, type: 'BIRTH_DATE' }
                            ]
                        }
                    ];
                }
                i++;
            }
        }
        return additionalInfo;
    };

    /**
     * Delegates to AncillariesHeaderBasketTransformer (extracted to keep this file/module's
     * size down for CodeScene). Public name/signature preserved so callers don't need to change.
     */
    generateAncillariesHeaderInfo = (breakDownInfo: any, segmentsInfo: FlatSegmentInfo[]): AncillariesHeaderBasket =>
        this.AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, segmentsInfo);

    /**
     * Build information with ancillaries selected  for send to service
     * @param {Array} passengersBaggages
     * @param {Array} passengersSpeqs
     * @param {Object} passengerInsurance
     */
    /**
     * Consolidates the former addBaggage/addSpeq closures (near-verbatim duplicates) into one
     * implementation parametrized by which "choosed" count field gates processing and which
     * ancillary type the resulting request carries.
     */
    private buildAncillaryTripsRequest (passengers: any[], choosedCountField: string, type: any): AncillaryTripsRequest {
        const tripsRequest: AncillaryTripsRequest = { slices: [], type };
        passengers.forEach((pas) => {
            pas.trips?.forEach((trip) => {
                if (trip[choosedCountField] > 0) {
                    trip.pieces?.forEach((piece) => {
                        if (piece.quantySelected > 0) {
                            this.addPieceToTripsRequest(tripsRequest, trip, pas, piece);
                        }
                    });
                }
            });
        });
        return tripsRequest;
    }

    /**
     * Guard-clause/`.find()` rewrite of the original's isSliceFound/isPasFound/isPieceFound flags
     * + angular.forEach scan. Behaviorally equivalent because slice/passenger/subtype ids are
     * unique, so `.find()`'s first match is the same element the flag-based scan would have found.
     */
    private addPieceToTripsRequest (tripsRequest: any, trip: any, pas: any, piece: any): void {
        const existingSlice = tripsRequest.slices.find((slice: any) => slice.id === trip.id);
        if (!existingSlice) {
            tripsRequest.slices.push(this.createNewAncillaryTripEntry(trip.id, pas.id, piece));
            return;
        }
        const existingPassenger = existingSlice.passengers.find((p: any) => p.id === pas.id);
        if (!existingPassenger) {
            existingSlice.passengers.push(this.createNewPassengerSubtypesEntry(pas.id, piece));
            return;
        }
        const existingSubtype = existingPassenger.subtypes.find((s: any) => s.subtype === piece.subtype);
        if (existingSubtype) {
            existingSubtype.units += piece.quantySelected;
        } else {
            existingPassenger.subtypes.push({ subtype: piece.subtype, units: piece.quantySelected });
        }
    }

    private createNewAncillaryTripEntry (tripId: any, passengerId: any, piece: any): any {
        return { id: tripId, passengers: [this.createNewPassengerSubtypesEntry(passengerId, piece)] };
    }

    private createNewPassengerSubtypesEntry (passengerId: any, piece: any): any {
        return { id: passengerId, subtypes: [{ subtype: piece.subtype, units: piece.quantySelected }] };
    }

    private buildInsuranceRequestEntry (passengerInsurance: any): any {
        this.localStorageService.set('selectedInsurance', passengerInsurance);
        this.localStorageService.set('hasSelectedInsurance', true);
        return {
            type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.INSURANCE,
            offer: passengerInsurance.code ? passengerInsurance.code : passengerInsurance.id,
            addons: [],
            additionalInfo: this.hasAdditionalInfo(passengerInsurance)
        };
    }

    buildAncillariesRequest = (passengersBaggages: any, passengersSpeqs: any, passengerInsurance: any): any => {
        const requestAncilaries = [];

        if (passengersBaggages && passengersBaggages.length > 0) {
            const baggageTrips = this.buildAncillaryTripsRequest(passengersBaggages, 'piecesChoosed', this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE);
            if (baggageTrips.slices.length > 0) {
                requestAncilaries.push(baggageTrips);
            }
        }
        if (passengersSpeqs && passengersSpeqs.length > 0) {
            const sepqTrips = this.buildAncillaryTripsRequest(passengersSpeqs, 'speqsChoosed', this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS);
            if (sepqTrips.slices.length > 0) {
                requestAncilaries.push(sepqTrips);
            }
        }
        if (passengerInsurance) {
            requestAncilaries.push(this.buildInsuranceRequestEntry(passengerInsurance));
        }

        return requestAncilaries;
    };

    passengerTransformData = (cacheData: any, summaryInfo: any): any => {
        summaryInfo.context.passengers.forEach((passenger) => {
            cacheData.passengers.forEach((passengerCache, index) => {
                if (passengerCache.passengerId === passenger.id) {
                    cacheData.passengers[index].personalInfo.infant = passenger.infant;
                    cacheData.passengers[index].resiberId = passenger.resiberId;
                }
            });
        });

        return cacheData;
    };

    /**
     * Creación de metodo que devuelve la estructura correcta del ancillaries
     * para que se pueda hacer su transformer correspondiente
     * @param passengers
     * @returns
     */
    genStructureForAncillaries = (passengers) => {
        return passengers.map((passengers) => ({
            id: passengers.id,
            trips: passengers.trips
        }));
    };

    /**
     * Creación de metodo que devuelve la estructura con el ID correcto
     * para que se pueda hacer su transformer correspondiente
     * @param passen
     * @returns
     */
    genStructureForCKIAncillaries = (passen) => {
        const pass: any = this.localStorageService.get('bookingInfo');
        const LS_passenger = pass.passengers;
        passen.forEach((myObject, index) => {
            LS_passenger[index].id < 10 ? (LS_passenger[index].id = '0' + LS_passenger[index].id) : LS_passenger[index].id;
            myObject.id = LS_passenger[index].type + '_' + LS_passenger[index].id;
        });

        return passen;
    };

    genReqAviosAncillariesBaggages = (passengersData: any[]) => {
        const ancillariesSlices: any[] = this.localStorageService.get('ancillariesSlices');
        passengersData = this.genStructureForCKIAncillaries(passengersData);
        return passengersData.map((passenger) => ({
            id: passenger.id,
            ancillaries: passenger.trips
                .flatMap((trip) =>
                    trip.pieces.map((baggage) => ({
                        type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.BAGGAGE,
                        subType: baggage.subtype,
                        slices: [
                            {
                                id: trip.id,
                                amounts: baggage.availablePriceRanges
                                    .filter((price) => price.from <= baggage.quantySelected)
                                    .map((price) => ({
                                        fare: price.amount,
                                        quantity: Math.min(price.to - price.from + 1, baggage.quantySelected - price.from + 1)
                                    })),
                                segments:
                                    ancillariesSlices
                                        .find((el) => el.id === trip.id)
                                        ?.segmentIds.map((seg) => ({
                                            id: seg
                                        })) || []
                            }
                        ]
                    }))
                )
                .filter((el) => el.slices[0].amounts.length > 0)
        }));
    };
    //Prioridad de embarque
    genAviosPriorityReq = (priorityBoarding: any[]) => {
        priorityBoarding = this.genStructureForCKIAncillaries(priorityBoarding);
        const ancillariesSlices: any[] = this.localStorageService.get('ancillariesSlices');
        return priorityBoarding.map((passenger) => ({
            id: passenger.id,
            ancillaries: [
                {
                    type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.PRIORITY_BOARDING,
                    slices: passenger.trips.reduce((arr, segment) => {
                        if (segment.checkedTrip) {
                            const sliceId = ancillariesSlices.find((slice) => slice.segmentIds.includes(segment.id))?.id;
                            const i = arr.findIndex((el) => el.id === sliceId);
                            if (i >= 0) {
                                arr[i].segments.push({
                                    id: segment.id,
                                    amounts: [
                                        {
                                            fare: segment.amount,
                                            quantity: 1
                                        }
                                    ]
                                });
                            } else {
                                arr.push({
                                    id: sliceId,
                                    segments: [
                                        {
                                            id: segment.id,
                                            amounts: [
                                                {
                                                    fare: segment.amount,
                                                    quantity: 1
                                                }
                                            ]
                                        }
                                    ]
                                });
                            }
                        }
                        return arr;
                    }, [])
                }
            ]
        }));
    };
    //equipajes especiales
    genAviosSpeqReq = (speqs: any[]) => {
        const ancillariesSlices: any[] = this.localStorageService.get('ancillariesSlices');
        speqs = this.genStructureForCKIAncillaries(speqs);
        return speqs.map((speq) => ({
            id: speq.id,
            ancillaries: speq.trips
                .flatMap((trip) =>
                    trip.pieces.map((piece) => ({
                        type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS,
                        subType: piece.subtype,
                        slices: [
                            {
                                id: trip.id,
                                amounts: piece.availablePriceRanges
                                    .map((price) => ({ fare: price.amount, quantity: piece.quantySelected }))
                                    .reduce((arr, el) => {
                                        if (el.quantity > 0) arr.push(el);
                                        return arr;
                                    }, []),
                                segments:
                                    ancillariesSlices
                                        .find((el) => el.id === trip.id)
                                        ?.segmentIds.map((seg) => ({
                                            id: seg
                                        })) || []
                            }
                        ]
                    }))
                )
                .filter((el) => el.slices[0].amounts.length > 0)
        }));
    };

    genAviosFlexOnDemandReq = (flexData) => {
        const ancillariesSlices: any[] = this.localStorageService.get('ancillariesSlices');
        return flexData.passengerPrices.map((passenger) => ({
            id: passenger.id,
            ancillaries: [
                {
                    type: this.CheckinAncillariesConstants.TYPE_ANCILLARIE.FLEXIBILITY,
                    subType: flexData.subtype,
                    amounts: [
                        {
                            fare: passenger.amount,
                            quantity: 1
                        }
                    ],
                    slices: [
                        {
                            id: ancillariesSlices[0].id,
                            segments: [
                                {
                                    id: ancillariesSlices[0].segmentIds[0]
                                }
                            ]
                        }
                    ]
                }
            ]
        }));
    };
    genAviosAncillariesReq = (ancillariesArr: any[]) => {
        const flightInfo: any = this.localStorageService.get('flightAviosInfo');
        try {
            flightInfo.passengers.forEach((passenger) => {
                const ancillary = ancillariesArr.find((anci) => anci.id === passenger.id);
                delete passenger.flight;
                if (ancillary) {
                    passenger.ancillaries = ancillary.ancillaries;
                } else {
                    passenger.ancillaries = [];
                }
            });
            return flightInfo;
        } catch (error) {
            return {};
        }
    };

    //request general Ancillaries
    genAviosAncillariesSummaryReq = (ancillariesPassengers, type) => {
        const flightInfo: any = this.localStorageService.get('flightAviosInfo');
        const updateAncillaries = (passengersArray, ancillariesArray, type) => {
            passengersArray.forEach((passenger) => {
                const newAncillaries = ancillariesArray.find((el) => el.id === passenger.id)?.ancillaries;
                if (passenger.ancillaries) {
                    passenger.ancillaries = passenger.ancillaries.filter((typ) => {
                        return typ.type !== type;
                    });
                    newAncillaries.forEach((ancillary) => passenger.ancillaries.push(ancillary));
                } else {
                    passenger.ancillaries = newAncillaries;
                }
            });

            return passengersArray;
        };

        try {
            this.localStorageService.set('flightAviosInfo', {
                currency: flightInfo.currency,
                flight: flightInfo.flight,
                passengers: updateAncillaries(flightInfo.passengers, ancillariesPassengers, type)
            });
        } catch (error) {
            return {};
        }
    };

    TransCalcPointsData = (data) => {
        return data.passengers.map((passenger) => ({
            id: passenger.id,
            ancillaries: passenger.ancillaries.map((ancillary) => ({
                code: ancillary.code,
                subCode: ancillary.subCode,
                monetaryAmount: ancillary.monetaryAmount
            })),
            totalMonetaryAmount: passenger.totalMonetaryAmount
        }));
    };
    deleteAncillaryByType = (segId: string, type: string, passengers: any[]): any[] => {
        const ancillariesSlices: any[] = this.localStorageService.get('ancillariesSlices');
        const sliceId = ancillariesSlices.find((anc) => anc.segmentIds.includes(segId))?.id || null;
        return passengers.map((passenger) => ({
            ...passenger,
            ancillaries: passenger.ancillaries
                .map((anc) => ({ ...anc, slices: anc.slices.filter((slice) => !(type === anc.type && sliceId === slice.id)) }))
                .filter((anc) => anc.slices.length > 0)
        }));
    };
    deleteAncillaryBySubType = (sliceId: string, subType: string, passengers: any[]): any[] =>
        passengers.map((passenger) => ({
            ...passenger,
            ancillaries: sliceId
                ? passenger.ancillaries.filter((anc) => !(subType === anc.subType && sliceId === anc.slices[0].id))
                : passenger.ancillaries.filter((anc) => subType !== anc.subType)
        }));

    genCalAviosFligthReq = (summaryInfo) => {
        const passengerIdBuilder = (id, type) => `${type}_${id < 9 ? '0' + id : id}`;
        return {
            currency: { code: summaryInfo?.currencies[0]?.code },
            flight: {
                yq: 0,
                discounts: [],
                slices: summaryInfo.context?.slices.map((slice) => ({
                    id: slice.id,
                    segments: summaryInfo.context.segments
                        .filter((segment) => slice.segmentIds[0] === segment.id)
                        .map((segmentMap) => ({
                            id: segmentMap.id,
                            operatingCarrier: {
                                code: segmentMap.operatingFlight?.cabin?.carrier
                            },
                            marketingCarrier: {
                                code:
                                    segmentMap.marketingFlight?.cabin?.carrier ||
                                    (segmentMap.operatingFlight?.cabin?.carrier === 'YW' ? 'IB' : segmentMap.operatingFlight?.cabin?.carrier)
                            },
                            schedule: {
                                departureAirportCode: segmentMap.departureAirport,
                                arrivalAirportCode: segmentMap.arrivalAirport,
                                departureDate: segmentMap.departureDate.split(' ')[0]
                            },
                            bookingClass: {
                                code: segmentMap.operatingFlight.cabin.cabinClass.rbd
                            },
                            bookingCabin: {
                                code: segmentMap.passengerCoupons[0]?.seat?.column
                            }
                        }))
                }))
            },
            passengers: summaryInfo.context.passengers.map((passenger) => ({
                id: passengerIdBuilder(passenger.id, passenger.passengerType),
                memberIdentifier: passenger.frequentFlyer?.number || null,
                ancillaries: [],
                flight: null
            }))
        };
    };
}

AncillariesTransformer.$inject = [
    'CurrencyService',
    'CheckinAncillariesConstants',
    'localStorageService',
    'CkiAncillariesUtilsService',
    '$rootScope',
    '$filter',
    'CkiDatalayerUtilsService',
    'AncillariesHeaderBasketTransformer',
    'SeatAncillaryTransformer',
    'IntegratedBobAncillaryTransformer',
    'InsuranceAncillaryTransformer',
    'Co2FootprintAncillaryTransformer',
    'GlobickAncillaryTransformer',
    'SpeqsAncillaryTransformer'
];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('AncillariesTransformer', AncillariesTransformer);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('AncillariesTransformer', AncillariesTransformer);
}
