import { TestBed } from "@angular/core/testing";
import { CallPriceMatrixService } from "@shared/http-services/sse-avm/ib-call-booking-price-matrix-service.service";
import { IbBookingErrorHandlerService } from "@shared/http-services/error";
import { BookingRxProxy } from "@shared/http-services/proxy/ib-booking-rx-proxy.service";
import { AJSRootScope, CommonsSessionStorageService } from "ib-web-commons/utils";
import { Observable, Subscriber, catchError, lastValueFrom, throwError } from "rxjs";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { RibbonRequest } from "@src/app/core/models/ib-booking-availability/ribbon-models";
import { BookingHttpErrorModel, BookingHttpResponse } from "@src/app/core/models/generic-models/generic-models";


const REQUEST_DATA = {
    slices: [{}, {}]
}

class BookingRxProxyMock {
    public responseExample = { code: 200, data: 'data'}
    public post = jasmine.createSpy('post').and.callFake(() => new Observable((subscriber: Subscriber<any>) => {
            subscriber.next(this.responseExample);
            subscriber.complete();
        })
    )
}
class IbBookingErrorHandlerServiceMock {
    handleErrorOperator() {
        return (source: Observable<any>) => source.pipe(catchError((error) => { return throwError(error); }))
    }
}

class TestBench {
    public rootscope: CommonsRootScope;
    public service: CallPriceMatrixService;
    public BookingRxProxyService: BookingRxProxyMock;
    public IbBookingErrorHandlerService: IbBookingErrorHandlerServiceMock;
    public SessionStorage: StorageServiceMock;
    
    constructor() {
        this.BookingRxProxyService = new BookingRxProxyMock();
        this.IbBookingErrorHandlerService = new IbBookingErrorHandlerServiceMock();
        this.SessionStorage = new StorageServiceMock();
        this.rootscope =  {
            isRedemptionFlow: false,
            timeSession: {}
        } as CommonsRootScope;
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: BookingRxProxy, useValue: this.BookingRxProxyService },
                { provide: IbBookingErrorHandlerService, useValue: this.IbBookingErrorHandlerService },
                { provide: CommonsSessionStorageService, useValue: this.SessionStorage },
                { provide: AJSRootScope, useValue: this.rootscope }
            ]
        });
        this.service = TestBed.inject(CallPriceMatrixService);
    }
    public getPriceMatrixRxSpec = (request, callbackResolve, callbackReject) => {
        lastValueFrom(this.service.getPriceMatrixRx(request, false)).then(
            (data: BookingHttpResponse<AvailabilityTransformerModel.CalendarInfo | BookingHttpErrorModel>) => {
                expect(data as any).toBe(this.BookingRxProxyService.responseExample);
                callbackResolve();
            }, callbackReject)
    }

    public getPriceMatrixPromisedSpec = (request, callbackResolve, callbackReject) => {
        this.service.getPriceMatrixPromised(request as RibbonRequest, false)
            .then((data: BookingHttpResponse<AvailabilityTransformerModel.CalendarInfo | BookingHttpErrorModel>) => {
                expect(data as any).toBe(this.BookingRxProxyService.responseExample);
                callbackResolve();
            }, callbackReject)
    }
}

describe('Test CallPriceMatrix', () => {
    describe('test getPriceMatrixRx call', () => {
        it('when is redemption', (done) => {
            const testBench = new TestBench();
            testBench.rootscope.isRedemptionFlow = true;
            testBench.getPriceMatrixRxSpec(REQUEST_DATA, done, done.fail);
            
        });
        it('when is openJaw & multicity', (done) => {
            const testBench = new TestBench();
            testBench.SessionStorage.set('openJaw', true);
            testBench.SessionStorage.set('multiCitySearch', true)
            testBench.getPriceMatrixRxSpec(REQUEST_DATA, done, done.fail);
            
        });
        it('when is requestData has 1 slice and force ribbon', (done) => {
            const testBench = new TestBench();
            testBench.getPriceMatrixRxSpec({ slices: [{}] }, done, done.fail);
            
        });
        it('when is requestData has 2 slices', (done) => {
            const testBench = new TestBench();
            testBench.getPriceMatrixRxSpec(REQUEST_DATA, done, done.fail);
           
        });

    });
    describe('Test getPriceMatrixPromised', () => {
        it('Test call promise', (done) => {
            const testBench = new TestBench();
            testBench.getPriceMatrixPromisedSpec(REQUEST_DATA, done, done.fail);
        })
     });


});
