import { Injectable } from '@angular/core';
import { downgradeToAJSService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { PmtRxProxy } from '../proxy/ib-pmt-rx-proxy.service';
import { PmtConstants } from '../../../core/ib-pmt-constants';
import { lastValueFrom, map } from 'rxjs';
import { IbPmtErrorHandlerService } from '../error/ib-pmt-error-handler.service';

@Injectable({providedIn: 'root'})
export class IbAssfassVoucherService {
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private PmtRxProxy: PmtRxProxy,
        private IbPmtErrorHandlerService: IbPmtErrorHandlerService
    ) { }

    private getPassengerEmail = () => {
        let contactData: any;
        if(this.CommonsSessionStorageService.get('flowApp') === 'MMBANC') {
            contactData = this.CommonsSessionStorageService.get('bookingInfo');
            const [filteredContactData] = contactData.passengers.filter(data => data.contactInfo?.email != undefined);
            return filteredContactData?.contactInfo?.email ?? 'email@email.com';
        }else {
            const contactData: any = this.CommonsSessionStorageService.get('disruptionContactApis');
            const [filteredContactData] = contactData.filter(data => data.disruptionContact?.email != undefined);
            return filteredContactData?.disruptionContact?.email ?? 'email@email.com';
        }
    };

    public getVoucherValidation = ( voucherCode: string, flowId: string ) => {

        //const email = this.CommonsSessionStorageService.get('disruptionContactApis')[0]?. ?? this.CommonsSessionStorageService.get('bookingInfo'), 
        const email = this.getPassengerEmail(),
            url = `${PmtConstants.ENDPOINTS.DEFAULT.ancillariesNewURI}${flowId}/voucher/validation/${voucherCode}`, 
            body = {email: email};
        
        return lastValueFrom( this.PmtRxProxy.post( url, body )
            .pipe(map( ( response: any ) => {
                return response;
            } ), this.IbPmtErrorHandlerService.handleErrorOperator() ) );
    };

    public validateVoucherCodeOtp = ( flowId: string, voucherId: string, otpSessionId: string ): Promise<any> => {
        const email = this.getPassengerEmail(), 
            body = {email: email}, 
            url = `${PmtConstants.ENDPOINTS.DEFAULT.ancillariesNewURI}${flowId}/voucher/validation/${voucherId}/otp/${otpSessionId}`;
        
        return lastValueFrom( this.PmtRxProxy.post( url, body)
            .pipe(map( ( response: any ) => {
                return response;
            } ), this.IbPmtErrorHandlerService.handleErrorOperator() ) );
    };
}
downgradeToAJSService('IbAssfassVoucherService', IbAssfassVoucherService, 'ib-pmt-services-http-module');