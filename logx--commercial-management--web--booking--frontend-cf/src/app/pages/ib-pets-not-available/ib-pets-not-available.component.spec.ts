import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IbPetsNotAvailableComponent } from '@src/app/pages/ib-pets-not-available/ib-pets-not-available.component';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CommonsSessionStorageService, AJSRootScope } from 'ib-web-commons/utils';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { AJSMonetateUtilsService } from '@shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { RootScopeMock } from '@test-mocks/class/RootScopeMock';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { DigitalDataUtilsServiceMock } from '@test-mocks/class/DigitalDataUtilsServiceMock';
import { BookingErrorPageStore } from '@src/app/core/store/ib-booking-error-page.store';


class CommonsSessionStorageServiceMock {
    get = jasmine.createSpy('get');
}

class DatalayerUtilsServiceMock {
    setProcessAndStep = jasmine.createSpy('setProcessAndStep');
    updateDatalayerViewEvent = jasmine.createSpy('updateDatalayerViewEvent');
}

class MonetateUtilsServiceMock {
    updateMonetateInfo = jasmine.createSpy('updateMonetateInfo');
}

class DigitalDataServiceMock {
    getDigitalDataProcess = jasmine.createSpy('getDigitalDataProcess');
    emitViewEvent = jasmine.createSpy('emitViewEvent');

}

class BookingRedirectionServiceMock {
    externalRedirect = jasmine.createSpy('externalRedirect');
}

let mockDigitalDataUtilsService: DigitalDataUtilsServiceMock;


class BookingErrorPageStoreMock {
    getErrorByType = jasmine.createSpy('getErrorByType').and.returnValue(null);
}


