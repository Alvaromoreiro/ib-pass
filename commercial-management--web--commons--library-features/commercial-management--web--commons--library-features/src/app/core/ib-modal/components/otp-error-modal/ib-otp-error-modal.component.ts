import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'ib-modal-otp-generic-error',
    templateUrl: './ib-otp-error-modal.component.html'
    })
export class IbCOtpErrorModalComponent implements OnInit {
    public model: any;
    

    constructor (
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit () {
        this.model = {
            body: 'MODAL_OTP_TECHNICAL_ERROR_MESSAGE'
        };
        this.model.onModalOpen?.();
    }

    close = (): void => {
        this.model.onClose?.();
        this.activeModal.dismiss('CLOSE');
    };
}

