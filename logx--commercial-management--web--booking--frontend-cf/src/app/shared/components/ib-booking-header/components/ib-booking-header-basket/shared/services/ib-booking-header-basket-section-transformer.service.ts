import { Inject, Injectable } from '@angular/core';
import { BookingHeaderConstants } from '../../../../ib-booking-header-constants';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';

@Injectable({providedIn: 'root'})
export class IbBasketSectionTransformerService {
    constructor (
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }
    public setInfoAncillarie  = (flexInfo) => {
        const flexData = {
            info: null,
            hasFlexibilization: false
        };
        const currency = this.CommonsSessionStorageService.get('currency');

        if ( flexInfo ) {
            flexData.info = BookingHeaderConstants.FLEXIBILIZATION_CONFIG;
            flexData.info.currency = currency;
            flexData.info.amount.price = flexInfo.total;
            flexData.info.amount.priceFormatted = this.CurrencyService.formatPrice( currency, flexInfo.total, true );
            flexData.info.items = [
                {
                    concepts: [
                        {
                            quantity: 1,
                            description: flexInfo.description,
                            price: flexInfo.total,
                            priceFormatted: this.CurrencyService.formatPrice( currency, flexInfo.total, true )
                        }
                    ]
                }
            ];
            flexData.hasFlexibilization = true;
        }
        return flexData;
    };

    public setPriorityInfoAncillarie = ( priorityInfo ) => {
        const priorityData = {
            info: null,
            hasPriorityBoarding: false
        };
        const currency: any = this.CommonsSessionStorageService.get( 'currency' );
        const searchSegment = ( segmentsId, segments ) => {
            let i;
            for ( i = 0; i < segments.length; i++ ) {
                if ( segments[ i ].id === segmentsId ) {
                    return segments[ i ];
                }
            }
            return null;
        };
        const totalPricePriorityBoarding = ( priorityInfo ) => {
            let i, j, total = 0, trips: any[] = [], position;
            for ( i = 0; i < priorityInfo.length; i++ ) {
                for ( j = 0; j < priorityInfo[ i ].trips.length; j++ ) {
                    if ( priorityInfo[ i ].trips[ j ].checkedTrip ) {
                        total += priorityInfo[ i ].trips[ j ].amount;
                        position = searchSegment( priorityInfo[ i ].trips[ j ].id, trips );
                        if ( position === null ) {
                            trips.push( {
                                id: priorityInfo[ i ].trips[ j ].id,
                                arrival: priorityInfo[ i ].trips[ j ].arrival,
                                departure: priorityInfo[ i ].trips[ j ].departure,
                                amount: priorityInfo[ i ].trips[ j ].amount,
                                priceFormatted: this.CurrencyService.formatPrice( currency, priorityInfo[ i ].trips[ j ].amount, true ),
                                quantity: 1
                            } );
                        } else {
                            position.amount += priorityInfo[ i ].trips[ j ].amount;
                            position.priceFormatted = this.CurrencyService.formatPrice( currency, position.amount, true );
                            position.quantity++;
                        }
                    }
                }
            }
            return {
                trips,
                totalPrice: total
            };
        };
        if ( priorityInfo ) {
            const priorityInformation = totalPricePriorityBoarding( priorityInfo );
            priorityData.info = BookingHeaderConstants.PRIORITY_BOARDING_CONFIG;
            priorityData.info.currency = currency;
            priorityData.info.trips = [...priorityInformation.trips];
            priorityData.info.amount = priorityInformation.totalPrice;
            priorityData.info.priceFormatted = this.CurrencyService.formatPrice( currency, priorityData.info.amount, true, null );
            if (priorityData.info.amount == 0) {
                priorityData.hasPriorityBoarding = false;
            } else {
                priorityData.hasPriorityBoarding = true;
            }
        }
        return priorityData;
    };
}
