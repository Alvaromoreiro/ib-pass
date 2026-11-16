import { Injectable } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { MmBRxProxy } from './proxy/ib-MmB-rx-proxy.service';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { Observable, lastValueFrom, map, of } from 'rxjs';
import { MmBHttpResponse } from '@src/app/core/models/generic-models';
import { FFCompaniesResponse } from './models/ib-frequent-flyers-companies-model';

@Injectable({
    providedIn :'root'
})
export class FrequentFlyersCompaniesService {
    constructor (
        private MmBRxProxy: MmBRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
    ) {}

    getFrequentFlyersCompanies = (): Observable<MmBHttpResponse<FFCompaniesResponse[]>> => {
        const endpoint = MmBAppConstants.companiesServiceURI;
        const config: any = {
            headers: {
                'Cache-Control': 'private, max-age=600'
            }
        };
        const frequentFlyersCompanies = this.CommonsSessionStorageService.get<FFCompaniesResponse[]>('frequentFlyersCompanies');

        if (frequentFlyersCompanies === null) {
            return this.MmBRxProxy.get<any>(endpoint, config)
                .pipe(
                    this.IbCHttpErrorHandlerService.handleErrorOperator(),
                    map((resp) => {
                        this.CommonsSessionStorageService.set('frequentFlyersCompanies', resp.data);
                        return resp.data as MmBHttpResponse<FFCompaniesResponse[]>
                    })
                );
        } else {
            return of(frequentFlyersCompanies as unknown as MmBHttpResponse<FFCompaniesResponse[]>);
        };
    };

    getFrequentFlyersCompaniesPromised (): Promise<MmBHttpResponse<FFCompaniesResponse[]>> {
        return lastValueFrom(this.getFrequentFlyersCompanies());
    };
};

downgradeToAJSService('FrequentFlyersCompaniesService', FrequentFlyersCompaniesService, 'ib-MmB-services-module');
