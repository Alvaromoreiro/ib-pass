import { TestBed } from '@angular/core/testing';
import { BookingLocalDiscountSelectorService } from '@pages/ib-booking-availability-page/components/ib-booking-availability-legacy/components/ib-booking-local-discunts-selector/ib-booking-local-discount-selector.service';
import { WINDOW_TOKEN } from '@core/config/ib-booking-app-tokens';
import { CommonsCookiesService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';

describe('BookingLocalDiscountSelectorService', () => {
    let service: BookingLocalDiscountSelectorService;
    let mockWindow: any;
    let mockCommonsCookies: jasmine.SpyObj<CommonsCookiesService>;

    beforeEach(() => {
        mockWindow = {
            location: new URL('http://localhost:9007/?market=ES#!/availability'),
            history: { replaceState: jasmine.createSpy('replaceState') }
        } as any;

        mockCommonsCookies = jasmine.createSpyObj('CommonsCookiesService', ['updateCookieValue']);

        TestBed.configureTestingModule({
            providers: [
                BookingLocalDiscountSelectorService,
                { provide: WINDOW_TOKEN, useValue: mockWindow },
                { provide: CommonsCookiesService, useValue: mockCommonsCookies }
            ]
        });

        service = TestBed.inject(BookingLocalDiscountSelectorService);
    });

    it('añade los descuentos a la URL manteniendo el hash', () => {
        service.updateURLWithDiscounts('BP', 'FN');

        const updatedHref = mockWindow.history.replaceState.calls.mostRecent().args[2] as string;
        const updatedUrl = new URL(updatedHref);

        expect(updatedUrl.searchParams.get(BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET[1])).toBe('ES');
        expect(updatedUrl.searchParams.get(BookingAppConstants.BOOKING_PARAMS_NAMES.RESIDENT[0])).toBe('BP');
        expect(updatedUrl.searchParams.get(BookingAppConstants.BOOKING_PARAMS_NAMES.LARGE_FAMILY_TYPE[0])).toBe('FN');
        expect(updatedUrl.hash).toBe('#!/availability');
    });

    it('pone valores vacíos cuando no se indican', () => {
        service.updateURLWithDiscounts();

        const updatedHref = mockWindow.history.replaceState.calls.mostRecent().args[2] as string;
        const updatedUrl = new URL(updatedHref);

        expect(updatedUrl.searchParams.get(BookingAppConstants.BOOKING_PARAMS_NAMES.RESIDENT[0])).toBe('');
        expect(updatedUrl.searchParams.get(BookingAppConstants.BOOKING_PARAMS_NAMES.LARGE_FAMILY_TYPE[0])).toBe('');
        expect(updatedUrl.hash).toBe('#!/availability');
    });

    it('actualiza la cookie de residente con el índice correcto', () => {
        service.updateResidentDiscountCookie('BP');

        expect(mockCommonsCookies.updateCookieValue).toHaveBeenCalledWith(
            BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME,
            16,
            'BP',
            BookingAppConstants.COOKIES.DEFAULT_PATH,
            null
        );
    });

    it('actualiza la cookie de familia numerosa con el índice correcto', () => {
        service.updateFamilyDiscountCookie('FN');

        expect(mockCommonsCookies.updateCookieValue).toHaveBeenCalledWith(
            BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME,
            17,
            'FN',
            BookingAppConstants.COOKIES.DEFAULT_PATH,
            null
        );
    });
});
