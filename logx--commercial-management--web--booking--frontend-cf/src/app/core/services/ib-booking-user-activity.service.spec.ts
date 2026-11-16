import { TestBed } from '@angular/core/testing';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
import { KeepAliveConstants } from '@core/constants/ib-keep-alive-constants';
import { UserActivityUtilsService } from '@core/services/ib-booking-user-activity-utils.service';
import { BookingUserActivityService } from '@core/services/ib-booking-user-activity.service';
import { OrderAliveWorkerComponentInput } from '@core/workers/keep-alive-worker/components/ib-booking-order-alive-worker-component';
import { InactivityWorkerComponentInput } from '@core/workers/keep-alive-worker/components/ib-booking-user-inactivity-worker-component';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { WorkerMock } from '@test-mocks/class/WorkerMock';
class UserActivityUtilsServiceMock {
    callKeepAliveService = jasmine.createSpy('callKeepAliveService').and.returnValue(Promise.resolve());
    showSessionModal = jasmine.createSpy('showSessionModal');
    checkOrderToIgnore = jasmine.createSpy('checkOrderToIgnore');
    getNextKeepAliveCall = jasmine.createSpy('getNextKeepAliveCall').and.returnValue(15000);
    setKeepAliveNextCall = jasmine.createSpy('setKeepAliveNextCall');
    clearKeepAliveNextCall = jasmine.createSpy('clearKeepAliveNextCall');
}


// @ts-ignore
interface ServiceTest extends BookingUserActivityService {
    UserActivityUtilsService : UserActivityUtilsServiceMock,
    worker: WorkerMock,
    CommonsSessionStorageService: StorageServiceMock,
    ACTIVITY_EVENTS: string[],
    ACTIVITY_TIMEOUT: number,
    setActivityReactiveLogic: () => void,

    sendOrderAliveEvent: (message: OrderAliveWorkerComponentInput) => void,
    sendInactivityEvent: (message: InactivityWorkerComponentInput) => void,
}

