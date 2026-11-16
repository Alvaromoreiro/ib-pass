import { Component, Input, OnChanges } from '@angular/core';
import { OthersFeesViewModelService } from '../../services/ib-booking-header-other-fees-view-model.service';
import { CommercialDataMarket } from '@src/app/core/models/generic-models/generic-models';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

@Component({
    selector: 'ib-booking-header-basket-other-fees',
    templateUrl: './ib-booking-header-basket-other-fees.component.html',
    styleUrls: ['./ib-booking-header-basket-other-fees.component.scss']
})
export class IbBookingHeaderBasketOtherFeesComponent implements OnChanges {
    @Input() public model;
    constructor (
        private OthersFeesViewModelService: OthersFeesViewModelService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}
    ngOnChanges ( changes: any ) {
        if ( changes.model.hasElements && changes.model.others.length === 0 ) {
            this.activate();
        }
    }

    public activate () {
        const commercialData: CommercialDataMarket = this.CommonsSessionStorageService.get( 'commercialData' );
        const currency: Currency = commercialData?.currency ?? BookingAppConstants.defaultCommercialInfo.currency as Currency;
        this.model = this.OthersFeesViewModelService.getOthersViewModel( currency );
    }
}
