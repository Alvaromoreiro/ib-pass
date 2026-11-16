import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '../../constants/ib-booking-storage-constants';
import { BookingAppConstants } from '../../constants/ib-booking-constants';
import { RouterPathsConstants } from '../../constants/ib-booking-router-paths-constants';
import { BookingUserActivityService } from '../../services/ib-booking-user-activity.service';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { IbBookingHeaderFacadeService } from '@src/app/shared/components/ib-booking-header/services/ib-booking-header-facade.service';
export { BkiStorageConstants } from '@core/constants/ib-booking-storage-constants';
interface PreconditionStatus {
    route: string,
    actualStepFlow: string
}

class PreconditionsManager {
    private headerSimpleSetConfig =  new Set<string>(BookingAppConstants.HEADER_SIMPLE_PAGES);
    private NewMainHeaderFacadeType: IbBookingHeaderFacadeService;
    private BookingUserActivityService: BookingUserActivityService;
    private DigitalDataUtilsService: DigitalDataUtilsService;
    constructor (){
        this.CommonsSessionStorage = inject(CommonsSessionStorageService);
        this.NewMainHeaderFacadeType = inject(IbBookingHeaderFacadeService);
        this.BookingUserActivityService = inject(BookingUserActivityService);
        this.DigitalDataUtilsService = inject(DigitalDataUtilsService);
    }

    private CommonsSessionStorage:CommonsSessionStorageService;

    private checkNextStep = (previousStep, route:string) : boolean => {
        const flowViewsInfo = BookingAppConstants.FLOW_STEPS_INFO;
        const allowedSteps : [] = flowViewsInfo[route]?.allowedSteps;
        const areEqual = previousStep === route;
        return  areEqual || (allowedSteps?.some((data) => data=== previousStep) ?? true);
    };
    /**
    * Function that updates the session storage with the current (actual) and previous step of the flow.
    * */
    private updateStepsStorage = ({route, actualStepFlow }:PreconditionStatus) => {
        const exceptions = new Set<string>([RouterPathsConstants.ibpurc, RouterPathsConstants.confirmation, RouterPathsConstants.loading]);
        const previousStep = actualStepFlow ?? route;
        //TODO: delete when old payments will be deprecated
        if(exceptions.has(route)){
            return;
        }
        this.CommonsSessionStorage.set(BkiStorageConstants.ACTUAL_STEP_FLOW, route);
        // Avoid change previous step if it is the same as the current one
        if (previousStep !== route) {
            this.CommonsSessionStorage.set(BkiStorageConstants.PREVIOUS_STEP_FLOW, previousStep);
        }
    };
    //TODO: DELETE when back step was completed
    private updateForbiddenNextStep = ({route, actualStepFlow }:PreconditionStatus) => {
        const previousStep = actualStepFlow ?? route;
        // Avoid change previous step if it is the same as the current one
        if (previousStep !== route) {
            if (!this.checkNextStep(previousStep, route)) {
                this.CommonsSessionStorage.set(BkiStorageConstants.FORBIDDEN_NEXT_STEP, true);
            } else {
                this.CommonsSessionStorage.remove(BkiStorageConstants.FORBIDDEN_NEXT_STEP);
            }
        }
    };

    private setHeaderType = (route:string) => {
        this.NewMainHeaderFacadeType.setHeaderType(this.headerSimpleSetConfig.has(route) ? 'SIMPLE' : 'DEFAULT');
    };
    private updatePreviousQuadrigam = ({route, actualStepFlow }:PreconditionStatus) => {
        const previousStep = actualStepFlow ?? route;
        if (previousStep !== route) {
            this.DigitalDataUtilsService.updatePreviousPageQuadrigam();
        }
    };


    public applyPreconditions = (route:string = '') => {
        const preconditionStatus: PreconditionStatus = {
            route,
            actualStepFlow: this.CommonsSessionStorage.get(BkiStorageConstants.ACTUAL_STEP_FLOW)
        };
        this.setupActivityEvents(route);
        this.updateForbiddenNextStep(preconditionStatus);
        this.updateStepsStorage(preconditionStatus);
        this.stopSessionWorkers(preconditionStatus);
        this.setOrderTimeoutTimer(preconditionStatus);
        this.setHeaderType(route);
        this.updatePreviousQuadrigam(preconditionStatus);
    };
    

    private setupActivityEvents = (route:string = ''): void => {
        const activityEventsStop = new Set<string>([RouterPathsConstants.ibcmtv, RouterPathsConstants.ibpurc, RouterPathsConstants.ohmtdt]);
        if (activityEventsStop.has(route)) {
            this.BookingUserActivityService.stopActivityListener();
            return;
        }

        this.BookingUserActivityService.initActivityListener();
    };

    private stopSessionWorkers = ({route }:PreconditionStatus) => {
        const aplications = new Set<string>([RouterPathsConstants.confirmation, RouterPathsConstants.OBERRA, RouterPathsConstants.ibbker, RouterPathsConstants.ibbkerror, RouterPathsConstants.cnclit]);
        if ( !aplications.has( route ) ) return;
        this.BookingUserActivityService.terminateWorker();
    };

    private setOrderTimeoutTimer = ({route }:PreconditionStatus): void => {
        const pages = new Set<string>([ RouterPathsConstants.ibpurc, RouterPathsConstants.ibcmtv]);
        if ( !pages.has( route ) ) {
            this.BookingUserActivityService.stopOrderTimeoutTimer();
            return;
        }
        this.BookingUserActivityService.setOrderTimeoutTimer();
    };
}

/**
 * Guard that must be executed at last place.
 * It will always return true and execute some common logic for all the routes.
 * @returns boolean - true
 *  */
export const BookingRoutePreconditions: CanActivateFn = (route: ActivatedRouteSnapshot, state:RouterStateSnapshot): boolean => {
    const preconditionsManager = new PreconditionsManager();
    preconditionsManager.applyPreconditions(route.routeConfig?.path);
    return true;
};


