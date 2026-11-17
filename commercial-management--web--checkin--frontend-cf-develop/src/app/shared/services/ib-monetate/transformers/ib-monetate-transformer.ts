import { MonetateConstantsType } from '../ib-monetate-constants';
import angular from 'angular';

@Service('ib-monetate-checkin-module', ['MonetateConstants', 'localStorageService', '$filter'], [])
export class MonetateTransformer {
    public currency = '';
    constructor (
        private monetateConstants: MonetateConstantsType,
        private localStorageService: ng.local.storage.ILocalStorageService,
        private $filter: ng.FilterFactory) {
    }

    private dateFormatted = (date) => {
        return date.replace(/-/g, '');
    };

    transformAncillariesInMonetateProductModel = (shoppingBasketAncillaries: CommonsSummaryInfoModels.AncillariesSummaryInfoModel | any): CommonsMonetateModels.CartProductDetails[] => {

        this.currency = this.localStorageService.get<any>('fareData')?.contextMetadata?.currencies[0]?.code || 'EUR';
        if (!shoppingBasketAncillaries) return;
        const baggageCollection = this.getBaggagesFromBasket(shoppingBasketAncillaries.baggages) || [],
            seatCollection = this.getSeatsFromBasket(shoppingBasketAncillaries.seats) || [],
            insuranceSelected = this.getInsurancesFromBasket(shoppingBasketAncillaries.insurance) || [],
            flexibilityCollection = this.getFlexibilityFromBasket(shoppingBasketAncillaries.flexibilization) || [],
            speqBaggageCollection = this.getSpeqBaggageFromBasket(shoppingBasketAncillaries.speqs) || [],
            priorityCollection = this.getPriorityFromBasket(shoppingBasketAncillaries.priority) || [];

        return [...baggageCollection, ...seatCollection, ...insuranceSelected, ...flexibilityCollection, ...speqBaggageCollection, ...priorityCollection];
    };


    getBaggageType = (type: string): string => {
        const defaultId = '',
            data = {
                BAGGAGE_15: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.BAGGAGE.EQUIPAJE_EXTRA_15,
                BAGGAGE_23: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.BAGGAGE.EQUIPAJE_EXTRA_23,
                BAGGAGE_32: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.BAGGAGE.EQUIPAJE_EXTRA_32
            };
        return data[type] || defaultId;
    };

    getSpecialBaggageType = (type: string): string => {
        const defaultId = '',
            data = {
                BICYCLE: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.BAGGAGE.EQUIPAJE_ESPECIAL_BIKE,
                SKI_SNOW: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.BAGGAGE.EQUIPAJE_ESPECIAL_SKIS,
                GOLF_EQUIPMENT: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.BAGGAGE.EQUIPAJE_ESPECIAL_GOLF
            };
        return data[type] || defaultId;
    };

    calculateMean = (price:number, quantity:number) => {

        let mean = price/quantity;
        return Math.round(mean * 100) / 100;

    };


    getBaggagesFromBasket = (baggageCollection: CommonsSummaryInfoModels.Baggages): CommonsMonetateModels.CartProductDetails[] => {
        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [];
        let monetateProduct: CommonsMonetateModels.CartProductDetails;

        if (baggageCollection && baggageCollection.segments && baggageCollection.segments.length > 0) {

            const bagOb: { type: string, totalQuantity: number, totalPrice: number }[] = [];

            baggageCollection.segments.forEach(segment => {

                segment.baggages.forEach(baggage => {

                    if(bagOb.some(e => e.type === baggage.type.subtype)){

                        bagOb.find(e => e.type === baggage.type.subtype).totalQuantity += baggage.quanty;
                        bagOb.find(e => e.type === baggage.type.subtype).totalPrice += baggage.total;

                    }else{

                        bagOb.push({type : baggage.type.subtype, totalQuantity: baggage.quanty, totalPrice : baggage.total});
                    }
                });
            });
            bagOb.forEach( (element) => {
                if(element.totalQuantity > 0){
                    monetateProduct = {
                        productId: this.getBaggageType(element.type),
                        unitPrice: this.calculateMean(element.totalPrice, element.totalQuantity).toString(),
                        quantity: element.totalQuantity.toString(),
                        currency: this.currency,
                        isAncillary: true
                    };
                    monetateProductCollection.push(monetateProduct);
                }
            });
        }
        return monetateProductCollection;
    };


