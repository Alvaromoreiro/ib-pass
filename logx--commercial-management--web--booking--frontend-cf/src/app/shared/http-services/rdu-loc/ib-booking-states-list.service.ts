import { Injectable } from '@angular/core';
import { BookingRxProxy } from '@src/app/shared/http-services/proxy/ib-booking-rx-proxy.service';
import { IbBookingErrorHandlerService } from '@src/app/shared/http-services/error';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { lastValueFrom, map } from 'rxjs';
import { HttpServicesConstants } from '@src/app/core/constants/ib-http-services-constants';

@Injectable({providedIn: 'root'})

export class StatesListService {
    constructor (
        private BookingRxProxy: BookingRxProxy,
        private IbBookingErrorHandlerService: IbBookingErrorHandlerService,
        private localStorageService: CommonsSessionStorageService
    ) {}

    public getStatesList = ( country ): Promise<any> => {
        const stateList = this.localStorageService.get('stateList_' + country);

        if(stateList === null) {
            const url = `${HttpServicesConstants.DEFAULT_ENDPOINTS.statesListServiceURI + country}/states`;
            return lastValueFrom( this.BookingRxProxy.get( url )
                .pipe( map( ( response: any ) => {
                    this.localStorageService.set('stateList_' + country, response.data);
                    return response.data;
                } ), this.IbBookingErrorHandlerService.handleErrorOperator() ) );
        } return stateList as any;
    };
}
