import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { HttpServicesConstants } from '@core/constants/ib-http-services-constants';
import { IbBookingErrorHandlerService } from '../error';
import { PaymentSuccessDTO } from '@core/models/ib-booking-payments/ib-booking-payments-success.model';
export interface GetPaymentSuccessRequest {
    flowId: string,
    contextId: string
}
@Injectable({providedIn: 'root'})
export class IbPaymentSuccessService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    public postPaymentSuccess = async ( request: GetPaymentSuccessRequest ): Promise<PaymentSuccessDTO> => {
        const baseUrl = HttpServicesConstants.DEFAULT_ENDPOINTS.PAY_SUCCESS_ORM;
        return lastValueFrom( this.BookingRxProxy.post( baseUrl, request)
            .pipe(
                map( ( response: any ) => response.data),
                this.IbBookingErrorHandlerService.handleErrorOperator() 
            ));
    };
}
