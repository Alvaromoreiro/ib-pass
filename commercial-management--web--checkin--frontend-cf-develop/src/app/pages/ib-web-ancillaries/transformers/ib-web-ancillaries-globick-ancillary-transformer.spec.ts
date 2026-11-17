import * as angular from 'angular';
import { GlobickAncillaryTransformer } from './ib-web-ancillaries-globick-ancillary-transformer';
import type { TransformedAncillariesInfo } from './ib-web-ancillaries-transformer.model';

describe('GlobickAncillaryTransformer', () => {
    let GlobickAncillaryTransformer: GlobickAncillaryTransformer;

    let currencyServiceMock: jasmine.SpyObj<CurrencyService>;
    let checkinAncillariesConstantsMock: Pick<CheckinAncillariesConstants, 'STATUS'>;
    let localStorageServiceMock: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;
    let localStorageData: Record<string, unknown>;

    beforeEach(() => {
        currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['formatPrice']);
        currencyServiceMock.formatPrice.and.callFake((currency, amount) => `fmt:${amount}`);

        checkinAncillariesConstantsMock = {
            STATUS: { AVAILABLE: 'AVAILABLE', NOT_AVAILABLE: 'NOT_AVAILABLE' }
        } as Pick<CheckinAncillariesConstants, 'STATUS'>;

        localStorageData = {};
        localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['get', 'set']);
        localStorageServiceMock.get.and.callFake(<T>(key: string): T => localStorageData[key] as T);
        localStorageServiceMock.set.and.callFake((key: string, value: unknown) => { localStorageData[key] = value; return true; });

        angular.mock.module('ib-checkin-ancillaries-module', ($provide) => {
            $provide.value('CheckinAncillariesConstants', checkinAncillariesConstantsMock);
            $provide.value('localStorageService', localStorageServiceMock);
            $provide.value('CurrencyService', currencyServiceMock);
        });

        inject((_GlobickAncillaryTransformer_) => {
            GlobickAncillaryTransformer = _GlobickAncillaryTransformer_;
        });
    });

    describe('handleGlobickAncillarie', () => {
        const baseTransformedInfo = () => ({
            ancillariesAvailable: [],
            ancillariesTransfersGlobick: null,
            currency: { code: 'EUR' }
        });

        const subTypes = (transferStatus: string, includeExp: boolean) => {
            const types = [{ glbType: 'TRANS', status: { code: transferStatus } }];
            if (includeExp) {
                types.push({ glbType: 'EXP', status: { code: 'AVAILABLE' } });
            }
            return types;
        };

        it('both ancillarie and transfer AVAILABLE with an EXP subtype: populates the transfer AND flags globick activities', () => {
            const ancillarie = { type: 'GLOBICK', status: { code: 'AVAILABLE' }, price: 20, date: '2026-01-01', transferCar: 'sedan', subTypes: subTypes('AVAILABLE', true) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            GlobickAncillaryTransformer.handleGlobickAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.ancillariesAvailable).toEqual(['GLOBICK']);
            expect(transformedInfo.ancillariesTransfersGlobick).toEqual(jasmine.objectContaining({ price: 20, priceFormatted: 'fmt:20', confirmed: false }));
            expect(localStorageData.globickTransfers).toBe(transformedInfo.ancillariesTransfersGlobick);
            expect(localStorageData.isGlobickActivities).toBe(true);
        });

        it('quirk: the EXP check is independent of the first block - transfer NOT_AVAILABLE but EXP present still flags globick activities', () => {
            const ancillarie = { type: 'GLOBICK', status: { code: 'AVAILABLE' }, price: 20, date: '2026-01-01', transferCar: 'sedan', subTypes: subTypes('NOT_AVAILABLE', true) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            GlobickAncillaryTransformer.handleGlobickAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(transformedInfo.ancillariesTransfersGlobick).toBeNull();
            expect(localStorageData.globickTransfers).toBeUndefined();
            expect(localStorageData.isGlobickActivities).toBe(true);
        });

        it('no EXP subtype present: isGlobickActivities is never set even when the transfer is populated', () => {
            const ancillarie = { type: 'GLOBICK', status: { code: 'AVAILABLE' }, price: 20, date: '2026-01-01', transferCar: 'sedan', subTypes: subTypes('AVAILABLE', false) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            GlobickAncillaryTransformer.handleGlobickAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.ancillariesTransfersGlobick).not.toBeNull();
            expect(localStorageData.isGlobickActivities).toBeUndefined();
        });

        it('ancillarie NOT_AVAILABLE with no EXP subtype: does nothing at all', () => {
            const ancillarie = { type: 'GLOBICK', status: { code: 'NOT_AVAILABLE' }, price: 20, date: '2026-01-01', transferCar: 'sedan', subTypes: subTypes('AVAILABLE', false) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            GlobickAncillaryTransformer.handleGlobickAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(transformedInfo.ancillariesTransfersGlobick).toBeNull();
            expect(localStorageData.globickTransfers).toBeUndefined();
            expect(localStorageData.isGlobickActivities).toBeUndefined();
        });
    });
});
