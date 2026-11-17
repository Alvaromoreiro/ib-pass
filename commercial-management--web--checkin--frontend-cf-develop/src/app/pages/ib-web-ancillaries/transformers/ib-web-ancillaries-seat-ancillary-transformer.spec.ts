import * as angular from 'angular';
import { SeatAncillaryTransformer } from './ib-web-ancillaries-seat-ancillary-transformer';
import type { TransformedAncillariesInfo } from './ib-web-ancillaries-transformer.model';

describe('SeatAncillaryTransformer', () => {
    let SeatAncillaryTransformer: SeatAncillaryTransformer;

    let currencyServiceMock: jasmine.SpyObj<CurrencyService>;
    let checkinAncillariesConstantsMock: Pick<CheckinAncillariesConstants, 'STATUS'>;
    let localStorageServiceMock: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;

    beforeEach(() => {
        currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['formatPrice']);
        currencyServiceMock.formatPrice.and.callFake((currency, amount) => `fmt:${amount}`);

        checkinAncillariesConstantsMock = {
            STATUS: { AVAILABLE: 'AVAILABLE', NOT_AVAILABLE: 'NOT_AVAILABLE' }
        } as Pick<CheckinAncillariesConstants, 'STATUS'>;

        localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['get', 'set']);

        angular.mock.module('ib-checkin-ancillaries-module', ($provide) => {
            $provide.value('CheckinAncillariesConstants', checkinAncillariesConstantsMock);
            $provide.value('localStorageService', localStorageServiceMock);
            $provide.value('CurrencyService', currencyServiceMock);
        });

        inject((_SeatAncillaryTransformer_) => {
            SeatAncillaryTransformer = _SeatAncillaryTransformer_;
        });
    });

    describe('handleSeatAncillarie', () => {
        const baseTransformedInfo = () => ({
            seatsAvailable: { status: false, priceFrom: null },
            ancillariesAvailable: [],
            currency: { code: 'EUR' }
        });

        it('AVAILABLE: marks seats available, records available segment ids, and sets the min price formatted', () => {
            const ancillarie = {
                type: 'SEAT',
                status: { code: 'AVAILABLE' },
                segments: [
                    { id: 'seg1', status: { code: 'AVAILABLE' }, passengers: [{ priceFrom: 50 }, { priceFrom: 20 }] },
                    { id: 'seg2', status: { code: 'NOT_AVAILABLE' }, passengers: [{ priceFrom: 5 }] }
                ]
            };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            SeatAncillaryTransformer.handleSeatAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.seatsAvailable.status).toBe(true);
            expect(transformedInfo.ancillariesAvailable).toEqual(['SEAT']);
            expect(localStorageServiceMock.set).toHaveBeenCalledWith('seatsAvailableSegments', ['seg1']);
            expect(transformedInfo.seatsAvailable.priceFrom).toBe('fmt:20');
        });

        it('NOT_AVAILABLE: marks seats unavailable and produces no side effects', () => {
            const ancillarie = { type: 'SEAT', status: { code: 'NOT_AVAILABLE' }, segments: [] };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            SeatAncillaryTransformer.handleSeatAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.seatsAvailable.status).toBe(false);
            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(localStorageServiceMock.set).not.toHaveBeenCalled();
            expect(transformedInfo.seatsAvailable.priceFrom).toBeNull();
        });

        it('getMinPriceSeat: no passenger has a valid priceFrom -> priceFrom stays null', () => {
            const ancillarie = {
                type: 'SEAT',
                status: { code: 'AVAILABLE' },
                segments: [{ id: 'seg1', status: { code: 'AVAILABLE' }, passengers: [{ priceFrom: null }, { priceFrom: -1 }] }]
            };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            SeatAncillaryTransformer.handleSeatAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.seatsAvailable.priceFrom).toBeNull();
            expect(currencyServiceMock.formatPrice).not.toHaveBeenCalled();
        });

        it('getMinPriceSeat: picks the lowest floored price across all segments/passengers', () => {
            const ancillarie = {
                type: 'SEAT',
                status: { code: 'AVAILABLE' },
                segments: [
                    { id: 'seg1', status: { code: 'AVAILABLE' }, passengers: [{ priceFrom: 30.9 }] },
                    { id: 'seg2', status: { code: 'AVAILABLE' }, passengers: [{ priceFrom: 12.1 }, { priceFrom: 45 }] }
                ]
            };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            SeatAncillaryTransformer.handleSeatAncillarie(ancillarie, transformedInfo);

            expect(currencyServiceMock.formatPrice).toHaveBeenCalledWith({ code: 'EUR' }, 12, false, false);
            expect(transformedInfo.seatsAvailable.priceFrom).toBe('fmt:12');
        });
    });
});
