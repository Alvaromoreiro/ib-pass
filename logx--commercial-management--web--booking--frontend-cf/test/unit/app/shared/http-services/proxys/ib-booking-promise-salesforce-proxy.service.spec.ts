import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { BookingPromiseSalesforceProxy } from '@shared/http-services/proxy/ib-booking-promise-salesforce-proxy.service';
import { BookingSalesforceRxProxy } from '@shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';

describe('BookingPromiseSalesforceProxy', () => {
  let service: BookingPromiseSalesforceProxy;
  let rxProxyMock: any;
  let errorHandlerMock: any;

  beforeEach(() => {
    rxProxyMock = {
      post: jasmine.createSpy('post').and.returnValue(of({ data: 'ok' })),
      get: jasmine.createSpy('get').and.returnValue(of({ data: 'ok' })),
      put: jasmine.createSpy('put').and.returnValue(of({ data: 'ok' })),
      delete: jasmine.createSpy('delete').and.returnValue(of({ data: 'ok' })),
      patch: jasmine.createSpy('patch').and.returnValue(of({ data: 'ok' }))
    };

    errorHandlerMock = {
      handleErrorOperator: jasmine.createSpy('handleErrorOperator').and.returnValue((source: any) => source)
    };

    TestBed.configureTestingModule({
      providers: [
        BookingPromiseSalesforceProxy,
        { provide: BookingSalesforceRxProxy, useValue: rxProxyMock },
        { provide: IbBookingErrorHandlerService, useValue: errorHandlerMock }
      ]
    });

    service = TestBed.inject(BookingPromiseSalesforceProxy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call post and return response', async () => {
    const url = '/api/email/verify-consent';
    const data = { email: 'test@test.com' };

    const result = await service.post(url, data);

    expect(rxProxyMock.post).toHaveBeenCalledWith(url, data, undefined);
    expect(errorHandlerMock.handleErrorOperator).toHaveBeenCalled();
    expect(result as any ).toEqual({ data: 'ok' });
  });

  it('should call get and return response', async () => {
    const url = '/api/email/verify-consent';

    const result = await service.get(url);

    expect(rxProxyMock.get).toHaveBeenCalledWith(url, undefined);
    expect(errorHandlerMock.handleErrorOperator).toHaveBeenCalled();
  });

  it('should call put and return response', async () => {
    const url = '/api/email/verify-consent';
    const data = { email: 'test@test.com' };

    const result = await service.put(url, data);

    expect(rxProxyMock.put).toHaveBeenCalledWith(url, data, undefined);
    expect(errorHandlerMock.handleErrorOperator).toHaveBeenCalled();
  });

  it('should call delete and return response', async () => {
    const url = '/api/email/verify-consent';

    const result = await service.delete(url);

    expect(rxProxyMock.delete).toHaveBeenCalledWith(url, undefined);
    expect(errorHandlerMock.handleErrorOperator).toHaveBeenCalled();
  });

  it('should call patch and return response', async () => {
    const url = '/api/email/verify-consent';
    const data = { email: 'test@test.com' };

    const result = await service.patch(url, data);

    expect(rxProxyMock.patch).toHaveBeenCalledWith(url, data, undefined);
    expect(errorHandlerMock.handleErrorOperator).toHaveBeenCalled();
  });

});