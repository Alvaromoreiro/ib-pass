import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { IbBookingSlicedAvailabilityComponent } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/ib-booking-sliced-availability.component';
import { IbBookingSlicedAvailabilityService } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-booking-sliced-availability.service';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { AJSDatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { AJSDatalayerBKIService } from '@shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { AJSMonetateUtilsService } from '@shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { BookingLocalDiscountsService } from '@shared/services/ib-booking-availability/ib-booking-utils-local-discounts.service';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { commercialDataStoredMock } from 'test/unit/app/services/ib-booking-availability/call-commercial-mocks/call-commercial-mocks';
import { AJSBookingModalService } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { RibbonDataTransformer } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-ribbon-data-transformer.service';
import { AJSSlicedAvailabilityDataTransformer } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/services/ib-availability-data-transformer-bridge.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToCasePipe } from '@shared/pipes/toCase.pipe';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import {
    BookingLocalDiscountsServiceMock, BookingModalServiceMock, BookingSlicedAvailabilityServiceMock,
    CurrencyServiceMock, DatalayerBKIServiceMock, DatalayerUtilsServiceMock,
    FakeWindowMock, MonetateUtilsServiceMock, NewMainHeaderFacadeTokenMock,
    RootScopeMock, RibbonDataTransformerMock, AJSSlicedAvailabilityDataTransformerMock
} from '@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-sliced-availability.component.classes-mocks';
import { cloneDeep } from 'lodash-es';
import { BookingUserActivityService } from '@src/app/core/services/ib-booking-user-activity.service';
import { BookingUserActivityServiceMock } from '@test-mocks/Services/BookingUserActivityServiceMock';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { DigitalDataUtilsServiceMock } from '@test-mocks/class/DigitalDataUtilsServiceMock';
import { UrlUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-url-utils.service';
import { UrlUtilsServiceMock } from '@test-mocks/Services/UrlUtilsServiceMock';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
import { AJSIbBookingAvailabilityPageService, IbBookingAvailabilityPageServiceType } from '../../services/ib-booking-availability-page-utils-bridge.service';
import { IbBookingAvailabilityPageUtilsService } from '../../services/ib-booking-availability-page-utils-service';

const outboudAvailabilityGridMock = require( '@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-sliced-availability-outbound-response-mock.json' );
const inboundAvailabilityGridMock = require( '@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-sliced-availability-inbound-response-mock.json' );
const { bookingUrlParamsMock, discountsMock, eqSlicesMock, fareDetailsMock, headerModelWithDiscotunsMock,
    selectInboundSliceEventDetailMock, selectSliceEventDetailMock, selectedOfferWithDiscounts,
    selectedSlicesOutboundMock, slideSelectedDetailMock, tranformedCurrencies 
} = require('@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-sliced-availability-component-mocks.json');

let fakeBookingModalService: BookingModalServiceMock;
let fakeAJSNewMainHeaderFacadeToken: NewMainHeaderFacadeTokenMock;
let fakeAJSRootScope: RootScopeMock;
let fakeAJSCurrencyService: CurrencyServiceMock;
let fakeAJSDatalayerUtilsService: DatalayerUtilsServiceMock;
let fakeAJSDatalayerBKIService: DatalayerBKIServiceMock;
let fakeAJSMonetateUtilsService: MonetateUtilsServiceMock;
let fakeWindow: FakeWindowMock;
let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
let fakeIbBookingSlicedAvailabilityService: BookingSlicedAvailabilityServiceMock;
let fakeBookingLocalDiscountsService: BookingLocalDiscountsServiceMock;
let fakeRibbonDataTransformer: RibbonDataTransformerMock;
let fakeAJSSlicedAvailabilityDataTransformer: AJSSlicedAvailabilityDataTransformerMock;
let fakeDigitalDataUtilsService: DigitalDataUtilsServiceMock;
let fakeAJSIbBookingAvailabilityPageService: Partial<IbBookingAvailabilityPageServiceType>;
describe('IbBookingSlicedAvailabilityComponent', () => {
    let component: IbBookingSlicedAvailabilityComponent;
    let fixture: ComponentFixture<IbBookingSlicedAvailabilityComponent>;
    beforeEach(() => {
        fakeCommonsSessionStorageService.clear();
        fakeBookingModalService = new BookingModalServiceMock();
        fakeAJSNewMainHeaderFacadeToken = new NewMainHeaderFacadeTokenMock();
        fakeAJSRootScope = new RootScopeMock();
        fakeAJSCurrencyService = new CurrencyServiceMock();
        fakeAJSDatalayerUtilsService = new DatalayerUtilsServiceMock();
        fakeAJSDatalayerBKIService = new DatalayerBKIServiceMock();
        fakeAJSMonetateUtilsService = new MonetateUtilsServiceMock();
        fakeWindow = new FakeWindowMock();
        fakeIbBookingSlicedAvailabilityService = new BookingSlicedAvailabilityServiceMock();
        fakeBookingLocalDiscountsService = new BookingLocalDiscountsServiceMock();
        fakeRibbonDataTransformer = new RibbonDataTransformerMock();
        fakeAJSSlicedAvailabilityDataTransformer = new AJSSlicedAvailabilityDataTransformerMock();
        fakeDigitalDataUtilsService = new DigitalDataUtilsServiceMock();
        fakeAJSIbBookingAvailabilityPageService = {
            equalFareHeights: jasmine.createSpy('equalFareHeights'),
            updateHeaderDates: jasmine.createSpy('updateHeaderDates')
            
        };
        TestBed.configureTestingModule( {
            declarations: [
                IbBookingSlicedAvailabilityComponent,
                ToCasePipe,
                TruncatePipe
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
                { provide: AJSBookingModalService, useValue: fakeBookingModalService },
                { provide: IbBookingHeaderFacadeService, useValue: fakeAJSNewMainHeaderFacadeToken },
                { provide: AJSRootScope, useValue: fakeAJSRootScope },
                { provide: AJSCurrencyService, useValue: fakeAJSCurrencyService },
                { provide: AJSDatalayerUtilsService, useValue: fakeAJSDatalayerUtilsService },
                { provide: AJSDatalayerBKIService, useValue: fakeAJSDatalayerBKIService },
                { provide: AJSMonetateUtilsService, useValue: fakeAJSMonetateUtilsService },
                { provide: WINDOW_TOKEN, useValue: fakeWindow },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: BookingLocalDiscountsService, useValue: fakeBookingLocalDiscountsService },
                { provide: RibbonDataTransformer, useValue: fakeRibbonDataTransformer },
                { provide: AJSSlicedAvailabilityDataTransformer, useValue: fakeAJSSlicedAvailabilityDataTransformer },
                {provide: BookingUserActivityService, useClass: BookingUserActivityServiceMock},
                { provide: DigitalDataUtilsService, useValue: fakeDigitalDataUtilsService },
                { provide: UrlUtilsService, useClass: UrlUtilsServiceMock },
                 {provide: AJSIbBookingAvailabilityPageService, useValue: fakeAJSIbBookingAvailabilityPageService}

            ]
        }).overrideComponent(
            IbBookingSlicedAvailabilityComponent,
            {
                set: {
                    providers: [
                        { provide: IbBookingSlicedAvailabilityService, useValue: fakeIbBookingSlicedAvailabilityService },
                        {provide: IbBookingAvailabilityPageUtilsService, useValue: fakeAJSIbBookingAvailabilityPageService}

                    ]
                }
            }
        ).compileComponents();

        fakeCommonsSessionStorageService.set( 'bookingUrlParams', bookingUrlParamsMock );
        fakeCommonsSessionStorageService.set( 'commercialData', commercialDataStoredMock );
        fakeAJSRootScope.newFare = false;
        fixture = TestBed.createComponent(IbBookingSlicedAvailabilityComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', fakeAsync(() => {
        flushMicrotasks();
        tick(100);
        expect( component ).toBeTruthy();
        expect( typeof component[ 'commercialData' ] ).toBe( 'object' );
        expect( component[ 'commercialData' ].market.code ).toEqual( 'ES' );
        expect(component.selectedSlices.length).toEqual(0);
        expect(fakeIbBookingSlicedAvailabilityService.checkPartnerDiscountSelection).toHaveBeenCalled();

    }) );
    it( 'should create without phoneslist empty for footer', fakeAsync( () => {
        fakeAJSRootScope.phonesList = {};
        fixture = TestBed.createComponent(IbBookingSlicedAvailabilityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        flushMicrotasks();
        tick( 100 );
        expect( component ).toBeTruthy();
        expect( typeof component[ 'commercialData' ] ).toBe( 'object' );
        expect( component[ 'commercialData' ].market.code ).toEqual( 'ES' );
        expect( component.selectedSlices.length ).toEqual( 0 );
    }) );

    it( 'should pass through newFare', fakeAsync( () => {
        fakeCommonsSessionStorageService.set( 'newFare', 'newFare' );
        fixture = TestBed.createComponent(IbBookingSlicedAvailabilityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        flushMicrotasks();
        tick( 100 );
        expect( typeof component[ 'mnttLog2GTM' ] ).toBe( 'function' );
    }) );

    it('should call onAfterLogin', fakeAsync(() => {
        spyOn<any>(component, 'loadOutboundGrid');
        component.availabilityDataSubject.next( outboudAvailabilityGridMock );
        component['OnAfterLogin']();
        component.availabilityDataSubject.next( outboudAvailabilityGridMock );
        flushMicrotasks();
        tick( 100 );
        expect(fakeAJSRootScope.showHeaders).toEqual(true);
        expect(fakeIbBookingSlicedAvailabilityService.checkPartnerDiscountSelection).toHaveBeenCalled();
        expect(component['loadOutboundGrid']).toHaveBeenCalled();
        fixture.detectChanges();
    }) );

    it( 'should detect changes on discounts',  () => {
        component[ 'onDomesticDiscountChange' ]( discountsMock );
        component.availabilityDataSubject.next( inboundAvailabilityGridMock );
        expect( component.localDiscountSelectorConfig.residentCodeSelected ).toEqual( discountsMock.resident );
    } ) ;
    it( 'should detect changes on discounts and selectedSlices length > 1', () => {
        
        component.selectedSlices = [ ...cloneDeep( selectedSlicesOutboundMock ), cloneDeep( selectInboundSliceEventDetailMock.detail.selectedSlice ) ];
        component[ 'onDomesticDiscountChange' ]( discountsMock );
        component.availabilityDataSubject.next( inboundAvailabilityGridMock );
        expect( component.localDiscountSelectorConfig.residentCodeSelected ).toEqual( discountsMock.resident );
    } ) ;
    describe( 'IbBookingSlicedAvailabilityComponent onOutboundContinue', () => {
        beforeEach( () => {
            fixture = TestBed.createComponent(IbBookingSlicedAvailabilityComponent);
            component = fixture.componentInstance;
            component.selectedOffer = selectedOfferWithDiscounts;
            component.selectedSlices = selectedSlicesOutboundMock;
            component.availabilityDataSubject.next( inboundAvailabilityGridMock );
        } );
        it( 'should call loadInboundGrid and call the inbound grid', fakeAsync( () => {
            const newParams = 'Qm9va2luZ0BHVy0xNjk3MDI1Nzk3MTg1LXQxa21n/IB0c2aa13884194606a63dc1a1ccaf5c52OP/0';
            component.onOutboundContinue();
            flushMicrotasks();
            tick( 1000 );
            expect( component.currentODIndex ).toEqual( 1 );
            expect( component['lastInboundParams'] ).toEqual( newParams );
        }) );
        it( 'should call loadInboundGrid and with lastInboundParams === newParams and originDestination.length === 2', fakeAsync( () => {
            const newParams = 'Qm9va2luZ0BHVy0xNjk3MDI1Nzk3MTg1LXQxa21n/IB0c2aa13884194606a63dc1a1ccaf5c52OP/0';
            component['lastInboundParams'] = newParams;
            component.onOutboundContinue();
            flushMicrotasks();
            tick( 1000 );
            expect( component.currentODIndex ).toEqual( 1 );
            expect( component['lastInboundParams'] ).toEqual( newParams );
        }) );
    } );
    describe('IbBookingSlicedAvailabilityComponent onSelectedSliceEvent', () => {
        beforeEach(() => {
            fakeAJSRootScope.newFare = false;
        });
        it( 'should call selectSlice by event dispatch', fakeAsync( () => {
            const customEvent = new CustomEvent( 'selectedSliceEvent', {...selectSliceEventDetailMock, bubbles: true } );
            spyOn<any>( component, 'selectSlice' );
            component.availabilityDataSubject.next( outboudAvailabilityGridMock );
            fixture.nativeElement.dispatchEvent( customEvent );
            flushMicrotasks();
            tick( 100 );
            expect( component[ 'selectSlice' ] ).toHaveBeenCalled( );
        }) );
        it( 'should call selectedFareFamily by event dispatch', fakeAsync( () => {
            const selectedFareFamiliy = {...eqSlicesMock[0].info.selectedFareFamily};
            const customEvent = new CustomEvent( 'selectedFareFamily', { detail: selectedFareFamiliy, bubbles: true } );
            spyOn<any>( component, 'onSelectedFareFamily' );
            component.availabilityDataSubject.next( outboudAvailabilityGridMock );
            fixture.nativeElement.dispatchEvent( customEvent );
            flushMicrotasks();
            tick( 100 );
            expect( component[ 'onSelectedFareFamily' ] ).toHaveBeenCalled( );
        }) );
        it( 'should call selectSlice and set a default selectedFare', fakeAsync( () => {
            component.availabilityDataSubject.next( outboudAvailabilityGridMock );
            component[ 'selectSlice' ]( selectSliceEventDetailMock );
            flushMicrotasks();
            tick( 100 );
            expect(component.selectedSlices.length).toEqual(1);
            expect(component.selectedSlices[0].info.selectedFareFamily).not.toBeNull();

        }));
        it('should call selectSlice and set a null selectedFare as null because is newFare', fakeAsync(() => {
            fakeAJSRootScope.newFare = true;
            component.availabilityDataSubject.next( outboudAvailabilityGridMock );
            component['selectSlice'](selectSliceEventDetailMock);
            flushMicrotasks();
            tick( 100 );
            expect(component.selectedSlices.length).toEqual(1);
            expect(component.selectedSlices[0].info.selectedFareFamily).toBeNull();

        }) );
    } );
    describe( 'IbBookingSlicedAvailabilityComponent on close selected slice view', () => {
        beforeEach( () => {
            fixture = TestBed.createComponent(IbBookingSlicedAvailabilityComponent);
            component = fixture.componentInstance;
            const customEvent = selectSliceEventDetailMock;
            component.selectedSlices = [ ...cloneDeep( selectedSlicesOutboundMock ) ];
            component.currencies = tranformedCurrencies;
            component[ 'selectSlice' ]( customEvent );
        });
        it( 'should call onRemoveSelectedSlice', fakeAsync( () => {
            fixture.detectChanges();
            component.availabilityDataSubject.next( outboudAvailabilityGridMock );
            component.onRemoveSelectedSlice();
            flushMicrotasks();
            tick( 1000 );
            expect( component.selectedSlices.length ).toEqual( 0 );
        }) );
        it( 'should call onRemoveSelectedSlice when selectedSlice.length should be equal to 1', fakeAsync( () => {
            const customEvent = selectInboundSliceEventDetailMock;
            component.currentODIndex = 1;
            component[ 'selectSlice' ]( customEvent );
            component.selectedSlices = [ ...cloneDeep( selectedSlicesOutboundMock ), ...cloneDeep( selectedSlicesOutboundMock ) ];
            component.availabilityDataSubject.next( inboundAvailabilityGridMock );
            fixture.detectChanges();
            component.onRemoveSelectedSlice();
            flushMicrotasks();
            tick( 1000 );
            expect( component.selectedSlices.length ).toEqual( 1 );
        }) );
    } );
    describe( 'IbBookingSlicedAvailabilityComponent on onReselectOutboundFare', () => {
        it( 'should return to currentODIndex 0 and call onResetBasket and delete discounts if exists', fakeAsync( () => {
            fakeCommonsSessionStorageService.set( 'headerModel', headerModelWithDiscotunsMock );
            component.selectedSlices = [ ...cloneDeep( selectedSlicesOutboundMock ), cloneDeep( selectInboundSliceEventDetailMock.detail.selectedSlice ) ];
            component.currentODIndex = 1;
            component.selectedOffer = cloneDeep( selectedOfferWithDiscounts );
            fixture.detectChanges();
            component.onReselectOutboundFare();
            flushMicrotasks();
            tick( 1500 );
            expect( component.currentODIndex ).toEqual( 0 );
        } ) );
    } );
    describe( 'IbBookingSlicedAvailabilityComponent call onSlideSelected ', () => {
        it( 'should update dates ', fakeAsync( () => {
            component.selectedSlices = [ ...cloneDeep( selectedSlicesOutboundMock ) ];
            component.currentODIndex = 1;
            component.selectedOffer = cloneDeep( selectedOfferWithDiscounts );
            component.availabilityDataSubject.next( inboundAvailabilityGridMock );
            component.onSlideSelected(slideSelectedDetailMock);
            flushMicrotasks();
            tick( 1500 );
            expect( component.currentODIndex ).toEqual( 1 );
        } ) );
        it( 'should update dates and eqSlices should be null', fakeAsync( () => {
            fakeIbBookingSlicedAvailabilityService.getEquivalentSlices = jasmine.createSpy().and.callFake( () => [] );
            component.selectedSlices = [ ...cloneDeep( selectedSlicesOutboundMock ) ];
            component.currentODIndex = 1;
            component.selectedOffer = cloneDeep( selectedOfferWithDiscounts );
            component.availabilityDataSubject.next( inboundAvailabilityGridMock );
            component.onSlideSelected(slideSelectedDetailMock);
            flushMicrotasks();
            tick( 1500 );
            expect( component.currentODIndex ).toEqual( 0 );
        } ) );
    } );
    describe( 'IbBookingSlicedAvailabilityComponent call openFareComparationModal  ', () => {
        it( 'should open modal with fare details by event dispatch', fakeAsync( () => {
            const customEvent = new CustomEvent( 'openFareModal', { detail: fareDetailsMock, bubbles: true } );
            spyOn<any>( component, 'openFareComparationModal' );
            component.availabilityDataSubject.next( outboudAvailabilityGridMock );
            fixture.nativeElement.dispatchEvent( customEvent );
            flushMicrotasks();
            tick( 100 );
            expect( component[ 'openFareComparationModal' ] ).toHaveBeenCalled( );
        }) );
        it( 'should open modal with fare details ', fakeAsync( () => {
            component.availabilityDataSubject.next( inboundAvailabilityGridMock );
            component[ 'openFareComparationModal' ]( fareDetailsMock );
            flushMicrotasks();
            tick( 1500 );
            expect( component.availabilityDataSubject[ '_buffer' ][ 0 ].fareFamilyConditions.length ).toEqual( 7 );
        } ) );
    } );
    describe( 'IbBookingSlicedAvailabilityComponent call onContinueEvent', () => {
        it( 'should call onContinueEvent and setSlicedRequestFareInfo ', fakeAsync( () => {
            const responseId = inboundAvailabilityGridMock.transformedAvailabilityData.responseId;
            component.availabilityDataSubject.next( inboundAvailabilityGridMock );
            component.onContinueEvent();
            flushMicrotasks();
            tick( 1500 );
            expect( component.availabilityDataSubject[ '_buffer' ][ 0 ].transformedAvailabilityData.responseId ).toEqual( responseId );
        } ) );
        it( 'should call onContinueEvent and go throw error ', fakeAsync( () => {
            const error = new Error('failure');
            fakeIbBookingSlicedAvailabilityService.setSlicedRequestFareInfo.and.rejectWith( error );
            fakeBookingModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake( () => {
                return { result: Promise.resolve('ok') };
            });
            component.availabilityDataSubject.next( inboundAvailabilityGridMock );
            component.onContinueEvent();
            flushMicrotasks();
            tick( 1500 );
            expect( fakeBookingModalService.showGenericError ).toHaveBeenCalled();
            expect( fakeBookingModalService.finishWaiting ).toHaveBeenCalled();
        } ) );
    } );
    describe( 'IbBookingSlicedAvailabilityComponent call nextSliceDate and currentODIndex should be 0', () => {
        it( 'should call IbBookingSlicedAvailabilityService.nextSliceDate ', fakeAsync( () => {
            component.availabilityDataSubject.next( inboundAvailabilityGridMock );
            component[ 'nextSliceDate' ]( true, 1 );
            flushMicrotasks();
            tick( 1500 );
            expect( component.currentODIndex ).toEqual( 0 );
        } ) );
    });

    describe('Test changes selected Upselling', () => {
        it('Test onSelectedUpselling', () => {
            const selectedFareFamiliy = { ...eqSlicesMock[0].info.selectedFareFamily };
            component.selectedSlices = selectedSlicesOutboundMock;
            spyOn<any>(component, 'onSelectedFareFamily');
            component['onSelectedUpselling'](selectedFareFamiliy);
            expect(component['onSelectedFareFamily']).toHaveBeenCalled();
        });
    });

    describe('Set newFare event', () => {
        it('Test newFare event launched', fakeAsync(() => {
            fakeAJSRootScope.newFare = false;
            const customEvent = new CustomEvent('newFare');
            window.dispatchEvent(customEvent);
            flushMicrotasks();
            tick(5);
            expect(fakeAJSRootScope.newFare).toEqual(true);
        }));
    });


    describe('Test onResizeAction ', () => {
        it('check onresize conditios', () => {
            component.selectedSlices = selectedSlicesOutboundMock;
            component['onResizeAction']();

            expect(fakeAJSIbBookingAvailabilityPageService.equalFareHeights).toHaveBeenCalled();
            expect(component.isMobile).toBe(fakeAJSRootScope.isMobile.general);

        });
    });
    describe('When onMobileContinueFlow is called', () => {
        it( 'should check step position for round trip step 1 and call onOutboundContinue', () => {
            component.selectedSlices = selectedSlicesOutboundMock;
            component.slicesSelectionLimit = 2;
            component.currentODIndex = 0;
            spyOn<any>( component, 'onOutboundContinue' );
            component.onMobileContinueFlow();
            fixture.detectChanges();
            expect( component.onOutboundContinue ).toHaveBeenCalled();
        } );
        it( 'should check step position for round trip step 1 and call onContinueEvent', () => {
            component.selectedSlices = selectedSlicesOutboundMock;
            component.slicesSelectionLimit = 1;
            component.currentODIndex = 0;
            spyOn<any>( component, 'onContinueEvent' );
            component.onMobileContinueFlow();
            fixture.detectChanges();
            expect( component.onContinueEvent ).toHaveBeenCalled();
        } );
    });
    describe('When ribbonChangeDate is called', () => {
        it('it should go through slideSelectedSubject with the input properties', () => {
            spyOn<any>(component['slideSelectedSubject'], 'next');
            component.ribbonChangeDate( {} );
            expect(component['slideSelectedSubject'].next).toHaveBeenCalled();
            expect(component['slideSelectedSubject'].next).toHaveBeenCalledWith( {} );

        });
    });
    describe('When onUpdateBasket is called', () => {
        it( 'it should go through slideSelectedSubject with the input properties', fakeAsync( () => {
            component.selectedOffer = selectedOfferWithDiscounts;
            component[ 'onUpdateBasket' ]();
            component.availabilityDataSubject.next( outboudAvailabilityGridMock );
            flushMicrotasks();
            tick( 100 );
            expect( component.selectedOffer.discountsApplied.discounts.length ).toEqual( 1 );
        } ) );
    });
});
