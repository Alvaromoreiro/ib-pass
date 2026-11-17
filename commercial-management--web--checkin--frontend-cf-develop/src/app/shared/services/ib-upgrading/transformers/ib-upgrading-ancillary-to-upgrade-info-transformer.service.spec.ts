import { UpgradingAncillaryToUpgradeInfoMapperService } from './ib-upgrading-ancillary-to-upgrade-info-transformer.service';

import {
    CurrencyInfo,
    UpgradingAncillariesResponse,
    UpgradingAncillary,
    UpgradingOffer,
    LegacyUpgradeInfo
} from '@src/app/shared/services/ib-upgrading/models/ib-upgrading-ancillary-to-upgrade-info-mapper.model';

describe('UpgradingAncillaryToUpgradeInfoMapperService', () => {
    let service: UpgradingAncillaryToUpgradeInfoMapperService;

    beforeEach(() => {
        service = new UpgradingAncillaryToUpgradeInfoMapperService();
    });

    describe('map', () => {
        it('should return null when there are no ancillaries', () => {
            expect(service.map(buildResponse({ ancillaries: [] }))).toBeNull();
            expect(service.map({})).toBeNull();
            expect(service.map(null)).toBeNull();
            expect(service.map(undefined)).toBeNull();
        });

        [
            {
                description: 'UPGRADING ancillary is not available',
                ancillaryOverrides: {
                    status: { code: 'UNAVAILABLE' },
                    offers: [buildOffer()]
                }
            },
            {
                description: 'UPGRADING ancillary has no offers',
                ancillaryOverrides: {
                    status: { code: 'AVAILABLE' },
                    offers: []
                }
            }
        ].forEach(({ description, ancillaryOverrides }) => {
            it(`should return null when ${description}`, () => {
                const response = buildResponse({
                    ancillaries: [buildUpgradingAncillary(ancillaryOverrides)]
                });

                expect(service.map(response)).toBeNull();
            });
        });

        it('should map ASS-FASS UPGRADING ancillary to legacy upgradeInfo model', () => {
            const result = service.map(buildResponseWithAvailableUpgrading());
            expectLegacyUpgradeBaseInfo(result);
            expectLegacyUpgradeOfferInfo(result);
            expectLegacyUpgradeOfferSegmentInfo(result);
        });

        it('should keep currency code when currency object is not found in currencies catalog', () => {
            const result = service.map(buildResponse({
                currencies: [],
                ancillaries: [
                    buildUpgradingAncillary({
                        currency: 'ARS',
                        offers: [buildOffer({
                            offerSegmentsClass: [{ segmentId: '4' }]
                        })]
                    })
                ]
            }));

            expect(result?.currency).toBe('ARS');
            expect(result?.offers[0].offerSegmentClasses[0].segment).toBe(4);
        });

        it('should support already legacy offerSegmentClasses format', () => {
            const result = service.map(buildResponse({
                ancillaries: [
                    buildUpgradingAncillary({
                        offers: [buildOffer({
                            offerSegmentClasses: [{
                                segment: '5',
                                cabinClass: buildCabinClass({
                                    code: 'P',
                                    type: 'PREMIUMTOURIST',
                                    description: 'Turista Premium'
                                })
                            }]
                        })]
                    })
                ]
            }));

            expect(result?.offers[0].offerSegmentClasses[0].segment).toBe(5);
            expect(result?.offers[0].offerSegmentClasses[0].cabinClass?.type).toBe('PREMIUMTOURIST');
        });
    });

    function expectLegacyUpgradeBaseInfo (result: LegacyUpgradeInfo | null): void {
        expect(result).not.toBeNull();
        expect(result?.type).toBe('UPGRADING');
        expect(result?.currency).toEqual(buildEuroCurrency());
        expect(result?.cabinLayout).toBe('BUSINESS_CLASS');
        expect(result?.conditionsByCabinClass?.length).toBe(1);
        expect(result?.termsAndConditions).toBe('<ul></ul>');
    }

    function expectLegacyUpgradeOfferInfo (result: LegacyUpgradeInfo | null): void {
        const offer = result?.offers[0];

        expect(offer).toBeDefined();
        expect(offer?.id).toBe('FIRST');
        expect(offer?.amountPerPassenger).toBe(75);
        expect(offer?.totalAmount).toBe(150);
        expect(offer?.cabinLayout).toBe('BUSINESS_CLASS');
        expect(offer?.cabinLayoutDescription).toBe('Business Class');
    }

    function expectLegacyUpgradeOfferSegmentInfo (result: LegacyUpgradeInfo | null): void {
        const offerSegmentClass = result?.offers[0]?.offerSegmentClasses[0];

        expect(offerSegmentClass).toBeDefined();
        expect(offerSegmentClass?.cabinClass).toEqual(buildCabinClass());
    }

    function buildResponseWithAvailableUpgrading (): UpgradingAncillariesResponse {
        return buildResponse({
            ancillaries: [buildUpgradingAncillary()]
        });
    }

    function buildResponse (overrides: Partial<UpgradingAncillariesResponse> = {}): UpgradingAncillariesResponse {
        return {
            currencies: [buildEuroCurrency()],
            ancillaries: [],
            ...overrides
        };
    }

    function buildEuroCurrency (): CurrencyInfo {
        return {
            code: 'EUR',
            description: 'Euro',
            symbol: '€',
            alignment: 'R',
            groupingSeparator: '.',
            decimalSeparator: ',',
            decimals: 2,
            recommendedDisplay: 'symbol'
        };
    }

    function buildUpgradingAncillary (overrides: Partial<UpgradingAncillary> = {}): UpgradingAncillary {
        return {
            type: 'UPGRADING',
            status: { code: 'AVAILABLE' },
            currency: 'EUR',
            needsProductCatalog: false,
            cabinLayout: 'BUSINESS_CLASS',
            cabinLayoutDescription: 'Business Class',
            conditionsByCabinClass: [{ code: 'U', conditions: [] }],
            offers: [buildOffer()],
            termsAndConditions: '<ul></ul>',
            ...overrides
        };
    }

    function buildOffer (overrides: Partial<UpgradingOffer> = {}): UpgradingOffer {
        return {
            id: 'FIRST',
            offerSegmentsClass: [{
                segmentId: '3',
                cabinClass: buildCabinClass()
            }],
            amountPerPassenger: 75,
            totalAmount: 150,
            cabinLayout: 'BUSINESS_CLASS',
            cabinLayoutDescription: 'Business Class',
            ...overrides
        };
    }

    function buildCabinClass (overrides = {}) {
        return {
            code: 'U',
            type: 'BUSINESS',
            description: 'Business',
            ...overrides
        };
    }
});