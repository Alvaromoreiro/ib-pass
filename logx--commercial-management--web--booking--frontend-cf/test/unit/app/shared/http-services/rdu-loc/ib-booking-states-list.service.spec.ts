import { TestBed } from "@angular/core/testing";
import { IbBookingErrorHandlerService } from "@src/app/shared/http-services/error";
import { BookingRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service";
import { StatesListService } from "@src/app/shared/http-services/rdu-loc/ib-booking-states-list.service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { catchError, of, throwError } from "rxjs";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";

class BookingRxProxyMock {
    public static response = {data:'response'};
    public static throwedError;
    public get = () => BookingRxProxyMock.throwedError? throwError(()=> BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
}
class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

describe('Test StatesListService', ()=> {
    let service: StatesListService;
    let fakeBookingRxProxyMock;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
    let mockError = {
        'errorCode': 404,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    }
    beforeEach(() => {
        fakeBookingRxProxyMock = new BookingRxProxyMock();
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                {provide: BookingRxProxy, useValue: fakeBookingRxProxyMock},
                {provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock},
                {provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
            ]
        });
        service = TestBed.inject( StatesListService );
    })

    describe('when StatesListService is called', () => {
        beforeEach(() => {
            BookingRxProxyMock.throwedError = null;
            fakeCommonsSessionStorageService.remove('stateList_ES');
        })
        it('and service return 200',(done)=>{
            service.getStatesList('ES').then((data) => {
                expect(data).toEqual('response');
                expect(fakeCommonsSessionStorageService.get('stateList_ES')).toEqual('response');
                done()
            }, done.fail);
        })
        it('and service return 404',(done)=>{
            BookingRxProxyMock.throwedError = mockError;
            service.getStatesList('ES').then(() => {}, (responseError)=> {
                expect(responseError).toEqual({ errorCode: 404, data: {
                    errors: [{ reason: 'error' }]
                } });
                done();
        });
        })
        it('and stateList response is cached', ()=>{
            fakeCommonsSessionStorageService.set('stateList_ES','value');
            let returnValue = service.getStatesList('ES');
            expect(returnValue).toEqual('value' as any)
        })
    })

    })
