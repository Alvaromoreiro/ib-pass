import { TestBed } from "@angular/core/testing";
import { ShoppingBasketType } from "@src/app/core/models/ib-booking-availability/header-model";
import { IbBasketSectionTransformerService } from "@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-section-transformer.service";
import { ShoppingBasketViewModelService } from "@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-view-model.service";
import { OthersFeesViewModelService } from "@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-other-fees-view-model.service";
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService } from "ib-web-commons/utils";
import { RootScopeMock } from "test/mocks/class/RootScopeMock";
import { CurrencyServiceMock } from "test/mocks/Services/CurrencyServiceMocks";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";

class OthersFeesViewModelServiceMock {
    getOthersViewModel = jasmine.createSpy('getOthersViewModel').and.returnValue({ hasElements: false, others: [] });
    deleteInfo = jasmine.createSpy('deleteInfo');
    getOtherInfo = jasmine.createSpy('getOtherInfo').and.returnValue({ total: 0 });
    updateInfo = jasmine.createSpy('updateInfo');
}

class IbBasketSectionTransformerServiceMock {
    setInfoAncillarie = jasmine.createSpy('setInfoAncillarie').and.returnValue({});
    setPriorityInfoAncillarie = jasmine.createSpy('setPriorityInfoAncillarie').and.returnValue({});
}

// @ts-ignore
interface TestService extends ShoppingBasketViewModelService {
    CurrencyService: CurrencyServiceMock;
    rootScope: RootScopeMock;
    CommonsSessionStorageService: StorageServiceMock;
    OthersFeesViewModelService: OthersFeesViewModelServiceMock;
    IbBasketSectionTransformerService: IbBasketSectionTransformerServiceMock;    
}

const getBaseModel = (): ShoppingBasketType => ({
    total: { original: 0, formatted: '' },
    currency: { code: 'EUR' },
    trips: { total: { original: 100 }, ticketingFee: 0 },
    baggages: { hasBaggage: false, total: { total: 0 } },
    bundle: { hasBundle: false, total: { total: 0 } },
    seats: { hasSeats: false, total: { total: 0 } },
    insurance: { hasInsurance: false, total: { total: 0 } },
    upgrading: { hasUpgrading: false, total: 0 },
    speqs: { hasSpeqs: false, total: { total: 0 } },
    flexibilization: { hasFlexibilization: false, info: { amount: { price: 0 } } },
    priorityBoarding: { hasPriorityBoarding: false, info: { amount: 0 } },
    carbonFootprint: { hasCarbonFootprint: false, total: { total: 0 } },
    globickTransfers: { hasTransfersGlobick: false, total: { total: 0 } },
    insuranceAllianzFusionInfo: { hasInsuranceAllianzFusion: false, total: { total: 0 } },
    petc: { hasPetc: false, total: { total: 0 } },
    othersModel: { hasElements: false, total: { total: 0 } },
    discountsModel: { hasDiscounts: false, total: 0 }
} as ShoppingBasketType);

