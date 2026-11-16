import { downgradeToAJSService } from "ib-web-commons/utils";
import { MmBRxProxy } from './proxy/ib-MmB-rx-proxy.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { lastValueFrom, map, Observable } from 'rxjs';
import { MmBHttpResponse } from '@src/app/core/models/generic-models';
import { Injectable } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbMmbErrorHandlerService } from './error/ib-Mmb-error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class IbMmbRetrieveOrderService {
    constructor(
        private MmBRxProxy: MmBRxProxy,
        private IbMmbErrorHandlerService: IbMmbErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    retrieveOrderPost = (surname: string, locator: string): Observable<MmBHttpResponse<any>> => {
        let request = {
            locator: locator,
            surname: surname
        };
        const endpoint = MmBAppConstants.retrieveOrderPostURI;
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return this.MmBRxProxy.post<any>(endpoint, request, config)
            .pipe(
                this.IbMmbErrorHandlerService.handleErrorOperator(), map((resp) => resp));
    };

    retrieveOrderCachedLotus = (flowId: string, otpCode: string, otpSessionId: string) => {
        const b64OtpCode = btoa(otpCode);
        const b64OtpSessionId = btoa(otpSessionId);
        const endpoint = MmBAppConstants.retrieveOrderCachedLotusURI.replace('{flowId}', flowId);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'session-token': b64OtpSessionId,
                'code': b64OtpCode
            }
        };
         return this.MmBRxProxy.get<any>(endpoint, config)
            .pipe(this.IbMmbErrorHandlerService.handleErrorOperator(), map((resp) => resp));
    };

    retrieveOrderPostPromised(surname: string, locator: string): Promise<any> {
        return lastValueFrom(this.retrieveOrderPost(surname, locator))
            .then(response => response.data)
            .catch(error => {
                let flowId = error?.data?.flowId || error?.flowId;
                if(flowId) {
                    this.CommonsSessionStorageService.set('flowId', flowId);
                }
                throw error;
            });
    };

    retrieveOrderCachedLotusPromised(flowId: string, otpCode: string, otpSessionId: string): Promise<any> {
        return lastValueFrom(this.retrieveOrderCachedLotus(flowId, otpCode, otpSessionId))
            .then(response => response.data)
            .catch(error => {
                if(error?.data?.flowId) {
                    this.CommonsSessionStorageService.set('flowId', error.data.flowId);
                }
                throw error;
            });
    };
};

downgradeToAJSService('IbMmbRetrieveOrderService', IbMmbRetrieveOrderService, 'ib-MmB-services-module');