    getSeatsFromBasket = (seatCollection: CommonsSummaryInfoModels.Seats): CommonsMonetateModels.CartProductDetails[] => {
        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [];
        let monetateProduct: CommonsMonetateModels.CartProductDetails;

        if (seatCollection && seatCollection.segments && seatCollection.segments.length > 0) {

            const seatOb: { type: string, totalQuantity: number, totalPrice: number }[] = [];

            seatCollection.segments.forEach(segment => {

                segment.seats.forEach(seat => {

                    if(seatOb.some(e => e.type === seat.type)){

                        seatOb.find(e => e.type === seat.type).totalQuantity += seat.quanty;
                        seatOb.find(e => e.type === seat.type).totalPrice += seat.amount;

                    }else{

                        seatOb.push({type : seat.type, totalQuantity: seat.quanty, totalPrice : seat.amount});
                    }
                });
            });

            seatOb.forEach( (element) => {

                if(element.totalQuantity > 0){
                    monetateProduct = {
                        productId: this.getMonetateSeatId(element.type),
                        unitPrice: this.calculateMean(element.totalPrice, element.totalQuantity).toString(),
                        quantity: element.totalQuantity.toString(),
                        currency: this.currency,
                        isAncillary: true
                    };
                    if (monetateProduct.productId !== '') {
                        monetateProductCollection.push(monetateProduct);
                    }

                }

            });
        }
        return monetateProductCollection;
    };

    getInsurancesFromBasket = (insuranceSelected: CommonsSummaryInfoModels.Insurance): CommonsMonetateModels.CartProductDetails[] => {
        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [];
        if (insuranceSelected) {

            let calcUnitPrice = insuranceSelected.total/Number(this.monetateConstants.DEFAULT_VALUES.ONE);

            const monetateProduct: CommonsMonetateModels.CartProductDetails = {
                productId: this.getMonetateInsuranceId(insuranceSelected.offer),
                unitPrice: calcUnitPrice.toString(),
                quantity: this.monetateConstants.DEFAULT_VALUES.ONE,
                currency: this.currency,
                isAncillary: true
            };
            if (monetateProduct.productId !== '') {
                monetateProductCollection.push(monetateProduct);
            }
        }
        return monetateProductCollection;
    };

    getFlexibilityFromBasket = (flexibilization?: CommonsMonetateModels.FlexibilizationModel): CommonsMonetateModels.CartProductDetails[] => {
        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [],
            flexSelected: CommonsMonetateModels.FlexibilizationModel = flexibilization ? flexibilization : this.localStorageService.get('selectedFlex'),
            flexibilityId = {
                FLIGHT_CHANGE: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.FLEXIBILIZATION.CAMBIO,
                VOUCHER_REFUND: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.FLEXIBILIZATION.REEMBOLSO,
                FLEXIBILITY_PACK : this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.FLEXIBILIZATION.PACK

            };
        if (flexSelected) {

            let calcUnitPrice = flexSelected.total/flexSelected.passengerPrices.length;

            const monetateProduct: CommonsMonetateModels.CartProductDetails = {
                productId: flexibilityId[flexSelected.subtype] || '',
                quantity: flexSelected.passengerPrices.length.toString(),
                unitPrice: calcUnitPrice.toString(),
                currency: this.currency,
                isAncillary: true
            };
            if (monetateProduct.productId !== '') {
                monetateProductCollection.push(monetateProduct);
            }
        }
        return monetateProductCollection;
    };


