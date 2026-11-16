import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { RelatedContentItem } from '@src/app/core/models/generic-models/fare-models';
import { IbBookingPriceDetailModalService } from '../../services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';

@Component({
    selector: 'ib-booking-common-total-price',
    templateUrl: './ib-booking-common-total-price.component.html',
    styleUrls: ['./ib-booking-common-total-price.component.scss']
})
export class IbBookingCommonTotalPriceComponent implements Validators, OnInit {
    @Input() totalPrice: string;
    @Input() conditionsText?: string | null;
    @Input() onHoldPrice?: string | null;
    @Input() termsAndConditionsCheck: RelatedContentItem['value'] | undefined;
    @Input() isOnHold?: boolean = false;
    @Input() customContinueText: string = '';
    @Input() priceTitle?: string = 'TOTAL_PRICE_COMPONENT_ACCESSIBLE';
    @Output() freeOnHoldContinue = new EventEmitter<string>();
    @Output() continueEvent = new EventEmitter<string>();
    public nextButtonText: string = '';
    public acceptTerms: boolean = false;
    public termsControl: FormControl;
    public shouldShowPriceDetailCTA: boolean;
    
    constructor (
        private TranslateService: TranslateService,
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService

        
    ) {}

    ngOnInit (): void {
        this.setTermsControl();
        this.onHoldConfiguration();
        this.setNextButtonText();
        this.shouldShowPriceDetailCTA = this.IbBookingPriceDetailModalService.checkShouldShowCTA();
    }

    private setNextButtonText = () => {
        if ( !this.customContinueText ) {
            this.nextButtonText = this.TranslateService.instant( 'AVAILABILITY_BUTTON' );
            return;
        }
        this.nextButtonText = this.TranslateService.instant( this.customContinueText );
    };

    private onHoldConfiguration = () => {
        if ( !this.isOnHold ) return;
        this.setTermsControl();
        this.totalPrice = this.TranslateService.instant('GENERAL_FREE_LABEL');
        this.nextButtonText = this.TranslateService.instant('TOTAL_PRICE_COMPONENT_HOLD_BUTTON');
    };

    private setTermsControl = () => {
        this.termsControl = new FormControl( false, [ Validators.required ] );
    };

    private checkTermsControlValid = ():boolean => {
        if (!this.termsAndConditionsCheck) {
            return true;
        }
        this.termsControl.markAllAsTouched();
        return this.termsControl.valid;
    };


    public openPriceDetailModal = ($event: Event): any => {
        this.IbBookingPriceDetailModalService.openPriceDetailModal($event);
    };

    public onContinueEvent = () => {
        if ( !this.checkTermsControlValid()) return;
        this.continueEvent.emit( );
    } ;

    public changeAcceptTerms =  () => {
        this.acceptTerms = !this.acceptTerms;
    };
}
