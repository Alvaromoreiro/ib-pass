import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { IbMmbVcFareComparisonModalComponent } from './components/ib-MmB-vc-fare-comparison-modal/ib-MmB-vc-fare-comparison-modal.component';
import { FareComparisonModel, Slice } from './model/ib-MmB-vc-fare-comparison-banner.model';


@Component({
    selector: 'ib-mmb-vc-fare-comparison-banner',
    templateUrl: './ib-MmB-vc-fare-comparison-banner.component.html',
    styleUrls: ['./ib-MmB-vc-fare-comparison-banner.component.scss']
})
export class IbMmbVcFareComparisonBannerComponent {
    @Input() public fareComparisonModel: FareComparisonModel;

    constructor(
        private NgbModal: NgbModal
    ) {}

    get slices(): Slice[] {
        return this.fareComparisonModel?.slices || [];
    }

    getRouteCode = (slice: Slice): string => {
        const origin = slice?.origin || '';
        const destination = slice?.destination || '';

        return `${origin}-${destination}`;
    };

    openModalCompareFares = (slice: Slice) => {
        const modalRef = this.NgbModal.open(IbMmbVcFareComparisonModalComponent, {
            centered: true,
            backdrop: 'static',
            size: 'xl',
            windowClass: 'ib-modals ib-modals--fare-comparison'
        });

        modalRef.componentInstance.comparisonSlice = slice;
    };
}

downgradeToAJSComponent(
    'ibMmbVcFareComparisonBanner',
    {
        component: IbMmbVcFareComparisonBannerComponent,
        inputs: ['fareComparisonModel']
    },
    'ib-MmB-vc-fare-comparison-banner-module'
);
