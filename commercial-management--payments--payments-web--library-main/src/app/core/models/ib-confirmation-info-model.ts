namespace ConfirmationTypes {
    export type confirmationInfo = {
        pnr: string;
        locator: string;
        contactEmail: string;
        boardingCards: BoardingCard[];
        endOrderTime?: EndOrderTime;
        referenceCity: string;
        onHoldPayment?: any;
        slices: Slice[];
        relatedContent: RelatedContent;
        warningMessages: any[];
        summaryInfo: SummaryInfo;
        showSuccesfulCardAlert?: any;
        residentInfo: ResidentInfo;
        familyInfo: FamilyInfo;
        bondsInfo: BondsInfo;
        price: Price;
        rentCarInfo: RentCarInfo;
        bookingHotelsInfo: BookingHotelsInfo;
        bobInfo: BobInfo;
    };
    export interface EndOrderTime {
        dateTime:     string;
        weekDay:      string;
        hour:         number;
        minutes:      number;
        day:          number;
        monthNumber:  number;
        month:        string;
        year:         number;
        formatedDate: string;
        hoursLeft:    number;
    }
    

    export type BoardingCard = {
        passengers: passengersData;
    };

    export type passengersData = {
        surname: string;
    };

    export type BobInfo = {
        urlbob: string;
    };

    export type BookingHotelsInfo =  {
        checkInDate: string;
        checkOutDate: string;
        destinationCode: string;
    };

    export type RentCarInfo = {
        cars: Car[];
        pickUpCity: string;
    };

    export type Car = {
        provider: string;
        description: string;
        redirectUrl: string;
        pictureURI?: string;
        priceDay: string;
        priceValue: number;
    };

    export type Price = {
        totalPrice: number;
        formattedTotalPrice: string;
        textTotalPrice: string;
        showTotalPrice: boolean;
    };

    export type BondsInfo = {
        vouchersInfo: any[];
        showExtraInfo: boolean;
        total: RelatedContent;
    };

    export type FamilyInfo = {
        isActive: boolean;
    };

    export type ResidentInfo = {
        isActive: boolean;
        errors: Errors;
        city: string;
        passengers: any[];
    };

    export type Errors = {
        haveSomeError: boolean;
        allHaveError: boolean;
    };

    export type SummaryInfo = {
        trips: Trip[];
        passengers: Passengers;
        orderFees: any[];
        appliedDiscounts: RelatedContent;
        paymentType: string;
        onHoldPayment?: any;
        ancillaries: Ancillaries;
    };

    export type Ancillaries = {
        baggages: Baggages;
        speqs: Baggages;
        seats: Baggages;
        insurance?: any;
        flexibility?: any;
        upgrading?: any;
        upgradingBids?: any;
        currency: Currency;
        total?: any;
        totalFormatted: string;
        discount?: any;
        priority: Priority;
        globick?: any;
        insuranceAllianzInfo?: any;
    };

    export type Priority = {
        segments: any[];
        totalFormatted?: any;
        updated: boolean;
    };

    export type Baggages = {
        segments: any[];
        totalFormatted?: any;
    };

    export type Passengers = {
        personalData: PersonalDatum[];
        generalData: GeneralData;
        totalPassengersFormatted: string;
    };

    export type GeneralData = {
        ADULT: ADULT[];
    };

    export type ADULT = {
        number: number;
        fareCash: number;
        totalTax: number;
        currency: Currency;
        breakdownTaxes: BreakdownTax[];
        parsedFareCash: string;
        parsedTotalTax: string;
    };

    export type BreakdownTax = {
        code: string;
        amount: string;
        currency: string;
        description: string;
        subcode?: any;
        country?: any;
        carrier?: any;
    };

    export type Currency = {
        suffixSymbol: boolean;
        decimalSeparator: string;
        numberDecimals: number;
        groupingSeparator: string;
        currencySymbol: string;
        description: string;
    };

    export type PersonalDatum = {
        name: string;
        surname: string;
        specialNeeds: any[];
    };

    export type Trip = {
        idTrip: string;
        stopsNumber: number;
        fare: Fare[];
        segments: Segment2[];
    };

    export type Segment2 = {
        idSegment: string;
        departure: Departure;
        departureDate: DepartureDate;
        arrival: Departure;
        arrivalDate: DepartureDate;
        flightNumber: string;
        operatedBy: string;
        aircraftType: string;
        duration: string;
        waitingTime: number;
        waitingParsedTime: string;
        cabin: string;
        operationalDisclosure: string;
        marketingCarrier: MarketingCarrier;
    };

    export type Fare = {
        fareDetails: FareDetails;
        name: string;
        cabin: string;
    };

    export type FareDetails = {
        CABINA: CABINA;
        EQMANO: CABINA;
        EQBODEGA: CABINA;
        COMIDA: CABINA;
        ASIENTO: CABINA;
        ASIENTODELANTERO: CABINA;
        ASIENTOXL: CABINA;
        EMBARQUE: CABINA;
        CAMBIO: CABINA;
        REEMBOLSO: CABINA;
        TARJEMBANTIC: CABINA;
        CHECKINDESK: CABINA;
        SALAVIP: CABINA;
        FASTTRACK: CABINA;
        EQPPRIOR: CABINA;
        AVIO: CABINA;
        WIFI: CABINA;
    };

    export type CABINA = {
        name: string;
        message: string;
        text: string;
    };

    interface RelatedContent {
    }

    export type Slice = {
        idTrip: string;
        baggage: Baggage;
        segments: Segment[];
    };

    export type Segment = {
        idSegment: string;
        departure: Departure;
        departureDate: DepartureDate;
        arrival: Departure;
        arrivalDate: DepartureDate;
        flightNumber: string;
        operationalDisclosure: string;
        companyCode: string;
        operatedBy: string;
        cabin: string;
        companyUrl: string;
        seats: string;
        marketingCarrier: MarketingCarrier;
    };

    export type MarketingCarrier = {
        code: string;
        name: string;
    };

    export type DepartureDate = {
        dateTime: string;
        weekDay: string;
        hour: number;
        minutes: number;
        day: number;
        monthNumber: number;
        month: string;
        year: number;
        formatedDate: string;
    };

    export type Departure = {
        code: string;
        name: string;
        terminal: string;
        city: City;
    };

    export type City = {
        code: string;
        description: string;
        countryCode: string;
        country: Country;
    };

    export type Country = {
        code: string;
        description: string;
    };

    export type Baggage = {
        handBaggage: number;
        franchiseBaggage: number;
    };
    export type confirmationDataLayerInfo = {
        idioma: string;
        mercado: string;
        versionWeb: string;
        modeWeb: string;
        paxMovilidadReducida: string;
        OrderId: string;
        tipoTarjeta: string;
        paso: string;
        cashAviosUsado: string;
        bonoUsado: string;
        quadrigam: string;
        codigoSeguimiento: string;
        EstadoUsuario: string;
        elegibleBono: string;
    };
}
