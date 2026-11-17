import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { PaymentComponentConfig } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-model';
import { PriceSubscriptionModel } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-component.model';
import { IbCheckInPmtFormService } from './ib-checkin-pmt-form.service';

interface PaymentWebComponentMock {
    init: jasmine.Spy<(config: PaymentComponentConfig) => Promise<void>>;
}

interface PaymentServiceTestAccess {
    importWebComponent: () => Promise<PaymentWebComponentMock>;
    paymentWebComponent: PaymentWebComponentMock | null;
}

describe('IbCheckInPmtFormService', () => {
    let service: IbCheckInPmtFormService;
    let sessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;
    let currencyService: jasmine.SpyObj<CurrencyService>;

    beforeEach(() => {
        sessionStorageService = jasmine.createSpyObj<CommonsSessionStorageService>('CommonsSessionStorageService', ['get']);
        currencyService = jasmine.createSpyObj<CurrencyService>('CurrencyService', ['formatPrice']);
        service = new IbCheckInPmtFormService(sessionStorageService, currencyService);
    });

    it('should format a price using the stored currency', () => {
        sessionStorageService.get.and.returnValue('EUR');
        currencyService.formatPrice.and.returnValue('EUR 125.00');

        const result = service.getPriceFormatted(125);

        expect(sessionStorageService.get).toHaveBeenCalledOnceWith('currency');
        expect(currencyService.formatPrice).toHaveBeenCalledOnceWith('EUR', 125, true, false);
        expect(result).toBe('EUR 125.00');
    });

    it('should emit updated price data', () => {
        const priceData: PriceSubscriptionModel = {
            total: 125,
            currency: { code: 'EUR', format: {} },
            charges: [],
            discounts: []
        };
        const listener = jasmine.createSpy('priceUpdateListener');
        service.priceUpdateEmitter.subscribe(listener);

        service.updatePrice(priceData);

        expect(listener).toHaveBeenCalledOnceWith(priceData);
    });

    it('should initialize the payment component once and reuse it for later configurations', async () => {
        const paymentComponent: PaymentWebComponentMock = {
            init: jasmine.createSpy<(config: PaymentComponentConfig) => Promise<void>>('init').and.resolveTo(undefined)
        };
        const serviceTestAccess = service as unknown as PaymentServiceTestAccess;
        const importComponent = spyOn(serviceTestAccess, 'importWebComponent').and.callFake(async () => {
            serviceTestAccess.paymentWebComponent = paymentComponent;
            return paymentComponent;
        });
        const firstConfig = {} as PaymentComponentConfig;
        const secondConfig = { contextId: 'context-2' } as PaymentComponentConfig;

        const firstResult = await service.getNewPaymentComponent(firstConfig);
        const secondResult = await service.getNewPaymentComponent(secondConfig);

        expect(importComponent).toHaveBeenCalledTimes(1);
        expect(paymentComponent.init).toHaveBeenCalledWith(firstConfig);
        expect(paymentComponent.init).toHaveBeenCalledWith(secondConfig);
        expect(firstResult).toBe(paymentComponent);
        expect(secondResult).toBe(paymentComponent);
    });
});