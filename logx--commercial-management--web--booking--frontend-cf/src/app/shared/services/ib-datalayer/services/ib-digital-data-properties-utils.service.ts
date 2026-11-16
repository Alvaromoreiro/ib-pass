import { Injectable } from '@angular/core';
import { BkiStorageConstants } from '../../../../core/constants/ib-booking-storage-constants';
import { DigitalDataProcess } from '../../../../core/constants/ib-digital-data-constants';
import { AvailabilityTypes } from '../../../../core/models/ib-booking-availability/slice-by-slice-availability.models';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils/';
import { UrlUtilsService } from '../../ib-utils/ib-booking-url-utils.service';
import { IbBookingPetsFlowService } from '../../ib-utils/ib-bookig-pets-flow.service';

type FlowTypes = {
    isShuttleFlow: boolean;
    isRedemptionFlow: boolean;
    userLogged: string | null;
    searchFlightType: string | null;
    flowApp: string | null;
    isHMAD: boolean;
    availabilityType: string | null;
    isPetFlight: boolean;
};
type ProcessType = string;
type ProcessConditions = { check: boolean; process: ProcessType; };
@Injectable({providedIn: 'root'})
export class DigitalDataPropertiesUtilsService {
    
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private UrlUtilsService: UrlUtilsService,
        private IbBookingPetsFlowService: IbBookingPetsFlowService
    ) { }
    
    public setProcess = (): string => {
        const { isShuttleFlow, isRedemptionFlow, userLogged, searchFlightType, flowApp, isHMAD, availabilityType, isPetFlight }: FlowTypes    = {
            isShuttleFlow: this.CommonsSessionStorageService.get( BkiStorageConstants.SHUTTLE_FLOW ),
            isRedemptionFlow: this.CommonsSessionStorageService.get( BkiStorageConstants.REDEMPTION_FLOW ),
            userLogged: this.CommonsSessionStorageService.get( BkiStorageConstants.USER_LOGGED ),
            searchFlightType: this.CommonsSessionStorageService.get( BkiStorageConstants.SEARCH_FLIGHT_TYPE ),
            flowApp: this.CommonsSessionStorageService.get( BkiStorageConstants.FLOW_APP ),
            isHMAD: this.CommonsSessionStorageService.get( BkiStorageConstants.HOLA_MADRID ),
            availabilityType: this.CommonsSessionStorageService.get<string>( BkiStorageConstants.AVAILABILITY_TYPE ),
            isPetFlight: this.IbBookingPetsFlowService.isPetsFlow
        };
        const flashOffer: string | null = this.UrlUtilsService.getURLFirstParameterByName( BookingAppConstants.BOOKING_PARAMS_NAMES.FLASH_OFFER );
        const conditions: ProcessConditions[] = [
            { check: isShuttleFlow && isRedemptionFlow, process: DigitalDataProcess.SHUTTLE_REDEPMTION },
            { check: isShuttleFlow, process: DigitalDataProcess.SHUTTLE },
            { check: isPetFlight, process: DigitalDataProcess.PETS },
            { check: userLogged === BookingAppConstants.LOGIN_ONB && searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION, process: DigitalDataProcess.BOOKING_OB_REDEMPTION },
            { check: flowApp === 'BBKIOH', process: DigitalDataProcess.ON_HOLD },
            { check: userLogged === BookingAppConstants.LOGIN_ONB, process: DigitalDataProcess.BOOKING_OB },
            { check: searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION, process: DigitalDataProcess.REDEMPTION },
            { check: searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH, process: DigitalDataProcess.METASEARCH },
            { check: searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP && isHMAD, process: DigitalDataProcess.HMAD_STOP_OVER },
            { check: searchFlightType === BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP, process: DigitalDataProcess.MULTI_TRIP },
            { check: !!flashOffer, process: DigitalDataProcess.FLASH_OFFERS },
            { check: availabilityType === AvailabilityTypes.SLICE_BY_SLICE, process: DigitalDataProcess.BOOKING_SLICED }
        ];
        const found = conditions.find( c => c.check );
        
        return found ? found.process : DigitalDataProcess.BOOKING;
    };
}
downgradeToAJSService('DigitalDataPropertiesUtilsService', DigitalDataPropertiesUtilsService, 'ib-datalayer-bki-module');