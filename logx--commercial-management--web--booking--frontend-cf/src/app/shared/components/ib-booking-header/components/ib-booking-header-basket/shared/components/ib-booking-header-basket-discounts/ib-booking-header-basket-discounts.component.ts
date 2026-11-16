import { Component, Input } from '@angular/core';

@Component({
    selector: 'ib-booking-header-basket-discounts',
    templateUrl: './ib-booking-header-basket-discounts.component.html',
    styleUrls: ['./ib-booking-header-basket-discounts.component.scss']
})
export class IbBookingHeaderBasketDiscountsComponent {
    @Input() public model;
}
