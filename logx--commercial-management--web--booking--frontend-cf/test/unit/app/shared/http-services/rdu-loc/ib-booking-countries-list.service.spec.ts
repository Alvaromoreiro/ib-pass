import { TestBed } from "@angular/core/testing";
import { CountriesListService } from "@src/app/shared/http-services/rdu-loc/ib-booking-countries-list.service";
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { catchError, of, throwError  } from "rxjs";

const fakeCountries = {
    data: [
       { code: 'ES', description: 'Spain'},
       { code: 'FR', name: 'France' }
    ]
}

class BookingRxProxyMock {
    public static response = fakeCountries;
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
describe('CountriesListService', () => {
    let service:CountriesListService;
    let fakeBookingRxProxyMock;
    let fakeCommonsSessionStorageService: StorageServiceMock = new StorageServiceMock();

    beforeEach(() => {
        fakeBookingRxProxyMock = new BookingRxProxyMock();
        TestBed.configureTestingModule( {
            imports: [  ],
            providers: [
                {provide: BookingRxProxy, useValue: fakeBookingRxProxyMock},
                {provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock},
                {provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService},
            ]
        });
        service = TestBed.inject(CountriesListService);
    })

    it('should be crated', () => {
        expect(service).toBeTruthy();
    });
    describe('when getCountriesList is called', () => {

        beforeEach(()=>{
            fakeCommonsSessionStorageService.remove('countriesList')
        })

        it('should return countries list', (done) => {
            service.getCountriesList().then((data)=>{
                expect(data).toEqual(fakeCountries.data);
                done();
            },()=>{})
        });

        it('should return countries list from localStorage when available', () => {
            fakeCommonsSessionStorageService.set('countriesList', fakeCountries.data);
            let returnValue = service.getCountriesList()
            expect(returnValue).toEqual(fakeCountries.data as any);
        })
    });
});
