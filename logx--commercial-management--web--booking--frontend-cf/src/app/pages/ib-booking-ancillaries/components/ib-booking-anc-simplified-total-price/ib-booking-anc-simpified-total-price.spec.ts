import angular from 'angular';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';

class BookingModalServiceMock {
    showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => Promise.resolve());
}
class IbNewModalAncillariesServiceMock {
    // eslint-disable-next-line @typescript-eslint/ban-types
    public resolve: Function = () => {};
    // eslint-disable-next-line @typescript-eslint/ban-types
    public reject: Function = () => {};

    openPetcFlowWarningModal = jasmine.createSpy('openPetcFlowWarningModal').and.callFake(() => ({
        result: new Promise((resolve, reject) => { 
            this.resolve = resolve; 
            this.reject = reject; 
        }),
        componentInstance: {}
    }));
    openAncillariesModal = jasmine.createSpy('openAncillariesModal');
}

const fakeFilter = () => {
    return (k:string) => k;
};
class CommonsUserUtilsServiceMock {
    isIbPlusResponse = false;
    isSoftUserResponse = false;
    isIbZero = jasmine.createSpy('isIbZero').and.callFake(() => true);
    isIbPlus = jasmine.createSpy('isIbPlus').and.callFake(() => this.isIbPlusResponse);
    isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(() => this.isSoftUserResponse);
}
const fakeElement = angular.element('<div>');

class ibSubscriptionPermissionServiceMock {
    reqMarketingPermission = jasmine.createSpy('reqMarketingPermission');
}

class ibBookingPriceDetailModalServiceMock {
    checkShouldShowCTA = jasmine.createSpy('checkShouldShowCTA');
}

class BookingUtilServiceMock {
    getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.returnValue(null);
}

class IbBookingTotalPriceRedemptionServiceMock {
    getRedemptionTotalPriceModel = jasmine.createSpy('getRedemptionTotalPriceModel');
}


let fakeScope;
let fakeRootScope;
let fakeBookingModalService;
let fakeCommonsUserUtilsService: CommonsUserUtilsServiceMock;
let fakeIbSubscriptionPermissionService: ibSubscriptionPermissionServiceMock;
let fakeLocalStorageService: StorageServiceMock;
let fakeIbBookingPriceDetailModalService: ibBookingPriceDetailModalServiceMock;
let fakeBookingUtilsService: BookingUtilServiceMock;
let fakeIbNewModalAncillariesService: IbNewModalAncillariesServiceMock;
let fakeIbBookingTotalPriceRedemptionService: IbBookingTotalPriceRedemptionServiceMock;

let controller;

