import { Injectable } from '@angular/core';
import { BookingSalesforceRxProxy } from '../proxy/ib-booking-salesforce-rx-proxy.service';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { lastValueFrom, map } from 'rxjs';
import { IbBookingErrorHandlerService } from '../error';
import { CreateOrderRequestData, OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';

@Injectable({providedIn: 'root'})
export class CreateOrderService {
    
    constructor (
        private BookingSalesforceRxProxy: BookingSalesforceRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }
    
    public createOrderCall = ( requestData: CreateOrderRequestData ): Promise<OrderData> => {
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.createOrderServiceURI;
        return lastValueFrom(
            this.BookingSalesforceRxProxy.post( endpoint, requestData )
                .pipe(
                    map( ( response: any ) => response.data ),
                    this.IbBookingErrorHandlerService.handleErrorOperator()
                )
        );
    };
    
}