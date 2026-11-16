import { downgradeToAJSService } from 'ib-web-commons/utils';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { BookingSalesforceRxProxy } from '@shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingErrorHandlerService } from '@shared/http-services/error/ib-booking-error-handler.service';
@Injectable({providedIn: 'root'})
export class IbTravelDocumentsService {
    constructor (
        private BookingSalesforceRxProxy: BookingSalesforceRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    public getTravelDocuments = ( ): Promise<any> => {
        const url = BookingAppConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;
        return lastValueFrom( this.BookingSalesforceRxProxy.get( url )
            .pipe( map( ( response: any ) => {
                return response;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };

}
downgradeToAJSService('IbTravelDocumentsService', IbTravelDocumentsService, 'ib-booking-services-module');
