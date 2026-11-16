import { TestBed } from "@angular/core/testing";
import { IbMmbVoluntaryRefundsConfirmationService } from "@src/components/ib-MmB-voluntary-refunds/services/ib-mmb-voluntary-refunds-confirmation.service";
import { MmBRxProxy } from "@src/components/services/proxy/ib-MmB-rx-proxy.service";
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { Observable, Subscriber, catchError, throwError, lastValueFrom } from 'rxjs';

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

describe('Test IbMmbVoluntaryRefundsConfirmationService', () => {
    let service: any;
    let fakeMmBRxProxy: MmBRxProxyMock;
    let fakeIbCHttpErrorHandlerService: IbCHttpErrorHandlerServiceMock;

    beforeEach(() => {
        fakeMmBRxProxy = new MmBRxProxyMock();
        fakeIbCHttpErrorHandlerService = new IbCHttpErrorHandlerServiceMock();
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: MmBRxProxy, useValue: fakeMmBRxProxy },
                { provide: IbCHttpErrorHandlerService, useValue: fakeIbCHttpErrorHandlerService }
            ]
        });
        service = TestBed.inject(IbMmbVoluntaryRefundsConfirmationService);
    });

    describe('Test service exists', () => {
        it('Should be defined', (done)=> {
            expect(service).toBeDefined();
            done();
        });
    });

    describe('Test voluntaryRefundsItinRefundConfirmation call', () => {
        beforeEach(() => {
            fakeMmBRxProxy.post = jasmine.createSpy('post').and.callFake(
                () => new Observable((subscriber: Subscriber<any>) => {
                    subscriber.next(fakeMmBRxProxy.responseExample);
                    subscriber.complete();
                }));
        });
        it('Should be return defined data', (done)=> {
            lastValueFrom(service.voluntaryRefundsItinRefundConfirmation('PARTIAL')).then(
                (data) => {
                    expect(data).toBe(fakeMmBRxProxy.responseExample);
                    done();
                }, done.fail
            );
        });
    });

    describe('Test voluntaryRefundsItinRefundConfirmationPromised', () => {
        beforeEach(() => {
            fakeMmBRxProxy.post = jasmine.createSpy('post').and.callFake(
                () => new Observable((subscriber: Subscriber<any>) => {
                    subscriber.next(fakeMmBRxProxy.responseExample);
                    subscriber.complete();
                }));
        });
        it('Test call promise', (done) => {
            service.voluntaryRefundsItinRefundConfirmationPromised({})
                .then((data) => {
                    expect(data).toBe(fakeMmBRxProxy.responseExample);
                    done()
                }, done.fail)
        })
    });
});
