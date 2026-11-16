import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbBookingMobileRibbonComponent } from '@pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-mobile-ribbon/ib-booking-mobile-ribbon.component';
import { CalendarDataRibbonMock } from '@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-mobile-ribbon/CalendarData-mock';
import { IbMobileRibbonDayComponent } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-mobile-ribbon/components/ib-mobile-ribbon-day/ib-mobile-ribbon-day.component';
import { AJSRootScope } from 'ib-web-commons/utils';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
import { TranslatePipeMock } from '@test-mocks/pipes/TranslatePipeMock';
let fakeRootScope;
let fakeTranslateService;
class RootScopeMock {
    public $broadcast = jasmine.createSpy('$broadcast');
}
describe('IbBookingMobileRibbonComponent', () => {
    let component: IbBookingMobileRibbonComponent;
    let fixture: ComponentFixture<IbBookingMobileRibbonComponent>;
    fakeRootScope = new RootScopeMock();
    fakeTranslateService = new TranslateServiceMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbBookingMobileRibbonComponent,
                IbMobileRibbonDayComponent,
                TranslatePipeMock
            ],
            imports: [
                TranslateModule.forRoot(),
                FormsModule,
                CommonModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: TranslateService, useValue: fakeTranslateService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingMobileRibbonComponent);
        component = fixture.componentInstance;
        component.calendarData = CalendarDataRibbonMock;
        component.ngOnChanges();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'When onChangeDay is called', () => {
        it( 'it should call changeDay output', () => {
            spyOn( component.changeDay, 'emit' );
            component.onChangeDay( {} );
            fixture.detectChanges();
            expect( component.changeDay.emit ).toHaveBeenCalled();
            expect( component.changeDay.emit ).toHaveBeenCalledWith( {} );
        });
    });
    describe( 'When onResize is called', () => {
        it( 'it should call scrollToSelected', () => {
            spyOn( component, 'scrollToSelected' );
            component.onResize();
            expect( component.scrollToSelected ).toHaveBeenCalled();
        });
    });
    describe( 'When scrollHandler is called', () => {
        it( 'it should set properly with isNext false', () => {
            spyOn( component.ribbonDays, 'scrollBy');
            component.scrollHandler( false );
            expect( component.ribbonDays.scrollBy ).toHaveBeenCalled();
        });
        it('it should set properly with isNext true', () => {
            spyOn( component.ribbonDays, 'scrollBy');
            component.scrollHandler( true );
            expect( component.ribbonDays.scrollBy ).toHaveBeenCalled();
        });
    });
    describe('When onDayLoadingVisible is called', () => {
        function testOnLoadingVisible (selectedDay, loadIndex){
            component.calendarData.selectedSlide=selectedDay;
            spyOn(component.nextDay, 'emit');
            component.onDayLoadingVisible(loadIndex);
            expect(component.nextDay.emit).toHaveBeenCalledWith({ loadIndex: loadIndex, isLower: loadIndex < selectedDay  });
        }

        it('should emit event to load day and next day is lower', () => {
            testOnLoadingVisible(1, 0);
        });
        it('should emit event to load day and next day is higher', () => {
            testOnLoadingVisible(0, 1);
        });
    });
});