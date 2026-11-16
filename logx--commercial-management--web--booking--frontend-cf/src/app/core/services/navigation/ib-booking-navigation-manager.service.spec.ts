import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NavigationManagerService } from '@src/app/core/services/navigation/ib-booking-navigation-manager.service';
import { NAVIGATION_GUARD_SEMAPHORE_STATES } from '@src/app/core/constants/ib-navigation-manager-constants';
import { StepsNavigationService } from '@shared/services/ib-utils/ib-booking-steps-navigation.service';
import { StepsNavigationServiceMock } from '@test-mocks/Services/StepsNavigationServiceMock';
import { StepsControlService } from '@shared/services/ib-utils/ib-booking-steps-control.service';
import { StepsControlServiceMock } from '@test-mocks/Services/StepsControlServiceMock';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { RouterPathsConstants } from '@core/constants/ib-booking-router-paths-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { BookingModalServiceMock } from '@test-mocks/Services/BookingModalServiceMock';
import { AJSBookingModalService } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { UserActivityUtilsService } from '@src/app/core/services/ib-booking-user-activity-utils.service';

class RouterMockSpec {
    public url = '';
    public events = new Subject<any>();
    public navigate = jasmine.createSpy('navigate');
}

class UserActivityUtilsServiceMockSpec {
    checkOrderToIgnore = jasmine.createSpy('checkOrderToIgnore');
}

// @ts-ignore
interface ServiceTest extends NavigationManagerService {
    Router: RouterMockSpec;
    StepsNavigationService: StepsNavigationServiceMock;
    StepsControlService: StepsControlServiceMock;
    CommonsSessionStorageService: StorageServiceMock;
    BookingModalService: BookingModalServiceMock;
    UserActivityUtilsService: UserActivityUtilsServiceMockSpec;
}

interface NavigationScenario {
    description: string;
    currentUrl: string;
    eventUrl: string;
    navigationTrigger?: 'popstate';
    checkButtonsActivation?: boolean;
    mustReject?: boolean;
    onHoldOrder?: boolean;
    blockTransition?: boolean;
    expectedStates: string[];
    expectShowModal: boolean;
    expectCloseModals?: boolean;
    expectedIgnoreOrderCalls?: number;
}

