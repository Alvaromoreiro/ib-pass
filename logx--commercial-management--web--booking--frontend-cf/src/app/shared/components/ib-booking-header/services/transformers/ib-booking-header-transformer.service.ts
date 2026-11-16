import { Injectable, Inject } from '@angular/core';
import { IbCheckPartnersDiscountsService } from '@shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { AJSCurrencyService } from 'ib-web-commons/utils';
import { IbBookingHeaderBasketDiscountsViewModelService } from '../../components/ib-booking-header-basket/shared/services/ib-booking-header-basket-discounts-view-model.service';
import { ShoppingBasketViewModelService } from '../../components/ib-booking-header-basket/shared/services/ib-booking-header-basket-view-model.service';
import { OthersFeesViewModelService } from '../../components/ib-booking-header-basket/shared/services/ib-booking-header-other-fees-view-model.service';
import dayjs from 'dayjs';
import { BookingHeaderConstants } from '../../ib-booking-header-constants';
import { HeaderDataHeaderModel, HeaderStepsModelFlightType, ShoppingBasketDiscountObjectType, ShoppingBasketDiscountType, ShoppingBasketType } from '@src/app/core/models/ib-booking-availability/header-model';
import { Discount, OriginalPriceClass } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';

@Injectable({
    providedIn: 'root'
})
export class IbBookingHeaderTransformerService {
    constructor (
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService,
        private IbCheckPartnersDiscountsService: IbCheckPartnersDiscountsService,
        private IbBookingHeaderBasketDiscountsViewModelService: IbBookingHeaderBasketDiscountsViewModelService,
        private ShoppingBasketViewModelService: ShoppingBasketViewModelService,
        private OthersFeesViewModelService: OthersFeesViewModelService
    ) { }

    public initHeader ( model ):HeaderDataHeaderModel {
        const headerModel = this._createDefaultHeaderModel(model);

        if (!model) {
            return headerModel;
        }

        this._populateHeaderModelFromInput(headerModel, model);
    
        return headerModel;
    }

    /**
     * Creates the base structure of the HeaderDataHeaderModel with all default values.
     * @param model The input model (only used for the showBasket boolean).
     */
    private _createDefaultHeaderModel (model: any): HeaderDataHeaderModel {
        const showBasket = model?.showBasket === true;
        return {
            flightType: '',
            redemption: '',
            trips: [],
            isMultiflight: false,
            hideFlightSearch: model?.hideFlightSearch ?? true,
            passengers: null,
            headerType: 'DEFAULT', 
            shoppingBasket: this._createDefaultShoppingBasket(showBasket) as ShoppingBasketType,
            showBasket: showBasket === true,
            showModalBackHome: false,
            currency: {} as Currency,
            showAdvancedSearch: true,
            advancedSearch: true
        } as HeaderDataHeaderModel;
    }

    private _createDefaultShoppingBasket (showBasket: boolean): ShoppingBasketType {
        return {
            baggages: {
                segments: [],
                hasBaggage: false
            },
            bundle: {
                info: {},
                hasBundle: false
            },
            seats: {
                segments: [],
                hasSeats: false
            },
            insurance: {
                info: null,
                hasInsurance: false
            },
            flexibilization: {
                info: null,
                hasFlexibilization: false
            },
            upgrading: {
                segments: [],
                hasUpgrading: false
            },
            speqs: {
                segments: [],
                hasSpeqs: false
            },
            priorityBoarding: {
                info: null,
                hasPriorityBoarding: false
            },
            carbonFootprint: {
                info: null,
                hasCarbonFootprint: false
            },
            globickTransfers: {
                info: null,
                hasTransfersGlobick: false
            },
            insuranceAllianzFusionInfo: {
                info: null,
                hasInsuranceAllianzFusion: false
            },
            petc: {
                segments: [],
                hasPetc: false
            },
            assistCard: {
                name: null,
                hasAssistCard: false
            },
            discountsModel: {},
            othersModel: {},
            segmentsInfo: [],
            showBasket: showBasket === true,
            currency: {},
            total: {
                formatted: '',
                totalPrice: 0
            } 
        } as ShoppingBasketType;
    }
        
