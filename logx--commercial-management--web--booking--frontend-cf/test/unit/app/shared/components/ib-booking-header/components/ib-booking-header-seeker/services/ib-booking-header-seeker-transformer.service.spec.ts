import { TestBed } from '@angular/core/testing';
import { IbBookingHeaderSeekerTransformerService } from '@shared/components/ib-booking-header/components/ib-booking-header-seeker/services/ib-booking-header-seeker-transformer.service';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import URLParamsExamples from '../../../../../../../../mocks/Responses/BookingURLParams-mock.json';
import AdvancedSearchModelExample from './mocks/AdvancedSearchData-mock.json';
import { advancedSearchMock as AdvancedSearchHMADModelExample } from './mocks/AdvancedSearch-Hmad-mock';
import { SeekerAdvancedSearchModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';
import dayjs from 'dayjs';
const AdvancedSearchModelMock = AdvancedSearchModelExample as unknown as SeekerAdvancedSearchModel;
const AdvancedSearchHMADModelMock = AdvancedSearchHMADModelExample as unknown as SeekerAdvancedSearchModel;
const AvailabilityURLParams = URLParamsExamples.AvailabilityReturn;

class RootScopeMock {
    appMarket = 'ES';
    appLang = 'es';
}

class WindowMock {
    location = {
        origin: 'https://www.iberia.com',
        href: 'https://www.iberia.com',
        pathname: '/',
        search: '?'
    };
}

class AvailabilityRequestMock {
    slices = []
    passengers = []
    preferedCabin = ''
}

// @ts-ignore
interface TestService extends IbBookingHeaderSeekerTransformerService {
    CommonsSessionStorageService: StorageServiceMock;
    window: WindowMock;
    rootScope: RootScopeMock;

}

describe('IbBookingHeaderSeekerTransformerService', () => {

    let service: TestService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBookingHeaderSeekerTransformerService,
                { provide: CommonsSessionStorageService, useClass: StorageServiceMock },
                { provide: AJSRootScope, useClass: RootScopeMock },
                { provide: WINDOW_TOKEN, useClass: WindowMock },
            ]
        });

        service = TestBed.inject(IbBookingHeaderSeekerTransformerService) as unknown as TestService;
    });
    describe('Test initializeCabinsModel', ()=> {
        it('should return cabinModel with other type', ()=> {
            const testValue: any = ['test']
            expect(service.initializeCabinsModel(testValue)).toEqual(testValue)
        });
    });
    describe('Test initializeAreasModel', () => {
        it('should initialize areas model with correct origin and destiny', () => {
            const areas = [
                {
                    description: 'Group 1',
                    cities: [
                        { code: 'MAD', description: 'Madrid', country: { code: 'ES', description: 'Spain' } },
                        { code: 'BCN', description: 'Barcelona', country: { code: 'ES', description: 'Spain' } }
                    ]
                },
                {
                    description: 'Group 2',
                    cities: [
                        { code: 'LON', description: 'London', country: { code: 'UK', description: 'United Kingdom' } }
                    ]
                }
            ];
            const originCode = 'MAD';
            const destinyCode = 'LON';

            const result = service.initializeAreasModel(areas, originCode, destinyCode);

            expect(result.cities.listGroups).toEqual(['Group 1', 'Group 2']);
            expect(result.cities.listCities.length).toBe(3);
            expect(result.origin).toEqual({
                code: 'MAD',
                description: 'Madrid',
                country: 'ES',
                countryLong: 'Spain',
                group: 'Group 1',
                selected: false
            });
            expect(result.destiny).toEqual({
                code: 'LON',
                description: 'London',
                country: 'UK',
                countryLong: 'United Kingdom',
                group: 'Group 2',
                selected: false
            });
        });

        it('should return null for origin and destiny if codes do not match', () => {
            const areas = [
                {
                    description: 'Group 1',
                    cities: [
                        { code: 'BCN', description: 'Barcelona', country: { code: 'ES', description: 'Spain' } }
                    ]
                }
            ];
            const originCode = 'MAD';
            const destinyCode = 'LON';

            const result = service.initializeAreasModel(areas, originCode, destinyCode);

            expect(result.origin).toBeNull();
            expect(result.destiny).toBeNull();
        });

        it('should handle empty areas array', () => {
            const areas: any[] = [];
            const originCode = 'MAD';
            const destinyCode = 'LON';

            const result = service.initializeAreasModel(areas, originCode, destinyCode);

            expect(result.cities.listGroups).toEqual([]);
            expect(result.cities.listCities).toEqual([]);
            expect(result.origin).toBeNull();
            expect(result.destiny).toBeNull();
        });
    });

    describe('Test createNewAdvancedSearch', ()=> {
        beforeEach(()=> {
            const {CommonsSessionStorageService} = service;
            CommonsSessionStorageService.clear();
            CommonsSessionStorageService.set('bookingUrlParams', AvailabilityURLParams);
            CommonsSessionStorageService.set('availabilityRequestData', new AvailabilityRequestMock());
        })
        it('obtention flow - return - should return new search URL', ()=> {
            const dateReturn = dayjs( AdvancedSearchModelMock.selectedReturnDate );
            const dateOutbound = dayjs( AdvancedSearchModelMock.selectedOutbondDate );
            const newURL = service.createNewAdvancedSearch(AdvancedSearchModelMock);
            expect(newURL).toEqual(`https://www.iberia.com/?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES&quadrigam=IBHMPA&TRIP_TYPE=2&flexible=true&FARE_TYPE=R&BEGIN_CITY_01=MAD&END_CITY_01=BCN&BEGIN_DAY_01=${dateOutbound.format('DD')}&BEGIN_MONTH_01=${dateOutbound.format('YYYYMM')}&BEGIN_YEAR_01=${dateOutbound.format('YYYY')}&BEGIN_CITY_02=MAD&END_CITY_02=BCN&END_DAY_01=${dateReturn.format('DD')}&END_MONTH_01=${dateReturn.format('YYYYMM')}&END_YEAR_01=${dateReturn.format('YYYY')}&YCD=0&ADT=1&YTH=0&BNN=0&CHD=1&INF=1`); 
        })
        it('redention flow air shuttle - should return correct new search URL when remaining in air shuttle redemption flow', ()=> {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.clear();
            CommonsSessionStorageService.set('isRedemptionShuttleFlow', 'true');
            CommonsSessionStorageService.set('bookingUrlParams', {
                ...AvailabilityURLParams,
                payWithAvios: true 
            });
            CommonsSessionStorageService.set('availabilityRequestData', new AvailabilityRequestMock());
            CommonsSessionStorageService.set('isRedemptionShuttleFlow', true);
            const RedemptionShuttleMock: SeekerAdvancedSearchModel = {
                ...AdvancedSearchModelMock,
                payWithAvios: true,
                cityOrigin: {
                    ...AdvancedSearchModelMock.cityOrigin,
                    code: 'MAD'
                },
                cityDestiny: {
                    ...AdvancedSearchModelMock.cityDestiny,
                    code: 'BCN'
                }
            };

            const newURL = service.createNewAdvancedSearch(RedemptionShuttleMock);

            expect(newURL).toContain('&quadrigam=PAHMPA'); 
            expect(newURL).not.toContain('&quadrigam=IBHMPA');
        })
    })

    describe('Test createNewAdvancedSearchHMad', ()=> {
        it('should return new search URL', ()=> {
            const {CommonsSessionStorageService} = service;
            const destinationAreasCitiesList = [
                {
                    region: 'Europe',
                    cities: [
                        
                        { code: 'MAD', name: 'Madrid' },
                 
                    ]
                }
            ];
            CommonsSessionStorageService.set('destinationAreasCitiesList', destinationAreasCitiesList);
            const result = service.createNewAdvancedSearchHMad(AdvancedSearchHMADModelMock);
            expect(result).toEqual({
                "url": "https://www.iberia.com/?bookingMarket=ES&TRIP_TYPE=3&text-from1-visible=Santiago de Chile%20(SCL)&BEGIN_CITY_01=SCL&text-to1-visible=undefined%20(MAD)&END_CITY_01=MAD&text-date-from1=15/04/2025&BEGIN_DAY_01=15&BEGIN_MONTH_01=202504&BEGIN_YEAR1_01=2025&BEGIN_HOUR_01=0000&text-from2-visible=undefined%20(MAD)&BEGIN_CITY_02=MAD&text-to2-visible=París Charles de Gaulle%20(CDG)&END_CITY_02=CDG&text-date-from2=18/04/2025&BEGIN_DAY_02=18&BEGIN_MONTH_02=202504&BEGIN_YEAR2_01=2025&BEGIN_HOUR_02=0000&text-from3-visible=París Charles de Gaulle%20(CDG)&BEGIN_CITY_03=CDG&text-to3-visible=Santiago de Chile%20(SCL)&END_CITY_03=SCL&text-date-from3=29/05/2025&BEGIN_DAY_03=29&BEGIN_MONTH_03=202505&BEGIN_YEAR3_01=2025&BEGIN_HOUR_03=0000&numTrayectos=3&FARE_TYPE=R&ADT=1&CHD=1&INF=1&quadrigam=HMADVS&backtourl=/es/es/stopover-in-madrid/#!/availability",
                "cookie": "SCL|CDG|true|true|3|15/04/2025|29/05/2025|3|1|1|1|es|"
            });
        });
    })





});
