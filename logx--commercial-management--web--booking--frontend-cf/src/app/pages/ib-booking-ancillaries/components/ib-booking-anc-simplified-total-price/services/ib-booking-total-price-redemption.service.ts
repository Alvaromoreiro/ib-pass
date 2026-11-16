import { Injectable } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { FareRedemptionDataModel } from '@src/app/core/models/generic-models/fare-models';


export type RedemptionTotalPriceModel = {
    totalCash: string ;
    totalAvios: string;
};



@Injectable({providedIn: 'root'})
export class BookingTotalPriceRedemptionService {

    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { }
    
    getRedemptionTotalPriceModel = (totalCash: string): RedemptionTotalPriceModel => {
        const totalPriceModel: RedemptionTotalPriceModel = {
            totalCash: totalCash,
            totalAvios: ''
        };
        const fareRedemptionData = this.CommonsSessionStorageService.get<FareRedemptionDataModel>(BkiStorageConstants.SELECTED_FARE_REDEMPTION_DATA);
        if(fareRedemptionData !== null) {
            totalPriceModel.totalAvios = fareRedemptionData.price.totalAvios;       
        }   
    
        return totalPriceModel;
    };
    
    
}

downgradeToAJSService('BookingTotalPriceRedemptionService', BookingTotalPriceRedemptionService, 'ib-booking-anc-simplified-total-price-module', []);
