import { Injectable } from '@angular/core';
import { CallItineraryService } from '@shared/http-services/sse-avm/ib-call-itinerary.service';
import { BookingHttpErrorModel, BookingHttpResponse } from '@src/app/core/models/generic-models/generic-models';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { ItineraryCallInterface } from '@shared/http-services/Interfaces/ItineraryCallInterface';
import { BKMCallItineraryService } from '@shared/http-services/booking-manager/ib-bkm-call-itinerary.service';
import { IbBookingPetsFlowService } from '@shared/services/ib-utils/ib-bookig-pets-flow.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { map, Observable } from 'rxjs';
import type { ItineraryResponseDTO } from '@shared/http-services/models/ItineraryServiceDTO';

@Injectable()
export class IbBookingItineraryService  {
    constructor (
        private CallItineraryService: CallItineraryService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingPetsFlowService: IbBookingPetsFlowService,
        private BKMCallItineraryService: BKMCallItineraryService
    ) {}

    private checkUseBookingManager = ()=> {
        const forceBookingManager = this.CommonsSessionStorageService.get(BkiStorageConstants.FORCE_BOOKING_MANAGER_ITINERARY) === true;
        return forceBookingManager || this.IbBookingPetsFlowService.isPetsFlow;
    }; 

    private getApiCallService = (): ItineraryCallInterface => {
        if (this.checkUseBookingManager()) {
            return this.BKMCallItineraryService;
        }
        return this.CallItineraryService;
    };


    public getOutboundAvailability (requestData : AvailabilityTransformerModel.ItineraryRequestData): Observable<ItineraryResponseDTO> {
        return this.getApiCallService()
            .getOutboundItinerary(requestData)
            .pipe(map(this.detectNotAvailability), map((request: BookingHttpResponse<ItineraryResponseDTO>) => request.data));
    }
    

    private throwNotFareFamilyConditionsError = (response: BookingHttpResponse<ItineraryResponseDTO>)  => {
        const hasFareFamilyConditions = Array.isArray(response.data.fareFamilyConditions)
            ? response.data.fareFamilyConditions.length > 0
            : Object.keys(response.data.fareFamilyConditions ?? {}).length > 0;
        if (!hasFareFamilyConditions) {
            throw {};
        }
    };


    private detectNotAvailability = (response: BookingHttpResponse<ItineraryResponseDTO>): BookingHttpResponse<ItineraryResponseDTO> => {
        const warnings = Array.isArray(response.data.warnings) ? response.data.warnings : [];
        const firstWarning = warnings[0] as { code?: string; description?: string; details?: string } | undefined;
        if (firstWarning?.code === 'SSE_AVM_12001') {
            throw {
                errorCode: 404,
                internalErrorCode: 'SSE_AVM_12001',
                message: firstWarning.description,
                details: firstWarning.details || null,
                needsTranslate: false
            };
        }
        this.throwNotFareFamilyConditionsError(response);
        
        return response;
    };
    
    public getInboundAvailability (responseId: string, offerId: string, sliceId: number): Observable<BookingOutboundItineraryResponseType> {
        return this.getApiCallService()
            .getReturnItinerary(responseId, offerId, sliceId)
            .pipe(map(this.detectNotAvailability), map((request: BookingHttpResponse<ItineraryResponseDTO>) => ({ availability: request.data })));
    }

   
}
export interface BookingOutboundItineraryResponseType {
    ribbon?: AvailabilityTransformerModel.CalendarInfo | BookingHttpErrorModel;
    availability: ItineraryResponseDTO;
    requestDataInfo?: AvailabilityTransformerModel.ItineraryRequestData;
}
