import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { Inject, Injectable } from '@angular/core';
import { CommercialDataMarket } from '@src/app/core/models/generic-models/generic-models';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';


@Injectable({
    providedIn: 'root'
})
export class IbBookingCurrencyUtilsService {
    constructor (
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }

    public getPriceFormatted = (price: number, decimals: boolean = true, roundedByService: boolean = false) => {
        const currency = this.CurrencyService.getCurrencyObject( this.CommonsSessionStorageService.get<CommercialDataMarket>( BkiStorageConstants.COMMERCIAL_DATA ).currency );
        return this.CurrencyService.formatPrice( currency, price, decimals, roundedByService );
    };
}