    /**
    * Populates an existing headerModel with data from the input model.
    * @param headerModel The model to be mutated.
    * @param model The input model containing the data.
    */
    private _populateHeaderModelFromInput (headerModel: HeaderDataHeaderModel, model: any): void {
        let flightType: HeaderStepsModelFlightType;
        let originDestinationLocal: any;

        headerModel.redemption = model.redemption;
        headerModel.trips = [];
        headerModel.showModalBackHome = model.showModalBackHome || false;
        headerModel.currency = model.currency;
        headerModel.headerType = model.headerType || 'DEFAULT';

        if (model.flightType) {
            flightType = this.detectFlightType(model.flightType);
            originDestinationLocal = flightType.isMultiCity ? (Array.isArray(model.originDestination) ? model.originDestination[0] : model.originDestination) : model.originDestination;
            
            headerModel.flightType = flightType.flightType;
            headerModel.isMultiflight = flightType.isMultiCity;
            headerModel.passengers = {
                numberPassengers: originDestinationLocal.passengers,
                numAdults: originDestinationLocal.numAdults,
                numSeniors: originDestinationLocal.numSeniors,
                numYouth: originDestinationLocal.numYoung,
                numTeenager: originDestinationLocal.numTeenager,
                numChilds: originDestinationLocal.numChilds,
                numInfants: originDestinationLocal.numInfant
            };

            if (flightType.isMultiCity) {
                for (let i = 0; i < model.originDestination.length; ++i) {
                    headerModel.trips.push(this.createTripObject(model.originDestination[i]));
                }
                headerModel.passengers.numberPassengers = Array.isArray(model.originDestination) && model.originDestination[0] ? model.originDestination[0].passengers : model.originDestination.passengers;
            } else {
                headerModel.trips.push(this.createTripObject(model.originDestination));
            }
        }

        if (typeof model.showAdvancedSearch !== 'undefined') {
            headerModel.showAdvancedSearch = model.showAdvancedSearch;
        }

        headerModel.shoppingBasket.discountsModel = model.shoppingBasket?.discountsModel || this.IbBookingHeaderBasketDiscountsViewModelService.getDiscountsViewModel();
        headerModel.shoppingBasket.othersModel = model.shoppingBasket?.othersModel || this.OthersFeesViewModelService.getOthersViewModel(model.currency || '');
        headerModel.shoppingBasket.currency = model.currency;

        if (model.shoppingBasket?.total) {
            headerModel.shoppingBasket.total = model.shoppingBasket.total;
        } else {
            headerModel.shoppingBasket.total = {
                formatted: this.CurrencyService.formatPrice(model.currency, 0, true, null),
                totalPrice: 0
            };
        }
    }

    /**
    /**
     * Create a trip object using the originDestination object
     * @param {Object} originDestination
     */
    public createTripObject ( originDestination ) {
        return {
            originCode: originDestination.originCity.code,
            originCity: originDestination.originCity.description,
            destinyCode: originDestination.destinationCity.code,
            destinyCity: originDestination.destinationCity.description,
            dateFlight: originDestination.dates.outboundFlight ? dayjs( originDestination.dates.outboundFlight ).format( 'DD/MM/YYYY' ) : null,
            returnFlight: originDestination.dates.returnFlight ? dayjs( originDestination.dates.returnFlight ).format( 'DD/MM/YYYY' ) : null,
            passengers: originDestination.passengers,
            tripType: ( originDestination.tripType ?? ( ( originDestination?.dates?.returnFlight ) ? '2' : '1' ) )
        };
    }

