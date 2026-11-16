import { Component, Input } from '@angular/core';
import { InsuranceAllianzFusionInfo } from '@src/app/core/models/header-model/header.model';

@Component({
    selector:'ib-MmB-summary-insurance-allianz-fusion',
    templateUrl:'./ib-MmB-summary-insurance-allianz-fusion-view.component.html'
})
export class IbMmBSummaryInsuranceAllianzFusionComponent {
    @Input() model: InsuranceAllianzFusionInfo;
}