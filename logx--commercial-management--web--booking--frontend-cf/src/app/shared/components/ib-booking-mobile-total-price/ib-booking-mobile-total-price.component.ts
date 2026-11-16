import { Component, EventEmitter, Inject, Input, OnChanges, Output } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSBookingModalService, BookingModalServiceType } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { FormControl, Validators } from '@angular/forms';
import { IbBookingPriceDetailModalService } from '../../services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';
import { RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';


@Component({
    selector: 'ib-booking-mobile-total-price',
    templateUrl: './ib-booking-mobile-total-price.component.html',
    styleUrls: ['./ib-booking-mobile-total-price.component.scss']
})
export class IbBookingMobileTotalPriceComponent implements OnChanges{
    @Input() totalPrice: string;
    @Input() customTitle?: string;
    @Input() customContinueText?: string;
    @Input() withoutAviosMoney?;
    @Input() fareRate?;
    @Input() customButtonSlot?: boolean = false;
    @Input() customTermsSlot?: boolean = false;
    @Input() termsAndConditionsText?: string;
    @Output() continueEvent? = new EventEmitter<string>();

    public moduleId: string;
    public continueText: string;
    public stepsMap: any = BookingAppConstants.TOTALPRICE_STEPS_MAP;
    public termsControl: FormControl;
    public acceptTerms: boolean = false;
    public shouldShowPriceDetailCTA: boolean = false;
    private availabilityFlows: string[] = [RouterPathsConstants.availability, RouterPathsConstants.flightsRecap];
    
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        @Inject( WINDOW_TOKEN ) private window: Window,
        public IbBookingPriceDetailModalService: IbBookingPriceDetailModalService
    ) {}
    ngOnChanges () {
        this.continueText = this.customContinueText ?? this.checkStepMap();
        this.shouldShowPriceDetailCTA = this.IbBookingPriceDetailModalService.checkShouldShowCTA('mobile');
        this.termsControl = new FormControl(false, [Validators.required]);
    }

    public onContinueEvent = () => {
        this.termsControl?.markAllAsTouched();
        if ( this.termsAndConditionsText && !this.termsControl.valid ) return;
        this.continueEvent.emit( 'nextStepFlow' );
        this.legacyContinueEvent();
    };


    public openPriceDetailModal = ($event: Event): any => {
        this.IbBookingPriceDetailModalService.openPriceDetailModal($event);
    };

    

    private legacyContinueEvent = () => {
        const nextStepFlowEvent = new CustomEvent('nextStepFlowLegacy', {
            bubbles: true,
            composed: true,
            cancelable: false
        } );
        this.window.dispatchEvent( nextStepFlowEvent );
    };

    public openModalLinks = (): any => {
        this.BookingModalService.showGenericModal( true, 'ib-modal-avios-buy-v2.html', { idModal: 'ib-modal-avios-buy-v2.html' } ).result.then( () => { }, () => { } );
    };

    public checkStepMap = (): string => {
        const STEP_MAP_MOBILE: string = '_MOBILE';
        const defaultStep: string = 'default';
        const actualStep: string = this.CommonsSessionStorageService.get( 'actualStepFlow' ) ?? defaultStep;
        this.moduleId = this.stepsMap[ actualStep ]?.id || this.stepsMap[ defaultStep ].id;
        if(this.stepsMap[ actualStep ]){
            return this.availabilityFlows.includes(actualStep) ? this.stepsMap[ actualStep ]?.text : this.stepsMap[ actualStep ]?.text + STEP_MAP_MOBILE;
        } else {
            return  this.stepsMap[ defaultStep ].text;
        }
    };
}

downgradeToAJSComponent(
    'ibBookingMobileTotalPriceLegacy',
    {
        component: IbBookingMobileTotalPriceComponent,
        inputs: [],
        outputs: []
    },
    'ib-booking-mobile-total-price-module',
    []
);
