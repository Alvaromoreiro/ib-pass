import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { AJSBookingPassengerInfoService } from '@src/app/pages/ib-booking-passenger-info/services/ib-booking-passenger-info-service-bridge.service';
import { PassengeInfoUtilsService } from '@src/app/pages/ib-booking-passenger-info/services/ib-passenger-info-utils.service';
import { AJSBookingPassengerInfoTransformer } from '@src/app/pages/ib-booking-passenger-info/transformers/ib-booking-passenger-info-transfomer-bridge.service';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSDatalayerBKIService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { AJSMonetateUtilsService } from '@src/app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService, IbCUserUtilsService } from 'ib-web-commons/utils';
import { BookingPageUtilsServiceMock } from '@test-mocks/class/BookingPageUtilsServiceMock';
import { BookingRedirectionServiceMock } from '@test-mocks/class/BookingRedirectionServiceMock';
import { DatalayerBKIServiceMock } from '@test-mocks/class/DatalayerBKIServiceMock';
import { DatalayerUtilsServiceMock } from '@test-mocks/class/DatalayerUtilsServiceMock';
import { IbCModalServiceMock } from '@test-mocks/class/IbCModalServiceMock';
import { MonetateUtilsServiceMock } from '@test-mocks/class/MonetateUtilsServiceMock';
import { RootScopeMock } from '@test-mocks/class/RootScopeMock';
import { BookingModalServiceMock } from '@test-mocks/Services/BookingModalServiceMock';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
import { NewMainHeaderFacadeTokenMock } from '@test-mocks/class/NewMainHeaderFacadeMock';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { DigitalDataUtilsServiceMock } from '@test-mocks/class/DigitalDataUtilsServiceMock';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

// @ts-ignore
interface ServiceTest extends PassengeInfoUtilsService { 
    rootScope: FakeRootScope;
    NewMainHeaderFacade: HeaderFacadeMock;
    BookingPassengerInfoTransformer: BookingPassengerInfoTransformerMock;
    DatalayerUtilsService: DatalayerUtilsServiceMock;
    BookingModalService: BookingModalServiceMock;
    MonetateUtilsService: MonetateUtilsServiceMock;
    DatalayerBKIService: DatalayerBKIServiceMock;
    BookingUtilService: BookingPageUtilsServiceMock,
    CurrencyService: CurrencyServiceMock;
    BookingPassengerInfoService: BookingPassengerInfoServiceMock;
    TranslateService: TranslateServiceMock;
    CommonsSessionStorageService: StorageServiceMock;
    BookingRedirectionService: BookingRedirectionServiceMock;
    IbCModalService: IbCModalServiceMock;
    CommonsUserUtilsService: IbCUserUtilsServiceMock;
}

class HeaderFacadeMock extends NewMainHeaderFacadeTokenMock {
    updateTripsFromOrder = jasmine.createSpy( 'updateTripsFromOrder' );
}

class CurrencyServiceMock {
    getCurrencyObject = jasmine.createSpy( 'getCurrencyObject' ).and.returnValue( {} );
    formatPrice = jasmine.createSpy( 'formatPrice' ).and.returnValue( '' );
}

class BookingPassengerInfoTransformerMock {
    generateMetaUrl = jasmine.createSpy( 'generateMetaUrl' ).and.returnValue( null );
    transformPassengerInfoToSaveInLocalStorage = jasmine.createSpy( 'transformPassengerInfoToSaveInLocalStorage' ).and.returnValue( { a: '' } );
}

class BookingPassengerInfoServiceMock {
    getDPCookieParameter = jasmine.createSpy( 'getDPCookieParameter' ).and.returnValue( true );
}
class IbCUserUtilsServiceMock {
    isSoftUser = jasmine.createSpy( 'isSoftUser' ).and.callFake( () => false );
    isIbZero = jasmine.createSpy( 'isIbZero' ).and.callFake( () => false );
}
class FakeRootScope extends RootScopeMock {
    isRedemptionFlow = false;
    isPointsOBFlow = false;
    appMarket = 'ES';
}

