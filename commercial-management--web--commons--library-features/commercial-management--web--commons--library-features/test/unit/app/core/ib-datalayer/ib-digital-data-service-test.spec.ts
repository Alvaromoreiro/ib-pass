import angular from 'angular';
import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
import { DigitalDataService } from '../../../../../src/app/core/ib-datalayer/services/ib-digital-data-service';

describe('Test DigitalDataService', () => {

    let service: DigitalDataService;
    let localStorageService: StorageServiceMock = new StorageServiceMock();

    let fakeWindow: any = {
        digital_data: {},
        dataLayer: {
            push: jasmine.createSpy('push')
        }
    };

    beforeEach(() => {
        localStorageService.clear();
        fakeWindow.digital_data = {};
        fakeWindow.dataLayer.push.calls.reset();

        angular.mock.module(
            'ib-datalayer-module',
            'ngCookies',
            'ib-commons-constants-module',
            'ib-monetate-module',
            ($provide) => {
                $provide.value('localStorageService', localStorageService);
                $provide.value('$window', fakeWindow);
            }
        );

        inject((_DigitalDataService_) => {
            service = _DigitalDataService_;
        });
    });

    describe('Call initDigitalData', () => {
        it('should initialize digital_data with empty object', () => {
            service.initDigitalData({});
            expect(fakeWindow.digital_data).toEqual({});
        });

        it('should extend digital_data with initial values', () => {
            service.initDigitalData({ market: 'ES' });
            expect(fakeWindow.digital_data).toEqual({ market: 'ES' });
        });
    });

    describe('Call isDigitalDataInit', () => {
        it('should return true if digital_data is object', () => {
            fakeWindow.digital_data = {};
            expect(service.isDigitalDataInit()).toBeTruthy();
        });
    });

    describe('Call addDigitalDataInfo', () => {
        beforeEach(() => {
            fakeWindow.digital_data = { market: 'ES' };
        });

        it('should extend digital_data and store it in localStorage', () => {
            service.addDigitalDataInfo({ language: 'es' });

            expect(localStorageService.get('confirmationDigitalInfo')).toEqual({
                market: 'ES',
                language: 'es'
            });
        });
    });

    describe('Call addDigitalDataEcommerceInfo', () => {
        it('should set ecommerce inside confirmationDigitalInfo', () => {
            localStorageService.set('confirmationDigitalInfo', { market: 'ES' });

            service.addDigitalDataEcommerceInfo({ items: [] });

            expect(localStorageService.get('confirmationDigitalInfo')).toEqual({
                market: 'ES',
                ecommerce: { items: [] }
            });
        });
    });

    describe('Call addDigitalDataEcommerceEvent', () => {
        it('should push ecommerce event into dataLayer', () => {
            service.addDigitalDataEcommerceEvent({ items: [] }, 'add_to_cart');

            expect(fakeWindow.dataLayer.push).toHaveBeenCalledWith(
                { ecommerce: { items: [] } },
                { event: 'add_to_cart' }
            );
        });
    });

    describe('Call setAddInfoAddToCart', () => {
        it('should add new item to addToCart storage', () => {
            service.setAddInfoAddToCart({
                items: [{ id: '1', quantity: 1 }]
            } as any);

            const addToCart = localStorageService.get('addToCart') as any;

            expect(addToCart.ecommerce.items[0].quantity).toBe(1);

        });
    });
    describe('using addToCart storage', () => {
        beforeEach(() => {
            localStorageService.set('addToCart', {
                ecommerce: { items: [{ id: '1', quantity: 2 }] }
            });
        })
        describe('Call setAddInfoAddToCart', () => {
            it('should increase quantity if item already exists', () => {

                service.setAddInfoAddToCart({
                    items: [{ id: '1', quantity: 2 }]
                } as any);

                const addToCart = localStorageService.get('addToCart') as any;

                expect(addToCart.ecommerce.items[0].quantity).toBe(4);

            });
        });

        describe('Call setRemoveInfoAddToCart', () => {
            it('should remove item if quantity matches', () => {
                service.setRemoveInfoAddToCart({
                    items: [{ id: '1', quantity: 2 }]
                } as any);

                const addToCart = localStorageService.get('addToCart') as any;

                expect(addToCart.ecommerce.items.length).toBe(0);

            });

            it('should decrease quantity if lower than stored', () => {

                service.setRemoveInfoAddToCart({
                    items: [{ id: '1', quantity: 1 }]
                } as any);

                const addToCart = localStorageService.get('addToCart') as any;

                expect(addToCart.ecommerce.items[0].quantity).toBe(1);

            });
        });
    });
    describe('Call removeDigitalDataInfo', () => {
        it('should remove attributes from digital_data', () => {
            fakeWindow.digital_data = {
                market: 'ES',
                language: 'es'
            };

            service.removeDigitalDataInfo(['market']);

            expect(fakeWindow.digital_data).toEqual({
                language: 'es'
            });
        });
    });

    describe('Call removeAllDigitalDataInfo', () => {
        it('should reset digital_data to empty object', () => {
            fakeWindow.digital_data = { market: 'ES' };
            service.removeAllDigitalDataInfo();
            expect(fakeWindow.digital_data).toEqual({});
        });
    });

    describe('Call getDigitalData', () => {
        it('should return digital_data', () => {
            fakeWindow.digital_data = { market: 'ES' };
            expect(service.getDigitalData()).toEqual({ market: 'ES' });
        });
    });

    describe('Call getDigitalDataEcommerce', () => {
        it('should return ecommerce object if exists', () => {
            fakeWindow.digital_data = { ecommerce: { items: [] } };
            expect(service.getDigitalDataEcommerce()).toEqual({ items: [] });
        });

        it('should return null if ecommerce does not exist', () => {
            fakeWindow.digital_data = {};
            expect(service.getDigitalDataEcommerce()).toBeNull();
        });
    });

    describe('Call emitEvent', () => {
        it('should push event into dataLayer', () => {
            service.emitEvent('custom_event', { foo: 'bar' });

            expect(fakeWindow.dataLayer.push).toHaveBeenCalledWith(
                { foo: 'bar' },
                { event: 'custom_event' }
            );
        });
    });

    describe('Call emitViewEvent', () => {
        it('should push view event into dataLayer', () => {
            fakeWindow.digital_data = { market: 'ES' };

            service.emitViewEvent();

            expect(fakeWindow.dataLayer.push).toHaveBeenCalledWith(
                fakeWindow.digital_data,
                { event: 'view' }
            );
        });
    });

    describe('Call emitInteractionEvent', () => {
        it('should push interaction event into dataLayer', () => {
            fakeWindow.digital_data = { market: 'ES' };

            service.emitInteractionEvent();

            expect(fakeWindow.dataLayer.push).toHaveBeenCalledWith(
                fakeWindow.digital_data,
                { event: 'interaction' }
            );
        });
    });

    describe('Call checkCurrencyOnDigitalData', () => {
        it('should set currency if not present', () => {
            fakeWindow.digital_data = {};
            localStorageService.set('currency', { code: 'EUR' });

            service.checkCurrencyOnDigitalData();

            expect(fakeWindow.digital_data.Currency).toBe('EUR');
        });

        it('should not override existing currency', () => {
            fakeWindow.digital_data = { Currency: 'USD' };
            localStorageService.set('currency', { code: 'EUR' });

            service.checkCurrencyOnDigitalData();

            expect(fakeWindow.digital_data.Currency).toBe('USD');
        });
    });

});
