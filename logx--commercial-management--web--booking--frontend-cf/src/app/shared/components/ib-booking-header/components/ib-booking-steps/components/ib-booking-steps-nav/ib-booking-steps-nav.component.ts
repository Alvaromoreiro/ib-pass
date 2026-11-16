import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { AllowedPathsStep } from '@src/app/core/constants/ib-booking-router-paths-constants';
import { DigitalDataEvents } from '@src/app/core/constants/ib-digital-data-constants';
import { HeaderStep } from '@src/app/core/models/ib-booking-availability/header-model';
import { StepModalControl } from '@src/app/shared/components/ib-booking-steps-control-modal/ib-booking-steps-control-modal.component';
import { DigitalDataEventsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-events.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { StepsControlService } from '@src/app/shared/services/ib-utils/ib-booking-steps-control.service';
import { StepsNavigationService } from '@src/app/shared/services/ib-utils/ib-booking-steps-navigation.service';
import { Location } from '@angular/common';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { NavigationManagerService } from '@core/services/navigation/ib-booking-navigation-manager.service';
@Component({
    selector: 'ib-booking-steps-nav',
    templateUrl: './ib-booking-steps-nav.component.html',
    styleUrls: ['./ib-booking-steps-nav.component.scss']
})
export class IbBookingStepsNavComponent implements OnInit {
    @Input() public currentStep: HeaderStep;
    @Input() public steps: HeaderStep[]; 
    @Output() public stepClicked: EventEmitter<void> = new EventEmitter<void>();
    @Output() public enableMobileDrawer: EventEmitter<boolean> = new EventEmitter<boolean>();
    public activeButtons: boolean = false;
    
    

    constructor (
        private StepsNavigationService: StepsNavigationService,
        private BookingRedirectionService: BookingRedirectionService,
        private DigitalDataEventsService: DigitalDataEventsService, 
        private StepsControlService: StepsControlService,
        private Location: Location,
        private NavigationManagerService: NavigationManagerService,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType
    ) { }
    
    ngOnInit (): void {
        this.activeButtons = this.StepsNavigationService.checkButtonsActivation();
        this.enableMobile();
    }
    
    public stepClick = (step: HeaderStep) => {
        this.stepClicked.emit();
        this.sendDigitalDataStepEvent( step.page );
        this.launchStepsConfirmationModal( this.Location.path().replace('/', '') as AllowedPathsStep, step.page as AllowedPathsStep).then( ( confirmed: boolean ) => {
            if ( !confirmed ) return;   
            this.BookingModalService.closeAllCurrentModals( );
            this.NavigationManagerService.ignoreOrderBeforeRedirect(step.page as AllowedPathsStep);
            this.BookingRedirectionService.path(step.page);
        } );
    };

    private launchStepsConfirmationModal = async ( currentStep: AllowedPathsStep, nextStep: AllowedPathsStep ): Promise<boolean> => {
        const stepModalModel: StepModalControl = {
            currentStep: currentStep,
            nextStep: nextStep 
        };
        try {
            await this.StepsControlService.showStepsControlModal( stepModalModel ).result;
            return true;
        } catch {
            return false;
        } 


    };

    
    public enableMobile = () => {
        this.enableMobileDrawer.emit( this.activeButtons );
    };
    
    private sendDigitalDataStepEvent = ( step: string ) => {
        const eventName = DigitalDataEvents.EVENT_NAME_INTERACTION;
        const eventCategory = DigitalDataEvents.EVENT_CATEGORY_BREADCRUMBS;
        const eventAction = DigitalDataEvents.EVENT_ACTION_CLIC;
        const eventLabel = this.DigitalDataEventsService.getEventStepLabel( step ) ?? '';
        this.DigitalDataEventsService.updateDatalayerEvent( eventCategory, eventAction, eventLabel, eventName );
    };    

}
