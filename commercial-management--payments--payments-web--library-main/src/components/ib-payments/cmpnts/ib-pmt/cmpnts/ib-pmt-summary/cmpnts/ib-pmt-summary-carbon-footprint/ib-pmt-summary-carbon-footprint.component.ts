import { IbPmtSummaryCarbonFootprint } from './ib-pmt-summary-carbon-footprint.model';
import { Component, Input } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector:'ib-pmt-summary-carbon-footprint',
    templateUrl:'./ib-pmt-summary-carbon-footprint-view.component.html',
    styleUrls: ['./ib-pmt-summary-carbon-footprint.scss']
})
export class IbPmtSummaryCarbonFootprintComponent {
    @Input()
    public model: IbPmtSummaryCarbonFootprint;
}

downgradeToAJSComponent('ibPmtSummaryCarbonFootprint', {
    component: IbPmtSummaryCarbonFootprintComponent,
    inputs: ['model']
}, 'ib-pmt-summary-carbon-footprint-module');  