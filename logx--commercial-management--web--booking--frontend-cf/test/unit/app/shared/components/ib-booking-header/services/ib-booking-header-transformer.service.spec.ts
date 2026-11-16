import { TestBed } from '@angular/core/testing';
import { IbBookingHeaderTransformerService } from '@shared/components/ib-booking-header/services/transformers/ib-booking-header-transformer.service';
import { IbBookingHeaderBasketDiscountsViewModelService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-discounts-view-model.service';
import { ShoppingBasketViewModelService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-view-model.service';
import { OthersFeesViewModelService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-other-fees-view-model.service';
import { BookingHeaderConstants } from '@src/app/shared/components/ib-booking-header/ib-booking-header-constants';
import { IbCheckPartnersDiscountsService } from '@src/app/shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { AJSCurrencyService } from 'ib-web-commons/utils';
import { CurrencyServiceMock } from 'test/mocks/Services/CurrencyServiceMocks';


class IbCheckPartnersDiscountsServiceMock {
    isDiscountTypePartnerEquivalent = jasmine.createSpy('isDiscountTypePartnerEquivalent').and.returnValue(false);
}

class IbBookingHeaderBasketDiscountsViewModelServiceMock {
    getDiscountModel = jasmine.createSpy('getDiscountModel').and.returnValue({
        discounts: {},
        total: 0,
        hasDiscounts: false,
        totalFormated: '0€',
    });
    getDiscountsViewModel = jasmine.createSpy('getDiscountsViewModel').and.returnValue({
        discounts: {},
        total: 0,
        hasDiscounts: false,
        totalFormated: '0€',
    });
}

class ShoppingBasketViewModelServiceMock {
    calculateAllBasket = jasmine.createSpy('calculateAllBasket');
}

class OthersFeesViewModelServiceMock {
    getOthersViewModel = jasmine.createSpy('getOthersViewModel').and.returnValue({});
}

// @ts-ignore
interface TestService extends IbBookingHeaderTransformerService {
    CurrencyService: CurrencyServiceMock,
    IBCheckPartnersDiscountsService: IbCheckPartnersDiscountsServiceMock,
    IbBookingHeaderBasketDiscountsViewModelService: IbBookingHeaderBasketDiscountsViewModelServiceMock,
    ShoppingBasketViewModelService: ShoppingBasketViewModelServiceMock,
    OthersFeesViewModelService: OthersFeesViewModelServiceMock,
}


describe('IbBookingHeaderTransformerService', () => {
    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBookingHeaderTransformerService,
                { provide: AJSCurrencyService, useClass: CurrencyServiceMock},
                { provide: IbCheckPartnersDiscountsService, useClass: IbCheckPartnersDiscountsServiceMock },
                { provide: IbBookingHeaderBasketDiscountsViewModelService, useClass: IbBookingHeaderBasketDiscountsViewModelServiceMock },
                { provide: ShoppingBasketViewModelService, useClass: ShoppingBasketViewModelServiceMock },
                { provide: OthersFeesViewModelService, useClass: OthersFeesViewModelServiceMock },
            ],

        });
        service = TestBed.inject(IbBookingHeaderTransformerService) as unknown as TestService;
    });

    it('Test createTripObject function',  ()=> {
        const {createTripObject} = service;
        const trip = createTripObject(
            { 
                originCity: { code: 'MAD', description: 'Madrid' },
                destinationCity: { code: 'BCN', description: 'Barcelona' },
                dates :{
                    outboundFlight: '2023-10-01',
                    returnFlight: '2023-10-10',
                },
                passengers: {},
                tripType: '1',

                
            });
        expect(trip).toEqual({
            originCode: 'MAD',
            originCity: 'Madrid',
            destinyCode: 'BCN',
            destinyCity: 'Barcelona',
            dateFlight: '01/10/2023',
            returnFlight: '10/10/2023',
            passengers: {},
            tripType: '1',
        });
    });

    describe('Test addSteps', () => {
        it('should return an object', () => {
            const {addSteps} = service;
            const stepsModel = {
                position: 1,
                steps : [
                    { index: 0, position : 0, step: 'step0' },
                    { index: 1, position : 1, step: 'step1' },
                    { index: 2, position : 2, step: 'step2' },
                ]
            }
            const returnData = addSteps(stepsModel);
            expect(returnData).toEqual({
                position: 1,
                totalSteps: 3,
            });

        });
    });

    describe ('Test detectFlightType', ()=> {
        it('when multitrip', () => {
            const {detectFlightType} = service;
            const flightType = detectFlightType(BookingHeaderConstants.HEADER_TYPE.MULTITRIP);
            expect(flightType).toEqual({
                flightType: BookingHeaderConstants.HEADER_TYPE.MULTITRIP,
                isMultiCity: true,
            });
            
        });
        it('when default case', ()=> {
            const {detectFlightType} = service;
            const flightType = detectFlightType('default');
            expect(flightType).toEqual({
                flightType: 'default',
            });
        });
    });
    describe('Test addSimpleDiscount', () => {
        const setupShoppingBasket = (discounts: any, total: number, hasDiscounts: boolean, totalFormated: string) => ({
            discountsModel: {
                discounts,
                total,
                hasDiscounts,
                totalFormated
            },
            currency: { code: 'EUR' }
        } as any);

        const verifyUpdatedBasket = (updatedBasket: any, expectedDiscount: any, expectedTotal: number, expectedTotalFormatted: string) => {
            expect(updatedBasket.discountsModel.discounts['PROMO']).toEqual(expectedDiscount);
            expect(updatedBasket.discountsModel.total).toBe(expectedTotal);
            expect(updatedBasket.discountsModel.hasDiscounts).toBe(true);
            expect(updatedBasket.discountsModel.totalFormated).toBe(expectedTotalFormatted);
        };

        it('should add a new discount to the shopping basket', () => {
            const { addSimpleDiscount, ShoppingBasketViewModelService } = service;
            const shoppingBasket = setupShoppingBasket({}, 0, false, '');

            const discountData: any = {
                type: 'PROMO',
                description: 'Promotional Discount',
                discountFormatted: '-10€',
                totalDiscount: 10,
                discount: 10
            };

            const updatedBasket = addSimpleDiscount(shoppingBasket, discountData);

            verifyUpdatedBasket(updatedBasket, discountData, 10, '-10€');
            expect(ShoppingBasketViewModelService.calculateAllBasket).toHaveBeenCalled();
        });

        it('should replace an existing discount of the same type', () => {
            const { addSimpleDiscount, ShoppingBasketViewModelService } = service;
            const shoppingBasket = setupShoppingBasket({
                PROMO: {
                    type: 'PROMO',
                    description: 'Old Discount',
                    discountFormatted: '-5€',
                    totalDiscount: 5,
                    discount: 5
                }
            }, 5, true, '-5€');

            const discountData: any = {
                type: 'PROMO',
                description: 'Updated Discount',
                discountFormatted: '-10€',
                totalDiscount: 10,
                discount: 10
            };

            const updatedBasket = addSimpleDiscount(shoppingBasket, discountData);

            verifyUpdatedBasket(updatedBasket, discountData, 10, '-10€');
            expect(ShoppingBasketViewModelService.calculateAllBasket).toHaveBeenCalled();
        });
    });
    describe('Test updateBasketDiscountsNew', ()=> {
        it('when discountData is empty', () => {
            const shoppingBasket = {
                discountsModel: {total : 0, hasDiscounts: false, totalFormated: ''},
                total: {
                    original: 10,
                    totalPrice: 0,
                    totalPriceFormatted: '',
                }
            } as any
            const {updateBasketDiscountsNew}= service;
            const updatedBasket = updateBasketDiscountsNew(shoppingBasket, null, null, null, null);
            expect(updatedBasket).toEqual({
                "discountsModel": {
                    "total": 0,
                    "hasDiscounts": false,
                    "totalFormated": "0€",
                    "discounts": {}
                },
                "total": {
                    "original": 10,
                    "totalPrice": 10,
                    "totalPriceFormatted": "",
                    "formatted": "10€"
                }
            }as any);
        });

        it('when discountData is not empty and original total is not empty', () => {
            const shoppingBasket = {
                currency: { code: 'EUR' },
                discountsModel: {total : 0, hasDiscounts: false, totalFormated: '', discounts:{}},
                total: {
                    original: 200,
                    totalPrice: 0,
                    totalPriceFormatted: '',
                }
            } as any
            const discountData = {
                type: 'PROMO',
                description: 'Promotional Discount',
                discountFormatted: '-10€',
                totalDiscount: 10,
                discount: 10
            } as any;
            const originalPrice = {total: 200} as any;
            const {updateBasketDiscountsNew}= service;
            const updatedBasket = updateBasketDiscountsNew(shoppingBasket, discountData, originalPrice, null, 190);
            expect(updatedBasket).toEqual({
                "currency": {
                    "code": "EUR"
                },
                "discountsModel": {
                    "total": 10,
                    "hasDiscounts": true,
                    "totalFormated": "-10€",
                    "discounts": {
                        "PROMO": {
                            "type": "PROMO",
                            "description": "Promotional Discount",
                            "discountFormatted": "10€",
                            "totalDiscount": 10,
                            "discount": 10
                        }
                    }
                },
                "total": {
                    "original": 200,
                    "totalPrice": 190,
                    "totalPriceFormatted": "",
                    "formatted": "190€"
                }
            } as any);
        });
    });

    describe('Test addDiscountToBasket', () => {
        it('should add a discount to the shopping basket', () => {
            const {addDiscountToBasket} = service;
            const shoppingBasket = {
                discountsModel: {
                    discounts:  {
                        "PROMO": {
                            "type": "PROMO",
                            "description": "Promotional Discount",
                            "discountFormatted": "20€",
                            "totalDiscount": 20,
                            "discount": 20
                        }
                    },
                    total: 0,
                    hasDiscounts: false,
                    totalFormated: ''
                }
            };
            const discountData = {
                type: 'PROMO',
                description: 'Promotional Discount',
                discountFormatted: '10€',
                totalDiscount: 10,
                discount: 10
            };
            const updatedBasket = addDiscountToBasket(shoppingBasket, discountData);
            expect(updatedBasket).toEqual({
                "discountsModel": {
                    "discounts": {
                        "PROMO": {
                            "type": "PROMO",
                            "description": "Promotional Discount",
                            "discountFormatted": "10€",
                            "totalDiscount": 10,
                            "discount": 10
                        }
                    },
                    "total": -10,
                    "hasDiscounts": true,
                    "totalFormated": "10€"
                }
            }as any);
        });
    });
    describe('Test deleteDiscountFromBasket', () => {
        it('Remove current discount', ()=> {
            const {deleteDiscountFromBasket} = service;
            const discountsData = {
                "PROMO": {
                    "type": "PROMO",
                    "description": "Promotional Discount",
                    "discountFormatted": "-10€",
                    "totalDiscount": 10,
                    "discount": 10
                }
            }
            const shoppingBasket = {
                discountsModel: {
                    discounts:  discountsData,
                    total: 10,
                    hasDiscounts: true,
                    totalFormated: ''
                }
            };
            const resultData = deleteDiscountFromBasket(shoppingBasket, 'PROMO');
            expect(resultData).toEqual({
                "discountsModel": {
                    "discounts": {},
                    "total": 0,
                    "hasDiscounts": false,
                    "totalFormated": "0€"
                }
            } as any );
        }) 
    });

    describe('Test updateBasketDiscounts', ()=> {
        let shoppingBasket: any;
        beforeEach(()=> {
            const {ShoppingBasketViewModelService} = service;
            ShoppingBasketViewModelService.calculateAllBasket.calls.reset();
            service.addDiscountToBasket = jasmine.createSpy('addDiscountToBasket').and.callFake((shoppingBasket, k)=> shoppingBasket);;
            service.deleteDiscountFromBasket = jasmine.createSpy('deleteDiscountFromBasket').and.callFake((shoppingBasket, k)=> shoppingBasket);
            shoppingBasket = {
                discountsModel: {
                    discounts: {
                        'PROMO': {
                            type: 'PROMO',
                            description: 'Promotional Discount',
                            discountFormatted: '-10€',
                            totalDiscount: 10,
                            discount: 10
                        }
                    },
                    total: 10,
                    hasDiscounts: true,
                    totalFormated: ''
                }
            };
        });
        it('When modelDiscount and discountType are empty', ()=> {
            const {updateBasketDiscounts, deleteDiscountFromBasket, ShoppingBasketViewModelService} = service;
            updateBasketDiscounts(shoppingBasket, null, null);
            expect(deleteDiscountFromBasket).toHaveBeenCalledWith(shoppingBasket, 'PROMO');
            expect(ShoppingBasketViewModelService.calculateAllBasket).toHaveBeenCalled();
        });

        it('When modelDiscount is empty', ()=> {
            const {updateBasketDiscounts, deleteDiscountFromBasket, ShoppingBasketViewModelService} = service;
            updateBasketDiscounts(shoppingBasket, shoppingBasket.discountsModel.discounts.PROMO.type, null)
            expect(deleteDiscountFromBasket).toHaveBeenCalledWith(shoppingBasket, shoppingBasket.discountsModel.discounts.PROMO.type);
            expect(ShoppingBasketViewModelService.calculateAllBasket).toHaveBeenCalled();
        });
        it('When discountType and modelDiscount are not empty', ()=> {
            const {updateBasketDiscounts, addDiscountToBasket, ShoppingBasketViewModelService, IbBookingHeaderBasketDiscountsViewModelService} = service;
            updateBasketDiscounts(shoppingBasket, shoppingBasket.discountsModel.discounts.PROMO.type, {})
            expect(addDiscountToBasket).toHaveBeenCalledWith(shoppingBasket, IbBookingHeaderBasketDiscountsViewModelService.getDiscountModel({}));
            expect(ShoppingBasketViewModelService.calculateAllBasket).toHaveBeenCalled();
        });
    });

    describe('Test deleteInsuranceFromBasket', () => {

        beforeEach(()=> {
            const {ShoppingBasketViewModelService} = service;
            ShoppingBasketViewModelService.calculateAllBasket = jasmine.createSpy('calculateAllBasket');
        })
        const setupBasket = (hasInsurance: boolean, info: any) => ({
            insurance: {
                hasInsurance,
                info
            },
            insuranceAllianzFusionInfo:{
                hasInsuranceAllianzFusion: hasInsurance,
                info
            }
        });

        const verifyBasket = (updatedBasket: any, expectedHasInsurance: boolean, expectedInfo: any) => {
            expect(updatedBasket).toEqual({
                insurance: {
                    hasInsurance: expectedHasInsurance,
                    info: expectedInfo
                },
                insuranceAllianzFusionInfo:{
                    hasInsuranceAllianzFusion: expectedHasInsurance,
                    info: expectedInfo
                }
            } as any);
            expect(service.ShoppingBasketViewModelService.calculateAllBasket).toHaveBeenCalledWith(updatedBasket);
        };

        it('should remove insurance from the shopping basket', () => {
            const { deleteInsuranceFromBasket } = service;
            const shoppingBasket: any = setupBasket(true, { });

            const updatedBasket = deleteInsuranceFromBasket(shoppingBasket);

            verifyBasket(updatedBasket, false, null);
        });
    });
    describe('Test deleteGlobickTransfersFromBasket', () => {

        beforeEach(()=> {
            const {ShoppingBasketViewModelService} = service;
            ShoppingBasketViewModelService.calculateAllBasket = jasmine.createSpy('calculateAllBasket');
        })
        const setupBasket = (hasTransfersGlobick: boolean, info: any) => ({
            globickTransfers: {
                hasTransfersGlobick,
                info
            }
        });

        const verifyBasket = (updatedBasket: any, expectedGlobick: boolean, expectedInfo: any) => {
            expect(updatedBasket).toEqual({
                globickTransfers: {
                    hasTransfersGlobick: expectedGlobick,
                    info: expectedInfo
                }
            } as any);
            expect(service.ShoppingBasketViewModelService.calculateAllBasket).toHaveBeenCalledWith(updatedBasket);
        };

        it('should remove insurance from the shopping basket', () => {
            const { deleteGlobickTransfersFromBasket } = service;
            const shoppingBasket: any = setupBasket(true, {});
            const updatedBasket = deleteGlobickTransfersFromBasket(shoppingBasket);
            verifyBasket(updatedBasket, false, null);
        });
    });

    describe('Test deleteAssistCardFromBasket', () => {

        beforeEach(()=> {
            const {ShoppingBasketViewModelService} = service;
            ShoppingBasketViewModelService.calculateAllBasket = jasmine.createSpy('calculateAllBasket');
        })
        const setupBasket = (hasAssistCard: boolean, name: string | null) => ({
            assistCard: {
                hasAssistCard,
                name
            }
        });

        it('should remove assist card from shopping basket', () => {
            const { deleteAssistCardFromBasket } = service;
            const shoppingBasket: any = setupBasket(true, 'AssistCard');
            const updatedBasket = deleteAssistCardFromBasket(shoppingBasket);
            expect(updatedBasket).toEqual({
                assistCard: {
                    hasAssistCard: false,
                    name: null
                }
            } as any);
            expect(service.ShoppingBasketViewModelService.calculateAllBasket).toHaveBeenCalledWith(updatedBasket);
        });

        it('should return same basket when assist card is already disabled', () => {
            const { deleteAssistCardFromBasket } = service;
            const shoppingBasket: any = setupBasket(false, null);
            const updatedBasket = deleteAssistCardFromBasket(shoppingBasket);
            expect(updatedBasket).toEqual(shoppingBasket);
            expect(service.ShoppingBasketViewModelService.calculateAllBasket).not.toHaveBeenCalled();
        });
    });

    describe('Test initHeader', () => {
        let mockInputModel: any;

        const defaultExpectedHeader = {
            flightType: 'ONE_WAY',
            redemption: undefined,
            headerType: 'DEFAULT',
            trips: [
                {
                    originCode: 'MAD',
                    originCity: 'Madrid',
                    destinyCode: 'BCN',
                    destinyCity: 'Barcelona',
                    dateFlight: '01/10/2023',
                    returnFlight: '10/10/2023',
                    passengers: 1,
                    tripType: '1',
                },
            ],
            isMultiflight: false,
            passengers: {
                numberPassengers: 1,
                numAdults: undefined,
                numSeniors: undefined,
                numYouth: undefined,
                numTeenager: undefined,
                numChilds: undefined,
                numInfants: undefined,
            },
            shoppingBasket: {
                baggages: { segments: [], hasBaggage: false },
                bundle: { info: {}, hasBundle: false },
                seats: { segments: [], hasSeats: false },
                insurance: { info: null, hasInsurance: false },
                flexibilization: { info: null, hasFlexibilization: false },
                upgrading: { segments: [], hasUpgrading: false },
                speqs: { segments: [], hasSpeqs: false },
                priorityBoarding: { info: null, hasPriorityBoarding: false },
                carbonFootprint: { info: null, hasCarbonFootprint: false },
                globickTransfers: { info: null, hasTransfersGlobick: false },
                insuranceAllianzFusionInfo: { info: null, hasInsuranceAllianzFusion: false },
                petc: { segments: [], hasPetc: false },
                assistCard: { name: null, hasAssistCard: false },
                discountsModel: { discounts: {}, total: 0, hasDiscounts: false, totalFormated: '0€' },
                othersModel: {},
                segmentsInfo: [],
                showBasket: true,
                currency: { code: 'EUR' },
                total: { formatted: '0€', totalPrice: 0 },
            },
            showBasket: true,
            showModalBackHome: false,
            currency: { code: 'EUR' },
            showAdvancedSearch: true,
            advancedSearch: true,
            hideFlightSearch: true,
        };

        beforeEach(() => {
            spyOn(service, 'detectFlightType').and.returnValue({ flightType: 'ONE_WAY', isMultiCity: false });
            spyOn(service, 'createTripObject').and.callFake((originDestination) => ({
                originCode: originDestination.originCity.code,
                originCity: originDestination.originCity.description,
                destinyCode: originDestination.destinationCity.code,
                destinyCity: originDestination.destinationCity.description,
                dateFlight: '01/10/2023',
                returnFlight: '10/10/2023',
                passengers: originDestination.passengers,
                tripType: '1',
            }));
            service.CurrencyService.formatPrice = jasmine.createSpy('formatPrice').and.returnValue('0€') as any;

            mockInputModel = {
            hideFlightSearch: true,
            showBasket: true,
            currency: { code: 'EUR' },
            flightType: 'ONE_WAY',
            originDestination: {
                originCity: { code: 'MAD', description: 'Madrid' },
                destinationCity: { code: 'BCN', description: 'Barcelona' },
                passengers: 1,
            }
        };
        });

        it('should initialize header with default values', () => {
            const model = {
                showBasket: true,
                currency: { code: 'EUR' },
                flightType: 'ONE_WAY',
                hideFlightSearch: true,
                originDestination: {
                    originCity: { code: 'MAD', description: 'Madrid' },
                    destinationCity: { code: 'BCN', description: 'Barcelona' },
                    passengers: 1,
                },
            };

            const header = service.initHeader(model);

            expect(header).toEqual(defaultExpectedHeader as any);

            expect(service.detectFlightType).toHaveBeenCalledWith('ONE_WAY');
            expect(service.createTripObject).toHaveBeenCalledWith(model.originDestination);
            expect(service.IbBookingHeaderBasketDiscountsViewModelService.getDiscountsViewModel).toHaveBeenCalled();
            expect(service.OthersFeesViewModelService.getOthersViewModel).toHaveBeenCalledWith({ code: 'EUR' });
            expect(service.CurrencyService.formatPrice).toHaveBeenCalledWith({ code: 'EUR' }, 0, true, null);
        });

        it('should return a default header model when input model is null', () => {
            const header = service.initHeader(null);

            expect(header.headerType).toBe('DEFAULT');
            expect(header.showBasket).toBe(false);
        });

        it('should initialize header with default values and correctly populate trips', () => {
            const header = service.initHeader(mockInputModel);

            expect(header).toEqual(defaultExpectedHeader as any);
            expect(service.detectFlightType).toHaveBeenCalledWith('ONE_WAY');
            expect(service.createTripObject).toHaveBeenCalledWith(mockInputModel.originDestination);
        });

        it('should use fallback logic and call ViewModels if shoppingBasket parts are missing', () => {
            mockInputModel.currency = { code: 'USD' };
            mockInputModel.shoppingBasket = null;

            service.initHeader(mockInputModel);

           
            expect(service.IbBookingHeaderBasketDiscountsViewModelService.getDiscountsViewModel).toHaveBeenCalled();
            expect(service.OthersFeesViewModelService.getOthersViewModel).toHaveBeenCalledWith({ code: 'USD' });

            expect(service.CurrencyService.formatPrice).toHaveBeenCalledWith({ code: 'USD' }, 0, true, null);
        });
        
        it('should use existing basket data and NOT call fallback services if data is present', () => {
            mockInputModel.currency = { code: 'GBP' };
            mockInputModel.shoppingBasket = {
                discountsModel: { total: 5, hasDiscounts: true },
                othersModel: { total: 2 }
            };

            // Act
            const header = service.initHeader(mockInputModel);

            expect(header.shoppingBasket.discountsModel.total).toBe(5);
            expect(service.IbBookingHeaderBasketDiscountsViewModelService.getDiscountsViewModel).not.toHaveBeenCalled();
            expect(service.OthersFeesViewModelService.getOthersViewModel).not.toHaveBeenCalled();
        });
        
        it('should initialize header with no editable flag', () => {
            const mockInputModelNoEditable = {...mockInputModel, hideFlightSearch: undefined };
            const header = service.initHeader(mockInputModelNoEditable);

            expect(header).toEqual(defaultExpectedHeader as any);

        });
        
        it('should initialize header with no editable flag', () => {
            const mockInputModelNoEditable = {...mockInputModel, hideFlightSearch: false };
            const header = service.initHeader(mockInputModelNoEditable);

            expect(header).toEqual({...defaultExpectedHeader, hideFlightSearch: false} as any);

        });
        
        it('should correctly populate advanced search, header type, and redemption', () => {
            mockInputModel.redemption = 'AVIOS';
            mockInputModel.headerType = 'ADVANCED_SEARCH';
            mockInputModel.showAdvancedSearch = false;

            const header = service.initHeader(mockInputModel);

            expect(header.redemption).toBe('AVIOS');
            expect(header.headerType).toBe('ADVANCED_SEARCH');
            expect(header.showAdvancedSearch).toBe(false);
        });
    });
});
