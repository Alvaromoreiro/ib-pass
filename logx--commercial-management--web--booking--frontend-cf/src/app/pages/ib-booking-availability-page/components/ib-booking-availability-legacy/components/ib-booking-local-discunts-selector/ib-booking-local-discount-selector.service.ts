import { downgradeToAJSService, CommonsCookiesService } from 'ib-web-commons/utils';
import { Inject, Injectable } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';


@Injectable({
    providedIn: 'root'
})
export class BookingLocalDiscountSelectorService {
    private readonly residentCookieIndex: number = 16;
    private readonly familyCookieIndex: number = 17;

    constructor (
        @Inject(WINDOW_TOKEN) private window: Window,
        private CommonsCookiesService: CommonsCookiesService

    ) { }

    public updateResidentDiscountCookie = (residentCodeSelected: string): void => {
        this.CommonsCookiesService.updateCookieValue( BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME, this.residentCookieIndex, residentCodeSelected, BookingAppConstants.COOKIES.DEFAULT_PATH, null );
    };
    public updateFamilyDiscountCookie = (familyCodeSelected: string): void => {
        this.CommonsCookiesService.updateCookieValue( BookingAppConstants.COOKIES.IBERIACOM_LAST_SEARCH.NAME, this.familyCookieIndex, familyCodeSelected, BookingAppConstants.COOKIES.DEFAULT_PATH, null );
    };

    public updateURLWithDiscounts = (residentCodeSelected: string = '', familyCodeSelected: string = ''): void => {
        const currentURL = new URL(this.window.location.href);
        currentURL.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.RESIDENT[0], residentCodeSelected);
        currentURL.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.LARGE_FAMILY_TYPE[0], familyCodeSelected);

        this.window.history.replaceState({}, '', currentURL.toString());
    };

}
downgradeToAJSService('BookingLocalDiscountSelectorService', BookingLocalDiscountSelectorService, 'ib-booking-availability-module');