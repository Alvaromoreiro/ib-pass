import { Observable } from 'rxjs';

export class IbCBaseRestService {
    public post<T>(_endpoint: string, _request: unknown): Observable<T> {
        throw new Error('IbCBaseRestService mock must be configured by the test');
    }
}
