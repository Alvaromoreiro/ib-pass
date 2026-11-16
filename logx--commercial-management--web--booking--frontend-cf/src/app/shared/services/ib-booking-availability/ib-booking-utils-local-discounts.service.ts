
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BookingCommercialSellingDataUtilsService } from './ib-booking-commercial-selling-data-utils.service';
import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';

@Injectable({providedIn: 'root'})
export class BookingLocalDiscountsService {
    constructor (
        private BookingCommercialSellingDataUtilsService: BookingCommercialSellingDataUtilsService) {}

    getResidentsDiscountsForRoute = ( origin :string = '', destination :string = '') :Array<string> => {
        const result :Array<string>  = [];
        const discountsData = this.BookingCommercialSellingDataUtilsService.getLocalDiscountsInfo();
        const availableCitiesConfig : any = {};

        discountsData.forEach(discount => {
            if(discount.cities && discount.cities[0]) {
                availableCitiesConfig[discount.code] = discount.cities;
            }
        });

        if(availableCitiesConfig.CEUTA && availableCitiesConfig.CEUTA.some(city => city.code === origin || city.code === destination)) {
            result.push(BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.items[6].value);
        }
        if(availableCitiesConfig.MELILLA && availableCitiesConfig.MELILLA.some(city => city.code === origin || city.code === destination)) {
            result.push(BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.items[5].value);
        }
        if(availableCitiesConfig.BALEARES && availableCitiesConfig.BALEARES.some(city => city.code === origin) && availableCitiesConfig.BALEARES.some(city => city.code === destination)) {
            result.push( BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.items[4].value);
        }else if(availableCitiesConfig.BALEARES && availableCitiesConfig.BALEARES.some(city => city.code === origin || city.code === destination)) {
            result.push( BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.items[3].value);
        }
        if(availableCitiesConfig.CANARIAS && availableCitiesConfig.CANARIAS.some(city => city.code === origin) && availableCitiesConfig.CANARIAS.some(city => city.code === destination)) {
            result.push( BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.items[2].value );
        }else if(availableCitiesConfig.CANARIAS && availableCitiesConfig.CANARIAS.some(city => city.code === origin || city.code === destination)) {
            result.push( BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.items[1].value );
        }

        return result;
    };

    isResidentAvailable = (origin :string ='', destination :string ='') :boolean => (this.getResidentsDiscountsForRoute(origin, destination).length > 0);

    getDiscountsConfig = () => {
        return JSON.parse(JSON.stringify({resident: BookingAppConstants.DISCOUNT_SEARCH_RESIDENT, largeFamily: BookingAppConstants.DISCOUNT_SEARCH_FAMILY}));
    };
}
downgradeToAJSService('BookingLocalDiscountsService', BookingLocalDiscountsService, 'ib-booking-availability-module');

