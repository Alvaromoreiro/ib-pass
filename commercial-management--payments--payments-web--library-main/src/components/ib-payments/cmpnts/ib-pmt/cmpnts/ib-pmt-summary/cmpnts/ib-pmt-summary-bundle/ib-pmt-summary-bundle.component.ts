import { Component, Input } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-pmt-summary-bundle',
    templateUrl: './ib-pmt-summary-bundle.component.html',
    styleUrls: ['./ib-pmt-summary-bundle.component.scss']
})
export class IbPmtSummaryBundleComponent  {

    @Input() bundles: any;

    constructor () { }

}


downgradeToAJSComponent('ibPmtSummaryBundle', {
    component: IbPmtSummaryBundleComponent,
    inputs: ['bundle']
}, 'ib-pmt-summary-bundle-module');
