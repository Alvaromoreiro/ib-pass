import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { BookingNewPaymentAvailableService } from '@src/app/shared/http-services/pmt-ppm/ib-new-payment-available.service';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { Observable, catchError, throwError } from 'rxjs';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { PaymentRealmsEnum, PaymentSubRealmsEnum } from '@src/app/core/enums/ib-booking-paymments/ib-booking-payments-enum';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';

class IbBookingErrorHandlerServiceMock {
    handleErrorOperator() {
        return (source: Observable<any>) => source.pipe(catchError((error) => throwError(error)))
    }
}

class IbBookingUtilsServiceMock {
    public returnValue = null;
    public getURLFirstParameterByName = jasmine.createSpy('getURLFirstParameterByName').and.callFake(() => this.returnValue);
}
let paymentURL = HttpServicesConstants.DEFAULT_ENDPOINTS.NEW_PAYMENT_AVAILABLE.replace('{{marketId}}', 'ES');
describe('Test BookingNewPaymentAvailableService', () => {
    const ROOTSCOPE_INITIAL = {
        appMarket: 'ES'
    }
    let rootScope;
    let sessionStorageMock = new StorageServiceMock()
    let service: BookingNewPaymentAvailableService;
    let httpMock: HttpTestingController;
    let fakeErrorHandler: IbBookingErrorHandlerServiceMock = new IbBookingErrorHandlerServiceMock();
    let fakeBookingUtilsService = new IbBookingUtilsServiceMock();


    beforeEach(() => {
        sessionStorageMock.clear();
        rootScope = structuredClone(ROOTSCOPE_INITIAL);
        fakeBookingUtilsService.returnValue = null;
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                BookingRxProxy,
                BookingNewPaymentAvailableService,
                { provide: IbBookingErrorHandlerService, useValue: fakeErrorHandler },
                { provide: AJSRootScope, useValue: rootScope },
                { provide: CommonsSessionStorageService, useValue: sessionStorageMock },
                { provide: AJSBookingUtilsService, useValue: fakeBookingUtilsService }
            ]
        });
        service = TestBed.inject(BookingNewPaymentAvailableService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    describe('Test promised function due to is a complete flow', () => {
        it('test Booking case', fakeAsync(() => {
            sessionStorageMock.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.DEFAULT}`;
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
        it('test Redemption', fakeAsync(() => {
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.REDEMPTION)}?subRealm=${PaymentSubRealmsEnum.DEFAULT}`;
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
        it('test Booking - shuttle', fakeAsync(() => {
            sessionStorageMock.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.SHUTTLE}`;

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
        it('test Booking - multitrip', fakeAsync(() => {
            sessionStorageMock.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.MULTIPLE_TRIPS}`;

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
        it('test Booking - metasearch', fakeAsync(() => {
            sessionStorageMock.set('searchFlightType', BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.METASEARCH}`;

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
        it('test Booking - stopover', fakeAsync(() => {
            sessionStorageMock.set('isHMAD', true);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.STOP_OVER}`;

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
        it('test Booking - oh', fakeAsync(() => {
            sessionStorageMock.set('isOnHoldOrder', true);
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.ON_HOLD}`;

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
        it('test Booking - onb', fakeAsync(() => {
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.ON_BUSINESS}`;
            rootScope.isPointsOBFlow = true;
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
        it('test Booking - flashOffer', fakeAsync(() => {
            fakeBookingUtilsService.returnValue = true;
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.FLASH_OFFERS}`;
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
        it('test Booking - on hold confirmation', fakeAsync(() => {
            sessionStorageMock.set(BkiStorageConstants.FLOW_APP, 'MMBOH');
            const mockedResp: any = { code: 200, data: { available: true } }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.ON_HOLD_CONFIRMATION}`;

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
            const mockedResp: any = { code: 500, data: 'error' }
            const url = `${paymentURL.replace('{{realm}}', PaymentRealmsEnum.BOOKING)}?subRealm=${PaymentSubRealmsEnum.DEFAULT}`;
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
