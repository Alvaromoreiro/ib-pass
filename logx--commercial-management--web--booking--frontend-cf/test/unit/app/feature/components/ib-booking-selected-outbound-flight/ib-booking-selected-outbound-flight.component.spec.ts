import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
    flushMicrotasks
} from '@angular/core/testing';

import { IbBookingSelectedOutboundFlightComponent } from '@src/app/pages/ib-booking-availability-page/components/ib-booking-sliced-availability/components/ib-booking-selected-outbound-flight/ib-booking-selected-outbound-flight.component';
import { AJSRootScope } from 'ib-web-commons/utils';
import { TranslatePipeMock } from '@src/app/shared/components/ib-booking-partners-modal/ib-booking-partners-modal.component.spec';
import { selectedSliceMock } from './mocks/selected-slice-info.mock';
import { By } from '@angular/platform-browser';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
class FakeWindow {
    constructor(private distinctive: string = '') {
    }
    public innerWidth = 0;
    public dispatchEvent(event: Event) {
        window.dispatchEvent(new Event(`mock${this.distinctive}-${event.type}`))
    }
    public removeEventListener(evName: string = '', callback: (args) => {}) {
        window.removeEventListener(`mock${this.distinctive}-${evName}`,callback)
    }
    public addEventListener(evName: string = '', callback: (args) => {}) {
        window.addEventListener(`mock${this.distinctive}-${evName}`,callback)
    }
    public document = window.document;
}

class RootScopeMock {
    public isMobile = {
        general: false,
        header: false
    };
}

