import { Observable } from 'rxjs';
import { BookingHttpResponse } from '@src/app/core/models/generic-models/generic-models';
import type { ItineraryResponseDTO } from '../models/ItineraryServiceDTO';

export interface ItineraryCallInterface {
    /**
     * Return the availability itinerary for outbound flight as observable
     * @param requestBody
     * @return {Observable<BookingHttpResponse<ItineraryResponseDTO>>}
     */
    getOutboundItinerary(
        requestBody: AvailabilityTransformerModel.ItineraryRequestData
    ): Observable<BookingHttpResponse<ItineraryResponseDTO>>;

    /**
     * Return the availability itinerary for return flight as observable
     * @param responseId response ID from previous outbound itinerary availability response
     * @param offerId selected offer ID
     * @param sliceId selected slice ID
     * @return {Observable<BookingHttpResponse<ItineraryResponseDTO>>}
     */
    getReturnItinerary(
        responseId: string,
        offerId: string,
        sliceId: number
    ): Observable<BookingHttpResponse<ItineraryResponseDTO>>;
}
