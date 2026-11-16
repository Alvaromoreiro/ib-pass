import { IbBookingHeaderBasketDiscountsViewModelService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-discounts-view-model.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from 'test/mocks/Services/TranslateServiceAngularMock';
import { IbCheckPartnersDiscountsService } from '@src/app/shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { ShoppingBasketDiscountsModel } from '@src/app/core/models/ib-booking-availability/header-model';


let fakeTranslateService;

const fakeIbCheckPartnersDiscountsService = {
    isDiscountTypePartnerEquivalent: jasmine.createSpy('isDiscountTypePartnerEquivalent')
}

const fakeModelDiscount = {
    discount: 10,
    originalDiscount: 5,
    description: '10€'
}

const fakeVoucherModelDiscount = {
    discount: 10,
    originalDiscount: 5
}

const fakeVoucherReturnValue = {
    discountFormatted: 10,
    discount: 5,
    description: 'BONUS_CARD_GIFT_TEXT',
    type: 'VOUCHER',
    totalDiscount: 5
}

const returnFakeModelDiscount = {
    discountFormatted: 10,
    discount: 5,
    description: '10€',
    type: 'PARTNER',
    totalDiscount: 5
}

describe('IbBookingHeaderBasketDiscountsViewModelService tests', () => {
    let service: IbBookingHeaderBasketDiscountsViewModelService;
    fakeTranslateService = new TranslateServiceMock();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                IbBookingHeaderBasketDiscountsViewModelService,
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: IbCheckPartnersDiscountsService, useValue: fakeIbCheckPartnersDiscountsService }
            ]
        });
        service = TestBed.inject(IbBookingHeaderBasketDiscountsViewModelService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('when getDiscountsViewModel is called,',()=>{
        it(' it will return empty discounts model', ()=>{
            let returnService = service.getDiscountsViewModel();
            expect(returnService).toEqual({
                hasDiscounts: false,
                total: 0,
                discounts: {}
            } as ShoppingBasketDiscountsModel)
        })
    })
    describe('when getDiscountModel is called',()=>{
        it(' and discount type is AVIOS, it will return avios discount model', ()=>{
            const aviosModelDiscount = {
                formatedAvios: '10 Avios',
                discount: 10,
                description: 'Descuento 10 Avios',
                originalDiscount: 10
            }
            let returnService = service.getDiscountModel(aviosModelDiscount, 'AVIOS');
            expect(returnService).toEqual({
                formattedElement: '10 Avios',
                type: 'AVIOS',
                discountFormatted: 10,
                description: 'Descuento 10 Avios',
                discount: 10,
                totalDiscount: 10
            })
        })
        it(' and discount type is VOUCHER, it will return voucher discount model', ()=>{

            let returnService = service.getDiscountModel(fakeVoucherModelDiscount, 'VOUCHER');
            expect(returnService).toEqual(fakeVoucherReturnValue)
        })
        it(' and discount type is DUMBO, it will return partner discount model', ()=>{
            let returnService = service.getDiscountModel(fakeModelDiscount, 'DUMBO');
            expect(returnService).toEqual(returnFakeModelDiscount)
        })
        it(' and discount type is PLUTO, it will return partner discount model', ()=>{
            let returnService = service.getDiscountModel(fakeModelDiscount, 'PLUTO');
            expect(returnService).toEqual(returnFakeModelDiscount)
        })
        it(' and discount type is PARTNER, it will return partner discount model', ()=>{
            let returnService = service.getDiscountModel(fakeModelDiscount, 'PARTNER');
            expect(returnService).toEqual(returnFakeModelDiscount)
        })
        it(' and discount type is CORPORATE, it will return corporate discount model', ()=>{
            let returnService = service.getDiscountModel(fakeModelDiscount, 'CORPORATE');
            expect(returnService).toEqual({...returnFakeModelDiscount, type: 'CORPORATE'})
        })
        it(' and discount type is DYNAMIC_PRICING, it will return dynamic pricing discount model', ()=>{
            let returnService = service.getDiscountModel({...fakeModelDiscount, totalDiscount:10}, 'DYNAMIC_PRICING');
            expect(returnService).toEqual({...returnFakeModelDiscount, type: 'DYNAMIC_PRICING', discount: 10})
        })
        it(' and discount type is other, it will return voucher discount model', ()=>{
            let returnService = service.getDiscountModel(fakeVoucherModelDiscount, 'OTHER');
            expect(returnService).toEqual(fakeVoucherReturnValue)
        })
    })
    describe('when deleteDiscount is called',()=>{
        it(' and discountType is partner, it will delete discount partner from model', ()=>{
            const modelDiscount = {
                discounts:{
                    'PARTNER':{
                        discount: 2
                    }
                },
                total:10
            }
            fakeIbCheckPartnersDiscountsService.isDiscountTypePartnerEquivalent = jasmine.createSpy('isDiscountTypePartnerEquivalent').and.returnValue('partner')
            service.deleteDiscount(modelDiscount,'PARTNER');
            expect(modelDiscount).toEqual({discounts:{},total:8} as any)
        })
        it(' and discountType is not partner, it will delete all discounts from model', ()=>{
            const fakeModel = {
                discounts:{
                    'PARTNER':{
                        discount: 2
                    },
                    'DUMBO':{
                        discount: 2
                    }
                },
                total:10
            }
            service.deleteDiscount(fakeModel, null);
            expect(fakeModel).toEqual({
                discounts:{},
                total:0,
                hasDiscounts: false
            } as any)
        })
    })
});