describe('IbPetsNotAvailableComponent', () => {
    let component: IbPetsNotAvailableComponent;
    let fixture: ComponentFixture<IbPetsNotAvailableComponent>;
    let mockRootScope: RootScopeMock;
    let mockMonetateUtilsService: MonetateUtilsServiceMock;
    let mockDigitalDataService: DigitalDataServiceMock;
    let mockBookingRedirectionService: BookingRedirectionServiceMock;
    let mockCommonsSessionStorageService: CommonsSessionStorageServiceMock;
    let mockWindow: any;
    let mockBookingErrorPageStore: BookingErrorPageStoreMock;

    beforeEach(async () => {
        mockRootScope = new RootScopeMock();
        (mockRootScope as any).routes = {
            icons: '/iberia-web-content/iconos',
            images: '/test-images/'
        };

        mockMonetateUtilsService = new MonetateUtilsServiceMock();
        mockDigitalDataService = new DigitalDataServiceMock();
        mockBookingRedirectionService = new BookingRedirectionServiceMock();
        mockCommonsSessionStorageService = new CommonsSessionStorageServiceMock();
        mockDigitalDataUtilsService = new DigitalDataUtilsServiceMock();
        mockBookingErrorPageStore = new BookingErrorPageStoreMock();
        
        
        mockWindow = {
            location: {
                origin: 'https://test.iberia.com'
            }
        };

        await TestBed.configureTestingModule({
            declarations: [IbPetsNotAvailableComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: AJSRootScope, useValue: mockRootScope },
                { provide: AJSMonetateUtilsService, useValue: mockMonetateUtilsService },
                { provide: DigitalDataService, useValue: mockDigitalDataService },
                { provide: BookingRedirectionService, useValue: mockBookingRedirectionService },
                { provide: CommonsSessionStorageService, useValue: mockCommonsSessionStorageService },
                { provide: WINDOW_TOKEN, useValue: mockWindow },
                { provide: DigitalDataUtilsService, useValue: mockDigitalDataUtilsService },
                { provide: BookingErrorPageStore, useValue: mockBookingErrorPageStore }
                
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(IbPetsNotAvailableComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize component properties correctly in constructor', () => {
        expect(component.images).toBe('/test-images/');
        expect(component.backGroundImage).toBe('/background/generico/pet_error_page_default.jpg');
        expect(mockRootScope.showHeaders).toBe(false);
    });

    describe('ngOnInit', () => {
        beforeEach(() => {
            mockDigitalDataService.getDigitalDataProcess.and.returnValue('test-process');
            mockCommonsSessionStorageService.get.and.callFake((key: string) => {
                if (key === 'confirmationDigitalInfo') {
                    return {
                        Language: 'ES',
                        Market: 'ES',
                        VersionWeb: '1.0',
                        ModeWeb: 'desktop',
                        Quadrigam: 'test-quadrigam',
                        TrackingCode: 'test-tracking',
                        UserStatus: 'logged',
                        Process: 'booking',
                        Step: 'pets'
                    };
                }
                if (key === 'userLogged') {
                    return 'test-user';
                }
                return null;
            });
        });

        it('should call all required services when ngOnInit is executed', () => {
            component.ngOnInit();

            expect(mockDigitalDataService.getDigitalDataProcess).toHaveBeenCalledTimes(1);

            expect(mockCommonsSessionStorageService.get).toHaveBeenCalledWith('confirmationDigitalInfo');

            expect(mockDigitalDataUtilsService.updateDigitalDataWithQuadrigam).toHaveBeenCalledWith(
                BookingAppConstants.QUADRIGAMS.BKI_ERROR_PET_NOT_AVAILABLE,
                null
            );

            expect(mockDigitalDataUtilsService.setProcessAndStep).toHaveBeenCalledWith(
                'test-process',
                'error',
                BookingAppConstants.QUADRIGAMS.BKI_ERROR_PET_NOT_AVAILABLE
            );

            expect(mockDigitalDataService.emitViewEvent).toHaveBeenCalledTimes(1);

            expect(mockMonetateUtilsService.updateMonetateInfo).toHaveBeenCalledTimes(1);
        });

        it('should set digitalData from sessionStorage', () => {
            const mockDigitalData = {
                Language: 'ES',
                Market: 'ES',
                VersionWeb: '1.0',
                ModeWeb: 'desktop',
                Quadrigam: 'test-quadrigam',
                TrackingCode: 'test-tracking',
                UserStatus: 'logged',
                Process: 'booking',
                Step: 'pets'
            };

            mockCommonsSessionStorageService.get.and.callFake((key: string) => {
                return key === 'confirmationDigitalInfo' ? mockDigitalData : 'test-user';
            });

            component.ngOnInit();

            expect(component.digitalData).toEqual(mockDigitalData);
        });

        it('should call sessionStorage.get twice - once for confirmationDigitalInfo and once for userLogged', () => {
            component.ngOnInit();

            expect(mockCommonsSessionStorageService.get).toHaveBeenCalledTimes(1);
            expect(mockCommonsSessionStorageService.get).toHaveBeenCalledWith('confirmationDigitalInfo');
        });

        it('should call services in the correct order', () => {
            const callOrder: string[] = [];

          
            mockBookingErrorPageStore.getErrorByType.and.callFake(() => {
                callOrder.push('getErrorByType');
                return {
                    detail: { title: 'test', body: [] }
                };
            });


            mockDigitalDataService.getDigitalDataProcess.and.callFake(() => {
                callOrder.push('getDigitalDataProcess');
                return 'test-process';
            });

            mockCommonsSessionStorageService.get.and.callFake((key: string) => {
                callOrder.push(`sessionStorage.get(${key})`);
                return key === 'confirmationDigitalInfo' ? {} : 'test-user';
            });

            mockDigitalDataUtilsService.updateDigitalDataWithQuadrigam.and.callFake(() => {
                callOrder.push('updateDigitalDataWithQuadrigam');
            });

            mockDigitalDataUtilsService.setProcessAndStep.and.callFake(() => {
                callOrder.push('setProcessAndStep');
            });

            mockDigitalDataService.emitViewEvent.and.callFake(() => {
                callOrder.push('emitViewEvent');
            });

            mockMonetateUtilsService.updateMonetateInfo.and.callFake(() => {
                callOrder.push('updateMonetateInfo');
            });

            component.ngOnInit();

            expect(callOrder).toEqual([
                'getErrorByType',
                'getDigitalDataProcess',
                'sessionStorage.get(confirmationDigitalInfo)',
                'updateDigitalDataWithQuadrigam',
                'setProcessAndStep',
                'emitViewEvent',
                'updateMonetateInfo'
            ]);
        });
    });

    describe('goHomePage', () => {
        it('should call externalRedirect with window.location.origin', () => {
            const originalOrigin = window.location.origin;
            
            component.goHomePage();

            expect(mockBookingRedirectionService.externalRedirect).toHaveBeenCalledWith(originalOrigin);
        });
    });

    describe('When loadErrorContent is called', () => {

        it('should use error from store when available', () => {

            const storeError = {
                type: 'availability',
                details: {
                    title: 'Store Title',
                    body: ['Storage body']
                }
            };

            mockBookingErrorPageStore.getErrorByType.and.returnValue(storeError);
            mockCommonsSessionStorageService.get.and.returnValue(null);

            component.loadErrorContent();

            expect(component.petErrorPageTitle).toBe('Store Title');
            expect(component.petErrorPageBody).toEqual(['Storage body']);
        });

        it('should fallback to sessionStorage when store is null (refresh case)', () => {

            const storageError = {
                message: 'Fallback message',
                details: {
                    title: 'PET_ERROR_PAGE_TITLE',
                    body: ['PET_ERROR_PAGE_BODY']
                }
            };

            mockBookingErrorPageStore.getErrorByType.and.returnValue(null);
            mockCommonsSessionStorageService.get.and.callFake((key: string) => {
                if (key === 'availabilityErrror') return storageError;
                return null;
            });

            component.ngOnInit();

            expect(component.petErrorPageTitle).toBe('PET_ERROR_PAGE_TITLE');
            expect(component.petErrorPageBody).toEqual(['PET_ERROR_PAGE_BODY']);
        });
    });

});
