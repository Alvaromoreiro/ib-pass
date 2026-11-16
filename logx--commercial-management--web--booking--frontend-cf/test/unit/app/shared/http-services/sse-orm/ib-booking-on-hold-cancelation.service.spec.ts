import { TestBed } from "@angular/core/testing";
import { IbBookingErrorHandlerService } from "@shared/http-services/error/ib-booking-error-handler.service";
import { BookingRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service";
import { CancelOnHoldOrderService } from "@src/app/shared/http-services/sse-orm/ib-booking-on-hold-cancelation.service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { catchError, of, throwError } from "rxjs";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";

 class FakeBookingRxProxy {
    public static response = {};
    public static thrownError;
    public delete = () => FakeBookingRxProxy.thrownError? throwError(()=> FakeBookingRxProxy.thrownError) : of(FakeBookingRxProxy.response);
};


class FakeIbBookingErrorHandlerService {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

describe('IbOnHoldCancelationService Test', () => {
    let service: CancelOnHoldOrderService;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
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
                    {provide: IbBookingErrorHandlerService, useClass: FakeIbBookingErrorHandlerService},
                    {provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},

            ],
        });
        fakeCommonsSessionStorageService.set('flowId', 'TWFuYWdlTXlCb29raW5nQElCZDRiMGMyMTYxMWEzNGQ2MThjMzgwODRmYzAxZmNiODU=')
        service =  TestBed.inject( CancelOnHoldOrderService );
    });

    it( 'should be created', () => {
        expect( service ).toBeTruthy();
    } );

    describe('when cancelOnHoldOrder is called', () => {
        beforeEach(() => {
            FakeBookingRxProxy.thrownError = null;
        })

        it('and service returns 200', (done) => {
            service.cancelOnHoldOrder()
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
            service.cancelOnHoldOrder().then(() => {}, (responseError)=> {
                expect(responseError).toEqual({ errorCode: 404, data: {
                    errors: [{ reason: 'error' }]
                } });
                done();
        });
        })
    });
});
