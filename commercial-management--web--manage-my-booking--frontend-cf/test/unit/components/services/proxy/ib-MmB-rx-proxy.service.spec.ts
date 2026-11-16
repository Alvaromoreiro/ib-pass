import { TestBed } from "@angular/core/testing";
import { MmBRxProxy } from '@src/components/services/proxy/ib-MmB-rx-proxy.service';
import { IbCBaseRestService } from "ib-web-commons/proxies";
import { lastValueFrom } from "rxjs";
import { IbCBaseRestServiceMock } from "test/mocks/services/IbCBaseRestServiceMock";

describe('Test BookingRxProxy', () => {
    let baseServiceMock = new IbCBaseRestServiceMock();
    let service: MmBRxProxy;
    beforeEach(() => {
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                {provide: IbCBaseRestService, useValue: baseServiceMock}
            ]
        });
        service = TestBed.inject( MmBRxProxy );
    })

    it('Call get method', (done) => {
        lastValueFrom(service.get('')).then((msg) => {
            expect(baseServiceMock.get).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done()
        }, done.fail);
    })
    it('Call put method', (done) => {
        lastValueFrom(service.put('')).then((msg) => {
            expect(baseServiceMock.put).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done()
        }, done.fail);
    })
    it('Call post method', (done) => {
        lastValueFrom(service.post('')).then((msg) => {
            expect(baseServiceMock.post).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done()
        }, done.fail);
    })
    it('Call delete method', (done) => {
        lastValueFrom(service.delete('')).then((msg) => {
            expect(baseServiceMock.delete).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done()
        }, done.fail);
    })
    it('Call patch method', (done) => {
        lastValueFrom(service.patch('')).then((msg) => {
            expect(baseServiceMock.patch).toHaveBeenCalled();
            expect(msg).toEqual({ code: 200, data: {} });
            done()
        }, done.fail);
    })

})
