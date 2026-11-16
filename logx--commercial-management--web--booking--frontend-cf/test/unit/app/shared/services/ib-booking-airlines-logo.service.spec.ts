import { TestBed } from "@angular/core/testing";
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { of, throwError  } from "rxjs";
import { IbBookingAirlinesLogoService } from "@src/app/shared/services/ib-booking-airlines-logo.service";


class BookingRxProxyMock {
    public static response = {data:'response'};
    public static throwedError;
    public get = () => BookingRxProxyMock.throwedError? throwError(()=> BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
}
describe('IbBookingAirlinesLogoService', () => {
    let service:IbBookingAirlinesLogoService;
    let fakeBookingRxProxyMock;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();

    beforeEach(() => {
        fakeBookingRxProxyMock = new BookingRxProxyMock();
        BookingRxProxyMock.throwedError = null;
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                {provide: BookingRxProxy, useValue: fakeBookingRxProxyMock},
                {provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
            ]
        });
        service = TestBed.inject(IbBookingAirlinesLogoService);
    })

    it('should be crated', () => {
        expect(service).toBeTruthy();
    });
    describe('when getAirlinesLogos is called', () => {

        beforeEach(()=>{
            fakeCommonsSessionStorageService.remove('airlinesLogoList')
        })

        it('should return airlines list', (done) => {
            service.getAirlinesLogos().then((data)=>{
                expect(data).toEqual('response');
                done();
            },()=>{})
        });
        it('should return error if service rejects', (done) => {
            BookingRxProxyMock.throwedError = 'error';
            service.getAirlinesLogos().then(()=>{},(error)=>{
                expect(error).toEqual({
                    errorCode: '',
                    message: 'REST_SERVICE_ERROR_GENERAL',
                    needsTranslate: true,
                    internalErrorCode: ''
                });
                done();
            })
        });

        it('should return airlines logo list from localStorage when its available', (done) => {
            fakeCommonsSessionStorageService.set('airlinesLogoList', BookingRxProxyMock.response);
            service.getAirlinesLogos().then((returnValue) => {
                expect(returnValue).toEqual(BookingRxProxyMock.response as any);
                done();
            })
        })
    });
});
