import { Injectable } from '@angular/core';
import { IbCBaseSFService, IbCPromiseBaseSFService, LOGGED_FLOW_BLOCKING } from 'ib-web-commons/proxies';
import { IbCHttpErrorHandlerService } from '../errors/ib-commons-http-error-handler.service';
import { map, Observable } from 'rxjs';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { CommonsHttpServicesConstants } from 'ib-web-commons/constants';
import { HttpContext } from '@angular/common/http';
import { PersonalDataZeroResponse } from 'ib-web-commons/models';

@Injectable({
    providedIn: 'root'
})
export class IbCPersonalDataZeroService {

    constructor (
        private baseService: IbCBaseSFService,
        private errorHandler: IbCHttpErrorHandlerService,
        private basePromiseService: IbCPromiseBaseSFService
    ) {}


    /**
     * @description Get the personal data information for Iberia users
     */
    getPersonalData (): Observable<PersonalDataZeroResponse> {
        const endpoint = CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.PERSONAL_DATA_SERVER;

        return this.baseService.get<PersonalDataZeroResponse>(endpoint, {
            context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true)
        }).pipe(
            map((res) => res.body),
            this.errorHandler.handleErrorOperator()
        );
    }

    /**
     * @description Update personal data information for Iberia users
     */
    updatePersonalData (body:PersonalDataZeroResponse) {
        const endpoint = CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.PERSONAL_DATA_SERVER;

        return this.baseService.put<undefined>(endpoint, body, {
            context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true)
        }).pipe(
            map((res) => res.body),
            this.errorHandler.handleErrorOperator()
        );
    }

    /**
     * @description Update personal data from Iberia User as Promise interface.
     */
    async updatePersonalDataPromise (bodyData: PersonalDataZeroResponse) {
        const endpoint = CommonsHttpServicesConstants.SALESFORCE_ENDPOINTS.PERSONAL_DATA_SERVER;

        return this.basePromiseService.put<undefined>(endpoint, bodyData, {
            context: new HttpContext().set(LOGGED_FLOW_BLOCKING, true)
        }).catch(async (error) => Promise.reject(error));
    }

}
type IBCPersonalDataZeroService = IbCPersonalDataZeroService;
export type { IBCPersonalDataZeroService };
downgradeToAJSService('IBCPersonalDataZeroService', IbCPersonalDataZeroService, 'ib-commons-http-service-module');

