namespace datalayerServiceTypes {
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
        tierStatus?: any;
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
                generalData: {}
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
        fare?: number;
        currency?: string;
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
        flightRatio:string;
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
        residentCode?: string;
        familianumerosa?: string;
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
        quanty: number;
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
        lengthStay?: number;
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
        slices: Slices[]
        flightHaul?:string;
        searchCountries:string;
        advancePurchase?:string;
        searchOrigin:string;
        searchOD:string,
        searchDest:string
    };
    export type Slices = {
        sliceId:           string;
        type:              string;
        departureDateTime: string;
        arrivalDateTime:   string;
        duration:          number;
        stopsNumber:       number;
        detailedPrices:    DetailedPrice[];
        segments:          Segment[];
        overnight:         boolean;
        passengerFlags:    PassengerFlag[];
    }

    export type DetailedPrice = {
        fare:          number;
        currency:      string;
        passengerIds:  string[];
        segmentPrices: SegmentPrice[];
    }

    export type SegmentPrice = {
        price:            Price;
        fareCode:         string;
        segmentsIds:      string[];
        ticketDesignator: null;
        penalties:        any[];
        penaltyFlags:     null;
    }


    export type PassengerFlag = {
        passengerId: string;
        flags:       Flag[];
    }

    export type Flag = {
        type:    string;
        enabled: boolean;
    }

    export type Segment = {
        type:                 string;
        mmbAllowed:           boolean;
        ckiStatus:            CkiStatus;
        noShow:               boolean;
        flyNow:               boolean;
        flown:                boolean;
        departure:            Arrival;
        arrival:              Arrival;
        departureCity:        City;
        arrivalCity:          City;
        flight:               Flight;
        cabin:                Cabin;
        overnight:            boolean;
        id:                   string;
        duration:             number;
        waitingTime:          number;
        operatorLocator:      null;
        stop:                 null;
        departureDateTime:    string;
        departureUtcDateTime: Date;
        arrivalDateTime:      string;
        arrivalUtcDateTime:   Date;
        status:               Status;
    }

    export type Arrival = {
        code:     string;
        name:     string;
        terminal: null | string;
        city:     City;
    }

    export type City = {
        code:        string;
        description: string;
        countryCode: string;
        country?:    Status;
        timeZone?:   string;
    }

    export type Status = {
        code:        string;
        description: string;
    }

    export type Cabin = {
        rbd:            string;
        description:    string;
        remainingSeats: number;
        fareFamily:     string;
        code:           string;
        type:           string;
        bookingClass:   string;
    }

    export type CkiStatus = {
        code:    string;
        message: null;
    }

    export type Flight = {
        marketingCarrier:        Carrier;
        operationalCarrier:      Carrier;
        marketingFlightNumber:   string;
        operationalFlightNumber: string;
        operationalDisclosure:   string;
        aircraft:                Status;
    }

    export type Carrier = {
        code: string;
        name: string;
    }
}
