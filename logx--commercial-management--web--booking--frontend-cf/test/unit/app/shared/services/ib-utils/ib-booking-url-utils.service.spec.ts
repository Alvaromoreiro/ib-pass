import { TestBed } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { UrlUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-url-utils.service';
import { WindowMock } from 'test/mocks/class/WindowMock';
// @ts-ignore
interface ServiceTest extends UrlUtilsService {
    Window: WindowMock
}
describe( 'service UrlUtilsService', () => {
    let originalHref: string;
    let service: ServiceTest;
    
    beforeEach( async () => {
        TestBed.configureTestingModule( {
            providers: [
                UrlUtilsService,
                { provide: WINDOW_TOKEN, useValue: new WindowMock() }
            ],
        });
        service = TestBed.inject( UrlUtilsService ) as unknown as any;
        const { Window } = service;
        originalHref = Window.location.href;
    } );
    
    describe( 'When getURLFirstParameterByName is called', () => {
        beforeEach( () => {
            const { Window } = service;
            Window.location.href = originalHref;
        } );
        it( 'It should check and return null', () => {
            const result = service.getURLFirstParameterByName( BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT );
            expect( result ).toBe( null );
        } );
        it( 'It should check and return true', () => {
            const { Window } = service;
            Window.location.href = 'https://localhost:9876/?&isPetFlight=true';
            Window.location.search = '?&isPetFlight=true';
            const result = service.getURLFirstParameterByName( BookingAppConstants.BOOKING_PARAMS_NAMES.PETS_FLIGHT );
            expect( result ).toBe( 'true' );
        } );
        it( 'It should check passenger param and return true', () => {
            const { Window } = service;
            Window.location.href = 'https://localhost:9876/?&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0';
            Window.location.search = '?&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0';
            const result = service.getURLFirstParameterByName( BookingAppConstants.BOOKING_PARAMS_NAMES.ADULT );
            expect( result ).toBe( '1' );
        } );
        afterEach( () => {
            const { Window } = service;
            Window.location.href = originalHref;
        } );
    } );
    
    afterAll( () => {
        const { Window } = service;
        Window.location.href = originalHref;
    } );

});
