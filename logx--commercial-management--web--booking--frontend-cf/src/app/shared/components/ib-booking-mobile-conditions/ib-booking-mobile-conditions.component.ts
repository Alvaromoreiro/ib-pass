import { Component, Input } from '@angular/core';
import { LoyaltyProgramEarnModel } from '@src/app/core/models/generic-models/generic-models';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-mobile-conditions',
    templateUrl: './ib-booking-mobile-conditions.component.html',
    styleUrls: ['./ib-booking-mobile-conditions.component.scss']
})
export class IbBookingMobileConditionsComponent {
    @Input() conditionsText: string;
    @Input() loyaltyProgramEarnInfo?: LoyaltyProgramEarnModel;
    constructor () {}
}
downgradeToAJSComponent(
    'ibBookingMobileConditionsLegacy',
    {
        component: IbBookingMobileConditionsComponent,
        inputs: [],
        outputs: []
    },
    'ib-reusable-components-module'
);