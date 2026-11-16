import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { IbBookingErrorPageRoutingModule } from '@src/app/core/routing/modules/ib-bk-error-routing.module';
import { IbBookingBkiErrorUpgradedComponent } from '@src/app/pages/ib-booking-bk-error/component/ib-booking-bk-error.component';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { IbBookingBkErrorAnalyticsService } from '@src/app/pages/ib-booking-bk-error/services/ib-booking-bk-error-analytic.service';
import { RootStore } from '@src/app/core/store/ib-booking-root.store';
import { BookingErrorPageStore, ErrorType } from '@src/app/core/store/ib-booking-error-page.store';
import { IbBackgroundComponent } from '@shared/components/ib-background/ib-background.component';


class BookingRedirectionServiceMock {
    externalRedirect = jasmine.createSpy('externalRedirect');
}

class RootStoreMock {
    private storage = new Map<string, any>();
    
    get = jasmine.createSpy('get').and.callFake((key: string) => {
        return this.storage.get(key);
    });
    
    set = jasmine.createSpy('set').and.callFake((key: string, value: any) => {
        this.storage.set(key, value);
    });
    
    obtainFlow = jasmine.createSpy('obtainFlow');
    // Helper method for tests
    setTestData (key: string, value: any) {
        this.storage.set(key, value);
    }
}

class IbBookingBkErrorAnalyticsServiceMock {
    sendAnalyticsFromStorage = jasmine.createSpy('sendAnalyticsFromStorage');
}

class IbCLinkPipeMock {
    transform = jasmine.createSpy('transform').and.returnValue('mock-link');
}

class BookingErrorPageStoreMock {
    private availabilityError: any = null;
    
    getErrorByType = jasmine.createSpy('getErrorByType').and.callFake((type: ErrorType) => {
        if (type === ErrorType.AVAILABILITY) {
            return this.availabilityError;
        }
        return null;
    });
    
    // Helper method for tests
    setAvailabilityError (error: any) {
        this.availabilityError = error;
    }
}

class BookingPageUtilsServiceMock {
    setPageTitle = jasmine.createSpy('setPageTitle');
}

