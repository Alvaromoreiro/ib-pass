import { Injectable } from '@angular/core';
import { ChekinHttpResponse } from '@src/app/core/models/generic-models/generic-models';
import { BaseServiceConfigJson, IbCBaseSFService } from 'ib-web-commons/proxies';
import { Observable, map } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CheckinSalesforceRxProxy {
    constructor (private baseProxy: IbCBaseSFService) {}

    get<T = unknown>(url: string, config?: BaseServiceConfigJson): Observable<ChekinHttpResponse<T>> {
        return this.baseProxy.get<T>(url, config).pipe(map((resp) => ({ code: resp.status, data: resp.body })));
    }
    post<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Observable<ChekinHttpResponse<T>> {
        return this.baseProxy.post<T>(url, data, config).pipe(map((resp) => ({ code: resp.status, data: resp.body })));
    }
    put<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Observable<ChekinHttpResponse<T>> {
        return this.baseProxy.put<T>(url, data, config).pipe(map((resp) => ({ code: resp.status, data: resp.body })));
    }
    delete<T = unknown>(url: string, config?: BaseServiceConfigJson): Observable<ChekinHttpResponse<T>> {
        return this.baseProxy.delete<T>(url, config).pipe(map((resp) => ({ code: resp.status, data: resp.body })));
    }
    patch<T = unknown>(url: string, data?: unknown, config?: BaseServiceConfigJson): Observable<ChekinHttpResponse<T>> {
        return this.baseProxy.patch<T>(url, data, config).pipe(map((resp) => ({ code: resp.status, data: resp.body })));
    }
}
