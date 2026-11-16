import { Injectable } from '@angular/core';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { lastValueFrom, map } from 'rxjs';

@Injectable({providedIn: 'root'})

export class CountriesListService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        private localStorageService: CommonsSessionStorageService
    ) {}

    public getCountriesList = ( ): Promise<any> => {
        const countriesList = this.localStorageService.get('countriesList');

        if(countriesList === null) {
            const url = BookingAppConstants.DEFAULT_ENDPOINTS.countriesListServiceURI;
            const config: any = {
                headers: {
                    'Cache-Control': 'private, max-age=600'
                }
            };
            return lastValueFrom( this.BookingRxProxy.get( url, config )
                .pipe( map( ( response: any ) => {
                    this.localStorageService.set('countriesList', response.data);
                    return response.data;
                } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
        } return countriesList as any;
    };


}