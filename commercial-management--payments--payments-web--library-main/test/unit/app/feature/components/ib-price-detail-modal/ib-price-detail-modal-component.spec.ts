import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbPriceDetailModalComponent } from 'src/app/feature/components/ib-pmt-price-details-modal/ib-price-detail-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonsSessionStorageService, AJSCurrencyService } from 'ib-web-commons/utils';
import { AJSNewMainHeaderFacadeToken } from 'src/components/ib-payments/cmpnts/ib-pmt/service/ib-header-facade-bridge.service';
import { BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockOfferItem = {
    passengerIds: ['ADULT_1', 'ADULT_2'],
    detailedTaxes: [{ amount: 100, code: 'TAX1' }],
    price: { currency: 'EUR', fare: 100, tax: 50, total: 150 }
};

const mockHeaderModel = {
    headerModel: {
        shoppingBasket: {
            total: { formatted: '€320' },
            baggages: { segments: [{ baggages: [{ quanty: 2, total: 100 }] }] },
            speqs: { segments: [{ speqs: [{ quanty: 1, total: 50 }] }] },
            flexibilization: { hasFlexibilization: true, info: { amount: { price: 30 } } },
            insuranceAllianzFusionInfo: { hasInsuranceAllianzFusion: true, info: { amount: { price: '20' } }, total: { total : 20, totalFormatted: '€20' } },
            globickTransfers: { hasTransfersGlobick: true, info: {trips: true}, total: {total: 40} },
            seats: { hasSeats: true, segments: [{ quanty: 2 }], total: { total: 18 } },
            priorityBoarding: { hasPriorityBoarding: true, info: { priceFormatted: '10E', trips: [{ quantity: 1 }, { quantity: 1 }], amount: 10 } },
            discountsModel: { hasDiscounts: true, total: 20, discounts: { discount1: { description: 'Test Discount', totalDiscount: 20, discountFormatted: '€20' } }, totalFormated: '€20' },
            othersModel: { hasElements: false, others: {}, total: { total: 0, totalFormatted: '0E' } }
        }
    }
};


const mockCommercialData = {
    currency: 'EUR'
};

class MockCurrencyService {
    formatPrice = jasmine.createSpy('formatPrice').and.callFake((currency, amount) => `${amount}E`);
    getCurrencyObject = jasmine.createSpy('getCurrencyObject').and.returnValue({ currency: 'EUR' });
}

describe('IbPriceDetailModalComponent', () => {
    let component: IbPriceDetailModalComponent;
    let fixture: ComponentFixture<IbPriceDetailModalComponent>;
    let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;
    let mockHeaderFacade: any;
    let mockSessionStorage: jasmine.SpyObj<any>;
    let mockCurrencyService: MockCurrencyService;
    let mockTranslateService: jasmine.SpyObj<TranslateService>;

    beforeEach(async () => {
        mockActiveModal = jasmine.createSpyObj('NgbActiveModal', ['close']);
        mockSessionStorage = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);
        mockCurrencyService = new MockCurrencyService();
        mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
        mockHeaderFacade = { getObservableHeader: () => new BehaviorSubject(mockHeaderModel) };

        await TestBed.configureTestingModule({
            declarations: [IbPriceDetailModalComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: NgbActiveModal, useValue: mockActiveModal },
                { provide: CommonsSessionStorageService, useValue: mockSessionStorage },
                { provide: AJSCurrencyService, useValue: mockCurrencyService },
                { provide: TranslateService, useValue: mockTranslateService },
                { provide: AJSNewMainHeaderFacadeToken, useValue: mockHeaderFacade }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        mockSessionStorage.get.and.callFake((key) => {
            if (key === 'commercialData') return mockCommercialData;
            if (key === 'headerModel') return null;
            return null;
        });
        
        mockTranslateService.instant.and.returnValue('Translated Text');

        fixture = TestBed.createComponent(IbPriceDetailModalComponent);
        component = fixture.componentInstance;
        component.priceDetails = [mockOfferItem as any];
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
        component.priceDetails = [mockOfferItem as any];
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
        component.paxTypeItems = [{ price: { allPassengersTax: 100, allPassengersFare: 200 } } as any];
        const taxResult = component['calculateTotal']('Tax');
        const fareResult = component['calculateTotal']('Fare');
        expect(taxResult.total).toBe(100);
        expect(fareResult.total).toBe(200);
        expect(taxResult.totalFormatted).toBe('100E');
    });

    it('should handle header updates and different scenarios', () => {
        component.priceDetails = [mockOfferItem as any];
        
        component['handleHeaderUpdate'](mockHeaderModel as any);
        expect(component.ancillaries).toBeDefined();
        expect(component.totalPrice).toBe('€320');
        
        component.ancillaries = null;
        component['handleHeaderUpdate']({} as any);
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
            headerModel: { ...mockHeaderModel.headerModel, shoppingBasket: { ...mockHeaderModel.headerModel.shoppingBasket, total: {} } }
        };
        component['updateModalData'](noFormattedModel as any);
        expect(component.totalPrice).toBe('150E');
        
        // Test for othersModel handling
        const modelWithoutOthers = {
            ...mockHeaderModel,
            headerModel: { 
                ...mockHeaderModel.headerModel, 
                shoppingBasket: { 
                    ...mockHeaderModel.headerModel.shoppingBasket
                }
            }
        };
        delete modelWithoutOthers.headerModel.shoppingBasket.othersModel;
        component['updateModalData'](modelWithoutOthers as any);
        expect(component.otherCharges).toBeNull();
    });

    it('should process discounts', () => {
        const result = component['prepareDiscounts'](mockHeaderModel as any);
        expect(result.items.length).toBe(1);
        expect(result.total).toBe(20);
        expect(result.totalFormatted).toBe('€20');
        
        const noDiscountsModel = { headerModel: { shoppingBasket: { discountsModel: { hasDiscounts: false } } } };
        const nullResult = component['prepareDiscounts'](noDiscountsModel as any);
        expect(nullResult).toBeNull();
    });

    it('should process othersModel', () => {
        // Test with othersModel present but hasElements false
        const result1 = component['prepareOthers'](mockHeaderModel as any);
        expect(result1).toBeNull();
        
        // Test with othersModel undefined
        const modelWithoutOthers = {
            headerModel: { shoppingBasket: {} }
        };
        const result2 = component['prepareOthers'](modelWithoutOthers as any);
        expect(result2).toBeNull();
        
        // Test with othersModel having elements
        const modelWithOthers = {
            headerModel: {
                shoppingBasket: {
                    othersModel: {
                        hasElements: true,
                        others: {
                            other1: {
                                description: 'Other Charge',
                                total: 25,
                                totalFormatted: '25E'
                            }
                        },
                        total: {
                            total: 25,
                            totalFormatted: '25E'
                        }
                    }
                }
            }
        };
        const result3 = component['prepareOthers'](modelWithOthers as any);
        expect(result3).not.toBeNull();
        expect(result3.items.length).toBe(1);
        expect(result3.total).toBe(25);
        expect(result3.totalFormatted).toBe('25E');
    });

    it('should process all ancillaries', () => {
        const result = component['prepareAncillaries'](mockHeaderModel as any);
        expect(result.rows.length).toBe(7);
        expect(result.totalPrice).toBe(268);
        expect(result.totalFormatted).toBe('268E');
    });

    it('should handle individual ancillary processing', () => {
        const rows: any[] = [];
        
        expect(component['processBaggageAncillary'](mockHeaderModel.headerModel.shoppingBasket.baggages, rows)).toBe(100);
        expect(rows.length).toBe(1);
        
        expect(component['processSpeqAncillary'](mockHeaderModel.headerModel.shoppingBasket.speqs, rows)).toBe(50);
        expect(rows.length).toBe(2);
        
        expect(component['processFlexibilizationAncillary'](mockHeaderModel.headerModel.shoppingBasket.flexibilization, rows)).toBe(30);
        
        expect(component['processInsuranceAncillary'](mockHeaderModel.headerModel.shoppingBasket.insuranceAllianzFusionInfo, rows)).toBe(20);
        
        expect(component['processTransfersAncillary'](mockHeaderModel.headerModel.shoppingBasket.globickTransfers, rows)).toBe(40);
        
        expect(component['processSeats'](mockHeaderModel.headerModel.shoppingBasket.seats, rows)).toBe(18);
        
        expect(component['processPriorityBoarding'](mockHeaderModel.headerModel.shoppingBasket.priorityBoarding, rows)).toBe(10);
    });

    it('should handle negative ancillary cases', () => {
        const rows: any[] = [];
        
        expect(component['processBaggageAncillary'](null, rows)).toBe(0);
        expect(component['processSpeqAncillary'](null, rows)).toBe(0);
        expect(component['processFlexibilizationAncillary']({ hasFlexibilization: false }, rows)).toBe(0);
        expect(component['processInsuranceAncillary']({ hasInsuranceAllianzFusion: false }, rows)).toBe(0);
        expect(component['processTransfersAncillary']({ hasTransfersGlobick: false }, rows)).toBe(0);
        expect(component['processSeats']({ hasSeats: false }, rows)).toBe(0);
        expect(component['processPriorityBoarding']({ hasPriorityBoarding: false }, rows)).toBe(0);
        expect(rows.length).toBe(0);
    });

    it('should handle calculateItemsInfo edge cases', () => {
        expect(component['calculateItemsInfo'](null, 'baggages')).toEqual({ quantity: 0, total: 0 });
        expect(component['calculateItemsInfo']([], 'baggages')).toEqual({ quantity: 0, total: 0 });
        
        const segments = [{ baggages: [{ quanty: null, total: undefined }] }, { baggages: [{ quanty: 2, total: 50 }] }];
        expect(component['calculateItemsInfo'](segments, 'baggages')).toEqual({ quantity: 2, total: 50 });
    });

    it('should test hasXX methods', () => {
        expect(component['hasFlexibilization']({ hasFlexibilization: true, info: { amount: { price: '30' } } })).toBe(true);
        expect(component['hasFlexibilization']({ hasFlexibilization: false })).toBe(false);
        
        expect(component['hasAllianzInsurance']({ hasInsuranceAllianzFusion: true, info: {} })).toBe(true);
        expect(component['hasAllianzInsurance']({ hasInsuranceAllianzFusion: false })).toBe(false);
        
        expect(component['hasSeats']({ hasSeats: true, segments: [{}] })).toBe(true);
        expect(component['hasSeats']({ hasSeats: true, segments: [] })).toBe(false);
        
        expect(component['hasPriorityBoarding']({ hasPriorityBoarding: true, info: {} })).toBe(true);
        expect(component['hasPriorityBoarding']({ hasPriorityBoarding: true })).toBe(false);
        
        expect(component['hasTransfers']({ hasTransfersGlobick: true, info: {} })).toBe(true);
        expect(component['hasTransfers']({ hasTransfersGlobick: false })).toBe(false);
    });

    it('should handle invalid price values', () => {
        const rows: any[] = [];
        
        const invalidFlexibilization = { hasFlexibilization: true, info: { amount: { price: 'invalid' } } };
        expect(component['processFlexibilizationAncillary'](invalidFlexibilization, rows)).toBe(0);
        
        const invalidInsurance = { hasInsuranceAllianzFusion: true, info: { amount: { price: 'invalid' } }, total: { totalFormatted: '€20' } };
        expect(component['processInsuranceAncillary'](invalidInsurance, rows)).toBe(0);
    });

    it('should initialize component with and without priceDetails', () => {
        spyOn(component as any, 'processInitialPriceDetails');
        spyOn(component as any, 'initializeHeaderSubscription');
        
        component.priceDetails = [mockOfferItem as any];
        component['initializeComponent']();
        expect(component['processInitialPriceDetails']).toHaveBeenCalled();
        
        component.priceDetails = null;
        component['initializeComponent']();
        expect(component['initializeHeaderSubscription']).toHaveBeenCalled();
    });
});
