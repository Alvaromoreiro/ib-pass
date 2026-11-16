import { TestBed } from '@angular/core/testing';
import { VoluntaryRefundsTabService } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/services/ib-MmB-voluntary-refunds-tab.service';
import { Observable, Subscriber, catchError, lastValueFrom, throwError } from "rxjs";


class MmBRxProxyMock {
    public responseExample = { code: 200, data: 'data'}
    public post = jasmine.createSpy('post').and.callFake(() => new Observable((subscriber: Subscriber<any>) => {
            subscriber.next(this.responseExample);
            subscriber.complete();
        })
    )
}
class IbCHttpErrorHandlerServiceMock {
    handleErrorOperator() {
        return (source: Observable<any>) => source.pipe(catchError((error) => { return throwError(error); }))
    }
}
describe('Component: VoluntaryRefundsTabService', () => {
    let service: any;
    let fakeMmBRxProxy: any
    let fakeIbCHttpErrorHandlerService: any

    beforeEach(() => {
        fakeMmBRxProxy = new MmBRxProxyMock();
        fakeIbCHttpErrorHandlerService = new IbCHttpErrorHandlerServiceMock();
        TestBed.configureTestingModule({
            declarations: [VoluntaryRefundsTabService],
            providers: []
        });
        service = new VoluntaryRefundsTabService(fakeMmBRxProxy, fakeIbCHttpErrorHandlerService);
    });

    describe('test voluntaryRefundsItinRefund call', () => {
        beforeEach(() => {
            fakeMmBRxProxy.post = jasmine.createSpy('post').and.callFake(
                () => new Observable((subscriber: Subscriber<any>) => {
                    subscriber.next(fakeMmBRxProxy.responseExample);
                    subscriber.complete();
                }));
        });
        it('when is redemption', (done) => {
            lastValueFrom(service.voluntaryRefundsItinRefund({})).then(
                (data) => {
                    expect(data).toBe(fakeMmBRxProxy.responseExample);
                    done();
                }, done.fail)
        });
    });

    describe('Test voluntaryRefundsItinRefundPromised', () => {
        it('Test call promise', (done) => {
            service.voluntaryRefundsItinRefundPromised({})
                .then((data) => { done() }
                    , done.fail)
        })
     });
});

