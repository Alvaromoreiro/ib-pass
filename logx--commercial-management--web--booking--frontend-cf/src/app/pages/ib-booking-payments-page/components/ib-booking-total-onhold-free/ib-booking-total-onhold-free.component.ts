import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RelatedContentItem } from '@src/app/core/models/generic-models/fare-models';

@Component({
    selector: 'ib-booking-total-onhold-free',
    templateUrl: './ib-booking-total-onhold-free.component.html',
    styleUrls: ['./ib-booking-total-onhold-free.component.scss']
})
export class IbBookingTotalOnholdFreeComponent implements Validators, OnInit {
    @Input() totalPrice: string;
    @Input() conditionsText: string;
    @Input() onHoldPrice: string;
    @Input() mobileFlow?: boolean;
    @Input() termsAndConditionsCheck: RelatedContentItem['value'] | undefined;
    @Output() freeOnHoldContinue = new EventEmitter<string>();
    public moduleTitle: string = 'TOTAL_PRICE_COMPONENT_ACCESSIBLE';
    public nextButtonText: string = 'TOTAL_PRICE_COMPONENT_HOLD_BUTTON';
    public acceptTerms: boolean = false;
    public termsControl: FormControl;

    constructor () { }

    ngOnInit (): void {
        this.termsControl = new FormControl(false, [Validators.required]);
    }

    public freeOnHoldContinueEvent () {
        this.termsControl.markAllAsTouched();
        if ( !this.termsControl.valid ) return;
        this.freeOnHoldContinue.emit( 'freeOnHoldContinueEvent' );
    }
    public changeAcceptTerms () {
        this.acceptTerms = !this.acceptTerms;
    }
}
