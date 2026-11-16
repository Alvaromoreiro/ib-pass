import { Injectable, Inject } from '@angular/core';
import { AJSDatalayerBKIService, AJSDatalayerBKIServiceType } from '@src/app/shared/services/ib-datalayer/services/ib-datalayer-bki-service-bridge.service';
import { DigitalDataPropertiesUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-properties-utils.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { RootStore } from '@src/app/core/store/ib-booking-root.store';
import { BookingErrorPageStore, ErrorType } from '@src/app/core/store/ib-booking-error-page.store';
import { FlowDetectionResult, ProcessConst, IbBookingFlowDetectionService } from '@src/app/core/services/ib-booking-flow-detection.service';
import { DigitalDataUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-utils.service';
import { DigitalDataService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data.service';
import { AJSMonetateUtilsService } from '@src/app/shared/services/ib-monetate/upgraded/ib-monetate-utils-bridge.service';
import { MonetateConstants } from '@src/app/shared/services/ib-monetate/ib-monetate-constants';

export interface ErrorAnalyticsData {
    availabilityError?: any;
    confirmationDigitalInfo?: any;
    originDestination?: any;
    flowDetection: FlowDetectionResult;
}

@Injectable({ providedIn: 'root' })
export class IbBookingBkErrorAnalyticsService {
    
    constructor (
        private digitalDataUtilsService: DigitalDataUtilsService,
        private DigitalDataService: DigitalDataService,
        @Inject(AJSDatalayerBKIService) private datalayerBKIService: AJSDatalayerBKIServiceType,
        @Inject( AJSMonetateUtilsService ) private monetateUtilsService: any,
        private digitalDataPropertiesUtilsService: DigitalDataPropertiesUtilsService,
        private localStorageService: CommonsSessionStorageService,
        private rootStore: RootStore,
        private BookingErrorPageStore: BookingErrorPageStore,
        private flowDetectionService: IbBookingFlowDetectionService
    ) {}
    
    
    /**
     * Update GA4 digitalData and Monetate 
     */
    public sendAnalyticsFromStorage (): void {
        const flowDetection = this.flowDetectionService.detectFlow();
        const errorData: ErrorAnalyticsData = {
            availabilityError: this.localStorageService.get('availabilityErrror'),
            confirmationDigitalInfo: this.localStorageService.get('confirmationDigitalInfo') || {},
            originDestination: this.localStorageService.get('originDestination'),
            flowDetection
        };
        this.sendAnalytics(errorData);
        this.sendMonetateAnalytics();
    }
    

    /**
     * Sends all booking error analytics
     * @param errorData - Error data for analytics
     */
    public sendAnalytics (errorData: ErrorAnalyticsData): void {
        this.updateDigitalDataWithQuadrigam(errorData);
        this.generateAndAddDigitalDataInfo(errorData);
        this.setProcessAndStepForError(errorData);
        this.DigitalDataService.emitViewEvent();
    }

    /**
     * Updates digitalData with corresponding quadrigam
     * @param errorData - Error data
     */
    private updateDigitalDataWithQuadrigam (errorData: ErrorAnalyticsData): void {
        const confirmationDigitalInfo = errorData.confirmationDigitalInfo;
        const quadrigam = this.determineQuadrigam(errorData);
        
        this.digitalDataUtilsService.updateDigitalDataWithQuadrigam(
            quadrigam,
            confirmationDigitalInfo
        );
    }

    /**
     * Generates and adds digitalData information
     * @param errorData - Error data
     */
    private generateAndAddDigitalDataInfo (errorData: ErrorAnalyticsData): void {
        const confirmationDigitalInfo: any = this.localStorageService.get('confirmationDigitalInfo');
        const originDestination = errorData.originDestination || 
            this.localStorageService.get('originDestination') || {};
        
        const isShuttleFlow = this.isShuttleFlow(errorData);
        
        const shouldFillDatalayer = this.shouldFillDatalayer(confirmationDigitalInfo, originDestination, isShuttleFlow);
        
        if (shouldFillDatalayer) {
            const digitalDataObject = this.createDigitalDataObject(errorData);
            this.DigitalDataService.addDigitalDataInfo(digitalDataObject);
        }
    }

    private shouldFillDatalayer (confirmationDigitalInfo: any, originDestination: any, isShuttleFlow?: boolean): boolean {
        const hasExistingDigitalData = !!(confirmationDigitalInfo?.AdvancePurchase || confirmationDigitalInfo?.SearchCity);
        const hasValidFlowData = this.hasValidFlowData(originDestination, isShuttleFlow);
        
        return !hasExistingDigitalData && hasValidFlowData;
    }


    /**
     * Checks if the flow has valid origin/destination data or is a shuttle flow
     * @param originDestination - Origin destination information
     * @param isShuttleFlow - Whether this is a shuttle flow
     * @returns true if has valid origin/destination cities or is shuttle flow
     */
    private hasValidFlowData (originDestination: any, isShuttleFlow?: boolean): boolean {
        const hasOriginDestinationCities = !!(originDestination?.destinationCity && originDestination?.originCity);
        return hasOriginDestinationCities || !!isShuttleFlow;
    }

    private createDigitalDataObject (errorData: ErrorAnalyticsData): any {
        const isShuttleFlow = this.isShuttleFlow(errorData);
        
        if (isShuttleFlow) {
            return this.datalayerBKIService.generateDigitalDataShuttleError();
        } else {
            const setDigitalDataObject = {
                originDestinations: this.datalayerBKIService.setPayloadForGenerateDigitalData()
            };
            return this.datalayerBKIService.generateDigitalDataAvailability(setDigitalDataObject);
        }
    }

    /**
     * Sets process and step for error in datalayer
     * @param errorData - Error data
     */
    private setProcessAndStepForError (errorData: ErrorAnalyticsData): void {
        const process = this.digitalDataPropertiesUtilsService.setProcess();
        const quadrigam = this.determineQuadrigam(errorData);
        
        this.digitalDataUtilsService.setProcessAndStep(process, 'error', quadrigam);
    }

    /**
     * Determines the appropriate quadrigam based on flow and error conditions
     * @param errorData - Error data
     * @returns The appropriate quadrigam string
     */
    private determineQuadrigam (errorData: ErrorAnalyticsData): string {
        const flow = errorData.flowDetection.flow;
        
        let quadrigam: string;
        
        switch (flow) {
                case ProcessConst.MULTI_TRIP:
                    quadrigam = BookingAppConstants.QUADRIGAMS.MULTI_BK_ERROR;
                    break;
                case ProcessConst.HMAD_STOP_OVER:
                    quadrigam = BookingAppConstants.QUADRIGAMS.HMAD_BK_ERROR;
                    break;
                default:
                    quadrigam = BookingAppConstants.QUADRIGAMS.BK_ERROR;
        }
        
        const notAvailability = this.BookingErrorPageStore.getErrorByType(ErrorType.RIBBON)?.errorCode == 404;
        
        if (notAvailability && flow === ProcessConst.BOOKING) {
            quadrigam = BookingAppConstants.QUADRIGAMS.BK_ERROR_AVAILABILITY;
        }

        if (this.BookingErrorPageStore.getErrorByType(ErrorType.SECURITY_AKAMAI) !== null) {
            quadrigam = BookingAppConstants.QUADRIGAMS.BK_ERROR_AKAMAI;
        }
        
        return quadrigam;
    }

    /**
     * Determines if the current flow is a shuttle flow
     * @param errorData - Error data containing flow information
     * @returns true if it's a shuttle or shuttle redemption flow
     */
    private isShuttleFlow (errorData: ErrorAnalyticsData): boolean {
        return errorData.flowDetection.flow === ProcessConst.SHUTTLE || 
               errorData.flowDetection.flow === ProcessConst.SHUTTLE_REDEMPTION;
    }
    
    
    public sendMonetateAnalytics (): void {
        const isMultiCitySearch = this.localStorageService.get('multiCitySearch') ?? null;
        const isStopOver = this.localStorageService.get('isHMAD') ?? null;

        const quadrigam = isMultiCitySearch ? 
            isStopOver ? 
                BookingAppConstants.QUADRIGAMS.HMAD_BK_ERROR : 
                BookingAppConstants.QUADRIGAMS.MULTI_BK_ERROR : 
            BookingAppConstants.QUADRIGAMS.BK_ERROR;
            
        this.monetateUtilsService.updateMonetateWithQuadrigam(
            MonetateConstants.MONETATE_INFO.SETPAGETYPE, 
            quadrigam
        );
        
        this.rootStore.getOriginalRootScope().$broadcast('sendUpdateToMonetate');
    }

}
