import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'ib-modal-generic-error',
    templateUrl: './ib-otp-error-modal.component.html'
})
export class IbCOtpErrorModalComponent implements OnInit {
    public model;
    

    constructor (
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit () {
        this.model = {
            body: 'VOUCHER_CONTROLED_ERROR'
        };
        this.model.onModalOpen?.();
    }

    close = (): void => {
        this.model.onClose?.();
        this.activeModal.dismiss('CLOSE');
    };
}

