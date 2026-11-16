import { Component, Input } from '@angular/core';
import { GlobickActivities } from '@src/app/core/models/header-model/header.model';

@Component({
    selector:'ib-MmB-summary-globick-activities',
    templateUrl:'./ib-MmB-summary-globick-activities-view.component.html',
    styleUrls: ['./ib-MmB-summary-globick-activities.scss']
})
export class IbMmBSummaryGlobickActivitiesComponent {
    @Input() model: GlobickActivities;
}
