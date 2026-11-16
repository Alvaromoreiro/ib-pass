import { TestBed } from '@angular/core/testing';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { DigitalDataProcess } from '@src/app/core/constants/ib-digital-data-constants';
import { DigitalDataPropertiesUtilsService } from '@src/app/shared/services/ib-datalayer/services/ib-digital-data-properties-utils.service';
import { UrlUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-url-utils.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils/';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { UrlUtilsServiceMock } from '../../../../../mocks/Services/UrlUtilsServiceMock';

// @ts-ignore
interface ServiceTest extends DigitalDataPropertiesUtilsService { 
    UrlUtilsService: UrlUtilsServiceMock,
    CommonsSessionStorageService: StorageServiceMock
}

describe('DigitalDataPropertiesUtilsService Test', () => {
    let service: ServiceTest;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                DigitalDataPropertiesUtilsService,
                { provide: CommonsSessionStorageService, useValue: new StorageServiceMock() },
                { provide: UrlUtilsService, useValue: new UrlUtilsServiceMock() }
            ],
        });
        service = TestBed.inject( DigitalDataPropertiesUtilsService ) as unknown as any;
    });
    describe( 'When setProcess is called', () => {
        beforeEach( () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.clear();
        } );
        it( 'It should return process Shuttle Redemption', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.SHUTTLE_FLOW, true );
            CommonsSessionStorageService.set( BkiStorageConstants.REDEMPTION_FLOW, true );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.SHUTTLE_REDEPMTION );
        } );
        it( 'It should return process Shuttle', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.SHUTTLE_FLOW, true );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.SHUTTLE );
        } );
        it( 'It should return process booking OB redencion', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.USER_LOGGED, BookingAppConstants.LOGIN_ONB );
            CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.BOOKING_OB_REDEMPTION );
        } );
        it( 'It should return process booking OB obtencion', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.USER_LOGGED, BookingAppConstants.LOGIN_ONB );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.BOOKING_OB );
        } );
        it( 'It should return process reserva onhold', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.FLOW_APP, 'BBKIOH' );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.ON_HOLD );
        } );
        it( 'It should return process redencion', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.REDEMPTION );
        } );
        it( 'It should return process metabuscadores', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.METASEARCH );
        } );
        it( 'It should return process hola madrid', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP );
            CommonsSessionStorageService.set( BkiStorageConstants.HOLA_MADRID, true );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.HMAD_STOP_OVER );
        } );
        it( 'It should return process multiples trayectos', () => {
            const { CommonsSessionStorageService } = service;
            CommonsSessionStorageService.set( BkiStorageConstants.SEARCH_FLIGHT_TYPE, BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP );
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.MULTI_TRIP );
        } );
        it( 'It should return process booking', () => {
            const result = service.setProcess();
            expect( result ).toEqual( DigitalDataProcess.BOOKING );
        } );
    } );
});