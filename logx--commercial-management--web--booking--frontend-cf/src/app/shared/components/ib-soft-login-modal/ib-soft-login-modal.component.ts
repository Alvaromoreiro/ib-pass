import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ib-soft-login-modal',
    templateUrl: './ib-soft-login-modal.component.html',
    styleUrls: ['./ib-soft-login-modal.component.scss']
})
export class IbSoftLoginModalComponent implements OnInit {

    listItemTitles: string[];

    constructor (private NgbActiveModal: NgbActiveModal){

    }

    ngOnInit (): void {
        this.listItemTitles = [
            'SOFT_LOGIN_MODAL_LIST_1',
            'SOFT_LOGIN_MODAL_LIST_2',
            'SOFT_LOGIN_MODAL_LIST_3'
        ];
    }

    public close = () => {
        this.NgbActiveModal.close();
    };

    public dismiss = () => {
        this.NgbActiveModal.dismiss();
    };
}
