import { EventEmitter } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { IbMmbPaymentFormService } from "@src/components/ib-MmB-payment/components/ib-Mmb-payment-component/services/ib-Mmb-payment-form.service";
import { StorageServiceMock } from "@test/mocks/services/StorageServiceMock";
import { CurrencyServiceMock } from "@test/unit/utils/CurrencyServiceMocks";
import { AJSCurrencyService, CommonsSessionStorageService } from "ib-web-commons/utils";
import { priceSubscriptionData } from "./price-subscription-data.mock";
import { PriceSubscriptionModel } from "@src/components/ib-MmB-payment/models/ib-Mmb-payments-component-model";
import { paymentComponentConfig } from "./payment-component-config.mock";
import { mockBasketTotalWithDCC, mockBasketTotalWithoutDCC, mockCurrencyConversionReal, mockEURCurrencyDisplayFormat, mockHeaderModelComplete, mockPriceSubscriptionModelWithDCC, mockPriceSubscriptionModelWithoutDCC, mockUSDCurrencyDisplayFormat } from "./payment-dcc-data.mock";

class EventEmitterService {
    priceUpdateEmitter: EventEmitter<PriceSubscriptionModel> = new EventEmitter();
};

class initMock {
    public response = {
        name: 'mockPaymentWebComponentInitialized'
    };
    init = (componentConfig) => {
        if (this.response) {
            return Promise.resolve(this.response);
        } else {
            return Promise.reject();
        }
    }
};

