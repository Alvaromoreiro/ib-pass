import { TestBed } from "@angular/core/testing";
import { CallBookingMetaSearchService } from "@shared/http-services/sse-avm/ib-call-booking-metasearch.service";
import { IbBookingErrorHandlerService } from "@shared/http-services/error/ib-booking-error-handler.service";
import { BookingRxProxy } from "@shared/http-services/proxy/ib-booking-rx-proxy.service";
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
describe('CallBookingMetaSearchService Test', function () {
    const storage = new StorageServiceMock();
    let service: CallBookingMetaSearchService;
    var fakeData = { data: 'Ok' }
    var mockError = {
        'errorCode': 400,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    };
    

     beforeEach(function () {
        storage.clear();
        BookingRxProxyMock.throwedError = null;
         BookingRxProxyMock.response = fakeData;
        TestBed.configureTestingModule({
                declarations: [],
                imports: [ ],
                schemas: [],
                providers: [
                    { provide: BookingRxProxy, useClass: BookingRxProxyMock },
                    { provide: CommonsSessionStorageService, useValue: storage },
                    { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock}     
            ],
        });
        service =  TestBed.inject( CallBookingMetaSearchService );
   
    });

    describe('when getBookingMetaSearch is called', function () {
        beforeEach(() => {
            BookingRxProxyMock.throwedError = null;
        })
        it('reject and should return an object with processed error structure', function (done) {
            BookingRxProxyMock.throwedError = mockError;
            service.getBookingMetaSearch({}).then(() => { done.fail(); }, function () {
                done();
            });
           
        });
        it(' resolve and return the rest service destination areas list data', function (done) {
            service.getBookingMetaSearch({}).then(function (responseData) {
                expect(responseData.data).toEqual('Ok');
                done();
            }, ()=>{});
        });
    });
});