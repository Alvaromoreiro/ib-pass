import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IbMobileRibbonDayComponent } from '@pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-mobile-ribbon/components/ib-mobile-ribbon-day/ib-mobile-ribbon-day.component';
import { AJSRootScope } from 'ib-web-commons/utils';
import { CurrentDayAvailableMock } from '@test-mocks/unit/app/pages/ib-booking-availability/ib-booking-sliced-availability/ib-booking-mobile-ribbon/CalendarData-mock';
import { TranslateServiceMock } from '@test-mocks/Services/TranslateServiceAngularMock';
import { TranslatePipeMock } from '@test-mocks/pipes/TranslatePipeMock';
import { BookingAvailabilityConstants } from '@src/app/core/constants/ib-booking-availability-constants';
class IntersectionObserverMock {
    observe = jasmine.createSpy('observe');
    disconnect = jasmine.createSpy('disconnect');
    mockIntersected (isIntersecting: boolean) {
        const entries = [{ isIntersecting } as IntersectionObserverEntry];
        this.callback(entries);
      

    } 
    constructor ( private callback) {   
    }
}
let fakeRootScope;
let fakeTranslateService;
class RootScopeMock {
    public $broadcast = jasmine.createSpy('$broadcast');
}
describe('IbMobileRibbonDayComponent', () => {
    let component: IbMobileRibbonDayComponent;
    let fixture: ComponentFixture<IbMobileRibbonDayComponent>;
    fakeRootScope = new RootScopeMock();
    fakeTranslateService = new TranslateServiceMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbMobileRibbonDayComponent, TranslatePipeMock],
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

        fixture = TestBed.createComponent(IbMobileRibbonDayComponent);
        component = fixture.componentInstance;
        component.currentDay = CurrentDayAvailableMock as AvailabilityTransformerModel.GenerateSliceInfo;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    } );
    describe( 'when ngOnChanges is called', () => {
        it( 'it should set the properties correctly', () => {
            component.currentSelected = 181;
            component.dateState = 'AVAILABLE';
            component.ngOnChanges();
            fixture.detectChanges();
            expect( component.availableFlights ).toEqual( true );
            expect( component.isLoading ).toEqual( false );
            expect( component.selected ).toEqual( true );
        } );
        it( 'it should set priceText with Loading', () => {
            component.dateState = BookingAvailabilityConstants.SLICK_STATUS.LOADING;
            component.ngOnChanges();
            fixture.detectChanges();
            expect( component.dateState ).toEqual( 'LOADING' );
        } );
        it( 'it should set priceText with Not Flights', () => {
            component.dateState = BookingAvailabilityConstants.SLICK_STATUS.NOT_AVAILABLE;
            component.ngOnChanges();
            fixture.detectChanges();
            expect( component.dateState ).toEqual( 'NOT_AVAILABLE' );
        } );
    } );
    describe( 'when onOpenSeeker is called', () => {
        it( 'it should call rootScope.$broadcast with openAdvancedSearchAndOpenCalendar and input parameter', () => {
            component.onOpenSeeker( 'RETURN' );
            expect( component[ 'rootScope' ].$broadcast ).toHaveBeenCalledWith( 'openAdvancedSearchAndOpenCalendar', 'RETURN' );
        });
    });
    describe( 'when onChangeDay is called', () => {
        it( 'it should emits the output with currentDay', () => {
            spyOn( component.changeDay, 'emit' );
            component.onChangeDay();
            fixture.detectChanges();
            expect( component.changeDay.emit ).toHaveBeenCalled();
            expect( component.changeDay.emit ).toHaveBeenCalledWith( { slide: component.currentDay, isNext: false } );
        });
    });
    describe('setScrollIntersectionObserver', () => {
        const OriginalIntersectionObserver =  window.IntersectionObserver;
        let emitSpy: jasmine.Spy;

        beforeEach(() => {
            window.IntersectionObserver = IntersectionObserverMock as any;
        });
        afterEach(() => {
            window.IntersectionObserver = OriginalIntersectionObserver;
        });


        function testIntersectionObserver (isIntersecting: boolean, state: string, shouldEmit: boolean) {
            emitSpy = spyOn(component.dayLoadingVisible, 'emit');
            component.currentDay.state = state;
            component.ngAfterViewInit();
            const mockObserver = component['intersectionObserver'] as any;
            mockObserver?.mockIntersected(isIntersecting);
            if (shouldEmit) {
                expect(emitSpy).toHaveBeenCalledWith(component.currentDay.slidePosition);
            } else {
                expect(emitSpy).not.toHaveBeenCalled();
            }
            if(state !== BookingAvailabilityConstants.SLICK_STATUS.LOADING) {
                expect(mockObserver?.disconnect).toHaveBeenCalled();
            }
        }

        it('should emit dayLoadingVisible if the element is intersecting and state is LOADING', () => {
            testIntersectionObserver(true, BookingAvailabilityConstants.SLICK_STATUS.LOADING, true);
        });

        it('should not emit dayLoadingVisible if the element is not intersecting', () => {
            testIntersectionObserver(false, BookingAvailabilityConstants.SLICK_STATUS.LOADING, false);
        });

        it('should not emit dayLoadingVisible if the element is intersecting but is loaded', () => {
            testIntersectionObserver(true, BookingAvailabilityConstants.SLICK_STATUS.AVAILABLE, false);
        });
    });

});