    getPriorityFromBasket = (priorityCollection: CommonsSummaryInfoModels.Priority): CommonsMonetateModels.CartProductDetails[] => {

        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [];

        let monetateProduct: CommonsMonetateModels.CartProductDetails;

        if(priorityCollection){

            let totalQuantity:number = 0;
            let totalPrice:number = 0;

            priorityCollection.segments.forEach(passenger => {

                totalQuantity +=  passenger.quanty;

                totalPrice += passenger.amount;

            });

            let mean = Number(totalPrice)/Number(totalQuantity);

            monetateProduct = {
                productId: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.PRIORIDAD || '',
                quantity: totalQuantity.toString(),
                unitPrice: mean.toString(),
                currency: this.currency,
                isAncillary: true
            };
            monetateProductCollection.push(monetateProduct);

            return monetateProductCollection;
        }
    };


    getSpeqBaggageFromBasket = (speqBaggageCollection: CommonsSummaryInfoModels.Baggages): CommonsMonetateModels.CartProductDetails[] => {

        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [];

        let monetateProduct: CommonsMonetateModels.CartProductDetails;

        if (speqBaggageCollection && speqBaggageCollection.segments && speqBaggageCollection.segments.length > 0) {

            const speqObj: { type: string, totalQuantity: number, totalPrice: number }[] = [];

            speqBaggageCollection.segments.forEach(segment => {

                segment.speqs.forEach(speq => {

                    if(speqObj.some(e => e.type === speq.type)){

                        speqObj.find(e => e.type === speq.type).totalQuantity += speq.quanty;
                        speqObj.find(e => e.type === speq.type).totalPrice += speq.total;

                    }else{

                        speqObj.push({type : speq.type, totalQuantity: speq.quanty, totalPrice : speq.total});
                    }
                });
            });
            speqObj.forEach( (element) => {
                if(element.totalQuantity > 0){
                    monetateProduct = {
                        productId: this.getSpecialBaggageType(element.type),
                        unitPrice: this.calculateMean(element.totalPrice, element.totalQuantity).toString(),
                        quantity: element.totalQuantity.toString(),
                        currency: this.currency,
                        isAncillary: true
                    };
                    monetateProductCollection.push(monetateProduct);
                }
            });
        }
        return monetateProductCollection;
    };

    getMonetateSeatId = (type: string): string => {
        const defaultId = this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.SEAT.NORMAL,
            seatId = {
                UPFRONT: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.SEAT.DELANTERO,
                EMERGENCY_EXIT: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.SEAT.SALIDA_EMERGENCIA,
                EXTRA_SIZE: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.SEAT.XL,
                PASSENGER_WITH_INFANT: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.SEAT.BEBE,
                RESTRICTED_MOBILITY: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.SEAT.MOVILIDAD_REDUCIDA,
                PROMO: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.SEAT.PROMO
            };
        return seatId[type] || defaultId;
    };

    getMonetateInsuranceId = (type: string): string => {
        const defaultId = '',
            insuranceId = {
                IBAESTPR025: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.INSURANCE.SEGURO_ANULACION,
                IBAESCOM025EUT: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.INSURANCE.SEGURO_ASISTENCIA,
                IBAESCOM025EST: this.monetateConstants.CATALOG_PRODUCTS_ID.ANCILLARIES.INSURANCE.SEGURO_ASISTENCIA
            };
        return insuranceId[type] || defaultId;
    };

    /*transformPassengersInMonetateProductModel = (flightPassengersInfo: CommonsMonetateModels.FlightPassengersInfo): CommonsMonetateModels.CartProductDetails[] => {
        const monetatePropertyCollection = [
                BookingAppConstants.passengerTypes.child.toLowerCase(),
                BookingAppConstants.passengerTypes.infant.toLowerCase(),
                BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.name,
                BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.subname
            ],
            monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [],
            propertyCollection = [];
        for (const prop in flightPassengersInfo) {
            propertyCollection.push({id: prop, value: flightPassengersInfo[prop]});
        }

        const commonsProperties = propertyCollection.filter((prop) => monetatePropertyCollection.indexOf(prop.id) >- 1);
        commonsProperties.forEach(item => {
            if (item && item.value) {
                const monetateProduct: CommonsMonetateModels.CartProductDetails = {
                    productId: this.getFlightPassengerTypeId(item),
                    quantity: this.monetateConstants.DEFAULT_VALUES.ONE,
                    unitPrice: this.monetateConstants.DEFAULT_VALUES.ZERO
                };
                if (monetateProduct.productId !== '') {
                    monetateProductCollection.push(monetateProduct);
                }
            }
        });
        return monetateProductCollection;
    };*/