const testFlightTypes = ( service, flightType ) => {
    service.CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, flightType );
    const check = service.checkNewOfferConditions( 'BBKI' );
    expect( check ).toBe( true );
};

describe('PassengeInfoUtilsService Test', () => {
    let service: ServiceTest;
    let fakeRootScope;
    let fakeHeaderFacade;
    let fakeBookingPassengerInfoTransformer;
    let fakeCurrencyService;
    let fakeIbCUserUtilsService;
    let fakeDatalayerUtilsService;
    let fakeDigitalDataUtilsService;
    let fakeBookingModalService;
    let fakeMonetateUtilsService;
    let fakeDatalayerBKIService;
    let fakeBookingUtilsService;
    let fakeBookingPassengerInfoService;
    let fakeCommonsSessionStorageService;
    beforeEach( async () => {
        fakeRootScope = new FakeRootScope();
        fakeHeaderFacade = new HeaderFacadeMock();
        fakeBookingPassengerInfoTransformer = new BookingPassengerInfoTransformerMock();
        fakeCurrencyService = new CurrencyServiceMock();
        fakeIbCUserUtilsService = new IbCUserUtilsServiceMock();
        fakeDatalayerUtilsService = new DatalayerUtilsServiceMock();
        fakeDigitalDataUtilsService = new DigitalDataUtilsServiceMock();
        fakeBookingModalService = new BookingModalServiceMock();
        fakeMonetateUtilsService = new MonetateUtilsServiceMock();
        fakeDatalayerBKIService = new DatalayerBKIServiceMock();
        fakeBookingUtilsService = new BookingPageUtilsServiceMock();
        fakeBookingPassengerInfoService = new BookingPassengerInfoServiceMock();
        fakeCommonsSessionStorageService = new StorageServiceMock();
        TestBed.configureTestingModule( {
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                PassengeInfoUtilsService,
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: IbBookingHeaderFacadeService, useValue: fakeHeaderFacade },
                { provide: AJSBookingPassengerInfoTransformer, useValue: fakeBookingPassengerInfoTransformer },
                { provide: AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService },
                { provide: AJSBookingModalService, useValue: fakeBookingModalService },
                { provide: AJSMonetateUtilsService, useValue: fakeMonetateUtilsService },
                { provide: AJSDatalayerBKIService, useValue: fakeDatalayerBKIService },
                { provide: AJSBookingUtilsService, useValue: fakeBookingUtilsService },
                { provide: AJSCurrencyService, useValue: fakeCurrencyService },
                { provide: AJSBookingPassengerInfoService, useValue: fakeBookingPassengerInfoService },
                { provide: TranslateService, useValue: new TranslateServiceMock() },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: BookingRedirectionService, useValue: new BookingRedirectionServiceMock() },
                { provide: IbCModalService, useValue: new IbCModalServiceMock() },
                { provide: IbCUserUtilsService, useValue: fakeIbCUserUtilsService },
                { provide: DigitalDataUtilsService, useValue: fakeDigitalDataUtilsService }
            ]
        } );
        service = TestBed.inject( PassengeInfoUtilsService  ) as unknown as any;
    } );
    
    describe( 'When checkRedemptionsAndShuttleFLows', () => {
        it( 'It should execute with all false', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.SHUTTLE_FLOW, true );
            service.CommonsSessionStorageService.set( 'isRedemptionFlow', true );
            service.CommonsSessionStorageService.set( 'isPointsOBFlow', true );
            service.checkRedemptionsAndShuttleFLows();
            expect( service.rootScope.isShuttleFlow ).toBe( true );
            expect( service.rootScope.isRedemptionFlow ).toBe( true );
            expect( service.rootScope.isPointsOBFlow ).toBe( true );
        } );
    } );
    
    describe( 'When checkSelectedFlex is called', () => {
        it( 'It should return "" on selectedFlex from storage null', () => {
            const check = service.checkSelectedFlex();
            expect( check ).toEqual( '' );
        } );
        it( 'It should go throw selectedFlex in storage', () => {
            service.CommonsSessionStorageService.set( 'selectedFlex', { description: '' } );
            service.CommonsSessionStorageService.set( 'headerModel', { headerModel: { shoppingBasket: { total: { formatted: '' } } } } );
            const check = service.checkSelectedFlex();
            expect( typeof check ).toEqual( 'string' );
            expect( service.NewMainHeaderFacade.updateBasketFlexibilization ).toHaveBeenCalled();
        } );
    } );
    
    describe( 'When checkGoToPayment is called', () => {
        it( 'It should check and return', () => {
            const check = service.checkGoToPayment( false, true, true, false );
            expect( check ).toBe( true );
        } );
        it( 'It should check and return false when back navigation is not allowed', () => {
            const check = service.checkGoToPayment( true, true, true, false );
            expect( check ).toBe( false );
        } );
    } );
    
    describe( 'When generateMetasearchUrl is called', () => {
        it( 'It should check and return undefined', () => {
            const check = service.generateMetasearchUrl();
            expect( check ).toBe( undefined );
        } );
        it( 'It should check with metasearch storage and return undefined', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH );
            const check = service.generateMetasearchUrl();
            expect( check ).toBe( undefined );
        } );
        it( 'It should check with metasearch storage and return undefined', () => {
            service.BookingPassengerInfoTransformer.generateMetaUrl = jasmine.createSpy( 'generateMetaUrl' ).and.returnValue( { recoveryLink: '' } );
            service.CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH );
            const check = service.generateMetasearchUrl();
            expect( service.DatalayerUtilsService.addDigitalDataInfo ).toHaveBeenCalled();
            expect( check.recoveryLink ).toBe( '' );
        } );
    } );
    
    describe( 'When checkLoginOnb is called', () => {
        it( 'It should return if logged onb', () => {
            const check = service.checkLoginOnb();
            expect( check ).toBe( false );
        } );
    } );
    
    describe( 'When checkNewOfferConditions is called', () => {
        beforeEach( () => {
            service.rootScope = new FakeRootScope();
        } );
        it( 'It should check redeptions and return false', () => {
            service.rootScope.isPointsOBFlow = true;
            const check = service.checkNewOfferConditions( 'BBKI' );
            expect( check ).toBe( false );
        } );
        it( 'It should check flow BBKI and return false', () => {
            const check = service.checkNewOfferConditions( 'BBKI' );
            expect( check ).toBe( false );
        } );
        it( 'It should check flow BBKIOH and return false', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, 'multitripFlight' );
            const check = service.checkNewOfferConditions( 'BBKIOH' );
            expect( check ).toBe( false );
        } );
        it( 'It should check flow BBKI with AVAILABILITY and return true', () => {
            testFlightTypes( service, BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY );
        } );
        it( 'It should check flow BBKI with REDEMPTION and return true', () => {
            testFlightTypes( service, BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION );
        } );
        it( 'It should check flow BBKI with METASEARCH and return true', () => {
            testFlightTypes( service, BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH );
        } );
    } );
    
    describe( 'When callNotAllowedModal is called', () => {
        beforeEach( () => {
            service.rootScope = new FakeRootScope();
        } );
        it( 'It should show modal and resolve availability', fakeAsync( () => {
            service.BookingModalService.showGenericModal = jasmine.createSpy( 'showGenericModal' ).and.callFake( () => {
                return { result: Promise.resolve() };
            } );
            service.callNotAllowedModal();
            flushMicrotasks();
            const ohOrder = service.CommonsSessionStorageService.get( 'isOnHoldOrder' );
            expect( ohOrder ).toBe( false );
            expect( service.BookingRedirectionService.path ).toHaveBeenCalledWith( '/availability' );
        } ) );
        it( 'It should show modal and resolve ibshuttle', fakeAsync( () => {
            service.BookingModalService.showGenericModal = jasmine.createSpy( 'showGenericModal' ).and.callFake( () => {
                return { result: Promise.resolve() };
            } );
            service.rootScope.isShuttleFlow = true;
            service.callNotAllowedModal();
            flushMicrotasks();
            const ohOrder = service.CommonsSessionStorageService.get( 'isOnHoldOrder' );
            expect( ohOrder ).toBe( false );
            expect( service.BookingRedirectionService.path ).toHaveBeenCalledWith( '/ibshuttle' );
        } ) );
        it( 'It should show modal and reject ibairp', fakeAsync( () => {
            service.BookingModalService.showGenericModal = jasmine.createSpy( 'showGenericModal' ).and.callFake( () => {
                return { result: Promise.reject() };
            } );
            service.CommonsSessionStorageService.set( 'backOnHold', true );
            service.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, {} );
            service.callNotAllowedModal();
            flushMicrotasks();
            const ohOrder = service.CommonsSessionStorageService.get( 'backOnHold' );
            expect( ohOrder ).toBe( true );
            expect( service.NewMainHeaderFacade.updateTripsFromOrder ).toHaveBeenCalled();
            expect( service.BookingRedirectionService.path ).toHaveBeenCalledWith( '/ibairp' );
        } ) );
        it( 'It should show modal and reject previous step', fakeAsync( () => {
            service.BookingModalService.showGenericModal = jasmine.createSpy( 'showGenericModal' ).and.callFake( () => {
                return { result: Promise.reject() };
            } );
            service.CommonsSessionStorageService.set( BkiStorageConstants.CREATE_ORDER_DATA, {} );
            service.CommonsSessionStorageService.set( BkiStorageConstants.PREVIOUS_STEP_FLOW, 'ibtal' );
            service.callNotAllowedModal();
            flushMicrotasks();
            expect( service.NewMainHeaderFacade.updateTripsFromOrder ).toHaveBeenCalled();
            expect( service.BookingRedirectionService.path ).toHaveBeenCalledWith( '/ibtal' );
        } ) );
    } );
    
    describe( 'When transformPassengersToSave is called', () => {
        it( 'It should return from BookingPassengerInfoTransformer', () => {
            const result = service.transformPassengersToSave( {} );
            expect( result ).toEqual( { a: '' } );
        } );
    } );
    
    describe( 'When checkPartnerDiscountFromFare is called', () => {
        it( `It should return true with type PARTNER`, () => {
            const result = service.checkPartnerDiscountFromFare( { type: 'PARTNER' } );
            expect( result ).toBe( true );
        } );
        it( `It should return true with type DUMBO`, () => {
            const result = service.checkPartnerDiscountFromFare( { type: 'DUMBO' } );
            expect( result ).toBe( true );
        } );
        it( `It should return true with type PLUTO`, () => {
            const result = service.checkPartnerDiscountFromFare( { type: 'PLUTO' } );
            expect( result ).toBe( true );
        } );
        it( `It should return true with type DYNAMIC_PRICING`, () => {
            const result = service.checkPartnerDiscountFromFare( { type: 'DYNAMIC_PRICING' } );
            expect( result ).toBe( false );
        } );
    } );
    
    describe( 'When loadPassengerDigitalDataAndMonetate is called', () => {
        it( 'It should call all the updates', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.SELECTED_TRIP_INFO, {} );
            const data = { securityInfoData: { digitalDataObject: {} } };
            const fareDataAux = { offers: [ { specialDiscountsApplied: {} } ] };
            service.loadPassengerDigitalDataAndMonetate( data, fareDataAux );
            expect( service.DatalayerUtilsService.updateDiscountData ).toHaveBeenCalled();
            expect( service.DatalayerBKIService.getDigitalDataEcommerce ).toHaveBeenCalled();
            expect( service.DatalayerUtilsService.updateDatalayerViewEvent ).toHaveBeenCalled();
            expect( service.MonetateUtilsService.updateMonetateInfo ).toHaveBeenCalled();
        } );
    } );
    
    describe('When selectQuadrigam is called', () => {
        it( 'It should check PAOB', () => {
            service.CommonsSessionStorageService.set(BkiStorageConstants.FLOW_APP, 'PAOB');
            const result = service.selectQuadrigam();
            expect( result ).toEqual( BookingAppConstants.QUADRIGAMS.PA_PASSENGERS );
        } );
        it( 'It should check PAOBONB', () => {
            service.CommonsSessionStorageService.set(BkiStorageConstants.FLOW_APP, 'PAOBONB');
            const result = service.selectQuadrigam();
            expect( result ).toEqual( BookingAppConstants.QUADRIGAMS.PA_PASSENGERS_ONB );
        } );
        it( 'It should check PARE', () => {
            service.CommonsSessionStorageService.set(BkiStorageConstants.FLOW_APP, 'PARE');
            const result = service.selectQuadrigam();
            expect( result ).toEqual( BookingAppConstants.QUADRIGAMS.PA_PASSENGERS_REDENTION );
        } );
        it( 'It should check PAREONB', () => {
            service.CommonsSessionStorageService.set(BkiStorageConstants.FLOW_APP, 'PAREONB');
            const result = service.selectQuadrigam();
            expect( result ).toEqual( BookingAppConstants.QUADRIGAMS.PA_PASSENGERS_ONB_REDENTION );
        } );
        it( 'It should check default multicity', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.MULTICITY, true );
            const result = service.selectQuadrigam();
            expect( result ).toEqual( BookingAppConstants.QUADRIGAMS.MULTI_PASSENGERS_INFO );
        } );
        it( 'It should check default multicity and hmad', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.MULTICITY, true );
            service.CommonsSessionStorageService.set( 'isHMAD', true );
            const result = service.selectQuadrigam();
            expect( result ).toEqual( BookingAppConstants.QUADRIGAMS.HMAD_PASSENGERS_INFO );
        } );
        it( 'It should check Redemption Flow', () => {
            service.rootScope.isRedemptionFlow = true;
            const result = service.selectQuadrigam();
            expect( result ).toEqual( BookingAppConstants.QUADRIGAMS.REDEMPTION_PASSENGERS );
        } );
        it( 'It should check Redemption Flow', () => {
            service.rootScope.isRedemptionFlow = true;
            service.rootScope.isPointsOBFlow = true;
            const result = service.selectQuadrigam();
            expect( result ).toEqual( BookingAppConstants.QUADRIGAMS.ONB_REDEMPTION_PASSENGERS );
        } );
    });
    
    describe( 'When getPassengerInfoError', () => {
        it( 'it should call modal service finish waiting and showGenericError', fakeAsync( () => {
            service.getPassengerInfoError( {} );
            expect( service.BookingModalService.finishWaiting ).toHaveBeenCalled();
            expect( service.BookingModalService.showGenericError ).toHaveBeenCalled();
        } ) );
    } );
    describe( 'When checkNewOffer is called', () => {
        it( 'It should return undefined', () => {
            spyOn( service, 'checkNewOfferConditions' ).and.returnValue( false );
            const result = service.checkNewOffer( 'MMBOH', { offers: [ {} ] } );
            expect( result ).toBe( undefined );
        } );
        it( 'It should ', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY );
            service.CommonsSessionStorageService.set( BkiStorageConstants.BOOKING_URL_PARAMS, {} );
            service.CommonsSessionStorageService.set( BkiStorageConstants.ORIGIN_DESTINATIONS, {} );
            service.CommonsSessionStorageService.set( BkiStorageConstants.FF_CONDITIONS_INFO, {} );
            service.CommonsSessionStorageService.set( 'selectedTripSegments', {} );
            service.checkNewOffer( 'BBKI', { offers: [ {} ] } );
            expect( service.MonetateUtilsService.addFlightReviewMonetate ).toHaveBeenCalled();
        } );
    });
    describe( 'When checkAndSetFareCurrency', () => {
        it( 'it should return undefinded', () => {
            const data = { contextMetadata: {} };
            const result = service.checkAndSetFareCurrency( data );
            expect( result ).toBe( undefined );
        } );
        it( 'it should expect the result', () => {
            const data = { contextMetadata: { currencies: [ {} ] } };
            const result = service.checkAndSetFareCurrency( data );
            expect( result ).toEqual( {} );
        } );
    } );
    describe( 'When setBasketOthers', () => {
        it( 'it should return undefinded', () => {
            const aux = { };
            const fare = { };
            const result = service.setBasketOthers( aux, fare );
            expect( result ).toBe( undefined );
        } );
        it( 'it should call updateBasketOthers', () => {
            spyOn( service, 'checkAndSetFareCurrency' ).and.returnValue( {} );
            const aux = { offers: [ { price: { ticketingFee: {} } } ] };
            const fare = { contextMetadata: { currencies: [ {} ] } };
            service.setBasketOthers( aux, fare );
            expect( service.NewMainHeaderFacade.updateBasketOthers ).toHaveBeenCalled();
        } );
    } );
    describe( 'When checkShuttleOnPassengerInfo is called', () => {
        it( 'It should check isShuttleFlow and return incoming model', () => {
            const result = service.checkShuttleOnPassengerInfo( {} );
            expect( result ).toEqual( {} );
        } );
        it( 'It should add shuttle on DigitalData throw service', () => {
            service.rootScope.isShuttleFlow = true;
            const result = service.checkShuttleOnPassengerInfo( {} );
            expect( result.dynamicPricingSeat ).toEqual( 1 );
            expect( service.DatalayerUtilsService.addShuttleDigitalData ).toHaveBeenCalled();
        } );
    });
    describe( 'When checkLoadPassengerHolaMadrid is called', () => {
        it( 'It should return incoming with no isHMAD', () => {
            const result = service.checkLoadPassengerHolaMadrid( false );
            expect( result ).toBe( false );
        } );
        it( 'It should return incoming with isHMAD', () => {
            service.CommonsSessionStorageService.set( 'isHMAD', true );
            const result = service.checkLoadPassengerHolaMadrid( true );
            expect( result ).toBe( true );
        } );
    } );
    describe( 'When checkToShowSoftLoginModal is called', () => {
        it( 'It should return undefined', () => {
            const result = service.checkToShowSoftLoginModal();
            expect( result ).toBe( undefined );
        } );
        it( 'It should return undefined with softLoginModal key', () => {
            service.CommonsSessionStorageService.set( 'softLoginModal', { desktop: true, mobile: true } );
            const result = service.checkToShowSoftLoginModal();
            expect( result ).toBe( undefined );
        } );
        it( 'It should call IbCModalService.showGenericComponentModal', () => {
            service.CommonsUserUtilsService.isSoftUser = jasmine.createSpy( 'isSoftUser' ).and.callFake( () => true );
            service.CommonsSessionStorageService.set( 'softLoginModal', { desktop: true, mobile: true } );
            service.rootScope.isMobile = { general: true, header: true };
            service.checkToShowSoftLoginModal();
            expect( service.IbCModalService.showGenericComponentModal ).toHaveBeenCalled();
        } );
    });
    describe( 'When saveNewsletterSubscription is called', () => {
        beforeEach( () => {
            service.CommonsSessionStorageService.clear();
        } );
        it( 'It should remove newsletterPersonalDataToSave when user denies newsletter', () => {
            service.CommonsSessionStorageService.set( 'newsletterPersonalDataToSave', {} );
            const model = { passengersFormData: { securityInfo: { contactData: { denyNewsLetters: true } } } };
            service.saveNewsletterSubscription( false, model, false );
            const dataSaved = service.CommonsSessionStorageService.get( 'newsletterPersonalDataToSave' );
            expect( dataSaved ).toEqual( null );
        } );

        it( 'It should remove newsletterPersonalDataToSave when user is logged', () => {
            service.CommonsSessionStorageService.set( 'newsletterPersonalDataToSave', {} );
            const model = { passengersFormData: { securityInfo: { contactData: { denyNewsLetters: true } } } };
            service.saveNewsletterSubscription( false, model, true );
            const dataSaved = service.CommonsSessionStorageService.get( 'newsletterPersonalDataToSave' );
            expect( dataSaved ).toEqual( null );
        } );

        it( 'It should set newsletterPersonalDataToSave when user does not deny newsletter', () => {
            const model = { passengersFormData: { securityInfo: { contactData: { contactEmail: 'asdf@adsf.com', denyNewsLetters: false }, passengerInfo: [ { data: { name: 'A', surname: 'S' } } ] } } };
            service.saveNewsletterSubscription( false, model, false );
            const dataSaved = service.CommonsSessionStorageService.get( 'newsletterPersonalDataToSave' );
            expect( dataSaved ).toEqual( { email: 'asdf@adsf.com', name: 'A', firstSurname: 'S' } );
        } );
    } );
    describe( 'When restoreHeaderModel is called', () => {
        it( 'It should check no header backup', () => {
            service.restoreHeaderModel();
            expect( fakeHeaderFacade.updateHeaderModel ).not.toHaveBeenCalled();
        } );
        it( 'It should check header backup and updateHeaderModel', () => {
            fakeCommonsSessionStorageService.set( BkiStorageConstants.HEADER_MODEL_BACKUP, {} );
            service.restoreHeaderModel();
            const header = fakeCommonsSessionStorageService.get( BkiStorageConstants.HEADER_MODEL_BACKUP );
            expect( fakeHeaderFacade.updateHeaderModel ).toHaveBeenCalled();
            expect( header ).toBe( null );
        } );
    } );

    describe('When setShowbasketByFlowType is called', () => {
        beforeEach(() => {
            service.NewMainHeaderFacade.updateHeaderModel.calls.reset();
        });

        it('should not call updateHeaderModel if flightType is not applicable', () => {
            const headerModel = { headerModel: { showBasket: false } };
            service.CommonsSessionStorageService.set(BkiStorageConstants.HEADER_MODEL, headerModel);
            service.CommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, 'anotherFlightType');

            service.setShowbasketByFlowType();

            expect(service.NewMainHeaderFacade.updateHeaderModel).not.toHaveBeenCalled();
        });

        it('should call updateHeaderModel for METASEARCH flight type', () => {
            const headerModel = { headerModel: { showBasket: false } };
            service.CommonsSessionStorageService.set(BkiStorageConstants.HEADER_MODEL, headerModel);
            service.CommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH);

            service.setShowbasketByFlowType();

            expect(service.NewMainHeaderFacade.updateHeaderModel).toHaveBeenCalledWith({ headerModel: { showBasket: true } });
        });

        it('should call updateHeaderModel for MULTITRIP flight type', () => {
            const headerModel = { headerModel: { showBasket: false } };
            service.CommonsSessionStorageService.set(BkiStorageConstants.HEADER_MODEL, headerModel);
            service.CommonsSessionStorageService.set(BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP);

            service.setShowbasketByFlowType();

            expect(service.NewMainHeaderFacade.updateHeaderModel).toHaveBeenCalledWith({ headerModel: { showBasket: true } });
        });

    });
});
