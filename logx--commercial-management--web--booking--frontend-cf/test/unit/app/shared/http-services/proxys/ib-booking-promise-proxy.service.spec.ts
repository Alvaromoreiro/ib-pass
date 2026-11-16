import { TestBed } from "@angular/core/testing";
import { BookingPromiseProxy } from "@shared/http-services/proxy/ib-booking-promise-proxy.service";
import { BookingRxProxy } from "@shared/http-services/proxy/ib-booking-rx-proxy.service";
import { IbBookingErrorHandlerService } from "@src/app/shared/http-services/error/ib-booking-error-handler.service";
import { Observable, Subscriber } from "rxjs";

class BookingRxProxyMock {
    private subscribeExample(subscriber: Subscriber<any>) {
        subscriber.next({ code: 200, data: { message: 'success' } });
        subscriber.complete();
    }
    
    public get = jasmine.createSpy('get').and.callFake(
        () => new Observable(this.subscribeExample)
    );
    public post = jasmine.createSpy('post').and.callFake(
        () => new Observable(this.subscribeExample)
    );
    public put = jasmine.createSpy('put').and.callFake(
        () => new Observable(this.subscribeExample)
    );
    public delete = jasmine.createSpy('delete').and.callFake(
        () => new Observable(this.subscribeExample)
    );
    public patch = jasmine.createSpy('patch').and.callFake(
        () => new Observable(this.subscribeExample)
    );
}

class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.returnValue((source: Observable<any>) => source);
}

describe('Test BookingPromiseProxy', () => { 
    let rxProxyMock = new BookingRxProxyMock();
    let errorHandlerMock = new IbBookingErrorHandlerServiceMock();
    let service: BookingPromiseProxy;
    
    beforeEach(() => { 
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                { provide: BookingRxProxy, useValue: rxProxyMock },
                { provide: IbBookingErrorHandlerService, useValue: errorHandlerMock }
            ]
        });
        service = TestBed.inject( BookingPromiseProxy );
    })

    it('Call get method and return Promise', async () => {
        const result = await service.get('/test-url');
        
        expect(rxProxyMock.get).toHaveBeenCalledWith('/test-url', undefined);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call get method with config and return Promise', async () => {
        const config = { headers: { 'Authorization': 'Bearer token' } };
        const result = await service.get('/test-url', config);
        
        expect(rxProxyMock.get).toHaveBeenCalledWith('/test-url', config);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call post method and return Promise', async () => {
        const postData = { name: 'test' };
        const result = await service.post('/test-url', postData);
        
        expect(rxProxyMock.post).toHaveBeenCalledWith('/test-url', postData, undefined);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call post method with config and return Promise', async () => {
        const postData = { name: 'test' };
        const config = { headers: { 'Content-Type': 'application/json' } };
        const result = await service.post('/test-url', postData, config);
        
        expect(rxProxyMock.post).toHaveBeenCalledWith('/test-url', postData, config);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call put method and return Promise', async () => {
        const putData = { id: 1, name: 'updated' };
        const result = await service.put('/test-url', putData);
        
        expect(rxProxyMock.put).toHaveBeenCalledWith('/test-url', putData, undefined);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call put method with config and return Promise', async () => {
        const putData = { id: 1, name: 'updated' };
        const config = { headers: { 'If-Match': 'etag-value' } };
        const result = await service.put('/test-url', putData, config);
        
        expect(rxProxyMock.put).toHaveBeenCalledWith('/test-url', putData, config);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call delete method and return Promise', async () => {
        const result = await service.delete('/test-url');
        
        expect(rxProxyMock.delete).toHaveBeenCalledWith('/test-url', undefined);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call delete method with config and return Promise', async () => {
        const config = { headers: { 'X-Custom': 'value' } };
        const result = await service.delete('/test-url', config);
        
        expect(rxProxyMock.delete).toHaveBeenCalledWith('/test-url', config);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call patch method and return Promise', async () => {
        const patchData = { status: 'active' };
        const result = await service.patch('/test-url', patchData);
        
        expect(rxProxyMock.patch).toHaveBeenCalledWith('/test-url', patchData, undefined);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Call patch method with config and return Promise', async () => {
        const patchData = { status: 'active' };
        const config = { headers: { 'X-Requested-With': 'XMLHttpRequest' } };
        const result = await service.patch('/test-url', patchData, config);
        
        expect(rxProxyMock.patch).toHaveBeenCalledWith('/test-url', patchData, config);
        expect(result).toEqual({ code: 200, data: { message: 'success' } });
    });

    it('Should handle typed responses', async () => {
        interface TestResponse {
            id: number;
            name: string;
        }
        
        const result = await service.get<TestResponse>('/test-url');
        
        expect(result.code).toBe(200);
        expect(result.data).toBeDefined();
    });

    it('Should apply error handling operator', async () => {
        await service.get('/test-url');
        
        expect(errorHandlerMock.handleErrorOperator).toHaveBeenCalled();
    });
})
