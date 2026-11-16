import { Injectable } from '@angular/core';
import { BookingSalesforceRxProxy } from '@shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { lastValueFrom } from 'rxjs';
import { IbBookingErrorHandlerService } from '@shared/http-services/error';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
@Injectable ({providedIn:'root'})
export class CallBookingAvailabilityService {

    constructor (
        private BookingSalesforceRxProxy: BookingSalesforceRxProxy,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
        
    ) {}
   
    getBookingAvailability = (requestData: AvailabilityTransformerModel.AvailabilityRequestData ) : Promise<unknown> => {
        let endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.availabilityServiceURI;
        const multiCitySearch = this.CommonsSessionStorageService.get('multiCitySearch');
        if(multiCitySearch) {
            endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.availabilityMultiTripServiceURI;
        }
        return lastValueFrom(this.BookingSalesforceRxProxy.post(endpoint, requestData)
            .pipe(this.IbBookingErrorHandlerService.handleErrorOperator()));
    };
    getNextInfoSlice = (respondeId, offerId) => {
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.availabilityMultiTripServiceURI + '/' + respondeId + '/' + offerId;
        return lastValueFrom(this.BookingSalesforceRxProxy.get(endpoint)
            .pipe(this.IbBookingErrorHandlerService.handleErrorOperator()));
    };
}
downgradeToAJSService('CallBookingAvailabilityService', CallBookingAvailabilityService, 'ib-booking-availability-module');
 