import { TestBed } from "@angular/core/testing";
import { CallBookingAvailabilityService } from "@shared/http-services/sse-avm/ib-call-booking-availability.service";
import { IbBookingErrorHandlerService } from "@shared/http-services/error/ib-booking-error-handler.service";
import { BookingSalesforceRxProxy } from "@shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { catchError, of, throwError } from "rxjs";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";

 class BookingRxProxyMock {
    public static response;
    public static throwedError;
    public post = () => BookingRxProxyMock.throwedError? throwError(()=> BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
    public get = () => BookingRxProxyMock.throwedError? throwError(()=> BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
};
class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

describe('CallBookingAvailabilityService Test', function () { 
    let mockRequest = 'promesa';
    let mockError = {
        'errorCode': 400,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    }
    const storage = new StorageServiceMock();
    let service;

    beforeEach(function () {
        storage.clear();
        BookingRxProxyMock.throwedError = null;
         BookingRxProxyMock.response = {};
        TestBed.configureTestingModule({
                declarations: [],
                imports: [ ],
                schemas: [],
                providers: [
                    { provide: BookingSalesforceRxProxy, useClass: BookingRxProxyMock },
                    { provide: CommonsSessionStorageService, useValue: storage },
                    { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock}     
            ],
        });
        service =  TestBed.inject( CallBookingAvailabilityService );
   
    });
    describe('when getBookingAvailability is called', function () {
        beforeEach(function () {
            storage.set('multiCitySearch', true);
        });
        it('and service return 200 and it is multicitySearch', function (done) {
            const result = service.getBookingAvailability(mockRequest)
                .then((data)=> {
                    expect(data).toEqual({});
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });
    })
    describe('when getNextInfoSlice is called', function () {
        beforeEach(() => {
            BookingRxProxyMock.throwedError = null;
        })
        it('and service reject with 500 code', function (done) {
            BookingRxProxyMock.throwedError = mockError;
            service.getNextInfoSlice(mockRequest).then(() => { }, function (responseError) {
                done();
            });
        });
        it('and service return 200', function (done) {
            const result = service.getNextInfoSlice(mockRequest)
                .then((data)=> {
                    expect(data).toEqual({});
                    done();
                })
                .catch(()=> {
                    done.fail();
                });
        });
    });
});
