import { Inject, Injectable } from '@angular/core';
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { MmBRxProxy } from "@src/components/services/proxy/ib-MmB-rx-proxy.service";
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { Observable, lastValueFrom, map } from 'rxjs';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { NewPaymentAvailableResponse } from '../models/ib-Mmb-payments-model';
import { PAYMENT_REALMS, PAYMENT_SUB_REALMS } from '../enums/ib-Mmb-payments-enum';

@Injectable({providedIn: 'root'})
export class MmbNewPaymentAvailableService {
    constructor (
        private proxy: MmBRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ){}
    /**
     * @description Function to calculate the realm of the current flow
     * @returns A string that will be used as realm into the request
     */
    private getRequestRealm = (): string => {
        return PAYMENT_REALMS.MMB;
    };

    /**
     * @description Function to calculate the query parameters to be sent into the request.
     *  This query param has just one parameter which is subrealm to which the current flow belongs.
     * @returns A string that will be used as query parameters of the request
     */
    private getRequestQueryParam = (): string => {
        const querybase = '?subRealm=';
        const flowApp: string = this.CommonsSessionStorageService.get('flowApp');

        if(flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE) return querybase + PAYMENT_SUB_REALMS.CHANGE_FLIGHT;
        else if(flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES) return querybase + PAYMENT_SUB_REALMS.ANCILLARIES;
        else if(flowApp === MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD) return querybase + PAYMENT_SUB_REALMS.ON_HOLD;
        else return querybase + PAYMENT_SUB_REALMS.DEFAULT;
    };

    /**
     * @description Function to make the call to the service that retrieves if its available the new payments view.
     * It returns the response as an observable
     * @returns Observable<NewPaymentAvailableResponse>
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3898409197/GET+NewPaymentAvailable+V1
     */
    public callRx = (): Observable<NewPaymentAvailableResponse> => {
        const realm =  this.getRequestRealm();
        const queryParams = this.getRequestQueryParam();
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        const country: string = bookingInfo?.contextMetadata?.country;
        let endpoint =  `${MmBAppConstants.DEFAULT_ENDPOINTS.NEW_PAYMENT_AVAILABLE}${queryParams}`
            .replace('{{marketId}}', country)
            .replace('{{realm}}', realm);
        return this.proxy.get<NewPaymentAvailableResponse>(endpoint, {responseType: 'json'})
            .pipe(map((resp)=> resp?.data), this.IbCHttpErrorHandlerService.handleErrorOperator());
    };

    /**
     * @description Function to make the call to the service that retrieves if its available the new payments view.
     * It returns the response as promise
     * @returns Promise<NewPaymentAvailableResponse>
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3898409197/GET+NewPaymentAvailable+V1
     */
    public callPromised = (): Promise<NewPaymentAvailableResponse> => {
        return lastValueFrom(this.callRx());
    };






}
