import { SpecialNeeds } from '@core/models/ib-booking-on-hold-confirmation/ib-special-needs-modal-model';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ib-special-needs-modal',
    templateUrl: './ib-special-needs-modal.component.html',
    styleUrls: ['./ib-special-needs-modal.component.scss']
})
export class IbSpecialNeedsModalComponent {
    @Input() model: SpecialNeeds[];

    constructor (private NgbActiveModal: NgbActiveModal){}

    public close = () => {
        this.NgbActiveModal.close();
    };
}
