import { TestBed } from "@angular/core/testing";
import { BkiStorageConstants } from "@src/app/core/constants/ib-booking-storage-constants";
import { IbBookingErrorHandlerService } from "@src/app/shared/http-services/error";
import { BookingRxProxy } from "@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service";
import { BookingGetDestinationCitiesListService } from "@src/app/shared/http-services/rdu-loc/ib-booking-get-destination-cities.service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { catchError, of, throwError } from "rxjs";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";

class BookingRxProxyMock {
    returnData = {data: ['City1', 'City2']};
    get = ()=> of(this.returnData);
}

class IbBookingErrorHandlerServiceMock {
    errorCached = jasmine.createSpy('errorCached');
    public handleErrorOperator = ()=>  (source) => source.pipe(
        catchError((error: Error) => {
            this.errorCached(error);
            return throwError(() => error);
        })
    );
}
// @ts-ignore
interface TestService extends BookingGetDestinationCitiesListService {
    BookingRxProxy: BookingRxProxyMock;
    IbBookingErrorHandlerService: IbBookingErrorHandlerServiceMock;
    CommonsSessionStorageService: StorageServiceMock;
}


describe('Test BookingGetDestinationCitiesListService', () => {
    let service: TestService;
    beforeEach(()=> {
        TestBed.configureTestingModule({
            providers: [
                BookingGetDestinationCitiesListService,
                { provide: BookingRxProxy, useClass: BookingRxProxyMock },
                { provide: IbBookingErrorHandlerService, useClass: IbBookingErrorHandlerServiceMock },
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
            ],
        });
        service = TestBed.inject(BookingGetDestinationCitiesListService) as unknown as TestService;
    });

    it('should return stored cities', async()=> {
        const mockCities = ['city1', 'city2'];
        let {CommonsSessionStorageService} = service;
        CommonsSessionStorageService.set(BkiStorageConstants.DESTINATION_CITIES_LIST, mockCities);
        const response  = await service.getDestinationCitiesList();
        expect(response).toEqual(mockCities);
    })
    it('should call the service and store cities', async () => {;
        const result = await service.getDestinationCitiesList();
        expect(result).toEqual(service.BookingRxProxy.returnData.data);
        expect(service.CommonsSessionStorageService.get(BkiStorageConstants.DESTINATION_CITIES_LIST)).toEqual(service.BookingRxProxy.returnData.data);
    });
    it('should handle error', async () => {
        const error = new Error('Error occurred');
        const {BookingRxProxy, IbBookingErrorHandlerService} = service; 
        try {
        BookingRxProxy.get = () => throwError(() => error);
        await service.getDestinationCitiesList();
        }
        catch (e) {
            expect(IbBookingErrorHandlerService.errorCached).toHaveBeenCalled();
        }
        
    });

});