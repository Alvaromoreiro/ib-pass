import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
export interface GetContextIdParams {
    flowId: string,
    onHoldId?: string;
}
export enum GetContextResponseWarningCodes {
    PMT_CTX_RESIDENT_NOT_VERIFIED = 'PMT_CTX_RESIDENT_NOT_VERIFIED'
}
export interface GetContextResponseWarnings {
    code: keyof typeof GetContextResponseWarningCodes;
    description: string;
}
export interface GetContextResponse {
    contextId: string;
    warnings: GetContextResponseWarnings[];
}
@Injectable({providedIn: 'root'})
export class IbPaymentContextService {
    constructor (
        private BookingRxProxy: BookingRxProxy
    ) { }

    /**
     * Return the context-id that's needed on payment web-component for initialization
     * @param {string} GetContextIdParams.flowId selected offer ID
     * @param {string} [GetContextIdParams.onHoldId] if OnHold flow selected onHold ID
     * @return {Promise<GetContextResponse>}
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3960438824/GET+PAYMENT-CONTEXT-ID+V1
     */
    public getPaymentContextId = async ( { flowId, onHoldId }: GetContextIdParams ): Promise<GetContextResponse> => {
        const baseUrl = HttpServicesConstants.DEFAULT_ENDPOINTS.GET_PMT_CONTEXT.replace( '{flowId}', flowId );
        const onHoldUrl = `&onHoldOptionId={onHoldOptionId}`;
        const url = !onHoldId ? baseUrl : `${baseUrl}${onHoldUrl.replace('{onHoldOptionId}', onHoldId)}`;
        return lastValueFrom( this.BookingRxProxy.get( url )
            .pipe(map( ( response: any ) => {
                return response.data;
            } ) ) );
    };

}
