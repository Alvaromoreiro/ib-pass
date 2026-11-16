namespace IbBannerFlexibility{
    export type selectedSlices = {
        selectedSliceIndex: number;
        selectedSlicesLength: number;
        cabin: string;
        originDestinationId: string;
        origin: string;
        destination: string;
        info: Info;
        articleOffset: number;
        transformOffset: number;
        heightHeadingFlight: number;
        available: boolean;
        originCountry: string;
        destinationCountry: string;
    }& {
        length: number;
    };
  
    export type Info = {
        sliceId: string;
        arrivalDateTime: string;
        departureDateTime: string;
        segments: Segment[];
        duration: number;
        cashAvios: boolean;
        flightOfTheHouse: boolean;
        overnight: boolean;
        providerSliceId?: any;
        stopsNumber: number;
        bestPrice: boolean;
        cabins: Cabins;
        cabinsLength: number;
        showFares: boolean;
        slicePrice: number;
        slicePriceShown: string;
        sliceCurrency: string;
        durationParsed: string;
        departureDateTimeParsed: string;
        departureDateParsed: DepartureDateParsed;
        arrivalDateTimeParsed: string;
        daysOfTravel: number;
        allOperatedBy: string[];
        technicalStop: number;
        sliceURL: string;
        maxSlicePrice: number;
        '$$hashKey': string;
        showedCabin: string;
        selectedCabin: string;
        selectedFareFamily: SelectedFareFamily;
    };
  
    export type SelectedFareFamily = {
        cabinType: string;
        cabinDescription: string;
        commercialCode: string;
        commercialName: string;
        commercialNameES: string;
        priority: number;
        conditions: Condition3[];
        observations: Observation[];
        conditionsPriority: string[];
        isCompatibleFare: boolean;
        farePrice: number;
        fareDiscountPriceToCalculate: number;
        farePriceToCalculate: number;
        farePriceShown: string;
        fareOutTax: number;
        fareDiscountPriceShown?: any;
        fareCurrency: string;
        remainingSeats: number;
        offers: Offer[];
        oBdiscount: boolean;
        includedPriceDiscount: boolean;
        index: number;
    };
  
    export type Condition3 = {
        code: string;
        name: string;
        text: string;
        units?: number;
        extendedInfo: ExtendedInfo3;
        key: number;
        previewStatus: boolean;
    };
  
    export type ExtendedInfo3 = {
        title: string;
        message: string;
        code: string;
        conditionStatus: boolean;
        observationCode?: string;
        mobileMessage: string;
    };
  
    export type Cabins = {
        E: E;
        B: B;
    };
  
    export type B = {
        bestPrice: number;
        bestPriceDiscount?: any;
        expensivePrice: number;
        expensivePriceDiscount: number;
        expensivePriceDiscountShown?: any;
        bestPriceDiscountShown?: any;
        bestPriceShown: string;
        expensivePriceShown: string;
        cabinDescription: string;
        cabinAvailable: boolean;
        isCabinCompatible: boolean;
        fareFamilies: FareFamily2[];
        bestCabinsPrice: boolean;
    };
  
    export type FareFamily2 = {
        cabinType: string;
        cabinDescription: string;
        commercialCode: string;
        commercialName: string;
        commercialNameES: string;
        priority: number;
        conditions: Condition2[];
        observations: any[];
        conditionsPriority: string[];
        isCompatibleFare: boolean;
        farePrice: number;
        fareDiscountPriceToCalculate: number;
        farePriceToCalculate: number;
        farePriceShown: string;
        fareOutTax: number;
        fareDiscountPriceShown?: any;
        fareCurrency: string;
        remainingSeats: number;
        offers: Offer[];
        oBdiscount: boolean;
        includedPriceDiscount: boolean;
    };
  
    export type Condition2 = {
        code: string;
        name: string;
        text: string;
        units?: number;
        extendedInfo: ExtendedInfo2;
        key: number;
        previewStatus: boolean;
    };
  
    export type ExtendedInfo2 = {
        title: string;
        message: string;
        code: string;
        conditionStatus: boolean;
        observationCode?: any;
        mobileMessage: string;
    };
  
    export type E = {
        bestPrice: number;
        bestPriceDiscount?: any;
        expensivePrice: number;
        expensivePriceDiscount: number;
        expensivePriceDiscountShown?: any;
        bestPriceDiscountShown?: any;
        bestPriceShown: string;
        expensivePriceShown: string;
        cabinDescription: string;
        cabinAvailable: boolean;
        isCabinCompatible: boolean;
        fareFamilies: FareFamily[];
        bestCabinsPrice: boolean;
    };
  
    export type FareFamily = {
        cabinType: string;
        cabinDescription: string;
        commercialCode: string;
        commercialName: string;
        commercialNameES: string;
        priority: number;
        conditions: Condition[];
        observations: Observation[];
        conditionsPriority: string[];
        isCompatibleFare: boolean;
        farePrice: number;
        fareDiscountPriceToCalculate: number;
        farePriceToCalculate: number;
        farePriceShown: string;
        fareOutTax: number;
        fareDiscountPriceShown?: any;
        fareCurrency: string;
        remainingSeats: number;
        offers: Offer[];
        oBdiscount: boolean;
        includedPriceDiscount: boolean;
        index?: number;
    };
  
    export type Offer = {
        offerId: string;
        offerItems: OfferItem[];
        originDestinations: OriginDestination[];
        timeLimits: string;
        paymentTimeLimit?: any;
        specialDiscountsApplied: any[];
        providerOfferId: string;
        privateFare: boolean;
        offerType: string;
        flightModificationOnDemand: boolean;
        discountsApplied?: any;
        excludePenalties: boolean;
        price: Price;
    };
  
    export type OriginDestination = {
        priceDiscountApplied: boolean;
        totalPrice: Price;
        adultPrice: Price;
        perPassengerPrice: Price;
        originDestinationId: string;
        applicableSlices: ApplicableSlice[];
    };
  
    export type ApplicableSlice = {
        sliceId: string;
        remainingSeats: number;
        segments: Segment2[];
    };
  
    export type Segment2 = {
        segmentId: string;
        fareFamily: string;
        bookingCode?: any;
        bookingClass: string;
        rbd: string;
        remainingSeats: number;
        fareBasis: string;
        extendedFareCode: string;
        brandCode?: any;
        checkedBaggageAllowanceKeys: any[];
        carryOnBaggageAllowanceKeys: any[];
        ticketDesignator?: any;
        seatDisplays?: any;
        cabinDescription: string;
    };
  
    export type OfferItem = {
        offerItemId: string;
        price: Price;
        passengerIds: string[];
        privateFareInformation?: any;
        reshopDifferential?: any;
        surcharges?: any;
    };
  
    export type Price = {
        fare: number;
        tax: number;
        total: number;
        currency: string;
        ticketingFee: number;
    };
  
    export type Observation = {
        observationCode: number;
        observationText: ObservationText;
    };
  
    interface ObservationText{
    }
  
    export type Condition = {
        code: string;
        name: string;
        text: string;
        units?: number;
        extendedInfo: ExtendedInfo;
        key: number;
        previewStatus: boolean;
    };
  
    export type ExtendedInfo = {
        title: string;
        message: string;
        code: string;
        conditionStatus: boolean;
        observationCode?: (null | string)[];
        mobileMessage: string;
    };
  
    export type Segment = {
        segmentId: string;
        departureDateTime: string;
        arrivalDateTime: string;
        departure: Departure;
        arrival: Departure;
        flight: Flight;
        overnight: boolean;
        waitingTime: number;
        duration: number;
        delayInformation?: any;
        stop?: any;
        durationParsed: string;
        isMoreThan2h: boolean;
        waitingTimeParsed: string;
        departureDateTimeParsed: string;
        departureDateParsed: DepartureDateParsed;
        arrivalDateTimeParsed: string;
        companyURL: string;
        warnings: any[];
        terminalChange: TerminalChange;
        airportChange: TerminalChange;
        scaleWaitingTime: TerminalChange;
        nightFlight: NightFlight;
        '$$hashKey': string;
    };
  
    export type NightFlight = {
        code: string;
        message: string;
        isOverNight: boolean;
    };
  
    export type TerminalChange = {
        isImportant: boolean;
        code: string;
        message: string;
        show: boolean;
    };
  
    export type DepartureDateParsed = {
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
  
    export type Flight = {
        marketingCarrier: MarketingCarrier;
        operationalCarrier: MarketingCarrier;
        marketingFlightNumber: string;
        operationalFlightNumber: string;
        operationalDisclosure: string;
        aircraft: Country;
    };
  
    export type MarketingCarrier = {
        code: string;
        name: string;
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
}
  