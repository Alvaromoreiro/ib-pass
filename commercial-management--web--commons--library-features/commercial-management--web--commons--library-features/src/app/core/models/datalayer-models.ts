namespace CommonsDatalayerServiceTypes {
    export type CustomerDataDatalayer = {
        category?: string;
        avios?: string | number;
        ibPlusNumber?: string;
        hashEID?: string;
        generalInfo?: GeneralInfoDatalayer;
        email?: string
    };
    export type MemberShipDatalayer = {
        clid?: string;
        tierStatus?:{
            status?: string,
            expirationDate?: string,
        }
    };
    export type ErrorObjectDatalayer = {
        errorCode?: number;
        quadrigam?: string;
        isLogged?: string;
        internalErrorCode?: string;
        message?: string;
        eventCategory?: string;
        eventAction?: string;
        eventLabel?: string;
    };
    export type ModalObjectDatalayer = {
        idModal?: string;
    };
    export type GeneralInfoDatalayer = {
        largeFamilyType?: string;
        resident?: string;
        searchOrigin?: string;
        codeTracking?: string;
        travelAgent?: object;
        adult?: string;
        child?: string;
        infant?: string;
        senior?: string;
        young?: string;
        teenager?: string;
        category?: string;
        avios?: number;
    };
    export type EcommerceInfoDatalayer = {
        largeFamilyType?: string;
        resident?: string;
        searchOrigin?: string;
        codeTracking?: string;
        travelAgent?: object;
        adult?: string;
        child?: string;
        infant?: string;
        senior?: string;
        young?: string;
        teenager?: string;
    };
    export type OriginDestinationMulticityDatalayer = {
        numberPassengrsWithoutInfant: string;
        destinationCity: {
            code: string;
            country: {
                code: string;
            }
            description: string;
        }
        originCity: {
            code: string;
            country: {
                code: string;
            }
            description: string;
        }
        dates: {
            outboundFlight: string;
            formatedOutboundFlight: string;
        }
    };
    export type OriginDestinationDatalayer = {
        originCity: {
            code: string;
            description: string;
            country: {
                code: string;
                description:string;
            }
            timezone?: string;
        },
        destinationCity: {
            code: string;
            description: string;
            country: {
                code: string;
                description:string;
            }
            timezone?: string;
        }
        numberPassengrsWithoutInfant?: string;
        dates: {
            formatedReturnFlight: string;
            formatedOutboundFlight: string;
            outboundFlight: string;
            returnFlight: string;
        },
        numAdults: number;
        numChilds: number;
        numInfant: number;
        numSeniors: number;
        numTeenager: number;
        numYoung: number;
        tripType:string;
    };
    export type PaymentDataDatalayer = {
        paymentInfo: {
            selectedCard: {
                cardTypeCode: string;
            }
        };
        currencyCode: string;
        summaryInfo: {
            passengers: {
                generalData:  Record<string, unknown>
            }
        };
        isOnHoldOrder: boolean;
    };
    export type ConfirmationDatalayerInfo = {
        generalInfo: GeneralInfoDatalayer;
        ecommerce: EcommerceInfoDatalayer
    };
    export type ConfirmationDigitalDataInfo = {
        generalInfo: GeneralInfoDatalayer;
    };
    export type IssueOrderDataDatalayer = {
        paymentMethod: {
            associatedDiscount: {
                type: string;
            };
            type: string;
        };
        order: IssueOrderDataDatalayer;
        orderItems: IssueOrderDataOrderItemsDatalayer[];
        slices: []
    };
    export type IssueOrderDataOrderItemsDatalayer = {
        type: string;
        segmentId: number;
        sliceId: number;
        price: {
            fare: number;
        }
        amount: number;
    };
    export type FareDataDatalayer = {
        offers: Offer[];
    };
    export type Offer = {
        offerItems: OfferItem[];
    };
    export type OfferItem ={
        price: Price;
        passengerIds: string[];
    };
    export type Price = {
        total: number;
    };

    export type GetTransactionDatalayer = {
        id: string;
        affiliation: string;
        revenue: string;
        tax: string;
        shipping: string;
    };
    export type getProduct = ProductDatalayer[];
    export type ProductDatalayer = {
        name: string;
        id: string;
        category: string;
        quantity: number;
        precio: number;
    };
    export type PassengerInfoDatalayer = {
        numberPassengers: number;
        numberPassengrsWithoutInfant: number;
        numChilds: number;
        numInfant: number;
        numAdults: number;
        numSeniors: number;
        numYoung: number;
        numTeenager: number;
    };

    export type PassengerDatalayer = {
        passengerType: string;
        count: number;
    };
    export type ConfDataLayer = {
        antelacionCompra: string;
        claseReserva: string;
        estanciaDestino: string;
        fecha: string;
        horarioVuelo: string;
        moneda: string;
        nombreTarifas: string;
        numeroPax: string;
        operadoraVuelo: string;
        partnerLink: string;
        precioPax: string;
        precioTotal: string;
        precioTotalSinTasas: string;
        tarifaBarata: string;
        tipoPax: string;
        tipoVuelo: string;
        titularIberiaPlus: string;
        trayectoBuscado: string;
        trayectoPais: string;
    };
    export type LoggedDatalayer = {
        loggedBy: string;
    };
    export type AircraftDatalayer = {
        cabins: string[];
        model: string;
    };
    export type PnrDataLayer = {
        provider: string;
        reference: string;
    };
    export type ConfirmationDatalayerLocalStorageInfo = {
        Identifier: string;
    };
    export type AvSelectedOfferDatalayerInfo = {
        price: {
            currency: string;
        }
    };
    export type HeaderModel = {
        headerModel: {
            shoppingBasket: {
                baggages?: {
                    hasBaggage: boolean,
                    segments: BaggagesModel[],
                    total: {
                        total: number
                    }
                },
                seats?: {
                    hasSeats: boolean,
                    segments: AncillarieGenericModel[],
                    total: {
                        total: number
                    }
                },
                insurance?: {
                    hasInsurance: boolean,
                    info: {
                        type: string;
                    },
                    total: {
                        total: number
                    }
                },
                speqs?: {
                    hasSpeqs: boolean,
                    segments: SpeqsModel[],
                    total: {
                        total: number
                    }
                },
                flexibilization: {
                    hasFlexibilization: boolean,
                    info: {
                        amount: {
                            price: number
                        }
                    }
                },
                insuranceAllianzFusionInfo?: {
                    info: {
                        description: string,
                        totalFormatted: string
                    },
                    hasInsuranceAllianzFusion: boolean,
                    total: {
                        total: number,
                        totalFormatted: string
                    }
                },
                globickActivities: {
                    hasActivitiesGlobick: boolean,
                    info: {
                        date: string[],
                        description: string[],
                        totalFormatted: string[],
                        totalFormattedReturn: string
                    } | null
                },
                globickTransfers: {
                    hasTransfersGlobick: boolean
                }
            }
        }
    };
    export type BaggagesModel = {
        baggages: AncillarieGenericModel[]
    };
    export type SpeqsModel = {
        speqs: AncillarieGenericModel[]
    };
    export type AncillarieGenericModel = {
        quanty?: number;
        total: number;
        seats?: seats[]
    };
    export type seats = {
        type: string;
        description: string;
        quanty: number;
        passengers: Passenger[];
        amount: number;
        totalFormatted: string;
        freePassenger: any[];
        totalAmountFreePassenger: string;
        paymentPassenger: Passenger[];
        totalAmountPaymentPassenger: string;
    };
      
    export type Passenger = {
        id: string;
        amount: number;
        amountFormatted: string;
    };
    export type TypeCardDatalayer = {
        cardTypeCode:string;
    };
    export type TypeDigitalDataForFlexFlights = {
        aviosEarned: string;
        changeAcceptance: boolean;
        changeType: string;
        flightStatus:string;
        originalAdvancePurchase: number;
        originalDate: string;
        originalLengthStay: number;
        pnrType: string;
        purchaseDate: Date;
        purchaseType: string;
        slice1OriginalDate: string;
        slice2OriginalDate: string;
        slice3OriginalDate: string;
        slice4OriginalDate: string;
        specialMeal: boolean;
        voucherDiscount: string;
        aviosRedeemed: string;
        passengersInfo: string;
        pricesInfo: string;
        flightType: string;
        rolCip: string;
        currency: string;
        bookingClass: string;
        airportSeg: string;
        reference: string;
    };
}