    /**
     * Use the flightType for detect the current flow and create a speciall model if its need it
     * @param {string} flightType
     */
    public detectFlightType ( flightType ) {
        let flightTypeTransformed;
        switch ( flightType ) {
                case BookingHeaderConstants.HEADER_TYPE.MULTITRIP:
                    flightTypeTransformed = {
                        flightType: flightType,
                        isMultiCity: true
                    };
                    break;
                default:
                    flightTypeTransformed = {
                        flightType: flightType
                    };
                    break;
        }
        return flightTypeTransformed;
    }

    public addSteps ( stepsModel ) {
        let i:number = 0, founded = false;

        while ( !founded && i < stepsModel.steps.length ) {
            if ( stepsModel.steps[ i ].position === stepsModel.position ) {
                founded = true;
            } else
                ++i;
        }

        return {
            position: i >= stepsModel.steps.length ? 0 : stepsModel.steps[ i ].index,
            totalSteps: stepsModel.steps.length
        };

    }
    public addSimpleDiscount = ( shoppingBasket: ShoppingBasketType, discountData: ShoppingBasketDiscountObjectType): ShoppingBasketType => {
        const discountExists: boolean = discountData.type in shoppingBasket.discountsModel.discounts;
        const { type, description, discountFormatted, totalDiscount, discount } = discountData;
        // Si ya existe el mismo descuento, lo desactivamos para aplicar el nuevo recibido
        if ( discountExists ) {
            const currentDiscount= shoppingBasket.discountsModel.discounts[ type ] ;
            shoppingBasket.discountsModel.total -= currentDiscount.discount ?? currentDiscount.totalDiscount;
        }
        const newDiscount: ShoppingBasketDiscountObjectType = discountExists ? { ...shoppingBasket.discountsModel.discounts[ type ] } : <ShoppingBasketDiscountObjectType> {};
        const newBasket: ShoppingBasketType = { ...shoppingBasket };
        newDiscount.type = type;
        newDiscount.description = description;
        newDiscount.discountFormatted = discountFormatted;
        newDiscount.totalDiscount = totalDiscount;
        newDiscount.discount = discount;
        newBasket.discountsModel.discounts[ type ] = {...newDiscount};
        newBasket.discountsModel.discounts = {...newBasket.discountsModel.discounts};
        newBasket.discountsModel.hasDiscounts = true;
        newBasket.discountsModel.total = shoppingBasket.discountsModel.total + totalDiscount;
        newBasket.discountsModel.totalFormated = this.CurrencyService.formatPrice( shoppingBasket.currency, -newBasket.discountsModel.total, true, false );
        this.ShoppingBasketViewModelService.calculateAllBasket( newBasket );
        return newBasket;
    };
    
  
    /**
     * Updates the discounts applied to the given shopping basket, recalculating totals and formatting prices accordingly.
     *
     * This method handles the addition or update of a discount in the shopping basket, recalculates the total discounts,
     * updates the original and discounted total prices, and formats the price values for display. If no discount data or
     * original price is provided, it resets the discounts model and restores the original total price.
     *
     * @param shoppingBasket - The current shopping basket object to update.
     * @param discountData - The discount information to apply or update in the basket.
     * @param originalPrice - The original price details before discounts are applied.
     * @param totalDiscounts - The total value of all discounts to be applied.
     * @param totalPriceWithDiscounts - The final total price after applying discounts.
     * @returns The updated shopping basket with recalculated discounts and totals.
     */
    public updateBasketDiscountsNew = ( shoppingBasket :ShoppingBasketType, discountData:Discount, originalPrice:OriginalPriceClass, totalDiscounts:number, totalPriceWithDiscounts:number ): ShoppingBasketType => {
        if ( discountData && originalPrice?.total ) {
            if ( this.IbCheckPartnersDiscountsService.isDiscountTypePartnerEquivalent( discountData.type ) ) {
                discountData.type = BookingHeaderConstants.DISCOUNT_TYPES.PARTNER;
            }
            if ( shoppingBasket.discountsModel.discounts[ discountData.type ]
                && shoppingBasket.discountsModel.discounts[ discountData.type ].type === discountData.type ) {
                shoppingBasket.discountsModel.total = totalDiscounts ? totalDiscounts : shoppingBasket.discountsModel.total - shoppingBasket.discountsModel.discounts[ discountData.type ].totalDiscount;
            } else {
                shoppingBasket.discountsModel.discounts[ discountData.type ] = discountData;
            }
            if ( totalDiscounts ) {
                shoppingBasket.discountsModel.total = totalDiscounts;
            } else {
                shoppingBasket.discountsModel.total += shoppingBasket.discountsModel.discounts[ discountData.type ].totalDiscount;
            }
            shoppingBasket.discountsModel.hasDiscounts = true;
            shoppingBasket.total.original = originalPrice.total;
            shoppingBasket.discountsModel.discounts[ discountData.type ].discountFormatted = this.CurrencyService.formatPrice( shoppingBasket.currency, discountData.totalDiscount, true, null );
            shoppingBasket.discountsModel.totalFormated = this.CurrencyService.formatPrice( shoppingBasket.currency, -shoppingBasket.discountsModel.total, true, null );
            shoppingBasket.total.totalPrice = totalPriceWithDiscounts;
            shoppingBasket.total.formatted = this.CurrencyService.formatPrice( shoppingBasket.currency, totalPriceWithDiscounts, true, null );
            shoppingBasket.discountsModel.discounts = Object.assign({}, shoppingBasket.discountsModel.discounts);
        } else {
            shoppingBasket.discountsModel ={
                discounts : {} as ShoppingBasketDiscountType,
                hasDiscounts: false,
                total: 0,
                totalFormated: this.CurrencyService.formatPrice( shoppingBasket.currency, -shoppingBasket.discountsModel.total, true, null )
            };
            shoppingBasket.total.totalPrice = shoppingBasket.total.original;
            shoppingBasket.total.formatted = this.CurrencyService.formatPrice( shoppingBasket.currency, shoppingBasket.total.original, true );
        }

        this.ShoppingBasketViewModelService.calculateAllBasket( shoppingBasket );
        return shoppingBasket;
    };

