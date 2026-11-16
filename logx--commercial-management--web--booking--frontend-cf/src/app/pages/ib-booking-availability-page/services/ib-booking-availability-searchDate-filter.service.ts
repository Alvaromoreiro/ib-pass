import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { UrlUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-url-utils.service';
import { BookingRedirectionService } from '@src/app/shared/services/ib-utils/ib-booking-redirection.service';
import dayjs from 'dayjs';
import { downgradeToAJSService } from 'ib-web-commons/utils';
@Injectable({
    providedIn: 'root'
})
export class AvailabilitySearchDateFilterService {
    constructor (private urlUtilsService: UrlUtilsService,
        private BookingRedirectionService: BookingRedirectionService,
        @Inject(WINDOW_TOKEN) private window: Window
    ) { }

    private getDateFromUrlParams = ( monthParam: string[], dayParam: string[] ): Date | null => {
        const yearMonthData = this.urlUtilsService.getURLFirstParameterByName(monthParam);
        const dayData = this.urlUtilsService.getURLFirstParameterByName(dayParam);

        if (yearMonthData === null || dayData === null) {
            return null;
        }

        return dayjs(`${yearMonthData}-${dayData}`, 'YYYYMM-DD', true).toDate();
    };

    private getPassengerParamValue = (paramName: string): string => {
        const rawValue = this.urlUtilsService.getURLFirstParameterByName(paramName);
        const parsedValue = parseInt(rawValue ?? '', 10);
        return Number.isNaN(parsedValue) ? '0' : parsedValue.toString();
    };

    private setPassengersUrlParams = (searchMap: URLSearchParams): void => {
        const passengerMappings: Array<string> = [
            BookingAppConstants.BOOKING_PARAMS_NAMES.ADULT[1],
            BookingAppConstants.BOOKING_PARAMS_NAMES.CHILD[1],
            BookingAppConstants.BOOKING_PARAMS_NAMES.INFANT[1],
            BookingAppConstants.BOOKING_PARAMS_NAMES.TEENAGER[0],
            BookingAppConstants.BOOKING_PARAMS_NAMES.YOUNG[0],
            BookingAppConstants.BOOKING_PARAMS_NAMES.SENIOR[0]
        ];

        passengerMappings.forEach((param) => {
            searchMap.set(param, this.getPassengerParamValue(param));
        });
    };


    private generateAvailabilityHomepageUrl = ( departureDate: Date, arrivalDate?: Date ): string => {
        const url = new URL(this.window.location.origin);
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET[1], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET[1]));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE[1], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE[1]));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.FLEXIBLE_DATES[1], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.FLEXIBLE_DATES[1]));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE[1], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE[1]));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY[0], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY[0]));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY[0], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY[0]));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_MONTH[0], dayjs(departureDate).format('YYYYMM'));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_DAY[0], dayjs(departureDate).format('DD'));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_YEAR[0], dayjs(departureDate).format('YYYY'));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.FARE_TYPE[0], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.FARE_TYPE));
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_MONTH[0], '');
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_DAY[0], '');
        url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_YEAR[0], '');
        // PassengersURL
        this.setPassengersUrlParams(url.searchParams);

        if (arrivalDate) {
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_MONTH[0], dayjs(arrivalDate).format('YYYYMM'));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_DAY[0], dayjs(arrivalDate).format('DD'));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_YEAR[0], dayjs(arrivalDate).format('YYYY'));
        }
        
        return url.toString();

    };

    private getPastDatesRedirectParams = (departureDate: Date, arrivalDate: Date | null, currentDate: number): { departureDate: Date; arrivalDate?: Date } | null => {
        const currentDay = new Date(currentDate);
        const isDeparturePast = departureDate.getTime() < currentDate;

        if (!arrivalDate) {
            return isDeparturePast ? { departureDate: currentDay } : null;
        }

        const isArrivalPast = arrivalDate.getTime() < currentDate;

        if (!isDeparturePast && !isArrivalPast) {
            return null;
        }

        return {
            departureDate: isDeparturePast ? currentDay : departureDate,
            arrivalDate: isArrivalPast ? currentDay : arrivalDate
        };
    };

    public pastDatesAvailabilityCheck = () => {
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const departureDate = this.getDateFromUrlParams(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_MONTH, BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_DAY) ?? new Date(new Date().setHours(0, 0, 0, 0));
        const arrivalDate = this.getDateFromUrlParams(BookingAppConstants.BOOKING_PARAMS_NAMES.END_MONTH, BookingAppConstants.BOOKING_PARAMS_NAMES.END_DAY);
        const redirectParams = this.getPastDatesRedirectParams(departureDate, arrivalDate, currentDate);

        if (!redirectParams) {
            return false;
        }

        this.BookingRedirectionService.externalRedirect(this.generateAvailabilityHomepageUrl(
            redirectParams.departureDate,
            redirectParams.arrivalDate
        ));
        return true;
    };

    public pastDatesMetasearchCheck = () => {
        const url = new URL(this.window.location.origin);
        const currentDate = (new Date()).setHours(0, 0, 0, 0);
        const departureDate = new Date(this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.DEPARTURE_DATE[0] + '1')).setHours(0, 0, 0, 0);
        const slices = {
            slice1: this.urlUtilsService.getURLFirstParameterByName('Slice1').split(','),
            slice2: (this.urlUtilsService.getURLFirstParameterByName('Slice2') ?? '').split(',')
        };
        const tripType = this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE[0]) === 'OneWay' ? 1 : 2;
        const returnDate = slices.slice2.length > 0 ? this.urlUtilsService.getURLFirstParameterByName('DepartureDate' + slices.slice2[slices.slice2.length - 1]) : null;
    
        if (currentDate > departureDate) {
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET[1], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.MARKET));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE[1], this.urlUtilsService.getURLFirstParameterByName(BookingAppConstants.BOOKING_PARAMS_NAMES.LANGUAGE));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.TRIP_TYPE[1], `${tripType}`);
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.FLEXIBLE_DATES[1], 'true');
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_CITY[0], this.urlUtilsService.getURLFirstParameterByName('Origin' + slices.slice1[0]));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_CITY[0], this.urlUtilsService.getURLFirstParameterByName('Destination' + slices.slice1[slices.slice1.length - 1]));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_MONTH[0], dayjs(currentDate).format('YYYYMM'));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_DAY[0], dayjs(currentDate).format('DD'));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.BEGIN_YEAR[0], dayjs(currentDate).format('YYYY'));
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_MONTH[0], '');
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_DAY[0], '');
            url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_YEAR[0], '');
            this.setPassengersUrlParams(url.searchParams);
            if (returnDate) {
                url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_MONTH[0], dayjs(returnDate).format('YYYYMM'));
                url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_DAY[0], dayjs(returnDate).format('DD'));
                url.searchParams.set(BookingAppConstants.BOOKING_PARAMS_NAMES.END_YEAR[0], dayjs(returnDate).format('YYYY'));
            } 
            this.BookingRedirectionService.externalRedirect(url.toString());
            return true;
        }

        return false;

    };  
    
}
downgradeToAJSService('AvailabilitySearchDateFilterService', AvailabilitySearchDateFilterService, 'ib-booking-availability-module');




