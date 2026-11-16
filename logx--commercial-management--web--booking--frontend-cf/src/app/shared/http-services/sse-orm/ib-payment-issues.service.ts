import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { IbBookingErrorHandlerService } from '../error';
import { GetPaymentContextError } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-error.model';
export interface GetPaymentsIssues {
    flowId: string,
    status: string;
    error: string;
    contextId: string;
}
@Injectable({providedIn: 'root'})
export class IbPaymentsIssuesService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
    ) { }

    public getPaymentIssue = async ( { flowId, status, error, contextId }: GetPaymentsIssues ): Promise<GetPaymentContextError> => {
        const baseUrl = HttpServicesConstants.DEFAULT_ENDPOINTS.GET_PMT_ISSUE
            .replace( '{flowId}', flowId ).replace('{status}', status).replace('{error}', error).replace('{contextId}', contextId);
        return lastValueFrom( this.BookingRxProxy.get( baseUrl )
            .pipe(map( ( response: any ) => {
                return response.data;
            } ), this.IbBookingErrorHandlerService.handleErrorOperator()) );
    };

}
