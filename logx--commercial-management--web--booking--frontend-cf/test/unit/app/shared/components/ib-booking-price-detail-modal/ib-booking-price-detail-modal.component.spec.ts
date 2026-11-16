import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBookingPriceDetailModalComponent } from '@src/app/shared/components/ib-booking-price-detail-modal/ib-booking-price-detail-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbBookingCurrencyUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-currency-utils.service';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

const mockOfferItem = {
    offerItemId: 'offer123',
    passengerIds: ['ADULT_1', 'ADULT_2'],
    detailedTaxes: [{ 
        amount: 100, 
        code: 'TAX1',
        currency: 'EUR',
        description: 'Tax Description',
        subcode: 'SUB1',
        country: 'ES',
        carrier: 'IB'
    }],
    price: { currency: 'EUR', fare: 100, tax: 50, total: 150 }
};

const mockHeaderModel = {
    headerModel: {
        shoppingBasket: {
            othersModel: { hasElements: false },
            total: { formatted:"€320", original: 320, totalPrice: 320},
            baggages: { segments: [{ baggages: [{ quanty: 2, total: 100 }] }] },
            speqs: { segments: [{ speqs: [{ quanty: 1, total: 50 }] }] },
            flexibilization: { hasFlexibilization: true, info: { amount: { price: 30 } } },
            insuranceAllianzFusionInfo: { hasInsuranceAllianzFusion: true, info: { amount: { price: '20' } }, total: { totalFormatted: '€20', total: 20 } },
            globickTransfers: { hasTransfersGlobick: true, info: {trips: true}, total: {total: 40} },
            seats: { hasSeats: true, segments: [{ quanty: 2 }], total: { total: 18 } },
            priorityBoarding: { hasPriorityBoarding: true, info: { priceFormatted: '10E', trips: [{ quantity: 1 }, { quantity: 1 }], amount: 10 } },
            discountsModel: { hasDiscounts: true, total: 20, discounts: { discount1: { description: 'Test Discount', totalDiscount: 20, discountFormatted: '€20' } }, totalFormated: '€20' }

        }
    },
    greyBarModel: {
        isLogged: false,
        isONB: false,
        show: true,
        userLogged: false,
        loggedData: {},
        login: {
            onLogin: () => {},
            afterLogin: () => {},
            onError: () => {}
        }
    },
    stepsModel: { 
        currentStep: { 
            index: 0,
            page: 'availability',
            text: 'SELECT_FLIGHT'
        },
        steps: []
    }
};

