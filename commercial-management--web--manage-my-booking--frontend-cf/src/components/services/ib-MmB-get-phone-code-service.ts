import { Injectable } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { PrefixResponse } from './models/ib-prefix-model';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { MmBRxProxy } from './proxy/ib-MmB-rx-proxy.service';
import { lastValueFrom, map, Observable, of } from 'rxjs';
import { MmBHttpResponse } from '@src/app/core/models/generic-models';

@Injectable({
    providedIn :'root'
})

export class IbMmBGetPhoneCodeService {
    constructor (
        private MmBRxProxy: MmBRxProxy,
        private IbCHttpErrorHandlerService: IbCHttpErrorHandlerService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
    ) { }

    getPhoneCodesList = (): Observable<MmBHttpResponse<PrefixResponse[]>> => {
        const endpoint = MmBAppConstants.DEFAULT_ENDPOINTS.phoneCodesURI;
        const config: any = {
            headers: {
                'Cache-Control': 'private, max-age=600'
            }
        };

        const phoneCodeList = this.CommonsSessionStorageService.get<PrefixResponse[]>('phoneCodeList');

        if (phoneCodeList === null) {
            return this.MmBRxProxy.get <any> (endpoint, config)
            .pipe(this.IbCHttpErrorHandlerService.handleErrorOperator(), map((resp) => {
                this.CommonsSessionStorageService.set('phoneCodeList', resp.data);
                return resp.data as MmBHttpResponse<PrefixResponse[]>;
            }));
        } else {
            return of(phoneCodeList as unknown as MmBHttpResponse<PrefixResponse[]>);
        };
    };

    getPhoneCodesListPromised (): Promise<MmBHttpResponse<PrefixResponse[]>> {
        return lastValueFrom(this.getPhoneCodesList());
    }
};

downgradeToAJSService('IbMmBGetPhoneCodeService', IbMmBGetPhoneCodeService, 'ib-MmB-services-module');
