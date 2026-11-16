namespace AvailabilityData {
    export interface CompleteAvailability {
        offers: ImportOrderData.offer[],
        originDestinations: originDestination[],
        passengers: passenger[],
        responseId: string,
        relatedContent: relatedContent[],
        fareFamilyConditions: FareData.FareFamily,
        contextMetaData: contextMetadata
    }

    export interface UncompleteAvailability {
        empty: boolean,
        flightsLength: number,
        modeFlight: string,
        originDestinations: originDestinationsUncomplete[],
    }

    export interface originDestinationsUncomplete {
        destination: string,
        destinationCity: { description: string } | SliceData.Airport,
        origin: string,
        originCity: { description: string } | SliceData.Airport,
        originDestinationId: string,
    }
    export interface price {
        fare: number,
        tax: number,
        total: number,
        currency: string,
        ticketingFee: number
    }

    export interface originDestination {
        priceDiscountApplied: boolean,
        totalPrice: price,
        adultPrice: price,
        perPassengerPrice: price,
        originDestinationId: string
        applicableSlice: any[],
    }

    export interface originDestinationAvailabilityData extends originDestinationsUncomplete{
        originDestinationKey: any,
        slices: originDestinationSlice[],
    }
    export interface slice {
        sliceId: string,
        remainingSeat: number,
        segment: segment[]
    }

    export interface originDestinationSlice {
        arrivalDateTime: string,
        cashAvios: any,
        departureDateTime: string,
        duration: number,
        flightOfTheHouse: boolean,
        overnight: boolean,
        segments: availabilitySegment[],
        sliceId: string,
        stopsNumber: number,
    }

    export interface segment {
        segmentId: string,
        fareFamily: string,
        bookingCode: unknown,
        bookingClass: string,
        rbd: string,
        remainingSeats: number,
        fareBasis: string,
        extendedFareCode: string,
        brandCode: unknown,
        checkedBaggageAllowanceKeys: string[],
        carryOnBaggageAllowanceKeys: string[],
        seatDisplays: unknown,
        cabinDescription: string
    }
    export interface passenger {
        passengerId: string,
        passengerType: string,
        firstName: string,
        surname: string,
        frequentFlyerInfo: string
    }

    export interface relatedContent {
        key: string,
        value: string
    }
    export interface contextMetadata {
        language: string,
        country: string,
        currencies: currency[]
    }
    export interface currency {
        code: string,
        description: string,
        symbol: string,
        aligment: string,
        groupingSeparator: string,
        decimalSeparator: string,
        decimals: number,
        recommendedDisplay: string
    }
    export interface ribbonFlexData {
        flowId: string,
        calendarsRibbon: calendarsRibon[]
    }

    export interface calendarsRibon {
        sliceId: string,
        cells: cell[]
    }
    export interface cell {
        adultPrice: price,
        perPassengerPrice: price,
        totalPrice: price,
        fareFamily: string,
        bestPrice: boolean,
        available: boolean,
        boundDate: string,
        selectedDate: boolean
    }

    export interface modelRibbonFlights {
        flights: { [key: string]: AvailabilityData.IFlight }
    }

    export interface modelRibbonData {
        calendarData: calendarData,
        checked: boolean,
        index?: string,
        initialSlideIndex: number,
    }

    export interface calendarRibbon extends modelRibbonData {
        carouselOptions: any,
        currentSlides: date[],
        initialSlideIndex: number,
        selectedCarousel: number,
    }

    export interface calendarData {
        currentInitialSlide: number,
        currentSlides: date[];
        maxDate: Date,
        minDate: Date,
        selectedSlide: number,
        slides: date[];
    }

    export interface IFlight {
        arrivalCity: SliceData.Airport;
        arrivalCountry: string;
        arrivalDateParsed: dateParsed;
        changeNewDate: Date;
        checked: boolean;
        dateOptions: IDateOptions;
        daysToGo: number;
        departureCity: SliceData.Airport;
        departureCountry: string;
        departureDateParsed: dateParsed;
        durationParsed: string;
        newDateSelected: Date;
        parseNewDate: IParseNewDate;
        parseNewDateSelected: IParseNewDate;
        segments: SegmentData.ISegmentAVModel[];
        stopsNumber: number;
        originalSliceId:string;
        sliceType: unknown;
        /**
         * Propagates to the dateOption object the date update event
         * @param date The date updated
         */
        dateUpdateEvent(date:Date);
        /**
         * Propagates to the dateOption object the checkbox event
         * @param date The date updated(Nullable)
         */
        checkUpdateEvent(date?:Date);
        /**
         * Sets if the flight is outbound or return
         * @param index
         */
        setSliceType(index:number);
    }

    export interface IParseNewDate {
        day: number;
        month: string;
        weekDay: string;
        year: number;
    }
    export interface dateParsed extends IParseNewDate {
        dateTime: string,
        formatedDate: string,
        originalDate: string,
    }

    export interface IDateOptions {
        maxDate: Date;
        minDate: Date;
        maxMode: string;
        showWeeks: boolean;
        dateDisabled:boolean;
        /**
         * Updates the min-max date limits when the checkbox is updated
         * @param selfRole Indicates if this object belong to a deparure or return slice
         * @param date Date to update with this object
         */
        dateCheckUpdateEvent(selfRole:unknown, date?:Date);

        /**
         * Updates the min-max date limits when a date update is triggered
         * @param selfRole Indicates if this object belong to a deparure or return slice
         * @param date Date to update with this object
         */
        dateUpdateEvent(selfRole:unknown, date:Date);

        /**
         * Setter minDate attribute
         */
        setMinDate (date:Date);

        /**
         * Setter maxDate attribute
         */
        setMaxDate (date:Date)
    }

    export interface availabilitySegment {
        arrival: SliceData.Airport,
        arrivalDateTime: string,
        delayInformation: any,
        departure: SliceData.Airport,
        departureDateTime: string,
        duration: number,
        flight: SliceData.Flight;
        overnight: boolean;
        segmentId: string;
        stop: any;
        waitingTimeParsed: number;
        warnings: codeDescr[];
    }

    export interface IModelRibbonSegment {
        arrival: SliceData.Airport;
        arrivalCity: SliceData.Airport;
        arrivalDateParsed: slideDate;
        arrivalDateTimeParsed: string;
        cabin: SliceData.Cabin;
        companyURL: string;
        departure: SliceData.Airport;
        departureCity: SliceData.Airport;
        departureDateParsed: slideDate;
        departureDateTimeParsed: string;
        durationParsed: string;
        fareFamilyConditions: FareData.FareFamily;
        flight: SliceData.Flight;
        flown: boolean;
        overnight: boolean;
        segmentId: string;
        sliceId: string;
        status: codeDescr;
        stop: any;
        waitingTimeParsed: any;
        warnings: codeDescr[];
    }

    export interface codeDescr {
        code: string;
        description: string;
    }

    export interface selectedSlide {
        date: date;
        index: number;
    }

    export interface date{
        date: slideDate,
        serviceDate: string,
        slidePosition: number,
        state: string,
    }

    export interface slideDate extends dateParsed {
        monthNumber: number;
    }

    export interface dataByC {
        allSegments: {[key: string]: AvailabilityData.IModelRibbonSegment},
        flights: { [key: string]: AvailabilityData.IFlight }
    }

    export interface CalculatedPoints {
        Avios:    number;
        Elite:    number;
        resident: boolean;
    }
}
