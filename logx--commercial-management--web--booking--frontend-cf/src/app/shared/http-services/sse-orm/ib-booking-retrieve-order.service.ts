import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '../error';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';

@Injectable({
    providedIn: 'root'
})
export class IbBookingRetrieveOrderService {

    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) {}
  
    public retrieveOrder = (surname:string, locator:string ): Promise<any> => {
        let requestData = {locator, surname};
        const url = HttpServicesConstants.DEFAULT_ENDPOINTS.retrieveOrderURI;
        return lastValueFrom( this.BookingRxProxy.post( url, requestData )
            .pipe( map( ( response: any ) => {
                return response.data;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };
}

downgradeToAJSService('IbBookingRetrieveOrderService', IbBookingRetrieveOrderService, 'ib-booking-services-module', []);
