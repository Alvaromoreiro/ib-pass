import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBookingSharedModule } from '@shared/ib-booking-shared.module';
import { IbBookingHeaderComponent } from '@shared/components/ib-booking-header/ib-booking-header.component';
import { IbBookingHeaderBasketModule } from '@shared/components/ib-booking-header/components/ib-booking-header-basket/ib-booking-header-basket.module';
import { IbCPipeModule } from 'ib-web-commons/pipes';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { CurrencyServiceMock } from 'test/mocks/Services/CurrencyServiceMocks';
import { AJSBookingModalService } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

describe('IbBookingHeaderComponent Test', () => {
    let component: IbBookingHeaderComponent;
    let fixture: ComponentFixture<IbBookingHeaderComponent>;
    let fakeBookingModalService: BookingModalServiceMock;

    
    class RootScopeMock {
        newFare = false;
        showHeaders = false;
        isMobile = {
            general: true
        };
        public $on = ( eventName: string, callback: () => unknown ) => { };
    }
    class FakeWindow {
        constructor (private distinctive: string = '') {
        }
        public innerWidth = 0;
        public dispatchEvent (event: Event) {
            window.dispatchEvent(new Event(`mock${this.distinctive}-${event.type}`));
        }
        public removeEventListener (evName: string = '', callback: (event: Event) => void) {
            window.removeEventListener(`mock${this.distinctive}-${evName}`, callback);
        }
        public addEventListener (evName: string = '', callback: (event: Event) => void) {
            window.addEventListener(`mock${this.distinctive}-${evName}`, callback);
        }
        public document = window.document;
    }
    class NewMainHeaderFacadeTokenMock {
        initHeader = jasmine.createSpy('initHeader').and.callFake(() => {});
        finishWaiting = jasmine.createSpy( 'finishWaiting' );
        updateTripsBasketFromDispo = jasmine.createSpy( 'updateTripsBasketFromDispo' );
        deleteDiscountFromBasket = jasmine.createSpy( 'deleteDiscountFromBasket' );
        deleteTripsBasketFromDispo = jasmine.createSpy( 'deleteTripsBasketFromDispo' );
        updateBasketDiscountsNew = jasmine.createSpy('updateBasketDiscountsNew');
        updateStepDescription = jasmine.createSpy('updateStepDescription');
        updateStepsModel = jasmine.createSpy( 'updateStepsModel' );
        setAPIFunctions= jasmine.createSpy( 'setAPIFunctions' );
        checkAdaptativeMobileFlow = jasmine.createSpy( 'checkAdaptativeMobileFlow' ).and.callFake( () => false );
    }
    let fakeWindow: FakeWindow;
    let fakeAJSCurrencyService: CurrencyServiceMock;
    let fakeAJSNewMainHeaderFacadeToken: NewMainHeaderFacadeTokenMock;
    let fakeTranslateService, rootScope, fakeSessionStorage;
    class BookingModalServiceMock {
        showWaitingModal = jasmine.createSpy('showWaitingModal');
        showGenericModal = jasmine.createSpy('showGenericModal').and.returnValue({result:Promise.resolve()});
        showGenericError = jasmine.createSpy('showGenericError').and.returnValue({ result: Promise.resolve() });
        showFaresModal = jasmine.createSpy('showFaresModal').and.returnValue({ result: Promise.resolve() });
        finishWaiting = jasmine.createSpy('finishWaiting');
        showBKISliceTimeLeftModal = jasmine.createSpy('showBKISliceTimeLeftModal').and.returnValue({ result: Promise.resolve() });
    }
    class TranslateServiceMock {
        public instant = jasmine.createSpy( 'instant' ).and.callFake( () => '' );
        get = jasmine.createSpy('get');
    }
    beforeEach(async () => {
        fakeAJSCurrencyService = new CurrencyServiceMock();
        fakeAJSNewMainHeaderFacadeToken = new NewMainHeaderFacadeTokenMock();
        fakeTranslateService = new TranslateServiceMock();
        fakeSessionStorage = new StorageServiceMock();
        fakeBookingModalService = new BookingModalServiceMock();
        fakeWindow = new FakeWindow();
        rootScope = new RootScopeMock();
        await TestBed.configureTestingModule({
            declarations: [ 
                IbBookingHeaderComponent            
            ],
            imports: [
                TranslateModule,
                FormsModule,
                CommonModule,
                IbBookingSharedModule,
                IbCPipeModule,
                IbBookingHeaderBasketModule
            ],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: AJSRootScope, useValue: rootScope },
                { provide: WINDOW_TOKEN, useValue: fakeWindow},
                { provide: AJSCurrencyService, useValue: fakeAJSCurrencyService },
                { provide: IbBookingHeaderFacadeService, useValue: fakeAJSNewMainHeaderFacadeToken },
                { provide: AJSBookingModalService, useValue: fakeBookingModalService },
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbBookingHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should check if it is HMAD flow', () => {
        fakeSessionStorage.set('isHMAD', false);
        fakeSessionStorage.set('bookingUrlParams', false);
        expect(component.checkIsHMad()).toBeFalsy();

        fakeSessionStorage.set('isHMAD', false);
        fakeSessionStorage.set('bookingUrlParams', {
            searchOrigin: ''
        });
        expect(component.checkIsHMad()).toBeFalsy();

        fakeSessionStorage.set('isHMAD', false);
        fakeSessionStorage.set('bookingUrlParams', {
            searchOrigin: 'NOTHM'
        });
        expect(component.checkIsHMad()).toBeFalsy();
    
        fakeSessionStorage.set('isHMAD', true);
        fakeSessionStorage.set('bookingUrlParams', {
            searchOrigin: 'NOTHM'
        });
        expect(component.checkIsHMad()).toBeTruthy();
    
        fakeSessionStorage.set('isHMAD', false);
        fakeSessionStorage.set('bookingUrlParams', {
            searchOrigin: 'HMYES'
        });
        expect(component.checkIsHMad()).toBeTruthy();
    
        fakeSessionStorage.set('isHMAD', true);
        fakeSessionStorage.set('bookingUrlParams', {
            searchOrigin: 'HMYES'
        });
        expect(component.checkIsHMad()).toBeTruthy();
    });

});
