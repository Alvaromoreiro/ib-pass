import { TestBed } from '@angular/core/testing';
import { VoluntaryRefundLogService } from '@src/components/services/ib-voluntary-refund-log.service';
import { MmBRxProxy } from '@src/components/services/proxy/ib-MmB-rx-proxy.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { of, throwError } from 'rxjs';

describe('VoluntaryRefundLogService Test', () => {
    const flowId = 'testFlowId';
    const endpoint = `testServices/sse-orm/rs/v2/order/voluntaryRefundLog/${flowId}`;
    const mockResponse = { code: 200, data: 'test' };
    const mockError = { errorCode: 500 };

    let service: VoluntaryRefundLogService;
    let originalVoluntaryRefundLogURI: string;
    let fakeMmBRxProxy: jasmine.SpyObj<MmBRxProxy>;
    let fakeIbCHttpErrorHandlerService: any;

    beforeEach(() => {
        originalVoluntaryRefundLogURI = MmBAppConstants.voluntaryRefundLogURI;
        MmBAppConstants.voluntaryRefundLogURI = 'testServices/sse-orm/rs/v2/order/voluntaryRefundLog/{flowId}';
        fakeMmBRxProxy = jasmine.createSpyObj('MmBRxProxy', ['get']);
        fakeIbCHttpErrorHandlerService = {
            handleErrorOperator: jasmine.createSpy('handleErrorOperator').and.callFake(() => (source) => source)
        };

        TestBed.configureTestingModule({
            providers: [
                VoluntaryRefundLogService,
                { provide: MmBRxProxy, useValue: fakeMmBRxProxy },
                { provide: IbCHttpErrorHandlerService, useValue: fakeIbCHttpErrorHandlerService }
            ]
        });
        service = TestBed.inject(VoluntaryRefundLogService);
    });

    afterEach(() => {
        MmBAppConstants.voluntaryRefundLogURI = originalVoluntaryRefundLogURI;
    });

    describe('when getVoluntaryRefundLog() is called and resolve', () => {
        beforeEach(() => {
            fakeMmBRxProxy.get.and.returnValue(of(mockResponse));
        });

        it('should call voluntary refund log endpoint with flowId', (done) => {
            service.getVoluntaryRefundLog(flowId).then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
                expect(fakeMmBRxProxy.get).toHaveBeenCalledWith(endpoint);
                expect(fakeIbCHttpErrorHandlerService.handleErrorOperator).toHaveBeenCalled();
                done();
            }).catch(done.fail);
        });
    });

    describe('when getVoluntaryRefundLog() is called and reject', () => {
        beforeEach(() => {
            fakeMmBRxProxy.get.and.returnValue(throwError(() => mockError));
        });

        it('should return proxy error', (done) => {
            service.getVoluntaryRefundLog(flowId).then(done.fail, (responseData) => {
                expect(responseData).toEqual(mockError);
                expect(fakeIbCHttpErrorHandlerService.handleErrorOperator).toHaveBeenCalled();
                done();
            });
        });
    });
});
