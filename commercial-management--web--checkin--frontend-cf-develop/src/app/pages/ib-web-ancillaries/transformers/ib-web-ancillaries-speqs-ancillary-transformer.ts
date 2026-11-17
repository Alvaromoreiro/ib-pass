import * as angular from 'angular';
import { CkiAncillariesUtilsService } from '@pages/ib-web-ancillaries/services/ib-ckeckin-ancillaries-utils';
import { BookingSegmentInfo, TransformedAncillariesInfo } from '@pages/ib-web-ancillaries/transformers/ib-web-ancillaries-transformer.model';

type GetInfoSegment = (segmentId: string, segmentsInfo: BookingSegmentInfo[]) => { departure: CkiBookingInfo.Airport | null; arrival: CkiBookingInfo.Airport | null };

export interface SpeqsHandlerHelpers {
    generateBaggageSpeqsHaveInfo: (info: any, type: any) => any;
    countSpeqsTotal: (passengers: any) => any;
    getInfoSegment: GetInfoSegment;
}

export interface SpeqsHandlerContext {
    ancillariesInfo: any;
    cachedData: any;
    helpers: SpeqsHandlerHelpers;
}

export interface SpeqsTripsContext {
    cachedData: any;
    currency: CommonsCurrencyModel.CurrencyResponse;
    getInfoSegment: GetInfoSegment;
}

/**
 * SPEQS-ancillary handling extracted from AncillariesTransformer's transformAncillariesView
 * dispatch table, to keep that file/module's size down for CodeScene. generateBaggageSpeqsHaveInfo/
 * countSpeqsTotal/getInfoSegment stay in AncillariesTransformer (shared with baggage/priority-boarding)
 * and are passed in at call time via the `helpers` param instead of being duplicated here.
 */
export class SpeqsAncillaryTransformer {
    constructor (
        private CheckinAncillariesConstants: CheckinAncillariesConstants,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private CurrencyService: CurrencyService,
        private CkiAncillariesUtilsService: CkiAncillariesUtilsService
    ) {}

    handleSpeqsAncillarie = (ancillarie: any, transformedInfo: TransformedAncillariesInfo, context: SpeqsHandlerContext): void => {
        const { ancillariesInfo, cachedData, helpers } = context;
        if (ancillarie.status.code === this.CheckinAncillariesConstants.STATUS.AVAILABLE) {
            transformedInfo.ancillariesAvailable.push(ancillarie.type);
            if (this.localStorageService.get('passengerSpeqsTrips')) {
                transformedInfo.ancillariesSpeqs = this.localStorageService.get('passengerSpeqsTrips');
            } else {
                transformedInfo.ancillariesSpeqs = helpers.generateBaggageSpeqsHaveInfo(
                    this.generateSpeqsTripsInformation(ancillariesInfo.slices, ancillarie.slices, {
                        cachedData,
                        currency: transformedInfo.currency,
                        getInfoSegment: helpers.getInfoSegment
                    }),
                    this.CheckinAncillariesConstants.TYPE_ANCILLARIE.SPEQS
                );
            }
            transformedInfo.speqsAvailablePrice.priceFrom = this.CurrencyService.formatPrice(
                transformedInfo.currency,
                Math.floor(ancillarie.priceFrom),
                false,
                false
            );
            transformedInfo.speqsQuanty = helpers.countSpeqsTotal(transformedInfo.ancillariesSpeqs);
        }
    };

