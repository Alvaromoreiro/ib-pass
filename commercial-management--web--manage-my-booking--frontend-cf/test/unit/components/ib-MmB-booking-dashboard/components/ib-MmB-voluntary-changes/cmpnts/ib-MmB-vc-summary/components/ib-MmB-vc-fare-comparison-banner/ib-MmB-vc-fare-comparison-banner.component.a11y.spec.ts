import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IbMmbVcFareComparisonBannerComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-changes/cmpnts/ib-MmB-vc-summary/components/ib-MmB-vc-fare-comparison-banner/ib-MmB-vc-fare-comparison-banner.component';
import { axeMatchers, checkA11y } from '@test/helpers/axe-helper';
import { createSliceMock } from './mocks/ib-MmB-vc-fare-comparison-banner.mock';

describe('IbMmbVcFareComparisonBannerComponent a11y', () => {
    let component: IbMmbVcFareComparisonBannerComponent;
    let fixture: ComponentFixture<IbMmbVcFareComparisonBannerComponent>;
    let ngbModalMock: { open: jasmine.Spy };

    beforeEach(async () => {
        jasmine.addMatchers(axeMatchers);

        ngbModalMock = {
            open: jasmine.createSpy('open').and.returnValue({
                componentInstance: {}
            })
        };

        await TestBed.configureTestingModule({
            declarations: [IbMmbVcFareComparisonBannerComponent],
            imports: [CommonModule],
            providers: [
                { provide: NgbModal, useValue: ngbModalMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IbMmbVcFareComparisonBannerComponent);
        component = fixture.componentInstance;
    });

    it('should not have accessibility violations', async () => {
        component.fareComparisonModel = {
            slices: [createSliceMock()]
        };

        fixture.detectChanges();

        const results = await checkA11y(fixture.nativeElement);

        (expect(results) as any).toHaveNoA11yViolations();
    });

    it('should expose compare fares button with accessible name from design', () => {
        component.fareComparisonModel = {
            slices: [createSliceMock()]
        };

        fixture.detectChanges();

        const compareButton: HTMLButtonElement = fixture.nativeElement.querySelector('.vc-fare-comparison-banner__compare-btn');

        expect(compareButton.tagName).toBe('BUTTON');
        expect(compareButton.type).toBe('button');
        expect(compareButton.getAttribute('aria-label')).toBe('Ver comparativa de tarifas');
        expect(compareButton.textContent.trim()).toBe('Comparar tarifas');
    });
});
