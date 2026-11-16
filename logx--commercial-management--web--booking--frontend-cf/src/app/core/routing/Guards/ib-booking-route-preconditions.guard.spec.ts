import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';
import { BookingRoutePreconditions } from './ib-booking-route-preconditions.guard';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { BookingUserActivityService } from '@core/services/ib-booking-user-activity.service';
import { BookingUserActivityServiceMock } from '@test-mocks/Services/BookingUserActivityServiceMock';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';

class TestBench {
    public Guard: CanActivateFn;
    public CommonsSessionStorageService: CommonsSessionStorageService;
    public BookingUserActivityService: BookingUserActivityService;
    public DigitalDataUtilsService: DigitalDataUtilsService;
    constructor () {
        this.CommonsSessionStorageService =  new StorageServiceMock() as any;
        this.BookingUserActivityService =  new BookingUserActivityServiceMock() as any;
        this.DigitalDataUtilsService = jasmine.createSpyObj('DigitalDataUtilsService', ['updatePreviousPageQuadrigam']);
        this.Guard = (route: ActivatedRouteSnapshot)=> TestBed.runInInjectionContext(() => BookingRoutePreconditions(route, null));
        TestBed.configureTestingModule({
            providers: [
                { provide: CommonsSessionStorageService, useValue: this.CommonsSessionStorageService },
                { provide: BookingUserActivityService, useValue: this.BookingUserActivityService},
                { provide: IbBookingHeaderFacadeService, useValue: {setHeaderType: jasmine.createSpy('setHeaderType')} }, // Mocking the facade
                { provide: DigitalDataUtilsService, useValue: this.DigitalDataUtilsService }
            ]
        });
    }

}
describe('Test BookingRoutePreconditions', () => {
    let guard, fakeSessionStorage, fakeBookingUserActivityService, fakeDigitalDataUtilsService;
    // Instanciate guard and module just once
    beforeEach(() => {
        const test = new TestBench();
        guard = test.Guard;
        fakeSessionStorage = test.CommonsSessionStorageService;
        fakeBookingUserActivityService = test.BookingUserActivityService;
        fakeDigitalDataUtilsService = test.DigitalDataUtilsService;
        BookingAppConstants.FLOW_STEPS_INFO = {
            'routeA': { allowedSteps: ['step1'] }
        } as any;
    });

    describe('User enters on routeA at first entry', ()=> {
        it('should allow next step', () => {
            guard({ routeConfig: { path: 'routeA' } } as ActivatedRouteSnapshot);
            expect(fakeBookingUserActivityService.initActivityListener).toHaveBeenCalled();
            expect(fakeSessionStorage.get(BkiStorageConstants.ACTUAL_STEP_FLOW)).toBe('routeA');
            expect(fakeSessionStorage.get(BkiStorageConstants.PREVIOUS_STEP_FLOW)).toBeNull();
            expect(fakeSessionStorage.get(BkiStorageConstants.FORBIDDEN_NEXT_STEP)).toBeNull();
        });
    });
    describe('User enters on routeA at first after visiting step1', ()=> {
        it('should allow next step', () => {
            fakeSessionStorage.set(BkiStorageConstants.ACTUAL_STEP_FLOW, 'step1');
            guard({ routeConfig: { path: 'routeA' } } as ActivatedRouteSnapshot);
            expect(fakeSessionStorage.get(BkiStorageConstants.ACTUAL_STEP_FLOW)).toBe('routeA');
            expect(fakeSessionStorage.get(BkiStorageConstants.PREVIOUS_STEP_FLOW)).toBe('step1');
            expect(fakeSessionStorage.get(BkiStorageConstants.FORBIDDEN_NEXT_STEP)).toBeNull();
        });
    });
    describe('User enters on routeA at first after visiting step3', ()=> {
        it('should mark this transition as forbidden', () => {
            fakeSessionStorage.set(BkiStorageConstants.ACTUAL_STEP_FLOW, 'step3');
            guard({ routeConfig: { path: 'routeA' } } as ActivatedRouteSnapshot);
            expect(fakeSessionStorage.get(BkiStorageConstants.ACTUAL_STEP_FLOW)).toBe('routeA');
            expect(fakeSessionStorage.get(BkiStorageConstants.PREVIOUS_STEP_FLOW)).toBe('step3');
            expect(fakeSessionStorage.get(BkiStorageConstants.FORBIDDEN_NEXT_STEP)).toBeTrue();
        });
    });
    describe('User enters on routeB at first after visiting step1', ()=> {
        it('should mark transition as valid due to lack of config on constants', () => {
            fakeSessionStorage.set(BkiStorageConstants.ACTUAL_STEP_FLOW, 'step1');
            guard({ routeConfig: { path: 'routeB' } } as ActivatedRouteSnapshot);
            expect(fakeSessionStorage.get(BkiStorageConstants.ACTUAL_STEP_FLOW)).toBe('routeB');
            expect(fakeSessionStorage.get(BkiStorageConstants.PREVIOUS_STEP_FLOW)).toBe('step1');
            expect(fakeSessionStorage.get(BkiStorageConstants.FORBIDDEN_NEXT_STEP)).toBeNull();
        });
    });
    describe('User enters on page exempt from updating actualStep', ()=> {
        it('should not update actualStepFlow', () => {
            fakeSessionStorage.set(BkiStorageConstants.ACTUAL_STEP_FLOW, 'actual');
            fakeSessionStorage.set(BkiStorageConstants.PREVIOUS_STEP_FLOW, 'previous');
            guard({ routeConfig: { path: 'ibpurc' } } as ActivatedRouteSnapshot);
            expect(fakeBookingUserActivityService.stopActivityListener).toHaveBeenCalled();
            expect(fakeBookingUserActivityService.initActivityListener).not.toHaveBeenCalled();
            expect(fakeSessionStorage.get(BkiStorageConstants.ACTUAL_STEP_FLOW)).toBe('actual');
            expect(fakeSessionStorage.get(BkiStorageConstants.PREVIOUS_STEP_FLOW)).toBe('previous');
        });
    });

    describe('User enters on route that keeps activity listening enabled', ()=> {
        it('should initialize activity listener', () => {
            guard({ routeConfig: { path: 'routeA' } } as ActivatedRouteSnapshot);
            expect(fakeBookingUserActivityService.initActivityListener).toHaveBeenCalled();
            expect(fakeBookingUserActivityService.stopActivityListener).not.toHaveBeenCalled();
        });
    });
    describe('Test orderTimerUpdate - KeepAlive', ()=> {
        it('should update', () => {
            guard({ routeConfig: { path: 'ibpurc' } } as ActivatedRouteSnapshot);
            expect(fakeBookingUserActivityService.setOrderTimeoutTimer).toHaveBeenCalled();
            expect(fakeBookingUserActivityService.stopOrderTimeoutTimer).not.toHaveBeenCalled();
        });
        it('should not update', () => {
            guard({ routeConfig: { path: 'ibbkerror' } } as ActivatedRouteSnapshot);
            expect(fakeBookingUserActivityService.setOrderTimeoutTimer).not.toHaveBeenCalled();
            expect(fakeBookingUserActivityService.stopOrderTimeoutTimer).toHaveBeenCalled();
        });
    });
    describe('User enters on page that applies to terminate workers', ()=> {
        it('should terminate workers', () => {
            guard({ routeConfig: { path: 'ibbkerror' } } as ActivatedRouteSnapshot);
            expect(fakeBookingUserActivityService.terminateWorker
            ).toHaveBeenCalled();
        });
        it('should not call terminate workers', () => {
            guard({ routeConfig: { path: 'ibpurc' } } as ActivatedRouteSnapshot);
            expect(fakeBookingUserActivityService.terminateWorker).not.toHaveBeenCalled();
        });
    });

    describe('Test updatePreviousQuadrigam', ()=> {
        it('should call updatePreviousPageQuadrigam when navigating from different route', () => {
            fakeSessionStorage.set(BkiStorageConstants.ACTUAL_STEP_FLOW, 'step1');
            guard({ routeConfig: { path: 'routeA' } } as ActivatedRouteSnapshot);
            expect(fakeDigitalDataUtilsService.updatePreviousPageQuadrigam).toHaveBeenCalled();
        });
        it('should not call updatePreviousPageQuadrigam when staying on same route', () => {
            fakeSessionStorage.set(BkiStorageConstants.ACTUAL_STEP_FLOW, 'routeA');
            guard({ routeConfig: { path: 'routeA' } } as ActivatedRouteSnapshot);
            expect(fakeDigitalDataUtilsService.updatePreviousPageQuadrigam).not.toHaveBeenCalled();
        });
        it('should not call updatePreviousPageQuadrigam on first entry', () => {
            guard({ routeConfig: { path: 'routeA' } } as ActivatedRouteSnapshot);
            expect(fakeDigitalDataUtilsService.updatePreviousPageQuadrigam).not.toHaveBeenCalled();
        });
    });
    
});
