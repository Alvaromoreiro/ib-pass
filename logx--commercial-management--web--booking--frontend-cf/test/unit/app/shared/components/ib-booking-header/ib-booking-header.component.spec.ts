import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { ShoppingBasketDiscountObjectType, ShoppingBasketDiscountsModel } from '@src/app/core/models/ib-booking-availability/header-model';
import { IbBasketTransformerService } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/services/ib-booking-header-basket-transformer.service';
import { ShoppingBasketViewModelService } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-basket-view-model.service';
import { BookingHeaderConstants } from '@shared/components/ib-booking-header/ib-booking-header-constants';
import { IbBookingHeaderComponent } from '@shared/components/ib-booking-header/ib-booking-header.component';
import { IbBookingHeaderService } from '@shared/components/ib-booking-header/services/ib-booking-header.service';
import { IbBookingFlowUtilsService } from '@shared/services/ib-utils/ib-booking-flow-utils.service';
import { AJSBookingModalService } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { CurrencyServiceMock } from 'test/mocks/Services/CurrencyServiceMocks';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { customerDataMock } from 'test/unit/app/services/ib-booking-availability/call-commercial-mocks/call-commercial-mocks';
import { CommonsModalServiceMock, CommonsUserUtilsServiceMock } from 'test/unit/app/services/ib-booking-availability/ib-booking-availability-service-test-mocks';
import { lastValueFrom } from 'rxjs';
import { Discount } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

