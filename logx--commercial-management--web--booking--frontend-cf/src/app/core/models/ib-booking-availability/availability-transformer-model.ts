namespace AvailabilityTransformerModel {

    export type Price = {
        fare: number;
        tax?: number;
        total?: number;
        currency: string;
        ticketingFee?: number;
    };

    export type OfferItem = {
        offerItemId: string;
        price: Price;
        passengerIds: string[];
        privateFareInformation?: any;
        originCurrencyPrice?: Price,
        detailedTaxes?: Tax[];
    };

    export type TotalPrice = {
        fare: number;
        tax: number;
        total: number;
        currency: string;
        ticketingFee: number;
    };

    export type AdultPrice = {
        fare: number;
        tax: number;
        total: number;
        currency: string;
        ticketingFee: number;
    };

    export type PerPassengerPrice = {
        fare: number;
        tax: number;
        total: number;
        currency: string;
        ticketingFee: number;
    };

    export type AplicableSlicesSegment = {
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
        seatDisplays?: any;
        cabinDescription: string;
    };

    export type ApplicableSlice = {
        sliceId: number;
        remainingSeats: number;
        segments: AplicableSlicesSegment[];
    };

    export type OfferOriginDestination = {
        priceDiscountApplied: boolean;
        adultPriceDiscountData: {
            totalOriginal: number;
        };
        totalPrice: TotalPrice;
        adultPrice: AdultPrice;
        perPassengerPrice: PerPassengerPrice;
        originDestinationId: string;
        applicableSlices: ApplicableSlice[];
    };

    export type Offer = {
        offerId: string;
        offerItems: OfferItem[];
        originDestinations: OfferOriginDestination[];
        timeLimits: Date;
        paymentTimeLimit?: any;
        specialDiscountsApplied: any[];
        providerOfferId: string;
        privateFare: boolean;
        offerType: string;
        flightModificationOnDemand: boolean;
        discountsApplied?: any;
        excludePenalties: boolean;
        price: Price;
        slices?: Slice[];
        flightRatio?: string;
    };

    export type Country = {
        code: string;
        description: string;
    };


    export type OriginCity = {
        code: string;
        description: string;
        countryCode: string;
        country: Country;
        timezone?: string;
    };

    export type DestinationCity = {
        code: string;
        description: string;
        countryCode: string;
        country: Country;
        timezone?: string;
    };

    export type City = {
        code: string;
        description: string;
        countryCode: string;
        country: Country;
    };

    export type Departure = {
        code: string;
        name: string;
        terminal: string;
        city: City;
    };

    export type Arrival = {
        code: string;
        name: string;
        terminal: string;
        city: City;
    };

    export type MarketingCarrier = {
        code: string;
        name: string;
    };

    export type OperationalCarrier = {
        code: string;
        name: string;
    };

    export type Aircraft = {
        code: string;
        description: string;
    };

    export type Flight = {
        marketingCarrier: MarketingCarrier;
        operationalCarrier: OperationalCarrier;
        marketingFlightNumber: string;
        operationalFlightNumber?: any;
        operationalDisclosure: string;
        aircraft: Aircraft;
    };

    export type SliceSegment = {
        segmentId?: string;
        id?: string;
        providerId?: string;
        departureDateTime: string;
        arrivalDateTime: string;
        departure: Departure;
        arrival: Arrival;
        flight: Flight;
        overnight: boolean;
        waitingTime: number;
        duration: number;
        delayInformation?: DelayInformation;
        stop?: StopInformation;
        durationParsed?: string;
        isMoreThan2h?: boolean;
        waitingTimeParsed?: string;
        departureDateTimeParsed?: string;
        departureDateParsed?: DateParsed;
        arrivalDateParsed?: DateParsed;
        arrivalDateTimeParsed?: string;
        companyURL?: string;
        companyURLMin?: string;
        warnings?: DefaultInfoWarning[];
        cabin?: CabinsMetaSearch;
        ticketDesignator?: string;
        accrualQuote?: string;
        secureFlightInformed?: boolean;
        secureFlight?: boolean;
        scaleWaitingTime: ScaleTimeInfoWarningMessage;
        terminalChange: TerminalInfoWarningMessage;
        airportChange: AirportInfoWarningMessage;
        nightFlight: OverNightInfoWarningMessage;
    };
    export type CabinsMetaSearch = {
        remainingSeats: number;
        fareFamily: string;
        rbd: string;
        bookingCode: string;
        bookingClass: string;
        fareBasis: string;
        seatDisplays: string;
        extendedFareCode: string;
        ticketDesignator: string
        brandCode: string,
        cabinDescription: string;
    };

    export type DelayInformation = {
        companyCode?: string;
        flightNumber?: string;
        lastLoad?: string;
        percent30?: number;
        percent60?: number;
        percentCancelled: boolean;
        code?: string;
        timeInformation?: string;
        delayed30?: number;
        delayed60?: number;
    };

    export type DelayInformationResponse = {
        code: string;
        timeInformation: string;
        delayed30: number;
        delayed60: number;
        percentCancelled: boolean;
    };

    export type Slice = {
        sliceURLMin?: string;
        sliceId: number;
        arrivalDateTime: string;
        departureDateTime: string;
        segments: SliceSegment[];
        duration: number;
        cashAvios: boolean;
        flightOfTheHouse?: boolean;
        overnight: boolean;
        stopsNumber: number;
        bestPrice?: boolean;
        cabins?: CabinsByFareFamilies;
        cabinsLength?: number;
        cabinsMobile?:Array<SliceOffersByFareFamiliesSelectedCabins>;
        cabinsMobileLength?: number;
        showFares?: boolean;
        slicePrice?: number;
        slicePriceShown?: string;
        sliceCurrency?: string;
        durationParsed?: string;
        price?: Price;
        departureDateTimeParsed?: string;
        departureDateParsed?: DateParsed;
        arrivalDateParsed?: DateParsed;
        arrivalDateTimeParsed?: string;
        daysOfTravel?: number;
        allOperatedBy?: string[];
        allOperatedByCodes?: string[];
        technicalStop?: number;
        sliceURL?: string;
        maxSlicePrice: number;
        selectedFareFamily?: FareFamilyCondition;
        showedCabin: string;
        selectedCabin?:string;
        detailedPrices?: DetailedPrice[];
        sliceSelectedDiscount?: SliceSelectedDiscount | false;
        sliceSelectedDiscountImage?: string | null;
        slicePromotionImage?: string | null;
        sliceDiscountPriceShown?: string | null;
        sliceDiscountPrice?: number | null;
    };
    export type DateParsed = {
        weekDay: string;
        hour: number;
        minutes: number;
        day: number;
        monthNumber: number;
        month: string;
        year: number;
        formatedDate: string;
    };
    export type SelectedSlice = {
        selectedSliceIndex: number;
        selectedSlicesLength: number;
        cabin: string;
        originDestinationId: string;
        origin: string;
        destination: string;
        info: Slice;
        articleOffset: number;
        transformOffset: number;
        heightHeadingFlight: number;
        available: boolean;
        originCountry: string;
        destinationCountry: string;
    };
    export type OriginDestination = {
        originDestinationId: string;
        origin: string;
        destination: string;
        originCity: OriginCity;
        destinationCity: DestinationCity;
        slices?: Slice[];
        originDestinationKey?: string;
        showOd?: boolean;
        showFaresSelected ?:boolean;
        selectedFilters?: FilterOptions[];
        loadingAvailability: boolean;
        currency: string;
        calendarSlides?: SlidesDataResponse;
        isAvailable: boolean;
        filterOptions?: FilterOptions;
        initialFilterOptions?: FilterOptions;
        provider?: string;
    };

    export type Passenger = {
        passengerId: string;
        passengerType: string;
        firstName?: any;
        surname?: any;
        frequentFlyerInfo?: any;
    };

    export type ExtendedInfo = {
        title: string;
        message: string;
        code: string;
        conditionStatus: boolean;
        observationCode: string;
    };

    export type Condition = {
        code: string;
        name: string;
        text: string;
        units?: number;
        extendedInfo: ExtendedInfo;
        key?:number;
        previewStatus?:boolean;
    };

    export type Observation = {
        observationCode: number;
        observationText: string;
    };

    export type FareFamilyCondition = {
        cabinType: string;
        cabinDescription: string;
        commercialCode: string;
        commercialName: string;
        commercialNameES: string;
        priority: number;
        conditions: Condition[];
        observations: Observation[];
        conditionsPriority: string[];
        isCompatibleFare?: boolean;
        farePrice?: number;
        fareDiscountPriceToCalculate?: number;
        farePriceToCalculate?: number;
        farePriceShown?: string;
        fareOutTax?: number;
        fareDiscountPriceShown?: string;
        fareCurrency?: string;
        remainingSeats?: number;
        offers?: Offer[];
        oBdiscount?: boolean;
        includedPriceDiscount?: boolean;
        hasRecommendedOffer?: boolean;
        fareText?: string;
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
        suffixSymbol?: boolean;
        numberDecimals?: number;
        currencySymbol?: string;
    };

    export type ContextMetadata = {
        language: string;
        country: string;
        currencies: Currency[];
    };

    export type RelatedContent = {
        key: string;
        value: string;
    };

    export type GetAvailabilityData = {
        offers: Offer[];
        originDestinations: OriginDestination[];
        passengers: Passenger[];
        responseId: string;
        fareFamilyConditions:FareFamilyOptions;
        contextMetadata: ContextMetadata;
        uniqueProductSuproductPairs: any[];
        relatedContent: RelatedContent[];
        specialDiscountsPossibilities?: SpecialDiscountsPossibilities[];
        brandedFares: any[];
        freeBaggageAllowances: any[];
        recommendedOfferId?: string;
        warnings?: Warning[] ;
        tax:number;
        selectedSlices:Slice[];
        flightRatio: string;
        provider?: string;
        referralId?: string;
    };
    
    export type Warning = {
        code: string;
        description: string;
        details: string;
    };
    
    export type SpecialDiscountsPossibilities = {
        discountType: string;
        type: string;
    };
    export type SpecialDiscountsOptionDiscuount = {
        name?: string;
        code?: string;
    };
    export type SpecialDiscounts = {
        value: string;
        type: string;
        option: SpecialDiscountsOptionDiscuount[];
    };
    export type Outbound = {
        destination: string;
        origin: string;
        destinationCity: DestinationCity;
        originCity: OriginCity;
    };

    export type Cell = {
        adultPrice: AdultPrice;
        perPassengerPrice: PerPassengerPrice;
        totalPrice: TotalPrice;
        fareFamily: string;
        bestPrice: boolean;
        available: boolean;
        boundDate: string;
        selectedDate: boolean;
        date: string;
        avios: number;
    };

    export type OutBoundRow = {
        cells: Cell;
    };

    export type CalendarRibbon = {
        inBoundRow?: OutBoundRow;
        outBoundRow: OutBoundRow;
    };

    export type CalendarInfo = {
        contextMetadata: ContextMetadata;
        inbound?: any;
        outbound: Outbound;
        availability: boolean;
        specialDiscountsApplied: any[];
        calendarRibbon: CalendarRibbon;
    };
    export type RequestDataSlice = {
        origin: string;
        destination: string;
        date: string;
    };

    export type AvailabilityRequestData = {
        slices: RequestDataSlice[];
        passengers: Passenger[];
        marketCode: string;
        preferredCabin: string;
    };


    export type DateFormat = {
        long: string;
        medium: string;
        short: string;
    };

    export type Language = {
        dateFormat: DateFormat;
        code: string;
        description: string;
    };

    export type Market = {
        code: string;
        description: string;
    };

    export type MarketFlags = {
        allowedNameCorrection: boolean;
        allowedAncillaries: boolean;
        allowedFlightChange: boolean;
        allowedRefund: boolean;
        allowedCashAndAviosWithVoucher: boolean;
    };

    export type PassengerType = {
        passengerType: string;
        description: string;
    };

    export type CommercialDataCity = {
        code: string;
        description: string;
        countryCode: string;
        countryDescription?: any;
        timezone: string;
        gaCode: number;
        arCode: number;
        saCode: number;
        latitude: number;
        longitude: number;
    };

    export type Discount = {
        code: string;
        description: string;
        countries: string[];
        cities: CommercialDataCity[];
        relatedField: string;
        type: string;
    };

    export type DefaultPaxTypeNumber = {
        passengerType: string;
        number: number;
    };

    export type DefaultPhonePrefix = {
        code: string;
        description: string;
        countryCode: string;
    };

    export type DefaultValues = {
        defaultPaxType: string;
        defaultPaxTypeNumbers: DefaultPaxTypeNumber[];
        maxPaxNumber: number;
        defaultPhonePrefix: DefaultPhonePrefix;
    };

    export type Normal = {
        code: string;
        description: string;
        timezone: string;
        country: Country;
    };

    export type Redemption = {
        code: string;
        description: string;
        timezone: string;
        country: Country;
    };

    export type MainCities = {
        normal: Normal;
        redemption: Redemption;
    };

    export type AvailabilityCommercialData = {
        currency: Currency;
        languages: Language[];
        market: Market;
        marketFlags: MarketFlags;
        sessionTimeLifeInMinutes: number;
        maxSearchTime: number;
        minSearchTime: number;
        passengerTypes: PassengerType[];
        discounts: Discount[];
        defaultValues: DefaultValues;
        roundingPolicy: string;
        availabilityPriceShowPolicy: string;
        mainCities: MainCities;
    };

    export type Currencies = {
        suffixSymbol: boolean;
        decimalSeparator: string;
        numberDecimals: number;
        groupingSeparator: string;
        currencySymbol: string;
        description: string;
    };

    export type CurrenciesObject = {
        EUR?: Currencies;
        USD?: Currencies;
    };

    export type CalendarData = {
        originCalendarData: Cell[];
        minDate: Date;
        maxDate: Date;
        originDestinationIndex: number;
    };

    export type FareDetailedInfo = {
        fareOutTax?: number;
        offers: Offer[],
        bestFarePrice: number,
        farePrice: number,
        fareDiscountPrice:number,
        currency: string,
        remainingSeats: number,
        fareFound: boolean,
        oBdiscount: boolean,
        includedPriceDiscount: boolean,
    };

    export type SliceOffersByFareFamilies = {
        fareFamilies: SliceOffersByFareFamiliesFareFamilies;
        cabins: CabinsByFareFamilies;
        cabinsLength: number;
        cabinsMobile:Array<SliceOffersByFareFamiliesSelectedCabins>,
        cabinsMobileLength: number;

    };

    export type SliceOffersByFareFamiliesFareFamilies = {
        fareFamilies: FareFamilyOptions;
        slicePrice: number;
        sliceCurrency: string;
        slicePriceWithoutDiscount?: number;
    };
    export type PricesByCabin = {
        B?: number;
        E?: number;
        T?: number;
    };

    export type FareFamilyOptions = {
        AJBBF?: FareFamilyCondition;
        AJBBP?: FareFamilyCondition;
        AJBNB?: FareFamilyCondition;
        AJBOPT?: FareFamilyCondition;
        AJBTPF?: FareFamilyCondition;
        AJBTPP?: FareFamilyCondition;
        COAJB?: FareFamilyCondition;
        SPJAJB?: FareFamilyCondition;
        SPWAJB?: FareFamilyCondition;
    };
    export type SliceOffersByFareFamiliesSelectedCabins = {
        bestPriceDiscountShown?: string;
        expensivePriceDiscountShown?: string;
        bestCabinsPrice?: boolean;
        bestPriceShown?: string;
        expensivePriceShown?: string;
        cabinDescription?: string;
        cabinAvailable?: boolean;
        isCabinCompatible?: boolean;
        fareFamilies?: FareFamilyCondition[];
        bestPrice?: number;
        expensivePrice?: number;
        bestPriceDiscount?: number;
        expensivePriceDiscount?: number;
        type?:string;
        cabinStyleClass?: string,
        collapsed?: boolean,
        cabinMobileStyleClass?: string
    };
    export type CabinsByFareFamilies = {
        E?: SliceOffersByFareFamiliesSelectedCabins;
        N?: SliceOffersByFareFamiliesSelectedCabins;
        B?: SliceOffersByFareFamiliesSelectedCabins;
        T?: SliceOffersByFareFamiliesSelectedCabins;
        anyCabin?: SliceOffersByFareFamiliesSelectedCabins;
    };
    export type StopInformation = {
        city: City;
        durationParsed: string;
        duration: string;
    };
    export type GenerateInfoCabinResponse = {
        cabin: CabinsByFareFamilies;
        cabinTypeAssigned: string;
    };
    export type DefaultInfoWarningMessage = {
        isImportant: boolean;
        code: string;
        message: string;
        show: boolean;
    };

    export type AirportInfoWarningMessage = {
        isImportant: boolean;
        code: string;
        message: string;
        show: boolean;
        arrival?: string;
        departure?: string;
    };

    export type TerminalInfoWarningMessage = {
        isImportant: boolean;
        code: string;
        message: string;
        show: boolean;
        arrival?: string;
        departure?: string;
        hasTerminal?: string;
    };

    export type OverNightInfoWarningMessage = {
        isOverNight: boolean;
        code: string;
        message: string;
    };

    export type ScaleTimeInfoWarningMessage = {
        isImportant: boolean;
        code: string;
        message: string;
        show: boolean;
        isLong?: boolean;
    };

    export type DefaultInfoWarning = {
        code: string;
        description: string;
    };

    export type ReturnedWarnings = {
        terminalChange: TerminalInfoWarningMessage;
        airportChange: AirportInfoWarningMessage;
        scaleWaitingTime: ScaleTimeInfoWarningMessage;
        nightFlight: OverNightInfoWarningMessage;
    };

    export type CabinsInfo = {
        cabinType: string;
        cabinDescription: string;
    };

    export type FilterOptions = {
        cabinType: CabinsByFareFamilies;
        price: PriceFilterOptions;
        cabin: SliceOffersByFareFamiliesSelectedCabins;
        pricesByCabin: CabinPricebyFilterOption;
        departureHours: HourFilterFilterOptions;
        arrivalHours: HourFilterFilterOptions;
        stopsNumber1: StopsNumberFilterOptions;
        stopsNumber2: StopsNumberFilterOptions;
        stopsNumber3: StopsNumberFilterOptions;
        avios: boolean;
    };

    export type PriceFilterOptions = {
        minValue: number,
        maxValue: number,
        options: OptionPriceFilterOptions
    };

    export type OptionPriceFilterOptions = {
        hideLimitLabels: boolean;
        enforceStep: boolean;
        floor: number;
        ceil: number;
        step: number;
        translate: (value:string)=>string;
    };

    export type StopsNumberFilterOptions = {
        enable: boolean;
    };

    export type HourFilterFilterOptions = {
        minValue: number,
        maxValue: number,
        options: OptionsHourFilterOptions;
    };

    export type OptionsHourFilterOptions = {
        hideLimitLabels: boolean;
        floor: number;
        ceil: number;
        step: number;
        translate: (value:number)=>string;
    };

    export type CabinPricebyFilterOption = {
        B?: PriceByCabinFilterOptions;
        E?: PriceByCabinFilterOptions;
        T?: PriceByCabinFilterOptions;
    };
    export type PriceByCabinFilterOptions = {
        minValue: string;
        maxValue: string;
        options: OptionsPriceByCabinFilterOptions;
    };

    export type OptionsPriceByCabinFilterOptions = {
        hideLimitLabels: boolean;
        enforceStep: boolean;
        floor: number;
        ceil: number;
        step: number;
        translate: (value:string)=>string;
    };

    export type SliceInfoOFCells = {
        date: string;
        serviceDate: string;
        price: number;
        state: string;
    };

    export type GenerateSliceInfo = {
        date: any;
        serviceDate: string;
        price: number;
        formattedPrice?: string;
        state: string;
        slidePosition: number;
        firstItem?: boolean;
        lastItem?: boolean;
    };

    export type MinDateCalendarData= {
        date: string;
        serviceDate: string;
        price: number;
        state: string;
    };

    export type IsInSlidesResponse = {
        slide: GenerateSliceInfo,
        isRequestSlide: boolean
    };

    export type SlidesDataResponse = {
        slides: GenerateSliceInfo[];
        currentInitialSlide: number;
        selectedSlide: number;
        maxDate: Date;
        minDate: Date;
        currentSlides: GenerateSliceInfo[];
        currency?: Currency;
        firstItem?: boolean;
    };

    export type DynamicPrice = {
        E?: number[];
        N?: number[];
        B?: number[];
        T?: number[];
    };
    export type AvailabilityResponse = {
        originDestinations:  OriginDestination[];
        currencies: CurrenciesObject;
        totalPrice: string;
        relatedContent: Record<string, any>;
        fareFamilyConditions: AvailabilityTransformerModel.FareFamilyCondition[] | AvailabilityTransformerModel.FareFamilyOptions;
        multiCity: boolean;
        responseId:string;
        responseIdArray:string[];
        redemption: boolean;
        metaSearchInfo: boolean;
        recommendedOfferId?: string;
        warnings?: Warning[];
        tax?: number;
        selectedSlices?: SelectedSlice[];
        changePassengers: boolean;
        typeSearch?: string;
        flightRatio?: string;
    };
    export type CurrenciesValues = {
        EUR?: CommonsCurrencyModel.CurrencyObject;
        USD?: CommonsCurrencyModel.CurrencyObject;
    };

    export type MetaSearchInfoResponse = {
        originDestination: OriginDestination[];
        slicesInfo: Slice[];
        flightMetaSearch:boolean;
    };

    export type TransformAvailabilityResponse = {
        transformedAvailabilityData: AvailabilityResponse;
        fareFamilyConditions: FareFamilyOptions;
        allAvailableOffers: Offer[];
        originCalendarInfo: Cell[];
        datalayerObject: object; /* INIT DELETE GA4 MIGRATION*/
        specialDiscounts: SpecialDiscounts[];
        digitalDataObject: object;
    };
    export type Tax  = {
        code: string;
        amount: number;
        currency: string;
        description: string;
        subcode: string;
        country: string;
        carrier: string;
    };
    export type DetailedPrice =  {
        fare:          number;
        tax:           number;
        total:         number;
        currency:      string;
        passengerIds:  string[];
        segmentPrices: SegmentPrice[];
        commission:    number;
        ticketingFee:  number;
    };

    export type SegmentPrice =  {
        price:               Price;
        originCurrencyPrice: Price;
        fareCode:            string;
        segmentsIds:         string[];
        ticketDesignator:    number;
        endorsement:         string;
    };

    export type ItineraryRequestData = {
        slices: RequestDataSlice[];
        passengers: ItineraryPassenger[];
        marketCode: string;
        preferredCabin: string;
        maxStopNumber?: number;
        specialDiscounts?: ItineraryRequestDiscounts[];
        closedUserGroup?: ClosedUserGroup;
        partnerDiscount?: string;
    };
    export type ItineraryPassenger = {
        count: number;
        passengerType: string;
    };
    export type ItineraryRequestDiscounts = {
        type: string;
        discountType: string;
    };

    export type ClosedUserGroup = {
        name: string;
    };
    export type SliceSelectedDiscount = {
        corporateCodes: string;
        description: string;
        discountType: string;
        percentDiscount: number;
        totalDiscount: number;
        type: string;
    };

    export type ChangeInfo = {
        title?: string;
        arrivalTitle?: string;
        departureTitle?: string;
        arrival?: string;
        departure?: string;
    };

    export type OffersGeneratorResponse = {
        originDestination: AvailabilityTransformerModel.OriginDestination;
        offers: AvailabilityTransformerModel.Offer[];
        fareFamilyConditions: AvailabilityTransformerModel.FareFamilyOptions;
        currentOffers: AvailabilityTransformerModel.Offer[];
    };

    export type OptionsGeneratorResponse = {
        currencies: AvailabilityTransformerModel.CurrenciesObject;
        calendar?: AvailabilityTransformerModel.CalendarData | null;
        index?: number | null;
    };

}