describe('BookingUserActivityService', () => {
    let service: ServiceTest;
    const originalWorker = globalThis.Worker;
    beforeAll(()=> {
        globalThis.Worker = WorkerMock as any;
    });

    afterAll(() => {
        globalThis.Worker = originalWorker;
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BookingUserActivityService,
                { provide: UserActivityUtilsService, useClass: UserActivityUtilsServiceMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock }
            ]
        });
        service = TestBed.inject(BookingUserActivityService) as unknown as ServiceTest;
        service.ACTIVITY_TIMEOUT = 100;
        // Use a fixed timestamp to avoid timing issues in tests
        const fixedTimestamp = new Date('2025-01-01T12:00:00.000Z').getTime();
        service.CommonsSessionStorageService.set(BkiStorageConstants.CREATE_ORDER_DATA, 
            {order: {
                timeLimit: new Date(fixedTimestamp + KeepAliveConstants.DEFAULT_ORDER_DURATION).toISOString()
            }});
        // Remap activity events to avoid interference with other tests
        service.initActivityWorker();
        service.initActivityListener();
    });

    describe('Test initActivityWorker', () => {
        it('should initialize worker and timers without orderAlive event', () => {
            service.initActivityWorker();
            const { worker, UserActivityUtilsService } = service;
            expect(worker).toBeDefined();
            expect(worker.postMessage).toHaveBeenCalledWith({ component: 'inactivity', data: { type: 'active' } });
            expect(worker.postMessage).toHaveBeenCalledWith({ component: 'keepAlive', data: { type: 'start', sessionTime: 15000 } });
            expect(worker.postMessage).not.toHaveBeenCalledWith(jasmine.objectContaining({ component: 'orderAlive' }));
            expect(UserActivityUtilsService.getNextKeepAliveCall).toHaveBeenCalled();
        });
        
    });

    describe('Test initKeepAliveTimer', () => {
        it('should call initKeepAliveTimer reseting time', () => {
            const { worker, UserActivityUtilsService } = service;
            service.initKeepAliveTimer();
            expect(UserActivityUtilsService.getNextKeepAliveCall).toHaveBeenCalled();
            expect(UserActivityUtilsService.setKeepAliveNextCall).toHaveBeenCalled();
            expect(worker.postMessage).toHaveBeenCalledWith({ component: 'keepAlive', data: { type: 'start', sessionTime: 15000 } });
        });
        it('should resume keep alive', () => {
            const { worker, UserActivityUtilsService } = service;
            service.initKeepAliveTimer(false);
            expect(UserActivityUtilsService.setKeepAliveNextCall).not.toHaveBeenCalled();
            expect(worker.postMessage).toHaveBeenCalledWith({ component: 'keepAlive', data: { type: 'start', sessionTime: 15000 } });
        });
    });

    describe('Test session expiration for order lifetime', () => {
    
        const validateHandleSessionExpired = () => {
            const { worker, UserActivityUtilsService } = service;
            expect(UserActivityUtilsService.showSessionModal).toHaveBeenCalled();
            expect(UserActivityUtilsService.checkOrderToIgnore).toHaveBeenCalled();
            expect(UserActivityUtilsService.clearKeepAliveNextCall).toHaveBeenCalled();
            expect(worker.terminate).toHaveBeenCalled();
        }; 

        const expireSesionTypes = ['orderExpired', 'inactivityPeriodEnded'];
        expireSesionTypes.forEach(type => {
            it(`should execute handleSessionExpired for ${type}`, () => {
                const { worker } = service;
                worker.onmessage?.({ data: { type } } as MessageEvent);
                validateHandleSessionExpired();
            });
        });

        it('should not call checkOrderToIgnore if flowApp is MMBOH', () => {
            const { worker, UserActivityUtilsService, CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.FLOW_APP, 'MMBOH' );
            worker.onmessage?.({ data: { type: 'orderExpired' } } as MessageEvent);
            expect(UserActivityUtilsService.checkOrderToIgnore).not.toHaveBeenCalled();
        });
        
        
    });

    describe('Test keep alive call from worker', () => {
        it('should call keep alive service', () => {
            const { worker, UserActivityUtilsService } = service;
            worker.onmessage?.({ data: { type: 'callKeepAlive' } } as MessageEvent);
            expect(UserActivityUtilsService.callKeepAliveService).toHaveBeenCalled();
        });
    });

    describe('Test stopActivityListener', () => {
        it('should stop activity listener', () => {
            spyOn(service, 'sendInactivityEvent').and.callThrough();
            service.stopActivityListener();
            expect(service.sendInactivityEvent).toHaveBeenCalledWith({ type: 'active' });
        });
    });

    describe('Test activity/inactivity event logic', () => {
        beforeEach(() => {
            service.worker.postMessage.calls.reset();
        });

        const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'visibilitychange'];
        activityEvents.forEach(event => {
            it(`should detect activity on ${event}`, (done) => {
                setTimeout(() => {
                    expect(service.worker.postMessage).toHaveBeenCalledWith({ component: 'inactivity', data: { type: 'inactive' } });
                    globalThis.document.dispatchEvent(new Event(event));
                    setTimeout(() => {
                        expect(service.worker.postMessage).toHaveBeenCalledWith({ component: 'inactivity', data: { type: 'active' } });
                        done();
                    });
                }, service.ACTIVITY_TIMEOUT + 10);
            });

        });
        it('should detect inactivity after visivilitychange when change to hidden', (done) => {
            
            setTimeout(() => {
                expect(service.worker.postMessage).toHaveBeenCalledWith({ component: 'inactivity', data: { type: 'inactive' } });
                globalThis.document.dispatchEvent(new Event('mousemove'));
                spyOnProperty(globalThis.document, 'visibilityState', 'get').and.returnValue('hidden');
                setTimeout(() => {
                    service.worker.postMessage.calls.reset();
                    globalThis.document.dispatchEvent(new Event('visibilitychange'));
                    setTimeout(() => {
                        expect(service.worker.postMessage).toHaveBeenCalledWith({ component: 'inactivity', data: { type: 'inactive' } });
                        done();
                    });
                });
            }, service.ACTIVITY_TIMEOUT + 10);
        });

    });

    describe('Test ngOnDestroy', () => {
        it('should call ngOnDestroy', () => {
            const { worker } = service;
            spyOn(service, 'sendInactivityEvent').and.callThrough();
            spyOn(service, 'terminateWorker').and.callThrough();
            service.ngOnDestroy();
            expect(service.terminateWorker).toHaveBeenCalled();
            expect(worker.terminate).toHaveBeenCalled();
            expect(service.sendInactivityEvent).toHaveBeenCalledWith({ type: 'active' });
        }); 
    });

    describe ('Test setOrderTimeoutTimer', ()=> {
        it('should set order timeout timer if there is order in storage', () => {
            const {setOrderTimeoutTimer, worker} = service;
            setOrderTimeoutTimer();
            expect(worker.postMessage).toHaveBeenCalledWith(jasmine.objectContaining({ component: 'orderAlive', data: jasmine.objectContaining({ type: 'start' }) }));
        });
        it('should not set order timeout timer if there is no order in storage', () => {
            service.CommonsSessionStorageService.remove(BkiStorageConstants.CREATE_ORDER_DATA);
            service.worker.postMessage.calls.reset();
            service.setOrderTimeoutTimer();
            expect(service.worker.postMessage).not.toHaveBeenCalled();
        });
        it('should not set order timeout timer if flowApp is MMBOH', () => {
            service.CommonsSessionStorageService.set( BkiStorageConstants.FLOW_APP, 'MMBOH' );
            service.worker.postMessage.calls.reset();
            service.setOrderTimeoutTimer();
            expect(service.worker.postMessage).not.toHaveBeenCalled();
        });
        it('should set default order timeout timer if order has no time limit', () => {
            service.CommonsSessionStorageService.set(BkiStorageConstants.CREATE_ORDER_DATA, {order: {}});
            service.worker.postMessage.calls.reset();
            service.setOrderTimeoutTimer();
            // Use jasmine.objectContaining to allow for small timing variations
            expect(service.worker.postMessage).toHaveBeenCalledWith({ 
                component: 'orderAlive', 
                data: jasmine.objectContaining({ 
                    type: 'start', 
                    orderDuration: jasmine.any(Number)
                })
            });
            // Verify the orderDuration is close to the expected value (within 100ms tolerance)
            const calls = service.worker.postMessage.calls.all();
            const orderAliveCall = calls.find(call => call.args[0].component === 'orderAlive');
            expect(orderAliveCall.args[0].data.orderDuration).toBeCloseTo(KeepAliveConstants.DEFAULT_ORDER_DURATION, -2);
        });
        it('should stops order timeout timer if order has invalid time limit', () => {
            service.CommonsSessionStorageService.set(BkiStorageConstants.CREATE_ORDER_DATA, {order: {timeLimit: 'invalid-date'}});
            service.worker.postMessage.calls.reset();
            service.setOrderTimeoutTimer();
            expect(service.worker.postMessage).toHaveBeenCalledWith({ component: 'orderAlive', data: { type: 'stop' } });
        });
        
    });
    describe('Test stopOrderTimeoutTimer', ()=> {
        it('should stop order timeout timer', () => {
            const {stopOrderTimeoutTimer, worker} = service;
            stopOrderTimeoutTimer();
            expect(worker.postMessage).toHaveBeenCalledWith({ component: 'orderAlive', data: { type: 'stop' } });
        }); 
    });

    describe('Test stopKeepAliveTimer', ()=> {
        it('should stop keep alive timer', () => {
            const {stopKeepAliveTimer, worker} = service;
            stopKeepAliveTimer();
            expect(worker.postMessage).toHaveBeenCalledWith({ component: 'keepAlive', data: { type: 'stop' } });
        }); 
    });
});





