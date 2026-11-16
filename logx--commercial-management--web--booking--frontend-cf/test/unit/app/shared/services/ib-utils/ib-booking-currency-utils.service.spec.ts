import { TestBed } from '@angular/core/testing';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbBookingCurrencyUtilsService } from '@shared/services/ib-utils/ib-booking-currency-utils.service';
import { CommercialDataMarket } from '@src/app/core/models/generic-models/generic-models';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';

describe('IbBookingCurrencyUtilsService', () => {
    let service: IbBookingCurrencyUtilsService;
    let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;
    let sessionStorageServiceSpy: jasmine.SpyObj<CommonsSessionStorageService>;

    beforeEach(() => {
        const currencySpy = jasmine.createSpyObj('AJSCurrencyService', ['getCurrencyObject', 'formatPrice']);
        const sessionStorageSpy = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);

        TestBed.configureTestingModule({
            providers: [
                IbBookingCurrencyUtilsService,
                { provide: AJSCurrencyService, useValue: currencySpy },
                { provide: CommonsSessionStorageService, useValue: sessionStorageSpy }
            ]
        });

        service = TestBed.inject(IbBookingCurrencyUtilsService);
        currencyServiceSpy = TestBed.inject(AJSCurrencyService) as jasmine.SpyObj<CurrencyService>;
        sessionStorageServiceSpy = TestBed.inject(CommonsSessionStorageService) as jasmine.SpyObj<CommonsSessionStorageService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should format price correctly', () => {
        const mockCurrency = { code: 'USD', symbol: '$' };
        const mockCommercialData: CommercialDataMarket = { currency: 'USD' } as any;
        sessionStorageServiceSpy.get.and.returnValue(mockCommercialData);
        currencyServiceSpy.getCurrencyObject.and.returnValue(mockCurrency);
        currencyServiceSpy.formatPrice.and.returnValue('$100.00');

        const formattedPrice = service.getPriceFormatted(100);
        expect(formattedPrice).toBe('$100.00');
        expect(sessionStorageServiceSpy.get).toHaveBeenCalledWith(BkiStorageConstants.COMMERCIAL_DATA);
        expect(currencyServiceSpy.getCurrencyObject).toHaveBeenCalledWith('USD');
        expect(currencyServiceSpy.formatPrice).toHaveBeenCalledWith(mockCurrency, 100, true, false);
    });
});
