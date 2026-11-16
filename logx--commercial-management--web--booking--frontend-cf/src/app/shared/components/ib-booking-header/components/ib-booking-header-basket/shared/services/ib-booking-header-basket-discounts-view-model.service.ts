import { Injectable } from '@angular/core';
import { BookingHeaderConstants } from '../../../../ib-booking-header-constants';
import { TranslateService } from '@ngx-translate/core';
import { IbCheckPartnersDiscountsService } from '../../../../../../services/ib-check-partners-discount/ib-check-partners-discount.service';
import { ShoppingBasketDiscountsModel } from '@src/app/core/models/ib-booking-availability/header-model';

@Injectable({
    providedIn: 'root'
})
export class IbBookingHeaderBasketDiscountsViewModelService {
    constructor (
        private TranslateService: TranslateService,
        private IbCheckPartnersDiscountsService: IbCheckPartnersDiscountsService
    ) { }

    public getDiscountsViewModel ():ShoppingBasketDiscountsModel {
        return {
            hasDiscounts: false,
            total: 0,
            discounts: {}
        } as ShoppingBasketDiscountsModel;
    }

    public getDiscountModel ( modelDiscount, type, totalPrice? ) {
        let discount = {};
        switch (type) {
                case BookingHeaderConstants.DISCOUNT_TYPES.AVIOS:
                    discount = this.createAviosDiscount( modelDiscount );
                    break;
                case BookingHeaderConstants.DISCOUNT_TYPES.VOUCHER:
                    discount = this.createVoucherDiscount( modelDiscount, totalPrice );
                    break;
                case BookingHeaderConstants.DISCOUNT_TYPES.DUMBO:
                    discount = this.createPartnerDiscount( modelDiscount, totalPrice );
                    break;
                case BookingHeaderConstants.DISCOUNT_TYPES.PLUTO:
                    discount = this.createPartnerDiscount( modelDiscount, totalPrice );
                    break;
                case BookingHeaderConstants.DISCOUNT_TYPES.PARTNER:
                    discount = this.createPartnerDiscount( modelDiscount, totalPrice );
                    break;
                case BookingHeaderConstants.DISCOUNT_TYPES.CORPORATE:
                    discount = this.createCorporateDiscount( modelDiscount, totalPrice );
                    break;
                case BookingHeaderConstants.DISCOUNT_TYPES.DYNAMIC_PRICING:
                    discount = this.createDynamicDiscount( modelDiscount, totalPrice );
                    break;
                default:
                    discount = this.createVoucherDiscount( modelDiscount, null );
                    break;
        }
        return discount;
    }

    public createAviosDiscount (modelDiscount) {
        return {
            formattedElement: modelDiscount.formatedAvios,
            type: BookingHeaderConstants.DISCOUNT_TYPES.AVIOS,
            discountFormatted: modelDiscount.discount,
            description:modelDiscount.description || this.TranslateService.instant( BookingHeaderConstants.DISCOUNT_TYPES.AVIOS ),
            discount: modelDiscount.originalDiscount,
            totalDiscount: modelDiscount.originalDiscount
        };
    }

    public createVoucherDiscount ( modelDiscount, totalPrice ) {
        return {
            discountFormatted: modelDiscount.discount,
            discount: modelDiscount.originalDiscount || totalPrice,
            description: this.TranslateService.instant( 'BONUS_CARD_GIFT_TEXT' ),
            type: BookingHeaderConstants.DISCOUNT_TYPES.VOUCHER,
            totalDiscount: modelDiscount.originalDiscount
        };
    }
    public createDynamicDiscount ( modelDiscount, totalPrice ) {
        return {
            discountFormatted: modelDiscount.totalDiscount,
            discount: modelDiscount.totalDiscount || totalPrice,
            description:modelDiscount.description ||this.TranslateService.instant( BookingHeaderConstants.DISCOUNT_TYPES.DYNAMIC_PRICING ),
            type: BookingHeaderConstants.DISCOUNT_TYPES.DYNAMIC_PRICING,
            totalDiscount: modelDiscount.originalDiscount
        };
    }

    public createPartnerDiscount ( modelDiscount, totalPrice ) {
        return {
            discountFormatted: modelDiscount.discount,
            discount: modelDiscount.originalDiscount || totalPrice,
            description:modelDiscount.description,
            type: BookingHeaderConstants.DISCOUNT_TYPES.PARTNER,
            totalDiscount: modelDiscount.originalDiscount
        };
    }

    public createCorporateDiscount ( modelDiscount, totalPrice ) {
        return {
            discountFormatted: modelDiscount.discount,
            discount: modelDiscount.originalDiscount || totalPrice,
            description:modelDiscount.description || this.TranslateService.instant( BookingHeaderConstants.DISCOUNT_TYPES.CORPORATE ),
            type: BookingHeaderConstants.DISCOUNT_TYPES.CORPORATE,
            totalDiscount: modelDiscount.originalDiscount
        };
    }

    public deleteDiscount ( modelDiscount, discountType ) {
        let appliedDiscounts;
        if ( discountType ) {
            if ( this.IbCheckPartnersDiscountsService.isDiscountTypePartnerEquivalent( discountType ) ) {
                discountType = BookingHeaderConstants.DISCOUNT_TYPES.PARTNER;
            }
            if ( modelDiscount.discounts[ discountType ] ) {
                modelDiscount.total -= modelDiscount.discounts[ discountType ].discount;
            }
            delete modelDiscount.discounts[ discountType ];
        } else {
            appliedDiscounts = Object.keys( modelDiscount.discounts );
            appliedDiscounts.forEach( ( discountKey ) => {
                delete modelDiscount.discounts[ discountKey ];
            });
            modelDiscount.hasDiscounts = false;
            modelDiscount.total = 0;
        }
    }
}
