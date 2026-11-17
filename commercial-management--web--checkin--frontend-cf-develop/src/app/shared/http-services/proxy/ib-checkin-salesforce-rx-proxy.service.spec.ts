import { TestBed } from '@angular/core/testing';
import { CheckinSalesforceRxProxy } from './ib-checkin-salesforce-rx-proxy.service';
import { IbCBaseSFService } from 'ib-web-commons/proxies';
import { Observable, Subscriber, lastValueFrom } from 'rxjs';

class IbCBaseRestServiceMock {
    private suscribeExample(subscriber: Subscriber<unknown>) {
        subscriber.next({ status: 200, body: {} });
        subscriber.complete();
    }
    public get = jasmine.createSpy('get').and.callFake(() => new Observable(this.suscribeExample));
    public post = jasmine.createSpy('post').and.callFake(() => new Observable(this.suscribeExample));
    public put = jasmine.createSpy('put').and.callFake(() => new Observable(this.suscribeExample));
    public delete = jasmine.createSpy('delete').and.callFake(() => new Observable(this.suscribeExample));
    public patch = jasmine.createSpy('patch').and.callFake(() => new Observable(this.suscribeExample));
}

describe('Test CheckinSalesforceRxProxy', () => {
    let baseServiceMock = new IbCBaseRestServiceMock();
    let service: CheckinSalesforceRxProxy;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [{ provide: IbCBaseSFService, useValue: baseServiceMock }]
        });
        service = TestBed.inject(CheckinSalesforceRxProxy);
    });

    it('Call get method', (done) => {
        lastValueFrom(service.get('')).then((msg) => {
            expect(baseServiceMock.get).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done();
        }, done.fail);
    });
    it('Call put method', (done) => {
        lastValueFrom(service.put('')).then((msg) => {
            expect(baseServiceMock.put).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done();
        }, done.fail);
    });
    it('Call post method', (done) => {
        lastValueFrom(service.post('')).then((msg) => {
            expect(baseServiceMock.post).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done();
        }, done.fail);
    });
    it('Call delete method', (done) => {
        lastValueFrom(service.delete('')).then((msg) => {
            expect(baseServiceMock.delete).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done();
        }, done.fail);
    });
    it('Call patch method', (done) => {
        lastValueFrom(service.patch('')).then((msg) => {
            expect(baseServiceMock.patch).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done();
        }, done.fail);
    });
});
