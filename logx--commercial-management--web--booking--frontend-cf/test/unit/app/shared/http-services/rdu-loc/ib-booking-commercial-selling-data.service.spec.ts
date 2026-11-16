import { TestBed } from "@angular/core/testing";
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { catchError, of, throwError  } from "rxjs";
import { BookingCommercialSellingDataService } from "@src/app/shared/http-services/rdu-loc/ib-booking-commercial-selling-data.service";
import { RootScopeMock } from "test/mocks/class/RootScopeMock";
import { BookingCommercialSellingDataUtilsService } from "@src/app/shared/services/ib-booking-availability/ib-booking-commercial-selling-data-utils.service";
import { CurrencyServiceMock } from "test/mocks/Services/CurrencyServiceMocks";

class BookingRxProxyMock {
    public static response;
    public static throwedError;
    public get = () => BookingRxProxyMock.throwedError? throwError(()=> BookingRxProxyMock.throwedError) : of(BookingRxProxyMock.response);
}
class IbBookingErrorHandlerServiceMock {
    public handleErrorOperator = jasmine.createSpy('handleErrorOperator').and.callFake(()=> (source) => source.pipe(
        catchError((error: unknown) => {
            return throwError(() => error);
        })
    ));
}

const mockResponse = {
    data: 'response'
};

const mockMembershipData = {
    generalInfo :{
        aviosTransformed: '',
        avios: 1
    }
}
const mockCustomerData = {
    generalInfo :{
        aviosTransformed: '',
        avios: 10
    }
}

const mockError = {
    errorCode: 404,
    data: {
        errors: [{ reason: 'error' }]
    }
}

const fakeBookingCommercialSellingDataUtilsService = {
    getCommercialsellingDataByMarket:jasmine.createSpy('getCommercialsellingDataByMarket').and.returnValue({currency:{groupingSeparator:','}})
}

describe('BookingCommercialSellingDataService', () => {
    let service:BookingCommercialSellingDataService;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();
    let fakeRootScope: RootScopeMock;
    let fakeAJSCurrencyService: CurrencyServiceMock;

    beforeEach(() => {
        BookingRxProxyMock.response = mockResponse;
        BookingRxProxyMock.throwedError = null;
        fakeRootScope = new RootScopeMock();
        fakeAJSCurrencyService = new CurrencyServiceMock();
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                {provide: BookingRxProxy, useClass: BookingRxProxyMock},
                {provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock},
                {provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
                {provide: BookingCommercialSellingDataUtilsService, useValue: fakeBookingCommercialSellingDataUtilsService},
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: AJSCurrencyService, useValue: fakeAJSCurrencyService },
            ]
        });
        service = TestBed.inject(BookingCommercialSellingDataService);
    })

    it('should be crated', () => {
        expect(service).toBeTruthy();
    });
    describe('when getCommercialInfo is called', () => {

        beforeEach(()=>{
            fakeCommonsSessionStorageService.set('customerData',mockCustomerData)
            fakeCommonsSessionStorageService.set('membershipData',mockMembershipData)
            fakeCommonsSessionStorageService.remove('isLogged')
        })

        it('should return commercialData if user is ONB', (done) => {
            fakeCommonsSessionStorageService.set('isLogged','ONB')
            service.getCommercialInfo().then((data)=>{
                expect(data).toEqual('response');
                expect(fakeCommonsSessionStorageService.get('commercialData')).toEqual({currency:{groupingSeparator:','}})
                expect(fakeCommonsSessionStorageService.get('membershipData')).toEqual({
                    generalInfo :{
                        aviosTransformed: '1 Avios',
                        avios: 1
                    }
                })
                done();
            },()=>{})
        });

        it('should return commercialData if user is iberia plus', (done) => {
            service.getCommercialInfo().then((data)=>{
                expect(data).toEqual('response');
                expect(fakeCommonsSessionStorageService.get('customerData')).toEqual({
                    generalInfo :{
                        aviosTransformed: '10 Avios',
                        avios: 10
                    }
                })
                expect(fakeRootScope.$emit).toHaveBeenCalled()
                done();
            },()=>{})
        })
        it('and service return 404',(done)=>{
            BookingRxProxyMock.throwedError = mockError;
            service.getCommercialInfo().then(() => {}, (responseError)=> {
                expect(responseError).toEqual({
                    errorCode: 404, data: {
                        errors: [{ reason: 'error' }]
                    }
                });
                done();
            });
        })
    });
});
