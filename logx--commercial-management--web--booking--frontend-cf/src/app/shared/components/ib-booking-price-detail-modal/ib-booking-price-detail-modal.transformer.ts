import { OrderItem  } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';

export class IbBookingPriceDetailModalTransformer {

    public static transformOrderItemToOfferItem = (orderItem: OrderItem[]): AvailabilityTransformerModel.OfferItem[] => {
        const passengerTaxesForType: {[key: string]: {taxes: AvailabilityTransformerModel.Tax[], numPax: number, price: AvailabilityTransformerModel.Price}} = {};
        const response : AvailabilityTransformerModel.OfferItem[] = [];
        
        orderItem.forEach( item => {
            if(!item.passengerPrices) {
                return;
            }
            item.passengerPrices.forEach( pax => {
                let paxType = pax.passengerId.split('_')[0];
                passengerTaxesForType[paxType] = { 
                    taxes: pax.taxes,
                    numPax: (passengerTaxesForType[paxType]?.numPax ?? 0) + 1,
                    price: pax.price
                };
                
            });
            
            
            Object.keys(passengerTaxesForType).forEach( 
                passengers=> {
                    response.push({
                        offerItemId: undefined,
                        price:passengerTaxesForType[passengers].price,
                        passengerIds: orderItem.flatMap( oi => 
                            oi.passengerPrices?.filter( pp => pp.passengerId.startsWith(passengers))
                                .map( pp => pp.passengerId) || []
                        ),
                        privateFareInformation: undefined,
                        originCurrencyPrice: undefined,
                        detailedTaxes: passengerTaxesForType[passengers].taxes
                    });
                });
        });


        return response;
    };
    
    
    
}
