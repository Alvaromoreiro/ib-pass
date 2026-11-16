import { Component, Input } from '@angular/core';
import { TaxBreakdown } from '@core/models/ib-booking-on-hold-confirmation/ib-price-breakdown-on-hold-conf-model';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbTaxBreakdownModalComponent } from './components/ib-tax-breakdown-modal/ib-tax-breakdown-modal.component';
import { PassengerPrices, Price, PaidDeposit, VoucherDiscount } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';

@Component({
    selector: 'ib-price-breakdown-on-hold-conf',
    templateUrl: './ib-price-breakdown-on-hold-conf.component.html',
    styleUrls: ['./ib-price-breakdown-on-hold-conf.component.scss']
})

export class IbPriceBreakdownOnHoldConfComponent {

    @Input() price: Price;
    @Input() passengerPrices: PassengerPrices;
    @Input() paidDeposit: PaidDeposit;
    @Input() originalPrice: string;
    @Input() voucherDiscount: VoucherDiscount;

    constructor (private IbCModalService:IbCModalService) {}

    openTaxBreakdownModal (taxBreakdown:TaxBreakdown[]) {
        const modalOptions = {
            windowClass: 'ib-modals bki-dialog'
        };
        const modal = this.IbCModalService.showGenericComponentModal(IbTaxBreakdownModalComponent, modalOptions);
        const componentInstance = modal.componentInstance as { model: TaxBreakdown[] | undefined; };
        componentInstance.model = taxBreakdown;
        modal.result.then(()=>{}, ()=>{});
    }
}
