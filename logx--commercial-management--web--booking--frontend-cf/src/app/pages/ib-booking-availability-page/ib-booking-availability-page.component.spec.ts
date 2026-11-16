import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { AvailabilityTypes } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';
import { IbBookingAvailabilityPageComponent } from '@src/app/pages/ib-booking-availability-page/ib-booking-availability-page.component';
import { BookingPageUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-page-utils.service';
import { AJSIbBookingAvailabilityPageService } from '@src/app/pages/ib-booking-availability-page/services/ib-booking-availability-page-utils-bridge.service';
import { AJSDatalayerUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { BookingCommercialSellingDataUtilsService } from '@src/app/shared/services/ib-booking-availability/ib-booking-commercial-selling-data-utils.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { RootScopeMock } from '@test-mocks/class/RootScopeMock';
import { BookingPageUtilsServiceMock } from '@test-mocks/class/BookingPageUtilsServiceMock';
import { BookingRedirectionServiceMock } from '@test-mocks/class/BookingRedirectionServiceMock';
import { DatalayerUtilsServiceMock as BaseDatalayerUtilsServiceMock } from '@test-mocks/class/DatalayerUtilsServiceMock';
import { BookingModalServiceMock } from '@test-mocks/Services/BookingModalServiceMock';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';

class BookingAvailabilityPageUtilsServiceMock {
    public initLocalStorage = jasmine.createSpy('initLocalStorage');
    public initializeLang = jasmine.createSpy('initializeLang').and.returnValue('es');
    public initializeMarket = jasmine.createSpy('initializeMarket').and.returnValue('ES');
    public checkLoadLegacy = jasmine.createSpy('checkLoadLegacy').and.returnValue(true);
    public initBookingFlow = jasmine.createSpy('initBookingFlow').and.returnValue(Promise.resolve());
}

class DatalayerUtilsServiceMock extends BaseDatalayerUtilsServiceMock {
    public removeDatalayerObjects = jasmine.createSpy('removeDatalayerObjects');
    public removeDigitalDataObjects = jasmine.createSpy('removeDigitalDataObjects');
    public setDatalayerAvailabilityInitialParams = jasmine.createSpy('setDatalayerAvailabilityInitialParams');
}

class BookingCommercialSellingDataUtilsServiceMock {
    public getCommercialAvailbilityType = jasmine.createSpy('getCommercialAvailbilityType').and.returnValue(AvailabilityTypes.SLICE_BY_SLICE);
}


// @ts-ignore test-only private member access
interface IbBookingAvailabilityPageComponentTest extends IbBookingAvailabilityPageComponent {
    $rootScope: RootScopeMock;
    IbBookingAvailabilityPageUtilsService: BookingAvailabilityPageUtilsServiceMock;
    DatalayerUtilsService: DatalayerUtilsServiceMock;
    BookingModalService: BookingModalServiceMock;
    CommonsSessionStorageService: StorageServiceMock;
    BookingPageUtilsService: BookingPageUtilsServiceMock;
    BookingCommercialSellingDataUtilsService: BookingCommercialSellingDataUtilsServiceMock;
    BookingRedirectionService: BookingRedirectionServiceMock;
}

describe('IbBookingAvailabilityPageComponent', () => {
    let fixture: ComponentFixture<IbBookingAvailabilityPageComponent>;
    let component: IbBookingAvailabilityPageComponentTest;

    const createComponentAndInit = () => {
        fixture = TestBed.createComponent(IbBookingAvailabilityPageComponent);
        component = fixture.componentInstance as unknown as IbBookingAvailabilityPageComponentTest;
        fixture.detectChanges();
    };

    const createComponentWithoutInit = () => {
        fixture = TestBed.createComponent(IbBookingAvailabilityPageComponent);
        component = fixture.componentInstance as unknown as IbBookingAvailabilityPageComponentTest;
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingAvailabilityPageComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: AJSRootScope, useClass: RootScopeMock },
                { provide: AJSIbBookingAvailabilityPageService, useClass: BookingAvailabilityPageUtilsServiceMock },
                { provide: AJSDatalayerUtilsService, useClass: DatalayerUtilsServiceMock },
                { provide: AJSBookingModalService, useClass: BookingModalServiceMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: BookingPageUtilsService, useClass: BookingPageUtilsServiceMock },
                { provide: BookingCommercialSellingDataUtilsService, useClass: BookingCommercialSellingDataUtilsServiceMock },
                { provide: BookingRedirectionService, useClass: BookingRedirectionServiceMock }
            ]
        }).overrideComponent(IbBookingAvailabilityPageComponent, {
            set: { template: '' }
        }).compileComponents();

        const storage = TestBed.inject(CommonsSessionStorageService) as unknown as StorageServiceMock;
        storage.set(BkiStorageConstants.CONFIRM_DATALAYER_INFO, { keyA: 'valueA', keyB: 'valueB' });
        storage.set(BkiStorageConstants.CONFIRM_DIGITALDATA_INFO, { keyC: 'valueC' });
    });

    it('should create', fakeAsync(() => {
        createComponentAndInit();
        expect(component).toBeTruthy();
    }));

    it('should initialize page and load REGULAR component when legacy flow is enabled', fakeAsync(() => {
        createComponentWithoutInit();
        component.IbBookingAvailabilityPageUtilsService.checkLoadLegacy.and.returnValue(true);

        fixture.detectChanges();
        flushMicrotasks();

        expect(component.BookingPageUtilsService.setPageTitle).toHaveBeenCalledWith('BKI_TITLE_PAGE_AVAILABILITY');
        expect(component.IbBookingAvailabilityPageUtilsService.initLocalStorage).toHaveBeenCalled();
        expect((component.$rootScope as unknown as { isAvailability: boolean }).isAvailability).toBeTrue();
        expect(component.DatalayerUtilsService.removeDatalayerObjects).toHaveBeenCalledWith(['keyA', 'keyB']);
        expect(component.DatalayerUtilsService.removeDigitalDataObjects).toHaveBeenCalledWith(['keyC']);
        expect(component.DatalayerUtilsService.setDatalayerAvailabilityInitialParams).toHaveBeenCalledWith('es', 'ES', 'device');
        expect(component.componentType).toBe(AvailabilityTypes.REGULAR);
        expect(component.CommonsSessionStorageService.get(BkiStorageConstants.AVAILABILITY_TYPE)).toBe(AvailabilityTypes.REGULAR);
    }));

    describe('when non-legacy flow is enabled', () => {
        const baseNonLegacyParams = {
            checkLoadLegacy: false
        };

        const cases: Array<{
            title: string;
            forcedType: AvailabilityTypes | null;
            commercialType: AvailabilityTypes | null;
            expectedType: AvailabilityTypes;
        }> = [
            {
                title: 'should prioritize forced type from session storage',
                forcedType: AvailabilityTypes.REGULAR,
                commercialType: AvailabilityTypes.SLICE_BY_SLICE,
                expectedType: AvailabilityTypes.REGULAR
            },
            {
                title: 'should fallback to commercial type when forced type is absent',
                forcedType: null,
                commercialType: AvailabilityTypes.REGULAR,
                expectedType: AvailabilityTypes.REGULAR
            },
            {
                title: 'should fallback to slice by slice when no type source is available',
                forcedType: null,
                commercialType: null,
                expectedType: AvailabilityTypes.SLICE_BY_SLICE
            }
        ];

        cases.forEach((testCase) => {
            it(testCase.title, fakeAsync(() => {
                createComponentWithoutInit();
                component.IbBookingAvailabilityPageUtilsService.checkLoadLegacy.and.returnValue(baseNonLegacyParams.checkLoadLegacy);
                component.CommonsSessionStorageService.set('availabilityTypeForced', testCase.forcedType);
                component.BookingCommercialSellingDataUtilsService.getCommercialAvailbilityType.and.returnValue(testCase.commercialType);

                fixture.detectChanges();
                flushMicrotasks();

                expect(component.componentType).toBe(testCase.expectedType);
                expect(component.CommonsSessionStorageService.get(BkiStorageConstants.AVAILABILITY_TYPE)).toBe(testCase.expectedType);
            }));
        });
    });

    it('should redirect to error page when booking flow initialization fails', fakeAsync(() => {
        createComponentWithoutInit();
        component.IbBookingAvailabilityPageUtilsService.initBookingFlow.and.returnValue(Promise.reject(new Error('init error')));

        fixture.detectChanges();
        flushMicrotasks();

        expect(component.BookingRedirectionService.path).toHaveBeenCalledWith('/ibbkerror');
    }));

    it('should show waiting modal and update component type when redirectToViewType is called', fakeAsync(() => {
        createComponentAndInit();

        component.redirectToViewType(AvailabilityTypes.SLICE_BY_SLICE);

        expect(component.BookingModalService.showWaitingModal).toHaveBeenCalledWith(
            'ib-modal-loading-plane',
            'ib-modals ib-modals--transparent ib-modals--loading-page',
            true
        );
        expect(component.componentType).toBe(AvailabilityTypes.SLICE_BY_SLICE);
    }));
});
