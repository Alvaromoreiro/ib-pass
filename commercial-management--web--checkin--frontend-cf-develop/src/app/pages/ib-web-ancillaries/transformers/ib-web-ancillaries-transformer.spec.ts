import * as angular from 'angular';
import { AncillariesTransformer } from './ib-web-ancillaries-transformer';
import { AncillariesHeaderBasketTransformer } from './ib-web-ancillaries-header-basket-transformer';
import type { AncillariesHeaderBasket, FlatSegmentInfo } from './ib-web-ancillaries-transformer.model';
import { CkiAncillariesUtilsService } from '@src/app/pages/ib-web-ancillaries/services/ib-ckeckin-ancillaries-utils';
import { CkiDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';

interface InsuranceCountryFixture {
    country: { code: string; description: string };
    passengerRequiredFields: { requiredFieldsGroups: { requiredFields: { requiredField: string; pattern: string }[] }[] }[];
}

interface RootScopeMock {
    $new: () => void;
    $broadcast: () => void;
    appLang: string;
    appMarket: string;
}

interface AncillaryPieceFixture {
    subtype: string;
    quantySelected: number;
}

/**
 * Characterization tests written BEFORE refactoring transformAncillariesView, generatePriorityOffersInfo,
 * generateAncillariesHeaderInfo, buildAncillariesRequest, and the "finished bids" trio (none of which had
 * any coverage). They pin CURRENT behavior (including known quirks) so the refactor can be verified to be
 * behavior-preserving. Do not "fix" anything these tests reveal - flag it instead.
 * generateAncillariesHeaderInfo has since been extracted to AncillariesHeaderBasketTransformer (its own
 * spec file owns the case-by-case coverage); only delegation is verified here to avoid duplicating it.
 */
describe('AncillariesTransformer (characterization)', () => {
    let AncillariesTransformer: AncillariesTransformer;
    let ancillariesHeaderBasketTransformer: AncillariesHeaderBasketTransformer;

    let currencyServiceMock: jasmine.SpyObj<CurrencyService>;
    let checkinAncillariesConstantsMock: Pick<
        CheckinAncillariesConstants,
        'TYPE_ANCILLARIE' | 'GENERAL_STATUS' | 'STATUS' | 'PASSENGERFIELDS' | 'SeatFeatures' | 'BOB_FREE_TYPES' | 'DATALAYER_INFO' | 'UPGRADE_TYPES' | 'ROUTES'
    >;
    let localStorageServiceMock: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;
    let ckiAncillariesUtilsServiceMock: jasmine.SpyObj<CkiAncillariesUtilsService>;
    let rootScopeMock: RootScopeMock;
    let filterMock: jasmine.Spy;
    let ckiDatalayerUtilsServiceMock: jasmine.SpyObj<CkiDatalayerUtilsService>;
    let localStorageData: Record<string, unknown>;

    beforeEach(() => {
        currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['formatPrice', 'getCurrencyObject', 'formatAvios']);
        currencyServiceMock.formatPrice.and.callFake((currency, amount) => `fmt:${amount}`);
        currencyServiceMock.getCurrencyObject.and.callFake((currency) => currency as CommonsCurrencyModel.CurrencyObject);
        currencyServiceMock.formatAvios.and.callFake((sep, avios) => `avios:${avios}`);

        checkinAncillariesConstantsMock = {
            TYPE_ANCILLARIE: {
                BAGGAGE: 'BAGGAGE',
                INSURANCE: 'INSURANCE',
                INSURANCE_ALLIANZ: 'ALLIANZ_FUSION',
                SEAT: 'SEAT',
                INTEGRATED_BOB: 'INTEGRATED_BOB',
                SPEQS: 'SPECIAL_EQUIPMENT',
                UPGRADING: 'UPGRADING',
                UPGRADING_BID: 'UPGRADING_BID',
                CO2_FOOTPRINT: 'CO2_FOOTPRINT',
                GLOBICK: 'GLOBICK'
            },
            GENERAL_STATUS: { AVAILABLE: 'AVAILABLE' },
            STATUS: { AVAILABLE: 'AVAILABLE', NOT_AVAILABLE: 'NOT_AVAILABLE' },
            PASSENGERFIELDS: { DOCUMENT_ID: 'DOCUMENT_ID' },
            SeatFeatures: {
                emergencyExit: 'EMERGENCY_EXIT',
                extraSize: 'EXTRA_SIZE',
                emergencyWindow: 'WINDOW',
                screen: 'ENTERTAINMENT_SCREEN',
                nonReclining: 'NON_RECLINING',
                infant: 'PASSENGER_WITH_INFANT',
                mobility: 'RESTRICTED_MOBILITY',
                promo: 'PROMO',
                upfront: 'UPFRONT'
            },
            BOB_FREE_TYPES: ['INFINITAPRIME', 'INFINITA', 'PLATINO', 'SINGULAR'],
            DATALAYER_INFO: {
                MODULE_BOB: 'modulo bob',
                IMPRESSION: 'impresiones:',
                FREE: 'gratuito',
                PAYMENT: 'de pago',
                INTERACCION: 'interaccion'
            },
            UPGRADE_TYPES: [{ type: 'BUSINESS', onLand: ['L1'], onBoard: ['B1'] }],
            ROUTES: { imagesUpgBids: '/images' }
        } as unknown as typeof checkinAncillariesConstantsMock;
        localStorageData = {};
        localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['get', 'set']);
        localStorageServiceMock.get.and.callFake(<T>(key: string): T => localStorageData[key] as T);
        localStorageServiceMock.set.and.callFake((key: string, value: unknown) => { localStorageData[key] = value; return true; });

        ckiAncillariesUtilsServiceMock = jasmine.createSpyObj('CkiAncillariesUtilsService', [
            'getBookingSegmentInformation', 'getMmBbookingSegmentInformation', 'isCurrencyLong', 'checkEarlySegments', 'getUpgradingInfo'
        ]);
        ckiAncillariesUtilsServiceMock.getBookingSegmentInformation.and.returnValue([]);
        ckiAncillariesUtilsServiceMock.getMmBbookingSegmentInformation.and.returnValue([]);

        rootScopeMock = { $new: () => {}, $broadcast: () => {}, appLang: 'es', appMarket: 'ES' };
        filterMock = jasmine.createSpy('$filter').and.returnValue((key: string) => `filtered_${key}`);
        ckiDatalayerUtilsServiceMock = jasmine.createSpyObj('CkiDatalayerUtilsService', ['updateDatalayerEvents']);

        angular.mock.module('ib-checkin-ancillaries-module', ($provide) => {
            $provide.value('CurrencyService', currencyServiceMock);
            $provide.value('CheckinAncillariesConstants', checkinAncillariesConstantsMock);
            $provide.value('localStorageService', localStorageServiceMock);
            $provide.value('CkiAncillariesUtilsService', ckiAncillariesUtilsServiceMock);
            $provide.value('$rootScope', rootScopeMock);
            $provide.value('$filter', filterMock);
            $provide.value('CkiDatalayerUtilsService', ckiDatalayerUtilsServiceMock);
        });

        inject((_AncillariesTransformer_, _AncillariesHeaderBasketTransformer_) => {
            AncillariesTransformer = _AncillariesTransformer_;
            ancillariesHeaderBasketTransformer = _AncillariesHeaderBasketTransformer_;
        });
    });

    describe('transformAncillariesView', () => {
        const baseFlow = () => ({ ancillariesAvailable: [], ancillariesTrips: [] });
        const baseCached = () => ({ passengers: [] });

        beforeEach(() => {
            localStorageData.currency = { code: 'EUR' };
        });

        it('SEAT branch: available -> priceFrom is the min priceFrom, formatted, and segments persisted', () => {
            const ancillariesInfo = {
                ancillaries: [{
                    type: 'SEAT',
                    status: { code: 'AVAILABLE' },
                    segments: [
                        { id: 'seg1', status: { code: 'AVAILABLE' }, passengers: [{ priceFrom: 50 }, { priceFrom: 30 }] }
                    ]
                }],
                slices: []
            };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, baseCached());

            expect(result.seatsAvailable.status).toBe(true);
            expect(result.seatsAvailable.priceFrom).toBe('fmt:30');
            expect(result.ancillariesAvailable).toEqual(['SEAT']);
            expect(localStorageServiceMock.set).toHaveBeenCalledWith('seatsAvailableSegments', ['seg1']);
        });

        const bobAncillariesInfo = (price: number) => ({
            ancillaries: [{
                type: 'INTEGRATED_BOB',
                status: { code: 'AVAILABLE' },
                slices: [{ products: [{ currency: 'EUR', price, additionalBagsPrice: 2 }] }]
            }],
            slices: []
        });

        it('INTEGRATED_BOB branch: FREE datalayer event when price < 1', () => {
            localStorageData.actualStepFlow = 'ancillaries';
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), bobAncillariesInfo(0.5), baseCached());

            expect(result.bobAvailable).toBe(true);
            expect(localStorageServiceMock.set).toHaveBeenCalledWith('bobInfo', jasmine.any(Object));
            expect(ckiDatalayerUtilsServiceMock.updateDatalayerEvents).toHaveBeenCalledWith(
                'modulo bob', 'es/ES/ancillaries', 'impresiones:gratuito', 'interaccion'
            );
        });

        it('INTEGRATED_BOB branch: PAYMENT datalayer event when price >= 1', () => {
            localStorageData.actualStepFlow = 'ancillaries';
            AncillariesTransformer.transformAncillariesView(baseFlow(), bobAncillariesInfo(5), baseCached());

            expect(ckiDatalayerUtilsServiceMock.updateDatalayerEvents).toHaveBeenCalledWith(
                'modulo bob', 'es/ES/ancillaries', 'impresiones:de pago', 'interaccion'
            );
        });

        it('INSURANCE branch: computes pricePerPerson excluding infants, and applies compliance splitting', () => {
            const ancillariesInfo = {
                ancillaries: [{
                    type: 'INSURANCE',
                    status: { code: 'AVAILABLE' },
                    countriesAllowed: [],
                    provider: 'AXA',
                    offerId: 'OFFER123',
                    issueCountry: 'ES',
                    offers: [{
                        code: 'off1', name: 'Ins', premium: 100, addOns: [], consent: 'c', coverages: [],
                        termsAndConditionsDocumentURI: 'uri',
                        compliance: {
                            informativeMessage: '<p><strong>A</strong><br />B<br />C</p>',
                            premiumSplitProvision: '<p>X<br />-Y<br />-Z&nbsp;</p>'
                        }
                    }]
                }],
                slices: []
            };
            const cachedData = { passengers: [{ type: 'ADT' }, { type: 'INF' }] };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, cachedData);

            expect(result.insuranceAvailable).toBe(true);
            expect(result.ancillariesInsurance[0].originalPricePerPerson).toBe(100);
            expect(result.ancillariesInsurance[0].pricePerPerson).toBe('fmt:100');
            expect(ancillariesInfo.ancillaries[0].offers[0].compliance.informativeMessage).toEqual(['A', 'B', 'C']);
            expect(ancillariesInfo.ancillaries[0].offers[0].compliance.premiumSplitProvision).toEqual(['X', 'Y', 'Z']);
        });

        const insuranceAncillariesInfo = (countriesAllowed: InsuranceCountryFixture[]) => ({
            ancillaries: [{
                type: 'INSURANCE', status: { code: 'AVAILABLE' },
                countriesAllowed,
                issueCountry: 'ES', offers: [{ code: 'off1', premium: 10, addOns: [], consent: '', coverages: [], termsAndConditionsDocumentURI: '', compliance: null }]
            }],
            slices: []
        });

        it('INSURANCE branch: countriesList match sets insuranceCountry from the matching entry', () => {
            const spain = { country: { code: 'ES', description: 'Spain' }, passengerRequiredFields: [] };
            const france = { country: { code: 'FR', description: 'France' }, passengerRequiredFields: [] };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), insuranceAncillariesInfo([france, spain]), baseCached());

            expect(result.insuranceInfo.insuranceCountry).toBe(spain);
            expect(result.insuranceInfo.countryInsurance).toBe('Spain');
        });

        it('INSURANCE branch: single country falls back to countriesList[0] when no code matches', () => {
            const onlyCountry = { country: { code: 'PT', description: 'Portugal' }, passengerRequiredFields: [] };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), insuranceAncillariesInfo([onlyCountry]), baseCached());

            expect(result.insuranceInfo.insuranceCountry).toBe(onlyCountry);
        });

        it('INSURANCE_ALLIANZ branch: insuranceInfo is replaced by locations[0] and reset fields applied', () => {
            const ancillariesInfo = {
                ancillaries: [{
                    type: 'ALLIANZ_FUSION', status: { code: 'AVAILABLE' },
                    locations: [{ somethingCustom: 'x' }]
                }],
                slices: []
            };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, baseCached());

            expect(result.insuranceAllianzFusionAvailable).toBe(true);
            expect(result.insuranceInfo).toEqual(jasmine.objectContaining({
                somethingCustom: 'x', countriesList: [], priceZero: null, conditionsUri: '', id: null, issueCountry: '', consent: ''
            }));
        });

        it('SPEQS branch: uses cached passengerSpeqsTrips when present', () => {
            localStorageData.passengerSpeqsTrips = [{ id: 'p1', trips: [{ pieces: [{ purchasedPieces: 2, quantySelected: 1 }] }] }];
            const ancillariesInfo = {
                ancillaries: [{ type: 'SPECIAL_EQUIPMENT', status: { code: 'AVAILABLE' }, priceFrom: 5, slices: [] }],
                slices: []
            };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, baseCached());

            expect(result.ancillariesSpeqs).toBe(localStorageData.passengerSpeqsTrips);
            expect(result.speqsQuanty).toBe(3);
        });

        it('SPEQS branch: generates fresh trips when no cached value exists', () => {
            const ancillariesInfo = {
                ancillaries: [{ type: 'SPECIAL_EQUIPMENT', status: { code: 'AVAILABLE' }, priceFrom: 5, slices: [] }],
                slices: []
            };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, baseCached());

            expect(result.ancillariesSpeqs).toEqual([]);
            expect(result.speqsQuanty).toBe(0);
        });

        it('CO2_FOOTPRINT branch: available and not yet purchased', () => {
            localStorageData.summaryInfo = { issuedItems: [] };
            const ancillariesInfo = {
                ancillaries: [{ type: 'CO2_FOOTPRINT', status: { code: 'AVAILABLE' }, price: 0.99, kilosCo2Equivalent: 41.3 }],
                slices: []
            };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, baseCached());

            expect(result.ancillariesAvailable).toEqual(['CO2_FOOTPRINT']);
            expect(result.ancillariesCarbonFootprint).toEqual({
                price: 0.99,
                priceFormatted: 'fmt:0.99',
                priceFrom: 'fmt:0.99',
                kilosCo2Equivalent: 41.3,
                kilosCo2EquivalentFormatted: '41,3',
                confirmed: false
            });
        });

        it('CO2_FOOTPRINT branch: not returned when already issued', () => {
            localStorageData.summaryInfo = { issuedItems: [{ type: 'CO2_FOOTPRINT' }] };
            const ancillariesInfo = {
                ancillaries: [{ type: 'CO2_FOOTPRINT', status: { code: 'AVAILABLE' }, price: 0.99, kilosCo2Equivalent: 41.3 }],
                slices: []
            };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, baseCached());

            expect(result.ancillariesAvailable).toEqual([]);
            expect(result.ancillariesCarbonFootprint).toBeNull();
        });

        it('GLOBICK branch: persists transfer when transfer subtype is available', () => {
            const ancillariesInfo = {
                ancillaries: [{
                    type: 'GLOBICK', status: { code: 'AVAILABLE' }, price: 10, date: '2026-01-01', transferCar: 'car',
                    subTypes: [{ glbType: 'TRANS', status: { code: 'AVAILABLE' } }]
                }],
                slices: []
            };
            const result = AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, baseCached());

            expect(result.ancillariesTransfersGlobick).toEqual(jasmine.objectContaining({ price: 10, date: '2026-01-01', transferCar: 'car' }));
            expect(localStorageData.isGlobickActivities).toBeUndefined();
        });

        it('GLOBICK branch: EXP flag is set independently of transfer availability (quirk: check is outside the outer if)', () => {
            const ancillariesInfo = {
                ancillaries: [{
                    type: 'GLOBICK', status: { code: 'AVAILABLE' }, price: 10, date: '2026-01-01', transferCar: 'car',
                    subTypes: [
                        { glbType: 'TRANS', status: { code: 'NOT_AVAILABLE' } },
                        { glbType: 'EXP', status: { code: 'AVAILABLE' } }
                    ]
                }],
                slices: []
            };
            AncillariesTransformer.transformAncillariesView(baseFlow(), ancillariesInfo, baseCached());

            expect(localStorageData.globickTransfers).toBeUndefined();
            expect(localStorageData.isGlobickActivities).toBe(true);
        });

        it('merges transfomerFlow fields into the returned object', () => {
            const flow = { ancillariesAvailable: [], ancillariesTrips: [], customFlag: 'keep-me' };
            const result = AncillariesTransformer.transformAncillariesView(flow, { ancillaries: [], slices: [] }, baseCached());

            expect(result.customFlag).toBe('keep-me');
        });
    });

    describe('generatePriorityOffersInfo', () => {
        beforeEach(() => {
            localStorageData.bookingInfo = { passengers: [] };
        });

        it('propagates the first non-empty segment.passengers to empty segments, but as a plain object, unmutated (quirk: {...array} spread produces an object, so passengerAux.length is undefined and the NOT_AVAILABLE/null mutation loop never runs)', () => {
            const segments = [
                { id: 's1', passengers: [] },
                { id: 's2', passengers: [{ id: 'p1', amount: 10, status: { code: 'AVAILABLE' } }] }
            ];
            AncillariesTransformer.generatePriorityOffersInfo(segments, [], { passengers: [] });

            expect(Array.isArray(segments[0].passengers)).toBe(false);
            expect(segments[0].passengers[0].status.code).toBe('AVAILABLE');
            expect(segments[0].passengers[0].amount).toBe(10);
        });

        it('multi-segment slice attaches shared sliceInfo (withSliceInfo) to each member segment', () => {
            ckiAncillariesUtilsServiceMock.getBookingSegmentInformation.and.returnValue([
                { id: 's1', arrival: { airport: 'MAD' }, departure: { airport: 'BCN' } },
                { id: 's2', arrival: { airport: 'JFK' }, departure: { airport: 'MAD' } }
            ]);
            const segments = [
                { id: 's1', passengers: [{ id: 'p1', amount: 5, status: { code: 'AVAILABLE' } }] },
                { id: 's2', passengers: [{ id: 'p1', amount: 5, status: { code: 'AVAILABLE' } }] }
            ];
            const ancilariesInfoSlices = [{ segmentIds: ['s1', 's2'] }];
            const result = AncillariesTransformer.generatePriorityOffersInfo(segments, ancilariesInfoSlices, { passengers: [] });

            expect(result[0].trips[0].withSliceInfo).toBe(true);
            expect(result[0].trips[0].sliceInfo.departure).toBe('BCN');
            expect(result[0].trips[0].sliceInfo.arrival).toBe('JFK');
        });

        it('accumulates trips for a passenger id seen across multiple segments', () => {
            const segments = [
                { id: 's1', passengers: [{ id: 'p1', amount: 5, status: { code: 'AVAILABLE' } }] },
                { id: 's2', passengers: [{ id: 'p1', amount: 7, status: { code: 'AVAILABLE' } }] }
            ];
            const result = AncillariesTransformer.generatePriorityOffersInfo(segments, [], { passengers: [] });

            expect(result.length).toBe(1);
            expect(result[0].trips.length).toBe(2);
        });

        it('resolves passengerType from bookingInfo, defaulting to empty string when no match', () => {
            localStorageData.bookingInfo = { passengers: [{ id: 9, type: 'ADT' }] };
            const segments = [{ id: 's1', passengers: [{ id: 'p1', amount: 5, status: { code: 'AVAILABLE' } }] }];
            const result = AncillariesTransformer.generatePriorityOffersInfo(segments, [], { passengers: [] });

            expect(result[0].passengerType).toBe('');
        });
    });

    describe('generateAncillariesHeaderInfo', () => {
        it('delegates to AncillariesHeaderBasketTransformer with the same arguments and returns its result (case-by-case behavior is covered in that transformer\'s own spec)', () => {
            const breakDownInfo = { currencies: [{ code: 'EUR' }], pendingPaymentItems: [] };
            const segmentsInfo: FlatSegmentInfo[] = [{ id: 'seg1' }];
            const expected = {} as AncillariesHeaderBasket;
            spyOn(ancillariesHeaderBasketTransformer, 'generateAncillariesHeaderInfo').and.returnValue(expected);

            const result = AncillariesTransformer.generateAncillariesHeaderInfo(breakDownInfo, segmentsInfo);

            expect(ancillariesHeaderBasketTransformer.generateAncillariesHeaderInfo).toHaveBeenCalledWith(breakDownInfo, segmentsInfo);
            expect(result).toBe(expected);
        });
    });

    describe('buildAncillariesRequest', () => {
        const trip = (id: string, piecesChoosed = 1) => ({ id, piecesChoosed, speqsChoosed: piecesChoosed, pieces: [{ subtype: 'BAGGAGE_23', quantySelected: 1 }] });

        const passengerWithPieces = (pieces: AncillaryPieceFixture[]) => ({ id: 'p1', trips: [{ id: 'seg1', piecesChoosed: 1, pieces }] });

        it('accumulates units when the same passenger/subtype repeats on the same slice', () => {
            const result = AncillariesTransformer.buildAncillariesRequest(
                [passengerWithPieces([
                    { subtype: 'BAGGAGE_23', quantySelected: 1 },
                    { subtype: 'BAGGAGE_23', quantySelected: 2 }
                ])],
                null, null
            );
            expect(result[0].slices[0].passengers[0].subtypes[0].units).toBe(3);
        });

        it('pushes a new subtype entry for the same passenger/slice when the subtype differs', () => {
            const result = AncillariesTransformer.buildAncillariesRequest(
                [passengerWithPieces([
                    { subtype: 'BAGGAGE_23', quantySelected: 1 },
                    { subtype: 'BAGGAGE_15', quantySelected: 1 }
                ])],
                null, null
            );
            expect(result[0].slices[0].passengers[0].subtypes.length).toBe(2);
        });

        it('pushes a new passenger entry for an existing slice', () => {
            const result = AncillariesTransformer.buildAncillariesRequest(
                [
                    { id: 'p1', trips: [trip('seg1')] },
                    { id: 'p2', trips: [trip('seg1')] }
                ],
                null, null
            );
            expect(result[0].slices.length).toBe(1);
            expect(result[0].slices[0].passengers.length).toBe(2);
        });

        it('creates a new slice entry for a new trip id', () => {
            const result = AncillariesTransformer.buildAncillariesRequest(
                [{ id: 'p1', trips: [trip('seg1'), trip('seg2')] }],
                null, null
            );
            expect(result[0].slices.length).toBe(2);
        });

        it('speqs mirrors the same accumulate/push behavior via speqsChoosed', () => {
            const result = AncillariesTransformer.buildAncillariesRequest(
                null,
                [{ id: 'p1', trips: [{ id: 'seg1', speqsChoosed: 1, pieces: [{ subtype: 'BICYCLE', quantySelected: 1 }] }] }],
                null
            );
            expect(result[0].type).toBe('SPECIAL_EQUIPMENT');
            expect(result[0].slices[0].passengers[0].subtypes[0].units).toBe(1);
        });

        it('insurance entry: offer prefers code over id, and persists selection to localStorage', () => {
            const result = AncillariesTransformer.buildAncillariesRequest(null, null, { code: 'INS_CODE', id: 'INS_ID', passengerInfo: [] });

            expect(result[0]).toEqual(jasmine.objectContaining({ type: 'INSURANCE', offer: 'INS_CODE', addons: [] }));
            expect(localStorageServiceMock.set).toHaveBeenCalledWith('hasSelectedInsurance', true);
        });

        it('insurance entry: falls back to id when code is absent', () => {
            const result = AncillariesTransformer.buildAncillariesRequest(null, null, { id: 'INS_ID', passengerInfo: [] });
            expect(result[0].offer).toBe('INS_ID');
        });

        it('returns an empty array when everything is null/empty', () => {
            expect(AncillariesTransformer.buildAncillariesRequest(null, null, null)).toEqual([]);
            expect(AncillariesTransformer.buildAncillariesRequest([], [], null)).toEqual([]);
        });
    });
});