describe('Test ShoppingBasketViewModelService', () => {
    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ShoppingBasketViewModelService,
                { provide: AJSCurrencyService, useClass: CurrencyServiceMock },
                { provide: AJSRootScope, useClass: RootScopeMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: OthersFeesViewModelService, useClass: OthersFeesViewModelServiceMock },
                { provide: IbBasketSectionTransformerService, useClass: IbBasketSectionTransformerServiceMock },
            ]
        });
        service = TestBed.inject<unknown>(ShoppingBasketViewModelService) as TestService;

        spyOn(service.CommonsSessionStorageService, 'get').and.callThrough();
        spyOn(service.CommonsSessionStorageService, 'set').and.callThrough();

        (service.CurrencyService.formatPrice as jasmine.Spy).calls.reset();
        (service.rootScope.$broadcast as jasmine.Spy).calls.reset();
        
        spyOn(service as any, 'preventMultipleDecimals').and.callFake(value => value);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('updateOthersFee', () => {
        let headerModel: any;
        let type: string | null;
        let fee: any;

        beforeEach(() => {
            headerModel = {
                shoppingBasket: {
                    othersModel: {
                        hasElements: false,
                        others: [],
                    },
                    currency: 'USD',
                },
            };
            service.calculateAllBasket = jasmine.createSpy('calculateAllBasket');
        });

        it('when fee argument is provided', () => {
            type = 'testType';
            fee = { total: 100 };

            service.updateOthersFee(headerModel, type, fee);

            expect(headerModel.shoppingBasket.othersModel.hasElements).toBe(true);
            expect(service.calculateAllBasket).toHaveBeenCalled();
        });

        it('when fee argument is not provided', () => {
            type = 'testType';
            fee = null;

            service.updateOthersFee(headerModel, type, fee);

            expect(headerModel.shoppingBasket.othersModel.hasElements).toBe(false);
            expect(service.calculateAllBasket).toHaveBeenCalled();
        });

        it('when fee and type are not provided', () => {
            const { OthersFeesViewModelService } = service;
            type = null;
            fee = null;

            service.updateOthersFee(headerModel, type, fee);

            expect(OthersFeesViewModelService.getOthersViewModel).toHaveBeenCalled();
        });
    });

    describe('updateFlexibilization', () => {
        let headerModel: any;
        let flexInfo: any;

        beforeEach(() => {
            headerModel = { shoppingBasket: {} };
            flexInfo = { test: 'test' };
            service.calculateAllBasket = jasmine.createSpy('calculateAllBasket');
        });

        it('should update the flexibilization in the header model', () => {
            const { IbBasketSectionTransformerService } = service;

            service.updateFlexibilization(headerModel, flexInfo);

            expect(IbBasketSectionTransformerService.setInfoAncillarie).toHaveBeenCalled();
            expect(service.calculateAllBasket).toHaveBeenCalledWith(headerModel.shoppingBasket);
        });
    });

    describe('updateBasketPriority', () => {
        let headerModel: any;
        let flexInfo: any;

        beforeEach(() => {
            headerModel = { shoppingBasket: {} };
            flexInfo = { test: 'test' };
            service.calculateAllBasket = jasmine.createSpy('calculateAllBasket');
        });

        it('should update basket priority in the header model', () => {
            const { IbBasketSectionTransformerService } = service;

            IbBasketSectionTransformerService.setInfoAncillarie = jasmine.createSpy('setInfoAncillarie').and.returnValue(flexInfo);

            service.updateBasketPriority(headerModel, flexInfo);

            expect(IbBasketSectionTransformerService.setPriorityInfoAncillarie).toHaveBeenCalled();
            expect(service.calculateAllBasket).toHaveBeenCalledWith(headerModel.shoppingBasket);
        });
    });

    describe('updateUpgrading', () => {
        let headerModel: any;
        let upgrading: any;

        beforeEach(() => {
            headerModel = { shoppingBasket: {} };
            upgrading = { test: 'test' };
            service.calculateAllBasket = jasmine.createSpy('calculateAllBasket');
        });

        it('should update the upgrading in the header model', () => {
            service.updateUpgrading(headerModel, upgrading);

            expect(headerModel.shoppingBasket.upgrading).toEqual(upgrading);
            expect(service.calculateAllBasket).toHaveBeenCalledWith(headerModel.shoppingBasket);
        });
    });

    describe('updatePendingPaymentItems', () => {
        let headerModel: any;
        let seats: any[];
        let upgrading: any;

        beforeEach(() => {
            headerModel = { shoppingBasket: { seats: { segments: [] }, upgrading:{} } };
            seats = [{ seat: '1A' }, { seat: '2B' }];
            upgrading = { test: 'test' };
            service.calculateAllBasket = jasmine.createSpy('calculateAllBasket');
        });

        it('should update the pending payment items in the header model', () => {
            service.updatePendingPaymentItems(headerModel, seats, upgrading);

            expect(headerModel.shoppingBasket.seats.segments.length).toEqual(2);
            expect(service.calculateAllBasket).toHaveBeenCalledWith(headerModel.shoppingBasket);
        });
        it('should not update the pending payment items if seats array is empty', () => {
            seats = [];

            service.updatePendingPaymentItems(headerModel, seats, upgrading);

            expect(headerModel.shoppingBasket.seats.segments.length).toEqual(0);
            expect(service.calculateAllBasket).toHaveBeenCalledWith(headerModel.shoppingBasket);
        });
        it('should update the pending payment items if upgradingTrips has elements', () => {
            upgrading = { upgradingTrips: [{ trip: 'Trip1' }, { trip: 'Trip2' }] };

            service.updatePendingPaymentItems(headerModel, seats, upgrading);

            expect(headerModel.shoppingBasket.seats.segments.length).toEqual(2);
            expect(service.calculateAllBasket).toHaveBeenCalledWith(headerModel.shoppingBasket);
        });

    });

    describe('Test calculateAllBasket', () => {
         let baseModel;
         beforeEach(() => {
            const {CommonsSessionStorageService} = service;
            (CommonsSessionStorageService.set as jasmine.Spy)('actualStepFlow', 'ibpurc');
            baseModel = {
                trips: { ticketingFee: 0, total: { original: 1 } },
                baggages: { hasBaggage: true, total: { total: 2 } },
                bundle: { hasBundle: true, total: { total: 3 } },
                seats: { hasSeats: true, total: { total: 4 } },
                upgrading: { hasUpgrading: true, total:  5 },
                flexibilization: { hasFlexibilization: true, info: { amount: { price: 6 } } },
                priorityBoarding: { hasPriorityBoarding: true, info: { amount: 7 } },
                carbonFootprint: { hasCarbonFootprint: true, total: { total: 8 } },
                insurance: { hasInsurance: true, total: { total: 9 } },
                speqs: { hasSpeqs: true, total: { total: 10 } },
                globickTransfers: { hasTransfersGlobick: true, total: { total: 11 } },
                insuranceAllianzFusionInfo: { hasInsuranceAllianzFusion: true, total: { total: 12 } },
                petc: { hasPetc: true, total: { total: 13 } },
                discountsModel: { hasDiscounts: true, total: 14  },
                othersModel: { hasElements: true, total: { total: 15 } },
                currency: 'EUR',
                total: { original: 0 },
            };
            
            (service.CurrencyService.formatPrice as jasmine.Spy).withArgs('EUR', 92, true).and.returnValue('€92.00');
         });

         it('should calculate the total price of all ancillaries', () => { 
            const { CurrencyService } = service;
            service.calculateAllBasket(baseModel);
            const total = 92;
            expect(baseModel.total.original).toEqual(total); 
            expect(baseModel.total.formatted).toEqual(CurrencyService.formatPrice('EUR', total, true));
          });
    });

    describe('_calculateBasketGrandTotal (private)', () => {
        let model: ShoppingBasketType;

        beforeEach(() => {
            model = getBaseModel();
            (service.CommonsSessionStorageService.get as jasmine.Spy).withArgs('actualStepFlow').and.returnValue('someOtherPage');
        });

        it('should start with the base total from trips', () => {
            const total = (service as any)._calculateBasketGrandTotal(model);
            expect(total).toBe(100);
        });

        it('should use the base total for "ibpurc" page (lógica de página especial)', () => {
            (service.CommonsSessionStorageService.get as jasmine.Spy).withArgs('actualStepFlow').and.returnValue('ibpurc');
            model.trips.total.original = 100;
            const total = (service as any)._calculateBasketGrandTotal(model);
            expect(total).toBe(100);
        });

        it('should correctly sum all standard line items', () => {
            model.baggages.hasBaggage = true;
            model.baggages.total.total = 10;
            model.seats.hasSeats = true;
            model.seats.total.total = 20;
            const total = (service as any)._calculateBasketGrandTotal(model);
            expect(total).toBe(130);
        });

        it('should ignore line items where the "check" flag is false', () => {
            model.baggages.hasBaggage = true;
            model.baggages.total.total = 10;
            model.seats.hasSeats = false;
            model.seats.total.total = 20;
            const total = (service as any)._calculateBasketGrandTotal(model);
            expect(total).toBe(110);
        });

        it('should correctly sum items with different value paths (e.g., upgrading, flex)', () => {
            model.upgrading.hasUpgrading = true;
            model.upgrading.total = 30;
            model.flexibilization.hasFlexibilization = true;
            model.flexibilization.info.amount.price = 40;
            const total = (service as any)._calculateBasketGrandTotal(model);
            expect(total).toBe(170);
        });

        it('should correctly apply special rule for "othersModel"', () => {
            model.othersModel.hasElements = true;
            model.trips.ticketingFee = 0;
            model.othersModel.total.total = 5;
            const total = (service as any)._calculateBasketGrandTotal(model);
            expect(total).toBe(105);
        });

        it('should IGNORE "othersModel" if ticketingFee is true (non-zero)', () => {
            model.othersModel.hasElements = true;
            model.trips.ticketingFee = 1;
            model.othersModel.total.total = 5;
            const total = (service as any)._calculateBasketGrandTotal(model);
            expect(total).toBe(100);
        });

        it('should correctly subtract discounts', () => {
            model.discountsModel.hasDiscounts = true;
            model.discountsModel.total = 15;
            const total = (service as any)._calculateBasketGrandTotal(model);
            expect(total).toBe(85);
        });

        it('should call preventMultipleDecimals at the end', () => {
            (service as any)._calculateBasketGrandTotal(model);
            expect((service as any).preventMultipleDecimals).toHaveBeenCalled();
        });
    });

    describe('_broadcastBasketUpdates (private)', () => {
        let model: ShoppingBasketType;
        const calculatedTotal = 123.45;

        beforeEach(() => {
            model = getBaseModel();
            (service.CurrencyService as CurrencyServiceMock).formatPrice.withArgs(model.currency, calculatedTotal, true).and.returnValue('€123,45');        
        });

        it('should update the model with the new total and formatted price', () => {
            (service as any)._broadcastBasketUpdates(model, calculatedTotal);
            expect(model.total.original).toBe(calculatedTotal);
            expect(model.total.formatted).toBe('€123,45');
        });

        it('should call CurrencyService.formatPrice with the correct arguments', () => {
            (service as any)._broadcastBasketUpdates(model, calculatedTotal);
            expect(service.CurrencyService.formatPrice).toHaveBeenCalledWith(model.currency, calculatedTotal, true);
        });

        it('should broadcast the "totalBasket" event with the formatted price', () => {
            (service as any)._broadcastBasketUpdates(model, calculatedTotal);
            expect(service.rootScope.$broadcast).toHaveBeenCalledWith('totalBasket', '€123,45');
        });

        it('should broadcast the "updateHeaderBasket" event with the full model', () => {
            (service as any)._broadcastBasketUpdates(model, calculatedTotal);
            expect(service.rootScope.$broadcast).toHaveBeenCalledWith('updateHeaderBasket', model);
        });
    });
 
});
