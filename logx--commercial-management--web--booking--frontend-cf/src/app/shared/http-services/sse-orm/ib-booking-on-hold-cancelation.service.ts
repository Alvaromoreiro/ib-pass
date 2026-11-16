import { Injectable } from '@angular/core';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { lastValueFrom, map } from 'rxjs';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';


@Injectable({providedIn: 'root'})

export class CancelOnHoldOrderService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        private localStorageService: CommonsSessionStorageService
    ) {}

    public cancelOnHoldOrder = ( ): Promise<any> => {
        const url = HttpServicesConstants.DEFAULT_ENDPOINTS.cancelOnHoldOrderURI + this.localStorageService.get('flowId') + '/cancel';
        return lastValueFrom( this.BookingRxProxy.delete( url )
            .pipe( map( ( response: any ) => {
                return response;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };
}
