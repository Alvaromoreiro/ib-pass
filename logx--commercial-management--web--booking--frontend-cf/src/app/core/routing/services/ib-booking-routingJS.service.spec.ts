import { TestBed } from '@angular/core/testing';
import { IbBookingRoutingAJS } from '@core/routing/services/ib-booking-routingJS.service';
import { BookingNavigationServiceMock } from '@test-mocks/Services/BookingNavigationServiceMock';
import { BookingNavigationService } from '@shared/services/ib-utils/ib-booking-navigation.service';

describe('IbBookingRoutingAJS', () => {
    let service: IbBookingRoutingAJS;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                IbBookingRoutingAJS,
                { provide: BookingNavigationService, useClass: BookingNavigationServiceMock }
            ]
        });

        service = TestBed.inject(IbBookingRoutingAJS);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should reload the current route', async () => {
        const currentUrl = '/test-url';
        const bookingNavigationService = service['BookingNavigationService'] as unknown as BookingNavigationServiceMock;
        bookingNavigationService.currentURL = currentUrl;

        await service.reload();
        expect(bookingNavigationService.navigateByUrl).toHaveBeenCalledWith('/', { skipLocationChange: true });
        expect(bookingNavigationService.navigateTo).toHaveBeenCalledWith(currentUrl);
        
    });
});