const fullHeaderModel = require( 'test/unit/app/shared/components/ib-booking-header/mocks/HeaderModelRT.json' );
const { headerModel, greyBarModel, stepsModel } = fullHeaderModel;
const { initialHeader, initialStepsModel, initialGreyBarModel } = require( 'test/unit/app/shared/components/ib-booking-header/mocks/InitialModelsHeader-mock.json' );
const StepsModelMock = require( 'test/unit/app/shared/components/ib-booking-header/mocks/StepsModel.json' );
let customerPartnersMock = require( 'test/unit/app/shared/components/ib-booking-header/mocks/PartnersCustomerData-mock.json' );
class FakeRootScopeMock {
    public isMobile = {
        general: false,
        header: false
    };
    public $on = jasmine.createSpy( '$on' );
    public $broadcast = jasmine.createSpy( '$broadcast' );
    public customerData = customerDataMock;
}
export class FakeWindowMock {
    constructor () {}
    innerWidth = 1024;
}
export class FakeHeaderFacadeMock {
    public setAPIFunctions = jasmine.createSpy( 'setAPIFunctions' );
}
export class FakeIbBasketTransformerServiceMock {
    public transformedTrips = {
        total: {
            formatted: "143,16€",
            original: 143.16,
            totalPrice: 143.16
        },
        ticketingFee: 5,
        ticketingFeeFormatted: '5'
    };
    public transformTripsCartFromDispo = jasmine.createSpy( 'transformTripsCartFromDispo' ).and.callFake( () => this.transformedTrips );
    public deleteTripsCartFromDispo = jasmine.createSpy( 'deleteTripsCartFromDispo' ).and.callFake( () => { return { total: 5 }; } );
    public transformTripsCart = jasmine.createSpy( 'transformTripsCart' ).and.callFake( () => { return { total: 5 }; } );
    public transformTripsFromOrder = jasmine.createSpy( 'transformTripsFromOrder' ).and.callFake( () => { return { total: 5 }; } );
}
export class FakeIbBookingHeaderServiceMock {
    public initHeader = jasmine.createSpy( 'initHeader' ).and.callFake( () => {
        return { headerModel, greyBarModel, stepsModel };
    } );
    public initHeaderModel = jasmine.createSpy( 'initHeaderModel' ).and.callFake( () => headerModel );
    public updateLoggedData = jasmine.createSpy( 'updateLoggedData' ).and.callFake( () => customerDataMock );
    public calculateAllBasket = jasmine.createSpy( 'calculateAllBasket' );
    public updateBasketDiscounts = jasmine.createSpy( 'updateBasketDiscounts' ).and.callFake( () => { return {} });
    public updateBasketDiscountsNew = jasmine.createSpy( 'updateBasketDiscountsNew' ).and.callFake( () => { return {} });
    public deleteDiscountFromBasket = jasmine.createSpy( 'deleteDiscountFromBasket' ).and.callFake( () => { return {} });
    public addDiscountToBasket = jasmine.createSpy( 'addDiscountToBasket' ).and.callFake( () => { return {} });
    public updateBasketOthers = jasmine.createSpy( 'updateBasketOthers' ).and.callFake( () => { return {} });
    public updateBasketFlexibilization = jasmine.createSpy( 'updateBasketFlexibilization' ).and.callFake( () => { return {} });
    public updateBasketUpgrading = jasmine.createSpy( 'updateBasketUpgrading' ).and.callFake( () => { return {} });
    public updatePendingPaymentItems = jasmine.createSpy( 'updatePendingPaymentItems' ).and.callFake( () => { return {} });
    public updateBasketPriority = jasmine.createSpy( 'updateBasketPriority' ).and.callFake( () => { return {} });
    public dataUserLogin = jasmine.createSpy( 'dataUserLogin' );
    public addSimpleDiscount = jasmine.createSpy( 'addSimpleDiscount' ).and.callFake( () => { return {}; } );
}
export class FakeShoppingBasketViewModelServiceMock {
    calculateAllBasket = jasmine.createSpy( 'calculateAllBasket' );
}
export class FakeIbBookingFlowUtilsServiceMock {
    checkAdaptativeMobileView = jasmine.createSpy( 'checkAdaptativeMobileView' ).and.callFake( () => true );
}
const fakeLoggedData = {
    name: '',
    surname: '',
    points: '',
    isLogged: true
};
let fakeRootScope;
let fakeWindow;
let fakeCurrency;
let fakeHeaderFacade;
let fakeCommonsSessionStorageService;
let fakeCommonsUserUtilsService;
let fakeIbBasketTransformerService;
let fakeIbBookingHeaderService;
let fakeBookingModalService;
let fakeShoppingBasketViewModelService;
let initialHeaderModel;
let fakeIbBookingFlowUtilsService;
describe('IbBookingHeaderComponent', () => {
    let component: IbBookingHeaderComponent;
    let fixture: ComponentFixture<IbBookingHeaderComponent>;
    fakeRootScope = new FakeRootScopeMock();
    fakeWindow = new FakeWindowMock();
    fakeCurrency = new CurrencyServiceMock();
    fakeHeaderFacade = new FakeHeaderFacadeMock();
    fakeCommonsSessionStorageService = new StorageServiceMock();
    fakeCommonsUserUtilsService = new CommonsUserUtilsServiceMock();
    fakeIbBasketTransformerService = new FakeIbBasketTransformerServiceMock();
    fakeIbBookingHeaderService = new FakeIbBookingHeaderServiceMock();
    fakeBookingModalService = new CommonsModalServiceMock();
    fakeShoppingBasketViewModelService = new FakeShoppingBasketViewModelServiceMock();
    fakeIbBookingFlowUtilsService = new FakeIbBookingFlowUtilsServiceMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbBookingHeaderComponent
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope},
                { provide: WINDOW_TOKEN, useValue: fakeWindow},
                { provide: AJSCurrencyService, useValue: fakeCurrency},
                { provide: IbBookingHeaderFacadeService, useValue: fakeHeaderFacade},
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
                { provide: IbCUserUtilsService, useValue: fakeCommonsUserUtilsService},
                { provide: IbBasketTransformerService, useValue: fakeIbBasketTransformerService},
                { provide: IbBookingHeaderService, useValue: fakeIbBookingHeaderService},
                { provide: ShoppingBasketViewModelService, useValue: fakeShoppingBasketViewModelService},
                { provide: AJSBookingModalService, useValue: fakeBookingModalService},
                { provide: IbBookingFlowUtilsService, useValue: fakeIbBookingFlowUtilsService}
            ]
        }).compileComponents();
        initialHeaderModel = initialHeader;
        fixture = TestBed.createComponent(IbBookingHeaderComponent);
        component = fixture.componentInstance;
        fakeCommonsSessionStorageService.set( 'headerModel', { headerModel, greyBarModel, stepsModel } );
        fakeCommonsSessionStorageService.set( 'customerData', customerDataMock );
        fixture.detectChanges();
    });

    it('should create', () => {
        expect( component ).toBeTruthy();
    } );
    describe( 'When initializeHeader is called', () => {
        it( 'should check date has changes and pass throughs', () => {
            fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy( 'isSoftUser' ).and.callFake( () => true );
            fakeIbBookingHeaderService.updateLoggedData = jasmine.createSpy( 'updateLoggedData' ).and.callFake( () => fakeLoggedData );
            const modifiedDate = { ...initialHeaderModel };
            modifiedDate.originDestination.dates.outboundFlight = '2024-02-10';
            modifiedDate.originDestination.dates.returnFlight = '2024-02-22';
            component.initializeHeader( modifiedDate, initialStepsModel, initialGreyBarModel );
            fixture.detectChanges();
            expect( fakeCommonsUserUtilsService.isSoftUser ).toHaveBeenCalled();
            expect( component.model.headerModel.flightType ).toBe( BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY );
            expect( component.model.greyBarModel.isLogged ).toBe( true );
            expect( component.model.stepsModel.steps.length ).toBe( 5 );
            expect( fakeIbBookingFlowUtilsService.checkAdaptativeMobileView ).toHaveBeenCalled();
            expect( component.showHeaderMobile ).toBe( true );
        } );
        it( 'window width less than 768 number trips should be small', () => {
            fakeWindow.innerWidth = 600;
            component.onResize();
            fixture.detectChanges();
            expect( component.numberTrips ).toEqual( BookingHeaderConstants.TRIPS_NUMBER.SMALL );
        } );
        it( 'window width equal to 1280 number trips should be small', () => {
            fakeWindow.innerWidth = 1280;
            component.onResize();
            fixture.detectChanges();
            expect( component.numberTrips ).toEqual( BookingHeaderConstants.TRIPS_NUMBER.LARGE );
        } );
    } );
    describe( 'When initHeaderModel is called', () => {
        it( 'should check if shoppingBasket and set show as true', () => {
            component.initHeaderModel( initialHeaderModel );
            fixture.detectChanges();
            expect( component.model.headerModel.shoppingBasket.showBasket ).toBe( true );
        } );
        it( 'should set shoppingBasket if not defined and set show as true', () => {
            const noShoppingBasket = { ...headerModel };
            noShoppingBasket.shoppingBasket = null;
            const thisInitialModel = {
                headerModel: noShoppingBasket,
                stepsModel: stepsModel,
                greyBarModel: greyBarModel
            }
            fakeCommonsSessionStorageService.set( 'headerModel', thisInitialModel );
            component.initHeaderModel( initialHeaderModel );
            fixture.detectChanges();
            expect( component.model.headerModel.shoppingBasket.showBasket ).toBe( true );
        } );
    } );
    describe( 'When updateShowBasket is called', () => {
        it( 'should set showBasket property on headerModel and shoppingBasket and saveHeaderModel', () => {
            spyOn( component, 'saveHeaderModel' );
            component.model.headerModel.shoppingBasket.showBasket = false;
            component.model.headerModel.showBasket = false;
            component.updateShowBasket( true );
            fixture.detectChanges();
            expect( component.model.headerModel.shoppingBasket.showBasket ).toBe( true );
            expect( component.model.headerModel.showBasket ).toBe( true );
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateHeaderModel is called', () => {
        it( 'should update and saveHeaderModel', () => {
            spyOn( component, 'saveHeaderModel' );
            component.updateHeaderModel( fullHeaderModel );
            fixture.detectChanges();
            expect( component.model ).toEqual( fullHeaderModel );
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateHeaderModelOnHold is called', () => {
        it( 'should return header model', () => {
            component.updateHeaderModelOnHold( initialHeaderModel );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.initHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When setLogin is called', () => {
        const action = () => { };
        const setSuite = (data = null) => {
            spyOn( component, 'saveHeaderModel' );
            component.setLogin( action, action, action, data ?? null );
            fixture.detectChanges();
            return;
        }

        const checkExpectationsArray = () => {
            expect( component.model.greyBarModel.login.onLogin ).toEqual( action );
            expect( component.model.greyBarModel.login.afterLogin ).toEqual( action );
            expect( component.model.greyBarModel.login.onError ).toEqual( action );
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        }

        it( 'should set greyBarModel login property and loggedData', () => {
            setSuite(customerDataMock);
            checkExpectationsArray();
        } );
        it( 'with no logged data should set greyBarModel login property and recover loggedData from greyBarModel', () => {
            setSuite();
            checkExpectationsArray();
        } );
    } );
    
    describe( 'When updateTripsBasketFromDispo is called', () => {
        it( 'testDescription', () => {
            spyOn( component, 'saveHeaderModel' );
            const fakeOfferSelected = { price: { total: 10 } };
            component.model.headerModel.shoppingBasket.discountsModel = { total: 5 } as ShoppingBasketDiscountsModel;
            component.model.headerModel.shoppingBasket.total.totalPrice = 100;
            component.model.headerModel.shoppingBasket.total.formatted = '100';
            component.updateTripsBasketFromDispo( fakeOfferSelected, {} );
            expect( fakeShoppingBasketViewModelService.calculateAllBasket ).toHaveBeenCalled();
            expect( fakeIbBasketTransformerService.transformTripsCartFromDispo ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When deleteTripsBasketFromDispo is called', () => {
        it( 'should call transformer deleteTripsCartFromDispo set hasElements to false', () => {
            spyOn( component, 'saveHeaderModel' );
            component.deleteTripsBasketFromDispo();
            fixture.detectChanges();
            expect( component.model.headerModel.shoppingBasket.othersModel.hasElements ).toEqual( false );
            expect( fakeIbBasketTransformerService.deleteTripsCartFromDispo ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateTripsBasket is called', () => {
        it( 'should call transformer transformTripsCart', () => {
            spyOn( component, 'saveHeaderModel' );
            component.updateTripsBasket( {}, {} );
            fixture.detectChanges();
            expect( fakeIbBasketTransformerService.transformTripsCart ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateTripsFromOrder is called', () => {
        it( 'should call transformer transformTripsFromOrder', () => {
            spyOn( component, 'saveHeaderModel' );
            component.updateTripsFromOrder( {
                order: {
                    orderId: 'TEST_ORDER_ID',
                    bookingReferences: [],
                    orderItems: [],
                    slices: [],
                    price: null,
                    primaryContactInfo: null,
                    timeLimit: null,
                    privateFareImformations: [],
                    commissions: [],
                    apisRequired: false,
                    specialDiscounts: [],
                    extSenderReference: null,
                    bookingOffice: '',
                    accountCodes: [],
                    checkedBagAllowances: [],
                    carryOnBaggageAllowances: [],
                    brandedFares: null,
                    voucherCompensation: null,
                    pricingConfig: null,
                    status: null,
                    cancelledOrderItems: [],
                    orderProviderDisplayName: null,
                    changeSegmentsByAmadeus: false,
                    orderType: null,
                    discountsApplied: {
                        originalPrice: {
                            fare: 0,
                            tax: 0,
                            total: 0,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        discounts: [],
                        originalOrderItems: [],
                        totalDiscount: 0,
                        originalOfferItems: []
                    }
                },
                passengers: [],
                tickets: [],
                warnings: [],
                paymentsInfo: [],
                contextMetadata: undefined,
                relatedContent: [],
                feeInformations: [],
                errorsWithAdditionalInfo: null,
                identificator: null,
                syncHasChangedPassengerName: false,
                flowType: '',
                orderFlags: [],
                infoValidationFF: undefined,
                syncHasChangedSpecialNeeds: false,
                syncHasChangedBaggage: false,
                syncHasChangedSeats: false,
                syncHasChangedPriorityBoarding: false,
                kpiDisruption: null,
                checkInInfo: null,
                locSurEncrypt: ''
            } );
            fixture.detectChanges();
            expect( fakeIbBasketTransformerService.transformTripsFromOrder ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateDiscounts is called', () => {
        it( 'should call service updateBasketDiscounts', () => {
            spyOn( component, 'saveHeaderModel' );
            const discountsModel = {
                description: '',
                discountFormatted: '',
                discountType: '',
                percentDiscount: 5,
                totalDiscount: 5,
                type: ''
            };
            component.updateDiscounts( '', discountsModel );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.updateBasketDiscounts ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateDiscountsNew is called', () => {
        it( 'should call service updateBasketDiscountsNew', () => {
            spyOn( component, 'saveHeaderModel' );
            const discountsModel:Discount = {
                description: '',
                discountType: '',
                percentDiscount: 5,
                totalDiscount: 5,
                type: '',
                dynamicDiscountRuleId: '',
                accountCode: ''
            };
            const total = { total: 50 } as any;
            component.updateDiscountsNew( discountsModel, total, 5, 45 );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.updateBasketDiscountsNew ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When deleteDiscountBasket is called', () => {
        it( 'should call service deleteDiscountFromBasket', () => {
            spyOn( component, 'saveHeaderModel' );
            component.deleteDiscountBasket( '' );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.deleteDiscountFromBasket ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When addDiscountBasket is called', () => {
        it( 'should call service addDiscountToBasket', () => {
            spyOn( component, 'saveHeaderModel' );
            component.addDiscountBasket( {} );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.addDiscountToBasket ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateBasketOthers is called', () => {
        it( 'should call service updateBasketOthers', () => {
            spyOn( component, 'saveHeaderModel' );
            component.updateBasketOthers( '', {} );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.updateBasketOthers ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateBasketFlexibilization is called', () => {
        it( 'should call service updateBasketFlexibilization', () => {
            spyOn( component, 'saveHeaderModel' );
            component.updateBasketFlexibilization( {} );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.updateBasketFlexibilization ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateBasketUpgrading is called', () => {
        it( 'should call service updateBasketUpgrading', () => {
            spyOn( component, 'saveHeaderModel' );
            component.updateBasketUpgrading( {} );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.updateBasketUpgrading ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updatePendingPaymentItems is called', () => {
        it( 'should call service updatePendingPaymentItems', () => {
            fakeCommonsSessionStorageService.set( 'alreadyLoaded', false );
            spyOn( component, 'saveHeaderModel' );
            const headerInfo = {
                basket: {
                    seats: {}
                }
            };
            component.updatePendingPaymentItems( headerInfo );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.updatePendingPaymentItems ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
        it( 'should call service updatePendingPaymentItems', () => {
            fakeCommonsSessionStorageService.set( 'alreadyLoaded', false );
            spyOn( component, 'saveHeaderModel' );
            const headerInfo = {
                seats: {}
            };
            component.updatePendingPaymentItems( headerInfo );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.updatePendingPaymentItems ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateBasketPriority is called', () => {
        it( 'should call service updateBasketPriority', () => {
            spyOn( component, 'saveHeaderModel' );
            component.updateBasketPriority( {} );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.updateBasketPriority ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    xdescribe( 'When updateLogin is called', () => {
        it( 'should call service dataUserLogin', () => {
            spyOn( component, 'saveHeaderModel' );
            component.updateLogin( {} );
            fixture.detectChanges();
            expect( fakeIbBookingHeaderService.dataUserLogin ).toHaveBeenCalled();
            expect( component.model.greyBarModel.isLogged ).toBe( true );
            expect( component.model.greyBarModel.show ).toBe( true );
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When toggleAdvancedSearch is called', () => {
        it( 'should toggle to activeSeeker true', () => {
            component.activeSeeker = false;
            component.toggleAdvancedSearch( {} );
            fixture.detectChanges();
            expect( component.activeSeeker ).toBe( true );
            expect( component.openCalendar ).toBe( null );
        } );
        it( 'should toggle to activeSeeker false', () => {
            component.activeSeeker = true;
            component.toggleAdvancedSearch( {} );
            fixture.detectChanges();
            expect( component.activeSeeker ).toBe( false );
            expect( component.openCalendar ).toBe( null );
        } );
    } );
    describe( 'When validateStepFlow is called', () => {
        it( 'should return true if availability', () => {
            const validate = component.validateStepFlow( 'availability' );
            fixture.detectChanges();
            expect( validate ).toBe( true );
        } );
        it( 'should return true if ibairp', () => {
            const validate = component.validateStepFlow( 'ibairp' );
            fixture.detectChanges();
            expect( validate ).toBe( true );
        } );
        it( 'should return false if another one', () => {
            const validate = component.validateStepFlow( '' );
            fixture.detectChanges();
            expect( validate ).toBe( false );
        } );
    } );
    describe( 'When checkPartnersDiscount is called', () => {
        it( 'should return true if customer has partners', () => {
            fakeRootScope.customerData = customerPartnersMock;
            fakeRootScope.isLogged = true;
            fixture.detectChanges();
            const checkPartners = component.checkPartnersDiscount();
            expect( checkPartners ).toBe( true );
        } );
        it( 'should return false if customer has not partners', () => {
            fakeRootScope.customerData = null;
            fakeRootScope.isLogged = false;
            fixture.detectChanges();
            const checkPartners = component.checkPartnersDiscount();
            expect( checkPartners ).toBe( false );
        } );
    } );
    describe( 'When backToMain is called', () => {
        it( 'should load if showOnholdModal model property is true and if !isFlowBKIOnHold on ibcmtv step', fakeAsync( () => {
            fakeBookingModalService.showOnholdModal = jasmine.createSpy('showOnholdModal').and.callFake( () => {
                return { result: Promise.resolve( 'ok' ) };
            } );
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibcmtv');
            fakeCommonsSessionStorageService.set( 'flowApp', 'BBKI');
            fakeCommonsSessionStorageService.set( 'onHoldOptions', {} );
            fakeRootScope.isLogged = true;
            fixture.detectChanges();
            component.backToMain( true );
            flushMicrotasks();
            tick( 500 );
            expect( fakeBookingModalService.showOnholdModal ).toHaveBeenCalled();
        } ) );
        it( 'should call showOnholdModal on modal resolve', fakeAsync( () => {
            fakeBookingModalService.showOnholdModal = jasmine.createSpy('showOnholdModal').and.callFake( () => {
                return { result: Promise.resolve( 'ok' ) };
            } );
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibpurc');
            fakeCommonsSessionStorageService.set( 'flowApp', 'BBKI');
            fakeCommonsSessionStorageService.set( 'onHoldOptions', {} );
            fakeRootScope.isLogged = true;
            fixture.detectChanges();
            component.backToMain( true );
            flushMicrotasks();
            tick( 500 );
            expect( fakeBookingModalService.showOnholdModal ).toHaveBeenCalled();
        } ) );
        it( 'should call showModalBackToMain on modal resolve', fakeAsync( () => {
            spyOn( component, 'showModalBackToMain' );
            fakeBookingModalService.showOnholdModal = jasmine.createSpy('showOnholdModal').and.callFake( () => {
                return { result: Promise.resolve( 'ok' ) };
            } );
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibpurc');
            fakeCommonsSessionStorageService.set( 'flowApp', 'BBKI');
            fakeCommonsSessionStorageService.remove( 'onHoldOptions' );
            fakeRootScope.isLogged = true;
            fixture.detectChanges();
            component.backToMain( true );
            flushMicrotasks();
            tick( 500 );
            expect( component.showModalBackToMain ).toHaveBeenCalled();
        } ) );
        it( 'should call eventBackToMainRoot on modal resolve', fakeAsync( () => {
            spyOn( component, 'eventBackToMainRoot' );
            fakeBookingModalService.showOnholdModal = jasmine.createSpy('showOnholdModal').and.callFake( () => {
                return { result: Promise.resolve( 'ok' ) };
            } );
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibpurc');
            fakeCommonsSessionStorageService.set( 'flowApp', 'BBKI');
            fakeCommonsSessionStorageService.remove( 'onHoldOptions' );
            fakeRootScope.isLogged = true;
            component.model.headerModel.showModalBackHome = false;
            fixture.detectChanges();
            component.backToMain( true );
            flushMicrotasks();
            tick( 500 );
            expect( component.eventBackToMainRoot ).toHaveBeenCalled();
        } ) );
        it( 'should call eventBackToMainRoot on modal resolve with closeSession', fakeAsync( () => {
            spyOn( component, 'eventBackToMainRoot' );
            fakeBookingModalService.showOnholdModal = jasmine.createSpy('showOnholdModal').and.callFake( () => {
                return { result: Promise.resolve( 'ok' ) };
            } );
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibpurc');
            fakeCommonsSessionStorageService.set( 'flowApp', 'BBKI');
            fakeCommonsSessionStorageService.remove( 'onHoldOptions' );
            fakeRootScope.isLogged = true;
            component.model.headerModel.showModalBackHome = false;
            component.closeSession = true;
            fixture.detectChanges();
            component.backToMain( true );
            flushMicrotasks();
            tick( 500 );
            expect( component.eventBackToMainRoot ).toHaveBeenCalled();
        } ) );
        it( 'should call showOnholdModal on modal reject', fakeAsync( () => {
            fakeBookingModalService.showOnholdModal = jasmine.createSpy('showOnholdModal').and.callFake( () => {
                return { result: Promise.reject( 'ko' ) };
            } );
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibcmtv');
            fakeCommonsSessionStorageService.set( 'flowApp', 'BBKI');
            fakeCommonsSessionStorageService.set( 'onHoldOptions', {} );
            fakeRootScope.isLogged = true;
            fixture.detectChanges();
            component.backToMain( true );
            flushMicrotasks();
            tick( 500 );
            expect( fakeBookingModalService.showOnholdModal ).toHaveBeenCalled();
        } ) );
    } );
    describe( 'When eventBackToMainRoot is called', () => {
        it( 'with closeSession true showld broadcast', () => {
            component.closeSession = true;
            component.eventBackToMainRoot( true );
            fixture.detectChanges();
            expect( fakeRootScope.$broadcast ).toHaveBeenCalled();
        } );
        it( 'with closeSession false showld broadcast', () => {
            component.closeSession = false;
            component.eventBackToMainRoot( true );
            fixture.detectChanges();
            expect( fakeRootScope.$broadcast ).toHaveBeenCalled();
        } );
    } );
    describe( 'When showModalBackToMain is called', () => {
        it( 'should call showBackMainModalComponent with resolve', () => {
            fakeBookingModalService.showBackMainModalComponent = jasmine.createSpy('showBackMainModalComponent').and.callFake( () => {
                return { result: Promise.resolve( 'ok' ) };
            } );
            component.closeSession = true;
            component.showModalBackToMain( {}, true );
            fixture.detectChanges();
            expect( fakeBookingModalService.showBackMainModalComponent ).toHaveBeenCalled();
        } );
        it( 'should call showBackMainModalComponent with reject', () => {
            fakeBookingModalService.showBackMainModalComponent = jasmine.createSpy('showBackMainModalComponent').and.callFake( () => {
                return { result: Promise.reject( 'ko' ) };
            } );
            component.closeSession = false;
            component.showModalBackToMain( {}, true );
            fixture.detectChanges();
            expect( fakeBookingModalService.showBackMainModalComponent ).toHaveBeenCalled();
        } );
    } );
    describe( 'When backToMultiFlight is called', () => {
        it( 'with goToHome true', () => {
            spyOn( component, 'eventBackToMainRoot' );
            component.backToMultiFlight( true );
            fixture.detectChanges();
            expect( component.eventBackToMainRoot ).toHaveBeenCalled();
        } );
        it( 'with goToHome false', () => {
            spyOn( component, 'showModalBackToMain' );
            component.backToMultiFlight( false );
            fixture.detectChanges();
            expect( component.showModalBackToMain ).toHaveBeenCalled();
        } );
    } );
    describe( 'When showLogin is called', () => {
        it( 'with goToHome true', () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibpbah');
            spyOn( component, 'saveHeaderModel' );
            component.model.greyBarModel.show = true;
            component.showLogin();
            fixture.detectChanges();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
        it( 'with goToHome true', () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibpbah');
            spyOn( component, 'saveHeaderModel' );
            component.model.greyBarModel.show = true;
            component.showLogin();
            fixture.detectChanges();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
        it( 'with goToHome true', () => {
            fakeCommonsSessionStorageService.set( 'actualStepFlow', 'ibcmtv');
            spyOn( component, 'saveHeaderModel' );
            component.model.greyBarModel.show = true;
            component.showLogin();
            fixture.detectChanges();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When updateStepDescription is called', () => {
        it( 'should set stepDesciption in model', () => {
            component.model.stepsModel = {} as any;
            component.updateStepDescription( '' );
            fixture.detectChanges();
            expect( component.model.stepsModel.currentStep.description ).toEqual( '' );
        } );
    } );
    describe( 'When checkAdaptativeMobileFlow is called', () => {
        it( 'should call IbBookingFlowUtilsService.checkAdaptativeMobileView and return the value', fakeAsync(() => {
            const check = component.checkAdaptativeMobileFlow();
            fixture.detectChanges();
            expect( fakeIbBookingFlowUtilsService.checkAdaptativeMobileView ).toHaveBeenCalled();
            expect( check ).toEqual( true );
        } ) );
    } );
    describe( 'When addSimpleDiscount is called', () => {
        it( 'should call IbBookingHeaderService.addSimpleDiscount and call saveHeaderModel', () => {
            spyOn( component, 'saveHeaderModel' );
            fixture.detectChanges();
            component.addSimpleDiscount( <ShoppingBasketDiscountObjectType>{});
            expect( fakeIbBookingHeaderService.addSimpleDiscount ).toHaveBeenCalled();
            expect( component.saveHeaderModel ).toHaveBeenCalled();
        } );
    } );
    describe( 'When getObservableHeader is called', () => {
        it( 'should return the model in the observable', fakeAsync(() => {
            component.observableHeader.next( fullHeaderModel );
            fixture.detectChanges();
            lastValueFrom( component.getObservableHeader() ).then( ( data ) => {
                expect( data ).toEqual( fullHeaderModel );
            } );
        } ) );
    } );
    describe( 'When getAncillariesDeletion is called', () => {
        it( 'should return the value in the observable', fakeAsync(() => {
            component.ancillariesDeletion.next( true );
            fixture.detectChanges();
            lastValueFrom( component.getAncillariesDeletion() ).then( ( data ) => {
                expect( data ).toEqual( true );
            } );
        } ) );
    } );
    describe( 'When setAncillariesDeletion is called', () => {
        it( 'should return the value in the observable', fakeAsync(() => {
            component.setAncillariesDeletion( true );
            fixture.detectChanges();
            lastValueFrom( component.ancillariesDeletion ).then( ( data ) => {
                expect( data ).toEqual( true );
            } );
        } ) );
    } );
    describe( 'When updateStepsModel is called', () => {
        it( 'It should call checkSoftUserAndLoggedData with soft user logged', () => {
            fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy( 'isSoftUser' ).and.returnValue( true );
            fakeIbBookingHeaderService.updateLoggedData = jasmine.createSpy( 'updateLoggedData' ).and.returnValue( {isLogged: true} );
            fakeCommonsSessionStorageService.set( 'customerData', customerDataMock );
            const model = { ...StepsModelMock };
            component.model.stepsModel = model;
            component.updateStepsModel( 'availability', 'HEADER_MOBILE_STEP_DESCRIPTION_AVAILABILITY_SELECT_INBOUND' );
            fixture.detectChanges();
            expect( fakeCommonsUserUtilsService.isSoftUser ).toHaveBeenCalled();
            expect( fakeIbBookingHeaderService.updateLoggedData ).toHaveBeenCalled();
        } );
    } );
    describe( 'When blockNavigation is called', () => {
        it( 'should set navigationBlocked to true when status is true', () => {
            component.navigationBlocked = false;
            component.blockNavigation( true );
            fixture.detectChanges();
            expect( component.navigationBlocked ).toBe( true );
        } );
        it( 'should set navigationBlocked to false when status is false', () => {
            component.navigationBlocked = true;
            component.blockNavigation( false );
            fixture.detectChanges();
            expect( component.navigationBlocked ).toBe( false );
        } );
    } );
    afterEach( () => {
        localStorage.clear();
        sessionStorage.clear();
        TestBed.resetTestingModule();
    } );
});