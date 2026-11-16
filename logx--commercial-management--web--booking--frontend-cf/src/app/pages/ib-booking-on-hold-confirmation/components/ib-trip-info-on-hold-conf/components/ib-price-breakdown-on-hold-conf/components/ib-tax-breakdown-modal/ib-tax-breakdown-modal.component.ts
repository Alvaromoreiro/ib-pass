import { Component, Input } from '@angular/core';
import { TaxBreakdown } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-price-breakdown-on-hold-conf-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ib-tax-breakdown-modal',
    templateUrl: './ib-tax-breakdown-modal.component.html',
    styleUrls: ['./ib-tax-breakdown-modal.component.scss']
})
export class IbTaxBreakdownModalComponent {
    @Input() model: TaxBreakdown[];

    constructor (private NgbActiveModal: NgbActiveModal) {}

    public close = () => {
        this.NgbActiveModal.close();
    };
}