    /*getFlightPassengerTypeId = (item: { id: string, value: string }): string => {
        let returnedItemId = '';
        switch(item.id) {
                case BookingAppConstants.passengerTypes.child.toLowerCase():
                    returnedItemId = this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_PASSENGERS.MENOR;
                    break;
                case BookingAppConstants.passengerTypes.infant.toLowerCase():
                    returnedItemId = this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_PASSENGERS.BEBE;
                    break;
                case BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.name:
                    returnedItemId = item.value === BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.items[1].value ? this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_PASSENGERS.RESIDENTE_CANARIAS : item.id = this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_PASSENGERS.RESIDENTE_BALEARES;
                    break;
                case BookingAppConstants.DISCOUNT_SEARCH_RESIDENT.subname:
                    returnedItemId = item.value === BookingAppConstants.DISCOUNT_SEARCH_FAMILY.items[1].value ? item.id = this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_PASSENGERS.FAM_NUMEROSA_GENERAL : item.id = this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_PASSENGERS.FAM_NUMEROSA_ESPECIAL;
                    break;
        }
        return returnedItemId;
    };*/

    transformCabinInMonetateProductModel = (selectedTripInfo: CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo[], preferredCabin: string): CommonsMonetateModels.CartProductDetails[] => {
        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [];
        selectedTripInfo.forEach(trip => {
            const cabinTypeCollection = {
                    E: this.monetateConstants.CATALOG_PRODUCTS_ID.CABIN_TYPE.TURISTA,
                    N: this.monetateConstants.CATALOG_PRODUCTS_ID.CABIN_TYPE.PREMIUM,
                    B: this.monetateConstants.CATALOG_PRODUCTS_ID.CABIN_TYPE.BUSINESS
                },
                monetateProduct: CommonsMonetateModels.CartProductDetails = {
                    productId: cabinTypeCollection[trip.cabinType],
                    quantity: this.monetateConstants.DEFAULT_VALUES.ONE,
                    unitPrice: this.monetateConstants.DEFAULT_VALUES.ZERO,
                    isAncillary: false
                };
            monetateProductCollection.push(monetateProduct);
        });
        const fareTypeCollection = {
                R: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.GENERICAS.MAS_ECONOMICA,
                N: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.GENERICAS.FLEXIBLES,
                B: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.GENERICAS.CABINAS_PREMIUM
            },
            anotherMonetateProduct: CommonsMonetateModels.CartProductDetails = {
                productId: fareTypeCollection[preferredCabin],
                quantity: this.monetateConstants.DEFAULT_VALUES.ONE,
                unitPrice: this.monetateConstants.DEFAULT_VALUES.ZERO,
                isAncillary: false
            };
        monetateProductCollection.push(anotherMonetateProduct);
        return monetateProductCollection;
    };

    transformFareDataInProductModel = (fareFamilyInfo: CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo[]): CommonsMonetateModels.CartProductDetails[] => {
        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [];
        fareFamilyInfo.forEach(fare => {
            const monetateProduct: CommonsMonetateModels.CartProductDetails = {
                productId: this.getFareId(fare.commercialNameES),
                quantity: this.monetateConstants.DEFAULT_VALUES.ONE,
                unitPrice: this.monetateConstants.DEFAULT_VALUES.ZERO,
                isAncillary: false
            };
            if (monetateProduct.productId !== '') {
                monetateProductCollection.push(monetateProduct);
            }
        });
        return monetateProductCollection;
    };

