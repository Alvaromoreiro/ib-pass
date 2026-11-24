namespace createOrderData {
    export type createOrderData = {
        order: Order;
        passengers: Passenger[];
        tickets: any[];
        warnings: any[];
        paymentsInfo: any[];
        contextMetadata: ContextMetadata;
        relatedContent: any[];
        feeInformations: any[];
        errorsWithAdditionalInfo?: any;
        identificator?: any;
        syncHasChangedPassengerName: boolean;
        flowType: string;
        orderFlags: OrderFlag[];
        infoValidationFF: InfoValidationFF;
        syncHasChangedSpecialNeeds: boolean;
        syncHasChangedBaggage: boolean;
        syncHasChangedSeats: boolean;
        context: context;
        currencies: Currencies[];
    };

    export type Currencies = {
        code: string;
    };

    export type context = {
        issueOffice: string;
        passengers: passengers[]
    };
    export type passengers = {
        surname: string;
    };
   
    export type InfoValidationFF = {
        validatedFF: boolean;
        name: string;
        firstSurname: string;
        frequentFlyerInfo?: any;
    };

    export type OrderFlag = {
        type: string;
        enabled: boolean;
    };

    export type ContextMetadata = {
        language: string;
        country: string;
        currencies: Currency[];
    };

    export type Currency = {
        code: string;
        description: string;
        symbol: string;
        alignment: string;
        groupingSeparator: string;
        decimalSeparator: string;
        decimals: number;
        recommendedDisplay: string;
    };

    export type Passenger = {
        passengerType: string;
        personalInfo: PersonalInfo;
        passengerId: string;
        idInfo?: any;
        contactInfo?: any;
        residenceAccreditationStatus?: any;
        documentInfos?: any;
        redressInfo?: any;
        emergencyContactInfo?: any;
        externalPersonalInfo: ExternalPersonalInfo;
        indirectOnBusinessInfo?: any;
        frequentFlyerInfo?: any;
    };

    export type ExternalPersonalInfo = {
        name: string;
        firstSurname: string;
        lastSurname: string;
    };

    export type PersonalInfo = {
        firstName: string;
        firstSurname: string;
        lastSurname: string;
    };

    export type Order = {
        orderId: string;
        bookingReferences: BookingReference[];
        orderItems: OrderItem[];
        slices: Slice[];
        price: Price;
        primaryContactInfo: PrimaryContactInfo;
        timeLimit: string;
        privateFareImformations: any[];
        commissions: any[];
        apisRequired: boolean;
        specialDiscounts: any[];
        extSenderReference?: any;
        bookingOffice: string;
        accountCodes: any[];
        checkedBagAllowances: CheckedBagAllowance[];
        carryOnBaggageAllowances: CarryOnBaggageAllowance[];
        brandedFares?: any;
        voucherCompensation?: any;
        pricingConfig?: any;
        status?: any;
    };

    export type CarryOnBaggageAllowance = {
        baggageAllowanceId: string;
        totalQuantity: number;
        segmentIds: string[];
    };

    export type CheckedBagAllowance = {
        baggageAllowanceId: string;
        totalQuantity: number;
        pieceAllowances: PieceAllowance[];
        segmentIds: string[];
    };

    export type PieceAllowance = {
        totalQuantity: number;
        commercialName: string;
        descriptions?: any;
        type: string;
        subcode?: any;
    };

    export type PrimaryContactInfo = {
        phone: string;
        email: string;
        phoneType: string;
        hashEID: string;
        confirmationMailOption?: any;
    };

    export type Slice = {
        sliceId: string;
        departureDateTime: string;
        arrivalDateTime: string;
        duration: number;
        stopsNumber: number;
        price: Price2;
        detailedPrices: DetailedPrice[];
        segments: Segment[];
        overnight: boolean;
        origin: string;
        destination: string;
        originDestinationKey?: any;
    };

    export type Segment = {
        departure: Departure;
        arrival: Departure;
        flight: Flight;
        cabin: Cabin;
        overnight: boolean;
        id: string;
        duration: number;
        waitingTime: number;
        providerId?: any;
        ticketDesignator: string;
        secureFlightInformed: boolean;
        secureFlight: boolean;
        departureDateTime: string;
        arrivalDateTime: string;
        status?: any;
    };

    export type Cabin = {
        rbd: string;
        bookingCode: string;
        bookingClass: string;
        remainingSeats: number;
        fareFamily: string;
        seatDisplays?: any;
        brandCode?: any;
        cabinDescription: string;
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

    export type DetailedPrice = {
        fare: number;
        currency: string;
        passengerIds: string[];
        segmentPrices: SegmentPrice2[];
    };

    export type SegmentPrice2 = {
        price: Price2;
        fareCode: string;
        segmentsIds: string[];
        ticketDesignator?: any;
        penalties: any[];
        penaltyFlags?: any;
    };

    export type OrderItem = {
        type: string;
        orderItemId: string;
        bookingReferences: BookingReference[];
        price: Price;
        sliceIds: string[];
        passengerPrices: PassengerPrice[];
    };

    export type PassengerPrice = {
        fareCalculation: string;
        passengerId: string;
        price: Price;
        segmentPrices: SegmentPrice[];
        taxes: Tax[];
        passengerDiscount?: any;
    };

    export type Tax = {
        code: string;
        amount: number;
        currency: string;
        description: string;
        subcode?: any;
        country?: any;
        carrier?: any;
    };

    export type SegmentPrice = {
        price: Price2;
        fareCode: string;
        segmentsIds: string[];
        ticketDesignator?: any;
        penalties: Penalty[];
        penaltyFlags?: any;
    };

    export type Penalty = {
        type: string;
        application: string;
        minPrice?: any;
        maxPrice?: any;
        nonrefundable: boolean;
        cancelFeeInd: boolean;
        changeFeeInd: boolean;
        isRefundable: boolean;
        isChangeable: boolean;
    };

    export type Price2 = {
        fare: number;
        currency: string;
    };

    export type Price = {
        fare: number;
        tax: number;
        total: number;
        currency: string;
        ticketingFee: number;
    };

    export type BookingReference = {
        provider: string;
        reference: string;
    };
}