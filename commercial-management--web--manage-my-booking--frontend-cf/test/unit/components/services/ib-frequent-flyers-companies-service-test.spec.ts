import { TestBed } from "@angular/core/testing";
import { FrequentFlyersCompaniesService } from "@src/components/services/ib-frequent-flyers-companies-service";
import { MmBRxProxy } from "@src/components/services/proxy/ib-MmB-rx-proxy.service";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { Observable, Subscriber } from "rxjs";

let mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };

let data = [
    {iataCompanyCode: "IB", airlineName: "Iberia"},
    {iataCompanyCode: "AT", airlineName: "Royal Air Maroc"}
];
class IbCHttpErrorHandlerServiceMock {
    handleErrorOperator = () => (source) => source;
};

class MmBRxProxyMock {
    public responseExample = {code: 200, data: data };
    public get = jasmine.createSpy('get').and.callFake(() => new Observable((subscriber: Subscriber<any>) => {
            subscriber.next(this.responseExample);
            subscriber.complete();
        })
    )
};
describe('FrequentFlyersCompaniesService Test', () => {
    let service: FrequentFlyersCompaniesService;
    let fakeMmBRxProxy: MmBRxProxyMock = new MmBRxProxyMock();
    let fakeIbCHttpErrorHandlerService: IbCHttpErrorHandlerServiceMock = new IbCHttpErrorHandlerServiceMock();
    let fakeCommonsSessionStorageService: any = new StorageServiceMock();
    let fakeMmBAppConstants = {companiesServiceURI: 'test'};
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FrequentFlyersCompaniesService,
                { provide: MmBRxProxy, useValue: fakeMmBRxProxy },
                { provide: IbCHttpErrorHandlerService, useValue: fakeIbCHttpErrorHandlerService },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: MmBAppConstants, useValue: fakeMmBAppConstants }
            ]
        });
        service = TestBed.inject(FrequentFlyersCompaniesService);

    });

    describe('When getFrequentFlyersCompanies() is called and have data in localstorage', () => {
        const sameCase = (dataMock, done) => {
            fakeCommonsSessionStorageService.set('frequentFlyersCompanies', dataMock);
            service.getFrequentFlyersCompaniesPromised().then((responseData) => {
            expect((responseData as any)).toEqual(data);
                done();
            }).catch(() => {
                done.fail();
            });
            fakeCommonsSessionStorageService.clearAll();
        };
        it('then the promise must be resolved with the data of localstorage', (done) => {
            sameCase(data, done);
        });
        it('and FrequentFlyersCompaniesProxy resolves the promise, then the service must return proxy´s data', (done) => {
            sameCase(null, done);
        });
    });

    describe('andFrequentFlyersCompaniesProxy rejects the promise', () => {
        const sameCaseError = (error, done) => {
            inject(() => {
                fakeCommonsSessionStorageService.set('frequentFlyersCompanies', null);
            });
            mockError = { 'errorCode': error, 'data': { 'errors': [{ 'reason': 'error' }] } };
            service.getFrequentFlyersCompaniesPromised().then(()=>{}, (responseError) => {
                expect(responseError.errorCode).toEqual(error);
                fakeCommonsSessionStorageService.clearAll();
            });
            done();
        };
        it('with 401 errorCode, should return an object', (done) => {
            sameCaseError(401, done);
        });

        it('with 408 errorCode, should return an object', (done) => {
            sameCaseError(408, done);
        });

        it('with 402 errorCode, should return an object', (done) => {
            sameCaseError(402, done);
        });

        it('with 500 errorCode, should return an object', (done) => {
            sameCaseError(500, done);
        });
    });
});