describe('Test simplifiedTotalPrice', () => {
    fakeBookingModalService = new BookingModalServiceMock();
    fakeLocalStorageService = new StorageServiceMock();
    fakeCommonsUserUtilsService = new CommonsUserUtilsServiceMock();
    fakeIbSubscriptionPermissionService = new ibSubscriptionPermissionServiceMock();
    fakeIbBookingPriceDetailModalService = new ibBookingPriceDetailModalServiceMock();
    fakeBookingUtilsService = new BookingUtilServiceMock();
    fakeIbNewModalAncillariesService = new IbNewModalAncillariesServiceMock(); 
    fakeIbBookingTotalPriceRedemptionService = new IbBookingTotalPriceRedemptionServiceMock();

    
    beforeEach(()=> {
        angular.mock.module('ib-booking-anc-simplified-total-price-module', ($provide: any) => {
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('$filter', fakeFilter);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('$element', fakeElement);
            $provide.value('BookingAppConstants', BookingAppConstants);
            $provide.value('ibSubscriptionPermissionService', fakeIbSubscriptionPermissionService);
            $provide.value('IbBookingPriceDetailModalService', fakeIbBookingPriceDetailModalService);
            $provide.value('IbNewModalAncillariesService', fakeIbNewModalAncillariesService);
            $provide.value('BookingUtilService', fakeBookingUtilsService);
            $provide.value('BookingTotalPriceRedemptionService', fakeIbBookingTotalPriceRedemptionService);
        });
        inject(function ($componentController, $rootScope) {
            fakeScope = $rootScope.$new();
            fakeRootScope = fakeScope;

            controller = $componentController('ibBookingAncSimplifiedTotalPrice',
                { $scope: fakeScope, $rootScope: fakeRootScope });
            fakeScope.$apply();
        });
    });

    describe('Test init component', () => {
        beforeEach(() => {
            fakeIbNewModalAncillariesService.openPetcFlowWarningModal.and.callFake(() => ({
                result: new Promise((resolve) => {
                    fakeIbNewModalAncillariesService.resolve = resolve; // Asignación directa al objeto mock
                }),
                componentInstance: {}
            }));
        });

        it('must be initialized', () => {
            controller.$onInit();
        });

    });

    describe('continueToPayment and Pet Flow Logic', () => {
        const MOCK_HEADER_CUBA = {
            headerModel: {
                trips: [{ destinyCode: 'HAV', originCode: 'MAD' }], 
                shoppingBasket: {
                    insurance: { hasInsurance: false, info: { offer: 'COM001' } },
                    petc: { hasPetc: false }
                }
            }
        };

        const MOCK_HEADER_PAYMENT_PATH = {
            headerModel: {
                trips: [{ destinyCode: 'BCN', originCode: 'MAD' }], 
                shoppingBasket: { 
                    insurance: { hasInsurance: false, info: { offer: 'COM001' } },
                    petc: { hasPetc: false }
                }
            }
        };
        
        beforeEach(() => {
            fakeIbNewModalAncillariesService.openAncillariesModal.calls.reset();
            fakeIbNewModalAncillariesService.openPetcFlowWarningModal.calls.reset();
            fakeIbNewModalAncillariesService.openPetcFlowWarningModal.and.callFake(() => ({
                result: new Promise((resolve) => {
                    fakeIbNewModalAncillariesService.resolve = resolve; // Asignación directa al objeto mock
                }),
                componentInstance: {}
            }));
            
            fakeLocalStorageService.set('headerModel', MOCK_HEADER_PAYMENT_PATH);
            fakeLocalStorageService.set('ancillariesInfo', { ancillaries: [{ type: 'PET', status: { code: 'AVAILABLE' } }] });
            
            spyOn(controller, 'processPaymentValidationChain').and.callThrough();
            spyOn(controller, 'openInsuranceModal').and.callThrough();
            spyOn(controller.$scope, '$emit'); 
            spyOn(controller, '_isPetFlightFilterSelected').and.callThrough(); // Espiamos el helper
        });

        it('should open PetcFlowWarningModal when pet filter is selected and pet is available', () => {
            fakeBookingUtilsService.getURLFirstParameterByName.withArgs(BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT).and.returnValue('true'); 

            controller.continueToPayment();
            
            expect(controller._isPetFlightFilterSelected).toHaveBeenCalledTimes(1);
            expect(fakeIbNewModalAncillariesService.openPetcFlowWarningModal).toHaveBeenCalledTimes(1);
            expect(controller.processPaymentValidationChain).not.toHaveBeenCalled();
        });

        it('should call processPaymentValidationChain directly if NOT required by pet filter', () => {
            fakeBookingUtilsService.getURLFirstParameterByName.withArgs(BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT).and.returnValue(null);

            controller.continueToPayment();
            
            expect(controller._isPetFlightFilterSelected).toHaveBeenCalledTimes(1);
            expect(controller.processPaymentValidationChain).toHaveBeenCalled();
        });

        xit('should open ancillaries modal and NOT call payment chain if warning modal returns ADD_PET', async () => {
            controller.continueToPayment(); 
            
            await fakeIbNewModalAncillariesService.resolve({ type: 'ADD_PET', ancillaryType: 'PET' }); 
            
            await fakeScope.$apply(); 
            
            expect(fakeIbNewModalAncillariesService.openAncillariesModal).toHaveBeenCalledWith('PET');
            expect(controller.processPaymentValidationChain).not.toHaveBeenCalled(); 
        });

        it('should call payment validation chain if warning modal returns CONTINUE_TO_PAYMENT', async () => {
            controller.continueToPayment(); 
            
            await fakeIbNewModalAncillariesService.resolve({ type: 'CONTINUE_TO_PAYMENT' }); 
            
            await fakeScope.$apply(); 
            
            expect(controller.processPaymentValidationChain).toHaveBeenCalled(); 
            expect(fakeIbNewModalAncillariesService.openAncillariesModal).not.toHaveBeenCalled();
        });

        it('should emit goToPayments if destination is NOT Cuba (HAV)', () => {
            controller.processPaymentValidationChain(MOCK_HEADER_PAYMENT_PATH.headerModel);

            expect(controller.$scope.$emit).toHaveBeenCalledWith('goToPayments');
            expect(controller.openInsuranceModal).not.toHaveBeenCalled();
        });

        it('should open Cuba Insurance Modal if destination IS Cuba (HAV) and NO insurance is present', () => {
            const header = MOCK_HEADER_CUBA.headerModel;
            header.shoppingBasket.insurance.hasInsurance = false;

            controller.processPaymentValidationChain(header);
            
            expect(controller.openInsuranceModal).toHaveBeenCalledTimes(1);
            expect(controller.$scope.$emit).not.toHaveBeenCalledWith('goToPayments');
        });

        it('should emit goToPayments if destination IS Cuba (HAV) and correct insurance (COM025) is present', () => {
            // Arrange: Destino Cuba (HAV), seguro presente y OFERTA CORRECTA
            const header = MOCK_HEADER_CUBA.headerModel;
            header.shoppingBasket.insurance.hasInsurance = true;
            header.shoppingBasket.insurance.info.offer = 'COM025';

            controller.processPaymentValidationChain(header);
            
            expect(controller.$scope.$emit).toHaveBeenCalledWith('goToPayments');
            expect(controller.openInsuranceModal).not.toHaveBeenCalled();
        });
    });


});
