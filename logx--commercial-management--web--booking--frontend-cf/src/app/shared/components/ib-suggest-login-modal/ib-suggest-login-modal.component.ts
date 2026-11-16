import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-suggest-login-modal',
    templateUrl: 'ib-suggest-login-modal.component.html',
    styleUrls: ['./ib-suggest-login-modal.component.scss']
})

export class IbSuggestLoginModalComponent {
    @Input() public model: any;
    constructor (
        private NgbActiveModal: NgbActiveModal
    ) {

    }

 
    public close = () => {
        this.NgbActiveModal.close();
    };

    public dismiss = () => {
        this.NgbActiveModal.dismiss();
    };
}

downgradeToAJSComponent(
    'IibSuggestLoginModalComponentLegacy',
    {
        component: IbSuggestLoginModalComponent,
        inputs: [],
        outputs: []
    },
    'ib-suggest-login-modal-module',
    []
);
