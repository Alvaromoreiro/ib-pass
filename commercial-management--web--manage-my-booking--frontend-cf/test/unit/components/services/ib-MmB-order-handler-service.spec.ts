import { TestBed } from "@angular/core/testing";
import { of, throwError } from 'rxjs';
import { IbMmbOrderHandlerService } from '@src/components/services/ib-MmB-order-handler.service';
import { MmBRxProxy } from '@src/components/services/proxy/ib-MmB-rx-proxy.service';
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { MmBHttpResponse } from "@src/app/core/models/generic-models";

class MmBRxProxyMock {
    public static response;
    public static throwedError;

    public post(endpoint: string, body: any, config: any) {
        return MmBRxProxyMock.throwedError
            ? throwError(() => MmBRxProxyMock.throwedError)
            : of(MmBRxProxyMock.response);
    }
}

class IbCHttpErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator')
        .and.callFake(() => (source) => source);
}

describe('IbMmbOrderHandlerService', () => {
    let service: IbMmbOrderHandlerService;
    let fakeMmBRxProxy: MmBRxProxyMock;
    let fakeErrorHandler: IbCHttpErrorHandlerServiceMock;

    const mockResponse: MmBHttpResponse<any> = {
        data: {
            orderDetails: {
                orderId: '12345',
                status: 'confirmed'
            }
        },
        code: 200
    };

    const mockError = {
        errorCode: 403,
        body: {
            flowId: 'TWFuYWdlTXlCb29raW5nQElCMGUyZDk3OTY4N2RkNGNhNGJkOTU4ZjM4MmQ3OWM3NTY'
        }
    };

    beforeEach(() => {
        fakeMmBRxProxy = new MmBRxProxyMock();
        fakeErrorHandler = new IbCHttpErrorHandlerServiceMock();

        TestBed.configureTestingModule({
            providers: [
                { provide: MmBRxProxy, useValue: fakeMmBRxProxy },
                { provide: IbCHttpErrorHandlerService, useValue: fakeErrorHandler }
            ]
        });

        service = TestBed.inject(IbMmbOrderHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('retrieveOrderHandlerPromised', () => {
        it('should resolve with order details when service succeeds', (done) => {
            MmBRxProxyMock.throwedError = null;
            MmBRxProxyMock.response = mockResponse;

            service.retrieveOrderHandlerPromised('Doe', 'LOC123')
                .then((responseData) => {
                    expect(responseData).toEqual(mockResponse.data);
                    done();
                })
                .catch(done.fail);
        });

        it('should reject with error when service fails', (done) => {
            MmBRxProxyMock.throwedError = mockError;

            spyOn(console, 'info');

            service.retrieveOrderHandlerPromised('Doe', 'LOC123')
                .then(() => done.fail('Expected method to reject.'))
                .catch((error) => {
                    expect(error.errorCode).toBe(403);
                    expect(console.info).toHaveBeenCalledWith('Error con flowId:', 'TWFuYWdlTXlCb29raW5nQElCMGUyZDk3OTY4N2RkNGNhNGJkOTU4ZjM4MmQ3OWM3NTY');
                    done();
                });
        });
    });
});
