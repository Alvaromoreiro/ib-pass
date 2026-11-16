import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IbBookingStepsComponent } from "@shared/components/ib-booking-header/components/ib-booking-steps/ib-booking-steps.component";
import { TranslateModule } from "@ngx-translate/core";
import { AJSRootScope } from "ib-web-commons/utils";
import { RootScopeMock } from "test/mocks/class/RootScopeMock";
import { ElementRef, NgZone, NO_ERRORS_SCHEMA } from "@angular/core";
import { axeMatchers, checkA11y } from "@test/helpers/axe-helper";

const mockSteps = [
    {
        index: 0,
        page: 'test',
        text: 'test',
        description: 'test'
    },
    {
        index: 1,
        page: 'test1',
        text: 'test1',
        description: 'test1'
    },
]

//@ts-ignore
interface TestComponent extends IbBookingStepsComponent {
    rootScope: RootScopeMock;
    ngZone: NgZone;
    stepsMobileMenu: ElementRef;
    focusTrapElementEnd: HTMLElement;
    closeButton: ElementRef;
    openButton: ElementRef;
    initMenuAccessibility: ()=> {};
    destroyMenuAccessibility: ()=> {};
    onTrapFocusOut: () => {};
    focusOpenButton: () => {};
    managedClickOutside: (event: MouseEvent) => {};
    onKeyDown: (event: KeyboardEvent) => {};
}

describe('IbBookingStepsComponent', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<IbBookingStepsComponent>
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbBookingStepsComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
            { provide: AJSRootScope, useClass: RootScopeMock }
            ]
        });

        fixture = TestBed.createComponent(IbBookingStepsComponent);
        component = fixture.componentInstance as unknown as TestComponent;

        component.rootScope.isMobile = { general: false, header: false };
        fixture.detectChanges();
        jasmine.addMatchers(axeMatchers);
    });

    const check = async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        const results = await checkA11y(fixture.nativeElement);
        //@ts-ignore
        expect(results).toHaveNoA11yViolations();
    }

    describe('Test axe accessibillity for several resolutions', async () => { 
        it('should have no accessibility violations', async () => {
            const results = await checkA11y(fixture.nativeElement);
            //@ts-ignore
            expect(results).toHaveNoA11yViolations();
        });

        it('should have no a11y violations (mobile closed)', async () => {
            component.isMobile = true;
            component.mobileDrawerOpen = false;
            component.steps = mockSteps;
            component.currentStep = mockSteps[0];
            await check();
        });

        it('Ally (mobile open)', async () => {
            component.isMobile = true;
            component.mobileDrawerOpen = true;
            component.steps = mockSteps;
            component.currentStep = mockSteps[0];
            await check();
        });

        it('should have no a11y violations (desktop)', async () => {
            component.isMobile = false;
            component.steps = mockSteps;
            await check();
        });
    })

    describe('Test initMenuAccessibility and destroyMenuAccessibility', () => {
        beforeEach(() => {
            component.stepsMobileMenu = { nativeElement: document.createElement('div') } as ElementRef;
            const button1 = document.createElement('button');
            button1.classList.add('steps-nav-btn');
            component.stepsMobileMenu.nativeElement.appendChild(button1);

            component.onTrapFocusOut = jasmine.createSpy('onTrapFocusOut');
            component.managedClickOutside = jasmine.createSpy('managedClickOutside');
            component.onKeyDown = jasmine.createSpy('onKeyDown');
        });

        const dispatchDocumentEvents = () => {
           document.dispatchEvent(new MouseEvent('click'));
           document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
        };

        const checkManagerFunctionsAssert = (mustBeCalled = true) => {
            const {managedClickOutside, onTrapFocusOut, onKeyDown} = component;
            const functions = [managedClickOutside, onTrapFocusOut, onKeyDown];
            functions.forEach(fn => {
                if(mustBeCalled) {
                    expect(fn).toHaveBeenCalled();
                } else {
                    expect(fn).not.toHaveBeenCalled();
                }
            });
        };

        function runAccessibilityTest(init: boolean, mustBeCalled: boolean, done: DoneFn) {
            if (init) component.initMenuAccessibility();
            if (!init) component.initMenuAccessibility();
            const focusTrap = component.focusTrapElementEnd;
            if (!init) component.destroyMenuAccessibility();
            focusTrap?.dispatchEvent(new FocusEvent('focusout'));
            dispatchDocumentEvents();
            setTimeout(() => {
                checkManagerFunctionsAssert(mustBeCalled);
                done();
            }, 20);
        }

        it('initMenuAccessibility -> should add event listeners', (done) => {
            runAccessibilityTest(true, true, done);
        });

        it('destroyMenuAccessibility -> should remove event listeners', (done) => {
            runAccessibilityTest(false, false, done);
        });

    });

    describe('Test html attributes (including aria)', () => { 
        const setComponentData = (isMobile: boolean = true, mobileDrawerOpen: boolean = false) => {
            component.isMobile = isMobile;
            component.steps = mockSteps;
            component.currentStep = mockSteps[0]
            component.mobileDrawerOpen = mobileDrawerOpen;
        }

        it('should update aria-expanded when drawer toggles', () => {
            setComponentData();
            fixture.detectChanges();

            const btn = fixture.nativeElement.querySelector('.steps-mobile-btn');
            expect(btn.getAttribute('aria-expanded')).toBe('false');

            component.mobileDrawerOpen = true;
            fixture.detectChanges();

            expect(btn.getAttribute('aria-expanded')).toBe('true');
        });

        it('should connect button with drawer via aria-controls', () => {
            setComponentData();

            fixture.detectChanges();

            const btn = fixture.nativeElement.querySelector('.steps-mobile-btn');
            const menu = fixture.nativeElement.querySelector('#stepsMobileMenu');

            expect(btn.getAttribute('aria-controls')).toBe('stepsMobileMenu');
            expect(menu).toBeTruthy();
        });

        it('should hide menu when closed', () => {
            setComponentData();
            fixture.detectChanges();

            const menu = fixture.nativeElement.querySelector('#stepsMobileMenu');
            expect(menu.getAttribute('aria-hidden')).toBe('true');
        });

        it('should set inert when drawer is closed', () => {
            setComponentData();
            fixture.detectChanges();

            const menu = fixture.nativeElement.querySelector('#stepsMobileMenu');
            expect(menu.hasAttribute('inert')).toBeTrue();
        });
    })
});