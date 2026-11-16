import { Component, Input } from '@angular/core';

@Component({
    selector: 'ib-booking-header-basket-upgrading',
    templateUrl: './ib-booking-header-basket-upgrading.component.html',
    styleUrls: ['./ib-booking-header-basket-upgrading.component.scss']
})
export class IbBookingHeaderBasketUpgradingComponent {
    @Input() public model;
    @Input() public basketFunctions;
}
