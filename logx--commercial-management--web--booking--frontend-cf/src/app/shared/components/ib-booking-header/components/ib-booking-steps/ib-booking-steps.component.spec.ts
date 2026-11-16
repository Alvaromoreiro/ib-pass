import { TestBed } from "@angular/core/testing";
import { IbBookingStepsComponent } from "@shared/components/ib-booking-header/components/ib-booking-steps/ib-booking-steps.component";
import { TranslateModule } from "@ngx-translate/core";
import { AJSRootScope } from "ib-web-commons/utils";
import { RootScopeMock } from "test/mocks/class/RootScopeMock";
import { ElementRef, NgZone, NO_ERRORS_SCHEMA } from "@angular/core";

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
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbBookingStepsComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                {provide: AJSRootScope, useClass: RootScopeMock}
            ]
        });
        const fixture = TestBed.createComponent(IbBookingStepsComponent)
        component = fixture.componentInstance as unknown as TestComponent;
        component.rootScope.isMobile = { general: false, header: false };
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Test onDestroy method', () => {
        it('should clean up resources', () => {
            component.destroyMenuAccessibility = jasmine.createSpy('destroyMenuAccessibility');
            component.ngOnDestroy();
            expect(component.destroyMenuAccessibility).toHaveBeenCalled();
        });
    });

    describe('Test onResize method', () => {
        it('should close drawer if change to desktop', () => {
            component.destroyMenuAccessibility = jasmine.createSpy('destroyMenuAccessibility');
            component.mobileDrawerOpen = true;
            document.body.classList.add('modal-open');
            component.rootScope.isMobile = { general: false, header: false };
            component.onResize();
            expect(component.mobileDrawerOpen).toBeFalse();
            expect(component.destroyMenuAccessibility).toHaveBeenCalled();
            expect(document.body.classList.contains('modal-open')).toBeFalse();

        }); 
    });

    describe('onKeyDown', () => {
        beforeEach(() => {
            component.closeMobileDrawer = jasmine.createSpy('closeMobileDrawer');
        });
        it('should call closeMobileDrawer on Escape key', () => {
            const event = new KeyboardEvent('keydown', {key: 'Escape'});
            component.onKeyDown(event);
            expect(component.closeMobileDrawer).toHaveBeenCalled();

        });
        it('should not call closeMobileDrawer on other key', () => {

            const event = new KeyboardEvent('keydown', {key: 'Enter'});
            document.dispatchEvent(event);
            component.onKeyDown(event);
            expect(component.closeMobileDrawer).not.toHaveBeenCalled();
        });
    });

    describe('onTrapFocusOut', () => {
        beforeEach(() => {
            component.closeButton = { nativeElement: document.createElement('button') } as ElementRef;
        })
        it('should call closeButton.nativeElement.focus', () => {
            spyOn(component.closeButton.nativeElement, 'focus');
            component.onTrapFocusOut();
            expect(component.closeButton.nativeElement.focus).toHaveBeenCalled();
        });
    
    });



    describe('managedClickOutside', () => {
        let menuDiv: HTMLDivElement;
        let openBtn: HTMLButtonElement;
        let outsideDiv: HTMLDivElement;

        beforeEach(() => {
            menuDiv = document.createElement('div');
            openBtn = document.createElement('button');
            outsideDiv = document.createElement('div');
            component.stepsMobileMenu = { nativeElement: menuDiv } as ElementRef;
            component.openButton = { nativeElement: openBtn } as ElementRef;
            component.closeMobileDrawer = jasmine.createSpy('closeMobileDrawer');
        });

        it('should NOT call closeMobileDrawer if click is inside stepsMobileMenu', () => {
            spyOn(menuDiv, 'contains').and.returnValue(true);
            const event = new MouseEvent('click');
            Object.defineProperty(event, 'target', { value: menuDiv });
            component.managedClickOutside(event);
            expect(component.closeMobileDrawer).not.toHaveBeenCalled();
        });

        it('should NOT call closeMobileDrawer if click is on openButton', () => {
            spyOn(menuDiv, 'contains').and.returnValue(false);
            spyOn(openBtn, 'contains').and.returnValue(true);
            const event = new MouseEvent('click');
            Object.defineProperty(event, 'target', { value: openBtn });
            component.managedClickOutside(event);
            expect(component.closeMobileDrawer).not.toHaveBeenCalled();
        });

        it('should call closeMobileDrawer if click is outside stepsMobileMenu and openButton', () => {
            spyOn(menuDiv, 'contains').and.returnValue(false);
            spyOn(openBtn, 'contains').and.returnValue(false);
            const event = new MouseEvent('click');
            Object.defineProperty(event, 'target', { value: outsideDiv });
            component.managedClickOutside(event);
            expect(component.closeMobileDrawer).toHaveBeenCalled();
        });
    });

    describe('focusOpenButton', () => {
        beforeEach(() => {
            component.openButton = { nativeElement: document.createElement('button') } as ElementRef;
        });
        it('debe enfocar el botón openButton', () => {
            spyOn(component.openButton.nativeElement, 'focus');
            component.focusOpenButton();
            expect(component.openButton.nativeElement.focus).toHaveBeenCalled();
        });
    });

    describe('toggleMobileDrawer', () => {
        beforeEach(() => {
            component.focusTrapElementEnd = document.createElement('button');
            component.stepsMobileMenu = { nativeElement: document.createElement('div') } as ElementRef;
            const stepsNav = document.createElement('button');
            stepsNav.classList.add('steps-nav');
            component.stepsMobileMenu.nativeElement.appendChild(stepsNav);
            component.initMenuAccessibility = jasmine.createSpy('initMenuAccessibility');
            spyOn(component.focusTrapElementEnd, 'focus');
            spyOn(stepsNav, 'focus');
        });

        it('debe cerrar el drawer si está abierto', () => {
            component.mobileDrawerOpen = true;
            component.closeMobileDrawer = jasmine.createSpy('closeMobileDrawer');
            component.toggleMobileDrawer();
            expect(component.closeMobileDrawer).toHaveBeenCalled();
        });

        it('debe abrir el drawer si está cerrado', (done) => {
            component.mobileDrawerOpen = false;
            component.toggleMobileDrawer();
            expect(component.mobileDrawerOpen).toBeTrue();
            expect(component.focusTrapElementEnd.focus).toHaveBeenCalled();
            expect(document.body.classList.contains('modal-open')).toBeTrue();
            expect(component.initMenuAccessibility).toHaveBeenCalled();

            setTimeout(() => {
                expect(component.stepsMobileMenu.nativeElement.querySelector('.steps-nav').focus).toHaveBeenCalled();
                done();
            }, 20);
        });
    });

    describe('onStepClicked', () => {
        it('debe llamar a closeMobileDrawer si es móvil', () => {
            component.isMobile = true;
            component.closeMobileDrawer = jasmine.createSpy('closeMobileDrawer');
            component.onStepClicked();
            expect(component.closeMobileDrawer).toHaveBeenCalled();
        });

        it('no debe llamar a closeMobileDrawer si no es móvil', () => {
            component.isMobile = false;
            component.closeMobileDrawer = jasmine.createSpy('closeMobileDrawer');
            component.onStepClicked();
            expect(component.closeMobileDrawer).not.toHaveBeenCalled();
        });
    });

    describe('closeMobileDrawer', () => {
        beforeEach(() => {
            component.focusOpenButton = jasmine.createSpy('focusOpenButton');
            component.destroyMenuAccessibility = jasmine.createSpy('destroyMenuAccessibility');
        });

        it('debe cerrar el drawer y limpiar accesibilidad', () => {
            document.body.classList.add('modal-open');
            component.mobileDrawerOpen = true;
            component.closeMobileDrawer();
            expect(document.body.classList.contains('modal-open')).toBeFalse();
            expect(component.mobileDrawerOpen).toBeFalse();
            expect(component.focusOpenButton).toHaveBeenCalled();
            expect(component.destroyMenuAccessibility).toHaveBeenCalled();
        });
    });

    describe( 'When onEnableMobileDrawer is called', () => {
        it( 'It should set property mobileEnabled based on emitter', () => {
            component.onEnableMobileDrawer( true );
            expect( component.mobileEnabled ).toBeTrue();
        } );
    } );



});