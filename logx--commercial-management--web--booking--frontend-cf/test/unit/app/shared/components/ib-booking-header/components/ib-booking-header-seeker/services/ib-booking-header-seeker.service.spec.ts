import { TestBed } from "@angular/core/testing";
import { IbBookingHeaderSeekerTransformerService } from "@src/app/shared/components/ib-booking-header/components/ib-booking-header-seeker/services/ib-booking-header-seeker-transformer.service";
import { IbBookingHeaderSeekerService } from "@shared/components/ib-booking-header/components/ib-booking-header-seeker/services/ib-booking-header-seeker.service";
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { StorageServiceMock } from "test/mocks/Services/StorageServiceMock";
import { AJSCabinTypesServiceToken } from "@shared/components/ib-booking-header/services/upgraded/ib-cabing-types-bridge.service";
import { AJSGetDestinationsService } from "@src/app/shared/http-services/rdu-loc/ib-booking-areas-cities-list-bridge.service";
import { AJSGetSpecialPassengerOriginDestinationListServiceToken } from "@src/app/shared/components/ib-booking-header/services/upgraded/ib-get-special-passenger-origin-destination-list-bridge.service";
// @ts-ignore
interface TestService extends IbBookingHeaderSeekerService {
    CabinTypesService: CabinTypesServiceMock;
    getDestinationsService: GetDestinationsServiceMock;
    getSpecialPassengerOriginDestinationListService: GetSpecialPassengerOriginDestinationListServiceTokenMock;
    CommonsSessionStorageService: StorageServiceMock;
    IbBookingHeaderSeekerTransformerService: IbBookingHeaderSeekerTransformerServiceMock;
}

class IbBookingHeaderSeekerTransformerServiceMock {
    initializeCabinsModel = jasmine.createSpy('initializeCabinsModel').and.returnValue([]);
    initializeAreasModel = jasmine.createSpy('initializeAreasModel').and.returnValue({});
    createNewAdvancedSearch = jasmine.createSpy('createNewAdvancedSearch').and.returnValue({});
    createNewAdvancedSearchHMad = jasmine.createSpy('createNewAdvancedSearchHMad').and.returnValue({});

}

class CabinTypesServiceMock {
    getCabinTypes = jasmine.createSpy('getCabinTypes').and.returnValue(Promise.resolve([]));
    
}

class GetDestinationsServiceMock {
    getDestinationAreasCitiesList = jasmine.createSpy('getDestinationAreasCitiesList').and.returnValue(Promise.resolve({}));
}
class GetSpecialPassengerOriginDestinationListServiceTokenMock {
    getSpecialPassengerOriginDestinationList = jasmine.createSpy('getSpecialPassengerOriginDestinationList').and.callFake(
        (type) => Promise.resolve({ type })
    );
}


