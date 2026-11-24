import { IbPmtSummaryGlobickTransfers } from './ib-pmt-summary-globick-transfers.model';
import { Component, Input } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector:'ib-pmt-summary-globick-transfers',
    templateUrl:'./ib-pmt-summary-globick-transfers-view.component.html'
})
export class IbPmtSummaryGlobickTransfersComponent {
    @Input()
    public model: IbPmtSummaryGlobickTransfers;
}

downgradeToAJSComponent('ibPmtSummaryGlobickTransfers', {
    component: IbPmtSummaryGlobickTransfersComponent,
    inputs: ['model']
}, 'ib-pmt-summary-globick-transfers-module');  