    public addDiscountToBasket = ( shoppingBasket, discountData ): ShoppingBasketType => {
        let existentDiscount = false;
        try {
            existentDiscount = ( typeof ( shoppingBasket.discountsModel.discounts[ discountData.type ] ) === 'object' );
        } catch (e) {
            existentDiscount = false;
        }
        if ( this.IbCheckPartnersDiscountsService.isDiscountTypePartnerEquivalent( discountData.type ) ) {
            discountData.type = BookingHeaderConstants.DISCOUNT_TYPES.PARTNER;
        }
        if ( existentDiscount ) {
            shoppingBasket.discountsModel.total -= shoppingBasket.discountsModel.discounts[ discountData.type ].totalDiscount ? shoppingBasket.discountsModel.discounts[ discountData.type ].totalDiscount : shoppingBasket.discountsModel.discounts[ discountData.type ].originalDiscount;
        }
        shoppingBasket.discountsModel.discounts[ discountData.type ] = discountData;
        shoppingBasket.discountsModel.discounts[ discountData.type ].discountFormatted = this.CurrencyService.formatPrice( shoppingBasket.currency, discountData.totalDiscount, true, null );
        shoppingBasket.discountsModel.total += shoppingBasket.discountsModel.discounts[ discountData.type ].totalDiscount ? shoppingBasket.discountsModel.discounts[ discountData.type ].totalDiscount : shoppingBasket.discountsModel.discounts[ discountData.type ].originalDiscount;
        shoppingBasket.discountsModel.totalFormated = this.CurrencyService.formatPrice( shoppingBasket.currency, -shoppingBasket.discountsModel.total, true, null );
        shoppingBasket.discountsModel.discounts = Object.assign({}, shoppingBasket.discountsModel.discounts);

        shoppingBasket.discountsModel.hasDiscounts = true;
        this.ShoppingBasketViewModelService.calculateAllBasket( shoppingBasket );
        return shoppingBasket;
    };