describe('Test IbBookingHeaderSeekerService', ()=> {
    let service: TestService;
    beforeEach(()=> {
        TestBed.configureTestingModule({
            providers: [
                IbBookingHeaderSeekerService,
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: IbBookingHeaderSeekerTransformerService, useClass: IbBookingHeaderSeekerTransformerServiceMock },
                { provide: AJSCabinTypesServiceToken, useClass: CabinTypesServiceMock },
                { provide: AJSGetDestinationsService, useClass: GetDestinationsServiceMock},
                { provide: AJSGetSpecialPassengerOriginDestinationListServiceToken, useClass: GetSpecialPassengerOriginDestinationListServiceTokenMock },
            ],
        });
        service = TestBed.inject(IbBookingHeaderSeekerService) as unknown as TestService;
    })

    describe('Test getCabinTypes', ()=> {
        it('response ok and should call to transformer', async ()=> {
            const {CabinTypesService,  IbBookingHeaderSeekerTransformerService} = service;
            const result = await service.getCabinTypes();
            expect(result).toBeDefined();
            expect(CabinTypesService.getCabinTypes).toHaveBeenCalled();
            expect(IbBookingHeaderSeekerTransformerService.initializeCabinsModel).toHaveBeenCalledWith([]);
        });
    });
    describe('Test getDestinationAreas', ()=> {
        it('response ok and should call to transformer', async ()=> {
            const {getDestinationsService,  IbBookingHeaderSeekerTransformerService} = service;
            const result = await service.getDestinationAreas('originCode', 'destinyCode');
            expect(result).toBeDefined();
            expect(getDestinationsService.getDestinationAreasCitiesList).toHaveBeenCalled();
            expect(IbBookingHeaderSeekerTransformerService.initializeAreasModel).toHaveBeenCalledWith({}, 'originCode', 'destinyCode');
        });
    });
    describe('Test createRequestNewAdvancedSearch', ()=> {
        it('should call to transformer', ()=> {
            const {IbBookingHeaderSeekerTransformerService} = service;
            const result = service.createRequestNewAdvancedSearch({});
            expect(result).toBeDefined();
            expect(IbBookingHeaderSeekerTransformerService.createNewAdvancedSearch).toHaveBeenCalledWith({});
        });
    });
    describe('Test createRequestNewAdvancedSearchHMad', ()=> {
        it('should call to transformer', ()=> {
            const {IbBookingHeaderSeekerTransformerService} = service;
            const result = service.createRequestNewAdvancedSearchHMad({});
            expect(result).toBeDefined();
            expect(IbBookingHeaderSeekerTransformerService.createNewAdvancedSearchHMad).toHaveBeenCalledWith({});
        });
    });
   describe('Test getSpecialPassengerOriginDestination', ()=> {
        it('no stored value and response ok and transform response', async ()=> {
            const {getSpecialPassengerOriginDestinationListService} = service;
            const result = await service.getSpecialPassengerOriginDestination('ES');
            const responseTest = {
                SENIOR: { type: 'SENIOR' }, YOUNG: { type: 'YOUNG' }, TEENAGER: { type: 'TEENAGER' }, specialPassengerMarket: 'ES'};
            expect(result).toBeDefined();
            expect(getSpecialPassengerOriginDestinationListService.getSpecialPassengerOriginDestinationList).toHaveBeenCalledTimes(3);
            expect(result).toEqual(responseTest);
            expect(service.CommonsSessionStorageService.get('specialPassengersByMarketList')).toEqual(responseTest);
        });
        it('no stored value and response ko', async ()=> {
            const {getSpecialPassengerOriginDestinationListService, CommonsSessionStorageService} = service;
            getSpecialPassengerOriginDestinationListService.getSpecialPassengerOriginDestinationList.and.returnValue(Promise.reject('error'));
            try{
               await service.getSpecialPassengerOriginDestination('ES');
            }catch(e){
                expect(e).toEqual('error');
                expect(CommonsSessionStorageService.get('specialPassengersByMarketList')).toBeNull();
            }
        });
        it('return stored value for a market', async ()=> {
            const {getSpecialPassengerOriginDestination, CommonsSessionStorageService} = service;
            const responseTest = {
                SENIOR: { type: 'SENIOR2' }, YOUNG: { type: 'YOUNG' }, TEENAGER: { type: 'TEENAGER' }, specialPassengerMarket: 'ES'};
            CommonsSessionStorageService.set('specialPassengersByMarketList', responseTest);
            const result = await getSpecialPassengerOriginDestination('ES');
            expect(result).toEqual(responseTest);
        });
        it('return stored value for a market but different', async ()=> {
            const {getSpecialPassengerOriginDestination, CommonsSessionStorageService} = service;
            const responseTest = {
                SENIOR: { type: 'SENIOR' }, YOUNG: { type: 'YOUNG' }, TEENAGER: { type: 'TEENAGER' }, specialPassengerMarket: 'FR'};
            const storedTest = {
                SENIOR: { type: 'SENIOR2' }, YOUNG: { type: 'YOUNG' }, TEENAGER: { type: 'TEENAGER' }, specialPassengerMarket: 'ES'};
            CommonsSessionStorageService.set('specialPassengersByMarketList', storedTest);
            const result = await getSpecialPassengerOriginDestination('FR');
            expect(result).toEqual(responseTest);
        });

   });



});