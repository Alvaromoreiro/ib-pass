import { TestBed } from '@angular/core/testing';
import { IbLastSearchStorageService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-seeker/services/ib-last-search-storage.service';
import { CommonsBrowserStorageService } from 'ib-web-commons/utils';
import { SeekerStorageSearch, SeekerStorageSearchList } from '@src/app/core/models/ib-booking-availability/header-seeker-model';
import { StorageServiceMock } from '../../../../../../../../mocks/Services/StorageServiceMock'
// @ts-ignore
interface TestService extends IbLastSearchStorageService {
    CommonsBrowserStorageService: StorageServiceMock
    MAX_LENGTH: number;
}


describe('IbLastSearchStorageService', () => {
    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbLastSearchStorageService,
                { provide: CommonsBrowserStorageService, useClass: StorageServiceMock },
            ],
        });

        service = TestBed.inject(IbLastSearchStorageService) as unknown as TestService;
      
    });

    it('should return all stored searches', () => {
        const {CommonsBrowserStorageService} = service;
        const mockSearches: SeekerStorageSearchList = [
            { iataOrigen: 'MAD', iataDestino: 'BCN', adultos: 1, niños: 0, expirationTimestamp: Date.now() + 100000 } as SeekerStorageSearch,
        ];
        CommonsBrowserStorageService.set('ib-booking.lastSearchs', mockSearches);

        const result = service.getAllStoredSearchs();
        const resultSingle = service.getStoredSearch(0);
        expect(resultSingle).toEqual(mockSearches[0]);
        expect(result).toEqual(mockSearches);
    });

    it('should return an empty list if no searches are stored', () => {

        const result = service.getAllStoredSearchs();
        expect(result).toEqual([]);
    });


    it('should add a new search to the storage', () => {
        const newSearch: SeekerStorageSearch = { iataOrigen: 'MAD', iataDestino: 'BCN', adultos: 1, niños: 0 } as SeekerStorageSearch;
        const {CommonsBrowserStorageService} = service;
        const result = service.pushSearch(newSearch);
        expect(result.length).toBe(1);
        expect(result[0].iataDestino).toBe('BCN');
        expect(CommonsBrowserStorageService.get('ib-booking.lastSearchs')).toEqual(result);
    });

    it('should limit the number of stored searches to MAX_LENGTH', () => {
        const {CommonsBrowserStorageService, MAX_LENGTH} = service;
        const searches: SeekerStorageSearchList = Array.from({ length: 40 }, (_, i) => {
            const goDate = new Date();
            goDate.setDate(goDate.getDate() + i + 1);
            const returnDate = new Date();
            returnDate.setDate(goDate.getDate() + i + 120);
            return {
                iataOrigen: `ORG${i}`,
                iataDestino: `DEST${i}`,
                adultos: 1,
                niños: 0,
                fechaIda: { 
                    day: `${goDate.getDate()}`, 
                    month: `${goDate.getMonth() + 1}`, 
                    year: `${goDate.getFullYear()}` },
                fechaVuelta: { 
                    day: `${returnDate.getDate()}`, 
                    month: `${returnDate.getMonth() + 1}`, 
                    year: `${returnDate.getFullYear()}` },

            } as SeekerStorageSearch
        }
    );
        
        searches.forEach(search => service.pushSearch(search));
        const stored =  CommonsBrowserStorageService.get<SeekerStorageSearchList>('ib-booking.lastSearchs');
        expect(stored.length).toBe(MAX_LENGTH);
        stored.forEach((search, index) => {
            expect(search.iataOrigen).toBe(searches[searches.length - index - 1].iataOrigen);
            expect(search.iataDestino).toBe(searches[searches.length - index - 1].iataDestino);
        });

    });
    it ('should filter out duplicate searches', () => {
        const goDate = new Date();
        goDate.setDate(goDate.getDate() + 1);
        const returnDate = new Date();
        returnDate.setDate(goDate.getDate() + 120);
        const newSearch: SeekerStorageSearch = { iataOrigen: 'MAD', iataDestino: 'BCN',senior: 0,joven: 0,  adultos: 1, niños: 0, bebes: 0,fechaIda: { 
            day: `${goDate.getDate()}`, 
            month: `${goDate.getMonth() + 1}`, 
            year: `${goDate.getFullYear()}` },
        fechaVuelta: { 
            day: `${returnDate.getDate()}`, 
            month: `${returnDate.getMonth() + 1}`, 
            year: `${returnDate.getFullYear()}` }, } as SeekerStorageSearch;
        const duplicateSearch: SeekerStorageSearch = { iataOrigen: 'MAD', iataDestino: 'BCN',senior: 0,joven: 0, adultos: 1, niños: 0, bebes:0, fechaIda: { 
            day: `${goDate.getDate()}`, 
            month: `${goDate.getMonth() + 1}`, 
            year: `${goDate.getFullYear()}` },
        fechaVuelta: { 
            day: `${returnDate.getDate()}`, 
            month: `${returnDate.getMonth() + 1}`, 
            year: `${returnDate.getFullYear()}` }, } as SeekerStorageSearch;
        service.pushSearch(newSearch);
        const result = service.pushSearch(duplicateSearch);
        expect(result.length).toBe(1);
        expect(result[0].iataDestino).toBe('BCN');

    });

    it ('should pushSearchSO ', () => {
        const newSearch: SeekerStorageSearch = { iataOrigen: 'MAD', iataDestino: 'BCN',senior: 0,joven: 0,  adultos: 1, niños: 0, bebes: 0,fechaIda: { 
            day: '1', 
            month: '2', 
            year: '2023' },
        fechaVuelta: { 
            day: '3', 
            month: '4', 
            year: '2023' }, } as SeekerStorageSearch;
        const lastSearchSO = {
            stopOverIda: true,
            nights: 2,
            locale:'es'
        } as any;
        const result = service.pushSearchSO(newSearch,lastSearchSO);
        expect(result.length).toBe(1);
        expect((result[0] as any).nombreDestino).toBe('BCN');

    });
});

