import * as angular from 'angular';
import { SpeqsAncillaryTransformer } from './ib-web-ancillaries-speqs-ancillary-transformer';
import { CkiAncillariesUtilsService } from '@src/app/pages/ib-web-ancillaries/services/ib-ckeckin-ancillaries-utils';
import type { SpeqsHandlerContext, SpeqsTripsContext } from './ib-web-ancillaries-speqs-ancillary-transformer';
import type { BookingSegmentInfo, TransformedAncillariesInfo } from './ib-web-ancillaries-transformer.model';

interface SpeqsSegmentInfoFixture {
    id: string;
    departure: { airport: string };
    arrival: { airport: string };
}

describe('SpeqsAncillaryTransformer', () => {
    let SpeqsAncillaryTransformer: SpeqsAncillaryTransformer;

    let currencyServiceMock: jasmine.SpyObj<CurrencyService>;
    let checkinAncillariesConstantsMock: Pick<CheckinAncillariesConstants, 'GENERAL_STATUS' | 'STATUS' | 'TYPE_ANCILLARIE'>;
    let localStorageServiceMock: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;
    let ckiAncillariesUtilsServiceMock: jasmine.SpyObj<CkiAncillariesUtilsService>;

    beforeEach(() => {
        currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['formatPrice']);
        currencyServiceMock.formatPrice.and.callFake((currency, amount) => `fmt:${amount}`);
        checkinAncillariesConstantsMock = {
            GENERAL_STATUS: { AVAILABLE: 'AVAILABLE' },
            STATUS: { AVAILABLE: 'AVAILABLE', NOT_AVAILABLE: 'NOT_AVAILABLE' },
            TYPE_ANCILLARIE: { SPEQS: 'SPECIAL_EQUIPMENT' }
        } as Pick<CheckinAncillariesConstants, 'GENERAL_STATUS' | 'STATUS' | 'TYPE_ANCILLARIE'>;
        localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['get', 'set']);
        ckiAncillariesUtilsServiceMock = jasmine.createSpyObj('CkiAncillariesUtilsService', ['getBookingSegmentInformation']);

        angular.mock.module('ib-checkin-ancillaries-module', ($provide) => {
            $provide.value('CurrencyService', currencyServiceMock);
            $provide.value('CheckinAncillariesConstants', checkinAncillariesConstantsMock);
            $provide.value('localStorageService', localStorageServiceMock);
            $provide.value('CkiAncillariesUtilsService', ckiAncillariesUtilsServiceMock);
        });

        inject((_SpeqsAncillaryTransformer_) => {
            SpeqsAncillaryTransformer = _SpeqsAncillaryTransformer_;
        });
    });

    describe('generateSpeqsTripsInformation', () => {
        const mockSegmentsInfo: SpeqsSegmentInfoFixture[] = [
            { id: 'seg-1', departure: { airport: 'Madrid' }, arrival: { airport: 'Barcelona' } },
            { id: 'seg-2', departure: { airport: 'Barcelona' }, arrival: { airport: 'París' } }
        ];

        const mockCachedData = {
            passengers: [ { id: 'p1', name: 'John', surname: 'Doe', infant: null } ]
        };

        const mockTransformedInfo = {
            currency: { code: 'EUR' }
        };

        const getInfoSegment = (segmentId: string, segmentsInfo: SpeqsSegmentInfoFixture[]) => {
            const info: { departure: string | null; arrival: string | null } = { departure: null, arrival: null };
            for (let i = 0; i < segmentsInfo.length; i++) {
                if (segmentsInfo[i].id.toString() === segmentId) {
                    info.arrival = segmentsInfo[i].arrival.airport;
                    info.departure = segmentsInfo[i].departure.airport;
                }
            }
            return info;
        };

        beforeEach(() => {
            ckiAncillariesUtilsServiceMock.getBookingSegmentInformation.and.returnValue(mockSegmentsInfo as unknown as BookingSegmentInfo[]);
        });

        it('should transform a simple trip and passenger correctly', () => {
            const mockAncillariesSlices = [{ id: 'seg-1', segmentIds: ['seg-1'] }];
            const mockAncillariesTrips = [{
                id: 'seg-1',
                status: { code: 'AVAILABLE' },
                passengers: [{ id: 'p1', maxAdditionalPieces: 1, pieces: [{ status: { code: 'AVAILABLE' }, subtype: 'BICYCLE', availablePriceRanges: [] }] }]
            }];

            const result = SpeqsAncillaryTransformer.generateSpeqsTripsInformation(mockAncillariesSlices, mockAncillariesTrips, {
                cachedData: mockCachedData,
                currency: mockTransformedInfo.currency as CommonsCurrencyModel.CurrencyResponse,
                getInfoSegment: getInfoSegment as unknown as SpeqsTripsContext['getInfoSegment']
            });

            expect(result.length).toBe(1);
            const passenger = result[0];
            expect(passenger.id).toBe('p1');
            expect(passenger.info.name).toBe('John');

            const trip = passenger.trips[0];
            expect(trip.id).toBe('seg-1');
            expect(trip.departure).toBe('Madrid');
            expect(trip.arrival).toBe('Barcelona');
        });
    });

    describe('handleSpeqsAncillarie', () => {
        const baseTransformedInfo = () => ({
            ancillariesAvailable: [],
            ancillariesSpeqs: [],
            speqsAvailablePrice: { priceFrom: '' },
            speqsQuanty: 0,
            currency: { code: 'EUR' }
        });

        const buildHelpers = () => ({
            generateBaggageSpeqsHaveInfo: jasmine.createSpy('generateBaggageSpeqsHaveInfo').and.callFake((info: unknown) => info),
            countSpeqsTotal: jasmine.createSpy('countSpeqsTotal').and.returnValue(3),
            getInfoSegment: jasmine.createSpy('getInfoSegment').and.returnValue({ departure: null, arrival: null })
        });

        it('AVAILABLE with a cached passengerSpeqsTrips entry: uses the cached value and skips recomputation', () => {
            const cachedTrips = [{ id: 'p1', trips: [] }];
            localStorageServiceMock.get.and.returnValue(cachedTrips);
            const ancillarie = { type: 'SPECIAL_EQUIPMENT', status: { code: 'AVAILABLE' }, priceFrom: 20, slices: [] };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;
            const helpers = buildHelpers();

            SpeqsAncillaryTransformer.handleSpeqsAncillarie(ancillarie, transformedInfo, { ancillariesInfo: { slices: [] }, cachedData: {}, helpers } as SpeqsHandlerContext);

            expect(transformedInfo.ancillariesSpeqs).toBe(cachedTrips);
            expect(ckiAncillariesUtilsServiceMock.getBookingSegmentInformation).not.toHaveBeenCalled();
            expect(helpers.generateBaggageSpeqsHaveInfo).not.toHaveBeenCalled();
            expect(transformedInfo.speqsQuanty).toBe(3);
        });

        it('AVAILABLE without a cache: recomputes trips via the helpers and formats the price/quantity', () => {
            localStorageServiceMock.get.and.returnValue(undefined);
            ckiAncillariesUtilsServiceMock.getBookingSegmentInformation.and.returnValue([]);
            const ancillarie = {
                type: 'SPECIAL_EQUIPMENT', status: { code: 'AVAILABLE' }, priceFrom: 20.9,
                slices: [{ id: 'seg1', status: { code: 'AVAILABLE' }, passengers: [{ id: 'p1', maxAdditionalPieces: 0, pieces: [] }] }]
            };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;
            const helpers = buildHelpers();

            SpeqsAncillaryTransformer.handleSpeqsAncillarie(ancillarie, transformedInfo, { ancillariesInfo: { slices: [] }, cachedData: {}, helpers } as SpeqsHandlerContext);

            expect(transformedInfo.ancillariesAvailable).toEqual(['SPECIAL_EQUIPMENT']);
            expect(helpers.generateBaggageSpeqsHaveInfo).toHaveBeenCalled();
            expect(transformedInfo.speqsAvailablePrice.priceFrom).toBe('fmt:20');
            expect(transformedInfo.speqsQuanty).toBe(3);
        });

        it('NOT_AVAILABLE: does nothing', () => {
            const ancillarie = { type: 'SPECIAL_EQUIPMENT', status: { code: 'NOT_AVAILABLE' }, priceFrom: 20, slices: [] };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;
            const helpers = buildHelpers();

            SpeqsAncillaryTransformer.handleSpeqsAncillarie(ancillarie, transformedInfo, { ancillariesInfo: { slices: [] }, cachedData: {}, helpers } as SpeqsHandlerContext);

            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(transformedInfo.ancillariesSpeqs).toEqual([]);
            expect(helpers.generateBaggageSpeqsHaveInfo).not.toHaveBeenCalled();
            expect(helpers.countSpeqsTotal).not.toHaveBeenCalled();
        });
    });
});