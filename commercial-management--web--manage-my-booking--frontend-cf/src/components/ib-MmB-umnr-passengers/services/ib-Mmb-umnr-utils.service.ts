import { Injectable } from '@angular/core';
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { CommonsSessionStorageService, downgradeToAJSService } from "ib-web-commons/utils";

@Injectable({providedIn: 'root'})
export class IbMmbUmnrUtilsService  {
    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService
    ){}

    public isActiveUMNR = ():boolean => {
        return (MmBAppConstants.TOGGLE.isActiveUmnr && this.isOrderItemUmnr());
        // REMOVE LOCAL DEV 
        // return true;
        // REMOVE LOCAL DEV
    };

    public isDataUmnrCompleted = ():boolean => {
        return this.CommonsSessionStorageService.get(MmBAppConstants.UMNR_DATA.SESSION_STORAGE_KEY);
    };

    private isOrderItemUmnr = ():boolean => {
        const bookingInfo: ImportOrderData.completeOrder = this.CommonsSessionStorageService.get('bookingInfo');
        const orderItems = bookingInfo?.order?.orderItems;
        return orderItems?.some(item => item.serviceCode === 'UMNR');
    };
}

downgradeToAJSService('IbMmbUmnrUtilsService', IbMmbUmnrUtilsService, 'ib-mmb-umnr-passengers-module')