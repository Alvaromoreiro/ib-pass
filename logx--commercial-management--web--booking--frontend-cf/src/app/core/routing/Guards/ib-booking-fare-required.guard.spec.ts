import { TestBed } from '@angular/core/testing';
import { BookingFareRequiredGuardFn } from '@src/app/core/routing/Guards/ib-booking-fare-required.guard';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { StorageServiceMock } from 'test/mocks/Services/StorageServiceMock';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import { BkiStorageConstants } from '@src/app/core/routing/Guards/ib-booking-route-preconditions.guard';
import { getRedirectionPath, RouterPathsConstants } from '@src/app/core/constants/ib-booking-router-paths-constants';


class TestBench {
    public Guard: CanActivateFn;
    public CommonsSessionStorageService: CommonsSessionStorageService;
    public BookingRedirectionService: BookingRedirectionService;
    constructor () {
        this.CommonsSessionStorageService =  new StorageServiceMock() as any;
        this.BookingRedirectionService = jasmine.createSpyObj('BookingRedirectionService', ['path']);

        this.Guard = (route: ActivatedRouteSnapshot)=> TestBed.runInInjectionContext(() => BookingFareRequiredGuardFn(route, null));
        TestBed.configureTestingModule({
            providers: [
                { provide: CommonsSessionStorageService, useValue: this.CommonsSessionStorageService },
                { provide: BookingRedirectionService, useValue: this.BookingRedirectionService }
            ]
        });
    }
}
describe('Test BookingFareRequiredGuardFn', () => {
    let guard, fakeSessionStorage, fakeRedirectionService;
   
    // Instanciate guard and module just once
    beforeEach(() => {
        const test = new TestBench();  
        guard = test.Guard;
        fakeSessionStorage = test.CommonsSessionStorageService;
        fakeRedirectionService = test.BookingRedirectionService;
    });
    
    describe('Fare is required', ()=> {
        it('should allow next step', () => {
            fakeSessionStorage.set(BkiStorageConstants.FARE, 'someFare');
            const result = guard();
            expect(result).toBeTrue();
            expect(fakeRedirectionService.path).not.toHaveBeenCalled();
        });
    });
    describe('Fare is required but not provided', ()=> {
        it('should not allow next step', () => {
            const result = guard();
            expect(result).toBeFalse();
            expect(fakeRedirectionService.path).toHaveBeenCalledWith(getRedirectionPath(RouterPathsConstants.ibbkerror));
        });
    });
});