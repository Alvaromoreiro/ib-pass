import * as angular from 'angular';
import { IntegratedBobAncillaryTransformer } from './ib-web-ancillaries-bob-ancillary-transformer';
import { CkiDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-cki-datalayer-utils-service';
import type { TransformedAncillariesInfo } from './ib-web-ancillaries-transformer.model';

interface LocalStorageTestData {
    [key: string]: unknown;
}

interface BobProduct {
    price: number;
    additionalBagsPrice: number;
    currency: string;
}

interface BobSlice {
    products: BobProduct[];
}

describe('IntegratedBobAncillaryTransformer', () => {
    let IntegratedBobAncillaryTransformer: IntegratedBobAncillaryTransformer;

    let currencyServiceMock: jasmine.SpyObj<CurrencyService>;
    let checkinAncillariesConstantsMock: Pick<CheckinAncillariesConstants, 'STATUS' | 'BOB_FREE_TYPES' | 'DATALAYER_INFO'>;
    let localStorageServiceMock: jasmine.SpyObj<angular.local.storage.ILocalStorageService>;
    let localStorageData: LocalStorageTestData;
    let rootScopeMock: Pick<CommonsRootScope, 'appLang' | 'appMarket'>;
    let ckiDatalayerUtilsServiceMock: jasmine.SpyObj<CkiDatalayerUtilsService>;

    beforeEach(() => {
        currencyServiceMock = jasmine.createSpyObj('CurrencyService', ['formatPrice', 'getCurrencyObject']);
        currencyServiceMock.formatPrice.and.callFake((currency, amount) => `fmt:${amount}`);
        currencyServiceMock.getCurrencyObject.and.callFake((code) => ({ code }));

        checkinAncillariesConstantsMock = {
            STATUS: { AVAILABLE: 'AVAILABLE', NOT_AVAILABLE: 'NOT_AVAILABLE' },
            BOB_FREE_TYPES: ['INFINITAPRIME', 'INFINITA', 'PLATINO', 'SINGULAR'],
            DATALAYER_INFO: {
                MODULE_BOB: 'modulo bob',
                IMPRESSION: 'impresiones:',
                FREE: 'gratuito',
                PAYMENT: 'de pago',
                INTERACCION: 'interaccion'
            }
        } as Pick<CheckinAncillariesConstants, 'STATUS' | 'BOB_FREE_TYPES' | 'DATALAYER_INFO'>;

        localStorageData = {};
        localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['get', 'set']);
        localStorageServiceMock.get.and.callFake(<T>(key: string): T => localStorageData[key] as T);
        localStorageServiceMock.set.and.callFake((key: string, value: unknown) => { localStorageData[key] = value; return true; });

        rootScopeMock = { appLang: 'es', appMarket: 'ES' };
        ckiDatalayerUtilsServiceMock = jasmine.createSpyObj('CkiDatalayerUtilsService', ['updateDatalayerEvents']);

        angular.mock.module('ib-checkin-ancillaries-module', ($provide) => {
            $provide.value('CheckinAncillariesConstants', checkinAncillariesConstantsMock);
            $provide.value('localStorageService', localStorageServiceMock);
            $provide.value('CurrencyService', currencyServiceMock);
            $provide.value('$rootScope', rootScopeMock);
            $provide.value('CkiDatalayerUtilsService', ckiDatalayerUtilsServiceMock);
        });

        inject((_IntegratedBobAncillaryTransformer_) => {
            IntegratedBobAncillaryTransformer = _IntegratedBobAncillaryTransformer_;
        });
    });

    describe('handleIntegratedBobAncillarie', () => {
        const baseTransformedInfo = () => ({
            bobAvailable: false,
            ancillariesAvailable: [],
            bobInfo: { slices: [], priceFrom: '', additionalBagsPrice: '' }
        });

        const sliceWith = (price: number, additionalBagsPrice: number) => [
            { products: [{ price, additionalBagsPrice, currency: 'EUR' }] }
        ];

        it('AVAILABLE: converts currency, floors/formats prices, persists bobInfo and fires a PAYMENT datalayer event when price >= 1', () => {
            localStorageData.actualStepFlow = 'step2';
            const ancillarie = { type: 'INTEGRATED_BOB', status: { code: 'AVAILABLE' }, slices: sliceWith(30.9, 5.4) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            IntegratedBobAncillaryTransformer.handleIntegratedBobAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.bobAvailable).toBe(true);
            expect(transformedInfo.ancillariesAvailable).toEqual(['INTEGRATED_BOB']);
            expect(transformedInfo.bobInfo.priceFrom).toBe('fmt:30');
            expect(transformedInfo.bobInfo.additionalBagsPrice).toBe('fmt:5');
            expect(localStorageData.bobInfo).toBe(transformedInfo.bobInfo);
            expect(ckiDatalayerUtilsServiceMock.updateDatalayerEvents).toHaveBeenCalledWith(
                'modulo bob', 'es/ES/step2', 'impresiones:de pago', 'interaccion'
            );
        });

        it('AVAILABLE: fires a FREE datalayer event when the floored price is below 1', () => {
            localStorageData.actualStepFlow = 'step2';
            const ancillarie = { type: 'INTEGRATED_BOB', status: { code: 'AVAILABLE' }, slices: sliceWith(0.5, 0) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            IntegratedBobAncillaryTransformer.handleIntegratedBobAncillarie(ancillarie, transformedInfo);

            expect(ckiDatalayerUtilsServiceMock.updateDatalayerEvents).toHaveBeenCalledWith(
                'modulo bob', 'es/ES/step2', 'impresiones:gratuito', 'interaccion'
            );
        });

        it('NOT_AVAILABLE: marks bob unavailable and produces no side effects', () => {
            const ancillarie = { type: 'INTEGRATED_BOB', status: { code: 'NOT_AVAILABLE' }, slices: [] };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            IntegratedBobAncillaryTransformer.handleIntegratedBobAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.bobAvailable).toBe(false);
            expect(transformedInfo.ancillariesAvailable).toEqual([]);
            expect(localStorageServiceMock.set).not.toHaveBeenCalled();
            expect(ckiDatalayerUtilsServiceMock.updateDatalayerEvents).not.toHaveBeenCalled();
        });

        it('checkTypeUser: without bookingInfo in storage, slices are returned untouched', () => {
            const ancillarie = { type: 'INTEGRATED_BOB', status: { code: 'AVAILABLE' }, slices: sliceWith(10, 2) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            IntegratedBobAncillaryTransformer.handleIntegratedBobAncillarie(ancillarie, transformedInfo);

            expect(transformedInfo.bobInfo.slices[0].products[0].price).toBe(10);
            expect(localStorageData.frequentFlyerBOB).toBeUndefined();
        });

        it('checkTypeUser: a passenger with a BOB_FREE_TYPES topTier zeroes out every slice product price and stores frequentFlyerBOB', () => {
            localStorageData.bookingInfo = { passengers: [{ frequentFlyer: { topTier: 'PLATINO' } }] };
            const ancillarie = { type: 'INTEGRATED_BOB', status: { code: 'AVAILABLE' }, slices: sliceWith(10, 2) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            IntegratedBobAncillaryTransformer.handleIntegratedBobAncillarie(ancillarie, transformedInfo);

            expect(localStorageData.frequentFlyerBOB).toEqual({ topTier: 'PLATINO' });
            expect(transformedInfo.bobInfo.slices[0].products[0].price).toBe(0);
            expect(transformedInfo.bobInfo.slices[0].products[0].additionalBagsPrice).toBe(0);
        });

        it('checkTypeUser: passengers present but none match BOB_FREE_TYPES leaves slices untouched', () => {
            localStorageData.bookingInfo = { passengers: [{ frequentFlyer: { topTier: 'BASIC' } }] };
            const ancillarie = { type: 'INTEGRATED_BOB', status: { code: 'AVAILABLE' }, slices: sliceWith(10, 2) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            IntegratedBobAncillaryTransformer.handleIntegratedBobAncillarie(ancillarie, transformedInfo);

            expect(localStorageData.frequentFlyerBOB).toBeUndefined();
            expect(transformedInfo.bobInfo.slices[0].products[0].price).toBe(10);
        });

        it('checkTypeUser: a passenger with frequentFlyer null does not throw and is treated as no match', () => {
            localStorageData.bookingInfo = { passengers: [{ frequentFlyer: null }] };
            const ancillarie = { type: 'INTEGRATED_BOB', status: { code: 'AVAILABLE' }, slices: sliceWith(10, 2) };
            const transformedInfo = baseTransformedInfo() as unknown as TransformedAncillariesInfo;

            expect(() => IntegratedBobAncillaryTransformer.handleIntegratedBobAncillarie(ancillarie, transformedInfo)).not.toThrow();
            expect(transformedInfo.bobInfo.slices[0].products[0].price).toBe(10);
        });
    });
});
