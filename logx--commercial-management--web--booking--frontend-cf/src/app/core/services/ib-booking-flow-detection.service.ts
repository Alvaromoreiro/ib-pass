import { Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '../constants/ib-booking-storage-constants';
import { BookingAppConstants } from '../constants/ib-booking-constants';
import { UrlUtilsService } from '../../shared/services/ib-utils/ib-booking-url-utils.service';
import { IbBookingPetsFlowService } from '../../shared/services/ib-utils/ib-bookig-pets-flow.service';
import { RootStore } from '../store/ib-booking-root.store';

/**
 * Represents the result of flow detection process
 */
export interface FlowDetectionResult {
    flow: string;
    isRedemption: boolean;
}

/**
 * Context object containing all necessary data for flow detection
 */
export interface FlowContext {
    isRedemptionFlow: boolean;
    userLogged: string | null;
    searchFlightType: string | null;
    flowApp: string | null;
    availabilityType: string | null;
    flashOffer: string | null;
    isPetFlight: boolean;
}

/**
 * Handler interface for flow detection using Chain of Responsibility pattern
 */
export interface FlowHandler {
    canHandle: (context: FlowContext) => boolean;
    getProcessType: () => string;
}

/**
 * Constants for different process types used in digital data tracking
 */
export const ProcessConst = {
    BOOKING: 'BOOKING',
    BOOKING_OB: 'BOOKING_OB',
    BOOKING_OB_REDEMPTION: 'BOOKING_OB_REDEMPTION',
    FLASH_OFFERS: 'FLASH_OFFERS',
    HMAD_STOP_OVER: 'HMAD_STOP_OVER',
    METASEARCH: 'METASEARCH',
    MULTI_TRIP: 'MULTI_TRIP',
    ON_HOLD: 'ON_HOLD',
    REDEMPTION: 'REDEMPTION',
    SHUTTLE: 'SHUTTLE',
    SHUTTLE_REDEMPTION: 'SHUTTLE_REDEMPTION',
    ONHOLD_CONFIRMATION: 'ONHOLD_CONFIRMATION',
    PETS: 'PETS',
    OPEN_JAW: 'OPEN_JAW'
} as const;

/**
 * Service responsible for detecting the current booking flow type.
 * Uses Chain of Responsibility pattern with array of handlers for clean flow detection.
 * 
 * This service analyzes various context parameters to determine which booking flow
 * is currently active and returns the appropriate process type for digital data tracking.
 * 
 * @example
 * ```typescript
 * const result = flowDetectionService.detectFlow(rootStore);
 * console.log(result.flow); // 'BOOKING_OB'
 * console.log(result.isRedemption); // false
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class IbBookingFlowDetectionService {
    
    /**
     * Array of flow handlers ordered by priority.
     * More specific handlers should come first in the array.
     */
    private readonly flowHandlers: FlowHandler[];

    constructor (
        private commonsSessionStorageService: CommonsSessionStorageService,
        private urlUtilsService: UrlUtilsService,
        private ibBookingPetsFlowService: IbBookingPetsFlowService,
        private rootStore: RootStore
    ) {
        this.flowHandlers = [
            this.shuttleRedemptionHandler,
            this.shuttleHandler,
            this.petsHandler,
            this.bookingOBRedemptionHandler,
            this.onHoldHandler,
            this.bookingOBHandler,
            this.redemptionHandler,
            this.metasearchHandler,
            this.hmadStopOverHandler,
            this.multiTripHandler,
            this.flashOffersHandler,
            this.defaultBookingHandler  // Always should be last as fallback
        ];
    }

    /**
     * Handler for detecting shuttle redemption flow
     */
    private shuttleRedemptionHandler: FlowHandler = {
        canHandle: (context: FlowContext) => 
            context.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN && context.isRedemptionFlow,
        getProcessType: () => ProcessConst.SHUTTLE_REDEMPTION
    };

    /**
     * Handler for detecting shuttle flow
     */
    private shuttleHandler: FlowHandler = {
        canHandle: (context: FlowContext) => context.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN,
        getProcessType: () => ProcessConst.SHUTTLE
    };

    /**
     * Handler for detecting pets flow
     */
    private petsHandler: FlowHandler = {
        canHandle: (context: FlowContext) => context.isPetFlight,
        getProcessType: () => ProcessConst.PETS
    };

    /**
     * Handler for detecting booking onboard redemption flow
     */
    private bookingOBRedemptionHandler: FlowHandler = {
        canHandle: (context: FlowContext) => 
            context.userLogged === BookingAppConstants.LOGIN_ONB && 
            context.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION,
        getProcessType: () => ProcessConst.BOOKING_OB_REDEMPTION
    };

    /**
     * Handler for detecting on hold flow
     */
    private onHoldHandler: FlowHandler = {
        canHandle: (context: FlowContext) => context.flowApp === 'BBKIOH',
        getProcessType: () => ProcessConst.ON_HOLD
    };

    /**
     * Handler for detecting booking onboard flow
     */
    private bookingOBHandler: FlowHandler = {
        canHandle: (context: FlowContext) => context.userLogged === BookingAppConstants.LOGIN_ONB,
        getProcessType: () => ProcessConst.BOOKING_OB
    };

    /**
     * Handler for detecting redemption flow
     */
    private redemptionHandler: FlowHandler = {
        canHandle: (context: FlowContext) => 
            context.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION,
        getProcessType: () => ProcessConst.REDEMPTION
    };

    /**
     * Handler for detecting metasearch flow
     */
    private metasearchHandler: FlowHandler = {
        canHandle: (context: FlowContext) => 
            context.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH,
        getProcessType: () => ProcessConst.METASEARCH
    };

    /**
     * Handler for detecting HMAD stop over flow
     */
    private hmadStopOverHandler: FlowHandler = {
        canHandle: (context: FlowContext) => {
            const isHMAD = this.commonsSessionStorageService.get<boolean>(BkiStorageConstants.HOLA_MADRID) ?? false;
            return context.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP && isHMAD;
        },
        getProcessType: () => ProcessConst.HMAD_STOP_OVER
    };

    /**
     * Handler for detecting multi trip flow
     */
    private multiTripHandler: FlowHandler = {
        canHandle: (context: FlowContext) => 
            context.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP,
        getProcessType: () => ProcessConst.MULTI_TRIP
    };

    /**
     * Handler for detecting flash offers flow
     */
    private flashOffersHandler: FlowHandler = {
        canHandle: (context: FlowContext) => !!context.flashOffer,
        getProcessType: () => ProcessConst.FLASH_OFFERS
    };

    /**
     * Default handler that acts as fallback for booking flow
     */
    private defaultBookingHandler: FlowHandler = {
        canHandle: (context: FlowContext) => true, // Always handles as fallback
        getProcessType: () => ProcessConst.BOOKING
    };

    /**
     * Detects the current booking flow and returns flow information.
     * 
     * Analyzes the current application state including session storage,
     * URL parameters, and service states to determine the active flow.
     * 
     * @returns FlowDetectionResult containing flow type and redemption status
     * 
     * @example
     * ```typescript
     * const result = this.flowDetectionService.detectFlow();
     * if (result.isRedemption) {
     *   // Handle redemption-specific logic
     * }
     * ```
     */
    detectFlow (): FlowDetectionResult {
        const context = this.buildFlowContext();
        
        // Find the first handler that can handle the context
        const matchingHandler = this.flowHandlers.find(handler => handler.canHandle(context));
        const flow = matchingHandler?.getProcessType() || ProcessConst.BOOKING;
        
        return {
            flow,
            isRedemption: context.isRedemptionFlow || 
                         context.searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION
        };
    }

    /**
     * Builds the flow context with all necessary data for flow detection.
     * 
     * Collects data from various sources including session storage,
     * URL parameters, and application services to create a complete
     * context object for flow analysis.
     * 
     * @returns FlowContext object containing all flow detection parameters
     * 
     * @private
     */
    private buildFlowContext (): FlowContext {
        return {
            isRedemptionFlow: this.commonsSessionStorageService.get(BkiStorageConstants.REDEMPTION_FLOW) ?? 
                             this.rootStore.get('isRedemptionFlow') ?? false,
            userLogged: this.commonsSessionStorageService.get(BkiStorageConstants.USER_LOGGED),
            searchFlightType: this.commonsSessionStorageService.get(BkiStorageConstants.SEARCH_FLIGHT_TYPE),
            flowApp: this.commonsSessionStorageService.get(BkiStorageConstants.FLOW_APP),
            availabilityType: this.commonsSessionStorageService.get<string>(BkiStorageConstants.AVAILABILITY_TYPE),
            flashOffer: this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.FLASH_OFFER) as string | null,
            isPetFlight: this.ibBookingPetsFlowService.isPetsFlow
        };
    }

}
