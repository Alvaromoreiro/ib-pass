import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AllowedPathsStep, RouterPathsConstants as PATH } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { DigitalDataEvents } from '@src/app/core/constants/ib-digital-data-constants';
import { DigitalDataEventsService } from '../../services/ib-datalayer/services/ib-digital-data-events.service';

export type StepModalControl = {
    currentStep: AllowedPathsStep;
    nextStep: AllowedPathsStep;
};
@Component({
    selector: 'ib-booking-steps-control-modal',
    templateUrl: './ib-booking-steps-control-modal.component.html',
    styleUrls: ['./ib-booking-steps-control-modal.component.scss']
})
export class StepsControlModalComponent implements OnInit {
    @Input() public model: StepModalControl;
    public newSearch: boolean = false;
    public extrasLost: boolean = false;
    private extrasLostCurrent = [ PATH.ibpurc, PATH.ibcmtv ];
    constructor (
        private NgbActiveModal: NgbActiveModal,
        private DigitalDataEventsService: DigitalDataEventsService
    ) { }

    ngOnInit () {
        this.checkNextStep();
    }
    
    private checkNextStep = () => {
        this.newSearch = this.checkNewSearch();
        this.extrasLost = this.checkExtrasLost();
    };
    
    private checkNewSearch = (): boolean => {
        return (this.model.nextStep === PATH.availability || this.model.nextStep === PATH.ibshuttle);
    };
    
    private checkExtrasLost = (): boolean => {
        return this.extrasLostCurrent.includes( this.model.currentStep ) && ( this.model.nextStep !== PATH.ibcmtv );
    };
    
    public close = ():void => {
        this.sendDigitalDataStepEvent( false );
        this.NgbActiveModal.close();
    };
    
    public dismiss = (): void => {
        this.sendDigitalDataStepEvent( true );
        this.NgbActiveModal.dismiss();
    };
    
    private sendDigitalDataStepEvent = ( stay: boolean ) => {
        const eventName = DigitalDataEvents.EVENT_NAME_INTERACTION;
        const eventCategory = DigitalDataEvents.EVENT_CATEGORY_BREADCRUMBS;
        const eventAction = stay ? DigitalDataEvents.EVENT_ACTION_STAY : DigitalDataEvents.EVENT_ACTION_BACK;
        const eventLabel = this.DigitalDataEventsService.getEventStepLabel( this.model.nextStep );
        this.DigitalDataEventsService.updateDatalayerEvent( eventCategory, eventAction, eventLabel, eventName );
    };
    
}