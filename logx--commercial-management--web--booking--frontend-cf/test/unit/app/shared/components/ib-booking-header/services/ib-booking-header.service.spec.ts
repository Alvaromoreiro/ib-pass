import { TestBed } from '@angular/core/testing';
import { ShoppingBasketViewModelService } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-view-model.service';
import { IbBookingHeaderTransformerService } from '@shared/components/ib-booking-header/services/transformers/ib-booking-header-transformer.service';
import { IbBookingHeaderService } from '@shared/components/ib-booking-header/services/ib-booking-header.service';
import { BookingHeaderGreyBarTransformerService } from '@shared/components/ib-booking-header/services/transformers/ib-booking-header-grey-bar-transformer.service';
import { BookingHeaderStepsTransformerService } from '@shared/components/ib-booking-header/services/transformers/ib-booking-header-steps-transformer.service';
import { BookingHeaderGreyBarTransformerServiceMock, BookingHeaderStepsTransformerServiceMock, IbBookingHeaderTransformerServiceMock, ShoppingBasketViewModelServiceMock } from '../mocks/headerServicesMocks';
import { ShoppingBasketType } from '@src/app/core/models/ib-booking-availability/header-model';
import { customerDataMock } from 'test/unit/app/services/ib-booking-availability/call-commercial-mocks/call-commercial-mocks';
import { BookingHeaderConstants } from '@src/app/shared/components/ib-booking-header/ib-booking-header-constants';
const initHeaderHeaderModel = require( '../mocks/initHeader-headerModel.json' );
const initStepsModel = require( '../mocks/initHeader-stepsModel.json' );
const initGreyBarModel = require( '../mocks/initHeader-greyBarModel.json' );
const { discountData, originalPrice, totalDiscounts, totalPriceWithDiscounts } = require( '../mocks/updateDiscountsBasket-params.json' );

