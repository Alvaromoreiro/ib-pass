import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { IbBookingErrorHandlerService } from '../error';
import { Injectable } from '@angular/core';
import { Observable, retry, throwError, throwIfEmpty, timer } from 'rxjs';
import { BookingSalesforceRxProxy } from '../proxy/ib-booking-salesforce-rx-proxy.service';
import type { BookingHttpResponse } from '@src/app/core/models/generic-models/generic-models';
import type { ItineraryCallInterface } from '@shared/http-services/Interfaces/ItineraryCallInterface';
import type { ItineraryResponseDTO } from '../models/ItineraryServiceDTO';


@Injectable({providedIn: 'root'})
export class CallItineraryService implements ItineraryCallInterface {
    OutboundEndpoint: string = HttpServicesConstants.DEFAULT_ENDPOINTS.availabilityItineraryOutboundServiceURI;
    ReturnEndpoint: string = HttpServicesConstants.DEFAULT_ENDPOINTS.availabilityItineraryReturnServiceURI;
    constructor (
        private baseProxy: BookingSalesforceRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    /**
     * Return the availability itinerary for outbound flight as observable
     * @param requestBody
     * @return {Observable<AvailabilityTransformerModel.AvailabilityResponse>}
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3872391169/DRAFT+Get+Availability+by+Itinerary#id-[DRAFT]GetAvailabilitybyItinerary-RequestBody
     */
    getOutboundItinerary ( requestBody: AvailabilityTransformerModel.ItineraryRequestData ): Observable<BookingHttpResponse<ItineraryResponseDTO>> {
        const endpoint:string = this.OutboundEndpoint;

        return this.baseProxy.post<ItineraryResponseDTO>(endpoint, requestBody)
            .pipe(
                throwIfEmpty(() => { throw new Error(); }),

                this.IbBookingErrorHandlerService.handleErrorOperator()
            );
    }

    /**
     * Return the availability itinerary for return flight as observable
     * @param responseId response ID from previous outbound itinerary availability response
     * @param offerId selected offer ID
     * @param sliceId selected slice ID
     * @return {Observable<AvailabilityTransformerModel.AvailabilityResponse>}
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3872489473/DRAFT+Get+Availability+for+Return+Itinerary
     */
    getReturnItinerary ( responseId:string, offerId:string, sliceId: number ): Observable<BookingHttpResponse<ItineraryResponseDTO>> {
        const endpoint:string = this.ReturnEndpoint
            .replace('{{responseId}}', responseId)
            .replace('{{offerId}}', offerId)
            .replace('{{sliceId}}', ''+sliceId);

        return this.baseProxy.get<ItineraryResponseDTO>(endpoint)
            .pipe(
                //Check if fareFamilies Conditions has value and return error if not
                retry({
                    count: HttpServicesConstants.NUM_ATTEMPS,
                    delay:(errors)=>{
                        if(errors.status === 410 && errors.error?.errors[0].code === 'SSE_AVM_10205'){
                            return timer(HttpServicesConstants.TIME_DELAY);
                        } else return throwError(()=>errors);
                    }
                }),
                throwIfEmpty(() => { throw new Error(); }),
                this.IbBookingErrorHandlerService.handleErrorOperator()
            );
    }
}
