import { Injectable } from '@angular/core';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '../error';
import { lastValueFrom, map } from 'rxjs';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { CheckVoucherOtpValidateResponse, CheckVoucherResponse } from '@src/app/core/models/ib-booking-payments/ib-booking-voucher-models';
import { downgradeToAJSService } from 'ib-web-commons/utils';

@Injectable({ providedIn: 'root' })
export class IbBookingCheckVoucherCodeService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    public checkVoucherCode = (voucherCode: string, orderId: string): Promise<{ data: CheckVoucherResponse | CheckVoucherOtpValidateResponse, code: number }> => {
        const url = this.getCheckVoucherUrl(voucherCode, orderId);
        return lastValueFrom(this.BookingRxProxy.get(url)
            .pipe(map((response: any) => {
                return response;
            }), this.IbBookingErrorHandlerService.handleErrorOperator()));
    };

    public deleteVoucherCode = (voucherCode: string, orderId: string): Promise<{ data: CheckVoucherResponse, code: number }> => {
        const url = this.getCheckVoucherUrl(voucherCode, orderId);
        return lastValueFrom(this.BookingRxProxy.delete(url)
            .pipe(map((response: any) => {
                return response;
            }), this.IbBookingErrorHandlerService.handleErrorOperator()));
    };

    public validateVoucherCodeOtp = (orderId, voucherId, otpSessionId): Promise<{ data: CheckVoucherResponse, code: number }> => {
        const endpointUrl = HttpServicesConstants.DEFAULT_ENDPOINTS.CHECK_VOUCHER_CODE_SERVICE;
        const modifiedParams = HttpServicesConstants.PARAMS.checkPostVoucherCodeParamsURI
            .replace('{orderId}', orderId)
            .replace('{voucherId}', voucherId)
            .replace('{otpSessionId}', otpSessionId);
        const url = `${endpointUrl}${modifiedParams}`;
        return lastValueFrom(this.BookingRxProxy.post(url, {})
            .pipe(map((response: any) => {
                return response;
            }), this.IbBookingErrorHandlerService.handleErrorOperator()));
    };

    private getCheckVoucherUrl = (voucherCode: string, orderId: string): string => {
        const endpointUrl = HttpServicesConstants.DEFAULT_ENDPOINTS.CHECK_VOUCHER_CODE_SERVICE;
        const modifiedParams = `${HttpServicesConstants.PARAMS.checkVoucherCodeServiceParamsURI
            .replace('{flowId}', orderId)
            .replace('{voucherCode}', voucherCode)}`;
        return `${endpointUrl}${modifiedParams}`;
    };    
}
downgradeToAJSService('IbBookingCheckVoucherCodeService', IbBookingCheckVoucherCodeService, 'ib-booking-services-module', []);