import { IbBookingAlpComponent } from '@pages/ib-booking-alp/ib-booking-alp.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';
import { getRedirectionPath, RouterPathsConstants } from '@core/constants/ib-booking-router-paths-constants';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Location } from '@angular/common';
class LocationMock {
    path = jasmine.createSpy( 'path' ).and.returnValue( `/${RouterPathsConstants.ibpbah}` );
}
describe('IbBookingAlpComponent', () => {
    let component: IbBookingAlpComponent;
    let fixture: ComponentFixture<IbBookingAlpComponent>;
    let bookingRedirectionService: jasmine.SpyObj<BookingRedirectionService>;
    let fakeLocation: LocationMock;
    let fakeCommonsSessionStorageService: StorageServiceMock;

    beforeEach(async () => {
        const bookingRedirectionServiceSpy = jasmine.createSpyObj('BookingRedirectionService', ['path']);
        fakeLocation = new LocationMock();
        fakeCommonsSessionStorageService = new StorageServiceMock();

        await TestBed.configureTestingModule({
            declarations: [IbBookingAlpComponent],
            providers: [
                { provide: BookingRedirectionService, useValue: bookingRedirectionServiceSpy },
                { provide: CommonsSessionStorageService, useValue: fakeCommonsSessionStorageService },
                { provide: Location, useValue: fakeLocation }
            ],
            schemas: [NO_ERRORS_SCHEMA] 
        }).compileComponents();

        fixture = TestBed.createComponent(IbBookingAlpComponent);
        component = fixture.componentInstance;
        bookingRedirectionService = TestBed.inject( BookingRedirectionService ) as jasmine.SpyObj<BookingRedirectionService>;
        fakeCommonsSessionStorageService.clear();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a bookingRedirectionService instance', () => {
        expect(component['bookingRedirectionService']).toBeDefined();
        expect(component['bookingRedirectionService']).toBe(bookingRedirectionService);
    });

    describe('continueToNextStep', () => {
        it('should call bookingRedirectionService.path with correct redirection path', () => {
            const expectedPath = getRedirectionPath(RouterPathsConstants.ibairp);
            
            component.continueToNextStep();
            
            expect(bookingRedirectionService.path).toHaveBeenCalledWith(expectedPath);
            expect(bookingRedirectionService.path).toHaveBeenCalledTimes(1);
        });

        it('should redirect to /ibairp path', () => {
            component.continueToNextStep();
            
            expect(bookingRedirectionService.path).toHaveBeenCalledWith('/ibairp');
        });
    });

    describe( 'onErrorOcurred', () => {
        beforeEach( () => {
            fakeCommonsSessionStorageService.clear();
        } );

        it('should redirect to /ibairp path', () => {
            component.onErrorOcurred();
            expect(bookingRedirectionService.path).toHaveBeenCalledWith('/ibairp', { replaceUrl: true });
        } );
    });

 
    describe('Error Handling', () => {
        it('should handle bookingRedirectionService.path throwing an error in continueToNextStep', () => {
            bookingRedirectionService.path.and.throwError('Redirection error');
            
            expect(() => component.continueToNextStep()).toThrowError('Redirection error');
        });

        it('should handle bookingRedirectionService.path throwing an error in onErrorOcurred', () => {
            bookingRedirectionService.path.and.throwError('Redirection error');
            
            expect(() => component.onErrorOcurred()).toThrowError('Redirection error');
        });
    });

});