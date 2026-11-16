import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBookingFlightsRecapPageComponent } from './ib-booking-flights-recap.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IbBookingRecapPageService } from '@src/app/pages/ib-booking-flights-recap/services/ib-booking-recap.service';
import { IbBookingRecapPageServiceMock } from '@test-mocks/class/IbBookingRecapPageServiceMock';
import { IbBookingCurrencyUtilsServiceMock } from '@test-mocks/class/IbBookingCurrencyUtilsServiceMock';
import { IbBookingCurrencyUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-currency-utils.service';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingPageUtilsServiceMock } from 'test/mocks/class/BookingPageUtilsServiceMock';
import { TranslateServiceMock } from 'test/mocks/Services/TranslateServiceAngularMock';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { DigitalDataUtilsServiceMock } from '@test-mocks/class/DigitalDataUtilsServiceMock';
import { RootScopeMock } from 'test/mocks/class/RootScopeMock';
import { NewMainHeaderFacadeTokenMock } from 'test/mocks/class/NewMainHeaderFacadeMock';
import { BookingModalServiceMock } from 'test/mocks/Services/BookingModalServiceMock';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSMonetateUtilsService } from '@src/app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { MonetateUtilsServiceMock } from 'test/mocks/class/MonetateUtilsServiceMock';
import { CommonModule } from '@angular/common';
import { TranslatePipeMock } from 'test/mocks/pipes/TranslatePipeMock';
import { DatalayerUtilsServiceMock } from 'test/mocks/class/DatalayerUtilsServiceMock';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { SelectedTripInfoMockClass } from '@test-mocks/unit/app/pages/ib-booking-flights-recap/SelectedTripInfoMock';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

class BookingUtilServiceMock {
    getURLFirstParameterByName = jasmine.createSpy( 'getURLFirstParameterByName' );
}

let fakeCommonsSessionStorageService: StorageServiceMock;
let fakeIbBookingRecapPageService: IbBookingRecapPageServiceMock;
let fakeIbBookingCurrencyUtilsService: IbBookingCurrencyUtilsServiceMock;
let fakeBookingPageUtilsService: BookingPageUtilsServiceMock;
let fakeTranslateService: TranslateServiceMock;
let fakeDigitalDataUtilsService: DigitalDataUtilsServiceMock;
let fakeAJSRootScope: RootScopeMock;
let fakeAJSNewMainHeaderFacadeToken: NewMainHeaderFacadeTokenMock;
let fakeAJSBookingModalService: BookingModalServiceMock;
let fakeAJSMonetateUtilsService: MonetateUtilsServiceMock;
let fakeDatalayerUtilsService: DatalayerUtilsServiceMock;
let SelectedTripInfoMock = new SelectedTripInfoMockClass();
let headerModelRt = require( '@test/unit/app/shared/components/ib-booking-header/mocks/HeaderModelRT.json' );
let selectedOffer = require( '@test-mocks/storage/SelectedOffer-mock.json' );
let relatedContent = require( '@test-mocks/storage/RelatedContent-mock.json' );
let originDestination = require( '@test-mocks/storage/BookingOriginDestination-MAD-PMI-mock.json' );

let fareDataMock = require('@test-mocks/Responses/FareDataWithFamilyDiscount.json');
// add ticketing fee
fareDataMock.offers[0].price.ticketingFee = 1;
describe( 'IbBookingFlightsRecapComponent', () => {

    let component: IbBookingFlightsRecapPageComponent;
    let fixture: ComponentFixture<IbBookingFlightsRecapPageComponent>;
    let selectedSlices;
    
    beforeEach(async () => {
        selectedSlices = SelectedTripInfoMock.selectedTripInfo;
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeIbBookingRecapPageService = new IbBookingRecapPageServiceMock();
        fakeIbBookingCurrencyUtilsService = new IbBookingCurrencyUtilsServiceMock();
        fakeBookingPageUtilsService = new BookingPageUtilsServiceMock();
        fakeTranslateService = new TranslateServiceMock();
        fakeAJSRootScope = new RootScopeMock();
        fakeDigitalDataUtilsService = new DigitalDataUtilsServiceMock();
        fakeAJSNewMainHeaderFacadeToken = new NewMainHeaderFacadeTokenMock();
        fakeAJSBookingModalService = new BookingModalServiceMock();
        fakeAJSMonetateUtilsService = new MonetateUtilsServiceMock();
        fakeDatalayerUtilsService = new DatalayerUtilsServiceMock();
        TestBed.configureTestingModule({
            declarations: [IbBookingFlightsRecapPageComponent, TranslatePipeMock],
            imports: [
                CommonModule
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: IbBookingCurrencyUtilsService, useValue: fakeIbBookingCurrencyUtilsService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: BookingPageUtilsService, useValue: fakeBookingPageUtilsService },
                { provide: DigitalDataUtilsService, useValue: fakeDigitalDataUtilsService },
                { provide: AJSRootScope, useValue: fakeAJSRootScope },
                { provide: IbBookingHeaderFacadeService, useValue: fakeAJSNewMainHeaderFacadeToken },
                { provide: AJSBookingModalService, useValue: fakeAJSBookingModalService },
                { provide: AJSMonetateUtilsService, useValue: fakeAJSMonetateUtilsService },
                {provide : AJSDatalayerUtilsService, useValue: fakeDatalayerUtilsService},
                { provide: AJSBookingUtilsService, useClass: BookingUtilServiceMock }
            ]
        }).overrideComponent(
            IbBookingFlightsRecapPageComponent,
            {
                set: {
                    providers: [
                        { provide: IbBookingRecapPageService, useValue: fakeIbBookingRecapPageService }
                    ]
                }
            }
        ).compileComponents();
        fixture = TestBed.createComponent( IbBookingFlightsRecapPageComponent );
        component = fixture.componentInstance;
        fakeCommonsSessionStorageService.set( BkiStorageConstants.SELECTED_OFFER, selectedOffer);
        fakeCommonsSessionStorageService.set( BkiStorageConstants.SELECTED_TRIP_INFO, selectedSlices);
        fakeCommonsSessionStorageService.set( BkiStorageConstants.HEADER_MODEL, headerModelRt);
        fakeCommonsSessionStorageService.set( BkiStorageConstants.AVAILABILITY_RELATED_CONTENT, relatedContent);
        fakeCommonsSessionStorageService.set( BkiStorageConstants.ORIGIN_DESTINATIONS, originDestination);
        fakeCommonsSessionStorageService.set( BkiStorageConstants.FARE, fareDataMock);
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('Test onResizeAction ', () => {
        it( 'check onresize conditios', () => {
            component.onResizeAction();
            expect( fakeAJSNewMainHeaderFacadeToken.checkAdaptativeMobileFlow ).toHaveBeenCalled();
        } ) ;
    });
    describe('Test onContinueFlow  ', () => {
        it( 'check functions calls', () => {
            component.onContinueFlow();
            expect( fakeAJSBookingModalService.showWaitingModal ).toHaveBeenCalled();
            expect( fakeIbBookingRecapPageService.redirectToNextStep ).toHaveBeenCalled();
        } );
    });
});
