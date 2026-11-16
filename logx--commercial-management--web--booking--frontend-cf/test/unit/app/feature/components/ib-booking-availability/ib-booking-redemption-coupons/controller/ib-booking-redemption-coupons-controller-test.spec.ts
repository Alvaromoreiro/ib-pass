import { fakeAsync, tick } from '@angular/core/testing';
import {StorageServiceMock} from '../../../../../../../mocks/Services/StorageServiceMock';
import angular from 'angular';
describe('RedemptionCouponsController test', () => {

    let scope;
    let controllerDependencies = {
        $scope : {
            $apply: ()=>{},
            $emit: (event:string,...args)=>{},
        },
    };
    let fakeCoupon = {
        offerList : [{
            discountedPrice:{
                totalPoints:{
                    fare:{}
                },
                totalCash : {
                    fare:5
                }
            },
            basePrice : {
                totalCash : {
                    fare: {}
                },
                totalPoints : {
                    fare:10
                }
            },
            optionId: ''
        }],
        name: 'coupon'
    };
    const fakeTotalPrice = {
        oldPriceWithoutDiscount:{
            totalCash: 10,
            totalAvios: 5
        },
        price: {
            totalCash:0,
            totalAvios:0,
        },
        redemptionOptionId:1
    };
    const fakeCommercialData = {
        currency:{
            groupingSeparator:1
        },

    }
    let controller;
    let fakeSessionStorage = new StorageServiceMock();
    const fakeCurrencyService = {
        formatPrice: jasmine.createSpy('formatPrice'),
        getCurrencyObject: jasmine.createSpy('getCurrencyObject'),
        formatAvios: jasmine.createSpy('formatAvios')
    };
    const fakeGdprService = {
        getConditionsCoupon: jasmine.createSpy('getConditionsCoupon'),
    };
    const fakeBookingModalService = {
        showGenericModal: jasmine.createSpy('showGenericModal'),
        showGenericError: jasmine.createSpy('showGenericError'),
    };
    const fakeContentParserUtilsService = {
    };

    beforeEach(() =>{
        angular.mock.module('ib-booking-redemption-coupons-module', ($provide) => {
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('GdprService', fakeGdprService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('ContentParserUtilsService', fakeContentParserUtilsService);
            $provide.value('localStorageService', fakeSessionStorage);
        });
        inject(($controller,$rootScope) =>{
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controller = $controller('RedemptionCouponsController', controllerDependencies);
            scope.$digest();
        });
    });

    describe('When controller is called ', () =>{
        it('it will be defined', () =>{
            expect(controller).toBeDefined();
        });
    })

    describe('When setPromotion is called ', () =>{
        it('it will set promotion to true value', () =>{
            spyOn(controllerDependencies.$scope,"$emit")
            controller.setPromotion();
            expect(controller.promotion).toBeTrue();
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith('refreshAvailability');
        });
    })
    describe('When setPromotion is called ', () =>{
        it('it will set promotion to true value', () =>{
            fakeCurrencyService.formatPrice = jasmine.createSpy('formatPrice').and.returnValue("2€");
            fakeCurrencyService.formatAvios = jasmine.createSpy('formatAvios').and.returnValue("2 Avios");
            fakeCurrencyService.getCurrencyObject.and.returnValue('EU');

            spyOn(controllerDependencies.$scope,"$emit")
            controller.totalPrice = fakeTotalPrice;
            controller.commercialData = fakeCommercialData;
            controller.selectCoupon(fakeCoupon);
            expect(controller.promotion).toBeTrue();
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith('setCoupon', fakeCoupon);
            expect(controller.totalPrice.oldPriceWithoutDiscount.totalCash).toBe("2€");
            expect(controller.totalPrice.oldPriceWithoutDiscount.totalAvios).toBe("2 Avios");
        });
        it('it set oldPriceWithoutDiscout if does not exist', () =>{
            fakeCurrencyService.formatPrice = jasmine.createSpy('formatPrice').and.returnValue("2€");
            fakeCurrencyService.formatAvios = jasmine.createSpy('formatAvios').and.returnValue("2 Avios");
            fakeCurrencyService.getCurrencyObject.and.returnValue('EU');

            spyOn(controllerDependencies.$scope,"$emit")
            controller.totalPrice = fakeTotalPrice;
            controller.totalPrice.oldPriceWithoutDiscount = null;
            controller.commercialData = fakeCommercialData;
            controller.selectCoupon(fakeCoupon);
            expect(controller.promotion).toBeTrue();
            expect(controllerDependencies.$scope.$emit).toHaveBeenCalledWith('setCoupon', fakeCoupon);
            expect(controller.totalPrice.oldPriceWithoutDiscount.totalCash).toBe("2€");
            expect(controller.totalPrice.oldPriceWithoutDiscount.totalAvios).toBe("2 Avios");
        });
    })
    describe('When setCondition is called ', () =>{
        it('and getConditionsCoupon resolves with 200 response and data is filled', fakeAsync(() =>{
            const fakeResponse = {
                modals:[{
                    elements:[{
                        description:'description'
                    }],
                    title:'title'
                }],

            }
            fakeGdprService.getConditionsCoupon = jasmine.createSpy('getConditionsCoupon').and.returnValue(Promise.resolve(fakeResponse));
            controller.seeConditions(null,fakeCoupon);
            tick();
            expect(fakeBookingModalService.showGenericModal).toHaveBeenCalledWith(false, 'ib-generic-external-modal.html',{info:fakeResponse.modals[0]});
        }));
        it('and getConditionsCoupon resolves with 200 response and data is empty', fakeAsync(() =>{
            fakeGdprService.getConditionsCoupon = jasmine.createSpy('getConditionsCoupon').and.returnValue(Promise.resolve({}));
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.returnValue({result:Promise.resolve()});
            controller.seeConditions(null,fakeCoupon);
            tick();

            expect(fakeBookingModalService.showGenericError).toHaveBeenCalledWith({
                errorCode: -1,
                message: 'REST_SERVICE_ERROR_GENERAL',
                needsTranslate: true,
                internalErrorCode: ''
            }, true);

        }));
        it('and getConditionsCoupon reject with 400 error', fakeAsync(() =>{
            const fakeError = {
                errorCode: -1,
                message: 'REST_SERVICE_ERROR_GENERAL',
                needsTranslate: true,
                internalErrorCode: ''
            }
            fakeGdprService.getConditionsCoupon = jasmine.createSpy('getConditionsCouponError').and.returnValue(Promise.reject(fakeError));
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.returnValue({result:Promise.resolve()});

            controller.seeConditions(null,fakeCoupon);
            tick();
            expect(fakeBookingModalService.showGenericError).toHaveBeenCalledWith(fakeError, true)
        }));
    })
})

