import { Injectable } from '@angular/core';
import { MmBHttpResponse } from '@src/app/core/models/generic-models';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { lastValueFrom, map, Observable } from 'rxjs';
import { MmBRxProxy } from './proxy/ib-MmB-rx-proxy.service';

@Injectable({
    providedIn: 'root'
})
export class VoluntaryRefundLogService {
    constructor (
        private MmBRxProxy: MmBRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService
    ) { }

    voluntaryRefundLog = (flowId: string): Observable<MmBHttpResponse<any>> => {
        const endpoint = MmBAppConstants.voluntaryRefundLogURI.replace('{flowId}', flowId);
        return this.MmBRxProxy.get<any>(endpoint)
            .pipe(this.IbCHttpErrorHandlerService.handleErrorOperator(), map((resp) => resp));
    };

    getVoluntaryRefundLog(flowId: string): Promise<any> {
        return lastValueFrom(this.voluntaryRefundLog(flowId)).then(response => response.data);
    }
}

downgradeToAJSService('VoluntaryRefundLogService', VoluntaryRefundLogService, 'ib-MmB-services-module');
