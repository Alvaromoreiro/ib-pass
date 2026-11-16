import { TestBed } from '@angular/core/testing';
import { IbBookingErrorHandlerService } from '@shared/http-services/error/ib-booking-error-handler.service';
import { BookingSalesforceRxProxy } from '@shared/http-services/proxy/ib-booking-salesforce-rx-proxy.service';
import { IbShortRegisterService } from '@src/app/shared/http-services/pzmm-mbm/ib-register.service';
import { catchError, of, throwError } from 'rxjs';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';

class BookingRxProxyMock {
    public static response;
    public static throwedError;
    public post = () => BookingRxProxyMock.throwedError ? throwError(() => BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
    public get = () => BookingRxProxyMock.throwedError ? throwError(() => BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
}

class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(() => (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

describe('IbShortRegisterService Test', () => {
    const mockRequest: any = {
        person: {
            personName: { firstName: 'Juan', familyName: 'Sanchez' },
            countryOfResidence: 'ES',
            prefLanguage: 'es',
            email: 'test@gmail.com',
            enrolmentType: 'NORMAL_ENROL'
        },
        marketingPermissions: true,
        termsAndConditions: { version: '2', acceptedDate: '2026-05-29' },
        securityProfile: { password: 'password' }
    };
    const mockError = {
        'errorCode': 400,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    };
    const storage = new StorageServiceMock();
    let service;

    beforeEach(() => {
        storage.clear();
        BookingRxProxyMock.throwedError = null;
        BookingRxProxyMock.response = {};
        TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            schemas: [],
            providers: [
                { provide: BookingSalesforceRxProxy, useClass: BookingRxProxyMock },
                { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock }
            ],
        });
        service = TestBed.inject(IbShortRegisterService);
    });

    describe('when enrolMember is called', () => {
        beforeEach(() => {
            BookingRxProxyMock.throwedError = null;
        });

        it('and service reject with 400 code', (done) => {
            BookingRxProxyMock.throwedError = mockError;
            service.enrolMember(mockRequest).then(() => { }, (error) => {
                expect(error).toBe(mockError);
                done();
            });
        });

        it('and service return 200', (done) => {
            service.enrolMember(mockRequest)
                .then((data) => {
                    expect(data).toEqual({});
                    done();
                })
                .catch(() => {
                    done.fail();
                });
        });
    });
});