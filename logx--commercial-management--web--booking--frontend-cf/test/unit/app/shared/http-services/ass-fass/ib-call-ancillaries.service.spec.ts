import { NEVER, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { CallAncillariesService } from '@src/app/shared/http-services/ass-fass/ib-call-ancillaries.service';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { TranslateService } from '@ngx-translate/core';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { catchError, of } from 'rxjs';


const insuranceMock = {
    data:{insurance: [{type: 'INSURANCE'}] }
};
class BookingRxProxyMock {
    public static response = insuranceMock;
    public static throwedError;
    public get = () => BookingRxProxyMock.throwedError? throwError(()=> BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
};

class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
};
class TranslateServiceMock {
    public instant = jasmine.createSpy( 'instant' ).and.callFake( () => '' );
    get = jasmine.createSpy('get');
}

describe('CallAncillariesService', () => {
    let service: CallAncillariesService;
    let fakeBookingRxProxyMock;
    let fakeCommonsSessionStorageService: StorageServiceMock;
    let fakeTranslateService: TranslateServiceMock;
    let fakeFlowId = 'flow123';
    let fakeLocator = 'ABC123';
    let fakeEndpoint = '/ass-fass/rs/fass/v5/';
    let mockError = {
        errorCode: 'IB_00002',
        message: '',
        internalErrorCode: 'IB_00002'
    }
    let constantsMock = { DEFAULT_ENDPOINTS: { ancillariesURI: fakeEndpoint } };

    beforeEach(() => {
        fakeBookingRxProxyMock = new BookingRxProxyMock();
        fakeTranslateService = new TranslateServiceMock();
        fakeCommonsSessionStorageService = new StorageServiceMock();
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                {provide: BookingRxProxy, useValue: fakeBookingRxProxyMock},
                {provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock},
                {provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
                {provide: TranslateService, useValue: fakeTranslateService },
                {provide: HttpServicesConstants, useValue: constantsMock }
            ]
        });
        service = TestBed.inject( CallAncillariesService );
        fakeCommonsSessionStorageService.clear();
    })

    describe( 'when getAncillaries is called', () => {
        it('should return ancillaries list and set PNR', (done) => {
            const bookingInfo = {
                order: {
                    bookingReferences: [{ reference: fakeLocator }]
                }
            };
            fakeCommonsSessionStorageService.set('bookingInfo', bookingInfo);
            fakeCommonsSessionStorageService.set('flowId', fakeFlowId);

            service.getAncillaries()
                .then(() => {
                    const bookingInfoMock = fakeCommonsSessionStorageService.get('bookingInfo');
                    const locatorMock = (bookingInfoMock as any).order.bookingReferences[0].reference;
                    expect(fakeCommonsSessionStorageService.get('PNR')).toEqual(locatorMock);
                    done();
                })

        });

        it('should return ancillaries response data', (done) => {
            fakeBookingRxProxyMock.get = jasmine.createSpy('get').and.returnValue(of({data: 'response'}));
            fakeCommonsSessionStorageService.set('flowId', fakeFlowId);

            service.getAncillaries().then((data) => {
                expect(data).toEqual('response');
                done();
            },done.fail);
        });

        it('should throw error when flowId is null', (done) => {
            fakeCommonsSessionStorageService.set('flowId', null);

            service.getAncillaries().then(() => { done.fail(); })
                .catch(error => {
                    expect(error).toEqual(mockError);
                    done();
                });
        } );
        
        it( 'It should go throw timeout error', ( done ) => {
            fakeCommonsSessionStorageService.set( 'flowId', 'BBKI' );
            fakeCommonsSessionStorageService.set( 'ancillariesServiceTimeoutValue', 15 );
            fakeBookingRxProxyMock.get = jasmine.createSpy( 'get' ).and.returnValue( NEVER );
            const result = service.getAncillaries();
            result.then( () => { done.fail() }, ( error ) => {
                expect( error.name ).toEqual( 'TimeoutError' );
                done();
            } );
        } );
    });

    describe('getInsurance', () => {
        it('When getInsurance is called', (done) => {
            const countryMock = 'ES';
            fakeCommonsSessionStorageService.set('flowId', fakeFlowId);
            service.getInsurance(countryMock).then((result) => {
            expect(result).toEqual(insuranceMock.data);
            done();
            },done.fail);
        });
    });

    describe('getUpgradingBidAncillarie',() => {
        it('When getUpgradingBidAncillarie is called', (done) => {
            fakeBookingRxProxyMock.get = jasmine.createSpy('get').and.returnValue(of({data:'response'}))
            service.getUpgradingBidAncillarie().then((result) => {
                expect(result).toEqual('response');
                done();
            },done.fail);
        })
    });

});
