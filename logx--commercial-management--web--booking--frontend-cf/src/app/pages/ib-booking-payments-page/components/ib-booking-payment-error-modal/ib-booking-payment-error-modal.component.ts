import { Component, Input,  OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
export interface BookingPaymentErrrorModalModel {
    showHeader?: boolean;
    title?: string;
    titleTranslateParams?: Record<string, string>;
    subtitle?: string;
    body?: string | string[];
    hideFooter?: boolean;
    dismissOnCancel?: boolean;
    actionButtons?: {text: string, action: () => any, class?: string, id: string}[]

}
@Component({
    selector: 'ib-modal-generic',
    templateUrl: './ib-booking-payment-error-modal.component.html',
    styleUrls:['./ib-booking-payment-error-modal.component.scss']
})
export class BookingPaymentErrorModalComponent implements OnInit {

    @Input() model: BookingPaymentErrrorModalModel = {};
    public showCloseButton = true;
    public showCancelButton = false;
    public showHeader = true;
    public dismissOnCancel = true;
    public titleTranslateParams: Record<string, string> = {};
    public modalTitle = 'MODAL_ERROR_TITLE';
    public body: string[] = [];
    public actionButtons: BookingPaymentErrrorModalModel['actionButtons'] = [];

    constructor (public activeModal: NgbActiveModal) {}

    ngOnInit () {
        this.showHeader = this.model.showHeader ?? true;
        this.dismissOnCancel = this.model.dismissOnCancel ?? true;
        this.titleTranslateParams = this.model.titleTranslateParams ?? {};
        this.modalTitle = this.model.title ?? 'MODAL_ERROR_TITLE';
        this.body = typeof this.model.body === 'string' ? [this.model.body] : (this.model.body ?? []);
        this.actionButtons = this.model.actionButtons?.map((el)=> { 
            const originalAction = el.action;
            el.action = () => { 
                this.activeModal.close(el.id);
                originalAction();
            };
            return el;
        }) ?? [];
    }

   

  

}

