import { TestBed } from '@angular/core/testing';
import { StepsNavigationService } from '@src/app/shared/services/ib-utils/ib-booking-steps-navigation.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { UrlUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-url-utils.service';
import { UrlUtilsServiceMock } from 'test/mocks/Services/UrlUtilsServiceMock';

class BookingUtilServiceMock {
    getURLFirstParameterByName = jasmine.createSpy( 'getURLFirstParameterByName' ).and.returnValue( 'false' );
}
// @ts-ignore
interface ServiceTest extends StepsNavigationService { 
    CommonsSessionStorageService: StorageServiceMock;
    BookingUtilService: BookingUtilServiceMock;
}

describe('service Test', () => {
    let service: ServiceTest;
    let fakeCommonsSessionStorageService;
    let fakeBookingUtilsService;
    beforeEach(async () => {
        fakeCommonsSessionStorageService = new StorageServiceMock();
        fakeBookingUtilsService = new BookingUtilServiceMock();
        TestBed.configureTestingModule({
            providers: [
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: UrlUtilsService, useClass: UrlUtilsServiceMock }
            ],
        });
        service = TestBed.inject( StepsNavigationService ) as unknown as any;
    });
    describe( 'When checkButtonsActivation is called', () => {
        beforeEach( () => {
            service.CommonsSessionStorageService.clear();
        } );
        it( 'It should return false', () => {
            const result = service.checkButtonsActivation();
            expect( result ).toBe( false );
        } );
    } );
});