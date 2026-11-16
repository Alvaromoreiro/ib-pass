import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';


@Component({
    selector: 'ib-pmt-pay-block',
    templateUrl: 'ib-pmt-pay-block.component.html',
    styleUrls: ['ib-pmt-pay-block.component.scss']
})

export class IbPmtPayBlockComponent implements OnChanges, OnInit {
    
    @Input() public mobileFlow: boolean;
    @HostBinding('class.mobile-bottom-fixed') mobileNoBackground  = false;
    public shouldShowCTA: boolean;

    constructor (
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService
    ) { }
    ngOnInit (): void {
        this.shouldShowCTA = this.IbBookingPriceDetailModalService.checkShouldShowCTA();
    }

    ngOnChanges (changes: SimpleChanges): void {
        this.mobileNoBackground = this.mobileFlow;
    }


    public openPriceDetailModal = ($event: Event): any => {
        this.IbBookingPriceDetailModalService.openPriceDetailModal($event);
    };
}
