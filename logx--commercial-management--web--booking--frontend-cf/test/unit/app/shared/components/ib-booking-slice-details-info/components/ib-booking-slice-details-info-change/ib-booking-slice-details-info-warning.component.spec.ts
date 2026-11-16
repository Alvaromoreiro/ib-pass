import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbBookingSliceDetailsInfoWarningComponent } from '@shared/components/ib-booking-slice-details-info/components/ib-booking-slice-details-info-warning/ib-booking-slice-details-info-warning.component';
import { trueAirportChange, trueTerminalChange } from './mocks/FlightChanges-mock'
import { sliceDetailsModelMock } from '../../mocks/SliceDetailsModel-mock';
import { TranslateModule } from '@ngx-translate/core';


describe('IbBookingSliceDetailsInfoWarningComponent test', () => {
    let component: IbBookingSliceDetailsInfoWarningComponent;
    let fixture: ComponentFixture<IbBookingSliceDetailsInfoWarningComponent>;
    let defaultSegment = sliceDetailsModelMock.segments[1];


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ IbBookingSliceDetailsInfoWarningComponent ],
            imports: [TranslateModule.forRoot()]

        })
            .compileComponents();

        fixture = TestBed.createComponent(IbBookingSliceDetailsInfoWarningComponent);
        component = fixture.componentInstance;
        component.warningModel = defaultSegment;

        fixture.detectChanges();
    });

    it('should not show if there is no appropriate info', () => {
        component.ngOnInit();
        let componentToTest = document.querySelector('.segment__description--change-terminal')
        expect(componentToTest).toBeNull();
    });

    it('should show correct airport change', () => {
        component.warningModel = { ...defaultSegment, airportChange: trueAirportChange };
        component.ngOnInit();
        expect(component.warningInfo.arrival).toBe('London Heathrow (LHR)');
        expect(component.warningInfo.departure).toBe('London Gatwick (LGW)');

    });

    it('should show correct terminal change', () => {
        component.warningModel = { ...defaultSegment, terminalChange: trueTerminalChange };
        component.ngOnInit();
        expect(component.warningInfo.arrival).toBe('B');
        expect(component.warningInfo.departure).toBe('E');

    });
});