    getFareId = (commercialNameES: string): string => {
        const fareId = { // falta basica plus
            basica: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.TURISTA.BASICA,
            optima: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.TURISTA.OPTIMA,
            confort: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.TURISTA.CONFORT,
            flexible: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.TURISTA.FLEXIBLE,
            'optima-flex': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.TURISTA.OPTIMA_FLEX,
            'turista-premium-promocional': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.PREMIUM.PROMO,
            'turista-premium-flexible': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.PREMIUM.FLEX,
            'turista-premium-promocional-flex': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.PREMIUM.OPTIMA_FLEX,
            'business-promocional': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.BUSINESS.PROMO,
            'business-flexible': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.BUSINESS.FLEX,
            'business-optima': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.BUSINESS.OPTIMA,
            'business-optima-flex': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.BUSINESS.OPTIMA_FLEX,
            'business-promocional-flex': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.BUSINESS.PROM_FLEX,
            'premium-optima': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.PREMIUM.OPTIMA,
            'premium-promocional-flex': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_FARE.PREMIUM.PROM_FLEX
        };

        return fareId[this.$filter('EliminateAccentFilter')(commercialNameES)] || '';
    };

    transformDestinationAreasCitiesListInProductModel = (destinationAreasCitiesList: CommonsDestinationAreaCitiesModel.DestinationAreaCitiesListModel[], destinationCountryCollection: CommonsMonetateModels.OriginDestinationInfo[]): CommonsMonetateModels.CartProductDetails[] => {
        const monetateProductCollection: CommonsMonetateModels.CartProductDetails[] = [];
        const continentCollection: string[] = [];

        destinationCountryCollection.forEach(country => {
            destinationAreasCitiesList.forEach(area => {
                area.cities.filter(city => {
                    if (city.code === country.destination) {
                        if (area.description === this.monetateConstants.CONTINENTS_AND_COUNTRIES.AMERICA && (city.country.code !== 'US' && city.country.code !== this.monetateConstants.CONTINENTS_AND_COUNTRIES.CANADA)) {
                            area.description = this.monetateConstants.CONTINENTS_AND_COUNTRIES.LATAM;
                        }
                        continentCollection.push(area.description);
                    }
                    return ''; //avoid lint error
                });
            });
        });
        continentCollection.forEach(continent => {
            const monetateProduct: CommonsMonetateModels.CartProductDetails = {
                productId: this.getFlightDestinationId(continent),
                quantity: this.monetateConstants.DEFAULT_VALUES.ONE,
                unitPrice: this.monetateConstants.DEFAULT_VALUES.ZERO,
                isAncillary: false
            };
            if (monetateProduct.productId !== '') {
                monetateProductCollection.push(monetateProduct);
            }
        });
        return monetateProductCollection;
    };

    getFlightDestinationId = (continent: string): string => {
        const flightDestinationId = {
            espana: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_DESTINATION.ESPANA,
            europa: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_DESTINATION.EUROPA,
            america: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_DESTINATION.AMERICANORTE,
            latam: this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_DESTINATION.LATAM,
            'africa-y-oriente-medio': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_DESTINATION.AFRICA,
            'asia-y-oceania': this.monetateConstants.CATALOG_PRODUCTS_ID.FLIGHT_DESTINATION.ASIA
        };
        return flightDestinationId[this.$filter('EliminateAccentFilter')(continent)] || '';
    };

    transformPurchasedInfoInProductModel = (confirmationInfo: CommonsConfirmationInfoModel.ConfirmationInfo): CommonsMonetateModels.PurchaseProduct[] => {
        this.currency = this.localStorageService.get<any>('fareData')?.contextMetadata?.currencies[0]?.code || 'EUR';
        const monetateProductCollection: CommonsMonetateModels.PurchaseProduct[] = [],
            purchasedProductCollection: CommonsMonetateModels.CartProductDetails[] = this.compareCartProductsWithPurchasedProducts(confirmationInfo.summaryInfo.ancillaries);
        if (purchasedProductCollection && purchasedProductCollection.length > 0) {
            purchasedProductCollection.forEach(product => {
                const monetatePurchasedProduct: CommonsMonetateModels.PurchaseProduct = {
                    purchaseId: confirmationInfo.pnr,
                    productId: product.productId,
                    quantity: product.quantity,
                    unitPrice: '0', //set price to 0 because the booking flight will include it
                    currency: this.currency
                };
                monetateProductCollection.push(monetatePurchasedProduct);
            });
        }
        return monetateProductCollection;
    };

