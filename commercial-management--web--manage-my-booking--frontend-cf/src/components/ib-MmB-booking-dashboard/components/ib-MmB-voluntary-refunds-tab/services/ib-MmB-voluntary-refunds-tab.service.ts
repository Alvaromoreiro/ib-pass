import { Injectable } from "@angular/core";
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { lastValueFrom, map, Observable } from 'rxjs';
import { MmBHttpErrorModel, MmBHttpResponse } from "@src/app/core/models/generic-models";
import { MmBRxProxy } from "@src/components/services/proxy/ib-MmB-rx-proxy.service";
import { VoluntaryRefundsModel } from "../models/ib-voluntary-refunds-model";
import { InputDirectItinRefund } from "@src/app/core/models/voluntary-refunds-model/input-direct-itin-refund";

@Injectable({
    providedIn: 'root',
  })
export class VoluntaryRefundsTabService {
    URL_SERVICE: string = '/directItinRefund';

    constructor (
        private MmBRxProxy: MmBRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService
    ) {}

    voluntaryRefundsItinRefund = (flowId: string): Observable<MmBHttpResponse<VoluntaryRefundsModel>> => {
        const endpoint = MmBAppConstants.voluntaryRefundURI + this.URL_SERVICE + '/' + flowId;
        const requestData: InputDirectItinRefund = {
            participants: null,
            sender: null,
            actions: [
                {
                    'actionType': 'cancel',
                    'orderId': null,
                    'owner': 'IB',
                    'passengers': []
                }
            ]
        };

        return this.MmBRxProxy.post <any> (endpoint, requestData)
        .pipe(this.IbCHttpErrorHandlerService.handleErrorOperator(), map((resp) => {
            return resp;
        }));
    };

    voluntaryRefundsItinRefundPromised (requestData: any): Promise<MmBHttpResponse<VoluntaryRefundsModel>> {
        return lastValueFrom(this.voluntaryRefundsItinRefund(requestData));
    }
}
