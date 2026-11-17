import * as angular from 'angular';
import { Co2FootprintAncillaryTransformer } from './ib-web-ancillaries-co2-ancillary-transformer';
import type { TransformedAncillariesInfo } from './ib-web-ancillaries-transformer.model';

describe('Co2FootprintAncillaryTransformer', () => {
    let Co2FootprintAncillaryTransformer: Co2FootprintAncillaryTransformer;

    let currencyServiceMock: jasmine.SpyObj<CurrencyService>;
    let checkinAncillariesConstantsMock: Pick<CheckinAncillariesConstants, 'STATUS' | 'TYPE_ANCILLARIE'>;
    let localStorageServiceMock: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;
    let localStorageData: Record<string, unknown>;

    beforeEach(() => {
        currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['formatPrice']);
        currencyServiceMock.formatPrice.and.callFake((currency, amount) => `fmt:${amount}`);

        checkinAncillariesConstantsMock = {
            STATUS: { AVAILABLE: 'AVAILABLE', NOT_AVAILABLE: 'NOT_AVAILABLE' },
            TYPE_ANCILLARIE: { CO2_FOOTPRINT: 'CO2_FOOTPRINT' }
        } as Pick<CheckinAncillariesConstants, 'STATUS' | 'TYPE_ANCILLARIE'>;

        localStorageData = {};
        localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['get', 'set']);
        localStorageServiceMock.get.and.callFake(<T>(key: string): T => localStorageData[key] as T);
        localStorageServiceMock.set.and.callFake((key: string, value: unknown) => { localStorageData[key] = value; return true; });

        angular.mock.module('ib-checkin-ancillaries-module', ($provide) => {
            $provide.value('CheckinAncillariesConstants', checkinAncillariesConstantsMock);
            $provide.value('localStorageService', localStorageServiceMock);
            $provide.value('CurrencyService', currencyServiceMock);
        });

        inject((_Co2FootprintAncillaryTransformer_) => {
            Co2FootprintAncillaryTransformer = _Co2FootprintAncillaryTransformer_;
        });
    });

    describe('handleCo2FootprintAncillarie', () => {
        const baseTransformedInfo = () => ({
            ancillariesAvailable: [],
            ancillariesCarbonFootprint: null,
            currency: { code: 'EUR' }
        });

        it('AVAILABLE and not previously purchased: populates ancillariesCarbonFootprint and persists it', () => {
            const ancillarie = { type: 'CO2_FOOTPRINT', status: { code: 'AVAILABLE' }, price: 5, kilosCo2Equivalent: 12.5 };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            Co2FootprintAncillaryTransformer.handleCo2FootprintAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.ancillariesAvailable).toEqual(['CO2_FOOTPRINT']);
            expect(transformedInfo.ancillariesCarbonFootprint).toEqual(jasmine.objectContaining({
                price: 5, priceFormatted: 'fmt:5', priceFrom: 'fmt:5', kilosCo2Equivalent: 12.5, kilosCo2EquivalentFormatted: '12,5', confirmed: false
            }));
            expect(localStorageData.co2Footprint).toBe(transformedInfo.ancillariesCarbonFootprint);
        });

        it('kilosCo2Equivalent falsy: formats to an empty string instead of a comma-replaced value', () => {
            const ancillarie = { type: 'CO2_FOOTPRINT', status: { code: 'AVAILABLE' }, price: 5, kilosCo2Equivalent: 0 };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            Co2FootprintAncillaryTransformer.handleCo2FootprintAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.ancillariesCarbonFootprint.kilosCo2EquivalentFormatted).toBe('');
        });

        it('AVAILABLE but already purchased (summaryInfo.issuedItems contains CO2_FOOTPRINT): does nothing', () => {
            localStorageData.summaryInfo = { issuedItems: [{ type: 'CO2_FOOTPRINT' }] };
            const ancillarie = { type: 'CO2_FOOTPRINT', status: { code: 'AVAILABLE' }, price: 5, kilosCo2Equivalent: 12.5 };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            Co2FootprintAncillaryTransformer.handleCo2FootprintAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(transformedInfo.ancillariesCarbonFootprint).toBeNull();
            expect(localStorageData.co2Footprint).toBeUndefined();
        });

        it('NOT_AVAILABLE: does nothing', () => {
            const ancillarie = { type: 'CO2_FOOTPRINT', status: { code: 'NOT_AVAILABLE' }, price: 5, kilosCo2Equivalent: 12.5 };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            Co2FootprintAncillaryTransformer.handleCo2FootprintAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(transformedInfo.ancillariesCarbonFootprint).toBeNull();
        });
    });
});