describe('IbBookingPriceDetailModalComponent', () => {
    let component: IbBookingPriceDetailModalComponent;
    let fixture: ComponentFixture<IbBookingPriceDetailModalComponent>;
    let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;
    let mockHeaderFacade: any;
    let mockSessionStorage: jasmine.SpyObj<CommonsSessionStorageService>;
    let mockCurrencyService: jasmine.SpyObj<IbBookingCurrencyUtilsService>;
    let mockTranslateService: jasmine.SpyObj<TranslateService>;

    beforeEach(async () => {
        mockActiveModal = jasmine.createSpyObj('NgbActiveModal', ['close']);
        mockSessionStorage = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);
        mockCurrencyService = jasmine.createSpyObj('IbBookingCurrencyUtilsService', ['getPriceFormatted']);
        mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
        mockHeaderFacade = { getObservableHeader: () => new BehaviorSubject(mockHeaderModel) };

        await TestBed.configureTestingModule({
            declarations: [IbBookingPriceDetailModalComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: NgbActiveModal, useValue: mockActiveModal },
                { provide: CommonsSessionStorageService, useValue: mockSessionStorage },
                { provide: IbBookingCurrencyUtilsService, useValue: mockCurrencyService },
                { provide: TranslateService, useValue: mockTranslateService },
                { provide: IbBookingHeaderFacadeService, useValue: mockHeaderFacade }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        mockSessionStorage.get.and.returnValue(mockHeaderModel);
        mockCurrencyService.getPriceFormatted.and.callFake((amount) => `${amount}E`);
        mockTranslateService.instant.and.returnValue('Translated Text');

        fixture = TestBed.createComponent(IbBookingPriceDetailModalComponent);
        component = fixture.componentInstance;
        component.priceDetails = [mockOfferItem];
    });

    it('should create and initialize', () => {
        spyOn(component as any, 'initializeComponent');
        component.ngOnInit();
        expect(component).toBeTruthy();
        expect(component['initializeComponent']).toHaveBeenCalled();
    });

    it('should handle unsubscribe', () => {
        component.ngOnInit();
        spyOn(component['headerSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(component['headerSubscription'].unsubscribe).toHaveBeenCalled();
        
        component.close();
        expect(mockActiveModal.close).toHaveBeenCalled();
    });

    it('should process initial price details', () => {
        component.priceDetails = [mockOfferItem];
        component['processInitialPriceDetails']();
        expect(component.paxTypeItems).toBeDefined();
        expect(component.paxTypeItems.length).toBe(1);
        expect(component.paxTypeItems[0].paxType).toBe('ADULT');
        expect(component.paxTypeItems[0].qty).toBe(2);
        expect(component.totals).toBeDefined();
    });

    it('should format prices and handle edge cases', () => {
        expect(component['formatPrice'](100)).toBe('100E');
        expect(component['formatPrice'](null)).toBe('0E');
        expect(component['formatPrice'](undefined)).toBe('0E');
        expect(component['formatPrice'](0)).toBe('0E');
    });

    it('should map detailed taxes', () => {
        const result1 = component['mapDetailedTaxes']([{ amount: 100 }]);
        expect(result1[0].totalFormatted).toBe('100E');
        
        const result2 = component['mapDetailedTaxes'](undefined);
        expect(result2).toEqual([]);
    });

    it('should map price objects correctly', () => {
        const price = { fare: 100, tax: 50, total: 150 };
        const result = component['mapPriceObject'](price, 2);
        expect(result.allPassengersTotal).toBe(300);
        expect(result.allPassengersTax).toBe(100);
        expect(result.allPassengersFare).toBe(200);
        expect(result.formattedPrices.fareFormatted).toBe('100E');
        expect(result.formattedTotals.allPassengersTotalFormatted).toBe('300E');
    });

    it('should calculate totals', () => {
        component.paxTypeItems = [{ 
            paxType: 'ADULT',
            titles: ['Adult'],
            taxes: [],
            qty: 1,
            price: { 
                currency: 'EUR',
                fare: 200,
                tax: 100,
                ticketingFee: 0,
                total: 300,
                allPassengersTax: 100, 
                allPassengersFare: 200,
                allPassengersTotal: 300,
                formattedTotals: {
                    allPassengersFareFormatted: '200E',
                    allPassengersTaxFormatted: '100E',
                    allPassengersTotalFormatted: '300E'
                },
                formattedPrices: {
                    fareFormatted: '200E',
                    taxFormatted: '100E',
                    totalFormatted: '300E'
                }
            }
        }];
        const taxResult = component['calculateTotal']('Tax');
        const fareResult = component['calculateTotal']('Fare');
        expect(taxResult.total).toBe(100);
        expect(fareResult.total).toBe(200);
        expect(taxResult.totalFormatted).toBe('100E');
    });

    it('should handle header updates and different scenarios', () => {
        component.priceDetails = [mockOfferItem];
        
        component['handleHeaderUpdate'](mockHeaderModel as any);
        expect(component.ancillaries).toBeDefined();
        expect(component.totalPrice).toBe('€320');
        
        component.ancillaries = null;
        const simpleHeaderModel = { 
            ...mockHeaderModel,
            headerModel: { 
                ...mockHeaderModel.headerModel,
                shoppingBasket: { 
                    ...mockHeaderModel.headerModel.shoppingBasket,
                    total: { formatted: '', totalPrice: 0, original: 0 }
                }
            }
        };
        component['handleHeaderUpdate'](simpleHeaderModel as any);
        expect(component.ancillaries).toBeDefined();
        
        const metasearchModel = {
            ...mockHeaderModel,
            headerModel: { ...mockHeaderModel.headerModel, flightType: 'metasearchFlight' },
            stepsModel: { currentStep: { index: 1 } }
        };
        component['updateModalData'](metasearchModel as any);
        expect(component.totalPrice).toBe('150E');
        
        const noFormattedModel = {
            ...mockHeaderModel,
            headerModel: { ...mockHeaderModel.headerModel, shoppingBasket: { ...mockHeaderModel.headerModel.shoppingBasket, total: {}, discountsModel: {} } }
        };
        component['updateModalData'](noFormattedModel as any);
        expect(component.totalPrice).toBe('150E');
    });

    it('should process discounts', () => {
        const result = component['prepareDiscounts'](mockHeaderModel as any);
        expect(result.items.length).toBe(1);
        expect(result.total).toBe(20);
        expect(result.totalFormatted).toBe('€20');
        
        const noDiscountsModel = { 
            ...mockHeaderModel,
            headerModel: { 
                ...mockHeaderModel.headerModel,
                shoppingBasket: { 
                    ...mockHeaderModel.headerModel.shoppingBasket,
                    discountsModel: { 
                        hasDiscounts: false,
                        total: 0,
                        discounts: {},
                        totalFormated: '0E'
                    } 
                }
            }
        };
        const nullResult = component['prepareDiscounts'](noDiscountsModel as any);
        expect(nullResult).toBeNull();
    });

    it('should process all ancillaries', () => {
        const result = component['prepareAncillaries'](mockHeaderModel as any);
        expect(result.rows.length).toBe(7);
        expect(result.totalPrice).toBe(268);
        expect(result.totalFormatted).toBe('268E');
    });

    it('should handle individual ancillary processing', () => {
        const rows: { category: string; quantity: number; total: number | string }[] = [];
        
        expect(component['processBaggageAncillary'](mockHeaderModel.headerModel.shoppingBasket.baggages as any, rows)).toBe(100);
        expect(rows.length).toBe(1);
        
        expect(component['processSpeqAncillary'](mockHeaderModel.headerModel.shoppingBasket.speqs as any, rows)).toBe(50);
        expect(rows.length).toBe(2);
        
        expect(component['processFlexibilizationAncillary'](mockHeaderModel.headerModel.shoppingBasket.flexibilization as any, rows)).toBe(30);
        
        expect(component['processInsuranceAncillary'](mockHeaderModel.headerModel.shoppingBasket.insuranceAllianzFusionInfo as any, rows)).toBe(20);
        
        expect(component['processTransfersAncillary'](mockHeaderModel.headerModel.shoppingBasket.globickTransfers as any, rows)).toBe(40);
        
        expect(component['processSeats'](mockHeaderModel.headerModel.shoppingBasket.seats as any, rows)).toBe(18);
        
        expect(component['processPriorityBoarding'](mockHeaderModel.headerModel.shoppingBasket.priorityBoarding as any, rows)).toBe(10);
    });

    it('should handle negative ancillary cases', () => {
        const rows: { category: string; quantity: number; total: number | string }[] = [];
        
        expect(component['processBaggageAncillary'](null, rows)).toBe(0);
        expect(component['processSpeqAncillary'](null, rows)).toBe(0);
        expect(component['processFlexibilizationAncillary']({ hasFlexibilization: false, info: null }, rows)).toBe(0);
        expect(component['processInsuranceAncillary']({ hasInsuranceAllianzFusion: false, info: null, total: { total: 0, totalFormatted: '0E' } }, rows)).toBe(0);
        expect(component['processTransfersAncillary']({ hasTransfersGlobick: false, info: null, total: { total: 0, totalFormatted: '0E' } }, rows)).toBe(0);
        expect(component['processSeats']({ hasSeats: false, segments: null, total: { total: 0, totalFormatted: '0E' } }, rows)).toBe(0);
        expect(component['processPriorityBoarding']({ hasPriorityBoarding: false, info: null, total: { total: 0, totalFormatted: '0E' } }, rows)).toBe(0);
        expect(rows.length).toBe(0);
    });

    it('should handle calculateItemsInfo edge cases', () => {
        expect(component['calculateItemsInfo'](null, 'baggages')).toEqual({ quantity: 0, total: 0 });
        expect(component['calculateItemsInfo']([], 'baggages')).toEqual({ quantity: 0, total: 0 });
        
        const segments = [{ baggages: [{ quanty: null, total: undefined }] }, { baggages: [{ quanty: 2, total: 50 }] }];
        expect(component['calculateItemsInfo'](segments, 'baggages')).toEqual({ quantity: 2, total: 50 });
    });

    it('should test hasFlexibilization method', () => {
        expect(component['hasFlexibilization']({ 
            hasFlexibilization: true, 
            info: { 
                amount: { price: 30, priceFormatted: '30E', title: 'Flex' },
                category: 'FLEX',
                currency: { 
                    code: 'EUR', 
                    symbol: '€',
                    description: 'Euro',
                    alignment: 'right',
                    groupingSeparator: '.',
                    decimalSeparator: ',',
                    decimals: 2,
                    recommendedDisplay: 'symbol'
                },
                delete: [],
                items: [],
                title: 'Flex',
                type: 'FLEX_TYPE'
            }
        })).toBe(true);
        expect(component['hasFlexibilization']({ hasFlexibilization: false, info: null })).toBe(false);
    });

    it('should test hasAllianzInsurance method', () => {
        expect(component['hasAllianzInsurance']({ hasInsuranceAllianzFusion: true, info: {}, total: { total: 20, totalFormatted: '20E' } })).toBe(true);
        expect(component['hasAllianzInsurance']({ hasInsuranceAllianzFusion: false, info: null, total: { total: 0, totalFormatted: '0E' } })).toBe(false);
    });

    it('should test hasSeats method', () => {
        expect(component['hasSeats']({ 
            hasSeats: true, 
            segments: [{
                isEarly: false,
                destination: { 
                    code: 'MAD',
                    country: { code: 'ES', description: 'Spain' },
                    description: 'Madrid Airport'
                },
                origin: { 
                    code: 'BCN',
                    country: { code: 'ES', description: 'Spain' },
                    description: 'Barcelona Airport'
                },
                quanty: 1,
                seats: [],
                segmentId: 'SEG1',
                total: 0,
                totalFormatted: '0E'
            }],
            total: { total: 0, totalFormatted: '0E' }
        })).toBe(true);
        expect(component['hasSeats']({ hasSeats: true, segments: [], total: { total: 0, totalFormatted: '0E' } })).toBe(false);
    });

    it('should test hasPriorityBoarding method', () => {
        expect(component['hasPriorityBoarding']({ 
            hasPriorityBoarding: true, 
            info: {
                amount: 10,
                category: 'PRIORITY',
                currency: { 
                    code: 'EUR', 
                    symbol: '€',
                    description: 'Euro',
                    alignment: 'right',
                    groupingSeparator: '.',
                    decimalSeparator: ',',
                    decimals: 2,
                    recommendedDisplay: 'symbol'
                },
                delete: [],
                items: [],
                priceFormatted: '10E',
                title: 'Priority',
                trips: []
            },
            total: { total: 10, totalFormatted: '10E' }
        })).toBe(true);
        expect(component['hasPriorityBoarding']({ hasPriorityBoarding: true, info: null, total: { total: 0, totalFormatted: '0E' } })).toBe(false);
    });

    it('should test hasTransfers method', () => {
        expect(component['hasTransfers']({ 
            hasTransfersGlobick: true, 
            info: {
                date: '2024-01-01',
                dateReturn: '2024-01-02',
                totalFormatted: '40E',
                totalFormattedReturn: '40E',
                transferCar: 'Car'
            },
            total: { total: 40, totalFormatted: '40E' }
        })).toBe(true);
        expect(component['hasTransfers']({ hasTransfersGlobick: false, info: null, total: { total: 0, totalFormatted: '0E' } })).toBe(false);
    });

    it('should handle invalid price values', () => {
        const rows: { category: string; quantity: number; total: number | string }[] = [];
        
        const invalidFlexibilization = { 
            hasFlexibilization: true, 
            info: {
                amount: { price: NaN, priceFormatted: 'invalidE', title: 'Invalid Flex' },
                category: 'FLEX',
                currency: { 
                    code: 'EUR', 
                    symbol: '€',
                    description: 'Euro',
                    alignment: 'right',
                    groupingSeparator: '.',
                    decimalSeparator: ',',
                    decimals: 2,
                    recommendedDisplay: 'symbol'
                },
                delete: [],
                items: [],
                title: 'Invalid Flex',
                type: 'FLEX_TYPE'
            }
        };
        expect(component['processFlexibilizationAncillary'](invalidFlexibilization, rows)).toBe(0);
        
        const invalidInsurance = { 
            hasInsuranceAllianzFusion: true, 
            info: { amount: { price: 'invalid' } },
            total: { total: 0, totalFormatted: '€20' }
        };
        expect(component['processInsuranceAncillary'](invalidInsurance, rows)).toBe(0);
    });

    it('should initialize component with and without priceDetails', () => {
        spyOn(component as any, 'processInitialPriceDetails');
        spyOn(component as any, 'initializeHeaderSubscription');
        
        component.priceDetails = [mockOfferItem];
        component['initializeComponent']();
        expect(component['processInitialPriceDetails']).toHaveBeenCalled();
        
        component.priceDetails = null;
        component['initializeComponent']();
        expect(component['initializeHeaderSubscription']).toHaveBeenCalled();
    });
});
