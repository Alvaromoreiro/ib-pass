declare namespace CheckinAncillariesModel {
    type AncillaryInfo = {
        subtype: string;
        discount: number;
        percentage: number;
        status: {
            code: string;
        };
        total: number;
        description?: string;
    };
    type FlexibilityModel = {
        info: AncillaryInfo[];
        selectedFlex: AncillaryInfo;
        confirmed: boolean;
    };
    type AviosReq = {
        currency: any;
        flight: any;
        passengers: AviosPassengers[];
    };
    type AviosPassengers = {
        id: string;
        memberIdentifier: string;
        bookingSummary: any;
        flight: any;
        ancillaries: AviosAncillaries[];
    };
    type AviosAncillaries = {
        code: string;
        subCode: string;
        discount?: any;
        slices: AviosAncillariesSlices[];
    };
    type AviosAncillariesSlices = {
        id: string;
        amount?: {
            fare: number;
            quantity: number;
        };
        segments?: Omit<AviosAncillariesSlices, 'segments'>[];
    };
    type Model = {
        ancillariesTrips: object[];
        seatsAvailable: boolean;
        insuranceForm: any;
        baggageAvailable: boolean;
        selectedInsurance: any;
        baggagesQuanty: any;
        seatsQuanty: any;
        currency: CommonsCurrencyModel.CurrencyResponse;
        infoHeader: any;
        isAllowed: boolean;
        isShowedModal: boolean;
        totalPayment: any;
        baggageAvailablePrice: number;
        showInsuranceBox: boolean;
        bobAvailable: boolean;
        bobInfo: any;
        ancillariesCarbonFootprint: any;
        ancillariesTransfersGlobick: any;
        speqsQuanty: number;
        ancillariesAvailable: any;
        ancillariesInsurance: any;
        ancillariesAllianzFusionInsurance: any;
        ancillariesInsuranceAllianzFusion: any;
        insuranceAvailable: any;
        insuranceAllianzFusionAvailable: any;
        ancillariesFlexibilization: any;
        insuranceInfo: any;
        pendingSeats: any;
        passengerBaggagesTrips: any;
        isCurrencyLong: any;
        speqsAvailablePrice: any;
        passengerSpeqsTrips: any;
        showBannerConfort: any;
        ancillariesPreorder: any;
        ancillariesPriorityBoarding: any;
        upgrading: any;
        flags: any;
        newSelectedIndurancePerCountry: any;
        pricesProvider: string;
        infoToShowNewMap: number;
        bundles: any;
    };
    type AviosAncillariesResponse = {
        currency: BookingCabinClass;
        flight: Flight;
        passengers: Passenger[];
        totalMonetaryAmount: TotalMonetaryAmountElement[];
    };
    type AviosAncillariesResponseWithName = {
        currency: BookingCabinClass;
        flight: Flight;
        passengers: PassengerWithName[];
        totalMonetaryAmount: TotalMonetaryAmountElement[];
    };
    type BookingCabinClass = {
        code: string;
    };
    type Flight = {
        discounts: Discount[];
        slices: FlightSlice[];
    };
    type Discount = {
        type: string;
        percentDiscount: number;
        totalDiscount: number;
    };
    type FlightSlice = {
        id: string;
        segments: PurpleSegment[];
    };
    type PurpleSegment = {
        id: string;
        operatingCarrier: BookingCabinClass;
        marketingCarrier: BookingCabinClass;
        ticketingCarrier: BookingCabinClass;
        schedule: Schedule;
        bookingClass: BookingCabinClass;
        bookingCabin: BookingCabinClass;
    };
    type Schedule = {
        departureAirportCode: string;
        arrivalAirportCode: string;
        departureDate: string;
    };
    type Passenger = {
        id: string;
        memberIdentifier: string;
        bookingSummary: BookingSummary;
        ancillaries: Ancillary[];
    };
    type PassengerWithName = {
        id: string;
        name: string;
        surname: string;
        memberIdentifier: string;
        bookingSummary: BookingSummary;
        ancillaries: SimpleAncillary[];
    };
    type Ancillary = {
        type: string;
        subType?: string;
        slices: AncillarySlice[];
        monetaryAmount: MonetaryAmount[];
    };
    type SimpleAncillary = {
        title: string;
        aviosAmount: string | number;
        pointsAmount: string | number;
    };
    type MonetaryAmount = {
        amount: number;
        breakDownType: string;
        currency: MonetaryAmountCurrency;
    };
    type MonetaryAmountCurrency = {
        currencyCode: string;
    };
    type AncillarySlice = {
        id: string;
        amounts: Amount[];
        segments: FluffySegment[];
        monetaryAmount: TotalMonetaryAmountElement[];
    };
    type Amount = {
        fare: string;
        quantity: string;
    };
    type TotalMonetaryAmountElement = {
        amount: string;
        breakDownType: string;
        currency: MonetaryAmountCurrency;
    };
    type FluffySegment = {
        id: string;
        amounts: Amount[];
    };
    type BookingSummary = {
        bookingDate: string;
        ticketIssuanceDate: string;
    };
}
