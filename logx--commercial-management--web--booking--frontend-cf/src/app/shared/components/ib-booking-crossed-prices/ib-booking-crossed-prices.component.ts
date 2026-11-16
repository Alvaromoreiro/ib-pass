import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

type Variant = 'slice' | 'slice-detail' | 'fare' | 'detail' | 'slice mobile';

@Component({
    selector: 'ib-booking-crossed-prices',
    templateUrl: './ib-booking-crossed-prices.component.html',
    styleUrls: ['./ib-booking-crossed-prices.component.scss']
})

export class IbBookingCrossedPricesComponent implements OnInit {
    @Input() public priceToShow: string;
    @Input() public priceWithoutDiscount: string | null;
    @Input() public variant: Variant;
    @Input() public isBestOffer: boolean = false;
    public hasDiscount: boolean;
    
    constructor (
        private TranslateService: TranslateService
    ) {}

    ngOnInit (): void {
        this.hasDiscount = this.priceWithoutDiscount != null && `${this.priceWithoutDiscount}` !== '' && this.priceWithoutDiscount !== this.priceToShow;
    }

}

downgradeToAJSComponent(
    'ibBookingCrossedPrices',
    { 
        component: IbBookingCrossedPricesComponent,
        inputs: ['priceToShow', 'priceWithoutDiscount', 'variant', 'isBestOffer'],
        outputs: []
    },
    
    'ib-booking-crossed-prices-module'
);
