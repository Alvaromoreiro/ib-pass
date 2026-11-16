import { Component, Input } from '@angular/core';
import { IbCUserUtilsService } from 'ib-web-commons/utils/';

@Component({
    selector: 'ib-booking-header-user-tooltip',
    templateUrl: './ib-booking-header-user-tooltip.component.html',
    styleUrls: ['./ib-booking-header-user-tooltip.component.scss']
})
export class IbBookingHeaderUserTooltipComponent {
    @Input() public model;
    @Input() public headerMobile?;
    constructor (
        private CommonsUserUtilsService: IbCUserUtilsService
    ) { }

    public isIbPlus () {
        return this.CommonsUserUtilsService.isIbPlus();
    }
}
