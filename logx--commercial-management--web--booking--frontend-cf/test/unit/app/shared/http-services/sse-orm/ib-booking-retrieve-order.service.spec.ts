import { TestBed } from '@angular/core/testing';

import { IbBookingRetrieveOrderService } from '@shared/http-services/sse-orm/ib-booking-retrieve-order.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { catchError, of, throwError } from 'rxjs';


class FakeBookingRxProxy {
    public static response = {data:{}};
    public static thrownError;
    public post = () => FakeBookingRxProxy.thrownError? throwError(()=> FakeBookingRxProxy.thrownError) : of(FakeBookingRxProxy.response);
};


class FakeIbBookingErrorHandlerService {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

describe('IbBookingRetrieveOrderService', () => {
  let service: IbBookingRetrieveOrderService;
      let mockError = {
          'errorCode': 404,
          'data': {
              'errors': [{ 'reason': 'error' }]
          }
      }

  beforeEach(() => {
    FakeBookingRxProxy.thrownError = null;
            TestBed.configureTestingModule({
                    providers: [
                        {provide: BookingRxProxy, useClass: FakeBookingRxProxy },
                        {provide: IbBookingErrorHandlerService, useClass: FakeIbBookingErrorHandlerService}
    
                ],
            });
    service = TestBed.inject(IbBookingRetrieveOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('When retrieveOrder is called', () => { 
    it('and service returns 200', (done) => {
            service.retrieveOrder('surname','locator')
                .then((response)=> {
                    expect(response).toEqual({});
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });

        it('and service returns 404',(done)=>{
            FakeBookingRxProxy.thrownError = mockError;
            service.retrieveOrder('surname','locator').then(() => {}, (responseError)=> {
                expect(responseError).toEqual({ errorCode: 404, data: {
                    errors: [{ reason: 'error' }]
                } });
                done();
        });
        })
   })
});
