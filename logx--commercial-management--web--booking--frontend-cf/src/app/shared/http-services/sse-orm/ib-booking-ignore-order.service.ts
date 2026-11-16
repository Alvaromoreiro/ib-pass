import { Injectable } from '@angular/core';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { IbBookingErrorHandlerService } from '../error';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { downgradeToAJSService } from 'ib-web-commons/utils';

@Injectable({providedIn: 'root'})
export class IgnoreOrderService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }
    
    public ignoreOrder = (orderId: string): Promise<OrderData> => {
        const endpoint = `${HttpServicesConstants.DEFAULT_ENDPOINTS.ignoreOrderServiceURI}/${orderId}`;
        return lastValueFrom(
            this.BookingRxProxy.delete(endpoint).pipe(
                map((response: any) => response.data),
                this.IbBookingErrorHandlerService.handleErrorOperator()
            )
        );
    };
}

downgradeToAJSService('BookingIgnoreOrderService', IgnoreOrderService, 'ib-booking-services-module');