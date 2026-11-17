import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { SummaryProps } from 'commercial-management--digital--web-components-design--library';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Currency, HeaderModel } from '@src/app/core/models/header-model/header.model';
import { PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import { IbCheckinSummaryService } from './ib-checkin-summary.service';

const segmentLocations = {
    origin: { code: 'MAD', description: 'Madrid', countryCode: 'ES', country: { code: 'ES', description: 'Spain' } },
    destination: { code: 'LHR', description: 'London', countryCode: 'GB', country: { code: 'GB', description: 'United Kingdom' } }
};

const createBaggages = () => ({
    hasBaggage: true,
    total: { total: 20, totalFormatted: 'EUR 20' },
    segments: [{
        segmentId: '1', total: 20, ...segmentLocations,
        baggages: [{ type: 'BAG', quanty: 2, description: 'Checked bag', total: 20, totalFormatted: 'EUR 20' }]
    }]
});

const createSeats = () => ({
    hasSeats: true,
    total: { total: 15, totalFormatted: 'EUR 15' },
    segments: [{
        segmentId: '1', isEarly: false, ...segmentLocations, quanty: 1, total: 15, totalFormatted: 'EUR 15',
        seats: [{ type: 'SEAT', description: '12A', quanty: 1, amount: 15, totalFormatted: 'EUR 15', totalAmountFreePassenger: '0', totalAmountPaymentPassenger: '15' }]
    }]
});

const createPriorityBoarding = () => ({
    hasPriorityBoarding: true,
    info: {
            type: 'PRIORITY', title: 'Priority', category: 'BOARDING', currency: {
                suffixSymbol: false,
                decimalSeparator: '.',
                numberDecimals: 2,
                groupingSeparator: ',',
                currencySymbol: 'EUR',
                description: 'Euro'
            } as Currency,
        amount: 5, priceFormatted: 'EUR 5', trips: [{
            quantity: 1, id: 'PB1', priceFormatted: 'EUR 5',
            departure: { code: 'MAD', description: 'Madrid' }, arrival: { code: 'LHR', description: 'London' }
        }]
    }
});

const createSpeqs = () => ({
    hasSpeqs: true,
    total: { total: 7, totalFormatted: 'EUR 7' },
    segments: [{
        segmentId: '1', total: 7, ...segmentLocations,
        speqs: [{ type: 'PETC', quanty: 1, description: 'Pet in cabin', total: 7, totalFormatted: 'EUR 7' }]
    }]
});

const createUpgrading = () => ({
    hasUpgrading: true, total: 30, totalFormatted: 'EUR 30',
    segments: [{
        segment: 9,
        origin: { code: 'MAD', description: 'Madrid' },
        destination: { code: 'LHR', description: 'London' },
        cabinClass: { code: 'J', type: 'BUSINESS', description: 'Business' }
    }]
});

const createHeaderModel = (): HeaderModel => ({
    shoppingBasket: {
        baggages: createBaggages(),
        seats: createSeats(),
        priorityBoarding: createPriorityBoarding(),
        speqs: createSpeqs(),
        upgrading: createUpgrading(),
        insurance: { hasInsurance: true, info: { offer: 'OFFER', passengers: 1, type: 'Standard' }, total: { total: 4, totalFormatted: 'EUR 4' } },
        insuranceAllianzFusionInfo: {
            code: 'ALLIANZ', hasInsuranceAllianzFusion: true,
            info: { description: 'Premium cover', totalFormatted: 'EUR 6' },
            total: { total: 6, totalFormatted: 'EUR 6' }
        },
        globickTransfers: {
            hasTransfersGlobick: true,
            total: { total: 12, totalFormatted: 'EUR 12' },
            info: { date: '2026-10-08', dateReturn: '2026-10-10', transferCar: 'CAR', totalFormatted: 'EUR 7', totalFormattedReturn: 'EUR 5' }
        },
        total: { formatted: 'EUR 99' }
    }
} as unknown as HeaderModel);

describe('IbCheckinSummaryService', () => {
    let service: IbCheckinSummaryService;
    let currencyService: jasmine.SpyObj<CurrencyService>;
    let translateService: jasmine.SpyObj<TranslateService>;
    let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let headerModel: HeaderModel;

    beforeEach(() => {
        currencyService = jasmine.createSpyObj<CurrencyService>('AJSCurrencyService', ['formatPrice']);
        currencyService.formatPrice.and.callFake((_currency: unknown, price: number) => `EUR ${price}`);
        translateService = jasmine.createSpyObj('TranslateService', ['instant']);
        translateService.instant.and.callFake((key: string) => `translated:${key}`);
        sessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);

        headerModel = createHeaderModel();

        sessionStorageService.get.and.callFake(<T = unknown>(key: string): T => {
            const value = key === 'currency' ? 'EUR' : { headerModel };
            return value as T;
        });

        TestBed.configureTestingModule({
            providers: [
                IbCheckinSummaryService,
                { provide: AJSCurrencyService, useValue: currencyService },
                { provide: TranslateService, useValue: translateService },
                { provide: CommonsSessionStorageService, useValue: sessionStorageService }
            ]
        });
        service = TestBed.inject(IbCheckinSummaryService);
    });

    it('returns the summary total and maps enabled ancillaries', () => {
        const result = service.getSummaryInfo();

        expect(result.totalPrice).toBe('EUR 99');
        expect(result.ancillaries.map(({ code }) => code)).toEqual([
            'BAGGAGE', 'PRIORITY_BOARDING', 'SEAT', 'SPECIAL_EQUIPMENT',
            'UPGRADING', 'INSURANCE', 'INSURANCE', 'TRANSFERS'
        ]);
        expect(result.ancillaries[0].segments?.[0]).toEqual({
            id: 'seg0',
            title: 'Madrid - London',
            items: [{ amount: 2, code: 'BAG', price: 'EUR 20', description: 'translated:BAGGAGE_PLURAL_TEXT Checked bag' }]
        });
        expect(result.ancillaries[1].segments?.[0].items).toEqual([{
            amount: 1, code: 'PB1', price: 'EUR 5', description: 'translated:PRIORITY_BOARDING_TITLE'
        }]);
        expect(result.ancillaries[7].items).toEqual([
            { total: 'EUR 7', type: 'CAR', subType: '2026-10-08' },
            { total: 'EUR 5', type: 'CAR', subType: '2026-10-10' }
        ]);
    });

    it('formats the updated total and includes the first discount', () => {
        const summaryProps = { ancillaries: [], totalPrice: 'old', otherItems: [{ type: 'OLD' }] } as unknown as SummaryProps;
        const priceData: PriceSubscriptionModel = {
            total: 80,
            currency: { code: 'EUR', format: {} },
            charges: [],
            discounts: [{ id: 'PROMO', total: 20, type: 'DISCOUNTS' }]
        };

        const result = service.updateSummaryInfo(summaryProps, priceData);

        expect(currencyService.formatPrice).toHaveBeenCalledWith('EUR', 80, true, false);
        expect(result.totalPrice).toBe('EUR 80');
        expect(result.otherItems?.[0].type).toBe('DISCOUNTS');
        expect(result.otherItems?.[0].total).toBe('-EUR 20');
        expect(result.otherItems?.[0].items?.[0].price).toBe('-EUR 20');
        expect(result.otherItems?.[0].items?.[0].description).toBe('translated:GENERAL_DISCOUNT PROMO');
    });

    it('clears prior discount items when there are no discounts', () => {
        const summaryProps = { ancillaries: [], totalPrice: 'old', otherItems: [{ type: 'OLD' }] } as unknown as SummaryProps;
        const priceData: PriceSubscriptionModel = { total: 80, currency: { code: 'EUR', format: {} }, charges: [], discounts: [] };

        const result = service.updateSummaryInfo(summaryProps, priceData);

        expect(result.otherItems).toBeUndefined();
    });
});