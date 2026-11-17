import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IbSegmentSectionComponent } from './ib-segment-section.component';
import { Component, Input } from '@angular/core';
import { mockBoardingCardsModelMap } from '../../mocks/ib-boarding-cards-modal.mocks';
import { IbBoardingCardsModalService } from '../../services/ib-boarding-cards-modal.service';
import dayjs from 'dayjs';

@Component({
    selector: 'ib-passenger-row',
    template: ''
})
class MockIbPassengerRow {
    @Input() passengerInfo: CkiBoardingCardModal.PassengerMap;
}

describe('IbSegmentSectionComponent', () => {
    let component: IbSegmentSectionComponent;
    let fixture: ComponentFixture<IbSegmentSectionComponent>;
    let fakeIbBoardingCardsModalService: jasmine.SpyObj<IbBoardingCardsModalService>;

    beforeEach(async () => {
        fakeIbBoardingCardsModalService = jasmine.createSpyObj('IbBoardingCardsModalService', ['closeGoogleWalletModal']);

        await TestBed.configureTestingModule({
            declarations: [IbSegmentSectionComponent, MockIbPassengerRow],
            providers: [
                { provide: IbBoardingCardsModalService, useValue: fakeIbBoardingCardsModalService}
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbSegmentSectionComponent);
        component = fixture.componentInstance;

        component.segmentInfo = structuredClone(mockBoardingCardsModelMap[0]);

        fixture.detectChanges();
    });

    describe('component initialize', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should setSegmentTitle called', () => {
            spyOn(component, 'setSegmentTitle');
            component.ngOnInit();

            expect(component.setSegmentTitle).toHaveBeenCalled();
        });

        it('should set segmentDate with the correct information', () => {
            component.segmentInfo.departure.date = '2025-06-15T14:30:00';
            const result = '15/06/2025 - 14:30';

            component.ngOnInit();

            expect(component.segmentDate).toBe(result);
        });

        it('should set segmentDate to the current date if not exists', () => {
            component.segmentInfo.departure.date = null;

            const result = dayjs().format('DD/MM/YYYY - HH:mm');

            component.ngOnInit();

            expect(component.segmentDate).toBe(result);
        });
    });

    describe('getSegmentTitle', () => {
        it('should return the title with the correct format', () => {
            const mockDepartureTitle = 'Madrid (MAD)';
            const mockArriveTitle = 'Bilbao (BIO)';
            component.ngOnInit();

            expect(component.departureTitle).toBe(mockDepartureTitle);
            expect(component.arriveTitle).toBe(mockArriveTitle);
        });
    });

    describe('downloadGw', () => {
        it('should close the modal with close state and correct information', () => {
            const expected: CkiBoardingCardModal.PrintResultModel = { passengerId: '1', segmentId: '3' };

            component.downloadGW({ passengerId: expected.passengerId });

            expect(fakeIbBoardingCardsModalService.closeGoogleWalletModal).toHaveBeenCalledWith('close', expected);
        });
    });
});