describe('NavigationManagerService', () => {
    let service: ServiceTest;
    let RouterMock: RouterMockSpec;
    let StepsNavigationServiceSpy: StepsNavigationServiceMock;
    let StepsControlServiceSpy: StepsControlServiceMock;
    let StorageService: StorageServiceMock;
    let BookingModalService: BookingModalServiceMock;
    let UserActivityUtilsServiceMock: UserActivityUtilsServiceMockSpec;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Router, useClass: RouterMockSpec },
                { provide: StepsNavigationService, useClass: StepsNavigationServiceMock },
                { provide: StepsControlService, useClass: StepsControlServiceMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: UserActivityUtilsService, useClass: UserActivityUtilsServiceMockSpec },
                { provide: AJSBookingModalService, useClass: BookingModalServiceMock },
                NavigationManagerService
            ]
        });
        service = TestBed.inject(NavigationManagerService as unknown as any);
        ({
            Router: RouterMock,
            StepsNavigationService: StepsNavigationServiceSpy,
            StepsControlService: StepsControlServiceSpy,
            CommonsSessionStorageService: StorageService,
            BookingModalService: BookingModalService,
            UserActivityUtilsService: UserActivityUtilsServiceMock
        } = service);
    });

    describe('When ignore order before redirect is evaluated', () => {
        [
            {
                description: 'should trigger order ignore only for availability',
                nextStep: RouterPathsConstants.availability,
                expectedCalls: 1
            },
            {
                description: 'should not trigger order ignore for other routes',
                nextStep: RouterPathsConstants.ibairp,
                expectedCalls: 0
            }
        ].forEach(({ description, nextStep, expectedCalls }) => {
            it(description, () => {
                service.ignoreOrderBeforeRedirect(nextStep as any);

                expect(UserActivityUtilsServiceMock.checkOrderToIgnore).toHaveBeenCalledTimes(expectedCalls);
            });
        });
    });

    describe('When navigation is processed', () => {
        const scenarios: NavigationScenario[] = [
            {
                description: 'should emit GO without handling popstate flow for imperative navigation',
                currentUrl: '/availability',
                eventUrl: '/ibpbah',
                expectedStates: [NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT, NAVIGATION_GUARD_SEMAPHORE_STATES.GO],
                expectShowModal: false
            },
            {
                description: 'should emit CANCEL and skip modal when popstate transition is not allowed',
                currentUrl: '/availability',
                eventUrl: '/ibpbah',
                navigationTrigger: 'popstate',
                expectedStates: [NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT, NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL],
                expectShowModal: false
            },
            {
                description: 'should open modal and emit GO when user accepts an allowed popstate transition',
                currentUrl: `/${ RouterPathsConstants.ibairp }`,
                eventUrl: `/${ RouterPathsConstants.availability }`,
                navigationTrigger: 'popstate',
                expectedStates: [NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT, NAVIGATION_GUARD_SEMAPHORE_STATES.GO],
                expectShowModal: true,
                expectCloseModals: true,
                expectedIgnoreOrderCalls: 1
            },
            {
                description: 'should restore current step and emit CANCEL when user rejects modal',
                currentUrl: `/${ RouterPathsConstants.ibairp }`,
                eventUrl: `/${ RouterPathsConstants.availability }`,
                navigationTrigger: 'popstate',
                mustReject: true,
                expectedStates: [NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT, NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL],
                expectShowModal: true
            },
            {
                description: 'should emit CANCEL and avoid modal when payment is on hold',
                currentUrl: `/${ RouterPathsConstants.ibpurc }`,
                eventUrl: `/${ RouterPathsConstants.availability }`,
                navigationTrigger: 'popstate',
                onHoldOrder: true,
                expectedStates: [NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT, NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL],
                expectShowModal: false
            },
            {
                description: 'should emit GO without modal when back navigation control is disabled',
                currentUrl: '/availability',
                eventUrl: '/ibpbah',
                navigationTrigger: 'popstate',
                checkButtonsActivation: false,
                expectedStates: [NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT, NAVIGATION_GUARD_SEMAPHORE_STATES.GO],
                expectShowModal: false
            }
        ];

        scenarios.forEach((scenario) => {
            it(scenario.description, fakeAsync(() => {
                const emittedStates: string[] = [];
                service.navigationGuardSemaphore$.subscribe((state) => emittedStates.push(state));

                if (scenario.checkButtonsActivation === false) {
                    StepsNavigationServiceSpy.checkButtonsActivation.and.returnValue(false);
                }
                if (scenario.mustReject) {
                    StepsControlServiceSpy.mustReject = true;
                }
                if (scenario.onHoldOrder) {
                    StorageService.set(BkiStorageConstants.ONHOLD_ORDER, true);
                }

                RouterMock.url = scenario.currentUrl;
                service.init();
                RouterMock.events.next(
                    new NavigationStart(
                        1,
                        scenario.eventUrl,
                        scenario.navigationTrigger
                    )
                );
                flushMicrotasks();

                expect(emittedStates).toEqual(scenario.expectedStates);
                if (scenario.expectShowModal) {
                    expect(StepsControlServiceSpy.showStepsControlModal).toHaveBeenCalled();
                } else {
                    expect(StepsControlServiceSpy.showStepsControlModal).not.toHaveBeenCalled();
                }

                if (scenario.expectCloseModals) {
                    expect(BookingModalService.closeAllCurrentModals).toHaveBeenCalled();
                } else {
                    expect(BookingModalService.closeAllCurrentModals).not.toHaveBeenCalled();
                }

                if (scenario.expectedIgnoreOrderCalls !== undefined) {
                    expect(UserActivityUtilsServiceMock.checkOrderToIgnore)
                        .toHaveBeenCalledTimes(scenario.expectedIgnoreOrderCalls);
                }
            }));
        });
    });

    describe('When init is called', () => {
        it('should subscribe to router events and set activateBackNavigationControlFeature', () => {
            StepsNavigationServiceSpy.checkButtonsActivation.and.returnValue(true);

            service.init();

            expect(StepsNavigationServiceSpy.checkButtonsActivation).toHaveBeenCalled();
        });

        it('should not reinitialize if already subscribed', () => {
            StepsNavigationServiceSpy.checkButtonsActivation.and.returnValue(true);

            service.init();
            service.init();

            expect(StepsNavigationServiceSpy.checkButtonsActivation).toHaveBeenCalledTimes(1);
        });

        it('should initialize with checkButtonsActivation returning false', () => {
            StepsNavigationServiceSpy.checkButtonsActivation.and.returnValue(false);

            service.init();

            expect(StepsNavigationServiceSpy.checkButtonsActivation).toHaveBeenCalled();
        });
    });

    describe('When disableNavigation is called', () => {
        it('should set blockTransition to true when called with true', fakeAsync(() => {
            const emittedStates: string[] = [];
            service.navigationGuardSemaphore$.subscribe((state) => emittedStates.push(state));

            RouterMock.url = `/${ RouterPathsConstants.ibairp }`;
            service.init();
            service.disableNavigation(true);

            RouterMock.events.next(
                new NavigationStart(
                    1,
                    `/${ RouterPathsConstants.availability }`,
                    'popstate'
                )
            );
            flushMicrotasks();

            expect(emittedStates).toEqual([
                NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL
            ]);
            expect(StepsControlServiceSpy.showStepsControlModal).not.toHaveBeenCalled();
        }));

        it('should allow navigation when disableNavigation is set to false after being true', fakeAsync(() => {
            const emittedStates: string[] = [];
            service.navigationGuardSemaphore$.subscribe((state) => emittedStates.push(state));

            RouterMock.url = `/${ RouterPathsConstants.ibairp }`;
            service.init();
            service.disableNavigation(true);
            service.disableNavigation(false);

            RouterMock.events.next(
                new NavigationStart(
                    1,
                    `/${ RouterPathsConstants.availability }`,
                    'popstate'
                )
            );
            flushMicrotasks();

            expect(emittedStates).toEqual([
                NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT,
                NAVIGATION_GUARD_SEMAPHORE_STATES.GO
            ]);
            expect(StepsControlServiceSpy.showStepsControlModal).toHaveBeenCalled();
            expect(BookingModalService.closeAllCurrentModals).toHaveBeenCalled();
        }));

        it('should block navigation even for allowed transitions when blockTransition is true', fakeAsync(() => {
            const emittedStates: string[] = [];
            service.navigationGuardSemaphore$.subscribe((state) => emittedStates.push(state));

            RouterMock.url = `/${ RouterPathsConstants.ibairp }`;
            service.init();
            service.disableNavigation(true);

            RouterMock.events.next(
                new NavigationStart(
                    1,
                    `/${ RouterPathsConstants.availability }`,
                    'popstate'
                )
            );
            flushMicrotasks();

            expect(emittedStates).toEqual([
                NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL
            ]);
            expect(StepsControlServiceSpy.showStepsControlModal).not.toHaveBeenCalled();
        }));

        it('should not affect imperative navigation when blockTransition is true', fakeAsync(() => {
            const emittedStates: string[] = [];
            service.navigationGuardSemaphore$.subscribe((state) => emittedStates.push(state));

            RouterMock.url = '/availability';
            service.init();
            service.disableNavigation(true);

            RouterMock.events.next(
                new NavigationStart(
                    1,
                    '/ibpbah'
                )
            );
            flushMicrotasks();

            expect(emittedStates).toEqual([
                NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT,
                NAVIGATION_GUARD_SEMAPHORE_STATES.GO
            ]);
        }));
    });

});