    transformOriginDestinationInfoIntoTripType = (originDestinationInfo: CommonsMonetateModels.OriginDestinationInfo[]): CommonsMonetateModels.CartProductDetails[] => {
        const monetateProductId = this.getTripTypeId(originDestinationInfo),
            monetateProduct: CommonsMonetateModels.CartProductDetails = {
                productId: monetateProductId,
                quantity: this.monetateConstants.DEFAULT_VALUES.ONE,
                unitPrice: this.monetateConstants.DEFAULT_VALUES.ZERO,
                isAncillary: false
            };
        return monetateProduct.productId !== '' ? [monetateProduct] : [];
    };

    getTripTypeId = (originDestination: CommonsMonetateModels.OriginDestinationInfo[]): string => {
        let tripTypeId = '';
        const summerMonths = ['6', '7', '8'],
            winterMonths = ['12', '1', '2'],
            origin: any = new Date(originDestination[0].date),
            destination: any = new Date(originDestination[1].date),
            originDay: number = origin.getDay(),
            destinationDay: number = destination.getDay(),
            destinationMonth = destination.getMonth() + 1,
            diffTime = Math.abs(destination - origin),
            diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (summerMonths.indexOf(destinationMonth.toString()) !== -1 && diffDays >= 5) {
            tripTypeId = this.monetateConstants.CATALOG_PRODUCTS_ID.TRIP_TYPE.VACACIONES_VERANO;
        } else if (winterMonths.indexOf(destinationMonth.toString()) !== -1 && diffDays >= 5) {
            tripTypeId = this.monetateConstants.CATALOG_PRODUCTS_ID.TRIP_TYPE.VACACIONES_INVIERNO;
        }  else if ((originDay === 5 || originDay === 6) && (destinationDay === 6 || destinationDay === 0 )) {
            tripTypeId = this.monetateConstants.CATALOG_PRODUCTS_ID.TRIP_TYPE.VACACIONES_FIN_DE_SEMANA;
        } else if (diffDays <= 2) {
            tripTypeId = this.monetateConstants.CATALOG_PRODUCTS_ID.TRIP_TYPE.VACACIONES_NEGOCIO;
        }
        return tripTypeId;
    };

    compareCartProductsWithPurchasedProducts = (ancillaries: CommonsConfirmationInfoModel.Ancillaries): CommonsMonetateModels.CartProductDetails[] => {
        const addedToCartProductCollection: CommonsMonetateModels.CartProductDetails[] = this.localStorageService.get('addedCartProducts'),
            purchasedProductCollection = this.transformAncillariesInMonetateProductModel(ancillaries);

        let purchasedProductsTransformed: CommonsMonetateModels.CartProductDetails[] = [];

        if (addedToCartProductCollection && addedToCartProductCollection.length > 0) {
            const notAncillariesProducts = addedToCartProductCollection.filter(product => !product.isAncillary);
            purchasedProductsTransformed = purchasedProductsTransformed.concat(notAncillariesProducts).concat(purchasedProductCollection);
        }
        return purchasedProductsTransformed;
    };
        /**
     * Create array/object to call addFlightReview Monetate API method
     *
     * @param {*} data booking Url parameters data
     * @param {*} passengers data about passengers and total passengers
     * @param selectedSlices
     * @param currency
     * @param fareFamily
     * @returns List of needed data to call Monetate method
     */
    createFlightReviewMonetate = (data, passengers, selectedSlices, currency, fareFamily) => {
        const flightReview: (string | number | object)[] = ['addFlightReview'];
        const cabinTypes = new Set <string> ();
        const ids: string[] = [];
        const flightsCount = 1;
        const infoObject: CommonsMonetateModels.DatalayerInfoObject = {
            depDate: [this.dateFormatted(data.originDestinations[0].date)],
            destination: [data.originDestinations[0].destination],
            origin: [data.originDestinations[0].origin],
            travelers: [passengers.passengers]
        };
        let onHoldOptions: CommonsUtilsModels.OnHoldOptions[];
        const fareData = this.localStorageService.get<CommonsUtilsModels.FareDataModel>('fareData');
        if (fareData && fareData.offers && fareData.offers.length > 0) {
            fareData.offers.forEach((offer) => {
                if (offer.onHoldOptions && offer.onHoldOptions.length > 0) {
                    onHoldOptions = offer.onHoldOptions;
                }
            });
        }
        selectedSlices.forEach((slice) => {
            slice.forEach((segment)=>{
                if (ids.length < 8) {
                    ids.push(segment.departure.code);
                    ids.push(segment.arrival.code);
                }
            });
        });
        const flightId = ids.join('');
        fareFamily.forEach((fare) => {
            cabinTypes.add(this.getCabinDescriptionbyType(fare.cabinType));
        });
        const adults = ((passengers?.numAdults ?? 0) + (passengers?.numYoung ?? 0)) + (passengers?.numTeenager ?? 0);
        if (adults> 0) {
            infoObject.adults = [adults];
        }
        if (passengers?.numChilds > 0) {
            infoObject.minors = [passengers.numChilds ?? 0];
        }
        if (passengers?.numInfant > 0) {
            infoObject.infants = [passengers.numInfant ?? 0];
        }
        if (passengers?.numSeniors > 0) {
            infoObject.seniors = [passengers.numSeniors ?? 0];
        }
        data.originDestinations[1] ? infoObject.retDate = [this.dateFormatted(data.originDestinations[1].date)] : null;
        cabinTypes.size > 0 ? infoObject.serviceClass = [...cabinTypes] : null;

        flightReview.push(infoObject);
        flightReview.push(flightId);
        flightReview.push(flightsCount);
        flightReview.push(currency.price.total);
        this.localStorageService.set('flightIdentifier', flightId);
        currency.price.currency ? flightReview.push(currency.price.currency) : null;

        return flightReview;
    };

