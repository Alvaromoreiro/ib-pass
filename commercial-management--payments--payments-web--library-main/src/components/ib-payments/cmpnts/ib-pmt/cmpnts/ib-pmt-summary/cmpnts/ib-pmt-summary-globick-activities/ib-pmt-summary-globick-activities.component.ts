import { IbPmtSummaryGlobickActivities } from './ib-pmt-summary-globick-activities.model';
import { Component, Input } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector:'ib-pmt-summary-globick-activities',
    templateUrl:'./ib-pmt-summary-globick-activities-view.component.html'
})
export class IbPmtSummaryGlobickActivitiesComponent {
    @Input()
    public model: IbPmtSummaryGlobickActivities;
}

downgradeToAJSComponent('ibPmtSummaryGlobickActivities', {
    component: IbPmtSummaryGlobickActivitiesComponent,
    inputs: ['model']
}, 'ib-pmt-summary-globick-activities-module');
