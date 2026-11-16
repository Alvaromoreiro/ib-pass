import { TestBed } from "@angular/core/testing";
import { MmBDigitalDataService } from "@src/components/services/ib-MmB-datalayer/services/ib-MmB-digital-data-service";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";

describe('MmBDigitalDataService test ', () => {
    let localStorageService: any = new StorageServiceMock();
    let transformer;

    let $window: any = {
        location: {
            href: 'href',
            origin: 'orig',
            pathname: '/path',
            search: '?search',
            reload: jasmine.createSpy('reload').and.callFake(() => { })
        },
        DigitalChange: jasmine.createSpy(),
        dataLayer: {
            push: jasmine.createSpy()
        }
    };

    beforeEach(async ()=>{
        TestBed.configureTestingModule({
            declarations: [MmBDigitalDataService],
        });
        transformer = new MmBDigitalDataService($window, localStorageService);
        localStorageService.set('confirmationDigitalInfo', {})
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('and initDigitalData', () => {
        it(' have been called', (done) => {
            const obj = {test: 'test'};
            transformer.initDigitalData(obj);
            expect(transformer.digital_data).toEqual(obj);
            done();
        });
    });

    describe('and isDigitalDataInit', () => {
        it(' have been called', (done) => {
            transformer.digital_data = {};
            const result = transformer.isDigitalDataInit();
            expect(result).toBeTrue();
            done();
        });
    });

    describe('and addDigitalDataInfo', () => {
        it(' have been called', (done) => {
            const obj = {test: 'test'}
            transformer.digital_data = {};
            transformer.addDigitalDataInfo(obj);
            expect(transformer.digital_data).toEqual(obj);
            done();
        });
    });

    describe('and addDigitalDataEcommerceInfo', () => {
        it(' have been called', (done) => {
            const obj = {test: 'test'}
            const fakeDigitalData = {
                ecommerce: {test: 'test'}
            };
            transformer.digital_data = {};
            transformer.addDigitalDataEcommerceInfo(obj);
            expect(transformer.digital_data).toEqual(fakeDigitalData);
            done();
        });
    });

    describe('and addDigitalDataEcommerceEvent', () => {
        it(' have been called', (done) => {
            transformer.addDigitalDataEcommerceEvent();
            expect($window.dataLayer.push).toHaveBeenCalled();
            done();
        });
    });

    describe('and setAddInfoAddToCart', () => {
        it(' have been called without previous item', (done) => {
            inject(() => {
                const addToCart = {
                    ecommerce: {
                        items: [
                        ]
                    }
                }
                localStorageService.set('addToCart', addToCart)
            })
            const extendObj = {
                items: [
                    {
                        item1: 'item1',
                        quantity: 1
                    }
                ]
            };
            const fakeAddToCart = {
                ecommerce: {
                    items: [
                        {
                            item1: 'item1',
                            quantity: 1
                        }
                    ]
                }
            }
            transformer.setAddInfoAddToCart(extendObj);
            expect(localStorageService.get('addToCart')).toEqual(fakeAddToCart);
            done();
        });

        it(' have been called with previous item', (done) => {
            inject(() => {
                const addToCart = {
                    ecommerce: {
                        items: [
                            {
                                item1: 'item1',
                                quantity: 1
                            }
                        ]
                    }
                }
                localStorageService.set('addToCart', addToCart)
            })
            const extendObj = {
                items: [
                    {
                        item1: 'item1',
                        quantity: 1
                    }
                ]
            };
            const fakeAddToCart = {
                ecommerce: {
                    items: [
                        {
                            item1: 'item1',
                            quantity: 2
                        }
                    ]
                }
            }
            transformer.setAddInfoAddToCart(extendObj);
            expect(localStorageService.get('addToCart')).toEqual(fakeAddToCart);
            done();
        });
    });

    describe('and setRemoveInfoAddToCart', () => {

        it(' have been called remaining one item', (done) => {
            inject(() => {
                const addToCart = {
                    ecommerce: {
                        items: [
                            {
                                item1: 'item1',
                                quantity: 2
                            }
                        ]
                    }
                }
                localStorageService.set('addToCart', addToCart)
            })
            const extendObj = {
                items: [
                    {
                        item1: 'item1',
                        quantity: 1
                    }
                ]
            };
            const fakeAddToCart = {
                ecommerce: {
                    items: [
                        {
                            item1: 'item1',
                            quantity: 1
                        }
                    ]
                }
            }
            transformer.setRemoveInfoAddToCart(extendObj);
            expect(localStorageService.get('addToCart')).toEqual(fakeAddToCart);
            done();
        });

        it(' have been called delete all item', (done) => {
            inject(() => {
                const addToCart = {
                    ecommerce: {
                        items: [
                            {
                                item1: 'item1',
                                quantity: 1
                            }
                        ]
                    }
                }
                localStorageService.set('addToCart', addToCart)
            })
            const extendObj = {
                items: [
                    {
                        item1: 'item1',
                        quantity: 1
                    }
                ]
            };
            const fakeAddToCart = {
                ecommerce: {
                    items: []
                }
            }
            transformer.setRemoveInfoAddToCart(extendObj);
            expect(localStorageService.get('addToCart')).toEqual(fakeAddToCart);
            done();
        });
    });

    describe('and removeDigitalDataInfo', () => {
        it(' have been called', (done) => {
            transformer.digital_data = {test: 'test'};
            transformer.removeDigitalDataInfo(['test']);
            expect(transformer.digital_data).toEqual({});
            done();
        });
    });

    describe('and removeAllDigitalDataInfo', () => {
        it(' have been called', (done) => {
            transformer.removeAllDigitalDataInfo();
            expect(transformer.digital_data).toEqual({});
            done();
        });
    });

    describe('and getDigitalData', () => {
        it(' have been called', (done) => {
            transformer.digital_data = {};
            const result = transformer.getDigitalData();
            expect(result).toEqual({});
            done();
        });
    });

    describe('and getDigitalDataEcommerce', () => {
        it(' have been called', (done) => {
            transformer.digital_data = {ecommerce: {}};
            const result = transformer.getDigitalDataEcommerce();
            expect(result).toEqual({});
            done();
        });
    });

    describe('and emitEvent', () => {
        it(' have been called', (done) => {
            transformer.emitEvent();
            expect($window.dataLayer.push).toHaveBeenCalled();
            done();
        });
    });

    describe('and emitViewEvent', () => {
        it(' have been called', (done) => {
            transformer.emitViewEvent();
            expect($window.dataLayer.push).toHaveBeenCalled();
            done();
        });
    });

    describe('and emitInteractionEvent', () => {
        it(' have been called', (done) => {
            transformer.emitInteractionEvent();
            expect($window.dataLayer.push).toHaveBeenCalled();
            done();
        });
    });
});