    /**
         * Create array/object to call addFlightSearch Monetate API method
         *
         * @param {*} data booking Url parameters data
         * @param {*} passengers data about passengers and total passengers
         * @param {*} availability data of availability results
         * @returns List of needed data to call Monetate method
         */
    createFlightSearchMonetate = (data, passengers, availability): (string | number | object)[] => {
        const flightSearch: (string | number | object)[] = ['addFlightSearch'];
        const cabinTypes = new Set <string> ();
        const infoObject: CommonsMonetateModels.DatalayerInfoObject = {
            depDate: [this.dateFormatted(data.originDestinations[0].date)],
            destination: [data.originDestinations[0].destination],
            origin: [data.originDestinations[0].origin],
            travelers: [passengers.passengers]
        };

        availability.fareFamilyConditions.forEach((fare) => {
            cabinTypes.add(this.getCabinDescriptionbyType(fare.cabinType));
        });

        const adults = ((passengers?.numAdults ?? 0) + (passengers?.numYoung ?? 0)) + (passengers?.numTeenager ?? 0);
        if (adults> 0) {
            infoObject.adults = [adults];
        }
        if (passengers?.numChilds > 0) {
            infoObject.minors = [passengers.numChilds ?? 0];
        }
        if (passengers?.numInfant > 0) {
            infoObject.infants = [passengers.numInfant ?? 0];
        }
        if (passengers?.numSeniors > 0) {
            infoObject.seniors = [passengers.numSeniors ?? 0];
        }
        data.originDestinations[1] ? infoObject.retDate = [this.dateFormatted(data.originDestinations[1].date)] : null;
        cabinTypes.size > 0 ? infoObject.serviceClass = [...cabinTypes] : null;
        flightSearch.push(infoObject);
        return flightSearch;
    };

