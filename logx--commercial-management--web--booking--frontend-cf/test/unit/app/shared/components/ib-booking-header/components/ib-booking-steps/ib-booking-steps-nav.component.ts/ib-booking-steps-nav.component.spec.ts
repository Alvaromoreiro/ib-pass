import { ComponentFixture, fakeAsync, flushMicrotasks, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { IbBookingStepsNavComponent } from "@shared/components/ib-booking-header/components/ib-booking-steps/components/ib-booking-steps-nav/ib-booking-steps-nav.component";
import { HeaderStep } from "@src/app/core/models/ib-booking-availability/header-model";
import { DigitalDataEventsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-events.service';
import { BookingRedirectionService } from "@src/app/shared/services/ib-utils/ib-booking-redirection.service";
import { StepsControlService } from "@src/app/shared/services/ib-utils/ib-booking-steps-control.service";
import { StepsNavigationService } from '@src/app/shared/services/ib-utils/ib-booking-steps-navigation.service';
import { DigitalDataEventsServiceMock } from 'test/mocks/class/DigitalDataEventsServiceMock';
import { BookingRedirectionServiceMock } from "test/mocks/class/KeepAliveUtilsMock";
import { StepsNavigationServiceMock } from 'test/mocks/Services/StepsNavigationServiceMock';
import { StepsControlServiceMock } from 'test/mocks/Services/StepsControlServiceMock';
import { BookingModalServiceMock } from "test/mocks/Services/BookingModalServiceMock";
import { AJSBookingModalService } from "@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service";
import { NavigationManagerService } from '@src/app/core/services/navigation/ib-booking-navigation-manager.service';
import { NavigationManagerServiceMock } from 'test/mocks/Services/NavigationManagerServiceMock';


//@ts-ignore
interface TestComponent extends IbBookingStepsNavComponent {
    BookingRedirectionService: BookingRedirectionService;
    StepsNavigationService: StepsNavigationService;
    DigitalDataEventsService: DigitalDataEventsService;
    StepsControlService: StepsControlServiceMock;
    BookingModalService: BookingModalServiceMock;
    NavigationManagerService: NavigationManagerServiceMock;
}

describe('IbBookingStepsNavComponent', () => { 
    let component: TestComponent;
    let fixture: ComponentFixture<IbBookingStepsNavComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [IbBookingStepsNavComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: BookingRedirectionService, useClass: BookingRedirectionServiceMock },
                { provide: StepsNavigationService, useClass: StepsNavigationServiceMock },
                { provide: DigitalDataEventsService, useClass: DigitalDataEventsServiceMock },
                { provide: StepsControlService, useClass: StepsControlServiceMock },
                { provide: NavigationManagerService, useClass: NavigationManagerServiceMock },
                { provide: AJSBookingModalService, useClass: BookingModalServiceMock }



            ]
        }).compileComponents();
        fixture = TestBed.createComponent(IbBookingStepsNavComponent);
        component = fixture.componentInstance as unknown as TestComponent;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    
    describe( 'When ngOnInit is called', () => {
        it( 'It should check active buttons as false', () => {
             component.StepsNavigationService.checkButtonsActivation = jasmine.createSpy('checkButtonsActivation').and.returnValue( false );
            component.ngOnInit();
            expect( component.activeButtons ).toBe( false );
        } );
        it( 'It should check with enableStepsNavigation as true', () => {
            component.StepsNavigationService.checkButtonsActivation = jasmine.createSpy('checkButtonsActivation').and.returnValue( true );
            component.ngOnInit();
            fixture.detectChanges();
            expect( component.activeButtons ).toBe( true );
        } );
        it( 'It should check with redeption flow', () => {
            component.StepsNavigationService.checkButtonsActivation = jasmine.createSpy('checkButtonsActivation').and.returnValue( false );
            component.ngOnInit();
            fixture.detectChanges();
            expect( component.activeButtons ).toBe( false );
        } );
    } );

    describe('Test stepClick method', () => {
        it('should call BookingRedirectionService.path method', fakeAsync(() => {
            const { BookingRedirectionService, stepClicked, DigitalDataEventsService, BookingModalService, NavigationManagerService } = component;
            spyOn(stepClicked, 'emit').and.callThrough();
            const step = {index: 0, page: 'test', text: 'Test Step'} as HeaderStep;
            component.stepClick(step);
            flushMicrotasks();
            expect(stepClicked.emit).toHaveBeenCalled();
            expect(BookingModalService.closeAllCurrentModals).toHaveBeenCalled();
            expect(NavigationManagerService.ignoreOrderBeforeRedirect).toHaveBeenCalledWith(step.page as any);
            expect(BookingRedirectionService.path).toHaveBeenCalledWith(step.page);
            expect( DigitalDataEventsService.getEventStepLabel ).toHaveBeenCalled();
        }));
        it('should not call BookingRedirectionService.path method when not confirmed', fakeAsync(() => {
            const { BookingRedirectionService, StepsControlService, stepClicked, BookingModalService, NavigationManagerService } = component;
            spyOn(stepClicked, 'emit').and.callThrough();
            StepsControlService.mustReject = true;
            const step = {index: 0, page: 'test', text: 'Test Step'} as HeaderStep;
            component.stepClick(step);
            flushMicrotasks();
            expect(stepClicked.emit).toHaveBeenCalled();
            expect(BookingModalService.closeAllCurrentModals).not.toHaveBeenCalled();
            expect(NavigationManagerService.ignoreOrderBeforeRedirect).not.toHaveBeenCalled();
            expect(BookingRedirectionService.path).not.toHaveBeenCalled();
        }));
    });
});
