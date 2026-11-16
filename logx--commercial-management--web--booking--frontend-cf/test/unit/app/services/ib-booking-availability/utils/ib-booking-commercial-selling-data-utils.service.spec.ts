import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { commercialDataResponse, commercialStoredData } from "../../../../../mocks/unit/app/services/ib-booking-availability/utils/ib-booking-commercial-selling-data-utils-mocks";
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BookingCommercialSellingDataUtilsService } from '@shared/services/ib-booking-availability/ib-booking-commercial-selling-data-utils.service';
import { TestBed } from '@angular/core/testing';

class RootScopeMock {
    public appMarket = 'ES';
    public $broadcast = jasmine.createSpy( '$broadcast' );
};

describe('BookingCommercialSellingDataUtils Test', function () {
    let service:BookingCommercialSellingDataUtilsService;
    let fakeRootScope: RootScopeMock;
    let localStorageService: StorageServiceMock;


    beforeEach(() => {
        fakeRootScope = new RootScopeMock();
        localStorageService = new StorageServiceMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: CommonsSessionStorageService, useValue: localStorageService }
            ]
        });
        service = TestBed.inject(BookingCommercialSellingDataUtilsService);
    })

    describe('When getCommercialsellingDataByMarket is called ', () => {
        const commercialData: any = JSON.parse(JSON.stringify(commercialDataResponse));
        it( 'Should return the specified market object', () => {
            fakeRootScope.appMarket = 'ES';
            const result = service.getCommercialsellingDataByMarket( commercialData );
            expect( typeof result ).toBe( 'object' );
            expect( Object.keys(result).length > 0 ).toBeTrue();
        });
    });
    describe( 'When getLocalDiscountsInfo is called ', () => {
        const commercialData = JSON.parse( JSON.stringify( commercialStoredData ) );
        it( 'Should return a discounts array', () => {
            localStorageService.set( 'commercialData', commercialData );
            const result = service.getLocalDiscountsInfo();
            expect( Array.isArray( result ) ).toBe(true);
            expect( result.length > 0 ).toBe(true);
        });
    });
    describe( 'When getCommercialAvailbilityType is called ', () => {
        const commercialData = JSON.parse( JSON.stringify( commercialStoredData ) );
        it( 'Should return a availabilityType string', () => {
            localStorageService.set( 'commercialData', commercialData );
            const result = service.getCommercialAvailbilityType( );
            expect( typeof result ).toBe('string');
        });
        it( 'Should return a availabilityType string calling fn with parameters', () => {
            const result = service.getCommercialAvailbilityType( commercialData );
            expect( typeof result ).toBe('string');
        });
        it( 'Should return null if no avaialabilityType is defined', () => {
            const modifiedCommercial = {...commercialData};
            delete modifiedCommercial.availabilityType;
            localStorageService.set( 'commercialData', modifiedCommercial );
            const result = service.getCommercialAvailbilityType( );
            expect( result ).toBe( null );
        });
    });
});
