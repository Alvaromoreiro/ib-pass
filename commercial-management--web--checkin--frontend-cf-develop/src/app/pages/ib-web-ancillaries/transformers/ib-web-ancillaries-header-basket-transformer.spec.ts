import * as angular from 'angular';
import { AncillariesHeaderBasketTransformer } from './ib-web-ancillaries-header-basket-transformer';
import type { AncillariesHeaderBasket } from './ib-web-ancillaries-transformer.model';

interface HeaderBasketPiece {
    subtype: string;
    quantity: number;
    description: string;
    total: number;
}

interface HeaderBasketItem {
    type: string;
    currency?: string;
    [key: string]: unknown;
}

interface HeaderBasketBreakdown {
    currencies: { code: string }[];
    pendingPaymentItems: HeaderBasketItem[];
}

interface SeatSummaryEntry {
    type: string | null;
    quanty: number;
    amount: number;
}

describe('AncillariesHeaderBasketTransformer', () => {
    let AncillariesHeaderBasketTransformer: AncillariesHeaderBasketTransformer;

    let currencyServiceMock: jasmine.SpyObj<CurrencyService>;
    let checkinAncillariesConstantsMock: Pick<CheckinAncillariesConstants, 'TYPE_ANCILLARIE' | 'SeatFeatures'>;
    let filterMock: jasmine.Spy;

    const buildBreakDownInfo = (pendingPaymentItems: HeaderBasketItem[]): HeaderBasketBreakdown => ({
        currencies: [{ code: 'EUR' }],
        pendingPaymentItems
    });

    const breakDownInfoWithPieces = (type: string, total: number, pieces: HeaderBasketPiece[]) => buildBreakDownInfo([{
        type, currency: 'EUR',
        slices: [{ id: 'seg1', total, passengers: [{ id: 'p1', pieces }] }]
    }]);

    beforeEach(() => {
        currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['formatPrice', 'getCurrencyObject']);
        currencyServiceMock.formatPrice.and.callFake((currency, amount) => `fmt:${amount}`);
        currencyServiceMock.getCurrencyObject.and.callFake((currency) => currency as CommonsCurrencyModel.CurrencyObject);

        checkinAncillariesConstantsMock = {
            TYPE_ANCILLARIE: {
                SEAT: 'SEAT', INSURANCE: 'INSURANCE', UPGRADING: 'UPGRADING', BAGGAGE: 'BAGGAGE', SPEQS: 'SPECIAL_EQUIPMENT'
            },
            SeatFeatures: {
                emergencyExit: 'EMERGENCY_EXIT', extraSize: 'EXTRA_SIZE', emergencyWindow: 'WINDOW',
                screen: 'ENTERTAINMENT_SCREEN', nonReclining: 'NON_RECLINING', infant: 'PASSENGER_WITH_INFANT',
                mobility: 'RESTRICTED_MOBILITY', promo: 'PROMO', upfront: 'UPFRONT'
            }
        } as Pick<CheckinAncillariesConstants, 'TYPE_ANCILLARIE' | 'SeatFeatures'>;

        filterMock = jasmine.createSpy('$filter').and.returnValue((key: string) => `filtered_${key}`);

        angular.mock.module('ib-checkin-ancillaries-module', ($provide) => {
            $provide.value('CurrencyService', currencyServiceMock);
            $provide.value('CheckinAncillariesConstants', checkinAncillariesConstantsMock);
            $provide.value('$filter', filterMock);
        });

        inject((_AncillariesHeaderBasketTransformer_) => {
            AncillariesHeaderBasketTransformer = _AncillariesHeaderBasketTransformer_;
        });
    });

    describe('generateAncillariesHeaderInfo - dispatch', () => {
        it('no pendingPaymentItems: currency stays null and every basket bucket stays empty', () => {
            const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo({ currencies: [], pendingPaymentItems: [] }, []);

            expect(result.currency).toBeNull();
            expect(result.seats).toEqual([]);
            expect(result.insurance).toBeNull();
        });

        it('an item type with no registered handler is silently ignored', () => {
            const breakDownInfo = buildBreakDownInfo([{ type: 'UNKNOWN_TYPE', currency: 'EUR' }]);

            const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, []);

            expect(result.seats).toEqual([]);
            expect(result.baggages).toEqual([]);
            expect(result.speqs).toEqual([]);
        });

        it('resolves basket.currency from the matching entry in breakDownInfo.currencies', () => {
            const breakDownInfo = {
                currencies: [{ code: 'USD' }, { code: 'EUR' }],
                pendingPaymentItems: [{ type: 'INSURANCE', currency: 'EUR', offer: 'off1', total: 10 }]
            };

            const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, []);

            expect(result.currency).toEqual(jasmine.objectContaining({ code: 'EUR' }));
        });

        it('SEAT case: builds a seats trip entry for the segment', () => {
            const breakDownInfo = buildBreakDownInfo([{
                type: 'SEAT', currency: 'EUR',
                segments: [{ id: 'seg1', passengers: [{ id: 'p1', amount: 10, seat: { features: [] } }] }]
            }]);

            const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, []);

            expect(result.seats.length).toBe(1);
            expect(result.seats[0].segmentId).toBe('seg1');
            expect(result.seats[0].total).toBe(10);
        });

        it('INSURANCE case: builds a flat insurance summary', () => {
            const breakDownInfo = buildBreakDownInfo([{ type: 'INSURANCE', currency: 'EUR', offer: 'off1', total: 42 }]);

            const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, []);

            expect(result.insurance).toEqual(jasmine.objectContaining({ offer: 'off1', total: 42, totalFormatted: 'fmt:42', passengers: 1 }));
        });

        it('UPGRADING case: builds upgradingTrips from offerSegmentsClass', () => {
            const breakDownInfo = buildBreakDownInfo([{
                type: 'UPGRADING', currency: 'EUR', total: 100,
                upgrading: { offerSegmentsClass: [{ segmentId: 'seg1', cabinClass: { description: 'Business' } }] }
            }]);

            const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, []);

            expect(result.upgrading.upgradingTrips[0]).toEqual(jasmine.objectContaining({ segmentId: 'seg1', cabin: 'Business' }));
            expect(result.upgrading.totalFormatted).toBe('fmt:100');
        });

        [
            {
                name: 'BAGGAGE case: same subtype within a slice accumulates quantity/total',
                type: 'BAGGAGE', total: 100,
                pieces: [
                    { subtype: 'BAGGAGE_23', quantity: 1, description: '23kg', total: 50 },
                    { subtype: 'BAGGAGE_23', quantity: 1, description: '23kg', total: 50 }
                ],
                assert: (result: AncillariesHeaderBasket) => {
                    expect(result.baggages[0].baggages.length).toBe(1);
                    expect(result.baggages[0].baggages[0].quanty).toBe(2);
                    expect(result.baggages[0].baggages[0].total).toBe(100);
                }
            },
            {
                name: 'BAGGAGE case: distinct subtypes within a slice each get their own entry',
                type: 'BAGGAGE', total: 80,
                pieces: [
                    { subtype: 'BAGGAGE_15', quantity: 1, description: '15kg', total: 30 },
                    { subtype: 'BAGGAGE_23', quantity: 1, description: '23kg', total: 50 }
                ],
                assert: (result: AncillariesHeaderBasket) => {
                    expect(result.baggages[0].baggages.length).toBe(2);
                    expect(result.baggages[0].baggages.map((b: { type: string }) => b.type)).toEqual(['BAGGAGE_15', 'BAGGAGE_23']);
                }
            },
            {
                name: 'SPEQS case: same subtype within a slice accumulates quantity/total',
                type: 'SPECIAL_EQUIPMENT', total: 60,
                pieces: [
                    { subtype: 'BICYCLE', quantity: 1, description: 'bike', total: 30 },
                    { subtype: 'BICYCLE', quantity: 1, description: 'bike', total: 30 }
                ],
                assert: (result: AncillariesHeaderBasket) => {
                    expect(result.speqs[0].speqs.length).toBe(1);
                    expect(result.speqs[0].speqs[0].quanty).toBe(2);
                }
            }
        ].forEach(({ name, type, total, pieces, assert }) => {
            it(name, () => {
                const breakDownInfo = breakDownInfoWithPieces(type, total, pieces);
                const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, []);

                assert(result);
            });
        });

        it('BAGGAGE/SPEQS case: origin/destination are populated from a matching segmentsInfo entry', () => {
            const breakDownInfo = breakDownInfoWithPieces('BAGGAGE', 50, [
                { subtype: 'BAGGAGE_23', quantity: 1, description: '23kg', total: 50 }
            ]);
            const segmentsInfo = [{ id: 'seg1', origin: 'MAD', destination: 'BCN' }];

            const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, segmentsInfo);

            expect(result.baggages[0].origin).toBe('MAD');
            expect(result.baggages[0].destination).toBe('BCN');
        });
    });

    describe('getSeatFeatureTypeAndDescription (via SEAT dispatch)', () => {
        const breakDownInfoWithSeatFeatures = (features: string[]) => buildBreakDownInfo([{
            type: 'SEAT', currency: 'EUR', segments: [{ id: 'seg1', passengers: [{ id: 'p1', amount: 10, seat: { features } }] }]
        }]);

        const breakDownInfoWithSeatPassengers = (passengers: { id: string; amount: number; seat: { features: string[] } }[]) => buildBreakDownInfo([{
            type: 'SEAT', currency: 'EUR', segments: [{ id: 'seg1', passengers }]
        }]);

        [
            {
                name: 'same computed seat type accumulates into one entry across passengers',
                passengers: [
                    { id: 'p1', amount: 10, seat: { features: [] } },
                    { id: 'p2', amount: 20, seat: { features: [] } }
                ],
                assert: (seats: SeatSummaryEntry[]) => {
                    expect(seats.length).toBe(1);
                    expect(seats[0].quanty).toBe(2);
                    expect(seats[0].amount).toBe(30);
                }
            },
            {
                name: 'different computed seat types across passengers create separate entries',
                passengers: [
                    { id: 'p1', amount: 10, seat: { features: ['EMERGENCY_EXIT'] } },
                    { id: 'p2', amount: 20, seat: { features: ['UPFRONT'] } }
                ],
                assert: (seats: SeatSummaryEntry[]) => {
                    expect(seats.length).toBe(2);
                    expect(seats.map((seat: SeatSummaryEntry) => seat.type)).toEqual(['EMERGENCY_EXIT', 'UPFRONT']);
                }
            }
        ].forEach(({ name, passengers, assert }) => {
            it(name, () => {
                const breakDownInfo = breakDownInfoWithSeatPassengers(passengers);
                const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfo, []);

                assert(result.seats[0].seats);
            });
        });

        [
            {
                name: 'last-match-wins: a later matching rule overrides an earlier one',
                features: ['EXTRA_SIZE', 'PASSENGER_WITH_INFANT'],
                type: 'PASSENGER_WITH_INFANT', description: 'filtered_CKIANCSEATS_SEAT_INFANT'
            },
            {
                name: 'emergencyExit alone sets type and a translated description',
                features: ['EMERGENCY_EXIT'],
                type: 'EMERGENCY_EXIT', description: 'filtered_CKIANCSEATS_SEAT_EMERGENCY_XL'
            },
            {
                name: 'emergencyExit excludes extraSize even when extraSize is also present',
                features: ['EMERGENCY_EXIT', 'EXTRA_SIZE'],
                type: 'EMERGENCY_EXIT'
            },
            {
                name: 'emergencyExit excludes promo',
                features: ['EMERGENCY_EXIT', 'PROMO'],
                type: 'EMERGENCY_EXIT'
            },
            {
                name: 'screen sets type to an empty string with an untranslated empty description',
                features: ['ENTERTAINMENT_SCREEN'],
                type: '', description: ''
            },
            {
                name: 'a non-empty features array with no tracked feature falls back to a null type and empty untranslated description',
                features: ['WING'],
                type: null, description: ''
            },
            {
                name: 'an empty features array short-circuits in addNewHeaderSeat without calling getSeatFeatureTypeAndDescription',
                features: [],
                type: '', description: '',
                extraAssert: () => expect(filterMock).not.toHaveBeenCalled()
            }
        ].forEach(({ name, features, type, description, extraAssert }) => {
            it(name, () => {
                const result = AncillariesHeaderBasketTransformer.generateAncillariesHeaderInfo(breakDownInfoWithSeatFeatures(features), []);

                expect(result.seats[0].seats[0].type).toBe(type);
                if (description !== undefined) {
                    expect(result.seats[0].seats[0].description).toBe(description);
                }
                extraAssert?.();
            });
        });
    });
});
