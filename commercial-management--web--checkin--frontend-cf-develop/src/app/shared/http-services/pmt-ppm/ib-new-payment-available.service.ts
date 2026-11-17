/* eslint-disable no-console */
import { Inject, Injectable } from '@angular/core';
import { Observable, lastValueFrom, map } from 'rxjs';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { NewPaymentAvailableResponse } from '../../../core/models/ib-checkin-payments/ib-checkin-payments-model';
import { IbCBaseRestService } from 'ib-web-commons/proxies';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';

@Injectable({providedIn: 'root'})
export class CheckinNewPaymentAvailableService {
    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private IbCBaseRestService: IbCBaseRestService,
        private IbCHttpErrorHandlerService:IbCHttpErrorHandlerService,
        private sessionStorageService: CommonsSessionStorageService
    ){}


    /**
     * @description Function to make the call to the service that retrieves if its available the new payments view.
     * It returns the response as an observable
     * @returns Observable<NewPaymentAvailableResponse>
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3898409197/GET+NewPaymentAvailable+V1
     */
    public callRx = () : Observable<NewPaymentAvailableResponse> => {
        const summaryInfo =  this.sessionStorageService.get<any>('summaryInfo' );
        const issueCountry = summaryInfo?.context?.issueCountry ?? this.$rootScope.appMarket.toUpperCase();
        let endpoint =  `${CheckinAppConstants.DEFAULT_ENDPOINTS.newPaymentAvailableURI}?subRealm=${CheckinAppConstants.SUBREALM.ANCILLARIES_PURCHASE}`
            .replace('{{marketId}}', issueCountry)
            .replace('{{realm}}', CheckinAppConstants.CKI_REALM);
        return this.IbCBaseRestService.get<NewPaymentAvailableResponse>(endpoint, {responseType: 'json'})
            .pipe(map((resp)=> (<any>resp).body), this.IbCHttpErrorHandlerService.handleErrorOperator() );
    };
    /**
     * @description Function to make the call to the service that retrieves if its available the new payments view.
     * It returns the response as promise
     * @returns Promise<NewPaymentAvailableResponse>
     * @see https://transform.atlassian.net/wiki/spaces/CCP/pages/3898409197/GET+NewPaymentAvailable+V1
     */
    public callPromised = () :Promise<NewPaymentAvailableResponse> =>  {
        return lastValueFrom(this.callRx());
    };
}