let service: IbBookingHeaderService;
let fakeIbBookingHeaderTransformerService;
let fakeBookingHeaderGreyBarTransformerService;
let fakeBookingHeaderStepsTransformerService;
let fakeShoppingBasketViewModelService;
describe('IbBookingHeaderService', () => {
    fakeIbBookingHeaderTransformerService = new IbBookingHeaderTransformerServiceMock();
    fakeBookingHeaderGreyBarTransformerService = new BookingHeaderGreyBarTransformerServiceMock();
    fakeBookingHeaderStepsTransformerService = new BookingHeaderStepsTransformerServiceMock();
    fakeShoppingBasketViewModelService = new ShoppingBasketViewModelServiceMock();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                IbBookingHeaderService,
                { provide: IbBookingHeaderTransformerService, useValue: fakeIbBookingHeaderTransformerService },
                { provide: BookingHeaderGreyBarTransformerService, useValue: fakeBookingHeaderGreyBarTransformerService },
                { provide: BookingHeaderStepsTransformerService, useValue: fakeBookingHeaderStepsTransformerService },
                { provide: ShoppingBasketViewModelService, useValue: fakeShoppingBasketViewModelService }
            ]
        });
        service = TestBed.inject(IbBookingHeaderService);
    });

    describe('Test initHeader', () => {
        it( 'should return the header model',  ( ) => {
            const header = service.initHeader( initHeaderHeaderModel, initStepsModel, initGreyBarModel );
            expect( header.headerModel.flightType ).toBe( 'availabilityFlight' );
            expect( header.greyBarModel.isLogged ).toBe( false );
            expect( header.stepsModel.currentStep ).toEqual( BookingHeaderConstants.DEFAULT_STEPS[0] );
        } );
    });
    describe('Test initHeaderModel', () => {
        it( 'should return the header model',  ( ) => {
            const headerModelInfo = service.initHeaderModel( initHeaderHeaderModel );
            expect( headerModelInfo.flightType ).toBe( 'availabilityFlight' );
        } );
    });
    describe('Test updateBasketDiscountsNew ', () => {
        it( 'should return updated basket',  ( ) => {
            const updatedBasket: ShoppingBasketType = service.updateBasketDiscountsNew( initHeaderHeaderModel, discountData, originalPrice, totalDiscounts, totalPriceWithDiscounts );
            expect( updatedBasket.discountsModel.hasDiscounts ).toBe( true );
        } );
    });
    describe('Test addDiscountToBasket ', () => {
        it( 'should return updated basket',  ( ) => {
            const updatedBasket: ShoppingBasketType = service.addDiscountToBasket( initHeaderHeaderModel, discountData );
            expect( updatedBasket.discountsModel.hasDiscounts ).toBe( true );
        } );
    });
    describe('Test deleteDiscountFromBasket ', () => {
        it( 'should return updated basket',  ( ) => {
            const updatedBasket: ShoppingBasketType = service.deleteDiscountFromBasket( initHeaderHeaderModel, 'RES' );
            expect( updatedBasket.discountsModel.hasDiscounts ).toBe( false );
        } );
    });
    describe('Test updateBasketDiscounts ', () => {
        it( 'should return updated basket',  ( ) => {
            const updatedBasket: ShoppingBasketType = service.updateBasketDiscounts( initHeaderHeaderModel, 'RES', discountData );
            expect( updatedBasket.discountsModel.hasDiscounts ).toBe( true );
        } );
    });
    describe('Test updateBasketOthers', () => {
        it( 'should call updateOtherSFee from transformer', () => {
            const feeInfo = {
                code: 'ticketingFee',
                description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
                parsedFee: '',
                totalFee: 45
            };
            service.updateBasketOthers( initHeaderHeaderModel, 'SUMMARY_OTHER_FEES_ADMINISTRATION', feeInfo );
            expect( fakeShoppingBasketViewModelService.updateOthersFee ).toHaveBeenCalled();
        } );
    });
    describe('Test updateBasketFlexibilization', () => {
        it( 'should call updateOtherSFee from view model', () => {
            service.updateBasketFlexibilization( initHeaderHeaderModel, {} );
            expect( fakeShoppingBasketViewModelService.updateFlexibilization ).toHaveBeenCalled();
        } );
    });
    describe('Test updateBasketUpgrading', () => {
        it( 'should call updateUpgrading from view model', () => {
            service.updateBasketUpgrading( initHeaderHeaderModel,
            {} );
            expect( fakeShoppingBasketViewModelService.updateUpgrading ).toHaveBeenCalled();
        } );
    });
    describe('Test updatePendingPaymentItems', () => {
        it( 'should call updatePendingPaymentItems from view model', () => {
            service.updatePendingPaymentItems( initHeaderHeaderModel, {}, {} );
            expect( fakeShoppingBasketViewModelService.updatePendingPaymentItems ).toHaveBeenCalled();
        } );
    });
    describe('Test updateBasketPriority', () => {
        it( 'should call updatePendingPaymentItems from view model', () => {
            service.updateBasketPriority( initHeaderHeaderModel, {} );
            expect( fakeShoppingBasketViewModelService.updateBasketPriority ).toHaveBeenCalled();
        } );
    });
    describe('Test updateLoggedData', () => {
        it( 'should return user data', () => {
            const customerData = { ...customerDataMock }
            const userData = service.updateLoggedData( customerData );
            expect( userData.surname ).toEqual( 'Pfeffer' );
        } );
    });
    describe('Test dataUserLogin', () => {
        it( 'should return user data', () => {
            const customer = { ...customerDataMock };
            const userData = service.dataUserLogin( customer );
            expect( userData.surname ).toEqual( 'Pfeffer' );
        } );
        it( 'should return user data with email instead name', () => {
            const customerD = { ...customerDataMock };
            customerD.personalInfo.name = null;
            customerD.generalInfo.avios = null;
            const userData = service.dataUserLogin( customerD );
            expect( userData.surname ).toEqual( 'Pfeffer' );
        } );
    });
    describe('Test deleteAssistCardFromBasket ', () => {
        it( 'should delegate assist card deletion to transformer',  ( ) => {
            service.deleteAssistCardFromBasket( initHeaderHeaderModel );
            expect( fakeIbBookingHeaderTransformerService.deleteAssistCardFromBasket ).toHaveBeenCalledWith( initHeaderHeaderModel );
        } );
    });
    afterEach( () => {
        TestBed.resetTestingModule();
    } );
} );
