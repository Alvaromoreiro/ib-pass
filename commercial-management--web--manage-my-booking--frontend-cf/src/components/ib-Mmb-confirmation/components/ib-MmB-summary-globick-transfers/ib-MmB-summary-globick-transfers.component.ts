import { Component, Input } from '@angular/core';
import { GlobickTransfers } from '@src/app/core/models/header-model/header.model';

@Component({
    selector:'ib-MmB-summary-globick-transfers',
    templateUrl:'./ib-MmB-summary-globick-transfers-view.component.html',
    styleUrls: ['./ib-MmB-summary-globick-transfers.scss']
})
export class IbMmBSummaryGlobickTransfersComponent {
    @Input() model: GlobickTransfers;
}