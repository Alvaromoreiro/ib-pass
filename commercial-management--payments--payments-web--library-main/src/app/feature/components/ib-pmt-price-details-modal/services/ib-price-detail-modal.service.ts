import { Injectable } from '@angular/core';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbPriceDetailModalComponent } from '../ib-price-detail-modal.component';
import { downgradeInjectable } from '@angular/upgrade/static';
import angular from 'angular';
import { withIbPmtStylesHostClass } from '../../../../../styles/ib-pmt-styles-host';

const PRICE_DETAILS_ELIGIBLE_APP_TYPES = ['BBKI', 'MMBOH', 'BBKIOH'];

@Injectable({
    providedIn: 'root'
})
export class IbPriceDetailModalService {
    constructor (
        private IbCModalService: IbCModalService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    public shouldShowCTA = (flowApp: string): boolean => {
        return PRICE_DETAILS_ELIGIBLE_APP_TYPES.indexOf(flowApp) !== -1;
    };

    public preparePriceDetails = ():any[] => {
        const fareData = this.CommonsSessionStorageService.get<any>('fareData');
        if (!fareData) {
            const orderInfo = this.CommonsSessionStorageService.get<any>('importOrder'); 
            return this.transformOrderItemToOfferItem(orderInfo.order.orderItems);  
        }
        const priceDetails = fareData?.offers[0]?.discountsApplied?.originalOfferItems ?? fareData?.offers[0]?.offerItems;
        return priceDetails;
    };

    public openPriceDetailModal = (): any => {

        const modalOptions = {
            windowClass: withIbPmtStylesHostClass('ib-modals bki-dialog ib-price--scroll')
        };
        const modal = this.IbCModalService.showGenericComponentModal(IbPriceDetailModalComponent, modalOptions);
        const componentInstance = modal.componentInstance ;
        componentInstance.priceDetails = this.preparePriceDetails();
        modal.result.then(()=>{}, ()=>{});
    };


    
    private transformOrderItemToOfferItem = (orderItems: any[]): any[] => {
        const passengerTaxesForType: {[key: string]: {taxes: any, numPax: number, price: any}} = {};
        const response : any[] = [];
        
        orderItems.forEach( item => {
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
                        passengerIds: orderItems.flatMap( oi => 
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

try {
    angular
        .module('ib-booking-price-detail-modal-module')
        .service('IbPriceDetailModalService', downgradeInjectable(IbPriceDetailModalService));
} catch {
    angular
        .module('ib-booking-price-detail-modal-module', [])
        .service('IbPriceDetailModalService', downgradeInjectable(IbPriceDetailModalService));
}

