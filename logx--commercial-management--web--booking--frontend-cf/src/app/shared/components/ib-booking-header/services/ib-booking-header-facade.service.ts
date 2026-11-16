
import { Injectable } from '@angular/core';
import { FareDataModel } from '@src/app/core/models/generic-models/fare-models';
import { ShoppingBasketDiscountObjectType, HeaderDataType, HeaderTypeModel, HeaderDataHeaderModel } from '@src/app/core/models/ib-booking-availability/header-model';
import { OHImportResponse } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';
import { OrderData } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
import { HeaderModel } from 'ib-web-ancillaries/dist/app/core/models/header-model/header.model';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { BehaviorSubject } from 'rxjs';

export interface IbBookingHeaderFacadeAPI {
    initHeader: (headerModel: any, stepsModel: any, greyBarModel: any) => HeaderDataType;
    initHeaderModel: (headerModel: any) => HeaderDataType;
    updateHeader: (headerModel: HeaderDataType) => void;
    updateBasketDiscountsNew: (discountData: any, originalPrice: any, totalDiscounts: any, totalPriceWithDiscounts: any) => void;
    addDiscountToBasket: (discountData: any) => void;
    deleteDiscountFromBasket: (discountType: string) => void;
    /**
    * @deprecated Use deleteDiscountFromBasket or updateBasketDiscountsNew depending on the use case
    */
    updateBasketDiscounts: (discountType: any, modelDiscount: any) => void;
    updateBasketOthers: (othersType: any, feeInfo: any) => void;
    updateBasketFlexibilization: (flexInfo?: any) => void;
    updateBasketUpgrading: (upgrading: any) => void;
    updatePendingPaymentItems: (headerModel: HeaderModel, seats: any, upgrading: any) => void;
    updateBasketPriority: (priorityInfo: any) => void;
    updateTripsBasketFromDispo: (selectedSlices: any, avabilabilityModel: any) => void;
    deleteTripsBasketFromDispo: () => void;
    updateStepDescription: (description: string) => void;
    updateStepsModel: (position: string, description?: string, stepsModelArray?: any) => void;
    checkAdaptativeMobileFlow: () => boolean;
    addSimpleDiscount: (discountData: ShoppingBasketDiscountObjectType) => void;
    deleteInsuranceFromBasket: () => void;
    deleteAssistCardFromBasket: () => void;
    deleteGlobickTransfersFromBasket: () => void;
    getObservableHeader: () => BehaviorSubject<HeaderDataType>;
    updateHeaderModel: (headerModel: HeaderDataType) => void;
    setAncillariesDeletion: (status: boolean) => void;
    getAncillariesDeletion: () => BehaviorSubject<boolean>;
    setLoadingBasket: (status: boolean) => void;
    getLoadingBasket: () => BehaviorSubject<boolean>;
    setTotalDCC: (total: string) => void;
    setLogin: (onLogin: any, afterLogin?: any, errorLogin?: any, loggedData?: any) => void;
    showLogin: () => void;
    updateShowBasket: (showBasket: boolean) => void;
    updateTrips: (fareData: FareDataModel, infoAvios?: any) => void;
    forceVisualUpdate: () => void;
    updateTripsFromOrder: (order: OrderData | OHImportResponse) => void;
    setHeaderType: (type: HeaderTypeModel) => void;
    updateSteps: (position: string, description?: string) => void;
    updateDiscounts: (discount: any, model: any) => void;
    blockNavigation: (status: boolean) => void;
    deleteDiscountBasket: ( discountType: string ) => void;
    updateHeaderModelOnHold: ( headerModel: HeaderDataHeaderModel ) => HeaderDataHeaderModel;
}

@Injectable({
    providedIn: 'root'
})
export abstract class IbBookingHeaderFacadeService implements IbBookingHeaderFacadeAPI {
    constructor () {}

    initHeader: (headerModel: any, stepsModel: any, greyBarModel: any) => HeaderDataType;
    initHeaderModel: (headerModel: any) => HeaderDataType;
    updateHeader: (headerModel: HeaderDataType) => void;
    updateBasketDiscountsNew: (discountData: any, originalPrice: any, totalDiscounts: any, totalPriceWithDiscounts: any) => void;
    addDiscountToBasket: (discountData: any) => void;
    deleteDiscountFromBasket: (discountType: string) => void;
    updateBasketDiscounts: (discountType: any, modelDiscount: any) => void;
    /**
     * Update fees and others charges in basket
     * if feeInfo is not provided, it will remove othersType from basket
     */
    updateBasketOthers: (othersType: string, feeInfo?: any) => void;
    updateBasketFlexibilization: (flexInfo?: any) => void;
    updateBasketUpgrading: (upgrading: any) => void;
    updatePendingPaymentItems: (headerModel: HeaderModel, seats: any, upgrading: any) => void;
    updateBasketPriority: (priorityInfo: any) => void;
    updateTripsBasketFromDispo: (selectedSlices: any, avabilabilityModel: any) => void;
    deleteTripsBasketFromDispo: () => void;
    updateStepDescription: (description: string) => void;
    updateStepsModel: (position: string, description?: string, stepsModelArray?: any) => void;
    checkAdaptativeMobileFlow: () => boolean;
    addSimpleDiscount: (discountData: ShoppingBasketDiscountObjectType) => void;
    deleteInsuranceFromBasket: () => void;
    deleteGlobickTransfersFromBasket: () => void;
    getObservableHeader: () => BehaviorSubject<HeaderDataType>;
    updateHeaderModel: (headerModel: HeaderDataType) => void;
    setAncillariesDeletion: (status: boolean) => void;
    getAncillariesDeletion: () => BehaviorSubject<boolean>;
    setLoadingBasket: (status: boolean) => void;
    getLoadingBasket: () => BehaviorSubject<boolean>;
    setTotalDCC: (total: string) => void;
    setLogin: (onLogin: any, afterLogin?: any, errorLogin?: any, loggedData?: any) => void;
    showLogin: () => void;
    updateShowBasket: (showBasket: boolean) => void;
    updateTrips: (fareData: FareDataModel, infoAvios?: any) => void;
    forceVisualUpdate: () => void;
    updateTripsFromOrder: (order: OrderData | OHImportResponse) => void;
    setHeaderType: (type: HeaderTypeModel) => void;
    updateSteps: (position: string, description?: string) => void;
    updateDiscounts: (discount: any, model: any) => void;
    blockNavigation: (status: boolean) => void;
    deleteDiscountBasket: (discountType: string) => void;
    deleteAssistCardFromBasket: () => void;
    updateHeaderModelOnHold: (headerModel: HeaderDataHeaderModel) => HeaderDataHeaderModel;

    setAPIFunctions (props: IbBookingHeaderFacadeAPI) {
        Object.keys(props).forEach((key) => {
            this[key] = props[key];
        });
    }
}



downgradeToAJSService('NewMainHeaderFacade', IbBookingHeaderFacadeService as any, 'ib-booking-app', []);