describe('IbBookingBkiErrorUpgradedComponent', () => {
    let component: IbBookingBkiErrorUpgradedComponent;
    let fixture: ComponentFixture<IbBookingBkiErrorUpgradedComponent>;
    let rootStore: RootStoreMock;
    let bookingRedirectionService: BookingRedirectionServiceMock;
    let bookingPageUtilsService: BookingPageUtilsServiceMock;
    let analyticService: IbBookingBkErrorAnalyticsServiceMock;
    let ibCLinkPipe: IbCLinkPipeMock;
    let storageServiceMock: StorageServiceMock;
    let bookingErrorPageStore: BookingErrorPageStoreMock;

    // Helper functions to reduce code duplication
    const setDefaultAvailabilityError = () => {
        bookingErrorPageStore.setAvailabilityError({
            internalErrorCode: '',
            errorCode: '',
            requestURL: '',
            message: ''
        });
    };

    const setDefaultRootStoreData = () => {
        rootStore.setTestData('routes', { images: 'http://test.com/images/' });
        rootStore.setTestData('backGroundImage', 'test-bg.jpg');
        rootStore.setTestData('phonesList', {
            RESERVAS: {
                prefix: '+34',
                telephone: '901111213',
                text: 'Reservas'
            }
        });
        rootStore.setTestData('isRedemptionFlow', false);
        rootStore.setTestData('isShuttleFlow', false);
    };

    const resetAllSpies = () => {
        bookingRedirectionService.externalRedirect.calls.reset();
        bookingPageUtilsService.setPageTitle.calls.reset();
    };

    const setupStorageMockDefaults = () => {
        storageServiceMock.clear();
        if (bookingErrorPageStore) {
            setDefaultAvailabilityError();
        }
    };

    const setAvailabilityError = (internalErrorCode: string, errorCode: string, message: string) => ({
        internalErrorCode,
        errorCode,
        requestURL: '/api/test',
        message
    });

    beforeEach(async () => {
        // Create storage service mock instance
        storageServiceMock = new StorageServiceMock();

        await TestBed.configureTestingModule({
            declarations: [
                IbBookingBkiErrorUpgradedComponent
            ],
            imports: [
                CommonModule,
                TranslateModule.forRoot(),
                IbBookingErrorPageRoutingModule,
                IbBackgroundComponent
            ],
            providers: [
                { provide: CommonsSessionStorageService, useValue: storageServiceMock },
                { provide: BookingRedirectionService, useClass: BookingRedirectionServiceMock },
                { provide: BookingPageUtilsService, useClass: BookingPageUtilsServiceMock },
                { provide: IbBookingBkErrorAnalyticsService, useClass: IbBookingBkErrorAnalyticsServiceMock },
                { provide: RootStore, useClass: RootStoreMock },
                { provide: BookingErrorPageStore, useClass: BookingErrorPageStoreMock },
                { provide: IbCLinkPipe, useClass: IbCLinkPipeMock }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();

        // Get service instances
        rootStore = TestBed.inject(RootStore) as any;
        bookingRedirectionService = TestBed.inject(BookingRedirectionService) as any;
        bookingPageUtilsService = TestBed.inject(BookingPageUtilsService) as any;
        analyticService = TestBed.inject(IbBookingBkErrorAnalyticsService) as any;
        ibCLinkPipe = TestBed.inject(IbCLinkPipe) as any;
        bookingErrorPageStore = TestBed.inject(BookingErrorPageStore) as any;

        // Setup default test data
        setDefaultRootStoreData();
        setDefaultAvailabilityError();
        
        fixture = TestBed.createComponent(IbBookingBkiErrorUpgradedComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {

        it('should set imageUrl correctly from rootStore', () => {
            const routes = { images: 'http://test.com/images/' };
            const backGroundImage = 'test-bg.jpg';
            rootStore.setTestData('routes', routes);
            rootStore.setTestData('backGroundImage', backGroundImage);

            fixture.detectChanges();

            expect(component.imageUrl).toBe('http://test.com/images/test-bg.jpg');
        });

        it('should set showHeaders to false', () => {
            fixture.detectChanges();

            expect(rootStore.set).toHaveBeenCalledWith('showHeaders', false);
        });

        it('should call setPageTitle with correct title', () => {
            fixture.detectChanges();

            expect(bookingPageUtilsService.setPageTitle).toHaveBeenCalled();
        });
    });

    describe('initializeComponent', () => {
        beforeEach(() => {
            setupStorageMockDefaults();
            rootStore.setTestData('isRedemptionFlow', false);
            rootStore.setTestData('isShuttleFlow', false);
        });

        it('should handle stopover disposition error correctly', () => {
            storageServiceMock.set('isHMAD', true);
            bookingErrorPageStore.setAvailabilityError(setAvailabilityError('SSE_AVM_OTHER', 'ERR_001', 'Test error message'));
            storageServiceMock.set('multiCitySearch', null);

            fixture.detectChanges();

            expect(component.isStopOver).toBe(true);
            expect(component.stopoverDispoError).toBe(true);
            expect(component.stopoverNoFeeError).toBe(false);
            expect(component.availError).toBe(false);
        });

        it('should handle stopover no fee error correctly', () => {
            storageServiceMock.set('isHMAD', true);
            bookingErrorPageStore.setAvailabilityError(setAvailabilityError('SSE_AVM_12001', 'ERR_002', 'No fee error message'));
            storageServiceMock.set('multiCitySearch', null);

            fixture.detectChanges();

            expect(component.isStopOver).toBe(true);
            expect(component.stopoverNoFeeError).toBe(true);
            expect(component.stopoverDispoError).toBe(false);
            expect(component.availError).toBe(false);
        });

        it('should handle availability error for non-stopover flows', () => {
            storageServiceMock.set('isHMAD', false);
            bookingErrorPageStore.setAvailabilityError(setAvailabilityError('AVL_001', 'ERR_003', 'Error message'));
            storageServiceMock.set('multiCitySearch', null);

            fixture.detectChanges();

            expect(component.isStopOver).toBe(false);
            expect(component.availError).toBe(true);
        });

        it('should send analytics from storage', () => {
            fixture.detectChanges();

            expect(analyticService.sendAnalyticsFromStorage).toHaveBeenCalled();
        });

    });

    describe('getPageTitle', () => {
        beforeEach(() => {
            setupStorageMockDefaults();
            bookingPageUtilsService.setPageTitle.calls.reset();
        });

        it('should return HMAD title when isHMAD is true', () => {
            storageServiceMock.set('isHMAD', true);

            fixture.detectChanges();

            expect(bookingPageUtilsService.setPageTitle).toHaveBeenCalledWith('BKI_HM_ERROR_TITLE');
        });

        it('should return multi-city title when multiCitySearch is true', () => {
            storageServiceMock.set('isHMAD', false);
            storageServiceMock.set('multiCitySearch', true);

            fixture.detectChanges();

            expect(bookingPageUtilsService.setPageTitle).toHaveBeenCalledWith('BKI_MT_ERROR_TITLE');
        });

        it('should return default title when neither HMAD nor multi-city', () => {
            storageServiceMock.set('isHMAD', false);
            storageServiceMock.set('multiCitySearch', false);

            fixture.detectChanges();

            expect(bookingPageUtilsService.setPageTitle).toHaveBeenCalledWith('BKI_ERROR_TITLE');
        });
    });

    describe('setupFooterModel', () => {

        it('should setup footer model with phone information', () => {

            fixture.detectChanges();

            expect(component.footerModel).toEqual({
                phoneInfo: {
                    prefix: '+34',
                    phoneNumber: '901111213',
                    text: 'Reservas'
                }
            });
        });
    });

    describe('returnHomePage', () => {
        beforeEach(() => {
            setupStorageMockDefaults();
            resetAllSpies();
        });

        it('should redirect to shuttle search when isShuttleFlow is true', () => {
            rootStore.setTestData('isShuttleFlow', true);
            ibCLinkPipe.transform.and.returnValue('http://test.com/shuttle');

            component.returnHomePage();

            expect(ibCLinkPipe.transform).toHaveBeenCalledWith('SHUTTLE_CHANGE_SEARCH_LINK');
            expect(bookingRedirectionService.externalRedirect).toHaveBeenCalledWith('http://test.com/shuttle');
        });

        it('should redirect to backToUrl when available and not redemption flow', () => {
            storageServiceMock.set('bookingUrlParams', { backToUrl: '/back-to-url' });
            rootStore.setTestData('isShuttleFlow', false);
            rootStore.setTestData('isRedemptionFlow', false);

            component.returnHomePage();

            // Verify that externalRedirect was called with a URL that ends with the backToUrl
            expect(bookingRedirectionService.externalRedirect).toHaveBeenCalled();
            const callArgs = bookingRedirectionService.externalRedirect.calls.mostRecent().args[0];
            expect(callArgs).toContain('/back-to-url');
        });

        it('should redirect to origin when no backToUrl and not redemption flow', () => {
            rootStore.setTestData('isShuttleFlow', false);
            rootStore.setTestData('isRedemptionFlow', false);

            component.returnHomePage();

            expect(bookingRedirectionService.externalRedirect).toHaveBeenCalled();
            const callArgs = bookingRedirectionService.externalRedirect.calls.mostRecent().args[0];
            expect(typeof callArgs).toBe('string');
        });

        it('should call goRedemptionSearchEnginePage when isRedemptionFlow is true', () => {
            const goRedemptionSpy = spyOn(component as any, 'goRedemptionSearchEnginePage');
            rootStore.setTestData('isShuttleFlow', false);
            rootStore.setTestData('isRedemptionFlow', true);

            component.returnHomePage();

            expect(goRedemptionSpy).toHaveBeenCalled();
        });
    });

    describe('goRedemptionSearchEnginePage', () => {

        it('should redirect to redemption search engine', () => {
            ibCLinkPipe.transform.and.returnValue('http://test.com/redemption');

            (component as any).goRedemptionSearchEnginePage();

            expect(ibCLinkPipe.transform).toHaveBeenCalledWith('IBERIA_NEW_REDEMPTION_SEARCH_ENGINE');
            expect(bookingRedirectionService.externalRedirect).toHaveBeenCalledWith('http://test.com/redemption');
        });
    });
});
