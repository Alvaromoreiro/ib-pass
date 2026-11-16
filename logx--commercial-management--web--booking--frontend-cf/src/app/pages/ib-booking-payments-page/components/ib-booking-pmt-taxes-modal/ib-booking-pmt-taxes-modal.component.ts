
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Taxes } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';

@Component({
    selector: 'ib-pmt-taxes-modal',
    templateUrl: './ib-booking-pmt-taxes-modal.component.html',
    styleUrls: [ './ib-booking-pmt-taxes-modal.component.scss' ]
})
export class IbPmtTaxesModalComponent {
    @Input() public model: Taxes[];
    constructor (
        private NgbActiveModal: NgbActiveModal
    ) { }

    public close = () => {
        this.NgbActiveModal.close();
    };
    public dismiss = () => {
        this.NgbActiveModal.dismiss();
    };

}

