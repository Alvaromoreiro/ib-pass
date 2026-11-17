import { downgradeToAJSService } from 'ib-web-commons/utils';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { CheckinSalesforceRxProxy } from '@shared/http-services/proxy/ib-checkin-salesforce-rx-proxy.service';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { BaseServiceConfigJson } from 'ib-web-commons/proxies';

@Injectable({ providedIn: 'root' })
export class IbTravelDocumentsService {
    constructor (
        private CheckinSalesforceRxProxy: CheckinSalesforceRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService
    ) { }

    private getHeadersConfig (locale?: string): BaseServiceConfigJson {
        return {
            headers: {
                //'Accept': 'application/json, text/plain, */*',
                //'Content-Type': 'application/json;charset=utf-8',
                //'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': locale || 'es-ES'
                //'Access-Control-Allow-Origin': '*'
            },
            withCredentials: false
        };
    }

    getTravelDocuments (locale?: string): Promise<any> {
        const endpoint = CheckinAppConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;
        const config = this.getHeadersConfig(locale);

        return lastValueFrom(
            this.CheckinSalesforceRxProxy.get<any>(endpoint, config)
                .pipe(
                    map((response: any) => response),
                    this.IbCHttpErrorHandlerService.handleErrorOperator()
                )
        );
    }

    postTravelDocuments (data: any, locale?: string): Promise<any> {
        const endpoint = CheckinAppConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;
        const config = this.getHeadersConfig(locale);

        return lastValueFrom(
            this.CheckinSalesforceRxProxy.post<any>(endpoint, data, config)
                .pipe(
                    map((response: any) => response),
                    this.IbCHttpErrorHandlerService.handleErrorOperator()
                )
        );
    }

    putTravelDocuments (documentId: string, data: any, locale?: string): Promise<void> {
        const baseEndpoint = CheckinAppConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;
        const endpoint = `${baseEndpoint}/${encodeURIComponent(documentId)}`;
        const config = this.getHeadersConfig(locale);

        return lastValueFrom(
            this.CheckinSalesforceRxProxy.put<void>(endpoint, data, config)
                .pipe(
                    map(() => void 0),
                    this.IbCHttpErrorHandlerService.handleErrorOperator()
                )
        );
    }
}

downgradeToAJSService('IbTravelDocumentsService', IbTravelDocumentsService, 'ib-checkin-services-module');
