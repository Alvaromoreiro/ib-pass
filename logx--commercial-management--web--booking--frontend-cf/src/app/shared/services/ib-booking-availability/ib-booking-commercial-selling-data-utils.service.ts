import { Inject, Injectable } from '@angular/core';
import { CommercialDataMarket, CommercialDataDiscounts } from '@src/app/core/models/generic-models/generic-models';
import { AvailabilityTypes } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';
import { CommonsSessionStorageService, AJSRootScope, CommonsRootScope, downgradeToAJSService } from 'ib-web-commons/utils';
@Injectable({
    providedIn: 'root'
})
export class BookingCommercialSellingDataUtilsService {
    constructor (
        private localStorageService: CommonsSessionStorageService,
        @Inject(AJSRootScope) private rootScope: CommonsRootScope
    ) { }

    getCommercialsellingDataByMarket (commercialData:CommercialDataMarket[]): CommercialDataMarket {
        let appMarketDescription:string = '';
        let returnCommercialData: CommercialDataMarket = commercialData.find( data => data?.market?.code === this.rootScope?.appMarket );
        if ( returnCommercialData ) {
            appMarketDescription = returnCommercialData?.market?.description;
            this.localStorageService.set('appMarketDescription', appMarketDescription);
        }
        return returnCommercialData;
    }

    getLocalDiscountsInfo ():CommercialDataDiscounts[] {
        const availableDiscounts:CommercialDataDiscounts[] = [];
        const commercialDataStoraged: CommercialDataMarket = this.localStorageService.get('commercialData');
        if ( commercialDataStoraged?.discounts?.length > 0) {
            commercialDataStoraged.discounts.forEach(discount => {
                availableDiscounts.push(discount);
            });
        }
        return availableDiscounts;
    }

    getCommercialAvailbilityType ( data:CommercialDataMarket = null ):AvailabilityTypes {
        const commercialDataStoraged: CommercialDataMarket = data ?? this.localStorageService.get( 'commercialData' );
        const availabilityType: AvailabilityTypes = commercialDataStoraged?.availabilityType as AvailabilityTypes ?? null;
        return availabilityType;
    }
}
downgradeToAJSService('BookingCommercialSellingDataUtilsService', BookingCommercialSellingDataUtilsService, 'ib-booking-availability-module');
