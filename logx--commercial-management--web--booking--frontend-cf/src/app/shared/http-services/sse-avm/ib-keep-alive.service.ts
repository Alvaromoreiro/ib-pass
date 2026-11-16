import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '../error';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { lastValueFrom, map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class KeepAliveService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }
    
    public keepAliveAvm = ( shoppingResponseId: string ): Promise<any> => {
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.keepAliveAvmServiceURI + shoppingResponseId;
        return lastValueFrom(
            this.BookingRxProxy.get( endpoint ).pipe(
                map( ( response: any ) => response.data ),
                this.IbBookingErrorHandlerService.handleErrorOperator()
            )
        );
    };
    
    public keepAliveOrm = ( orderId: string ): Promise<any> => {
        const endpoint = `${ HttpServicesConstants.DEFAULT_ENDPOINTS.keepAliveOrmServiceURI }${ orderId }`;
        return lastValueFrom(
            this.BookingRxProxy.get( endpoint ).pipe(
                map( ( response: any ) => response.data ),
                this.IbBookingErrorHandlerService.handleErrorOperator()
            )
        );
    };
    
}

downgradeToAJSService('KeepAliveService', KeepAliveService, 'ib-booking-services-module');