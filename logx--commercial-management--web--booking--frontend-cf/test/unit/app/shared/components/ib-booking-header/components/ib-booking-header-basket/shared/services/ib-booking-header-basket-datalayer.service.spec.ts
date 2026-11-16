import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DatalayerBasketService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-datalayer.service';
import { AJSDatalayerBKIService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { ShoppingBasketPetcSegment, ShoppingBasketTripSegmentPoint } from '../../../../../../../../../app/core/models/ib-booking-availability/header-model';



const fakeDigitalDataService = {
    addDigitalDataEcommerceEvent: jasmine.createSpy('addDigitalDataEcommerceEvent'),
    setRemoveInfoAddToCart: jasmine.createSpy('setRemoveInfoAddToCart')
}

const fakeDatalayerUtilsService = {
    getItemCategory2: jasmine.createSpy('getItemCategory2'),
    getItemCategory3: jasmine.createSpy('getItemCategory3'),
}

const fakeDatalayerBKIService = {
    getIdItem: jasmine.createSpy('getIdItem'),
    getSpeqsVariant: jasmine.createSpy('getSpeqsVariant'),
    getSliceById: jasmine.createSpy('getSliceById'),
    getBrand: jasmine.createSpy('getBrand'),
}

const fakeAddToCart = {
    ecommerce: {
        items: [{
            item_name: 'baggage',
            item_id: 'id',
            item_category2: 'MAD-BCN',
            item_variant: '15 kilos',
            price: 30,
            quantity: 1
        }]
    }
}

const fakeSegment = {
    baggages: [{
        type: '15',
        description: '15 Kg'
    }],
    speqs: [{
        type: 'speqType'
    }],
    origin: {
        code: 'MAD'
    },
    destination: {
        code: 'BCN'
    }
}

const fakeSeat = {
    passengers: [{}],
    amount: 1
}

describe('DatalayerBasketService tests', () => {
    let service: DatalayerBasketService;
    let fakeSessionStorage = new StorageServiceMock();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                DatalayerBasketService,
                { provide: AJSRootScope, useValue: { appLang: 'ES' } },
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: DigitalDataService, useValue: fakeDigitalDataService },
                { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService },
                { provide: AJSDatalayerBKIService, useValue: fakeDatalayerBKIService }
            ]
        });
        service = TestBed.inject(DatalayerBasketService);
    });
    afterEach(() => {
        fakeSessionStorage.remove('addToCart')
    })

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('when deleteBaggages is called,', () => {
        beforeEach(() => {
            const fakeAddToCart = {
                ecommerce: {
                    items: [{
                        item_name: 'baggage',
                        item_id: 'id',
                        item_category2: 'MAD-BCN',
                        item_variant: '15 kilos',
                        price: 30,
                        quantity: 1
                    }]
                }
            }
            fakeSessionStorage.set('addToCart', fakeAddToCart)
        })
        it('the baggage type is deleted in segment object', () => {
            fakeDatalayerBKIService.getIdItem = jasmine.createSpy('getIdItem').and.returnValue('id')
            service.deleteBaggages(fakeSegment, '15');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({
                items: [{ item_name: 'baggage', item_id: 'id', item_category2: 'MAD-BCN', item_variant: '15 kilos', price: 30, quantity: 1 }]
            }, 'remove_from_cart')
        })
    })

    describe('when deleteSeats is called,', () => {
        beforeEach(() => {
            fakeAddToCart.ecommerce.items[0] = {
                item_name: 'seat',
                item_id: 'id',
                item_category2: 'MAD-BCN',
                item_variant: '15 kilos',
                price: 1,
                quantity: 1
            }
            fakeSessionStorage.set('addToCart', fakeAddToCart)
            fakeSessionStorage.set('seatInfoConfirmation', {
                segments: [
                    {
                        id: 'id',
                        departure: {
                            code: 'MAD'
                        },
                        arrival: {
                            code: 'BCN'
                        }
                    }
                ]
            })
        })
        it('seat is deleted and digital_data_ecommerce is notified', () => {
            service.deleteSeats('id', fakeSeat);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({
                items: [{ item_name: 'seat', item_id: 'id', item_category2: 'MAD-BCN', item_variant: '15 kilos', price: 1, quantity: 1 }]
            }, 'remove_from_cart')
        })
    })
    describe('when deleteAncillaries is called,', () => {
        beforeEach(() => {
            fakeAddToCart.ecommerce.items[0] = {
                item_name: 'flexibilization'
            } as any
            fakeSessionStorage.set('addToCart', fakeAddToCart)
        })
        it('flexibilitation ancillarie is deleted and digital_data_ecommerce is notified', () => {
            service.deleteAncillaries('flexibility');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({ items: [{ item_name: 'flexibilization' }] }, 'remove_from_cart')
        })
    })
    describe('when deleteSpeqs is called,', () => {
        beforeEach(() => {
            fakeAddToCart.ecommerce.items[0] = {
                item_name: 'special baggage',
                item_id: 'id',
                item_category2: 'MAD-BCN',
                item_variant: 'speqType'
            } as any
            fakeSessionStorage.set('addToCart', fakeAddToCart)
        })
        it('flexibilitation ancillarie is deleted and digital_data_ecommerce is notified', () => {
            fakeDatalayerBKIService.getIdItem = jasmine.createSpy('getIdItem').and.returnValue('id')
            fakeDatalayerBKIService.getSpeqsVariant = jasmine.createSpy('getSpeqsVariant').and.returnValue('speqType')
            service.deleteSpeqs(fakeSegment, 'speqType');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({ items: [{ item_name: 'special baggage', item_id: 'id', item_category2: 'MAD-BCN', item_variant: 'speqType' }] }, 'remove_from_cart')
        })
    })

    describe('when deleteInsurance is called,', () => {
        beforeEach(() => {
            fakeAddToCart.ecommerce.items[0] = {
                item_name: 'insurance',
            } as any
            fakeSessionStorage.set('addToCart', fakeAddToCart)
        })
        it('flexibilitation ancillarie is deleted and digital_data_ecommerce is notified', () => {
            service.deleteInsurance();
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({ items: [{ item_name: 'insurance' }] }, 'remove_from_cart')
        })
    })

    describe('when deletePriorityBoarding is called,', () => {
        it('priority boarding ancillarie is deleted and digital_data_ecommerce is notified', () => {
            fakeAddToCart.ecommerce.items[0] = {
                item_name: 'priority boarding',
                item_id: 'id',
                item_category2: 'MAD-BCN'
            } as any
            fakeSessionStorage.set('addToCart', fakeAddToCart)
            fakeDatalayerBKIService.getIdItem = jasmine.createSpy('getIdItem').and.returnValue('id')
            fakeDatalayerUtilsService.getItemCategory2 = jasmine.createSpy('getItemCategory2').and.returnValue('MAD-BCN')
            service.deletePriorityBoarding('');
            
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalledWith({ 
                items: [{ 
                    item_name: 'priority boarding', 
                    item_id: 'id', 
                    item_category2: 'MAD-BCN' 
                }] 
            }, 'remove_from_cart')
        })
    })

    describe('when deleteBundle is called,', () => {
        beforeEach(() => {
            fakeAddToCart.ecommerce.items[0] = {
                item_name: 'bundle',
                item_variant: ['bundle']
            } as any
            fakeSessionStorage.set('addToCart', fakeAddToCart)
        })
        it('priority boarding ancillarie is deleted and digital_data_ecommerce is notified', () => {
            service.deleteBundle({ id: 'bundle' });
            expect(fakeDigitalDataService.setRemoveInfoAddToCart).toHaveBeenCalledWith({
                items: [
                    {
                        item_name: "bundle",
                        item_variant: [
                            "bundle"
                        ]
                    },
                    {
                        item_name: "bundle",
                        item_variant: [
                            "bundle"
                        ]
                    }
                ]
            })
        })
    })
    describe('when removePetItemFromBasket is called', () => {
        it('ancillarie is deleted and digital_data_ecommerce is notified', () => {

            const deletedPets: ShoppingBasketPetcSegment = {
                origin: { code: 'MAD' } as ShoppingBasketTripSegmentPoint,
            destination: { code: 'BCN' } as ShoppingBasketTripSegmentPoint,
            pets: [
                { amount: 50, type: { id: 'DOG' } } as any,
                { amount: 30, type: { id: 'CAT' } }
            ]
        } as ShoppingBasketPetcSegment;
        
        fakeDatalayerBKIService.getIdItem.and.returnValue('item123');
        fakeDatalayerBKIService.getBrand.and.returnValue('BrandX');
        fakeSessionStorage.set('selectedTripSegments', [[{ departure: { code: 'MAD' } }]]);
        fakeDatalayerUtilsService.getItemCategory3.and.returnValue('category3');

        service.removePetItemFromBasket(deletedPets);

        expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
        const [digitalDataArg, eventArg] = fakeDigitalDataService.addDigitalDataEcommerceEvent.calls.mostRecent().args;

        expect(eventArg).toBe('remove_from_cart');
        expect(digitalDataArg.items.length).toBe(2);
        expect(digitalDataArg.items[0].item_name).toBe('pet');
        expect(digitalDataArg.items[0].item_variant).toBe('perro');
        expect(digitalDataArg.items[1].item_variant).toBe('gato');
        
        });
    });
});

