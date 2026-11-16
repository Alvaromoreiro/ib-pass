import { TestBed } from '@angular/core/testing';
import { IbMmbRetrieveOrderService } from '@src/components/services/ib-MmB-retrieve-order.service';
import { MmBRxProxy } from '@src/components/services/proxy/ib-MmB-rx-proxy.service';
import { IbMmbErrorHandlerService } from '@src/components/services/error/ib-Mmb-error-handler.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { of, throwError } from 'rxjs';

describe('IbMmbRetrieveOrderService', () => {
  let service: IbMmbRetrieveOrderService;
  let rxProxy: jasmine.SpyObj<MmBRxProxy>;
  let errorHandler: jasmine.SpyObj<IbMmbErrorHandlerService>;
  let sessionStorage: jasmine.SpyObj<CommonsSessionStorageService>;

  const expectPromiseResolveWithData = async (
    promise: Promise<any>,
    expected: any
  ) => {
    const result = await promise;
    expect(result).toEqual(expected);
  };

  const expectPromiseRejectAndStoreFlowId = async (
    promise: Promise<any>,
    expectedFlowId: string
  ) => {
    try {
      await promise;
      fail('Promise should have been rejected');
    } catch {
      expect(sessionStorage.set).toHaveBeenCalledWith('flowId', expectedFlowId);
    }
  };

  beforeEach(() => {
    rxProxy = jasmine.createSpyObj('MmBRxProxy', ['post', 'get']);
    errorHandler = jasmine.createSpyObj('IbMmbErrorHandlerService', ['handleErrorOperator']);
    sessionStorage = jasmine.createSpyObj('CommonsSessionStorageService', ['set']);

    errorHandler.handleErrorOperator.and.callFake(() => (source$) => source$);

    TestBed.configureTestingModule({
      providers: [
        IbMmbRetrieveOrderService,
        { provide: MmBRxProxy, useValue: rxProxy },
        { provide: IbMmbErrorHandlerService, useValue: errorHandler },
        { provide: CommonsSessionStorageService, useValue: sessionStorage }
      ]
    });

    service = TestBed.inject(IbMmbRetrieveOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('retrieveOrderPost', () => {
    it('should call post with correct params and return response', (done) => {
      const response = { data: { foo: 'bar' } };
      rxProxy.post.and.returnValue(of(response as any));

      service.retrieveOrderPost('DOE', 'ABC123').subscribe((resp) => {
        expect(rxProxy.post).toHaveBeenCalledWith(
          MmBAppConstants.retrieveOrderPostURI,
          { locator: 'ABC123', surname: 'DOE' },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        expect(resp).toEqual(response as any);
        done();
      });
    });
  });

  describe('retrieveOrderCachedLotus', () => {
    it('should call get and return response', (done) => {
      const response = { data: { ok: true } };
      rxProxy.get.and.returnValue(of(response as any));

      service.retrieveOrderCachedLotus('FLOW1', '1234', 'SESSION1').subscribe((resp) => {
        expect(rxProxy.get).toHaveBeenCalled();
        expect(resp).toEqual(response as any);
        done();
      });
    });
  });

  describe('retrieveOrderPostPromised', () => {
    it('should resolve with response data', async () => {
      const response = { data: { order: 'OK' } };
      rxProxy.post.and.returnValue(of(response as any));

      await expectPromiseResolveWithData(
        service.retrieveOrderPostPromised('DOE', 'ABC123'),
        response.data
      );
    });

    it('should store flowId in sessionStorage on error', async () => {
      const error = { data: { flowId: 'FLOW123' } };
      rxProxy.post.and.returnValue(throwError(() => error));

      await expectPromiseRejectAndStoreFlowId(
        service.retrieveOrderPostPromised('DOE', 'ABC123'),
        'FLOW123'
      );
    });
  });

  describe('retrieveOrderCachedLotusPromised', () => {
    it('should resolve with response data', async () => {
      const response = { data: { order: 'OK' } };
      rxProxy.get.and.returnValue(of(response as any));

      await expectPromiseResolveWithData(
        service.retrieveOrderCachedLotusPromised('FLOW1', '1234', 'SESSION1'),
        response.data
      );
    });

    it('should store flowId in sessionStorage on error', async () => {
      const error = { data: { flowId: 'FLOW999' } };
      rxProxy.get.and.returnValue(throwError(() => error));

      await expectPromiseRejectAndStoreFlowId(
        service.retrieveOrderCachedLotusPromised('FLOW1', '1234', 'SESSION1'),
        'FLOW999'
      );
    });
  });
});
