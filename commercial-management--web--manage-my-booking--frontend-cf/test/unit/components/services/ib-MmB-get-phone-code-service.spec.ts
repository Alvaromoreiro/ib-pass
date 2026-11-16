import { TestBed, fakeAsync } from "@angular/core/testing";
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { IbMmBGetPhoneCodeService } from "@src/components/services/ib-MmB-get-phone-code-service";
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";
import { IbCHttpErrorHandlerService } from "ib-web-commons/http-services";
import { MmBRxProxy } from "@src/components/services/proxy/ib-MmB-rx-proxy.service";
import { Observable, Subscriber } from "rxjs";

let data = [{
    code: 'a',
    countryCode: 'b',
    description: 'c'
}];
let mockResponse = {
    data: [{
        code: '',
        countryCode: '',
        description: ''
    }]
};
let mockError = {}
class IbCHttpErrorHandlerServiceMock {
    handleErrorOperator = () => (source) => source;
};

class MmBRxProxyMock {
    public responseExample = { code: 200, data: mockResponse.data}
    public get = jasmine.createSpy('get').and.callFake(() => new Observable((subscriber: Subscriber<any>) => {
            subscriber.next(this.responseExample);
            subscriber.complete();
        })
    )
};

describe('Test IbMmBGetPhoneCodeService', () => {
    let service: IbMmBGetPhoneCodeService;
    let fakeMmBRxProxy: MmBRxProxyMock = new MmBRxProxyMock();
    let fakeIbCHttpErrorHandlerService: IbCHttpErrorHandlerServiceMock = new IbCHttpErrorHandlerServiceMock();
    let fakeCommonsSessionStorageService: any = new StorageServiceMock();
    let fakeMmBAppConstants = {'DEFAULT_ENDPOINTS': {phoneCodesURI: 'test'}};
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbMmBGetPhoneCodeService,
                { provide: MmBRxProxy, useValue: fakeMmBRxProxy },
                { provide: IbCHttpErrorHandlerService, useValue: fakeIbCHttpErrorHandlerService },
                { provide: MmBAppConstants, useValue: fakeMmBAppConstants },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService }
            ]
        });
        service = TestBed.inject(IbMmBGetPhoneCodeService);

    });

    describe('when getPhoneCodesList Proxy resolves the promise', () => {
        let sameCase = (setPhoneCodeList, equalResponse, done) => {  
            fakeCommonsSessionStorageService.set('phoneCodeList', setPhoneCodeList);
            service.getPhoneCodesListPromised().then((responseData) => {
                expect(responseData).toEqual(equalResponse);
                done();
            }).catch(() => {
                done.fail();
            });
            fakeCommonsSessionStorageService.clearAll();
        };
        it('PhoneCodeList are not in localstorage', (done) => {
            sameCase(null, mockResponse.data, done);
        });
        it('phoneCodeList are in localstorage', (done) => {
            sameCase(data, data, done);
        });
    });
    describe('when getPhoneCodesList Proxy rejects the promise', () => {
        beforeEach(inject(() => {
            fakeCommonsSessionStorageService.set('phoneCodeList', null);
        }));
        it('with error code 408, should be returned error data', () => {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            service.getPhoneCodesListPromised().then(() => {}, (responseError) => {
                expect(responseError.errorCode).toEqual(408);
            });
        });

        it('with error code 401, should be returned error data', () => {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            service.getPhoneCodesListPromised().then(() => {}, (responseError) => {
                expect(responseError.errorCode).toEqual(401);
            });
        });

        it('with non error code 401 or 408, should be returned procesed error data', () => {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            service.getPhoneCodesListPromised().then(() => {}, (responseError) => {
                expect(responseError.errorCode).toEqual(400);
            });
        });
    });

});
