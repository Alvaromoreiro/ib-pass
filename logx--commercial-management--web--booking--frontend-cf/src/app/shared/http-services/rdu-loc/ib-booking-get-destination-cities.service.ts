import { Injectable } from '@angular/core';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';
import { BookingRxProxy } from '../proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '../error';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { lastValueFrom, map } from 'rxjs';
@Injectable({providedIn: 'root'})
export class BookingGetDestinationCitiesListService {
    constructor (
        private CommonsSessionStorageService : CommonsSessionStorageService,
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService
       
    ) {}


    private callDestinationCitiesListService = () => {
        const endpoint = `${HttpServicesConstants.DEFAULT_ENDPOINTS.destinationCitiesListServiceURI}`;
        const config = {
            headers: {
                'Cache-Control': 'private, max-age=600'
            }
        };
        return lastValueFrom(this.BookingRxProxy.get(endpoint, config).pipe(
            map((response: any) => {
                this.CommonsSessionStorageService.set(BkiStorageConstants.DESTINATION_CITIES_LIST, response.data);
                return response.data;
            }), this.IbBookingErrorHandlerService.handleErrorOperator()));
  
    };

    getDestinationCitiesList = () => {
        const destinationCities = this.CommonsSessionStorageService.get(BkiStorageConstants.DESTINATION_CITIES_LIST);
        return destinationCities ? Promise.resolve(destinationCities) : this.callDestinationCitiesListService();
    };

}
downgradeToAJSService('BookingGetDestinationCitiesListService', BookingGetDestinationCitiesListService, 'ib-booking-services-module');
