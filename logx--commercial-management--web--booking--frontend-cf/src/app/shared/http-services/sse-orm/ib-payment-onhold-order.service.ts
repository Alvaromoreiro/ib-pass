import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { OnHoldFreeParams } from '@src/app/core/models/on-hold/on-hold-models';
import { IbBookingErrorHandlerService } from '../error/ib-booking-error-handler.service';
@Injectable({providedIn: 'root'})
export class IbPaymentOnholdOrderService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    /**
     * It holds an order and returns on hold order data confirmation
     * @param {string} OnHoldFreeParams.orderId orderId obtained from previous Create order
     * @param {string[]} OnHoldFreeParams.orderItemsId orderItemId for each Order Item that wants to be on hold in the service. Is a list of strings
     * @param {string} OnHoldFreeParams.onHoldOptionId 'On Hold' option id obtained from previous call to get fare data
     * @param {string} [OnHoldFreeParams.phone] 'Telephone number for sending sms. Validation pattern: ^(\\+[0-9]{9,20}|00[0-9]{9,20}|(?!00)[0-9]{9,20})
     * @return {Promise<any>}
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/4172841165/On+Hold+Order+Free+REST
     */
    public freeOnHoldOrder = ( args: OnHoldFreeParams ): Promise<any> => {
        const url = `${ BookingAppConstants.DEFAULT_ENDPOINTS.onHoldOrderServiceURI }/free`;
        return lastValueFrom( this.BookingRxProxy.post( url, args )
            .pipe( map( ( response: any ) => {
                return response;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };

}