    /**
     * Return passenger speqs trips information
     * @param {Array} ancillariesSlices
     * @param {Array} ancillariesTrips
     * @param {SpeqsTripsContext} context
     */
    //TODO:  Mover a transformer de speqs en ib-web-ancillaries. El codigo se encuentra duplicado lo cual hace que sea dificil de mantener.
    generateSpeqsTripsInformation = (ancillariesSlices: any, ancillariesTrips: any, context: SpeqsTripsContext): any => {
        const { cachedData, currency, getInfoSegment } = context;
        const passengersSpeqs = [];
        const segmentsInfo: BookingSegmentInfo[] = this.CkiAncillariesUtilsService.getBookingSegmentInformation();
        const slicesMap = new Map<string, any>(ancillariesSlices.map(s => [s.id, s]));


        const processingContext = {
            slicesMap,
            segmentsInfo,
            currency,
            getInfoSegment
        };

        const availableTrips = ancillariesTrips.filter(
            trip => trip.status.code === this.CheckinAncillariesConstants.GENERAL_STATUS.AVAILABLE
        );


        for (const trip of availableTrips) {
            for (const passengerTrip of trip.passengers) {
                if (passengerTrip.maxAdditionalPieces <= 0) {
                    continue;
                }

                const newTripObject = this.buildTripObject(passengerTrip, trip, processingContext);
                this.addTripToResults(passengersSpeqs, newTripObject, passengerTrip.id, cachedData);
            }
        }

        return passengersSpeqs;
    };

    private buildTripObject (passengerTrip: any, tripData: any, context: { slicesMap: Map<string, any>; segmentsInfo: BookingSegmentInfo[]; currency: CommonsCurrencyModel.CurrencyResponse; getInfoSegment: GetInfoSegment }): any {
        const trip: any = {
            id: tripData.id,
            pieces: [],
            maxAdditionalPieces: passengerTrip.maxAdditionalPieces,
            speqsChoosed: 0,
            totalPrice: 0,
            departure: null,
            arrival: null
        };

        const slice = context.slicesMap.get(tripData.id);
        if (slice) {
            if (slice.segmentIds.length > 1) {
                trip.departure = context.getInfoSegment(slice.segmentIds[0], context.segmentsInfo).departure;
                trip.arrival = context.getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], context.segmentsInfo).arrival;
            } else {
                angular.extend(trip, context.getInfoSegment(slice.segmentIds[0], context.segmentsInfo));
            }
        }

        passengerTrip.pieces.forEach((pasPieces: any) => {
            if (pasPieces.status.code === this.CheckinAncillariesConstants.GENERAL_STATUS.AVAILABLE) {
                pasPieces.quantySelected = 0;
                trip.pieces.push(pasPieces);
            } else if (pasPieces.status.code === 'NOT_AVAILABLE' && pasPieces.subtype === 'SURFBOARD') {
                pasPieces.quantySelected = 0;
                trip.pieces.push(pasPieces);
            }
        });

        this.getPiecePriceFormmated(trip, context.currency);
        return trip;
    }

    /**
     * Añade un viaje procesado al array final de resultados. Si el pasajero ya existe,
     * le añade el viaje; si no, crea una nueva entrada para el pasajero.
     */
    private addTripToResults (passengersSpeqs: any[], newTrip: any, passengerId: string, cachedData: any): void {
        const existingPassenger = passengersSpeqs.find(p => p.id === passengerId);

        if (existingPassenger) {
            existingPassenger.trips.push(newTrip);
        } else {
            const newPassenger = {
                id: passengerId,
                trips: [newTrip],
                info: this.getInfoPassenger(passengerId, cachedData)
            };
            passengersSpeqs.push(newPassenger);
        }
    }


    private getInfoPassenger = (id: any, cachedData): any => {
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

    private getPiecePriceFormmated = (trip: any, currency: CommonsCurrencyModel.CurrencyResponse): any => {
        let i, k;
        for (i = 0; i < trip.pieces.length; i++) {
            for (k = 0; k < trip.pieces[i].availablePriceRanges.length; k++) {
                trip.pieces[i].availablePriceRanges[k].amountPrice = this.CurrencyService.formatPrice(
                    currency,
                    trip.pieces[i].availablePriceRanges[k].amount,
                    false,
                    false,
                    true
                );
            }
        }
    };
}

SpeqsAncillaryTransformer.$inject = ['CheckinAncillariesConstants', 'localStorageService', 'CurrencyService', 'CkiAncillariesUtilsService'];
try {
    const mod = angular.module('ib-checkin-ancillaries-module');
    mod.service('SpeqsAncillaryTransformer', SpeqsAncillaryTransformer);
} catch (error) {
    const mod = angular.module('ib-checkin-ancillaries-module', []);
    mod.service('SpeqsAncillaryTransformer', SpeqsAncillaryTransformer);
}