    public deleteDiscountFromBasket = ( shoppingBasket, discountType ): ShoppingBasketType => { 
        let existentDiscount = false;
        try {
            existentDiscount = ( typeof ( shoppingBasket.discountsModel.discounts[ discountType ] ) === 'object' );
        } catch (e) {
            existentDiscount = false;
        }
        if ( this.IbCheckPartnersDiscountsService.isDiscountTypePartnerEquivalent( discountType ) ) {
            discountType = BookingHeaderConstants.DISCOUNT_TYPES.PARTNER;
        }
        if ( existentDiscount ) {
            shoppingBasket.discountsModel.total -= shoppingBasket.discountsModel.discounts[ discountType ].totalDiscount ? shoppingBasket.discountsModel.discounts[ discountType ].totalDiscount : shoppingBasket.discountsModel.discounts[ discountType ].originalDiscount;
            shoppingBasket.discountsModel.totalFormated = this.CurrencyService.formatPrice( shoppingBasket.currency, -shoppingBasket.discountsModel.total, true, null );
            delete shoppingBasket.discountsModel.discounts[ discountType ];
            shoppingBasket.discountsModel.discounts = Object.assign({}, shoppingBasket.discountsModel.discounts);
        }
        if ( !shoppingBasket.discountsModel.discounts || !(Object.keys( shoppingBasket.discountsModel.discounts ).length > 0) ) {
            shoppingBasket.discountsModel.hasDiscounts = false;
        }
        this.ShoppingBasketViewModelService.calculateAllBasket( shoppingBasket );
        return shoppingBasket;
    };

    public updateBasketDiscounts  = ( shoppingBasket, discountType, modelDiscount ): ShoppingBasketType => {
        let auxShoppingBasket = shoppingBasket;
        if ( discountType && modelDiscount ) {
            const transformedModel =  this.IbBookingHeaderBasketDiscountsViewModelService.getDiscountModel( modelDiscount, discountType);
            auxShoppingBasket = this.addDiscountToBasket(shoppingBasket, transformedModel);
        } else if (discountType) {
            auxShoppingBasket=this.deleteDiscountFromBasket(shoppingBasket, discountType);
        } else {
            const keys = Object.keys(shoppingBasket?.discountsModel?.discounts ?? []);
            keys.forEach((k) =>{ auxShoppingBasket = this.deleteDiscountFromBasket(shoppingBasket, k); });
        }

        this.ShoppingBasketViewModelService.calculateAllBasket( auxShoppingBasket );

        return auxShoppingBasket;
    };

    public deleteInsuranceFromBasket = ( shoppingBasket: ShoppingBasketType ): ShoppingBasketType => {
        if ( !shoppingBasket.insurance.hasInsurance  && !shoppingBasket.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion)  return shoppingBasket;
        shoppingBasket.insurance.hasInsurance = false;
        shoppingBasket.insurance.info = null;
        shoppingBasket.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion = false;
        shoppingBasket.insuranceAllianzFusionInfo.info = null;
        this.ShoppingBasketViewModelService.calculateAllBasket( shoppingBasket );
        return shoppingBasket;
    };

    public deleteGlobickTransfersFromBasket = ( shoppingBasket: ShoppingBasketType ): ShoppingBasketType => {
        if ( !shoppingBasket.globickTransfers.hasTransfersGlobick ) return shoppingBasket;
        shoppingBasket.globickTransfers.hasTransfersGlobick = false;
        shoppingBasket.globickTransfers.info = null;
        this.ShoppingBasketViewModelService.calculateAllBasket( shoppingBasket );
        return shoppingBasket;
    };

    public deleteAssistCardFromBasket = ( shoppingBasket: ShoppingBasketType ): ShoppingBasketType => {
        if ( !shoppingBasket.assistCard.hasAssistCard ) return shoppingBasket;
        shoppingBasket.assistCard.hasAssistCard = false;
        shoppingBasket.assistCard.name = null;
        this.ShoppingBasketViewModelService.calculateAllBasket( shoppingBasket );
        return shoppingBasket;
    };

  
}
