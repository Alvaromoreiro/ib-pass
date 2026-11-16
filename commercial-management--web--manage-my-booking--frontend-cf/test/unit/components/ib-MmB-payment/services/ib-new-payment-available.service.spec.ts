import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { MmbNewPaymentAvailableService } from '@src/components/ib-MmB-payment/services/ib-new-payment-available.service';
import { IbCHttpErrorHandlerService } from 'ib-web-commons/http-services';
import { Observable, catchError, throwError } from 'rxjs';
import { MmBRxProxy } from '../../../../../src/components/services/proxy/ib-MmB-rx-proxy.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { PAYMENT_REALMS, PAYMENT_SUB_REALMS } from './../../../../../src/components/ib-MmB-payment/enums/ib-Mmb-payments-enum';
import { StorageServiceMock } from 'test/mocks/services/StorageServiceMock';

class IbCHttpErrorHandlerServiceMock {
    handleErrorOperator() {
        return (source: Observable<any>) => source.pipe(catchError((error) => throwError(error)))
    }
}

let paymentURL = MmBAppConstants.DEFAULT_ENDPOINTS.NEW_PAYMENT_AVAILABLE.replace('{{marketId}}', 'ES');
describe('Test MmbNewPaymentAvailableService', () => {
    const ROOTSCOPE_INITIAL = {
        appMarket: 'ES'
    }
    let rootScope;
    let sessionStorageMock = new StorageServiceMock()
    let service: MmbNewPaymentAvailableService;
    let httpMock: HttpTestingController;
    let fakeErrorHandler: IbCHttpErrorHandlerServiceMock = new IbCHttpErrorHandlerServiceMock();


    beforeEach(() => {
        sessionStorageMock.clear();
        rootScope = structuredClone(ROOTSCOPE_INITIAL);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                MmBRxProxy,
                MmbNewPaymentAvailableService,
                { provide: IbCHttpErrorHandlerService, useValue: fakeErrorHandler },
                { provide: AJSRootScope, useValue: rootScope },
                { provide: CommonsSessionStorageService, useValue: sessionStorageMock }
            ]
        });
        service = TestBed.inject(MmbNewPaymentAvailableService);
        httpMock = TestBed.inject(HttpTestingController);
        sessionStorageMock.set('bookingInfo', {contextMetadata: {country: 'ES'}})
    });

    describe('Test promised function due to is a complete flow', () => {
        it('test MMB changeFlight case', fakeAsync(() => {
            sessionStorageMock.set('flowApp', MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_VOLUNTARY_CHANGE);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PAYMENT_REALMS.MMB)}?subRealm=${PAYMENT_SUB_REALMS.CHANGE_FLIGHT}`;
            service.callPromised()
                .then(
                    (data) => {
                        expect(data.available).toBe(true);
                    },
                    (error) => { })
            const req = httpMock.expectOne(url);
            expect(req.request.method).toEqual('GET');
            req.flush(mockedResp.data, { status: 200, statusText: 'OK' });
            flush();
        }));
        it('test MMB Ancillaries case', fakeAsync(() => {
            sessionStorageMock.set('flowApp', MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PAYMENT_REALMS.MMB)}?subRealm=${PAYMENT_SUB_REALMS.ANCILLARIES}`;
            rootScope.isRedemptionFlow = true;
            service.callPromised()
                .then(
                    (data) => {
                        expect(data.available).toBe(true);
                    },
                    (error) => { })
            const req = httpMock.expectOne(url);
            expect(req.request.method).toEqual('GET');
            req.flush(mockedResp.data, { status: 200, statusText: 'OK' });
            flush();
        }));
        it('test MMB onHold case', fakeAsync(() => {
            sessionStorageMock.set('flowApp', MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_ONHOLD);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PAYMENT_REALMS.MMB)}?subRealm=${PAYMENT_SUB_REALMS.ON_HOLD}`;

            service.callPromised()
                .then(
                    (data) => {
                        expect(data.available).toBe(true);
                    },
                    (error) => { })
            const req = httpMock.expectOne(url);
            expect(req.request.method).toEqual('GET');
            req.flush(mockedResp.data, { status: 200, statusText: 'OK' });
            flush();
        }));

        it('test service fail', fakeAsync(() => {
            sessionStorageMock.set('flowApp', MmBAppConstants.APP_TYPES.MANAGEMYBOOKING_BIDS);
            const mockedResp: any = { code: 500, data: 'error' }
            const url = `${paymentURL.replace('{{realm}}', PAYMENT_REALMS.MMB)}?subRealm=${PAYMENT_SUB_REALMS.DEFAULT}`;
            service.callPromised()
                .then(
                    (data) => {
                    },
                    (error) => {
                        expect(error.error).toBe('error');
                    })
            const req = httpMock.expectOne(url);
            expect(req.request.method).toEqual('GET');
            req.flush(mockedResp.data, { status: 500, statusText: 'Error' });
            flush();
        }));
    });



});
