import { TestBed } from "@angular/core/testing";
import { BookingAppConstants } from "@src/app/core/constants/ib-booking-constants";
import { ShuttleFareService } from "@shared/http-services/sse-avm/ib-shuttle-fare.service";
import { IbBookingErrorHandlerService } from "@shared/http-services/error/ib-booking-error-handler.service";
import { BookingRxProxy } from "@shared/http-services/proxy/ib-booking-rx-proxy.service";
import { AJSRootScope, CommonsSessionStorageService } from "ib-web-commons/utils";
import { catchError, of, throwError } from "rxjs";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
describe('ShuttleFareService Test', () => {

    const fakeData = {
        data: {
            responseId: 'asdasd',
            offers: [
                {
                    accrualQuote: '',
                    id: 1
                }
            ]
        }
    }
    let service: ShuttleFareService;

    class BookingRxProxyMock {
        public static response;
        public static throwError
        public post = () => of( BookingRxProxyMock.response);
    };

    class IbBookingErrorHandlerServiceMock {
        public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
            catchError((error: unknown) => {
                return throwError(() => error);
            })
        ));
    }
    const storage = new StorageServiceMock();
    const fakeRootscope = {
        timeSession: {
            startTime: -1,
        }
    }

    beforeEach(function () {
        storage.clear();
        TestBed.configureTestingModule({
                declarations: [],
                imports: [ ],
                schemas: [],
                providers: [
                    { provide: BookingRxProxy, useClass: BookingRxProxyMock },
                    { provide: CommonsSessionStorageService, useValue: storage },
                    { provide: AJSRootScope, useValue: fakeRootscope },
                    { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock}
            ],
        });
        service =  TestBed.inject( ShuttleFareService );

    });



    describe('when getShuttleFare is called', function () {
        it(' resolve and return fare', function (done) {
            storage.set('userLogged', BookingAppConstants.LOGIN_ONB);
            BookingRxProxyMock.response = fakeData;
            service.getShuttleFare({}).then(function (responseData) {
                expect(responseData.data.responseId).toEqual('asdasd');
                done();
            }, () => { done.fail(); });
        });
    });
});
