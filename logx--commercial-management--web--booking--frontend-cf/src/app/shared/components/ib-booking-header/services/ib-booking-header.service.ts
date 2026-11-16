import { Injectable } from '@angular/core';
import { BookingHeaderGreyBarTransformerService } from './transformers/ib-booking-header-grey-bar-transformer.service';
import { BookingHeaderStepsTransformerService } from './transformers/ib-booking-header-steps-transformer.service';
import { ShoppingBasketViewModelService } from '../components/ib-booking-header-basket/shared/services/ib-booking-header-basket-view-model.service';
import { IbBookingHeaderTransformerService } from './transformers/ib-booking-header-transformer.service';
import type { HeaderDataType, ShoppingBasketDiscountObjectType, ShoppingBasketType, HeaderDataHeaderModel } from '@src/app/core/models/ib-booking-availability/header-model';
import type { Discount, OriginalPriceClass } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';

@Injectable({
    providedIn: 'root'
})
export class IbBookingHeaderService {
    constructor (
        private IbBookingHeaderTransformerService: IbBookingHeaderTransformerService,
        private BookingHeaderGreyBarTransformerService: BookingHeaderGreyBarTransformerService,
        private BookingHeaderStepsTransformerService: BookingHeaderStepsTransformerService,
        private ShoppingBasketViewModelService: ShoppingBasketViewModelService
    ) { }


    public initHeader ( headerModel, stepsModel, greyBarModel ): HeaderDataType {
        const model: HeaderDataType = {
            headerModel: this.IbBookingHeaderTransformerService.initHeader( headerModel ),
            greyBarModel: this.BookingHeaderGreyBarTransformerService.initGreyBar( greyBarModel ),
            stepsModel: this.BookingHeaderStepsTransformerService.initSteps( stepsModel )
        };

        return model;
    }

    public initHeaderModel ( headerModel ) {
        return this.IbBookingHeaderTransformerService.initHeader( headerModel );
    }

    public updateBasketDiscountsNew ( headerModel: HeaderDataHeaderModel, discountData: Discount, originalPrice:OriginalPriceClass, totalDiscounts:number, totalPriceWithDiscounts:number ) {
        return this.IbBookingHeaderTransformerService.updateBasketDiscountsNew( headerModel.shoppingBasket, discountData, originalPrice, totalDiscounts, totalPriceWithDiscounts );
    }

    public addDiscountToBasket ( headerModel, discountData ) {
        const updatedBasket = this.IbBookingHeaderTransformerService.addDiscountToBasket( headerModel.shoppingBasket, discountData );
        return updatedBasket;
    }

    public deleteDiscountFromBasket ( headerModel, discountType ) {
        const updatedBasket = this.IbBookingHeaderTransformerService.deleteDiscountFromBasket( headerModel.shoppingBasket, discountType );
        return updatedBasket;
    }

    public updateBasketDiscounts ( headerModel, discountType, modelDiscount ) {
        const modelDiscountUpdated = this.IbBookingHeaderTransformerService.updateBasketDiscounts( headerModel.shoppingBasket, discountType, modelDiscount );
        return modelDiscountUpdated;
    }

    public addSimpleDiscount ( shoppingBasket: ShoppingBasketType, discountData: ShoppingBasketDiscountObjectType ): ShoppingBasketType {
        const modelDiscountUpdated = this.IbBookingHeaderTransformerService.addSimpleDiscount( shoppingBasket, discountData );
        return modelDiscountUpdated;
    }

    public updateBasketOthers ( headerModel, othersType, feeInfo ) {
        this.ShoppingBasketViewModelService.updateOthersFee( headerModel, othersType, feeInfo );
    }

    public updateBasketFlexibilization ( headerModel, flexInfo ) {
        this.ShoppingBasketViewModelService.updateFlexibilization( headerModel, flexInfo );
    }

    public updateBasketUpgrading ( headerModel, upgrading ) {
        this.ShoppingBasketViewModelService.updateUpgrading( headerModel, upgrading );
    }

    public updatePendingPaymentItems ( headerModel, seats, upgrading ) {
        this.ShoppingBasketViewModelService.updatePendingPaymentItems( headerModel, seats, upgrading );
    }

    public updateBasketPriority ( headerModel, priorityInfo ) {
        this.ShoppingBasketViewModelService.updateBasketPriority( headerModel, priorityInfo );
    }

    public dataUserLogin ( loginData ) {
        return {
            name: loginData.personalInfo.name || loginData.personalInfo.contactEmail,
            surname: loginData.personalInfo.surname1,
            avios: loginData.generalInfo.avios || null
        };
    }
    public updateLoggedData ( loggedData ) {
        return this.BookingHeaderGreyBarTransformerService.updateLoggedData( loggedData );
    }
    public deleteInsuranceFromBasket ( shoppingBasket: ShoppingBasketType ) {
        return this.IbBookingHeaderTransformerService.deleteInsuranceFromBasket( shoppingBasket );
    }
    public deleteGlobickTransfersFromBasket ( shoppingBasket: ShoppingBasketType ) {
        return this.IbBookingHeaderTransformerService.deleteGlobickTransfersFromBasket( shoppingBasket );
    }
    public deleteAssistCardFromBasket ( shoppingBasket: ShoppingBasketType ) {
        return this.IbBookingHeaderTransformerService.deleteAssistCardFromBasket( shoppingBasket );
    }
}
