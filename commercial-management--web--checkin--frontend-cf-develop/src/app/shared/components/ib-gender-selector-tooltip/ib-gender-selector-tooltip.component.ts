import { Component, Input } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

import { IbPassengerInfo } from '@src/app/core/models/ib-check-in-flights-passengers/ib-passenger-info.model';

@Component({
    selector: 'ib-gender-selector-tooltip',
    templateUrl: './ib-gender-selector-tooltip.component.html',
    styleUrls: ['./ib-gender-selector-tooltip.component.scss']
})
export class IbGenderSelectorTooltipComponent {
    @Input() passengerInfo: IbPassengerInfo;
    @Input() index: number;

    constructor () {}
}

downgradeToAJSComponent(
    'ibGenderSelectorTooltip',
    {
        component: IbGenderSelectorTooltipComponent
    },
    'ib-gender-selector-tooltip-module'
);
