import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IbMmbVcFareComparisonModalComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-changes/cmpnts/ib-MmB-vc-summary/components/ib-MmB-vc-fare-comparison-banner/components/ib-MmB-vc-fare-comparison-modal/ib-MmB-vc-fare-comparison-modal.component';
import { IbMmbVcFareComparisonBannerComponent } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-changes/cmpnts/ib-MmB-vc-summary/components/ib-MmB-vc-fare-comparison-banner/ib-MmB-vc-fare-comparison-banner.component';
import { createSliceMock } from './mocks/ib-MmB-vc-fare-comparison-banner.mock';

describe('IbMmbVcFareComparisonBannerComponent', () => {
    let component: IbMmbVcFareComparisonBannerComponent;
    let fixture: ComponentFixture<IbMmbVcFareComparisonBannerComponent>;
    let ngbModalMock: { open: jasmine.Spy };

    beforeEach(async () => {
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return empty slices when fareComparisonModel is undefined', () => {
        component.fareComparisonModel = undefined;

        expect(component.slices).toEqual([]);
    });

    it('should return slices from fareComparisonModel', () => {
        const model = {
            slices: [
                createSliceMock(),
                createSliceMock({ sliceId: 'BCN-PMI', origin: 'BCN', destination: 'PMI' })
            ]
        };

        component.fareComparisonModel = model;

        expect(component.slices).toEqual(model.slices);
    });

    it('should build route code with origin and destination', () => {
        expect(component.getRouteCode(createSliceMock({ destination: 'LHR' }))).toBe('MAD-LHR');
    });

    it('should render one route block per slice in template', () => {
        component.fareComparisonModel = {
            slices: [
                createSliceMock(),
                createSliceMock({ sliceId: 'BCN-PMI', origin: 'BCN', destination: 'PMI' })
            ]
        };

        fixture.detectChanges();

        const routeRows = fixture.nativeElement.querySelectorAll('.vc-fare-comparison-banner__route');
        const routeCodes = fixture.nativeElement.querySelectorAll('.vc-fare-comparison-banner__route-code');

        expect(routeRows.length).toBe(2);
        expect(routeCodes[0].textContent.trim()).toBe('MAD-BCN');
        expect(routeCodes[1].textContent.trim()).toBe('BCN-PMI');
    });

    it('should call openModalCompareFares with slice when compare button is clicked', () => {
        const slice = createSliceMock();
        component.fareComparisonModel = { slices: [slice] };
        fixture.detectChanges();

        spyOn(component, 'openModalCompareFares');

        const compareButton: HTMLButtonElement = fixture.nativeElement.querySelector('.vc-fare-comparison-banner__compare-btn');
        compareButton.click();

        expect(component.openModalCompareFares).toHaveBeenCalledWith(slice);
    });

    it('should open comparison modal with selected slice', () => {
        const slice = createSliceMock();

        component.openModalCompareFares(slice);

        expect(ngbModalMock.open).toHaveBeenCalledWith(
            IbMmbVcFareComparisonModalComponent,
            jasmine.objectContaining({
                centered: true,
                backdrop: 'static',
                size: 'xl',
                windowClass: 'ib-modals ib-modals--fare-comparison'
            })
        );

        const modalRef = ngbModalMock.open.calls.mostRecent().returnValue;
        expect(modalRef.componentInstance.comparisonSlice).toEqual(slice);
    });
});
