import { InjectionToken } from '@angular/core';
import { ShoppingBasketDiscountObjectType } from '@src/app/core/models/header-model/header.model';
import { upgradeAJSServiceProvider } from 'ib-web-commons/utils';
export const AJSNewMainHeaderFacadeToken = new InjectionToken<any> ('NewMainHeaderFacade');
export const AJSNewMainHeaderFacadeProvider = upgradeAJSServiceProvider('NewMainHeaderFacade', AJSNewMainHeaderFacadeToken);
export interface NewMainHeaderFacadeType {
    setAPIFunctions: ( functions ) => void,
    initHeader: (headerModel, stepsModel, greyBarModel) => void,
    initHeaderModel: (headerModel) => void,
    updateBasketDiscountsNew: (discountData, originalPrice, totalDiscounts, totalPriceWithDiscounts) => void,
    addDiscountToBasket: (headerModel, discountData) => void,
    deleteDiscountFromBasket: ( discountType: string ) => void,
    updateBasketDiscounts: (headerModel, discountType, modelDiscount) => void,
    updateBasketOthers: (othersType, feeInfo) => void,
    updateBasketFlexibilization: (headerModel, flexInfo? ) => void,
    updateBasketUpgrading: (headerModel, upgrading) => void,
    updatePendingPaymentItems: (headerModel, seats, upgrading) => void,
    updateBasketPriority: (headerModel, priorityInfo) => void,
    dataUserLogin: (loginData) => void,
    updaupdateLoggedData: ( loggedData ) => void,
    updateTripsBasketFromDispo: ( selectedSlices, avabilabilityModel ) => void,
    deleteTripsBasketFromDispo: () => void,
    updateStepDescription: (description: string) => void,
    updateStepsModel( position:string, description?: string),
    checkAdaptativeMobileFlow: () => boolean,
    addSimpleDiscount: ( discountData: ShoppingBasketDiscountObjectType, totalPrice: number ) => void
}
