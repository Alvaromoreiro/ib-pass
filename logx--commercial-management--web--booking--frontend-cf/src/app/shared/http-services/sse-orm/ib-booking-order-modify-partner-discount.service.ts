import { Injectable } from '@angular/core';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '../error';
import { lastValueFrom, map } from 'rxjs';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { CheckVoucherOtpValidateResponse, CheckVoucherResponse } from '@src/app/core/models/ib-booking-payments/ib-booking-voucher-models';

@Injectable({ providedIn: 'root' })
export class IbBookingOrderModifyPartnerDiscount {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    public addPartnerDiscount = (partnerId: string, orderId: string): Promise<{ data: CheckVoucherResponse | CheckVoucherOtpValidateResponse, code: number }> => {
        const url = this.getOrmModifyPartnerURL(partnerId, orderId);
        return lastValueFrom(this.BookingRxProxy.get(url)
            .pipe(map((response: any) => {
                return response;
            }), this.IbBookingErrorHandlerService.handleErrorOperator()));
    };

    public deletePartnerDiscount = (partnerId: string,  orderId: string): Promise<{ data: CheckVoucherResponse, code: number }> => {
        const url = this.getOrmModifyPartnerURL(partnerId, orderId);
        return lastValueFrom(this.BookingRxProxy.delete(url)
            .pipe(map((response: any) => {
                return response;
            }), this.IbBookingErrorHandlerService.handleErrorOperator()));
    };
    private getOrmModifyPartnerURL = (partnerId: string, orderId: string): string => {
        const endpointUrl = HttpServicesConstants.DEFAULT_ENDPOINTS.ORM_MODIFY_PARTNER
            .replace('{flowId}', orderId)
            .replace('{partnerId}', partnerId);
        return endpointUrl;
    };    
}