import * as angular from 'angular';
import { InsuranceAncillaryTransformer } from './ib-web-ancillaries-insurance-ancillary-transformer';
import type { InsuranceHandlerContext, InsuranceInfoModel, TransformedAncillariesInfo } from './ib-web-ancillaries-transformer.model';

interface InsuranceRequiredField {
    requiredField: string;
    pattern: string;
}

interface InsuranceCountry {
    country: { code: string; description: string };
    passengerRequiredFields: { requiredFieldsGroups: { requiredFields: InsuranceRequiredField[] }[] }[];
}

function createInsuranceContext(ancillariesInsuranceInfo: unknown = undefined): InsuranceHandlerContext {
    return { ancillariesInsuranceInfo, countryInsurance: '' };
}

describe('InsuranceAncillaryTransformer', () => {
    let InsuranceAncillaryTransformer: InsuranceAncillaryTransformer;

    let currencyServiceMock: jasmine.SpyObj<CurrencyService>;
    let checkinAncillariesConstantsMock: {
        STATUS: Pick<CheckinAncillariesConstants['STATUS'], 'AVAILABLE' | 'NOT_AVAILABLE'>;
        PASSENGERFIELDS: Pick<CheckinAncillariesConstants['PASSENGERFIELDS'], 'DOCUMENT_ID'>;
    };

    beforeEach(() => {
        currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['formatPrice']);
        currencyServiceMock.formatPrice.and.callFake((currency, amount) => `fmt:${amount}`);

        checkinAncillariesConstantsMock = {
            STATUS: { AVAILABLE: 'AVAILABLE', NOT_AVAILABLE: 'NOT_AVAILABLE' },
            PASSENGERFIELDS: { DOCUMENT_ID: 'DOCUMENT_ID' }
        };

        angular.mock.module('ib-checkin-ancillaries-module', ($provide) => {
            $provide.value('CheckinAncillariesConstants', checkinAncillariesConstantsMock);
            $provide.value('CurrencyService', currencyServiceMock);
        });

        inject((_InsuranceAncillaryTransformer_) => {
            InsuranceAncillaryTransformer = _InsuranceAncillaryTransformer_;
        });
    });

    describe('handleInsuranceAncillarie', () => {
        const baseTransformedInfo = () => ({
            ancillariesAvailable: [],
            insuranceAvailable: false,
            insuranceInfo: { countriesList: [], priceZero: null, conditionsUri: '', id: null, issueCountry: null, consent: '' },
            currency: { code: 'EUR' }
        });

        const baseInsuranceContext = () => ({ ancillariesInsuranceInfo: undefined, countryInsurance: '' });

        it('quirk: ancillariesInsuranceInfo is set unconditionally, even when the ancillary is NOT_AVAILABLE', () => {
            const ancillarie = { type: 'INSURANCE', status: { code: 'NOT_AVAILABLE' } };
            const transformedInfo = baseTransformedInfo() as TransformedAncillariesInfo;
            const insuranceContext = baseInsuranceContext() as InsuranceHandlerContext;

            InsuranceAncillaryTransformer.handleInsuranceAncillarie(ancillarie, transformedInfo, insuranceContext);

            expect(insuranceContext.ancillariesInsuranceInfo).toBe(ancillarie);
            expect(transformedInfo.insuranceAvailable).toBe(false);
            expect(transformedInfo.ancillariesAvailable).toEqual([]);
        });

        it('AVAILABLE without compliance: populates insuranceInfo/insuranceContext and does not touch compliance', () => {
            const ancillarie = {
                type: 'INSURANCE', status: { code: 'AVAILABLE' },
                countriesAllowed: ['ES'], issueCountry: 'ES',
                offers: [{ termsAndConditionsDocumentURI: 'uri', code: 'off1', consent: 'yes', compliance: null }]
            };
            const transformedInfo = baseTransformedInfo() as TransformedAncillariesInfo;
            const insuranceContext = baseInsuranceContext() as InsuranceHandlerContext;

            InsuranceAncillaryTransformer.handleInsuranceAncillarie(ancillarie, transformedInfo, insuranceContext);

            expect(transformedInfo.insuranceAvailable).toBe(true);
            expect(transformedInfo.ancillariesAvailable).toEqual(['INSURANCE']);
            expect(transformedInfo.insuranceInfo.countriesList).toEqual(['ES']);
            expect(transformedInfo.insuranceInfo.priceZero).toBe('fmt:0');
            expect(transformedInfo.insuranceInfo.conditionsUri).toBe('uri');
            expect(transformedInfo.insuranceInfo.id).toBe('off1');
            expect(insuranceContext.countryInsurance).toBe('ES');
            expect(transformedInfo.insuranceInfo.issueCountry).toBe('ES');
            expect(transformedInfo.insuranceInfo.consent).toBe('yes');
        });

        it('AVAILABLE with compliance: rewrites informativeMessage and premiumSplitProvision via createComplianceModel', () => {
            const ancillarie = {
                type: 'INSURANCE', status: { code: 'AVAILABLE' },
                countriesAllowed: [], issueCountry: 'ES',
                offers: [{
                    termsAndConditionsDocumentURI: 'uri', code: 'off1', consent: 'yes',
                    compliance: {
                        informativeMessage: '<p><strong>Title</strong><br />Middle<br />End</p>',
                        premiumSplitProvision: '<p>First<br />-Second<br />-Third&nbsp;</p>'
                    }
                }]
            };
            const transformedInfo = baseTransformedInfo() as TransformedAncillariesInfo;
            const insuranceContext = baseInsuranceContext() as InsuranceHandlerContext;

            InsuranceAncillaryTransformer.handleInsuranceAncillarie(ancillarie, transformedInfo, insuranceContext);

            expect(ancillarie.offers[0].compliance.informativeMessage).toEqual(['Title', 'Middle', 'End']);
            expect(ancillarie.offers[0].compliance.premiumSplitProvision).toEqual(['First', 'Second', 'Third']);
        });

        it('NOT_AVAILABLE: insuranceInfo fields are left untouched', () => {
            const ancillarie = { type: 'INSURANCE', status: { code: 'NOT_AVAILABLE' } };
            const transformedInfo = baseTransformedInfo() as TransformedAncillariesInfo;
            const insuranceContext = baseInsuranceContext() as InsuranceHandlerContext;

            InsuranceAncillaryTransformer.handleInsuranceAncillarie(ancillarie, transformedInfo, insuranceContext);

            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(transformedInfo.insuranceInfo.id).toBeNull();
        });
    });

    describe('handleInsuranceAllianzAncillarie', () => {
        const baseTransformedInfo = () => ({
            ancillariesAvailable: [],
            insuranceAllianzFusionAvailable: false,
            insuranceInfo: { countriesList: ['stale'], priceZero: 'stale', conditionsUri: 'stale', id: 'stale', issueCountry: 'stale', consent: 'stale' }
        });

        const baseInsuranceContext = () => ({ ancillariesInsuranceInfo: undefined, countryInsurance: '' });

        it('AVAILABLE: replaces insuranceInfo wholesale with locations[0] and then resets the shared fields', () => {
            const location = { conditionsUri: 'x' };
            const ancillarie = { type: 'ALLIANZ_FUSION', status: { code: 'AVAILABLE' }, locations: [location] };
            const transformedInfo = baseTransformedInfo() as TransformedAncillariesInfo;
            const insuranceContext = baseInsuranceContext() as InsuranceHandlerContext;

            InsuranceAncillaryTransformer.handleInsuranceAllianzAncillarie(ancillarie, transformedInfo, insuranceContext);

            expect(transformedInfo.insuranceAllianzFusionAvailable).toBe(true);
            expect(transformedInfo.ancillariesAvailable).toEqual(['ALLIANZ_FUSION']);
            expect(transformedInfo.insuranceInfo as unknown).toBe(location);
            expect(transformedInfo.insuranceInfo.countriesList).toEqual([]);
            expect(transformedInfo.insuranceInfo.priceZero).toBeNull();
            expect(transformedInfo.insuranceInfo.conditionsUri).toBe('');
            expect(transformedInfo.insuranceInfo.id).toBeNull();
            expect(insuranceContext.countryInsurance).toBe('');
            expect(transformedInfo.insuranceInfo.issueCountry).toBe('');
            expect(transformedInfo.insuranceInfo.consent).toBe('');
        });

        it('NOT_AVAILABLE: leaves insuranceInfo untouched', () => {
            const ancillarie = { type: 'ALLIANZ_FUSION', status: { code: 'NOT_AVAILABLE' }, locations: [{}] };
            const transformedInfo = baseTransformedInfo() as TransformedAncillariesInfo;
            const insuranceContext = baseInsuranceContext() as InsuranceHandlerContext;

            InsuranceAncillaryTransformer.handleInsuranceAllianzAncillarie(ancillarie, transformedInfo, insuranceContext);

            expect(transformedInfo.insuranceAllianzFusionAvailable).toBe(false);
            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(transformedInfo.insuranceInfo.id).toBe('stale');
        });
    });

    describe('enrichInsuranceOffers', () => {
        const baseTransformedInfo = (insuranceAvailable: boolean) => ({
            insuranceAvailable,
            ancillariesInsurance: [],
            insuranceInfo: { price: null, originalPrice: null },
            currency: { code: 'EUR' }
        });

        it('excludes INF passengers from the per-person price split', () => {
            const insuranceContext = createInsuranceContext({
                    provider: 'p', offerId: 'off1', issueCountry: 'ES',
                    offers: [{ premium: 100, code: 'c1', name: 'n1', termsAndConditionsDocumentURI: 'uri', coverages: [{ title: 't', description: 'd' }], addOns: [], consent: 'y', compliance: null }]
                });
            const cachedData = { passengers: [{ type: 'ADT' }, { type: 'INF' }] };
            const transformedInfo = baseTransformedInfo(true) as TransformedAncillariesInfo;

            InsuranceAncillaryTransformer.enrichInsuranceOffers(transformedInfo, insuranceContext, cachedData);

            expect(transformedInfo.ancillariesInsurance[0].originalPricePerPerson).toBe(100);
            expect(transformedInfo.ancillariesInsurance[0].pricePerPerson).toBe('fmt:100');
            expect(transformedInfo.ancillariesInsurance[0].descriptionCoverages).toEqual([{ title: 't', description: 'd' }]);
            expect(transformedInfo.insuranceInfo.price).toBe('fmt:100');
            expect(transformedInfo.insuranceInfo.originalPrice).toBe(100);
        });

        it('guards against division by zero when every passenger is INF (falls back to 1)', () => {
            const insuranceContext = createInsuranceContext({
                    provider: 'p', offerId: 'off1', issueCountry: 'ES',
                    offers: [{ premium: 50, code: 'c1', name: 'n1', termsAndConditionsDocumentURI: 'uri', coverages: [], addOns: [], consent: 'y', compliance: null }]
                });
            const cachedData = { passengers: [{ type: 'INF' }] };
            const transformedInfo = baseTransformedInfo(true) as TransformedAncillariesInfo;

            InsuranceAncillaryTransformer.enrichInsuranceOffers(transformedInfo, insuranceContext, cachedData);

            expect(transformedInfo.ancillariesInsurance[0].originalPricePerPerson).toBe(50);
        });

        it('insuranceAvailable false: leaves ancillariesInsurance empty and insuranceInfo price untouched', () => {
            const insuranceContext = createInsuranceContext();
            const transformedInfo = baseTransformedInfo(false) as TransformedAncillariesInfo;

            InsuranceAncillaryTransformer.enrichInsuranceOffers(transformedInfo, insuranceContext, { passengers: [] });

            expect(transformedInfo.ancillariesInsurance).toEqual([]);
            expect(transformedInfo.insuranceInfo.price).toBeNull();
        });
    });

    describe('applyInsuranceCountryDefaults', () => {
        const countryEntry = (code: string, requiredFields: InsuranceRequiredField[] = []) => ({
            country: { code, description: `desc-${code}` },
            passengerRequiredFields: requiredFields.length > 0 ? [{ requiredFieldsGroups: [{ requiredFields }] }] : []
        });

        const buildTransformedInfo = (countriesList: InsuranceCountry[]) => ({
            insuranceInfo: {
                countriesList, insuranceCountry: null, oldInsuranceCountry: null, countryInsurance: '', insurancePatterns: {}
            }
        });

        [
            {
                name: 'multiple countries: matches by code and builds insurancePatterns from DOCUMENT_ID required fields',
                countriesList: [
                    countryEntry('ES', [{ requiredField: 'DOCUMENT_ID', pattern: 'ES-PATTERN' }]),
                    countryEntry('FR')
                ],
                assert: (insuranceInfo: InsuranceInfoModel) => {
                    expect(insuranceInfo.insuranceCountry.country.code).toBe('ES');
                    expect(insuranceInfo.countryInsurance).toBe('desc-ES');
                    expect(insuranceInfo.insurancePatterns).toEqual({ ES: 'ES-PATTERN' });
                }
            },
            {
                name: 'no match found among multiple countries: falls back to the first entry in the list',
                countriesList: [countryEntry('DE'), countryEntry('FR')],
                assert: (insuranceInfo: InsuranceInfoModel) => {
                    expect(insuranceInfo.insuranceCountry.country.code).toBe('DE');
                    expect(insuranceInfo.countryInsurance).toBe('desc-DE');
                }
            },
            {
                name: 'a match found among multiple countries is not overridden by the single-country fallback',
                countriesList: [countryEntry('DE'), countryEntry('ES')],
                assert: (insuranceInfo: InsuranceInfoModel) => {
                    expect(insuranceInfo.insuranceCountry.country.code).toBe('ES');
                }
            },
            {
                name: 'single country in the list: skips the match loop and applies the fallback directly',
                countriesList: [countryEntry('ES')],
                assert: (insuranceInfo: InsuranceInfoModel) => {
                    expect(insuranceInfo.insuranceCountry.country.code).toBe('ES');
                }
            },
            {
                name: 'empty countriesList: leaves insuranceCountry as null',
                countriesList: [],
                assert: (insuranceInfo: InsuranceInfoModel) => {
                    expect(insuranceInfo.insuranceCountry).toBeNull();
                }
            }
        ].forEach(({ name, countriesList, assert }) => {
            it(name, () => {
                const transformedInfo = buildTransformedInfo(countriesList) as unknown as TransformedAncillariesInfo;

                InsuranceAncillaryTransformer.applyInsuranceCountryDefaults(transformedInfo, 'ES');

                assert(transformedInfo.insuranceInfo);
            });
        });
    });
});