    /**
     * Create array/object to call addFlightBooking Monetate API method
     *
     * @param {*} data booking Url parameters data
     * @param {*} passengers data about passengers and total passengers
     * @param {*} confirmation data about selected slices and booking
     * @param {*} fareFamilies list of fareFamilyConditions available
     * @returns {Array} List of needed data to call Monetate method
     */
    createFlightBookingMonetate = (data, passengers, confirmation, fareFamilies): (string | number | object)[] => {
        const flightBooking: (string | number | object)[] = ['addFlightBooking'];
        const cabinTypes = new Set <string> ();
        const confirmationDatalayerInfo: CommonsDatalayerServiceTypes.ConfirmationDatalayerLocalStorageInfo = this.localStorageService.get('confirmationDatalayerInfo');
        const flightIdentifier: string = this.localStorageService.get('flightIdentifier');
        const avSelectedOffer: CommonsDatalayerServiceTypes.AvSelectedOfferDatalayerInfo = this.localStorageService.get('avSelectedOffer');
        const infoObject: CommonsMonetateModels.DatalayerInfoObject = {
            destination: [data.originDestinations[0].destination],
            origin: [data.originDestinations[0].origin],
            travelers: [passengers.passengers]
        };
        let onHoldOptions: CommonsUtilsModels.OnHoldOptions[];
        const fareData = this.localStorageService.get<CommonsUtilsModels.FareDataModel>('fareData');
        if (fareData && fareData.offers && fareData.offers.length > 0) {
            fareData.offers.forEach((offer) => {
                if (offer.onHoldOptions && offer.onHoldOptions.length > 0) {
                    onHoldOptions = offer.onHoldOptions;
                }
            });
        }

        data.originDestinations[0] && data.originDestinations[0].date ? angular.extend(infoObject, {
            depDate: [this.dateFormatted(data.originDestinations[0].date)]
        }) : angular.noop;


        fareFamilies.forEach((fare) => {
            cabinTypes.add(this.getCabinDescriptionbyType(fare.cabinType));
        });
        const adults = ((passengers?.numAdults ?? 0) + (passengers?.numYoung ?? 0)) + (passengers?.numTeenager ?? 0);
        if (adults> 0) {
            infoObject.adults = [adults];
        }
        if (passengers?.numChilds > 0) {
            infoObject.minors = [passengers.numChilds ?? 0];
        }
        if (passengers?.numInfant > 0) {
            infoObject.infants = [passengers.numInfant ?? 0];
        }
        if (passengers?.numSeniors > 0) {
            infoObject.seniors = [passengers.numSeniors ?? 0];
        }
        data.originDestinations[1] ? infoObject.retDate = [this.dateFormatted(data.originDestinations[1].date)] : null;
        cabinTypes.size > 0 ? infoObject.serviceClass = [...cabinTypes] : null;


        flightBooking.push(infoObject);
        flightBooking.push(confirmation.pnr);

        if (flightIdentifier) {
            flightBooking.push(flightIdentifier);
        }


        flightBooking.push(1);
        flightBooking.push(confirmation.price.totalPrice);
        if (avSelectedOffer && avSelectedOffer.price && avSelectedOffer.price.currency) {
            flightBooking.push(avSelectedOffer.price.currency);
        } else {
            flightBooking.push(null);
        }

        return flightBooking;
    };

    transformFlightRouteProductDetail = (data: CommonsMonetateModels.OriginDestinationInfo[] = []) : string[]=>{
        return data.map((element: CommonsMonetateModels.OriginDestinationInfo) =>{
            return `${element.origin}${element.destination}-${this.dateFormatted(element.date)}`;
        });
    };
    transformSelectedOfferInProductModel = (selectedSlices = [], offerData) : CommonsMonetateModels.CartProductDetails[]=> {
        const odInfo = offerData?.originDestinations ?? this.localStorageService.get('originDestination')?? [];
        const currency = odInfo?.[0]?.totalPrice.currency??'';
        return selectedSlices.reduce((accu, curr) => accu.concat(curr)).map((segment) => {
            return {
                productId: segment.segmentId ?? segment.id,
                quantity: '1',
                unitPrice: '0',
                currency:  currency ?? ''
            };
        });
    };
    getCabinDescriptionbyType = (cabinType):string =>{
        let cabinDescription = '';
        switch(cabinType){
                case 'E': {
                    cabinDescription = this.monetateConstants.CABIN_DESCRIPTION.ECONOMY;
                    break;
                }
                case 'N': {
                    cabinDescription = this.monetateConstants.CABIN_DESCRIPTION.PREMIUM_ECONOMY;
                    break;
                }
                case 'B': {
                    cabinDescription = this.monetateConstants.CABIN_DESCRIPTION.BUSINESS;
                    break;
                }
        }
        return cabinDescription;
    };
}