describe('Test IbMmbPaymentFormService', () => {
    let service: IbMmbPaymentFormService;
    let fakeCommonsSessionStorageService = new StorageServiceMock();
    let fakeAJSCurrencyUtilsService = new CurrencyServiceMock();
    let fakeCurrency = require('@test/mocks/storage/currency-mock.json');
    let fakeEventEmitterService: EventEmitterService = new EventEmitterService();
    let fakeInit: initMock;

    beforeEach(() => {
        fakeCommonsSessionStorageService.clear();
        fakeInit = new initMock();
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IbMmbPaymentFormService,
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: AJSCurrencyService, useValue: fakeAJSCurrencyUtilsService }
            ]
        });
        service = TestBed.inject(IbMmbPaymentFormService);
        service['paymentWebComponent'] = jasmine.createSpy('init').and.returnValue({ result: Promise.resolve({ name: 'mockPaymentWebComponentInitialized' }) });
    });

    xdescribe('When call getNewPaymentComponent and paymentWebComponent is not defined', () => {
        beforeEach(() => {

        });

        it('should return paymentWebComponent', async (done) => {
            await service.getNewPaymentComponent(paymentComponentConfig);
            done();
        });
    });

    xdescribe('When call getNewPaymentComponent and paymentWebComponent is defined', () => {
        beforeEach(() => {
            service['paymentWebComponent'] = { name: 'mockPaymentWebComponent' };
        });

        it('should return paymentWebComponent', async (done) => {
            inject(() => {
                /*
                fakeInit.response.name = 'mockPaymentWebComponentInitialized';
                spyOn(service['paymentWebComponent'], 'init');
                */
                service['paymentWebComponent'] = jasmine.createSpy('init').and.returnValue({ result: Promise.resolve({ name: 'mockPaymentWebComponentInitialized' }) });
            });
            //service['paymentWebComponent'].init = fakeInit.init(paymentComponentConfig);
            let result = await service.getNewPaymentComponent(paymentComponentConfig);
            expect(result).toBe('mockPaymentWebComponentInitialized');
            done();
        });
    });

    describe('When call getPriceFormatted', () => {
        it('Should return price formatted', () => {
            fakeCommonsSessionStorageService.set('currency', fakeCurrency);
            expect(service.getPriceFormatted(20)).toBe('20€');
        });
    });

    describe('When call updatePrice', () => {
        beforeEach(() => {
            service.priceUpdateEmitter = fakeEventEmitterService.priceUpdateEmitter;
        });

        it('Should emit event priceUpdateEmitter with priceSubscriptionData', async () => {
            spyOn(fakeEventEmitterService.priceUpdateEmitter, 'emit');
            // @ts-expect-error
            await service.updatePrice(priceSubscriptionData);
            // @ts-expect-error
            expect(fakeEventEmitterService.priceUpdateEmitter.emit).toHaveBeenCalledWith(priceSubscriptionData);
        });
    });

    describe('💳 DCC - Dynamic Currency Conversion Functions', () => {

        describe('formatPrice - Formateo de precios', () => {
            it('should format EUR price with right alignment (54.00€)', () => {
                const price = 54;
                const format = mockEURCurrencyDisplayFormat;
                const result = service.formatPrice(price, format);
                expect(result).toBe('54.00€');
            });

            it('should format USD price with right alignment (60.98$)', () => {
                const price = 60.98;
                const format = mockUSDCurrencyDisplayFormat;
                const result = service.formatPrice(price, format);
                expect(result).toBe('60.98$');
            });
            it('should format zero price correctly (0.00€)', () => {
                const price = 0;
                const format = mockEURCurrencyDisplayFormat;
                const result = service.formatPrice(price, format);
                expect(result).toBe('0.00€');
            });
        });

        describe('processDccPrice - Price processing DCC', () => {
            it('should return formatted DCC price when valid conversion exists (60.98USD)', () => {
                spyOn(service, 'formatDCCInfo').and.returnValue('60.98USD');
                const result = service.processDccPrice(mockPriceSubscriptionModelWithDCC);
                expect(result).toBe('60.98USD');
                expect(service.formatDCCInfo).toHaveBeenCalledWith(
                    mockCurrencyConversionReal,
                    mockEURCurrencyDisplayFormat
                );
            });

            it('should return undefined when currencyConversion is undefined (no DCC)', () => {
                const dataWithoutDCC = mockPriceSubscriptionModelWithoutDCC;
                const result = service.processDccPrice(dataWithoutDCC);
                expect(result).toBeUndefined();
            });

            it('should not update when formatted price is the same', () => {
                const basketTotal = {
                    ...mockBasketTotalWithDCC,
                    totalDcc: '60.98USD' 
                };
                const headerModel = { ...mockHeaderModelComplete };
                const setSpy = spyOn(fakeCommonsSessionStorageService, 'set');
                spyOn(service, 'processDccPrice').and.returnValue('60.98USD');
                service['updateDccInBasket'](basketTotal, headerModel, mockPriceSubscriptionModelWithDCC);
                expect(setSpy).not.toHaveBeenCalled();
                expect(basketTotal.totalDcc).toBe('60.98USD');
            });

        });

        describe('formatDCCInfo - Configuration of DCC information', () => {
            it('should format price with USD currency from conversion', () => {
                spyOn(service, 'formatPrice').and.returnValue('60.98$');
                const result = service.formatDCCInfo(
                    mockCurrencyConversionReal,
                    mockEURCurrencyDisplayFormat
                );

                expect(result).toBe('60.98$');
                expect(service.formatPrice).toHaveBeenCalledWith(
                    60.98,
                    jasmine.objectContaining({
                        symbol: jasmine.objectContaining({
                            value: 'USD'
                        })
                    })
                );
            });
        });

        describe('getHeaderModel (private) - Obtaining the header model', () => {
            it('should return header model when exists in sessionStorage', () => {
                fakeCommonsSessionStorageService.set('headerModel', mockHeaderModelComplete);
                const result = service['getHeaderModel']();
                expect(result).toBeDefined();
                expect(result.headerModel.shoppingBasket.total.totalDcc).toBe('60.98USD');
            });

            it('should return null when headerModel does not exist', () => {
                fakeCommonsSessionStorageService.clear();
                const result = service['getHeaderModel']();
                expect(result).toBeNull();
            });
        });

        describe('hasCurrencyConversion (private) - Conversion validation', () => {
            it('should return true when valid conversion exists', () => {
                const dataWithDCC = mockPriceSubscriptionModelWithDCC;
                const result = service['hasCurrencyConversion'](dataWithDCC);
                expect(result).toBe(true);
            });

            it('should return false when no conversion exists', () => {
                const dataWithoutDCC = mockPriceSubscriptionModelWithoutDCC;
                const result = service['hasCurrencyConversion'](dataWithoutDCC);
                expect(result).toBe(false);
            });
        });

        describe('updateDCCInHeaderModel - Actualización del DCC en header', () => {
            beforeEach(() => {
                fakeCommonsSessionStorageService.set('headerModel', mockHeaderModelComplete);
            });

            it('should update basket with DCC when conversion exists', () => {
                spyOn(service as any, 'getHeaderModel').and.returnValue(mockHeaderModelComplete);
                spyOn(service as any, 'hasCurrencyConversion').and.returnValue(true);
                const updateSpy = spyOn(service as any, 'updateDccInBasket');
                service.updateDCCInHeaderModel(mockPriceSubscriptionModelWithDCC);
                expect(updateSpy).toHaveBeenCalledWith(
                    mockHeaderModelComplete.headerModel.shoppingBasket.total,
                    mockHeaderModelComplete,
                    mockPriceSubscriptionModelWithDCC
                );
            });

            it('should remove DCC when no conversion exists', () => {
                spyOn(service as any, 'getHeaderModel').and.returnValue(mockHeaderModelComplete);
                spyOn(service as any, 'hasCurrencyConversion').and.returnValue(false);
                const removeSpy = spyOn(service as any, 'removeDccFromBasket');
                service.updateDCCInHeaderModel(mockPriceSubscriptionModelWithoutDCC);
                expect(removeSpy).toHaveBeenCalled();
            });
        });

        describe('removeDccFromBasket (private) - Remove DCC from basket', () => {
            it('should remove totalDcc property and update session storage', () => {
                const basketTotal = { ...mockBasketTotalWithDCC };
                const headerModel = { ...mockHeaderModelComplete };
                const setSpy = spyOn(fakeCommonsSessionStorageService, 'set');

                service['removeDccFromBasket'](basketTotal, headerModel);

                expect('totalDcc' in basketTotal).toBe(false);
                expect(setSpy).toHaveBeenCalledWith('headerModel', headerModel);
            });

            it('should not update session storage when totalDcc does not exist', () => {
                const basketTotal = { ...mockBasketTotalWithoutDCC };
                const headerModel = { ...mockHeaderModelComplete };
                const setSpy = spyOn(fakeCommonsSessionStorageService, 'set');

                service['removeDccFromBasket'](basketTotal, headerModel);

                expect(setSpy).not.toHaveBeenCalled();
            });
        });

        describe('updateDccInBasket (private) - Update DCC in basket', () => {
            it('should update totalDcc when new formatted price is different', () => {
                const basketTotal = { ...mockBasketTotalWithoutDCC };
                const headerModel = { ...mockHeaderModelComplete };
                const setSpy = spyOn(fakeCommonsSessionStorageService, 'set');
                spyOn(service, 'processDccPrice').and.returnValue('60.98USD');

                service['updateDccInBasket'](basketTotal, headerModel, mockPriceSubscriptionModelWithDCC);

                expect(basketTotal.totalDcc).toBe('60.98USD');
                expect(setSpy).toHaveBeenCalledWith('headerModel', headerModel);
            });

            it('should not update when formatted price is the same', () => {
                const basketTotal = { ...mockBasketTotalWithDCC };
                const headerModel = { ...mockHeaderModelComplete };
                const setSpy = spyOn(fakeCommonsSessionStorageService, 'set');
                spyOn(service, 'processDccPrice').and.returnValue('60.98USD');

                service['updateDccInBasket'](basketTotal, headerModel, mockPriceSubscriptionModelWithDCC);

                expect(setSpy).not.toHaveBeenCalled();
            });

            it('should not update when processDccPrice returns undefined', () => {
                const basketTotal = { ...mockBasketTotalWithoutDCC };
                const headerModel = { ...mockHeaderModelComplete };
                const setSpy = spyOn(fakeCommonsSessionStorageService, 'set');
                spyOn(service, 'processDccPrice').and.returnValue(undefined);

                service['updateDccInBasket'](basketTotal, headerModel, mockPriceSubscriptionModelWithDCC);

                expect(setSpy).not.toHaveBeenCalled();
                expect(basketTotal.totalDcc).toBeUndefined();
            });

            it('should not update when processDccPrice returns empty string', () => {
                const basketTotal = { ...mockBasketTotalWithoutDCC };
                const headerModel = { ...mockHeaderModelComplete };
                const setSpy = spyOn(fakeCommonsSessionStorageService, 'set');
                spyOn(service, 'processDccPrice').and.returnValue('');

                service['updateDccInBasket'](basketTotal, headerModel, mockPriceSubscriptionModelWithDCC);

                expect(setSpy).not.toHaveBeenCalled();
            });
        });

    });
});
