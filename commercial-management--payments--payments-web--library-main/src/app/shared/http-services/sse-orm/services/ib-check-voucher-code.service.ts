import { Injectable } from '@angular/core';
import { PmtConstants } from '../../../../core/ib-pmt-constants';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { PmtRxProxy } from '../../proxy/ib-pmt-rx-proxy.service';
import { IbPmtErrorHandlerService } from '../../error';
import { lastValueFrom, map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class IbCheckVoucherCodeService {
    constructor (
        private PmtRxProxy: PmtRxProxy,
        private IbPmtErrorHandlerService: IbPmtErrorHandlerService
    ) { }

    public checkVoucherCode = ( serviceURI: string, voucherCode: string, flowId: string ) => {
        const url = this.getCheckVoucherUrl(serviceURI, voucherCode, flowId);
        return lastValueFrom( this.PmtRxProxy.get( url )
            .pipe(map( ( response: any ) => {
                return response;
            } ), this.IbPmtErrorHandlerService.handleErrorOperator() ) );
    };

    public deleteVoucherCode = ( serviceURI: string, voucherCode: string, flowId: string ) => {
        const url = this.getCheckVoucherUrl(serviceURI, voucherCode, flowId);
        return lastValueFrom( this.PmtRxProxy.delete( url )
            .pipe(map( ( response: any ) => {
                return response;
            } ), this.IbPmtErrorHandlerService.handleErrorOperator() ) );
    };

    public validateVoucherCodeOtp = ( serviceURI, orderId, voucherId, otpSessionId ): Promise<any> => {
        const endpointUrl = `${ serviceURI }${ PmtConstants.ENDPOINTS.DEFAULT.checkVoucherCodeServiceURI }`;
        const modifiedParams = `${ PmtConstants.ENDPOINTS.DEFAULT.checkPostVoucherCodeParamsURI
            .replace( '{orderId}', orderId )
            .replace( '{voucherId}', voucherId )
            .replace( '{otpSessionId}', otpSessionId ) }`;
        const url = `${ endpointUrl }${ modifiedParams }`;
        return lastValueFrom( this.PmtRxProxy.post( url, {})
            .pipe(map( ( response: any ) => {
                return response;
            } ), this.IbPmtErrorHandlerService.handleErrorOperator() ) );
    };

    private getCheckVoucherUrl = ( serviceURI:string, voucherCode: string, flowId: string ):string => {
        const endpointUrl = `${ serviceURI }${ PmtConstants.ENDPOINTS.DEFAULT.checkVoucherCodeServiceURI }`;
        const modifiedParams = `${ PmtConstants.ENDPOINTS.DEFAULT.checkVoucherCodeServiceParamsURI
            .replace( '{flowId}', flowId )
            .replace( '{voucherCode}', voucherCode )}`;
        return `${endpointUrl}${modifiedParams}`;
    };
}

downgradeToAJSService('IbCheckVoucherCodeService', IbCheckVoucherCodeService, 'ib-pmt-services-http-module');
