import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IbMmbVcFareComparisonModalComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-changes/cmpnts/ib-MmB-vc-summary/components/ib-MmB-vc-fare-comparison-banner/components/ib-MmB-vc-fare-comparison-modal/ib-MmB-vc-fare-comparison-modal.component';
import {
    createConditionMock,
    createExtendedInfoMock,
    createFareFamilyMock,
    createSliceMock
} from './mocks/ib-MmB-vc-fare-comparison-banner.mock';

describe('IbMmbVcFareComparisonModalComponent', () => {
    let component: IbMmbVcFareComparisonModalComponent;
    let fixture: ComponentFixture<IbMmbVcFareComparisonModalComponent>;
    let activeModalMock: { close: jasmine.Spy };

    beforeEach(async () => {
        activeModalMock = {
            close: jasmine.createSpy('close')
        };

        await TestBed.configureTestingModule({
            declarations: [IbMmbVcFareComparisonModalComponent],
            imports: [CommonModule],
            providers: [
                { provide: NgbActiveModal, useValue: activeModalMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbMmbVcFareComparisonModalComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should expose fare names and conditions from comparisonSlice', () => {
        component.comparisonSlice = createSliceMock({
            previousFareFamily: createFareFamilyMock({
                commercialName: 'Turista Basica'
            }),
            newFareFamily: createFareFamilyMock({
                commercialName: 'Turista Optima'
            })
        });

        expect(component.previousFareName).toBe('Turista Basica');
        expect(component.newFareName).toBe('Turista Optima');
        expect(component.previousConditions.length).toBe(1);
        expect(component.newConditions.length).toBe(1);
    });

    it('should fallback safely when comparisonSlice is undefined', () => {
        component.comparisonSlice = undefined;

        expect(component.previousFareName).toBe('-');
        expect(component.newFareName).toBe('-');
        expect(component.previousConditions).toEqual([]);
        expect(component.newConditions).toEqual([]);
    });

    it('should return condition description from message or text', () => {
        expect(component.getConditionDescription(createConditionMock())).toBe('Con coste.');
        expect(component.getConditionDescription(createConditionMock({
            text: 'Incluido.',
            extendedInfo: createExtendedInfoMock({ message: '' })
        }))).toBe('Incluido.');
        expect(component.getConditionDescription(createConditionMock({
            text: '',
            extendedInfo: createExtendedInfoMock({ message: '' })
        }))).toBe('');
    });

    it('should close modal when close button is clicked', () => {
        component.comparisonSlice = createSliceMock({
            previousFareFamily: createFareFamilyMock({ commercialName: 'A', conditions: [] }),
            newFareFamily: createFareFamilyMock({ commercialName: 'B', conditions: [] })
        });
        fixture.detectChanges();

        const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.ib-modals__button-action');
        closeButton.click();

        expect(activeModalMock.close).toHaveBeenCalled();
    });
});