describe('IbBookingSelectedOutboundFlightComponent', () => {
    let component: IbBookingSelectedOutboundFlightComponent;
    let fixture: ComponentFixture<IbBookingSelectedOutboundFlightComponent>;
    let fakeRootScope: RootScopeMock;
    let fakeWindow: FakeWindow;

    beforeEach(async () => {
        fakeRootScope = new RootScopeMock();
        selectedSliceMock.info.stopsNumber = 0;
        selectedSliceMock.info.technicalStop = 0;
        selectedSliceMock.info.daysOfTravel = 0;
        fakeWindow = new FakeWindow(); ('IbBookingSelectedOutboundFlightComponent');
        await TestBed.configureTestingModule({
            declarations: [
                IbBookingSelectedOutboundFlightComponent,
                TranslatePipeMock,
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: WINDOW_TOKEN, useValue: fakeWindow}
            ],
        }).compileComponents();
        fixture = TestBed.createComponent( IbBookingSelectedOutboundFlightComponent );
        component = fixture.componentInstance;
        component.selectedFlight = selectedSliceMock;
    });

    it( 'should create component', () => {
        component.ngOnChanges();
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });
    describe( 'When selectedFlight cabinType is Economy', () => {
        beforeEach(async () => {
            selectedSliceMock.info.selectedFareFamily.cabinType = 'E';
        });
        it ( 'should return cabin-economy as fareClass', fakeAsync( () => {
            component.selectedFlight = selectedSliceMock;
        component.ngOnChanges();
            fixture.detectChanges();
            flushMicrotasks();
            tick(100);
            expect( component.fareClass ).toEqual( 'cabin-economy' );
            expect( component.sliceModel.flightDuration.type.text ).toEqual( 'AVAILABILITY_SLICE_INFO_NONSTOP_FLIGHT' );
            expect( component.sliceModel.daysOfTravel ).toBeNull();
        }) );
    });
    describe( 'When selectedFlight cabinType is Business and 2 stops', () => {
        beforeEach(async () => {
            selectedSliceMock.info.selectedFareFamily.cabinType = 'B';
            selectedSliceMock.info.stopsNumber = 2;
        });
        it ( 'should return cabin-businss as fareClass', fakeAsync( () => {
            component.selectedFlight = selectedSliceMock;
            component.ngOnChanges();
            fixture.detectChanges();
            flushMicrotasks();
            tick(100);
            expect( component.fareClass ).toEqual( 'cabin-business' );
            expect( component.sliceModel.flightDuration.type.stops ).toEqual( 2 );
            expect( component.sliceModel.flightDuration.type.text ).toEqual( 'SOME_AVAILABILITY_STOPSNUMBER_FILTER' );
        }) );
    });
    describe( 'When selectedFlight cabinType is Premium Economy, one stop and one travelDays', () => {
        beforeEach(async () => {
            selectedSliceMock.info.selectedFareFamily.cabinType = 'N';
            selectedSliceMock.info.stopsNumber = 1;
            selectedSliceMock.info.daysOfTravel = 1;
        });
        it ( 'should return cabin-premiumeconomy as fareClass', fakeAsync( () => {
            component.selectedFlight = selectedSliceMock;
            component.ngOnChanges();
            fixture.detectChanges();
            flushMicrotasks();
            tick(100);
            expect( component.fareClass ).toEqual( 'cabin-premiumeconomy' );
            expect( component.sliceModel.flightDuration.type.stops ).toEqual( 1 );
            expect( component.sliceModel.flightDuration.type.text ).toEqual( 'AVAILABILITY_STOPSNUMBER_FILTER' );
            expect( component.sliceModel.daysOfTravel.days ).toEqual( 1 );
            expect( component.sliceModel.daysOfTravel.text ).toEqual( 'AVAILABILITY_SLICE_INFO_DAY' );
        }) );
    });
    describe( 'When selectedFlight cabinType is Premium Business, one techStop and two travelDays', () => {
        beforeEach(async () => {
            selectedSliceMock.info.selectedFareFamily.cabinType = 'T';
            selectedSliceMock.info.technicalStop = 1;
            selectedSliceMock.info.stopsNumber = 0;
            selectedSliceMock.info.daysOfTravel = 2;
        });
        it ( 'should return cabin-premiumtourist as fareClass', fakeAsync( () => {
            component.selectedFlight = selectedSliceMock;
            component.ngOnChanges();
            fixture.detectChanges();
            flushMicrotasks();
            tick(100);
            expect( component.fareClass ).toEqual( 'cabin-premiumtourist' );
            expect( component.sliceModel.flightDuration.type.stops ).toEqual( 1 );
            expect( component.sliceModel.flightDuration.type.text ).toEqual( 'AVAILABILITY_TECH_STOP' );
            expect( component.sliceModel.daysOfTravel.days ).toEqual( 2 );
            expect( component.sliceModel.daysOfTravel.text ).toEqual( 'SOME_AVAILABILITY_SLICE_INFO_DAY' );
        }) );
    });
    xdescribe( 'When window resize is trigger', () => {
        beforeEach(async () => {
            fakeRootScope.isMobile = {
                general: true,
                header: true
            };
            component.selectedFlight = selectedSliceMock;
            spyOn( component, 'onResize' );
            window.innerWidth = 600;
            window.dispatchEvent( new Event( 'resize' ) );
        });
        it( 'should call onResize method', fakeAsync( () => {
            component.ngOnChanges();
            fixture.detectChanges();
            tick( 100 );
            expect( component.onResize ).toHaveBeenCalled();
        }) );
    });
    describe( 'When button is clicked', () => {
        it( 'should call returnToOutboundSelection method', fakeAsync( () => {
            component.selectedFlight = selectedSliceMock;
            spyOn( component, 'returnToOutboundSelection' );
            component.ngOnChanges();
            fixture.detectChanges();
            const button = fixture.debugElement.query( By.css( 'button' ) );
            button.triggerEventHandler( 'click', null );
            flushMicrotasks();
            tick( 1000 );
            expect( component.returnToOutboundSelection ).toHaveBeenCalled();
        }) );
    } );
    describe( 'When componente runs OnInit', () => {
        it( 'should emit the custom event that will be listened by monetate', () => {
            spyOn( component, 'mnttCall' );
            component.ngOnInit();
            expect( component.mnttCall ).toHaveBeenCalled();
        } );
    } );
    afterEach(() => {
        TestBed.resetTestingModule();
    });
});
