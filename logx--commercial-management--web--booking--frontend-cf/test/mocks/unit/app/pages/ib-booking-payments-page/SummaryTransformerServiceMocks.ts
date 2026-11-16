import {  ShoppingBasketDiscountType } from '@src/app/core/models/ib-booking-availability/header-model';

export const HeaderDiscountObject: ShoppingBasketDiscountType = <ShoppingBasketDiscountType>{
    RES: {
        type: 'RES',
        discountType: 'BALEARES',
        description: 'Dto. Residente',
        percentDiscount: 75,
        totalDiscount: 165,
        discountCode: 'BP',
        discountFormatted: '165,00€'
    }
};
