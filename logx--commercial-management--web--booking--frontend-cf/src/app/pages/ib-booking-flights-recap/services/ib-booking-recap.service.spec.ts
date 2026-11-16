import { TestBed } from '@angular/core/testing';
import { IbBookingRecapPageService } from '@pages/ib-booking-flights-recap/services/ib-booking-recap.service';
import { BookingRedirectionService } from '@shared/services/ib-utils/ib-booking-redirection.service';


describe('IbBookingRecapPageService', () => {
    let service: IbBookingRecapPageService;
    let bookingRedirectionServiceSpy: jasmine.SpyObj<BookingRedirectionService>;

    beforeEach(() => {
        const bookingRedirectionSpy = jasmine.createSpyObj('BookingRedirectionService', ['path']);

        TestBed.configureTestingModule({
            providers: [
                IbBookingRecapPageService,
                { provide: BookingRedirectionService, useValue: bookingRedirectionSpy }
            ]
        });

        service = TestBed.inject(IbBookingRecapPageService);
        bookingRedirectionServiceSpy = TestBed.inject(BookingRedirectionService) as jasmine.SpyObj<BookingRedirectionService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should inject BookingRedirectionService', () => {
        expect(bookingRedirectionServiceSpy).toBeTruthy();
    });

    it('should call redirectToNextStep and redirect to the correct path', () => {
        const expectedPath = '/ibpbah';
    
        service.redirectToNextStep();
    
        expect(bookingRedirectionServiceSpy.path).toHaveBeenCalledWith(expectedPath);
    });

    it('should use RouterPathsConstants.ibpbah when calling getRedirectionPath', () => {
        const expectedPath = '/ibpbah';

        service.redirectToNextStep();

        expect(bookingRedirectionServiceSpy.path).toHaveBeenCalledWith(expectedPath);
    });
});
