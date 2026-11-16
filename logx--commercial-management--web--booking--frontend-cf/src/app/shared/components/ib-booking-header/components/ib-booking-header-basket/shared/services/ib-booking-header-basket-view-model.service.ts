import { Inject, Injectable } from '@angular/core';
import { HeaderDataHeaderModel, ShoppingBasketType } from '@src/app/core/models/ib-booking-availability/header-model';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { OthersFeesViewModelService } from './ib-booking-header-other-fees-view-model.service';
import { IbBasketSectionTransformerService } from './ib-booking-header-basket-section-transformer.service';

@Injectable({providedIn: 'root'})
export class ShoppingBasketViewModelService {

    private ANCILLARY_LINE_ITEM_DEFINITIONS = [
        { check: 'baggages.hasBaggage', value: 'baggages.total.total' },
        { check: 'bundle.hasBundle', value: 'bundle.total.total' },
        { check: 'seats.hasSeats', value: 'seats.total.total' },
        { check: 'insurance.hasInsurance', value: 'insurance.total.total' },
        { check: 'upgrading.hasUpgrading', value: 'upgrading.total' },
        { check: 'speqs.hasSpeqs', value: 'speqs.total.total' },
        { check: 'flexibilization.hasFlexibilization', value: 'flexibilization.info.amount.price' },
        { check: 'priorityBoarding.hasPriorityBoarding', value: 'priorityBoarding.info.amount' },
        { check: 'carbonFootprint.hasCarbonFootprint', value: 'carbonFootprint.total.total' },
        { check: 'globickTransfers.hasTransfersGlobick', value: 'globickTransfers.total.total' },
        { check: 'insuranceAllianzFusionInfo.hasInsuranceAllianzFusion', value: 'insuranceAllianzFusionInfo.total.total' },
        { check: 'petc.hasPetc', value: 'petc.total.total' },
        { check: 'assistCard.hasAssistCard', value: 'assistCard.total.total' }
    ];

    constructor (
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService,
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private OthersFeesViewModelService: OthersFeesViewModelService,
        private IbBasketSectionTransformerService: IbBasketSectionTransformerService

    ) { }

    public updateOthersFee ( headerModel: HeaderDataHeaderModel, type, fee ) {
        let info: any = {};
        if ( headerModel ) {
            if ( fee ) {
                this.OthersFeesViewModelService.deleteInfo( headerModel.shoppingBasket.othersModel, type, headerModel.shoppingBasket.currency );
                info = this.OthersFeesViewModelService.getOtherInfo( fee, type, headerModel.shoppingBasket.currency );
                this.OthersFeesViewModelService.deleteInfo( headerModel.shoppingBasket.othersModel, info.type, headerModel.shoppingBasket.currency );
                if ( info.total >= 0 || info.total < 0 ) {
                    headerModel.shoppingBasket.othersModel.hasElements = true;
                    headerModel.shoppingBasket.othersModel.others.push( info );
                }
                this.OthersFeesViewModelService.updateInfo( headerModel.shoppingBasket.othersModel, headerModel.shoppingBasket.currency );
            } else {
                if ( type ) {
                    this.OthersFeesViewModelService.deleteInfo( headerModel.shoppingBasket.othersModel, type, headerModel.shoppingBasket.currency );
                    this.OthersFeesViewModelService.updateInfo( headerModel.shoppingBasket.othersModel, headerModel.shoppingBasket.currency );
                } else {
                    headerModel.shoppingBasket.othersModel = this.OthersFeesViewModelService.getOthersViewModel( headerModel.shoppingBasket.currency );
                }
            }
            if ( headerModel.shoppingBasket.othersModel.others.length === 0 ) headerModel.shoppingBasket.othersModel.hasElements = false;
            this.calculateAllBasket( headerModel.shoppingBasket );
        }
    }

    public updateFlexibilization ( headerModel, flexInfo ) {
        headerModel.shoppingBasket.flexibilization = this.IbBasketSectionTransformerService.setInfoAncillarie( flexInfo );
        this.calculateAllBasket( headerModel.shoppingBasket );
    }

