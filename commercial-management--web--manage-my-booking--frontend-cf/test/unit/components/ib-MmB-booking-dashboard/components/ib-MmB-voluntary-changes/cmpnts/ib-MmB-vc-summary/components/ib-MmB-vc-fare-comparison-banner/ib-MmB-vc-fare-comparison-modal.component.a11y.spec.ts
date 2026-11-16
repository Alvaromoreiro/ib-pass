import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IbMmbVcFareComparisonModalComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-changes/cmpnts/ib-MmB-vc-summary/components/ib-MmB-vc-fare-comparison-banner/components/ib-MmB-vc-fare-comparison-modal/ib-MmB-vc-fare-comparison-modal.component';
import { axeMatchers, checkA11y } from '@test/helpers/axe-helper';
import { createSliceMock } from './mocks/ib-MmB-vc-fare-comparison-banner.mock';

describe('IbMmbVcFareComparisonModalComponent a11y', () => {
    let component: IbMmbVcFareComparisonModalComponent;
    let fixture: ComponentFixture<IbMmbVcFareComparisonModalComponent>;

    beforeEach(async () => {
        jasmine.addMatchers(axeMatchers);

        await TestBed.configureTestingModule({
            declarations: [IbMmbVcFareComparisonModalComponent],
            imports: [CommonModule],
            providers: [
                { provide: NgbActiveModal, useValue: { close: jasmine.createSpy('close') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbMmbVcFareComparisonModalComponent);
        component = fixture.componentInstance;
        component.comparisonSlice = createSliceMock();
        fixture.detectChanges();
    });

    it('should not have accessibility violations', async () => {
        const results = await checkA11y(fixture.nativeElement);
        (expect(results) as any).toHaveNoA11yViolations();
    });

    it('should expose close buttons with accessible name from design', () => {
        const closeButtons: NodeListOf<HTMLButtonElement> = fixture.nativeElement.querySelectorAll(
            'button[aria-label="Cerrar comparativa de tarifas"]'
        );

        expect(closeButtons.length).toBe(2);
        closeButtons.forEach(button => {
            expect(button.getAttribute('aria-label')).toBe('Cerrar comparativa de tarifas');
        });
    });
});