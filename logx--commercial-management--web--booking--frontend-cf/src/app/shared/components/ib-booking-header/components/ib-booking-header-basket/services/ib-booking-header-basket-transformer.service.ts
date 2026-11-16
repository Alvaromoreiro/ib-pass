import { Inject, Injectable } from '@angular/core';
import { BookingHeaderConstants } from '../../../ib-booking-header-constants';
import { AJSCurrencyService, AJSRootScope, CommonsRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { HeaderDataHeaderModel, HeaderDataType, ShoppingBasketTotal, ShoppingBasketTrip, ShoppingBasketTripPassenger, ShoppingBasketTripsType } from '@src/app/core/models/ib-booking-availability/header-model';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { IbBookingHeaderTransformerService } from '../../../services/transformers/ib-booking-header-transformer.service';
import { OrderData, Slice, OrderItem, Passenger } from '@src/app/core/models/ib-booking-passenger-info/ib-booking-passenger-info-model';
dayjs.extend( localizedFormat );
@Injectable({ providedIn: 'root' })
export class IbBasketTransformerService {
    constructor (
        @Inject( AJSCurrencyService ) private CurrencyService: CurrencyService,
        @Inject( AJSRootScope ) private rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private TranslateService: TranslateService,
        private IbBookingHeaderTransformerService: IbBookingHeaderTransformerService

    ) {}

    public checkFreeSeats = ( seats ) => {
        let paymentPassenger = [],
            freePassenger = [],
            totalAmountPaymentPassenger = 0,
            totalAmountFreePassenger = 0;
        const seatsTemp = Object.assign( {}, seats );
        const headerModel: HeaderDataType = this.CommonsSessionStorageService.get( 'headerModel' );
        const header: HeaderDataHeaderModel = headerModel.headerModel;
        Object.assign(seatsTemp, seats);
        seatsTemp.segments.forEach( ( segment ) => {
            segment.seats.forEach( ( segmentSeat ) => {
                ( paymentPassenger = [] ), ( freePassenger = [] );
                totalAmountPaymentPassenger = 0;
                segmentSeat.passengers.forEach( ( passenger ) => {
                    if (passenger.amount === 0) {
                        freePassenger.push( passenger );
                    } else {
                        paymentPassenger.push( passenger );
                    }
                });
                freePassenger.forEach( ( dataFreePassenger ) => {
                    dataFreePassenger.amountFormatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, dataFreePassenger.amount, true, null );
                    totalAmountFreePassenger = dataFreePassenger.amountFormatted;
                });
                paymentPassenger.forEach( ( dataPaymentPassenger ) => {
                    dataPaymentPassenger.amountFormatted =
                        this.CurrencyService.formatPrice( header.shoppingBasket.currency, dataPaymentPassenger.amount, true, null );
                    totalAmountPaymentPassenger += totalAmountPaymentPassenger + dataPaymentPassenger.amount;
                });
                segmentSeat.freePassenger = freePassenger;
                segmentSeat.totalAmountFreePassenger = this.CurrencyService.formatPrice( header.shoppingBasket.currency, totalAmountFreePassenger, true, null );
                segmentSeat.paymentPassenger = paymentPassenger;
                segmentSeat.totalAmountPaymentPassenger = this.CurrencyService.formatPrice( header.shoppingBasket.currency, totalAmountPaymentPassenger, true, null );
            });
        });
        return seatsTemp;
    };
    /**
     * Delete Trips and Update Basket in Availability
     *
     **/
    public deleteTripsCartFromDispo = (): ShoppingBasketTripsType => {
        const headerModel: HeaderDataType =
            this.CommonsSessionStorageService.get('headerModel');
        const header: HeaderDataHeaderModel = headerModel.headerModel;
        const tripsInfo: ShoppingBasketTripsType = {
            trips: [] as ShoppingBasketTrip[],
            total: {} as ShoppingBasketTotal
        };
        tripsInfo.total.totalPrice = 0;
        tripsInfo.total.original = 0;
        tripsInfo.total.formatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, tripsInfo.total.totalPrice, true, null );
        return tripsInfo;
    };

    /**
     * Transform Data for Basket in Availability
     * @param {*} offerSelected
     * @param {*} model
     **/
    public transformTripsCartFromDispo = ( offerSelected, model ): ShoppingBasketTripsType => {
        const headerModel: HeaderDataType = this.CommonsSessionStorageService.get('headerModel');
        const header: HeaderDataHeaderModel = headerModel.headerModel;
        let capitalizeDate,
            discountsAppliedBasket: boolean = false,
            segment: any = {},
            passengers = [],
            segments: any[] = [],
            segmentSlice: any = {},
            scales = false,
            tripsInfo: ShoppingBasketTripsType = {
                trips: [] as ShoppingBasketTrip[],
                total: {} as ShoppingBasketTotal
            };

        model.availabilityData.originDestinations.forEach( ( slice ) => {
            segmentSlice.origin =  cloneDeep( slice.originCity );
            segmentSlice.destination =  cloneDeep( slice.destinationCity );
            segmentSlice.segments = [];
            model.selectedSlices.forEach( ( slice ) => {
                if ( slice.info.departureDateTime && slice.destination === segmentSlice.destination.code ) {
                    segment.date = dayjs(slice.info.departureDateTime).format('dddd DD MMM YYYY / HH:mm');
                    capitalizeDate = segment.date[0].toUpperCase() + segment.date.slice(1);
                    segmentSlice.date = capitalizeDate;
                }
            });
            segments.push( cloneDeep( segmentSlice ) );
        });

        if ( offerSelected?.discountsApplied?.discounts?.length > 0 && offerSelected?.discountsApplied?.originalOfferItems?.length > 0 ) {
            this.generatePassengerModel( offerSelected.discountsApplied.originalOfferItems, passengers );
            discountsAppliedBasket = true;
        } else {
            this.generatePassengerModel( offerSelected.offerItems, passengers );
        }

        if ( offerSelected?.price?.ticketingFee ) {
            tripsInfo.ticketingFee = offerSelected.price.ticketingFee;
            tripsInfo.ticketingFeeFormatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, tripsInfo.ticketingFee, true, null );
            tripsInfo.total.totalPrice = discountsAppliedBasket ? offerSelected.discountsApplied.originalPrice.total - tripsInfo.ticketingFee : offerSelected.price.total - tripsInfo.ticketingFee;
            tripsInfo.total.formatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, tripsInfo.total.totalPrice, true, null);
        } else {
            tripsInfo.total.totalPrice = discountsAppliedBasket ? offerSelected.discountsApplied.originalPrice.total : offerSelected.price.total;
            tripsInfo.total.formatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, tripsInfo.total.totalPrice, true, null );
        }
        tripsInfo.total.original = discountsAppliedBasket ? offerSelected.discountsApplied.originalPrice.total : offerSelected.price.total;
        tripsInfo.trips.push({
            scales: scales,
            segments: cloneDeep( segments ),
            passengers: cloneDeep( passengers )
        });
        return tripsInfo;
    };

    /** Generate Passenger Model
    * @param {*} passengerData
    * @param {*} passengers
    **/
    public generatePassengerModel = ( passengerData, passengers ) => {
        passengerData.forEach( ( offerItem ) => {
            const passengerId = offerItem?.passengerIds?.[0] ?? offerItem.passengerId;
            switch ( passengerId.substring( 0, passengerId.length - 3 ) ) {
                    case BookingHeaderConstants.PASSENGER_TYPE.SENIOR:
                        passengers.push( this.createPassenger( BookingHeaderConstants.PASSENGER_TYPE.SENIOR, offerItem ) );
                        break;
                    case BookingHeaderConstants.PASSENGER_TYPE.ADULT:
                        passengers.push( this.createPassenger( BookingHeaderConstants.PASSENGER_TYPE.ADULT, offerItem ) );
                        break;
                    case BookingHeaderConstants.PASSENGER_TYPE.YOUTH:
                        passengers.push( this.createPassenger( BookingHeaderConstants.PASSENGER_TYPE.YOUTH, offerItem ) );
                        break;
                    case BookingHeaderConstants.PASSENGER_TYPE.YOUNG_ADULT:
                        passengers.push( this.createPassenger( BookingHeaderConstants.PASSENGER_TYPE.TEENAGER, offerItem ) );
                        break;
                    case BookingHeaderConstants.PASSENGER_TYPE.CHILD:
                        passengers.push( this.createPassenger( BookingHeaderConstants.PASSENGER_TYPE.CHILD, offerItem ) );
                        break;
                    case BookingHeaderConstants.PASSENGER_TYPE.INFANT:
                        passengers.push( this.createPassenger( BookingHeaderConstants.PASSENGER_TYPE.INFANT, offerItem ) );
                        break;
                    default:
                        passengers.push( this.createPassenger( BookingHeaderConstants.PASSENGER_TYPE.ADULT, offerItem ) );
                        break;
            }
        });
    };

    /**
         Return a Passenger object
        * @param {*} passengerType
        * @param {*} offerItem
    **/

    public createPassenger = ( passengerType, offerItem ): ShoppingBasketTripPassenger => {
        const headerModel: HeaderDataType = this.CommonsSessionStorageService.get('headerModel');
        const header: HeaderDataHeaderModel = headerModel.headerModel;
        const passenger: ShoppingBasketTripPassenger = <ShoppingBasketTripPassenger>{};
        passenger.quantity = offerItem?.passengerIds || offerItem?.passengerIds === 0 ? offerItem?.passengerIds.length: offerItem?.passengerId.length;
        passenger.type = passengerType;
        passenger.description = passenger.quantity > 1 ? this.TranslateService.instant( 'SOME_' + passengerType ) : this.TranslateService.instant( passengerType );
        passenger.perPassengerPrice = this.CurrencyService.formatPrice( header.shoppingBasket.currency, offerItem.price.fare * passenger.quantity, true, null );
        passenger.taxes = this.CurrencyService.formatPrice( header.shoppingBasket.currency, offerItem.price.tax * passenger.quantity, true, null );
        return passenger;
    };

    public transformTripsCart = ( fareInfo, infoAvios: any ) => {
        const headerModel: HeaderDataType = this.CommonsSessionStorageService.get('headerModel');
        const header: HeaderDataHeaderModel = headerModel.headerModel;
        let capitalizeDate,
            segment: any = {},
            discountsAppliedBasket = false,
            passenger: any = {},
            passengers: any[] = [],
            segments: any[] = [],
            segmentSlice:any = {},
            tax: any,
            scales = false,
            offerItemsTemp: any,
            fareData = fareInfo || this.CommonsSessionStorageService.get( 'fareData' ),
            currency: any = {},
            tripsInfo: ShoppingBasketTripsType = {
                trips: [] as ShoppingBasketTrip[],
                total: {} as ShoppingBasketTotal
            };

        const createPassengerAvios = ( passengerType ) => {
            passenger.quantity = infoAvios.summaryInfo.passengers.generalData[passengerType][0].number;
            passenger.type = passengerType;
            passenger.description = passenger.quantity > 1 ? this.TranslateService.instant('SOME_' + passengerType) : this.TranslateService.instant( passengerType );
            tax = infoAvios.summaryInfo.passengers.generalData[passengerType][0].totalTax;
            passenger.perPassengerPrice = this.CurrencyService.formatPrice( currency, infoAvios.summaryInfo.passengers.generalData[passengerType][0].fare * passenger.quantity, true, null);
            passenger.taxes = this.CurrencyService.formatPrice( currency, tax, true, null );
            passenger.parsedAviosFare = this.CurrencyService.formatAvios( '.', String( infoAvios.summaryInfo.passengers.generalData[passengerType][0].aviosFare *  passenger.quantity ) );
            tripsInfo.total.totalPrice = tripsInfo.total.totalPrice + infoAvios.summaryInfo.passengers.generalData[passengerType][0].fare * passenger.quantity;
            tripsInfo.total.formatted = this.CurrencyService.formatPrice( currency, tripsInfo.total.totalPrice, true, null );

            // GTL-1095 Recalculate breakdown passengers
            let breakdownPassengers: any = this.CommonsSessionStorageService.get( 'breakdownPassengers' ),
                pricePerPax: any = {};

            if ( breakdownPassengers?.selectedRedeption ) {
                if (breakdownPassengers.selectedRedeption.pricePerPax) {
                    pricePerPax = breakdownPassengers.selectedRedeption.pricePerPax;
                } else if ( breakdownPassengers?.selectedRedeption?.discountedPrice?.pricePerPax ) {
                    pricePerPax = breakdownPassengers.selectedRedeption.discountedPrice.pricePerPax;
                } else if ( breakdownPassengers?.selectedRedeption?.basePrice?.pricePerPax ) {
                    pricePerPax = breakdownPassengers.selectedRedeption.basePrice.pricePerPax;
                }

                Object.values( pricePerPax ).forEach( ( price: any ) => {
                    if ( passengerType == price.paxType ) {
                        passenger.perPassengerPrice = this.CurrencyService.formatPrice( currency, price.cash.fare * passenger.quantity, true, null );
                        passenger.parsedAviosFare = this.CurrencyService.formatAvios( currency.groupingSeparator, String(price.points.fare * passenger.quantity) );
                    }
                });
            } else {
                passenger.perPassengerPrice = this.CurrencyService.formatPrice( currency, infoAvios.summaryInfo.passengers.generalData[passengerType][0].fare * passenger.quantity, true, null );
                passenger.parsedAviosFare = this.CurrencyService.formatAvios( currency.groupingSeparator, String( infoAvios.summaryInfo.passengers.generalData[passengerType][0].aviosFare * passenger.quantity ) );
            }

            passengers.push( cloneDeep( passenger ) );
        };

        // TODO: delete duplicate function and non working code
        // const createPassenger = (passengerType, offerItem) => {
        //     passenger.quantity = offerItem.passengerIds.length;
        //     passenger.type = passengerType;
        //     passenger.description = passenger.quantity > 1 ? this.TranslateService.instant('SOME_' + passengerType) : this.TranslateService.instant( passengerType );
        //     passenger.perPassengerPrice = this.CurrencyService.formatPrice( currency, offerItem.price.fare * passenger.quantity, true, null );
        //     passenger.taxes = this.CurrencyService.formatPrice( currency, offerItem.price.tax * passenger.quantity, true, null );
        //     passengers.push( cloneDeep( passenger ) );
        // };

        if ( fareData?.contextMetadata?.currencies[0] ) {
            currency = this.CurrencyService.getCurrencyObject( fareData.contextMetadata.currencies[0] );
        } else {
            currency = header.shoppingBasket.currency;
        }

        fareData.offers.forEach( ( offer ) => {
            if ( offer?.discountsApplied?.discounts?.length > 0 ) {
                discountsAppliedBasket = true;
            }
            if ( offer?.price?.ticketingFee ) {
                tripsInfo.ticketingFee = offer.price.ticketingFee;
                tripsInfo.ticketingFeeFormatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, tripsInfo.ticketingFee, true, null );
                tripsInfo.total.totalPrice = discountsAppliedBasket ? offer.discountsApplied.originalPrice.total - tripsInfo.ticketingFee : offer.price.total - tripsInfo.ticketingFee;
                tripsInfo.total.formatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, tripsInfo.total.totalPrice, true, null );
            } else {
                tripsInfo.total.totalPrice = discountsAppliedBasket ? offer.discountsApplied.originalPrice.total : offer.price.total;
                tripsInfo.total.formatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, tripsInfo.total.totalPrice, true, null );
            }
            tripsInfo.total.original = discountsAppliedBasket ? offer.discountsApplied.originalPrice.total : offer.price.total;
            offer.slices.forEach( ( slice ) => {
                segmentSlice.origin = cloneDeep( slice.segments[0].departure.city );
                segmentSlice.destination = cloneDeep( slice.segments[slice.segments.length - 1].arrival.city );
                if ( slice.departureDateTime ) {
                    segmentSlice.date = dayjs( slice.departureDateTime ).locale(this.rootScope.appLang).format('dddd DD MMM YYYY / HH:mm');
                    capitalizeDate = segmentSlice.date[0].toUpperCase() + segmentSlice.date.slice(1);
                    segmentSlice.date = capitalizeDate;
                }

                segmentSlice.segments = [];
                slice.segments.forEach( ( segmentInfo ) => {
                    segment.origin = segmentInfo.departure.city;
                    segment.destination = segmentInfo.arrival.city;
                    if (segmentInfo.departureDateTime) {
                        segment.date = dayjs(segmentInfo.departureDateTime).locale(this.rootScope.appLang).format('dddd DD MMM YYYY / HH:mm');
                        capitalizeDate = segmentSlice.date[0].toUpperCase() + segmentSlice.date.slice(1);
                        segmentSlice.date = capitalizeDate;
                    }
                    segmentSlice.segments.push( cloneDeep( segment ) );
                });
                segments.push( cloneDeep( segmentSlice ) );
            });
            if ( offer.redemptionOptions || (offer.promotion && infoAvios?.totalPrice?.price) ) {
                scales = true;
                if ( Object.keys( infoAvios ).length !== 0 )  {
                    passenger.parsedAviosFare = this.CurrencyService.formatAvios( '.', (tripsInfo.total.totalAvios = infoAvios.totalPrice.price.totalAvios ? infoAvios.totalPrice.price.totalAvios : infoAvios.totalPrice.price.totalPoints) );
                    tripsInfo.total.totalPrice = infoAvios.totalPrice.tax;
                    tripsInfo.total.formatted = this.CurrencyService.formatPrice( header.shoppingBasket.currency, tripsInfo.total.totalPrice, true, null );
                    if ( infoAvios.summaryInfo.passengers.generalData[BookingHeaderConstants.PASSENGER_TYPE.SENIOR] ) {
                        createPassengerAvios( BookingHeaderConstants.PASSENGER_TYPE.SENIOR );
                    }
                    if ( infoAvios.summaryInfo.passengers.generalData[BookingHeaderConstants.PASSENGER_TYPE.ADULT ] ) {
                        createPassengerAvios( BookingHeaderConstants.PASSENGER_TYPE.ADULT );
                    }
                    if ( infoAvios.summaryInfo.passengers.generalData[BookingHeaderConstants.PASSENGER_TYPE.CHILD ] ) {
                        createPassengerAvios( BookingHeaderConstants.PASSENGER_TYPE.CHILD );
                    }
                    if ( infoAvios.summaryInfo.passengers.generalData[BookingHeaderConstants.PASSENGER_TYPE.INFANT ] ) {
                        createPassengerAvios( BookingHeaderConstants.PASSENGER_TYPE.INFANT );
                    }
                    if ( infoAvios.summaryInfo.passengers.generalData[BookingHeaderConstants.PASSENGER_TYPE.YOUTH ] ) {
                        createPassengerAvios( BookingHeaderConstants.PASSENGER_TYPE.YOUTH );
                    }
                    if ( infoAvios.summaryInfo.passengers.generalData[BookingHeaderConstants.PASSENGER_TYPE.YOUNG_ADULT ] ) {
                        createPassengerAvios( BookingHeaderConstants.PASSENGER_TYPE.TEENAGER );
                    }
                }
            } else {
                if (offer.discountsApplied) {
                    offerItemsTemp = offer.discountsApplied.originalOfferItems;
                } else {
                    offerItemsTemp = offer.offerItems;
                }
                this.generatePassengerModel( offerItemsTemp, passengers );
            }
            tripsInfo.trips.push({
                scales: scales,
                segments: cloneDeep( segments ),
                passengers: cloneDeep( passengers )
            });
        });
        return tripsInfo;

    };

    //Update trips info from order
 
    private updateTripsTotalsFormFlightOrderItem = (tripsInfo: ShoppingBasketTripsType, flightOrderItem, ticketingFee: number, currency) :void => {
        const flightOrderItemPrice =  flightOrderItem.price;
        if ( flightOrderItemPrice?.total) {
            if(ticketingFee){
                tripsInfo.ticketingFee = ticketingFee;
                tripsInfo.ticketingFeeFormatted = this.CurrencyService.formatPrice(currency, ticketingFee, true, null );
                tripsInfo.total.totalPrice = flightOrderItemPrice.total - flightOrderItemPrice.ticketingFee;
                tripsInfo.total.original = flightOrderItemPrice?.total;
            } else{
                tripsInfo.total.totalPrice = flightOrderItemPrice.total;
                tripsInfo.total.original = tripsInfo.total.totalPrice;
            }
            tripsInfo.total.formatted = this.CurrencyService.formatPrice( currency, tripsInfo.total.totalPrice, true, null );
        }
    };


    private  updatePassengerTripInfoFromOrder = ( currentPassengers:ShoppingBasketTripPassenger[] = [], passengerPrices, orderPassengers: Passenger[], currency ): ShoppingBasketTripPassenger []  => {
        interface ShoppingBasketTripPassengerNumericPrices  {
            description: string;
            perPassengerPrice: number;
            quantity: number;
            taxes: number;
            type: string;
            namesList: string[];
            parsedAviosFare?: string[];
        }

    
        let typeAux: string = '';    
        const currentPassengersMap = new Map<string, ShoppingBasketTripPassenger>();
        currentPassengers.forEach( ( passenger ) => {
            currentPassengersMap.set( passenger.type, passenger );
        });
        const auxMap = new Map<string, ShoppingBasketTripPassengerNumericPrices>();

        passengerPrices.forEach( ( individualPrice ) => {
            typeAux = individualPrice.passengerId.split('_')[0];
            let passengerInfo: ShoppingBasketTripPassengerNumericPrices = auxMap.get( typeAux );
            if (!passengerInfo) {
                passengerInfo = {
                    ...currentPassengersMap.get( typeAux ),
                    type: typeAux,
                    description: '',
                    quantity: 0,
                    perPassengerPrice: 0,
                    taxes: 0,
                    namesList: []
                };
                auxMap.set( typeAux, passengerInfo);
            }
            passengerInfo.taxes += individualPrice.price.tax;
            passengerInfo.perPassengerPrice += individualPrice.price.fare;
            passengerInfo.quantity += 1;
            passengerInfo.description = passengerInfo.quantity > 1 ? this.TranslateService.instant( 'SOME_' + typeAux): this.TranslateService.instant(typeAux);
            
        });


        return Array.from(auxMap.keys()).map((type) => {
            const auxData = auxMap.get(type);
            return{
                ...auxData,
                perPassengerPrice: this.CurrencyService.formatPrice( currency, auxData.perPassengerPrice, true, null ),
                taxes: this.CurrencyService.formatPrice( currency, auxData.taxes, true, null ),
                namesList: orderPassengers?.reduce((list: string[], passenger: Passenger) => {
                    if (passenger?.externalPersonalInfo && passenger.passengerType === type) {
                        list.push(
                            `${passenger.externalPersonalInfo.name} ${passenger.externalPersonalInfo.firstSurname} ${passenger.externalPersonalInfo.lastSurname ?? ''}`.trim()
                        );
                    }
                    return list;
                }, [])
            };

        });
    };

    private updateTripsFromOrder = ({tripsInfo, orderSlices, flightOrderItem, orderPassengers, currency}: 
    {tripsInfo: ShoppingBasketTripsType, orderSlices: Slice[], flightOrderItem:OrderItem, orderPassengers: Passenger[], currency}) => {
        let capitalizeDate,
            segment: any = {},
            segments = [],
            segmentSlice: any = {};
        const trips = tripsInfo.trips.length > 0? tripsInfo.trips: [{}] as ShoppingBasketTrip[];

        tripsInfo.trips = trips.map( ( trip:ShoppingBasketTrip ) => {
            segments = [];
            orderSlices.forEach( ( slice, index ) => {
                segmentSlice.origin = cloneDeep( slice.segments[0].departure.city );
                segmentSlice.destination = cloneDeep( slice.segments[slice.segments.length - 1].arrival.city );
                if ( slice.departureDateTime ) {
                    segmentSlice.date = dayjs( slice.departureDateTime ).locale(this.rootScope.appLang).format('dddd DD MMM YYYY / HH:mm');
                    capitalizeDate = segmentSlice.date[0].toUpperCase() + segmentSlice.date.slice(1);
                    segmentSlice.date = capitalizeDate;
                }

                segmentSlice.segments = [];
                slice.segments.forEach( ( segmentInfo ) => {
                    segment.origin = segmentInfo.departure.city;
                    segment.destination = segmentInfo.arrival.city;
                    if ( segmentInfo.departureDateTime ) {
                        segment.date = dayjs( segmentInfo.departureDateTime ).locale(this.rootScope.appLang).format('dddd DD MMM YYYY / HH:mm');
                        capitalizeDate = segmentSlice.date[ 0 ].toUpperCase() + segmentSlice.date.slice( 1 );
                        segmentSlice.date = capitalizeDate;
                    }
                    segmentSlice.segments.push( cloneDeep( segment ) );
                });
                segments.push( cloneDeep( segmentSlice ) );
            });

            
            
            const passengerPrices = flightOrderItem?.passengerPrices ?? [];
            trip.passengers = this.updatePassengerTripInfoFromOrder( trip.passengers, passengerPrices, orderPassengers, currency );
            

            return{
                scales: trip.scales ?? false,
                segments: cloneDeep( segments ),
                passengers: cloneDeep( trip.passengers )
            };
        });
        
    };


    public transformTripsFromOrder = ( bookingInfo : OrderData) => {
        const headerModel: HeaderDataType = this.CommonsSessionStorageService.get('headerModel');
        const header: HeaderDataHeaderModel = headerModel.headerModel;
        const ticketingFee = bookingInfo?.order?.price?.ticketingFee ?? 0;
        const tripsInfo:ShoppingBasketTripsType = {...headerModel.headerModel.shoppingBasket.trips};
        const orderItems = bookingInfo.order.discountsApplied?.originalOrderItems ?? bookingInfo.order.orderItems ?? [];
        const flightOrderItem = orderItems.find((item) => item.type === 'flight');
        const orderSlices: Slice[] = bookingInfo.order.slices ?? [];
        const orderPassengers = bookingInfo.passengers ?? [];
        const currency = header.shoppingBasket.currency;
        
        if (ticketingFee) {
            tripsInfo.ticketingFee = ticketingFee;
            tripsInfo.ticketingFeeFormatted = this.CurrencyService.formatPrice( currency, true, null );
        }
        
        this.updateTripsTotalsFormFlightOrderItem( tripsInfo, flightOrderItem, ticketingFee, currency );
        this.updateTripsFromOrder( {tripsInfo : tripsInfo, orderSlices, flightOrderItem, orderPassengers, currency} );
        return tripsInfo;

    };
}
