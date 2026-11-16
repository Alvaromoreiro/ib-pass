import { BookingNavigationService } from '@shared/services/ib-utils/ib-booking-navigation.service';
import type { Router } from '@angular/router';

describe('BookingNavigationService - currentURL', () => {
    let mockRouter: Router & { url: string };
    let service: BookingNavigationService;

    beforeEach(() => {
        mockRouter = {
            url: '/initial',
            navigate: jasmine.createSpy('navigate'),
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
        } as unknown as Router & { url: string };

        service = new BookingNavigationService(mockRouter);
    });

    it('returns the Router.url value', () => {
        expect(service.currentURL).toBe('/initial');
    });

    it('reflects updates to Router.url on subsequent reads', () => {
        expect(service.currentURL).toBe('/initial');
        mockRouter.url = '/updated/path';
        expect(service.currentURL).toBe('/updated/path');
    });
});
