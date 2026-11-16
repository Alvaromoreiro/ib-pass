import { downgradeToAJSService } from "ib-web-commons/utils";
import { Injectable } from "@angular/core";
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { MmBRxProxy } from "@src/components/services/proxy/ib-MmB-rx-proxy.service";
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { lastValueFrom, map, Observable } from 'rxjs';
import { MmBHttpResponse } from "@src/app/core/models/generic-models";

@Injectable({
    providedIn: 'root'
})
export class IbMmbOrderHandlerService {
    constructor(
        private MmBRxProxy: MmBRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService
    ) {}

    retrieveOrderHandler = (surname: string, locator: string): Observable<MmBHttpResponse<any>> => {
        const endpoint = MmBAppConstants.retrieveOrderHandlerURI;
        const requestBody = {
            locator: locator,
            surname: surname
        };
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return this.MmBRxProxy.post<any>(endpoint, requestBody, config)
            .pipe(this.IbCHttpErrorHandlerService.handleErrorOperator(), map((resp) => resp));
    };

    retrieveOrderHandlerPromised(surname: string, locator: string): Promise<any> {
        return lastValueFrom(this.retrieveOrderHandler(surname, locator))
            .then(response => response.data)
            .catch(error => {
                if (error?.body?.flowId) {
                    // eslint-disable-next-line no-console
                    console.info('Error con flowId:', error.body.flowId);
                }
                throw error;
            });
    }
}

downgradeToAJSService('IbMmbOrderHandlerService', IbMmbOrderHandlerService, 'ib-MmB-services-module');