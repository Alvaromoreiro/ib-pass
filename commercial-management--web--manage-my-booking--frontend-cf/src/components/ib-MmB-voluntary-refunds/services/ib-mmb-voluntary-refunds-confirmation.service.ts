import { Injectable } from "@angular/core";
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { MmBRxProxy } from "@src/components/services/proxy/ib-MmB-rx-proxy.service";
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { lastValueFrom, map, Observable } from 'rxjs';
import { MmBHttpResponse } from "@src/app/core/models/generic-models";
import { VoluntaryRefundsConfirmationModel } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-confirmation-model";
import { CommonsSessionStorageService } from "ib-web-commons/utils";

@Injectable({
    providedIn: 'root'
})
export class IbMmbVoluntaryRefundsConfirmationService {

    constructor(
        private MmBRxProxy: MmBRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    voluntaryRefundsItinRefundConfirmation = (refundType: string): Observable<MmBHttpResponse<VoluntaryRefundsConfirmationModel>> => {
        const flowId = this.CommonsSessionStorageService.get('flowId');
        const endpoint = refundType === 'PARTIAL' ? MmBAppConstants.voluntaryConfirmationPartialRefundURI.replace('{flowId}', flowId) : MmBAppConstants.voluntaryConfirmationRefundURI.replace('{flowId}', flowId);
        const config = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Accept-Encoding':'gzip, deflate, br',
                'newConfig': true,
                'Access-Control-Allow-Origin': '*'
            }
        };

        return this.MmBRxProxy.post <any> (endpoint, config)
        .pipe(this.IbCHttpErrorHandlerService.handleErrorOperator(), map((resp) => {
            return resp;
        }));
    };

    voluntaryRefundsItinRefundConfirmationPromised (refundType: string): Promise<MmBHttpResponse<VoluntaryRefundsConfirmationModel>> {
        return lastValueFrom(this.voluntaryRefundsItinRefundConfirmation(refundType));
    }
}
