import { Injectable } from '@angular/core';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { lastValueFrom, map, throwError, timeout } from 'rxjs';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { TranslateService } from '@ngx-translate/core';

@Injectable({providedIn: 'root'})

export class CallAncillariesService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private TranslateService: TranslateService
    ) {}

    public getAncillaries = (): Promise<any> => {
        let locator = '';
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        if (bookingInfo?.order?.bookingReferences?.length > 0) {
            locator = bookingInfo.order.bookingReferences[0].reference;
            this.CommonsSessionStorageService.set('PNR', locator);
        }
        const flowId = this.CommonsSessionStorageService.get('flowId');
        const endpoint = `${HttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURI}${flowId}/ancillaries?locator=${locator}`;
        const maxEditableTimeout :number = this.CommonsSessionStorageService.get('ancillariesServiceTimeoutValue') || BookingAppConstants.ANCILLARIES_WAIT_TIMEOUT;

        if (flowId !== null) {
            return lastValueFrom( this.BookingRxProxy.get( endpoint )
                .pipe(
                    timeout( maxEditableTimeout ),
                    map( ( response: any ) => response.data ),
                    this.IbBookingErrorHandlerService.handleErrorOperator()
                ) );
        } else{
            return lastValueFrom(throwError(()=>{
                return {
                    errorCode: 'IB_00002',
                    message: this.TranslateService.instant('SESSION_EXPIRED'),
                    internalErrorCode: 'IB_00002'
                };
            }));
        }
    };

    public getInsurance = ( country: string ): Promise<any> => {
        const flowId = this.CommonsSessionStorageService.get('flowId');
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURI;
        const url = `${endpoint+flowId}/ancillaries?ancillaryType=INSURANCE&residenceCountry=${country}`;
        return lastValueFrom( this.BookingRxProxy.get( url )
            .pipe( map( ( response: any ) => response.data ),
                this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };

    public getAllianzFussionInsurance = ( country: string ): Promise<any> => {
        const flowId = this.CommonsSessionStorageService.get('flowId');
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURI;
        const url = `${endpoint+flowId}/ancillaries?ancillaryType=ALLIANZ_FUSION&residenceCountry=${country}`;
        return lastValueFrom( this.BookingRxProxy.get( url )
            .pipe( map( ( response: any ) => response.data ),
                this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };

    public getUpgradingBidAncillarie = (): Promise<any> => {
        const flowId = this.CommonsSessionStorageService.get('flowId');
        const endpoint = HttpServicesConstants.DEFAULT_ENDPOINTS.ancillariesURI;
        const url = `${endpoint+flowId}/ancillaries?ancillaryType=UPGRADING_BID`;
        return lastValueFrom( this.BookingRxProxy.get( url )
            .pipe( map( ( response: any ) => response.data ),
                this.IbBookingErrorHandlerService.handleErrorOperator() ) );
    };
}

downgradeToAJSService('CallAncillariesService', CallAncillariesService, 'ib-booking-services-module');
