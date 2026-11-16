import { downgradeToAJSService } from "ib-web-commons/utils";
import { Injectable } from "@angular/core";
import { lastValueFrom, map, Observable } from 'rxjs';
import { MmBSalesforceRxProxy } from "@src/components/services/proxy/ib-MmB-salesforce-rx-proxy.service";
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { TravelDocumentsModel } from "@src/app/core/models/travel-documents/travel-documents-model";

@Injectable({
    providedIn: 'root'
})
export class IbMmbTravelDocumentsService {

    constructor(
        private MmBSalesforceRxProxy: MmBSalesforceRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService
    ) {}

    getTravelDocuments = (): Promise<TravelDocumentsModel> => {
        const endpoint = MmBAppConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;

        return lastValueFrom(this.MmBSalesforceRxProxy.get<any>(endpoint)
        .pipe( map ( (response: any ) => {
            return response;

        } ), this.IbCHttpErrorHandlerService.handleErrorOperator() ) );

    };

    postTravelDocuments = (): Promise<TravelDocumentsModel> => {
        const endpoint = MmBAppConstants.SALESFORCE_ENDPOINTS.TRAVEL_DOCUMENTS;
        const config = {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
                'Accept-Encoding':'gzip, deflate, br',
                'newConfig': true,
                'Access-Control-Allow-Origin': '*'
            }
        };

        return lastValueFrom(this.MmBSalesforceRxProxy.post<any>(endpoint, config)
        .pipe( map ( (response: any ) => {
            return response;

        } ), this.IbCHttpErrorHandlerService.handleErrorOperator() ) );
    };
}

downgradeToAJSService('IbMmbTravelDocumentsService', IbMmbTravelDocumentsService, 'ib-MmB-services-module');
