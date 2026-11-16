import { TestBed } from '@angular/core/testing';
import { IbBookingCalculatePointsService } from '@src/app/shared/http-services/prlm-pc/ib-booking-calculate-points.service';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { catchError, of, throwError } from 'rxjs';


class BookingRxProxyMock {
    public static response = {data:'response'};
    public static throwedError;
    public post = () => BookingRxProxyMock.throwedError? throwError(()=> BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
}

class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

describe('IbBookingCalculatePointsService', () => {
    let service: IbBookingCalculatePointsService;
    let fakeBookingRxProxyMock;
    let mockError = {
        'errorCode': 404,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    }

    beforeEach(() => {
        fakeBookingRxProxyMock = new BookingRxProxyMock();
        TestBed.configureTestingModule({
        providers: [
            {provide: BookingRxProxy, useValue: fakeBookingRxProxyMock},
            {provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock},

        ]
        });
        service = TestBed.inject(IbBookingCalculatePointsService);
    });

    describe('when getCalculateFlightsAvios is called', () => {
        beforeEach(() => {
        BookingRxProxyMock.throwedError = null;
        });

        it('and service return 200', (done) => {
            service.getCalculateFlightsAvios('test').then((data) => {
                expect(data).toEqual('response');
                done();
            }, done.fail);
        });

        it('and service return 404', (done) => {
            BookingRxProxyMock.throwedError = mockError;
            service.getCalculateFlightsAvios('test').then(() => {}, (responseError) => {
                expect(responseError).toEqual({ errorCode: 404, data: {
                errors: [{ reason: 'error' }]
                }});
                done();
            });
        });
    });

    describe('when getCalculatePoints is called', () => {
        beforeEach(() => {
        BookingRxProxyMock.throwedError = null;
        });

        it('and service return 200', (done) => {
            service.getCalculatePoints('test').then((data) => {
                expect(data).toEqual('response');
                done();
            }, done.fail);
        });

        it('and service return 404', (done) => {
            BookingRxProxyMock.throwedError = mockError;
            service.getCalculatePoints('test').then(() => {}, (responseError) => {
                expect(responseError).toEqual({ errorCode: 404, data: {
                errors: [{ reason: 'error' }]
                }});
                done();
            });
        });
    });

    describe('when getCalculateAviosAncillaries is called', () => {
        beforeEach(() => {
        BookingRxProxyMock.throwedError = null;
        });

        it('and service return 200', (done) => {
            service.getCalculateAviosAncillaries('test').then((data) => {
                expect(data).toEqual('response');
                done();
            }, done.fail);
        });

        it('and service return 404', (done) => {
            BookingRxProxyMock.throwedError = mockError;
            service.getCalculateAviosAncillaries('test').then(() => {}, (responseError) => {
                expect(responseError).toEqual({ errorCode: 404, data: {
                errors: [{ reason: 'error' }]
                }});
                done();
            });
        });
    });

    describe('when getCalculateAviosSummary is called', () => {
        beforeEach(() => {
        BookingRxProxyMock.throwedError = null;
        });

        it('and service return 200', (done) => {
            service.getCalculateAviosSummary('test').then((data) => {
                expect(data).toEqual('response');
                done();
            }, done.fail);
        });

        it('and service return 404', (done) => {
            BookingRxProxyMock.throwedError = mockError;
            service.getCalculateAviosSummary('test').then(() => {}, (responseError) => {
                expect(responseError).toEqual({ errorCode: 404, data: {
                errors: [{ reason: 'error' }]
                }});
                done();
            });
        });
    });

})
