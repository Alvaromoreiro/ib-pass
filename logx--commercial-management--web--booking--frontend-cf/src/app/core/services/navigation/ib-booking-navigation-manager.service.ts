import { Injectable, OnDestroy, Inject } from '@angular/core';
import { AllowedPathsStep } from '../../constants/ib-booking-router-paths-constants';
import { NavigationStart, Router } from '@angular/router';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { NavigationGuardSemaphoreStatesTypes, NAVIGATION_GUARD_SEMAPHORE_STATES } from '../../constants/ib-navigation-manager-constants';
import { StepsNavigationService } from '@shared/services/ib-utils/ib-booking-steps-navigation.service';
import { StepModalControl } from '@src/app/shared/components/ib-booking-steps-control-modal/ib-booking-steps-control-modal.component';
import { StepsControlService } from '@shared/services/ib-utils/ib-booking-steps-control.service';
import { AllowedPopStateTransitions } from '../../constants/ib-popstate-rules-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
import { RouterPathsConstants } from '@core/constants/ib-booking-router-paths-constants';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { UserActivityUtilsService } from '@src/app/core/services/ib-booking-user-activity-utils.service';

@Injectable({providedIn: 'root'})
export class NavigationManagerService implements OnDestroy {
    private unsuscribeSubject$ = new Subject<void>();
    private navigationGuardSemaphoreSubject$ = new ReplaySubject<NavigationGuardSemaphoreStatesTypes>(1);
    private activateBackNavigationControlFeature: boolean = false;
    private ignoreOrderBeforeRedirectSteps: Set<AllowedPathsStep> = new Set<AllowedPathsStep>([ RouterPathsConstants.availability as AllowedPathsStep ]);
    private blockTransition: boolean = false;
    private isInitialized: boolean = false;
    
    constructor (
        private Router: Router,
        private StepsNavigationService: StepsNavigationService,
        private StepsControlService: StepsControlService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private UserActivityUtilsService: UserActivityUtilsService,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType
    ) {
        
    }
    ngOnDestroy (): void {
        this.unsuscribeSubject$.next();
        this.unsuscribeSubject$.complete();
    }

    get navigationGuardSemaphore$ () {
        return this.navigationGuardSemaphoreSubject$.asObservable();
    }

    public init = (): void => {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        this.activateBackNavigationControlFeature = this.StepsNavigationService.checkButtonsActivation();
        this.initRouterEventsSubscription();
    };

    
    public disableNavigation = (block: boolean): void => {
        this.blockTransition = block;
    };
    
    private replaceBackSlashInUrl = ( url: string ): AllowedPathsStep => {
        return url.replace( '/', '' ) as AllowedPathsStep;
    };

    private initRouterEventsSubscription = (): void => {
        // Implementation for managing navigation based on history
        this.Router.events.pipe(takeUntil(this.unsuscribeSubject$)).subscribe(event => {
            if (event instanceof NavigationStart) {
                this.navigationStartEventHandler(event);
                return;
            }
        });
    };

    
    private handleNavigationWithModal = async ( currentStep: AllowedPathsStep, nextStep: AllowedPathsStep ): Promise<boolean> => {
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

    /* OnHold booking blocking rule */
    private isOnHoldOrderPaymentStep = ( step: AllowedPathsStep ): boolean => {
        const isOnHoldOrder = this.CommonsSessionStorageService.get<boolean>(BkiStorageConstants.ONHOLD_ORDER);
        return step ===  RouterPathsConstants.ibpurc && isOnHoldOrder === true;
    };


    private isTransitionAllowed = ( currentStep: AllowedPathsStep, nextStep: AllowedPathsStep ): boolean => {
        if (this.blockTransition|| this.isOnHoldOrderPaymentStep( currentStep )) {
            return false;
        }
        return AllowedPopStateTransitions[currentStep]?.has(nextStep) ?? false;
    };

    public ignoreOrderBeforeRedirect = ( nextStep: AllowedPathsStep ) => {
        if(!this.ignoreOrderBeforeRedirectSteps.has( nextStep )){
            return;
        }
        this.UserActivityUtilsService.checkOrderToIgnore();
    };


    private navigationStartEventHandler = (event: NavigationStart) => {
        const isPopStateNavigation = event.navigationTrigger === 'popstate';
        const isDifferentURLThanCurrent = this.Router.url !== event.url;
        if(this.blockTransition && isPopStateNavigation ) {
            this.navigationGuardSemaphoreSubject$.next(NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL);
            return;
        }
        const processPopStateNavigation = this.activateBackNavigationControlFeature && isPopStateNavigation && isDifferentURLThanCurrent;
        this.navigationGuardSemaphoreSubject$.next(NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT);

        if (processPopStateNavigation) {
            const currentStep = this.replaceBackSlashInUrl(this.Router.url);
            const nextStep = this.replaceBackSlashInUrl(event.url);
            const allowedTransition: boolean = this.isTransitionAllowed(currentStep, nextStep);
            if (!allowedTransition){
                this.navigationGuardSemaphoreSubject$.next(NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL);
                return;
            }
            this.handleNavigationWithModal(currentStep, nextStep).then((canNavigate) => {
                if (canNavigate) {
                    this.navigationGuardSemaphoreSubject$.next(NAVIGATION_GUARD_SEMAPHORE_STATES.GO);
                    this.ignoreOrderBeforeRedirect(nextStep);
                    this.BookingModalService.closeAllCurrentModals( );
                } else {
                    this.navigationGuardSemaphoreSubject$.next(NAVIGATION_GUARD_SEMAPHORE_STATES.CANCEL);
                }
            });
            return;
        } 
        this.navigationGuardSemaphoreSubject$.next(NAVIGATION_GUARD_SEMAPHORE_STATES.GO);
        
    };
}