    public updateBasketPriority ( headerModel, priorityInfo ) {
        headerModel.shoppingBasket.priorityBoarding = this.IbBasketSectionTransformerService.setPriorityInfoAncillarie( priorityInfo );
        this.calculateAllBasket( headerModel.shoppingBasket );
    }

    public updateUpgrading ( headerModel, upgrading ) {
        headerModel.shoppingBasket.upgrading = upgrading;
        this.calculateAllBasket( headerModel.shoppingBasket );
    }

    public updatePendingPaymentItems ( headerModel: HeaderDataHeaderModel, seats, upgrading ) {
        let i: number;
        for (i = 0; i < seats.length; i++) {
            headerModel.shoppingBasket.seats.segments.push( seats[ i ] );
        }
        if ( seats.length > 0 ) {
            headerModel.shoppingBasket.seats.hasSeats = true;
            headerModel.shoppingBasket.seats.total = this.calculateSubTotalSeats( headerModel.shoppingBasket.seats );
            headerModel.shoppingBasket.seats.total.totalFormatted = this.CurrencyService.formatPrice( headerModel.shoppingBasket.currency, headerModel.shoppingBasket.seats.total.total, true );
        }
        if ( upgrading?.upgradingTrips?.length > 0 ) {
            headerModel.shoppingBasket.upgrading.hasUpgrading = true;
            headerModel.shoppingBasket.upgrading.total = upgrading.total;
            headerModel.shoppingBasket.upgrading.totalFormatted = this.CurrencyService.formatPrice( headerModel.shoppingBasket.currency, upgrading.total, true );
            headerModel.shoppingBasket.upgrading.segments = this.generateSegmentsUpgrading( upgrading.upgradingTrips );
        }
        this.rootScope.$broadcast( 'updatePendingItems' );
        this.calculateAllBasket( headerModel.shoppingBasket );
    }

    public generateSegmentsUpgrading ( upgradingTrips ) {
        const segments = [];
        upgradingTrips.forEach( ( segment ) => {
            segments.push( segment );
        });
        return segments;
    }

    public calculateSubTotalSeats ( seats ) {
        let subTotal: number = 0;
        seats.segments.forEach( ( segment ) => {
            subTotal += segment.total;
        });
        return { total: subTotal, totalFormatted: '' };
    }

    /**
     * Calculate total price of all ancillaries
     */
    public calculateAllBasket = (model: ShoppingBasketType) => {
        const newTotal = this._calculateBasketGrandTotal(model);

        this._broadcastBasketUpdates(model, newTotal);
    };
    public _calculateBasketGrandTotal (model: ShoppingBasketType): number {
        let total = this._calculateInitialTripsTotal(model);

        for (const ancillary of this.ANCILLARY_LINE_ITEM_DEFINITIONS) {
            if (this._getNestedProperty(model, ancillary.check)) {
                total += this._getNestedProperty(model, ancillary.value) || 0;
            }
        }

        if (model.othersModel.hasElements && !model.trips.ticketingFee) {
            total += model.othersModel.total.total;
        }
        if (model.discountsModel.hasDiscounts) {
            total -= model.discountsModel.total;
        }

        return this.preventMultipleDecimals(total);
    }
    private _getNestedProperty (obj: any, path: string): any {
        return path.split('.')
            .reduce((acc, part) => (acc ? acc[part] : undefined), obj);
    }
    private _calculateInitialTripsTotal (model: ShoppingBasketType): number {
        const actualPage = this.CommonsSessionStorageService.get('actualStepFlow');

        let total = model.trips ? model.trips?.total?.original : 0;
        if (model.trips && actualPage === 'ibpurc') {
            total = model.trips.total.original;
        }

        return total;
    }

    public _broadcastBasketUpdates (model: ShoppingBasketType, newTotal: number): void {
        model.total.original = newTotal;
        model.total.formatted = this.CurrencyService.formatPrice(model.currency, newTotal, true);
    
        this.rootScope.$broadcast('totalBasket', model.total.formatted);
        this.rootScope.$broadcast('updateHeaderBasket', model);
    }

    private preventMultipleDecimals = (price: number):number => {
        return parseFloat(price.toFixed(2));
    };

}
