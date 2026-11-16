import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { NavigationManagerService } from '@src/app/core/services/navigation/ib-booking-navigation-manager.service';
import { NavigationManagerServiceMock } from '@test-mocks/Services/NavigationManagerServiceMock';
import { BookingStepsControlFn, ComponentCanDeactivate } from '@src/app/core/routing/Guards/ib-booking-steps-control.guard';
import { NAVIGATION_GUARD_SEMAPHORE_STATES } from '@src/app/core/constants/ib-navigation-manager-constants';
import { CanDeactivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
class StepsControlServiceMock {
    showStepsControlModal = jasmine.createSpy('showStepsControlModal').and.callFake(() => {
        return { result: Promise.resolve() };
    });
}




class TestBench {
    public Guard: CanDeactivateFn<ComponentCanDeactivate>;
    public NavigationManagerService = new NavigationManagerServiceMock() as any;

    constructor () {
        this.Guard = (component: ComponentCanDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => TestBed.runInInjectionContext(() => BookingStepsControlFn(component, currentRoute, currentState, nextState));
        TestBed.configureTestingModule({
            providers: [
                { provide: NavigationManagerService, useValue: this.NavigationManagerService }
            ]
        });
    }
}
describe('BookingStepsControlFn test', () => {
    let testBench: TestBench;
    let subscription: Subscription;
    let states = [
        NAVIGATION_GUARD_SEMAPHORE_STATES.GO,
        NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL,
        NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT
    ];

    beforeEach(() => {
        testBench = new TestBench();
    });

    afterEach(() => {
        if (subscription) {
            subscription.unsubscribe();
            subscription = null;
        }
    });

    states.forEach((state) => {
        it(`When NavigationManagerService returns ${state}`, (done) => {
            testBench.NavigationManagerService.mockState = state;
            const guardObs: any = testBench.Guard({} as ComponentCanDeactivate, {} as any, {} as any, {} as any);
            const timeoutTimer = setTimeout(() => {
                expect(state).toBe(NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT);
                done();
                
            }, 100);
            subscription = guardObs.subscribe((res: boolean) => {
                clearTimeout(timeoutTimer);
                expect(state).not.toBe(NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT);
                const expected = state === NAVIGATION_GUARD_SEMAPHORE_STATES.GO;
                expect(res).toBe(expected);
                done();
                
            });
        });
    });
});
